import { Ctx } from "blitz"
import db, { BuildJobType } from "db"
import * as z from "zod"
import { calculateHarvesterCosts, enoughResources } from "../utils/harvesterCalculations"

const BuildHarvester = z.number()

export default async function buildHarvester(
  amount: z.infer<typeof BuildHarvester>,
  { session }: Ctx
) {
  if (session.userId === null) return null
  const userId = session.userId

  const station = await db.station.findFirst({ where: { userId } })
  if (!station) return null

  if (enoughResources(station, amount)) {
    const costs = calculateHarvesterCosts(amount)

    await db.$transaction([
      db.station.update({
        where: { id: station.id },
        data: {
          aluminium: { decrement: costs.aluminium },
          steel: { decrement: costs.steel },
        },
      }),
      db.buildJob.upsert({
        where: {
          userId_timeLeft_type: {
            userId,
            timeLeft: 8,
            type: BuildJobType.HARVESTER,
          },
        },
        update: {
          amount: {
            increment: amount,
          },
        },
        create: {
          type: BuildJobType.HARVESTER,
          amount,
          timeLeft: 8,
          userId: userId,
        },
      }),
    ])

    return true
  }

  return false
}

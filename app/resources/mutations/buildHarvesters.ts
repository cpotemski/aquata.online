import { Ctx } from "blitz"
import db from "db"
import * as z from "zod"
import { calculateHarvesterCosts, enoughResources } from "../utils/harvesterCalculations"

const BuildHarvester = z.number()

const HARVESTER_BUILD_TIME = 8

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
      db.harvesterBuildJob.upsert({
        where: {
          userId_timeLeft: {
            userId,
            timeLeft: HARVESTER_BUILD_TIME,
          },
        },
        update: {
          amount: {
            increment: amount,
          },
        },
        create: {
          amount,
          timeLeft: HARVESTER_BUILD_TIME,
          userId: userId,
        },
      }),
    ])

    return true
  }

  return false
}

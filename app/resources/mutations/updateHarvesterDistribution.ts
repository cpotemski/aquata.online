import { Ctx } from "blitz"
import db from "db"
import * as z from "zod"
import {
  calculateHarvestersFromPercentages,
  calculateValidPercentages,
} from "../utils/harvesterCalculations"

const HarvesterDistribution = z.object({
  aluminiumPercentage: z.number(),
  steelPercentage: z.number(),
})

export default async function updateHarvesterDistribution(
  input: z.infer<typeof HarvesterDistribution>,
  { session }: Ctx
) {
  if (!session.userId) return null

  const station = await db.station.findFirst({
    where: { userId: session.userId },
  })

  if (!station) return null

  const percentages = calculateValidPercentages(
    {
      aluminiumPercentage: station.aluminiumPercentage,
      steelPercentage: station.steelPercentage,
    },
    input
  )

  const harvesters = calculateHarvestersFromPercentages(station.harvester, percentages)

  return db.station.update({
    where: { userId: session.userId },
    data: {
      aluminiumPercentage: percentages.aluminiumPercentage,
      steelPercentage: percentages.steelPercentage,
      ...harvesters,
    },
  })
}

import { Ctx } from "blitz"
import * as z from "zod"
import { updateHarvesterDistribution } from "../utils/harvesterCalculations"

const HarvesterDistribution = z.object({
  aluminiumPercentage: z.number(),
  steelPercentage: z.number(),
})

export default async function updateHarvesterDistributionMutation(
  input: z.infer<typeof HarvesterDistribution>,
  { session }: Ctx
) {
  if (!session.userId) return null

  return updateHarvesterDistribution(session.userId, input)
}

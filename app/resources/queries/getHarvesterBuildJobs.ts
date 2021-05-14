import { Ctx } from "blitz"
import db, { BuildJobType } from "db"

export default async function getHarvesterBuildJobs(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  return db.buildJob.findMany({
    where: { userId: session.userId, type: BuildJobType.HARVESTER },
    select: {
      id: true,
      amount: true,
      timeLeft: true,
    },
  })
}

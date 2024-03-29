import { Ctx } from "blitz"
import db from "db"

export default async function getHarvesterBuildJobs(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  return db.harvesterBuildJob.findMany({
    where: { userId: session.userId },
    select: {
      id: true,
      amount: true,
      timeLeft: true,
    },
  })
}

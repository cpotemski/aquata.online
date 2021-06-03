import { Ctx } from "blitz"
import db from "db"

export default async function getShipBuildJobs(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  return db.shipBuildJob.findMany({
    where: { userId: session.userId },
    select: {
      id: true,
      amount: true,
      shipType: true,
      timeLeft: true,
    },
  })
}

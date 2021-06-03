import { Ctx } from "blitz"
import db from "db"

export default async function getShips(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  return db.fleet.groupBy({
    by: ["userId"],
    where: { userId: session.userId },
    sum: {
      piranha: true,
    },
  })
}

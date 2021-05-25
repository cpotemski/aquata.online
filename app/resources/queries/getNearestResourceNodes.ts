import { Ctx } from "blitz"
import db from "db"

export default async function getNearestResourceNodesQuery(_, { session }: Ctx) {
  if (!session.userId) return null

  const station = await db.station.findFirst({
    where: { userId: session.userId },
    include: { activeResourceNodes: true },
  })

  return station?.activeResourceNodes
}

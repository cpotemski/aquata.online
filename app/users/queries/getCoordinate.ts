import { Ctx } from "blitz"
import db from "db"

export default async function getCoordinate(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const coordinate = await db.station.findFirst({
    where: { userId: session.userId },
    select: { x: true, y: true },
  })

  return coordinate
}

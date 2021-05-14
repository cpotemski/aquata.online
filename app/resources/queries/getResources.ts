import { Ctx } from "blitz"
import db from "db"

export default async function getResources(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  return db.station.findFirst({
    where: { userId: session.userId },
    select: {
      aluminium: true,
      steel: true,
      plutonium: true,
    },
  })
}

import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  return db.station.findFirst({
    where: { userId: session.userId },
    select: {
      aluminium: true,
      steel: true,
      plutonium: true,
      aluminiumHarvester: true,
      steelHarvester: true,
      plutoniumHarvester: true,
      updatedAt: true,
    },
  })
}

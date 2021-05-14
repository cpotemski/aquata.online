import { Ctx } from "blitz"
import db from "db"

export default async function getHarvesters(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  return db.station.findFirst({
    where: { userId: session.userId },
    select: {
      harvester: true,
      aluminiumHarvester: true,
      steelHarvester: true,
      plutoniumHarvester: true,
      aluminiumPercentage: true,
      steelPercentage: true,
    },
  })
}

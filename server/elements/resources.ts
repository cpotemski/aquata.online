import db, { Station } from "db"

const HARVESTER_INCOME = 100

export async function processIncome() {
  const stations: Station[] = await db.station.findMany()

  await db.$transaction(
    stations.map((station) =>
      db.station.update({
        where: { userId: station.userId },
        data: {
          aluminium: { increment: station.aluminiumHarvester * HARVESTER_INCOME },
          steel: { increment: station.steelHarvester * HARVESTER_INCOME },
          plutonium: { increment: station.plutoniumHarvester * HARVESTER_INCOME },
        },
      })
    )
  )
}

import db, { Station } from "db"

export async function processIncome() {
  const stations: Station[] = await db.station.findMany()

  await db.$transaction(
    stations.map((station) => {
      return db.station.update({
        where: { userId: station.userId },
        data: {
          aluminium: { increment: station.aluminiumIncome },
          steel: { increment: station.steelIncome },
          plutonium: { increment: station.plutoniumIncome },
        },
      })
    })
  )
}

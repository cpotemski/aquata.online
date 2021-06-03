import { Ctx } from "blitz"
import db, { ShipType } from "db"
import { SHIP_DATA } from "../constants"
import { calculateShipCosts, enoughResourcesForShips, ShipAmounts } from "../utils/shipCalculation"

export default async function buildShips(amounts: ShipAmounts, { session }: Ctx) {
  if (session.userId === null) return null
  const userId = session.userId

  const station = await db.station.findFirst({ where: { userId } })
  if (!station) return null

  if (enoughResourcesForShips(station, amounts)) {
    const costs = calculateShipCosts(amounts)

    await db.$transaction([
      db.station.update({
        where: { id: station.id },
        data: {
          aluminium: { decrement: costs.aluminium },
          steel: { decrement: costs.steel },
        },
      }),
      ...Object.keys(amounts).map((shipType) =>
        db.shipBuildJob.upsert({
          where: {
            userId_timeLeft_shipType: {
              userId,
              timeLeft: SHIP_DATA[shipType].buildTime,
              shipType: shipType as ShipType,
            },
          },
          update: {
            amount: {
              increment: amounts[shipType],
            },
          },
          create: {
            shipType: shipType as ShipType,
            amount: amounts[shipType],
            timeLeft: SHIP_DATA[shipType].buildTime,
            userId: userId,
          },
        })
      ),
    ])

    return true
  }

  return false
}

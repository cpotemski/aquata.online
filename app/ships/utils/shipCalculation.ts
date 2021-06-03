import {
  moreOrEqualResourcesThan,
  Resources,
  sumOfResources,
} from "app/resources/utils/harvesterCalculations"
import { ShipType } from "db"
import { SHIP_DATA } from "../constants"

export type ShipAmounts = { [shipType: string]: number }

export const howManyShipsAfford = (resources: Resources): ShipAmounts => {
  const amounts: ShipAmounts = {}
  Object.keys(SHIP_DATA).forEach((shipType) => {
    amounts[shipType] = howManyOfOneShipAfford(resources, shipType as ShipType)
  })

  return amounts
}

export const howManyOfOneShipAfford = (resources: Resources, shipType: ShipType): number =>
  Math.floor(
    Math.min(
      ...Object.keys(SHIP_DATA[shipType].buildCosts).map(
        (resourceType) => resources[resourceType] / SHIP_DATA[shipType].buildCosts[resourceType]
      )
    )
  )

export const enoughResourcesForSingleShip = (
  resources: Resources,
  amount: number,
  shipType: ShipType
) => moreOrEqualResourcesThan(resources, calculateSingleShipCosts(amount, shipType))

export const enoughResourcesForShips = (resources: Resources, amounts: ShipAmounts): boolean =>
  moreOrEqualResourcesThan(resources, calculateShipCosts(amounts))

export const calculateShipCosts = (amounts: ShipAmounts): Resources => {
  return sumOfResources(
    Object.keys(amounts).map((shipType) =>
      calculateSingleShipCosts(amounts[shipType], shipType as ShipType)
    )
  )
}

export const calculateSingleShipCosts = (amount: number, shipType: ShipType): Resources => {
  const costs = { aluminium: 0, steel: 0 }
  const singleCosts = SHIP_DATA[shipType].buildCosts
  Object.keys(singleCosts).forEach(
    (resourceType) => (costs[resourceType] = amount * singleCosts[resourceType])
  )

  return costs
}

import { ShipType } from "db"

export type ShipData = {
  [shipType: string]: {
    name: string
    buildCosts: {
      aluminium: number
      steel: number
    }
    buildTime: number
    travelSpeed: number
  }
}

export const SHIP_DATA: ShipData = {
  [ShipType.PIRANHA]: {
    name: "Piranha",
    buildCosts: {
      aluminium: 1000,
      steel: 100,
    },
    buildTime: 4,
    travelSpeed: 5,
  },
}

import { distanceBetweenCoordinates } from "app/map/utils"
import db, { ResourceNode } from "db"

export const HARVESTER_COST: Partial<Resources> = {
  aluminium: 1000,
  steel: 1000,
}

const HARVESTER_CAPACITY = 500
const HARVESTER_TRAVEL_SPEED = 3
const HARVESTER_MINING_SPEED = 500
const HARVESTER_UNLOAD_SPEED = 500

export type Resources = {
  aluminium: number
  steel: number
  plutonium?: number
}

type Percentages = {
  aluminiumPercentage: number
  steelPercentage: number
  plutoniumPercentage: number
}

type InputPercentages = {
  aluminiumPercentage: number
  steelPercentage: number
}

export const calculateValidPercentages = (
  oldData: InputPercentages,
  newData: Partial<Percentages>
): Percentages => {
  // TODO: harvester distribution
  const updatedPercentages = {
    aluminiumPercentage: oldData.aluminiumPercentage,
    steelPercentage: oldData.steelPercentage,
    plutoniumPercentage: 100 - oldData.aluminiumPercentage - oldData.steelPercentage,
    ...newData,
  }

  if (updatedPercentages.aluminiumPercentage < 0) {
    updatedPercentages.aluminiumPercentage = 0
  }

  if (updatedPercentages.aluminiumPercentage > 100) {
    updatedPercentages.aluminiumPercentage = 100
  }

  if (updatedPercentages.steelPercentage < 0) {
    updatedPercentages.steelPercentage = 0
  }

  if (updatedPercentages.aluminiumPercentage + updatedPercentages.steelPercentage > 100) {
    updatedPercentages.steelPercentage = 100 - updatedPercentages.aluminiumPercentage
  }

  if (!newData.steelPercentage) {
    updatedPercentages.steelPercentage =
      100 - updatedPercentages.aluminiumPercentage - updatedPercentages.plutoniumPercentage

    if (updatedPercentages.steelPercentage < 0) {
      updatedPercentages.steelPercentage = 0
    }
  }

  updatedPercentages.plutoniumPercentage =
    100 - updatedPercentages.aluminiumPercentage - updatedPercentages.steelPercentage

  return updatedPercentages
}
export type Harvesters = {
  aluminiumHarvester: number
  steelHarvester: number
  plutoniumHarvester: number
}

export const calculateHarvestersFromPercentages = (
  harvesters: number,
  percentages: InputPercentages
): Harvesters => {
  const aluminiumHarvester = Math.floor((harvesters * percentages.aluminiumPercentage) / 100)
  const steelHarvester = Math.floor((harvesters * percentages.steelPercentage) / 100)
  const plutoniumHarvester = harvesters - aluminiumHarvester - steelHarvester

  return {
    aluminiumHarvester,
    steelHarvester,
    plutoniumHarvester,
  }
}

export const howManyHarvestersAfford = (resources: Resources) => {
  return Math.floor(
    Math.min(...Object.keys(HARVESTER_COST).map((key) => resources[key] / HARVESTER_COST[key]))
  )
}

export const enoughResources = (resources: Resources, count: number): boolean => {
  return count <= howManyHarvestersAfford(resources)
}

export const calculateHarvesterCosts = (count: number): Partial<Resources> => {
  const costs = {}
  Object.keys(HARVESTER_COST).forEach(
    (resource) => (costs[resource] = count * HARVESTER_COST[resource])
  )

  return costs
}

export const calculateIncome = async (station: {
  activeResourceNodes: ResourceNode[]
  x: number
  y: number
  aluminiumHarvester: number
  steelHarvester: number
  plutoniumHarvester: number
}) => {
  let income: Resources = {
    aluminium: 0,
    steel: 0,
    plutonium: 0,
  }

  station.activeResourceNodes.forEach((resourceNode) => {
    const distance = distanceBetweenCoordinates(station, resourceNode)

    const timeForOneCycle =
      distance / HARVESTER_TRAVEL_SPEED +
      HARVESTER_CAPACITY / HARVESTER_MINING_SPEED +
      HARVESTER_CAPACITY / HARVESTER_UNLOAD_SPEED

    const cyclesPerTick = 1 / timeForOneCycle

    income[resourceNode.type.toLowerCase()] =
      Math.floor(cyclesPerTick * HARVESTER_CAPACITY) *
      station[`${resourceNode.type.toLowerCase()}Harvester`]
  })

  console.log(station, income)

  return {
    aluminiumIncome: income.aluminium,
    steelIncome: income.steel,
    plutoniumIncome: income.plutonium,
  }
}

export const updateHarvesterDistribution = async (userId: string, input) => {
  const station = await db.station.findFirst({
    where: { userId },
    include: {
      activeResourceNodes: true,
    },
  })

  if (!station) return null

  const percentages = calculateValidPercentages(
    {
      aluminiumPercentage: station.aluminiumPercentage,
      steelPercentage: station.steelPercentage,
    },
    input
  )

  const harvesters = calculateHarvestersFromPercentages(station.harvester, percentages)

  const income = await calculateIncome({
    ...station,
    ...harvesters,
  })

  return db.station.update({
    where: { userId },
    data: {
      aluminiumPercentage: percentages.aluminiumPercentage,
      steelPercentage: percentages.steelPercentage,
      ...harvesters,
      ...income,
    },
  })
}

export const sumOfResources = (resources: Resources[]) =>
  resources.reduce(
    (sum, current) => ({
      aluminium: sum.aluminium + current.aluminium,
      steel: sum.steel + current.steel,
    }),
    { aluminium: 0, steel: 0 }
  )

export const moreOrEqualResourcesThan = (a: Resources, b: Resources) =>
  (a.aluminium && b.aluminium ? a.aluminium >= b.aluminium : true) &&
  (a.steel && b.steel ? a.steel >= b.steel : true) &&
  (a.plutonium && b.plutonium ? a.plutonium >= b.plutonium : true)

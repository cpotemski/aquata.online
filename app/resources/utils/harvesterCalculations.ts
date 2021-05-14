export const HARVESTER_COST: Partial<Resources> = {
  aluminium: 1000,
  steel: 1000,
}

type Resources = {
  aluminium: number
  steel: number
  plutonium: number
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

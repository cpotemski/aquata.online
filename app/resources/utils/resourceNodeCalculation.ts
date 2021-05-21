import { Coordinate, sortByDistance } from "app/map/utils"
import db, { ResourceNode, ResourceType } from "db"

export const RESOURCE_NODE_RADIUS = 5

export type ResourceNodes = {
  [ResourceType.ALUMINIUM]: ResourceNode | undefined
  [ResourceType.STEEL]: ResourceNode | undefined
  [ResourceType.PLUTONIUM]: ResourceNode | undefined
}

export const getResourceNodesInRange = async (coordinate: Coordinate): Promise<ResourceNodes> => {
  const resourceNodes = await db.resourceNode.findMany({
    where: {
      x: {
        gte: coordinate.x - RESOURCE_NODE_RADIUS,
        lte: coordinate.x + RESOURCE_NODE_RADIUS,
      },
      y: {
        gte: coordinate.y - RESOURCE_NODE_RADIUS,
        lte: coordinate.y + RESOURCE_NODE_RADIUS,
      },
    },
  })

  return {
    [ResourceType.ALUMINIUM]: getNearest(
      coordinate,
      resourceNodes.filter((node) => node.type === ResourceType.ALUMINIUM)
    ),
    [ResourceType.STEEL]: getNearest(
      coordinate,
      resourceNodes.filter((node) => node.type === ResourceType.STEEL)
    ),
    [ResourceType.PLUTONIUM]: getNearest(
      coordinate,
      resourceNodes.filter((node) => node.type === ResourceType.PLUTONIUM)
    ),
  }
}

export const getNearest = (
  coordinate: Coordinate,
  objects: ResourceNode[]
): ResourceNode | undefined => {
  objects.sort(sortByDistance(coordinate))

  return objects[0]
}

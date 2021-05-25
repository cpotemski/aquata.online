import { Coordinate, sortByDistance } from "app/map/utils"
import db, { ResourceNode, ResourceType } from "db"

export const getNearestResourceNodes = async (coordinate: Coordinate): Promise<ResourceNode[]> => {
  const resourceNodes = await db.resourceNode.findMany()

  return [
    getNearest(
      coordinate,
      resourceNodes
        .filter((node) => node.type === ResourceType.ALUMINIUM)
        .sort(sortByDistance(coordinate))
    ),
    getNearest(
      coordinate,
      resourceNodes
        .filter((node) => node.type === ResourceType.STEEL)
        .sort(sortByDistance(coordinate))
    ),
    getNearest(
      coordinate,
      resourceNodes
        .filter((node) => node.type === ResourceType.PLUTONIUM)
        .sort(sortByDistance(coordinate))
    ),
  ]
}

export const getNearest = (coordinate: Coordinate, objects: ResourceNode[]): ResourceNode => {
  objects.sort(sortByDistance(coordinate))

  return objects[0]
}

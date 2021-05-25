import { findMultipleEmptySpacesOnMap } from "app/map/utils"
import db, { Prisma, ResourceType } from "db"

const RESOURCE_NODES_PER_TYPE = 50

export const createResourceNodes = async () => {
  let result = await db.resourceNode.groupBy({
    by: ["type"],
    count: { _all: true },
  })

  let newNodes: Prisma.ResourceNodeCreateInput[] = []

  for (let resource of [ResourceType.ALUMINIUM, ResourceType.STEEL, ResourceType.PLUTONIUM]) {
    const existingCount = result.find((type) => type.type === resource)?.count?._all || 0
    const newCount = RESOURCE_NODES_PER_TYPE - existingCount

    if (newCount > 0) {
      const emptyCoordinates = await findMultipleEmptySpacesOnMap(newCount)

      for (let _ of Array(newCount).fill("")) {
        const newCoordinate = emptyCoordinates.pop() || { x: 0, y: 0 }

        newNodes.push({
          type: resource,
          ...newCoordinate,
        })
      }
    }
  }

  if (newNodes.length > 0) {
    await db.resourceNode.createMany({ data: newNodes })
  }
  newNodes = []
}

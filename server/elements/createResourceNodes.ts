import { findEmptySpaceOnMap } from "app/map/utils"
import db, { ResourceNode, ResourceType } from "db"

const RESOURCE_NODES_PER_TYPE = 50

export const createResourceNodes = async () => {
  let result = await db.resourceNode.groupBy({
    by: ["type"],
    count: { _all: true },
  })

  let newNodes: ResourceNode[] = []

  for (let resource of [ResourceType.ALUMINIUM, ResourceType.STEEL, ResourceType.PLUTONIUM]) {
    const existingCount = result.find((type) => type.type === resource)?.count?._all || 0
    const newCount = RESOURCE_NODES_PER_TYPE - existingCount

    if (newCount > 0) {
      for (let _ of Array(newCount).fill("")) {
        newNodes.push({
          type: resource,
          ...(await findEmptySpaceOnMap()),
        })
      }
    }
  }

  if (newNodes.length > 0) {
    await db.resourceNode.createMany({ data: newNodes })
  }
  newNodes = []
}

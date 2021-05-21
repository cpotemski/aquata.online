import { useQuery } from "@blitzjs/core"
import getResourceNodes from "app/resources/queries/getResourceNodes"
import { ResourceType } from "db"
import { Coordinate } from "../utils"

export const MapView = () => {
  const [resourceNodes] = useQuery(getResourceNodes, null)
  return (
    <div
      className="border-white border-2 box-content"
      style={{ width: 300, height: 300, overflow: "auto" }}
    >
      <div className="relative" style={{ width: 800, height: 800 }}>
        {resourceNodes?.map((node) => (
          <ResourceCell node={node} key={`${node.x}_${node.y}`} />
        ))}
      </div>
    </div>
  )
}

const ResourceCell = ({ node }) => {
  let text = ""
  switch (node.type) {
    case ResourceType.ALUMINIUM:
      text = "A"
      break
    case ResourceType.STEEL:
      text = "S"
      break
    case ResourceType.PLUTONIUM:
      text = "P"
      break
  }

  return <Cell text={text} coordinate={node} />
}

const Cell = ({ text, coordinate }: { text: string; coordinate: Coordinate }) => {
  const left = (coordinate.x - 1) * 8 + 400
  const bottom = (coordinate.y - 1) * 8 + 400
  return (
    <div
      className="absolute overflow-hidden text-center"
      style={{ fontSize: 6, left, bottom, width: 8, height: 8 }}
    >
      {text}
    </div>
  )
}

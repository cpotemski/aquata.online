import { useQuery } from "@blitzjs/core"
import getNearestResourceNodesQuery from "app/resources/queries/getNearestResourceNodes"
import getResourceNodes from "app/resources/queries/getResourceNodes"
import getCoordinate from "app/users/queries/getCoordinate"
import { ResourceNode, ResourceType } from "db"
import { areCoordinatesEqual, Coordinate } from "../utils"

const MAP_SIZE = 1200
const CELL_SIZE = MAP_SIZE / 100
const FONT_SIZE = CELL_SIZE - 2

export const MapView = () => {
  const [resourceNodes] = useQuery(getResourceNodes, null)
  const [coordinate] = useQuery(getCoordinate, null)
  const [activeNodes] = useQuery(getNearestResourceNodesQuery, null)

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <div className="relative" style={{ width: MAP_SIZE, height: MAP_SIZE }}>
        {resourceNodes?.map((node) => (
          <ResourceCell
            node={node}
            key={`${node.x}_${node.y}`}
            active={activeNodes?.some((resourceNode) => areCoordinatesEqual(node, resourceNode))}
          />
        ))}
        <StationCell node={coordinate} />
      </div>
    </div>
  )
}

const ResourceCell = ({ node, active }: { node: ResourceNode; active?: boolean }) => {
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

  return <Cell text={text} coordinate={node} active={active} />
}

const StationCell = ({ node }) => {
  let text = "X"

  return <Cell text={text} coordinate={node} notify />
}

const Cell = ({
  text,
  coordinate,
  notify,
  active,
}: {
  text: string
  coordinate: Coordinate
  notify?: boolean
  active?: boolean
}) => {
  if (!(coordinate && coordinate.x && coordinate.y)) {
    return <></>
  }
  const left = (coordinate.x - 1) * CELL_SIZE + MAP_SIZE / 2
  const bottom = (coordinate.y - 1) * CELL_SIZE + MAP_SIZE / 2

  return (
    <div
      className="absolute overflow-hidden text-center"
      style={{
        fontSize: FONT_SIZE,
        lineHeight: FONT_SIZE - 1 + "px",
        left,
        bottom,
        width: CELL_SIZE,
        height: CELL_SIZE,
        color: notify ? "red" : active ? "lime" : "",
        border: notify ? "1px solid red" : active ? "1px solid lime" : "",
        borderRadius: active ? "50%" : "",
      }}
    >
      {text}
    </div>
  )
}

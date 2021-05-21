import db from "db"

export type Coordinate = {
  x: number
  y: number
}

export const MAP_X_MIN = -50
export const MAP_X_MAX = 50
export const MAP_Y_MIN = -50
export const MAP_Y_MAX = 50

let COORDINATE_CACHE: Coordinate[] = []

export const findEmptySpaceOnMap = async (
  baseCoordinate?: Coordinate,
  range?: number
): Promise<Coordinate> => {
  let coordinate = getRandomCoordinate(baseCoordinate, range)

  // TODO: optimise so it does not need to be async
  await fillCoordinateCache()
  while (!isCoordinateEmpty(coordinate)) {
    coordinate = getRandomCoordinate(baseCoordinate, range)
  }

  return coordinate
}

export const getRandomCoordinate = (baseCoordinate?: Coordinate, range?: number): Coordinate => {
  let x_max = MAP_X_MAX
  let x_min = MAP_X_MIN
  let y_max = MAP_Y_MAX
  let y_min = MAP_Y_MIN

  if (baseCoordinate && range) {
    x_max = Math.min(baseCoordinate.x + range, MAP_X_MAX)
    x_min = Math.max(baseCoordinate.x - range, MAP_X_MIN)
    y_max = Math.min(baseCoordinate.y + range, MAP_Y_MAX)
    y_min = Math.max(baseCoordinate.y - range, MAP_Y_MIN)
  }

  return {
    x: Math.floor(Math.random() * Math.abs(x_min - x_max) + 1 + x_min),
    y: Math.floor(Math.random() * Math.abs(y_min - y_max) + 1 + y_min),
  }
}

export const fillCoordinateCache = async () => {
  COORDINATE_CACHE = []

  COORDINATE_CACHE.push(
    ...(await db.station.findMany({
      select: { x: true, y: true },
    }))
  )

  COORDINATE_CACHE.push(
    ...(await db.resourceNode.findMany({
      select: { x: true, y: true },
    }))
  )
}

export const sortByDistance = (coordinate: Coordinate) => (a: Coordinate, b: Coordinate) =>
  distanceBetweenCoordinates(coordinate, b) - distanceBetweenCoordinates(coordinate, a)

export const distanceBetweenCoordinates = (a: Coordinate, b: Coordinate): number => {
  const x = Math.abs(b.x - a.x)
  const y = Math.abs(b.y - a.y)

  return Math.round(Math.sqrt(x * x + y * y))
}

export const areCoordinatesEqual = (a: Coordinate, b: Coordinate): boolean =>
  distanceBetweenCoordinates(a, b) === 0

export const isCoordinateEmpty = (coordinate: Coordinate): boolean =>
  COORDINATE_CACHE.find((takenCoordinate) => areCoordinatesEqual(coordinate, takenCoordinate)) ===
  undefined

import db from "db"

export type Coordinate = {
  x: number
  y: number
}

export const MAP_X_MIN = -50
export const MAP_X_MAX = 50
export const MAP_Y_MIN = -50
export const MAP_Y_MAX = 50

const getTakenCoordinates = async () => {
  const takenCoordinates: Coordinate[] = []

  takenCoordinates.push(
    ...(await db.station.findMany({
      select: { x: true, y: true },
    }))
  )

  takenCoordinates.push(
    ...(await db.resourceNode.findMany({
      select: { x: true, y: true },
    }))
  )

  return takenCoordinates
}

export const findMultipleEmptySpacesOnMap = async (amount: number) => {
  const takenCoordinates: Coordinate[] = await getTakenCoordinates()

  const emptyCoordinates: Coordinate[] = []

  for (let _ of Array(amount).fill("")) {
    const newCoordinate = await findEmptySpaceOnMap(takenCoordinates)
    emptyCoordinates.push(newCoordinate)
    takenCoordinates.push(newCoordinate)
  }

  return emptyCoordinates
}

export const findEmptySpaceOnMap = async (takenCoordinates?: Coordinate[]): Promise<Coordinate> => {
  let coordinate = getRandomCoordinate()

  if (takenCoordinates === undefined || takenCoordinates === null) {
    takenCoordinates = await getTakenCoordinates()
  }

  while (!isCoordinateEmpty(takenCoordinates, coordinate)) {
    coordinate = getRandomCoordinate()
  }

  return coordinate
}

export const getRandomCoordinate = (): Coordinate => ({
  x: Math.floor(Math.random() * Math.abs(MAP_X_MIN - MAP_X_MAX) + 1 + MAP_X_MIN),
  y: Math.floor(Math.random() * Math.abs(MAP_Y_MIN - MAP_Y_MAX) + 1 + MAP_Y_MIN),
})

export const sortByDistance = (coordinate: Coordinate) => (a: Coordinate, b: Coordinate) =>
  distanceBetweenCoordinates(coordinate, a) - distanceBetweenCoordinates(coordinate, b)

export const distanceBetweenCoordinates = (a: Coordinate, b: Coordinate): number => {
  const x = Math.abs(b.x - a.x)
  const y = Math.abs(b.y - a.y)

  return Math.round(Math.sqrt(x * x + y * y))
}

export const areCoordinatesEqual = (a?: Coordinate, b?: Coordinate): boolean => {
  if (a === undefined || b === undefined) {
    return false
  }

  return distanceBetweenCoordinates(a, b) === 0
}

export const isCoordinateEmpty = (pool: Coordinate[], coordinate: Coordinate): boolean =>
  pool.find((takenCoordinate) => areCoordinatesEqual(coordinate, takenCoordinate)) === undefined

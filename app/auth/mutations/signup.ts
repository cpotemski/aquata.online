import { Signup } from "app/auth/validations"
import { Coordinate, findEmptySpaceOnMap } from "app/map/utils"
import { updateHarvesterDistribution } from "app/resources/utils/harvesterCalculations"
import { getNearestResourceNodes } from "app/resources/utils/resourceNodeCalculation"
import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Role } from "types"

export default resolver.pipe(resolver.zod(Signup), async ({ email, name, password }, ctx) => {
  const userCoordinates: Coordinate = await findEmptySpaceOnMap()

  // create user
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      name,
      hashedPassword,
      role: "USER",
    },
    select: { id: true, name: true, email: true, role: true },
  })

  // create station
  await db.station.create({
    data: {
      userId: user.id,
      ...userCoordinates,
    },
  })

  // find and persist nearest resource nodes
  const activeResourceNodes = await getNearestResourceNodes(userCoordinates)

  await db.$transaction(
    activeResourceNodes.map((node) =>
      db.resourceNode.update({
        where: { id: node.id },
        data: {
          harvestingStations: { connect: { userId: user.id } },
        },
      })
    )
  )

  // calculate harvesters per type
  await updateHarvesterDistribution(user.id, { aluminiumPercentage: 40, steelPercentage: 35 })

  // create base fleet
  await db.fleet.create({
    data: {
      user: {
        connect: { id: user.id },
      },
      baseFleet: true,
      inStation: {
        connect: {
          userId: user.id,
        },
      },
    },
  })

  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})

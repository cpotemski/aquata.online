import db from "db"

export async function processShipBuildJobs() {
  await db.shipBuildJob.updateMany({
    data: {
      timeLeft: {
        decrement: 1,
      },
    },
  })

  const finishedShips = await db.shipBuildJob.findMany({
    where: {
      timeLeft: 0,
    },
    select: {
      id: true,
      userId: true,
      amount: true,
      shipType: true,
    },
  })

  const fleets = await db.fleet.findMany({
    where: {
      userId: {
        in: finishedShips.map(({ userId }) => userId),
      },
      baseFleet: true,
    },
  })

  await db.$transaction([
    ...finishedShips.map(({ userId, amount, shipType }) => {
      const fleet = fleets.find((fleet) => fleet.userId === userId)
      if (fleet === undefined) {
        throw Error("could not find fleet to add finished ships")
      }

      return db.fleet.update({
        where: {
          id: fleet.id,
        },
        data: {
          [shipType.toLocaleLowerCase()]: { increment: amount },
        },
      })
    }),
    db.shipBuildJob.deleteMany({
      where: {
        id: {
          in: finishedShips.map(({ id }) => id),
        },
      },
    }),
  ])

  if (finishedShips.length > 0) {
    console.log(`Finished ${finishedShips.length} Ship BuildJobs`)
  }
}

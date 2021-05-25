import {
  calculateHarvestersFromPercentages,
  calculateIncome,
} from "app/resources/utils/harvesterCalculations"
import db, { BuildJobType } from "db"

export async function processBuildJobs() {
  await db.buildJob.updateMany({
    data: {
      timeLeft: {
        decrement: 1,
      },
    },
  })

  const finishedHarvesters = await db.buildJob.findMany({
    where: {
      type: BuildJobType.HARVESTER,
      timeLeft: 0,
    },
    select: {
      id: true,
      userId: true,
      amount: true,
    },
  })

  const stations = await db.station.findMany({
    where: {
      userId: {
        in: finishedHarvesters.map(({ userId }) => userId),
      },
    },
    include: {
      activeResourceNodes: true,
    },
  })

  await db.$transaction([
    ...finishedHarvesters.map(({ userId, amount }) => {
      const station = stations.find((station) => station.userId === userId)
      if (station === undefined) {
        throw Error("could not find station to add finished harvesters")
      }
      const harvesters = calculateHarvestersFromPercentages((station?.harvester || 0) + amount, {
        aluminiumPercentage: station?.aluminiumPercentage || 30,
        steelPercentage: station?.steelPercentage || 30,
      })

      return db.station.update({
        where: {
          userId,
        },
        data: {
          harvester: {
            increment: amount,
          },
          aluminiumHarvester: harvesters.aluminiumHarvester,
          steelHarvester: harvesters.steelHarvester,
          plutoniumHarvester: harvesters.plutoniumHarvester,
          ...calculateIncome(station),
        },
      })
    }),
    db.buildJob.deleteMany({
      where: {
        id: {
          in: finishedHarvesters.map(({ id }) => id),
        },
      },
    }),
  ])

  if (finishedHarvesters.length > 0) {
    console.log(`Finished ${finishedHarvesters.length} Harvester BuildJobs`)
  }
}

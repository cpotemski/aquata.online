import Button from "app/core/components/Button"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, useMutation, useQuery } from "blitz"
import React, { Suspense, useState } from "react"
import updateHarvesterDistribution from "../mutations/updateHarvesterDistribution"
import getHarvesters from "../queries/getHarvesters"
import getResources from "../queries/getResources"
import {
  calculateHarvestersFromPercentages,
  calculateValidPercentages,
  enoughResources,
  howManyHarvestersAfford,
} from "../utils/harvesterCalculations"

import buildHarvester from "../mutations/buildHarvesters"
import getHarvesterBuildJobs from "../queries/getHarvesterBuildJobs"

const ResourceList = () => {
  const [resources] = useQuery(getResources, null)

  return (
    <div className="mb-16">
      <h2 className="py-2 border-b-2 border-t-2 border-white border-opacity-10 my-2">Resourcen</h2>
      <div className="mb-4 flex justify-around text-center">
        <div>Aluminium {resources?.aluminium}</div>
        <div>Stahl {resources?.steel}</div>
        <div>Plutonium {resources?.plutonium}</div>
      </div>
    </div>
  )
}

const HarvesterDistribution = () => {
  const [harvesterData, { refetch: refetchHarvesters }] = useQuery(getHarvesters, null)
  const [updateHarvesterDistributionMutation] = useMutation(updateHarvesterDistribution)

  const [percentages, setPercentages] = useState({
    aluminiumPercentage: harvesterData?.aluminiumPercentage || 0,
    steelPercentage: harvesterData?.steelPercentage || 0,
    plutoniumPercentage:
      100 - (harvesterData?.aluminiumPercentage || 0) - (harvesterData?.steelPercentage || 0),
  })

  const [harvesters, setHarvesters] = useState({
    aluminiumHarvester: harvesterData?.aluminiumHarvester || 0,
    steelHarvester: harvesterData?.steelHarvester || 0,
    plutoniumHarvester: harvesterData?.plutoniumHarvester || 0,
  })

  if (!harvesterData) {
    return <div></div>
  }

  const setAluminiumPercentage = (event) => {
    const newPercentages = calculateValidPercentages(percentages, {
      aluminiumPercentage: parseInt(event.target.value, 10) || 0,
    })
    setPercentages(newPercentages)

    setHarvesters(calculateHarvestersFromPercentages(harvesterData.harvester, newPercentages))
  }

  const setSteelPercentage = (event) => {
    const newPercentages = calculateValidPercentages(percentages, {
      steelPercentage: parseInt(event.target.value, 10) || 0,
    })
    setPercentages(newPercentages)

    setHarvesters(calculateHarvestersFromPercentages(harvesterData.harvester, newPercentages))
  }

  const setPlutoniumPercentage = (event) => {
    const newPercentages = calculateValidPercentages(percentages, {
      plutoniumPercentage: parseInt(event.target.value, 10) || 0,
    })
    setPercentages(newPercentages)

    setHarvesters(calculateHarvestersFromPercentages(harvesterData.harvester, newPercentages))
  }

  const savePercentages = async () => {
    await updateHarvesterDistributionMutation({
      aluminiumPercentage: percentages.aluminiumPercentage,
      steelPercentage: percentages.steelPercentage,
    })
    await refetchHarvesters()
  }

  const harvesterDiffs = {
    aluminium: harvesters.aluminiumHarvester - harvesterData.aluminiumHarvester,
    steel: harvesters.steelHarvester - harvesterData.steelHarvester,
    plutonium: harvesters.plutoniumHarvester - harvesterData.plutoniumHarvester,
  }

  return (
    <div className="mb-16">
      <h2 className="border-b-2 border-t-2 border-white border-opacity-10 my-2">Sammler</h2>
      <div className="flex justify-around mb-6">
        <div className="flex flex-col w-1/4 text-right">
          {harvesterData.aluminiumHarvester} (
          {harvesterDiffs.aluminium < 0 ? harvesterDiffs.aluminium : `+${harvesterDiffs.aluminium}`}
          )
          <input
            type="number"
            value={percentages.aluminiumPercentage}
            onChange={setAluminiumPercentage}
          ></input>
        </div>
        <div className="flex flex-col w-1/4 text-right">
          {harvesterData.steelHarvester} (
          {harvesterDiffs.steel < 0 ? harvesterDiffs.steel : `+${harvesterDiffs.steel}`})
          <input
            type="number"
            value={percentages.steelPercentage}
            onChange={setSteelPercentage}
          ></input>
        </div>
        <div className="flex flex-col w-1/4 text-right">
          {harvesterData.plutoniumHarvester} (
          {harvesterDiffs.plutonium < 0 ? harvesterDiffs.plutonium : `+${harvesterDiffs.plutonium}`}
          )
          <input
            type="number"
            value={percentages.plutoniumPercentage}
            onChange={setPlutoniumPercentage}
          ></input>
        </div>
      </div>
      <Button onClick={savePercentages} full>
        Speichern
      </Button>
    </div>
  )
}

const BuildHarvester = () => {
  const [resources, { refetch: refetchResources }] = useQuery(getResources, null)
  const [harvesterData] = useQuery(getHarvesters, null)
  const [buildHarvesterMutation] = useMutation(buildHarvester)
  const [buildJobs, { refetch: refetchBuildJobs }] = useQuery(getHarvesterBuildJobs, null)
  const [amount, setAmount] = useState(0)

  if (!resources || !harvesterData) {
    return <></>
  }

  const maxHarvesters = howManyHarvestersAfford(resources)

  const build = async () => {
    if (enoughResources(resources, amount)) {
      await buildHarvesterMutation(amount)
      await refetchResources()
      await refetchBuildJobs()
      setAmount(0)
    }
  }

  const updateAmount = (event) => {
    const newAmount = parseInt(event.target.value, 10)
    const affordAmount = howManyHarvestersAfford(resources)
    if (enoughResources(resources, parseInt(event.target.value, 10))) {
      setAmount(newAmount)
    } else {
      setAmount(affordAmount)
    }
  }

  return (
    <div className="mb-16">
      <h2 className="border-b-2 border-t-2 border-white border-opacity-10 my-2">Sammler bauen</h2>
      <div className="text-center">
        Maximal: {maxHarvesters} &middot; Verbleibend: {maxHarvesters - amount}
      </div>
      <div className="flex flex-col">
        <input type="number" value={amount} onChange={updateAmount} className="my-4"></input>
        <Button onClick={build} full>
          Bauen
        </Button>
      </div>
      <div className="mt-4">
        <h3>Bauschleife</h3>
        <ul>
          {buildJobs?.map((buildJob) => (
            <li key={buildJob.id}>
              {buildJob.amount}({buildJob.timeLeft} Ticks verbleibend)
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Resources: BlitzPage = () => {
  return (
    <>
      <Suspense fallback="Loading...">
        <ResourceList />
      </Suspense>
      <Suspense fallback="Loading...">
        <HarvesterDistribution />
      </Suspense>
      <Suspense fallback="Loading...">
        <BuildHarvester />
      </Suspense>
    </>
  )
}

Resources.suppressFirstRenderFlicker = true
Resources.getLayout = (page) => <Layout title="Resources">{page}</Layout>
Resources.authenticate = { redirectTo: "/login" }

export default Resources

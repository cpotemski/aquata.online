import Button from "app/core/components/Button"
import Layout from "app/core/layouts/Layout"
import getResources from "app/resources/queries/getResources"
import { BlitzPage, useMutation, useQuery } from "blitz"
import { ShipType } from "db"
import React, { Suspense, useState } from "react"
import { SHIP_DATA } from "../constants"
import buildShips from "../mutations/buildShips"
import getShipBuildJobs from "../queries/getShipBuildJobs"
import getShips from "../queries/getShips"
import {
  enoughResourcesForSingleShip,
  enoughResourcesForShips,
  howManyOfOneShipAfford,
  howManyShipsAfford,
  ShipAmounts,
} from "../utils/shipCalculation"

const initialState: ShipAmounts = {
  [ShipType.PIRANHA]: 0,
}

const BuildShipsPage = () => {
  const [ships] = useQuery(getShips, null)
  const [resources, { refetch: refetchResources }] = useQuery(getResources, null)
  const [buildShipsMutation] = useMutation(buildShips)
  const [buildJobs, { refetch: refetchBuildJobs }] = useQuery(getShipBuildJobs, null)
  const [amounts, setAmount] = useState(initialState)

  if (!resources) {
    return <></>
  }

  const maxShips = howManyShipsAfford(resources)

  const build = async () => {
    if (enoughResourcesForShips(resources, amounts)) {
      await buildShipsMutation(amounts)
      await refetchResources()
      await refetchBuildJobs()
      setAmount(initialState)
    }
  }

  const updateAmount = (shipType: ShipType, event) => {
    const newAmount = {
      [shipType]: parseInt(event.target.value, 10) || 0,
    }
    const affordAmount = howManyOfOneShipAfford(resources, shipType)
    if (enoughResourcesForSingleShip(resources, parseInt(event.target.value, 10), shipType)) {
      setAmount(newAmount)
    } else {
      newAmount[shipType] = affordAmount
      setAmount(newAmount)
    }
  }

  const allShipsInFleets = ships ? ships[0].sum : {}

  return (
    <div className="mb-16">
      <h2 className="border-b-2 border-t-2 border-white border-opacity-10 my-2">Schiffe bauen</h2>
      <div className="flex flex-col">
        {Object.keys(ShipType).map((shipName) => (
          <div key={shipName}>
            <label htmlFor={shipName}>
              {SHIP_DATA[shipName].name} ({allShipsInFleets[shipName.toLowerCase()] || 0} +{" "}
              {maxShips[shipName] - amounts[shipName]})
              <input
                type="number"
                name={shipName}
                onChange={updateAmount.bind(this, shipName)}
                value={amounts[shipName]}
                className="my-4"
              ></input>
            </label>
          </div>
        ))}
        <Button onClick={build} full>
          Bauen
        </Button>
      </div>
      <div className="mt-4">
        <h3>Bauschleife</h3>
        <ul>
          {buildJobs?.map((buildJob) => (
            <li key={buildJob.id}>
              {buildJob.amount} {buildJob.shipType ? SHIP_DATA[buildJob.shipType].name : ""}(
              {buildJob.timeLeft} Ticks verbleibend)
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Ships: BlitzPage = () => {
  return (
    <>
      <Suspense fallback="Loading...">
        <BuildShipsPage />
      </Suspense>
    </>
  )
}

Ships.suppressFirstRenderFlicker = true
Ships.getLayout = (page) => <Layout title="Schiffe">{page}</Layout>
Ships.authenticate = { redirectTo: "/login" }

export default Ships

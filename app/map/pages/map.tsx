import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { MapView } from "../components/map"

const MapPage: BlitzPage = () => {
  return (
    <>
      <Suspense fallback="Loading...">
        <MapView />
      </Suspense>
    </>
  )
}

MapPage.getLayout = (page) => <Layout title="Map"> {page} </Layout>
MapPage.authenticate = { redirectTo: "/login" }

export default MapPage

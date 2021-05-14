import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import getResources from "app/resources/queries/getResources"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()}>
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href={Routes.LoginPage()}>
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </>
    )
  }
}

const Resources = () => {
  const [resources] = useQuery(getResources, null)

  return (
    <>
      Aluminium: {resources?.aluminium.toString()} ({resources?.aluminiumHarvester}) <br />
      Steel: {resources?.steel.toString()} ({resources?.steelHarvester}) <br />
      Plutonium: {resources?.plutonium.toString()} ({resources?.plutoniumHarvester}) <br />
      Updates: {resources?.updatedAt.toLocaleDateString()}
    </>
  )
}

const Home: BlitzPage = () => {
  return (
    <>
      <div className="text-white ml-auto mr-auto w-6/12 text-center p-4 text-3xl mb-4">Aquata</div>
      <Suspense fallback="Loading...">
        <UserInfo />
      </Suspense>
      <div className="p-2">Resources:</div>
      <Suspense fallback="Loading...">
        <Resources />
      </Suspense>
    </>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home

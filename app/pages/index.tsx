import logout from "app/auth/mutations/logout"
import Button from "app/core/components/Button"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Link, Routes, useMutation } from "blitz"
import { Suspense } from "react"

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
        <Button
          className="absolute top-1 right-1"
          small
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </Button>
        <div>
          Moin {currentUser.name} (Role: {currentUser.role})
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

const Home: BlitzPage = () => {
  return (
    <>
      <div className="text-white ml-auto mr-auto w-6/12 text-center p-4 text-3xl mb-4">Aquata</div>
      <Suspense fallback="Loading...">
        <UserInfo />
      </Suspense>

      <ul>
        <li>
          <Link href={Routes.Resources()}>Resourcen</Link>
        </li>
        <li>
          <Link href={Routes.Ships()}>Schiffe</Link>
        </li>
        <li>
          <Link href={Routes.MapPage()}>Karte</Link>
        </li>
      </ul>
    </>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>
Home.authenticate = { redirectTo: "/login" }

export default Home

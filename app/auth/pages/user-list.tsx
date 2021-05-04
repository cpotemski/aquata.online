import { Suspense } from "react"
import { BlitzPage, useQuery, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUsers from "../../users/queries/getUsers"

const UserList = () => {
  const [users] = useQuery(getUsers, null)

  return (
    <ul>
      {users &&
        users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
    </ul>
  )
}

const UserListPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <p>UserList</p>
      <Suspense fallback="Loading...">
        <UserList />
      </Suspense>
    </div>
  )
}

UserListPage.getLayout = (page) => <Layout title="User List">{page}</Layout>

export default UserListPage

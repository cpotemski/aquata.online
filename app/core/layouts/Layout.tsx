import { ReactNode } from "react"
import { Head, Link, Routes } from "blitz"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Aquata - {title || "Hello :)"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href={Routes.Home()}>Home</Link>

      <div className="p-2 w-full">{children}</div>
    </>
  )
}

export default Layout

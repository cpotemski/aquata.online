import { Ctx } from "blitz"
import db from "db"

export default async function getResourceNodes(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  return db.resourceNode.findMany()
}

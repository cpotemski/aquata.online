import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { Role } from "types"

export default resolver.pipe(resolver.zod(Signup), async ({ email, name, password }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      name,
      hashedPassword,
      role: "USER",
      station: {
        create: {
          x: Math.ceil(Math.random() * 100),
          y: Math.ceil(Math.random() * 100),
        },
      },
    },
    select: { id: true, name: true, email: true, role: true },
  })

  await db.fleet.create({
    data: {
      user: {
        connect: { id: user.id },
      },
      baseFleet: true,
      inStation: {
        connect: {
          userId: user.id,
        },
      },
    },
  })

  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})

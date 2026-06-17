// server/utils/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { prisma } from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NUXT_BETTER_AUTH_URL,
  trustedOrigins: [
    'http://localhost:3030',
    'http://localhost:3000',
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],
  plugins: [
    admin(),
  ],
})

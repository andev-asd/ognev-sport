// server/api/auth/[...all].ts

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})

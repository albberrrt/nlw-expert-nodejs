import { fastify } from "fastify"
import cookie from '@fastify/cookie';
import { fastifyWebsocket } from "@fastify/websocket";
import cors from "@fastify/cors"

const app = fastify({
  logger: true
})

app.register(cookie, {
  secret: 'myCookieVerySecureSecret',
  hook: 'onRequest',
  parseOptions: {}
})

app.register(fastifyWebsocket)

app.register(cors, {
  origin: true,
})

export { app }
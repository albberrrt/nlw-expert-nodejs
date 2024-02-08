import { fastify } from "fastify"
import cors from "@fastify/cors"

const app = fastify({
  logger: true
})

app.register(cors, {
  origin: true,
})

export { app }
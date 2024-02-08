import fastify from "fastify"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const app = fastify()

const prisma = new PrismaClient()

app.get('/', () => {
  return "Hello World!"
})

app.post('/polls', async (request, reply) => {
  const createPollBody = z.object({
    title: z.string()
  })
  const { title } = createPollBody.parse(request.body)

  const poll = await prisma.poll.create({
    data: {
      title,
    }
  })

  return reply.status(201).send({ pollId: poll.id })
})

const HOST = process.env.SERVER_HOST
const PORT = Number(process.env.SERVER_PORT)

app.listen({ host: HOST, port: PORT }).then(() => {
  console.log(`Server started! - ${HOST}:${PORT}  || http://${HOST}:${PORT}/`)
})
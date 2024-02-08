import { app } from "./app"
import { prisma } from "../prisma/client"
import { z } from "zod"
import { env } from "../../config/env"

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

app.listen({ host: env.SERVER_HOST, port: env.SERVER_PORT }).then(() => {
  console.log(`Server started! - ${env.SERVER_HOST}:${env.SERVER_PORT}  || http://${env.SERVER_HOST}:${env.SERVER_PORT}/`)
})
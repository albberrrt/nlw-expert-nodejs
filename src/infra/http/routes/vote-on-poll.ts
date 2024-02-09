import { FastifyInstance } from "fastify"
import z from "zod"
import { prisma } from "../../prisma/client"

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/poll/:pollId/votes', async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().cuid()
    })

    const voteOnPollParams = z.object({
      pollId: z.string().cuid()
    })

    const { pollId } = voteOnPollParams.parse(request.params)
    const { pollOptionId } = voteOnPollBody.parse(request.body)


    return reply.status(201).send()
  })
}
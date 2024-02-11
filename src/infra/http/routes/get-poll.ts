import { FastifyInstance } from "fastify"
import z from "zod"
import { prisma } from "@/infra/prisma/client"
import { clientError, ok } from "@/core/infra/HttpResponse"
import { httpReply } from "@/core/infra/adapter/HttpReplyAdapter"
import { redis } from "@/infra/redis/client"

export async function getPoll(app: FastifyInstance) {
  app.get('/poll/:pollId', async (request, reply) => {
    const createPollParams = z.object({
      pollId: z.string().cuid()
    })
    const { pollId } = createPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    if (!poll) {
      const error = new Error("Invalid poll")
      return httpReply(clientError(error), reply)
    }

    const rawRedisPollVotes = await redis.zrange(pollId, 0, -1, 'WITHSCORES')
    const votes = rawRedisPollVotes.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = rawRedisPollVotes[index + 1]

        Object.assign(obj, { [line]: Number(score) })
      }

      return obj
    }, {} as Record<string, number>)


    const pollDTO = {
      id: poll.id,
      title: poll.title,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
      options: poll.options.map(option => {
        return {
          id: option.id,
          title: option.title,
          votes: (option.id in votes) ? votes[option.id] : 0
        }
      })
    }

    return httpReply(ok({ poll: pollDTO }), reply)
  })
}
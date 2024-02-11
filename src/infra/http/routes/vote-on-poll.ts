import { FastifyInstance } from "fastify"
import z from "zod"
import { prisma } from "@/infra/prisma/client"
import { randomUUID } from "crypto"
import { clientError, created } from "@/core/infra/HttpResponse"
import { httpReply } from "@/core/infra/adapter/HttpReplyAdapter"
import { redis } from "@/infra/redis/client"
import { voting } from "@/infra/utils/voting-pub-sub"

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

    let { sessionId } = request.cookies

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId
          }
        }
      })

      if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id
          }
        })

        const votes = await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId)

        voting.publish(pollId, {
          pollOptionId: userPreviousVoteOnPoll.pollOptionId,
          votes: Number(votes),
        })
      } else if (userPreviousVoteOnPoll) {
        const error = new Error("You already voted on this poll.")
        return httpReply(clientError(error), reply)
      }

    } else {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true,
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId
      }
    })

    const votes = await redis.zincrby(pollId, 1, pollOptionId)

    voting.publish(pollId, {
      pollOptionId,
      votes: Number(votes),
    })

    return httpReply(created(), reply)
  })
}
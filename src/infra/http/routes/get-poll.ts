import { FastifyInstance } from "fastify"
import z from "zod"
import { prisma } from "../../prisma/client"

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

    return reply.status(200).send({ pollId: poll })
  })
}
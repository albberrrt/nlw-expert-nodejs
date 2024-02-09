import { FastifyInstance } from "fastify"
import { prisma } from "../../prisma/client"

export async function getAllPolls(app: FastifyInstance) {
  app.get('/allpolls', async (request, reply) => {

    const poll = await prisma.poll.findMany({
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
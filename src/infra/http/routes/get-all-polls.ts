import { httpReply } from '@/core/infra/adapter/HttpReplyAdapter';
import { FastifyInstance } from "fastify"
import { prisma } from "@/infra/prisma/client"
import { ok } from "@/core/infra/HttpResponse"

export async function getAllPolls(app: FastifyInstance) {
  app.get('/allpolls', async (request, reply) => {

    const polls = await prisma.poll.findMany({
      include: {
        options: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    return httpReply(ok({ polls: polls }), reply)
  })
}
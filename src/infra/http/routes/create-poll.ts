import { httpReply } from '@/core/infra/adapter/HttpReplyAdapter';
import z from "zod"
import { prisma } from "@/infra/prisma/client"
import { FastifyInstance } from "fastify"
import { created } from "@/core/infra/HttpResponse"

export async function createPoll(app: FastifyInstance) {
  app.post('/poll', async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string())
    })
    const { title, options } = createPollBody.parse(request.body)

    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map(option => {
              return {
                title: option,
              }
            })
          }
        }
      }
    })

    return httpReply(created({ pollId: poll.id }), reply)
  })
}
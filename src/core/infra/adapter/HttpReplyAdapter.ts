import { FastifyReply } from "fastify"
import { HttpResponse } from "../HttpResponse"

export const httpReply = (httpResponse: HttpResponse, reply: FastifyReply) => {
  reply.status(httpResponse.statusCode).send(httpResponse.body)
}
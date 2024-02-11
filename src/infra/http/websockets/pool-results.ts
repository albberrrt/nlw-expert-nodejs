import { voting } from "@/infra/utils/voting-pub-sub";
import { FastifyInstance } from "fastify";
import z from "zod";

export async function pollResults(app: FastifyInstance) {
  app.get('/poll/:pollId/results', { websocket: true }, (connection, request) => {
    const pollResultsParams = z.object({
      pollId: z.string().cuid()
    })

    const { pollId } = pollResultsParams.parse(request.params)

    voting.subscribe(pollId, (message) => {
      connection.socket.send(JSON.stringify(message))
    })
  })
}
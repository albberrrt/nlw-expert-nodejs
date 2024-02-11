import "module-alias/register"

import { app } from "./app"
import { env } from "../../config/env"
import { createPoll } from "./routes/create-poll"
import { getPoll } from "./routes/get-poll"
import { getAllPolls } from "./routes/get-all-polls"
import { voteOnPoll } from "./routes/vote-on-poll"
import { pollResults } from "./websockets/pool-results"

app.get('/', () => {
  return "Hello World!"
})

app.register(createPoll)
app.register(getPoll)
app.register(getAllPolls)
app.register(voteOnPoll)
app.register(pollResults)

app.listen({ host: env.SERVER_HOST, port: env.SERVER_PORT }).then(() => {
  console.log(`Server started! - ${env.SERVER_HOST}:${env.SERVER_PORT}  || http://${env.SERVER_HOST}:${env.SERVER_PORT}/`)
})
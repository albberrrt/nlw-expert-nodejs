import { app } from "./app"
import { env } from "../../config/env"
import { createPoll } from "./routes/create-poll"
import { getPoll } from "./routes/get-poll"
import { getAllPolls } from "./routes/get-all-polls"

app.get('/', () => {
  return "Hello World!"
})

app.register(createPoll)
app.register(getPoll)
app.register(getAllPolls)

app.listen({ host: env.SERVER_HOST, port: env.SERVER_PORT }).then(() => {
  console.log(`Server started! - ${env.SERVER_HOST}:${env.SERVER_PORT}  || http://${env.SERVER_HOST}:${env.SERVER_PORT}/`)
})
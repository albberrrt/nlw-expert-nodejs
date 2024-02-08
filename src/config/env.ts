import { z } from "zod"

const envSchema = z.object({
  SERVER_PORT: z.string().min(4).transform((val) => Number(val)),
  SERVER_HOST: z.string().min(1)
})

export const env = envSchema.parse(process.env)
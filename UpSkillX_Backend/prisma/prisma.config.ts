import { defineConfig } from 'prisma/defineConfig'

export default defineConfig({
  database: {
    url: process.env.DATABASE_URL,
  },
})
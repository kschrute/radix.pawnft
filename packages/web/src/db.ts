import { PrismaClient } from '@prisma/client'

// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
let db

if (!db && process.env.NODE_ENV === 'development') {
  db = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  })
} else if (!db) {
  db = new PrismaClient({ log: ['error'] })
}

export default db as PrismaClient

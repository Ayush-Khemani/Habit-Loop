import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Call before DB operations in serverless (Vercel). Ensures the connection is
 * open; reconnects if Neon closed it (fixes "Error { kind: Closed }").
 */
export async function ensureDb() {
  await prisma.$connect()
}

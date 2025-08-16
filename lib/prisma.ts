let PrismaClient: any
let prisma: any

try {
  // Try to import PrismaClient
  const PrismaModule = require("@prisma/client")
  PrismaClient = PrismaModule.PrismaClient

  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }

  prisma = globalForPrisma.prisma ?? new PrismaClient()

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
  }
} catch (error) {
  // Fallback when PrismaClient is not available
  console.warn("PrismaClient not available, using mock client")

  // Create a mock client for development
  prisma = {
    user: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    property: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    booking: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    review: {
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    $disconnect: async () => {},
  }
}

export { prisma }

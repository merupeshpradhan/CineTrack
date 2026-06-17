// Import Prisma client
import { PrismaClient } from "@prisma/client";

// Import Neon adapter
import { PrismaNeon } from "@prisma/adapter-neon";

// Extend global object
// to cache Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Database connection string
// Loaded from .env
const connectionString = process.env.DATABASE_URL!;

// Create Neon adapter
// Uses HTTP/WebSocket connection
const adapter = new PrismaNeon({
  connectionString,
});

// Reuse existing Prisma instance
// or create new one
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

// Store Prisma globally
// only during development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

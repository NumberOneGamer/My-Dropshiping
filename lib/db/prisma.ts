import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

try {
  prismaClient = new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["query"] : [] });
} catch {
  prismaClient = new Proxy({} as PrismaClient, {
    get(_target, _prop) {
      const noop = async () => [] as any;
      const noopSingle = async () => null as any;
      return new Proxy({} as any, {
        get(_t, method) {
          if (method === "findMany" || method === "findMany" || method === "findFirst") return noop;
          if (method === "findUnique" || method === "findFirst") return noopSingle;
          if (method === "create" || method === "update" || method === "delete" || method === "upsert" || method === "count" || method === "aggregate") return noop;
          return noop;
        },
      });
    },
  });
}

export const prisma = globalForPrisma.prisma ?? prismaClient;
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
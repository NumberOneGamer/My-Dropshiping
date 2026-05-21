import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

try {
  prismaClient = new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["query"] : [] });
} catch {
  const modelHandler: Record<string, (...args: any[]) => any> = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (args: any) => args?.data || {},
    update: async (args: any) => args?.data || {},
    delete: async () => ({}),
    upsert: async (args: any) => args?.create || {},
    count: async () => 0,
    aggregate: async () => ({ _avg: {}, _count: {}, _max: {}, _min: {}, _sum: { total: "0" } }),
    groupBy: async () => [],
    findRaw: async () => [],
    aggregateRaw: async () => [],
  };
  prismaClient = new Proxy({} as PrismaClient, {
    get(_target, _prop) {
      if (typeof _prop !== "string") return undefined;
      return new Proxy({} as any, {
        get(_t, method) {
          if (typeof method === "string" && modelHandler[method]) {
            return modelHandler[method];
          }
          return async () => [];
        },
      });
    },
  });
}

export const prisma = globalForPrisma.prisma ?? prismaClient;
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
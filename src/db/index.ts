import { PrismaClient } from "@prisma/client";

declare global {
  var cachePrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // ホットリロードの際にPrisma Clientインスタンスの再生成を防ぐ
  if (!global.cachePrisma) {
    global.cachePrisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }

  prisma = global.cachePrisma;
}

export const db = prisma;

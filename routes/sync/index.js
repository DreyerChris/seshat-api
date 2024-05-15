"use strict";
import { PrismaClient } from "@prisma/client";
import { generate } from "random-words";

const prisma = new PrismaClient();

export default async function (fastify, opts) {
  fastify.get("/code", async function (request, reply) {
    return generateRandomSyncCode();
  });

  fastify.post(
    "/up",
    { preHandler: fastify.authenticate },
    async function (request, reply) {
      const { syncCode } = request;
      const { text1, text2, text3, text4 } = request.body;

      const syncAccount = await prisma.syncAccount.findUnique({
        where: { syncCode: syncCode, expiresAt: { gt: new Date() } },
      });
      if (!syncAccount) {
        return reply
          .status(400)
          .send({ message: "Sync account does not exist or has expired" });
      }

      await prisma.syncAccount.update({
        data: { syncCode, text1, text2, text3, text4 },
        where: { syncCode: syncCode, expiresAt: { gt: new Date() } },
      });
    }
  );

  fastify.get(
    "/down",
    { preHandler: fastify.authenticate },
    async function (request, reply) {
      const { syncCode } = request;

      const syncAccount = await prisma.syncAccount.findUnique({
        where: { syncCode: syncCode, expiresAt: { gt: new Date() } },
      });
      if (!syncAccount) {
        return reply
          .status(400)
          .send({ message: "Sync account does not exist or has expired" });
      }

      return {
        text1: syncAccount.text1,
        text2: syncAccount.text2,
        text3: syncAccount.text3,
        text4: syncAccount.text4,
        expiresAt: syncAccount.expiresAt,
      };
    }
  );
}

const generateRandomSyncCode = () => {
  return `${generate({
    exactly: 1,
    wordsPerString: 2,
    separator: "-",
  })}-${generateRandomNumberSequence()}`;
};

const generateRandomNumberSequence = () => {
  return Math.floor(Math.random() * 900) + 100;
};

"use strict";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { add } from "date-fns";

const prisma = new PrismaClient();

export default async function (fastify, opts) {
  fastify.post("/", async function (request, reply) {
    const { syncCode, password } = request.body;

    const syncAccount = await prisma.syncAccount.findUnique({
      where: { syncCode: syncCode },
    });
    if (!syncAccount) {
      return reply
        .status(401)
        .send({ message: "Incorrect synccode or password" });
    }

    const match = await bcrypt.compare(password, syncAccount.password);
    if (match) {
      const token = generateAccessToken({ syncCode });
      return token;
    }

    return reply
      .status(401)
      .send({ message: "Incorrect synccode or password" });
  });

  fastify.post("/sign-up", async function (request, reply) {
    const { syncCode, password } = request.body;

    const existingSyncCode = await prisma.syncAccount.findUnique({
      where: { syncCode: syncCode },
    });
    if (existingSyncCode) {
      return reply.status(400).send({ message: "Sync code already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.syncAccount.create({
      data: {
        syncCode,
        password: hashedPassword,
        expiresAt: add(Date.now(), { hours: 2 }),
      },
    });

    const token = generateAccessToken({ syncCode });
    return token;
  });
}

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.JWT_SECRET, { expiresIn: "1800s" });
};

'use strict'
import { generate } from "random-words"

export default async function (fastify, opts) {
  fastify.get('/code', async function (request, reply) {
    return generateRandomSyncCode()
  })
}

const generateRandomSyncCode = () => {
    return `${generate({ exactly: 1, wordsPerString: 2, separator: "-" })}-${generateRandomNumberSequence()}`
}

const generateRandomNumberSequence = () => {
    return Math.floor(Math.random() * 900) + 100;
}

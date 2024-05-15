"use strict";
import jwt from "jsonwebtoken";
import { join } from "desm";
import AutoLoad from "@fastify/autoload";
import cookie from "@fastify/cookie";

const options = {};

export default async function (fastify, opts) {
  fastify.register(AutoLoad, {
    dir: join(import.meta.url, "plugins"),
    options: Object.assign({}, opts),
  });

  fastify.register(AutoLoad, {
    dir: join(import.meta.url, "routes"),
    options: Object.assign({}, opts),
  });

  fastify.register(cookie, {});

  fastify.decorate("authenticate", async (req, reply) => {
    const token = req.cookies.access_token;
    if (!token) {
      return reply.status(401).send({ message: "Authentication required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      console.log(err);
      if (err)
        return reply
          .status(403)
          .send({ message: "Authentication token not valid" });

      req.syncCode = data.syncCode;
    });
  });
}

const _options = options;
export { _options as options };

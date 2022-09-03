import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

// Fastify Plugins Imports START

import FastJWT from "@fastify/jwt";
import FastCORS from "@fastify/cors";
import FastCSRF from "@fastify/csrf-protection";
import FastENV from "@fastify/env";
import FastHELMET from "@fastify/helmet";
import FastWS from "@fastify/websocket";
import { VerifyToken } from "./utils/AuthIdentityToken";

// Fastify Plugins Imports END

const ENV_SCHEMA = {
  type: "object",
  required: ["PORT", "JWT_SECRET", "DATABASE_URL"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
    JWT_SECRET: {
      type: "string",
    },
    DATABASE_URL: {
      type: "string",
    },
  },
};

const ENV_CONFIG = {
  confKey: "config",
  schema: ENV_SCHEMA,
  dotenv: true,
};
const JWTMessages = {
  badRequestErrorMessage: "Format is Authorization: Bearer [token]",
  noAuthorizationInHeaderMessage: "Autorization header is missing!",
  authorizationTokenExpiredMessage: "Authorization token expired",
  // for the below message you can pass a sync function that must return a string as shown or a string
  authorizationTokenInvalid: (err: any) => {
    return `Authorization token is invalid: ${err.message}`;
  },
};
const RegisterPlugins = (fastifyInstance: FastifyInstance) => {
  fastifyInstance.register(FastCORS, {
    origin: ["*"],
  });

  fastifyInstance.register(FastCSRF);
  fastifyInstance.register(FastENV, ENV_CONFIG);
  fastifyInstance.register(FastHELMET, { contentSecurityPolicy: false });
  fastifyInstance.register(FastWS);
  fastifyInstance.register(FastJWT, {
    secret: process.env?.JWT_SECRET ?? "this is the scret",
    messages: JWTMessages,
    sign: { expiresIn: "1d" },
    verify: {
      cache: true,
      cacheTTL: 600000,
      maxAge: "1d",
    },
  });

  // Authenticator
  fastifyInstance.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply, next: any) {
      try {
        await request.jwtVerify();
        if(await VerifyToken(request.user as {
          "sess": string,
          "did": string,
          "iat": number,
          "exp": number
      }))
          next()
          else 
            reply.status(403).send({error: true, message: "Invalid Auth Token", type: "AUTH"})
      } catch (err) {
        reply.send(err);
      }
    }
  );

  fastifyInstance.ready();

  return fastifyInstance;
};

export default RegisterPlugins;

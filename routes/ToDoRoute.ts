import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const AuthRoute = async (server: FastifyInstance, _options: unknown) => {
  /**
   * Get List of ToDos
   */
    server.get(
    "/ToDos",
    // @ts-ignore
    { onRequest: [server.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      res.send({ hello: "world", url: req.url });
    }
  );
  server.get(
    "/ToDos",
    // @ts-ignore
    { onRequest: [server.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      res.send({ hello: "world", url: req.url });
    }
  );
};

export default AuthRoute;

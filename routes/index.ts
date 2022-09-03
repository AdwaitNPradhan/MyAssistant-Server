import { FastifyInstance } from "fastify";
import AuthRoute from "./AuthRoute";

const Routes = async (server: FastifyInstance, _options: unknown) => {
  server.register(AuthRoute, { prefix: "/auth" });
};

export default Routes;

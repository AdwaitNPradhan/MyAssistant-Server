import { FastifyInstance } from "fastify";
import AuthRoute from "./AuthRoute";
import ToDosRoute from "./ToDoRoute";

const Routes = async (server: FastifyInstance, _options: unknown) => {
	server.register(AuthRoute, { prefix: "/auth" });
	server.register(ToDosRoute, { prefix: "/todos" });
};

export default Routes;

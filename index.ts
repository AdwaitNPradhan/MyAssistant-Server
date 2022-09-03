import Fastify from "fastify";
import RegisterPlugins from "./PluginsRegistration";
import DBConnector from "./DB_Connector";
import Routes from "./routes";

let server = Fastify({
  logger: true
});

server.get("/ping", async (_req, _res) => {
  return { message: "pong" };
});

server.register(Routes);

server.get("/*", async (req, res) => {
  res
    .status(404)
    .send({ error: true, message: "Error, no such route: " + req.url });
});

const start = async () => {
  try {
    await RegisterPlugins(server);
    await server.ready();
    await DBConnector();

    server.listen(
      { host: "0.0.0.0", port: +process.env?.PORT! ?? 3000 },
      (err, address) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log(`Server listening at ${address}`);
      }
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import User from "../models/User";
import RegisterSchema from "../validators/userRegistrationValidation";
import bcrypt from "bcrypt";
import LoginSchema from "../validators/userLoginValidation";
import { GenKeyForLength } from "../utils/KeyGenerator";
import {SaveToken} from "../utils/AuthIdentityToken";

const AuthRoute = async (server: FastifyInstance, _options: unknown) => {
  server.post("/register", async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const payload = req.body as {
        userName: string;
        password: string;
        name: string;
        email: string
      };
      const data = await RegisterSchema.validateAsync(payload);
      data.password = await bcrypt.hash(data.password, 10);
      const user = await new User(data).save();
      res
        .status(200)
        .send({ error: false, user, message: "User created successfully." });
    } catch (err: any) {
      console.error(err);
      res.status(400).send({
        error: true,
        details:
          err["details"]?.map((er: { message: string }) => {
            return er.message;
          }) ??
          (err.keyValue &&
            `Duplicate Entry found for field '${Object.keys(
              err.keyValue
            )}' with value '${Object.values(err.keyValue)}'.`),
      });
    }
  });

  server.post("/login", async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const payload = req.body as {
        loginId: string;
        password: string;
      };
      const data = (await LoginSchema.validateAsync(payload)) as {
        loginId: string;
        password: string;
      };
      console.log(data.loginId);
      const user = await User.findOne(
        { $or: [{ userName: data.loginId }, { email: data.loginId }] },
        { name: 1, userName: 1, email: 1, password: 1 }
      );
      if (user && bcrypt.compareSync(data.password, user.password)) {
        // Creating a special ID Token to link with JWT 
        // to prevent JWT Hijacking to an extent
        const sessionToken = GenKeyForLength(14);
       await SaveToken(sessionToken, (user._id).toString());
        const payload4jwt = { sess: sessionToken, did: user._id };
        res.send({
          error: false,
          message: "Login Successfull",
          user: { name: user.name, email: user.email, userName: user.userName },
          token: server.jwt.sign(payload4jwt, { expiresIn: "1d" }),
        });
      } else {
        res.status(401).send({
          error: true,
          message: "Auth Failed! Invalid password/loginID",
        });
      }
    } catch (err: any) {
      console.error(err);
      res.status(400).send({
        error: true,
        details: err["details"]?.map((er: { message: string }) => {
          return er.message;
        }),
      });
    }
  });

  server.get("/logout", async (req: FastifyRequest, res: FastifyReply) => {
    res.send({ hello: "world", url: req.url });
    // TODO: add a session token to the JWT and db then delete it when logout
    // TODO: Update Authenticator with checking the underlying token
  });
  server.get(
    "/check",
    // @ts-ignore
    { onRequest: [server.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      res.send({ user: req.user, url: req.url, ud: req.ip, ds: req.ips });
    }
  );
};

export default AuthRoute;

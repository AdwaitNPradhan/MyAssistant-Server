import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import User from "../models/User";
import RegisterSchema from "../validators/AuthValidators/userRegistrationValidation";
import bcrypt from "bcrypt";
import LoginSchema from "../validators/AuthValidators/userLoginValidation";
import { GenKeyForLength } from "../utils/KeyGenerator";
import { RemoveToken, SaveToken } from "../utils/AuthIdentityToken";
import Respond from "../utils/ResponseHandler";

const AuthRoute = async (server: FastifyInstance, _options: unknown) => {
	server.post("/register", async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const payload = req.body as {
				userName: string;
				password: string;
				name: string;
				email: string;
			};
			const data = await RegisterSchema.validateAsync(payload);
			data.password = await bcrypt.hash(data.password, 10);
			const user = await new User(data).save();
			Respond(res, 200, {
				user,
				message: "User created successfully.",
			});
		} catch (err: any) {
			console.error(err);
			Respond(res, 400, {
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
				// Creating a special ID Tokens to link with JWT
				// to prevent JWT Hijacking to an extent
				const sessionToken = GenKeyForLength(14);

				await SaveToken(sessionToken, user._id.toString());
				const payload4jwt = { sess: sessionToken, did: user._id };
				Respond(res, 200, {
					message: "Login Successfull",
					user: {
						name: user.name,
						email: user.email,
						userName: user.userName,
					},
					token: server.jwt.sign(payload4jwt, { expiresIn: "1d" }),
				});
			} else {
				Respond(res, 401, {
					message: "Auth Failed! Invalid password/loginID",
				});
			}
		} catch (err: any) {
			console.error(err);
			Respond(res, 400, {
				details: err["details"]?.map((er: { message: string }) => {
					return er.message;
				}),
			});
		}
	});

	server.get(
		"/logout",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			const { sess: sessionToken, did: forUser } = req.user as {
				sess: string;
				did: string;
			};
			await RemoveToken(sessionToken, forUser);
			Respond(res, 200, { message: "Logged out successfully" });
			// TODO: add a session token to the JWT and db then delete it when logout
			// TODO: Update Authenticator with checking the underlying token
		}
	);
	server.get(
		"/check",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			Respond(res, 200, {
				user: req.user,
				url: req.url,
				ud: req.ip,
				ds: req.hostname,
			});
		}
	);
};

export default AuthRoute;

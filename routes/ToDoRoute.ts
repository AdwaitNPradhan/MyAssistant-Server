import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import ToDos from "../models/ToDos";
import ToDoChild from "../models/ToDosChild";
import Respond from "../utils/ResponseHandler";

// TODO: Write Validators for TODO payload
// TODO: Add checks to check if the supplied _id are valid or not
const ToDosRoute = async (server: FastifyInstance, _options: unknown) => {
	// Get List of ToDos
	server.get(
		"/",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			try {
				const { did: userID } = req.user as { did: string };
				const todoList = await ToDos.find({
					creatorID: userID,
				});
				Respond(res, 200, { todos: todoList });
			} catch (err: any) {
				console.error(err);
				Respond(res, 400, {
					error:
						err["details"]?.map((er: { message: string }) => {
							return er.message;
						}) ?? err,
				});
			}
		}
	);
	// Get List of specific ToDo
	server.get(
		"/:todoID",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			try {
				const { todoID } = req.params as {
					todoID: string;
				};
				const { did: userID } = req.user as { did: string };
				const todoList = await ToDos.find({
					creatorID: userID,
					_id: todoID,
				});
				Respond(res, 200, { todos: todoList });
			} catch (err: any) {
				console.error(err);
				Respond(res, 400, {
					error:
						err["details"]?.map((er: { message: string }) => {
							return er.message;
						}) ?? err,
				});
			}
		}
	);
	// Create todo Parent
	server.post(
		"/",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			try {
				const { title, description } = req.body as {
					title: string;
					description?: string;
				};
				const { did: userID } = req.user as { did: string };
				await new ToDos({
					title,
					description,
					creatorID: userID,
					children: [],
				}).save();
				Respond(res, 200, { message: "ToDo created Succeffully" });
			} catch (err: any) {
				console.error(err);
				Respond(res, 400, {
					error:
						err["details"]?.map((er: { message: string }) => {
							return er.message;
						}) ?? err,
				});
			}
		}
	);
	// Create todo child
	server.post(
		"/:todoID",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			try {
				const { todoID } = req.params as {
					todoID: string;
				};
				const { title, description } = req.body as {
					title: string;
					description?: string;
				};
				const { did: userID } = req.user as { did: string };
				// Creating the Schema instance of todoChild. done to get _id in the document
				const todoChild = await new ToDoChild({
					title,
					description,
				});
				// Embedding/pushing the child document to parent
				await ToDos.findOneAndUpdate(
					{
						_id: todoID,
						creatorID: userID,
					},
					{ $push: { children: todoChild } }
				);
				Respond(res, 200, { message: "Created Successfully!" });
			} catch (err: any) {
				console.error(err);
				Respond(res, 400, {
					error:
						err["details"]?.map((er: { message: string }) => {
							return er.message;
						}) ?? err,
				});
			}
		}
	);
	// Update todo Parent
	server.patch(
		"/:todoID",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			try {
				const { did: userID } = req.user as { did: string };
				const { todoID } = req.params as {
					todoID: string;
				};
				const { title, description } = req.body as {
					title: string;
					description?: string;
				};
				await ToDos.findOneAndUpdate(
					{ _id: todoID, creatorID: userID },
					{ $set: { title, description } }
				);
				Respond(res, 200, { message: "ToDo Updated Successfully!" });
			} catch (err: any) {
				console.error(err);
				Respond(res, 400, {
					error:
						err["details"]?.map((er: { message: string }) => {
							return er.message;
						}) ?? err,
				});
			}
		}
	);
	// Update todo child
	server.patch(
		"/:todoID/:childID",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			try {
				const { did: userID } = req.user as { did: string };
				const { todoID, childID } = req.params as {
					todoID: string;
					childID: string;
				};

				const { title, description, status, completed } = req.body as {
					title?: string;
					description?: string;
					status?: string;
					completed?: boolean;
				};
				await ToDos.updateOne(
					{ _id: todoID, creatorID: userID, "children._id": childID },
					{
						$set: {
							"children.$.title": title,
							"children.$.description": description,
							"children.$.status": status,
							"children.$.completed": completed,
						},
					}
				);
				Respond(res, 200, { message: "ToDo Updated Successfully!" });
			} catch (err: any) {
				console.error(err);
				Respond(res, 400, {
					error:
						err["details"]?.map((er: { message: string }) => {
							return er.message;
						}) ?? err,
				});
			}
		}
	);
	// Delete todo Parent
	server.delete(
		"/:todoID",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			try {
				const { did: userID } = req.user as { did: string };
				const { todoID } = req.params as {
					todoID: string;
				};

				await ToDos.deleteOne({ _id: todoID, creatorID: userID });
				Respond(res, 200, { message: "ToDo Removed Successfully!" });
			} catch (err: any) {
				console.error(err);
				Respond(res, 400, {
					error:
						err["details"]?.map((er: { message: string }) => {
							return er.message;
						}) ?? err,
				});
			}
		}
	);
	// Delete todo child
	server.delete(
		"/:todoID/:childID",
		// @ts-ignore
		{ onRequest: [server.authenticate] },
		async (req: FastifyRequest, res: FastifyReply) => {
			try {
				const { did: userID } = req.user as { did: string };
				const { todoID, childID } = req.params as {
					todoID: string;
					childID: string;
				};

				await ToDos.updateOne(
					{
						_id: todoID,
						creatorID: userID,
					},
					{ $pull: { children: { _id: childID } } }
				);
				Respond(res, 200, { message: "ToDo Removed Successfully!" });
			} catch (err: any) {
				console.error(err);
				Respond(res, 400, {
					error:
						err["details"]?.map((er: { message: string }) => {
							return er.message;
						}) ?? err,
				});
			}
		}
	);
};

export default ToDosRoute;

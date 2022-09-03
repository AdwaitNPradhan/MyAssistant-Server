import { FastifyReply } from "fastify";

/**
 * Reponse Handler to maintain the response format.
 * ```
 *  {
 *      error: <Boolean>
 *      data: {
 *          message: <String>
 *          ...?body
 *      }
 *  }
 *```
 * @param res Fastify Response Instance
 * @param statusCode Response Status code
 * @param body Additional body to send with the response. Will be sent inside data key of the response
 * @returns null
 */
const Respond = (res: FastifyReply, statusCode: number, body?: object) => {
	if ([200, 201].includes(statusCode))
		return res.status(statusCode).send({
			error: false,
			data: { message: "Task Completed!", ...body },
		});
	else
		return res.status(statusCode).send({
			error: true,
			data: { message: "Server failed to respond correctly!", ...body },
		});
};

export default Respond;

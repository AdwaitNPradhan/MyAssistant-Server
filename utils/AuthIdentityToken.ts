import Tokens from "../models/Tokens";

const SaveToken = async (sessionToken: string, forId: string) => {
	try {
		const entry = await Tokens.findOne({ for: forId });
		console.log("Found", entry);
		if (entry) {
			await Tokens.updateOne(
				{ _id: entry._id },
				{ $set: { token: sessionToken } }
			);
			return;
		}
		await new Tokens({
			token: sessionToken,
			for: forId,
			blocked: false,
		}).save();
		return;
	} catch (err) {
		console.error(err);
	}
};
const VerifyToken = async (JWT: {
	sess: string;
	did: string;
	iat: number;
	exp: number;
}) => {
	try {
		var session = await Tokens.findOne({ for: JWT.did, token: JWT.sess });
		if (session) return true;
		return false;
	} catch (err) {
		console.error(err);
	}
};
const RemoveToken = async (sessionToken: string, forId: string) => {
	try {
		await Tokens.deleteOne({ token: sessionToken, for: forId });
		return;
	} catch (err) {
		console.error(err);
	}
};
export { SaveToken, VerifyToken, RemoveToken };

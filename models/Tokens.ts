import mongoose from "mongoose";

interface IToken {
	token: string;
	for: string;
	blocked: boolean;
}

const TokenSchema = new mongoose.Schema<IToken>({
	token: { type: String, required: true },
	for: { type: String, required: true, index: true },
	blocked: { type: Boolean, default: false },
});

const Tokens = mongoose.model<IToken>("Tokens", TokenSchema);

export default Tokens;

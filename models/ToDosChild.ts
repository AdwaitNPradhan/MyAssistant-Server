import mongoose from "mongoose";

type todoStatus =
	| "created"
	| "postponed"
	| "working"
	| "abandoned"
	| "rejected"
	| "completed";

interface IToDoChild {
	title: string;
	description: string;
	status: todoStatus;
	completed: boolean;
}

const ToDoChildSchema = new mongoose.Schema<IToDoChild>(
	{
		title: { type: String, required: true },
		description: { type: String },
		status: { type: String, default: "created" },
		completed: { type: Boolean, default: false },
	},
	{
		_id: true,
		timestamps: true,
	}
);

const ToDoChild = mongoose.model<IToDoChild>("ToDoChild", ToDoChildSchema);

export default ToDoChild;

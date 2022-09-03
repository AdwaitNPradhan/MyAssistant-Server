import mongoose from "mongoose";
import ToDoChild from "./ToDosChild";

interface IToDoParent {
	title: string;
	creatorID: string;
	description: string;
	children: [];
}

const ToDoSchema = new mongoose.Schema<IToDoParent>(
	{
		title: { type: String, required: true },
		description: { type: String },
		creatorID: { type: String, required: true },
		children: [ToDoChild.schema],
	},
	{
		timestamps: true,
	}
);

const ToDos = mongoose.model<IToDoParent>("ToDos", ToDoSchema);

export default ToDos;

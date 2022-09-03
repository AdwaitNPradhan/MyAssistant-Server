import mongoose from "mongoose";

type todoStatus = "created" | "postponed" | "" | "completed";

interface IToDoChild {
  id: string;
  title: string;
  description: string;
  status: todoStatus;
  completed: boolean;
}

interface IToDoParent {
  title: string;
  creatorID: string;
  children: IToDoChild[];
}

const ToDoSchema = new mongoose.Schema<IToDoParent>(
  {
    title: { type: String, required: true },
    creatorID: { type: String, required: true },
    children: [],
  },
  {
    timestamps: true,
  }
);

const ToDo = mongoose.model<IToDoParent>("ToDos", ToDoSchema);

export default ToDo;

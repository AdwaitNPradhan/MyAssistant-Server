import mongoose from "mongoose";

interface IUser {
  name: string;
  userName: string;
  email: string;
  password: string;
  avatar?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  avatar: { type: String },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
export const Post = mongoose.model("Post", postSchema);
export const Comment = mongoose.model("Comment", commentSchema);

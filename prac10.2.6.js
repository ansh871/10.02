import React, { useState, useEffect } from "react";
import { signup, login, fetchPosts, createPost, addComment } from "./api";
import "./App.css";

export default function App() {
  const [auth, setAuth] = useState(localStorage.getItem("token"));
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  useEffect(() => { if (auth) loadPosts(); }, [auth]);

  const loadPosts = async () => setPosts((await fetchPosts()).data);

  const handleAuth = async (type) => {
    const { data } = type === "login" ? await login(form) : await signup(form);
    if (data.token) { localStorage.setItem("token", data.token); setAuth(data.token); }
    alert(data.message || "Success");
  };

  const handlePost = async () => {
    await createPost(newPost);
    setNewPost({ title: "", content: "" });
    loadPosts();
  };

  const handleComment = async (id, text) => {
    await addComment(id, text);
    loadPosts();
  };

  if (!auth)
    return (
      <div className="login">
        <h2>🔐 Blog Login</h2>
        <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button onClick={() => handleAuth("login")}>Login</button>
        <button onClick={() => handleAuth("signup")}>Signup</button>
      </div>
    );

  return (
    <div className="app">
      <h1>📝 Blog Platform</h1>
      <div className="new-post">
        <input placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
        <textarea placeholder="Content" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} />
        <button onClick={handlePost}>Publish</button>
      </div>

      {posts.map((p) => (
        <div key={p._id} className="post">
          <h2>{p.title}</h2>
          <p>{p.content}</p>
          <i>by {p.user?.username}</i>
          <CommentBox postId={p._id} onAdd={handleComment} />
        </div>
      ))}
    </div>
  );
}

function CommentBox({ postId, onAdd }) {
  const [text, setText] = useState("");
  return (
    <div className="comment">
      <input placeholder="Add comment..." value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => { onAdd(postId, text); setText(""); }}>💬</button>
    </div>
  );
}

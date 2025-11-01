import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (data) => API.post("/signup", data);
export const login = (data) => API.post("/login", data);
export const fetchPosts = () => API.get("/posts");
export const createPost = (data) => API.post("/posts", data);
export const addComment = (id, text) => API.post(`/posts/${id}/comments`, { text });

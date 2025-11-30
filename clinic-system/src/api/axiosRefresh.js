import axios from "axios";

export const axiosRefresh = axios.create({
  baseURL: "https://localhost:7205/api",
  headers: { "Content-Type": "application/json" },
});

import axios from "axios";

export const api = axios.create({
  // baseURL: config.apiUrl,
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

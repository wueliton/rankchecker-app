import axios from "axios";

export const ApiService = axios.create({
  baseURL: process.env.APIURL ?? "http://localhost/rankchecker-backend",
});

export const ApiServiceFiles = axios.create({
  baseURL: process.env.APIURL ?? "http://localhost/rankchecker-backend",
  responseType: "blob",
});

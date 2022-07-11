import axios from "axios";

export const ApiService = axios.create({
  baseURL: process.env.APIURL ?? "http://localhost:8080",
});

export const ApiServiceFiles = axios.create({
  baseURL: process.env.APIURL ?? "http://localhost:8080",
  responseType: "blob",
});

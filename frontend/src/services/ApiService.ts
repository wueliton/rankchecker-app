import axios from "axios";

export const ApiService = axios.create({
  baseURL: process.env.REACT_APP_APIURL ?? "backend/",
});

export const ApiServiceFiles = axios.create({
  baseURL: process.env.REACT_APP_APIURL ?? "backend/",
  responseType: "blob",
});

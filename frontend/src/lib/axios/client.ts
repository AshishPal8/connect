import axios, { AxiosInstance } from "axios";
import { baseUrl } from "..";

const api: AxiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

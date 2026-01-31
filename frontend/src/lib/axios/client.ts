import axios, { AxiosError, AxiosInstance } from "axios";
import { useUserStore } from "@/store/userStore";
import { baseUrl } from "..";

const api: AxiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(
//   (config) => {
//     const token = useUserStore.getState().token;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: redirecting or refreshing token...");

      useUserStore.getState().logout();

      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }

      // Optional: Try token refresh logic here
      // Example:
      // const originalRequest = error.config;
      // if (!originalRequest._retry) {
      //   originalRequest._retry = true;
      //   const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
      //   localStorage.setItem("token", data.token);
      //   originalRequest.headers.Authorization = `Bearer ${data.token}`;
      //   return api(originalRequest);
      // }

      // if (typeof window !== "undefined") {
      //   localStorage.removeItem("token");
      //   window.location.href = "/signin";
      // }
    }

    if (
      error.code === "ECONNABORTED" ||
      error.message.includes("Network Error")
    ) {
      console.error("Network error or timeout");
    }

    return Promise.reject(error);
  }
);

export default api;

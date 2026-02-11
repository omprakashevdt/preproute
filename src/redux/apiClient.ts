import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({


baseURL: import.meta.env.VITE_API_URL,
withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


let lastErrorMessage = "";
let lastErrorTime = 0;

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    const now = Date.now();

    if (message !== lastErrorMessage || now - lastErrorTime > 1000) {
      toast.error(message, {
        position: "top-right",
      });
      lastErrorMessage = message;
      lastErrorTime = now;
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
    }

    return Promise.reject(error);
  },
);

export default apiClient;

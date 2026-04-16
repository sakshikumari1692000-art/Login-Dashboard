import axios from "axios";

const APIURL = import.meta.env.VITE_BACKEND_API_URL;

const axiosInstance = axios.create({
  baseURL: APIURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
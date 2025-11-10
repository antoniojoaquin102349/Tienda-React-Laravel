import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// Obtener cookie CSRF automáticamente
api.interceptors.request.use(async (config) => {
  if (!document.cookie.includes("XSRF-TOKEN")) {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
  }
  return config;
});

export default api;
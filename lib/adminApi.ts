import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔥 Gắn admin token riêng
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 Token sai → logout admin
adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("admin_accessToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

export default adminApi;

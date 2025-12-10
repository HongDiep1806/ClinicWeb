import axios from "axios";

// Instance chính – có interceptor
const axiosInstance = axios.create({
  baseURL: "https://clinic-management-system-production-2598.up.railway.app",
  headers: { "Content-Type": "application/json" },
});

// Instance RAW – không interceptor → dùng để refresh token
const axiosRaw = axios.create({
  baseURL: "https://clinic-management-system-production-2598.up.railway.app",
});

// =========================
// REQUEST INTERCEPTOR
// =========================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR — AUTO REFRESH TOKEN
// =========================
let isRefreshing = false;
let refreshSubscribers = [];

// Khi refresh xong, gọi lại những request đang chờ
function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Không phải lỗi 401 → trả về luôn
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Tránh loop khi refresh fail
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Không refresh trên chính refresh API hoặc login API
    if (
      originalRequest.url.includes("/Auth/login") ||
      originalRequest.url.includes("/Auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    // Bắt đầu refresh
    isRefreshing = true;

    try {
      const res = await axiosRaw.post("/Auth/refresh", { refreshToken });

      const {
        accessToken,
        refreshToken: newRefreshToken,
        expiresAt,
      } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("expiresAt", expiresAt);
      console.log("Refresh token thành công — token mới đã được cấp!");

      // Báo cho các request đang đợi
      onRefreshed(accessToken);

      // Gắn token vào request cũ
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originalRequest);
    } catch (err) {
      console.error(" Refresh token failed:", err);

      if (err.response && err.response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;

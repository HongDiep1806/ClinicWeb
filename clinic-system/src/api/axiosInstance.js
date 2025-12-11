// import axios from "axios";

// // Instance chính – có interceptor
// const axiosInstance = axios.create({
//   baseURL: "https://clinic-management-system-production-2598.up.railway.app/api",
//   headers: { "Content-Type": "application/json" },
// });

// // Instance RAW – không interceptor → dùng để refresh token
// const axiosRaw = axios.create({
//   baseURL: "https://clinic-management-system-production-2598.up.railway.app/api",
// });

// // =========================
// // REQUEST INTERCEPTOR
// // =========================
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // =========================
// // RESPONSE INTERCEPTOR — AUTO REFRESH TOKEN
// // =========================
// let isRefreshing = false;
// let refreshSubscribers = [];

// // Khi refresh xong, gọi lại những request đang chờ
// function onRefreshed(newToken) {
//   refreshSubscribers.forEach((callback) => callback(newToken));
//   refreshSubscribers = [];
// }

// function subscribeTokenRefresh(callback) {
//   refreshSubscribers.push(callback);
// }

// axiosInstance.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     // Không phải lỗi 401 → trả về luôn
//     if (error.response?.status !== 401) {
//       return Promise.reject(error);
//     }

//     // Tránh loop khi refresh fail
//     if (originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     // Không refresh trên chính refresh API hoặc login API
//     if (
//       originalRequest.url.includes("/Auth/login") ||
//       originalRequest.url.includes("/Auth/refresh")
//     ) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     const refreshToken = localStorage.getItem("refreshToken");
//     if (!refreshToken) {
//       window.location.href = "/login";
//       return Promise.reject(error);
//     }

//     if (isRefreshing) {
//       return new Promise((resolve) => {
//         subscribeTokenRefresh((newToken) => {
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           resolve(axiosInstance(originalRequest));
//         });
//       });
//     }

//     // Bắt đầu refresh
//     isRefreshing = true;

//     try {
//       const res = await axiosRaw.post("/Auth/refresh", { refreshToken });

//       const {
//         accessToken,
//         refreshToken: newRefreshToken,
//         expiresAt,
//       } = res.data;

//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", newRefreshToken);
//       localStorage.setItem("expiresAt", expiresAt);
//       console.log("Refresh token thành công — token mới đã được cấp!");

//       // Báo cho các request đang đợi
//       onRefreshed(accessToken);

//       // Gắn token vào request cũ
//       originalRequest.headers.Authorization = `Bearer ${accessToken}`;

//       return axiosInstance(originalRequest);
//     } catch (err) {
//       console.error(" Refresh token failed:", err);

//       if (err.response && err.response.status === 401) {
//         localStorage.clear();
//         window.location.href = "/login";
//       }

//       return Promise.reject(err);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );

// export default axiosInstance;
import axios from "axios";
import { useAuthStore } from "../stores/auth";

// ================================================
// GLOBAL CONFIG – bắt buộc để cookie được gửi đi
// ================================================
axios.defaults.withCredentials = true;

const BASE_URL = "https://clinic-management-system-production-2598.up.railway.app/api";

// Instance chính
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Instance không dùng interceptors → Dùng refresh token
const axiosRaw = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Helper để lấy store đúng cách
function getAuth() {
  return useAuthStore();
}

// ===================================================
// REQUEST INTERCEPTOR
// ===================================================
axiosInstance.interceptors.request.use(
  (config) => {
    const auth = getAuth();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===================================================
// RESPONSE INTERCEPTOR — TỰ ĐỘNG REFRESH TOKEN
// ===================================================
let isRefreshing = false;
let subscribers = [];

function subscribe(cb) {
  subscribers.push(cb);
}

function onRefreshed(newToken) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const auth = getAuth();
    const original = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // tránh vòng lặp
    if (original._retry) {
      auth.logout();
      return Promise.reject(error);
    }
    original._retry = true;

    // ==== Nếu đã có một refresh đang chạy ====
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribe((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(original));
        });
      });
    }

    // ==== BẮT ĐẦU REFRESH TOKEN ====
    isRefreshing = true;

    try {
      const res = await axiosRaw.post("/Auth/refresh", {}); // KHÔNG gửi refreshToken

      const newAccess = res.data.accessToken;
      const newExpires = res.data.expiresAt;

      // Lưu access token mới
      auth.token = newAccess;
      auth.expiresAt = newExpires;

      onRefreshed(newAccess);

      // Gắn token mới vào request cũ
      original.headers.Authorization = `Bearer ${newAccess}`;

      return axiosInstance(original);
    } catch (err) {
      console.error("🔥 Refresh failed:", err);
      auth.logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;

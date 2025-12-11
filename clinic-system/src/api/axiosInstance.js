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

// ============================
// GLOBAL CONFIG — BẮT BUỘC
// ============================
axios.defaults.withCredentials = true;   // ⭐ Cookie sẽ tự gửi trong mọi request

const axiosInstance = axios.create({
  baseURL: "https://clinic-management-system-production-2598.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ⭐ Cookie đi cùng axiosInstance
});

const axiosRaw = axios.create({
  baseURL: "https://clinic-management-system-production-2598.up.railway.app/api",
  withCredentials: true, // ⭐ Cookie đi cùng axiosRaw
});

// =========================
// REQUEST INTERCEPTOR
// =========================
axiosInstance.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();
    const token = auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR — COOKIE VERSION
// =========================
let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}
function subscribe(cb) {
  subscribers.push(cb);
}

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const auth = useAuthStore();
    const original = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // tránh refresh loop
    if (original._retry) {
      auth.logout();
      return Promise.reject(error);
    }
    original._retry = true;

    // ===== trường hợp refresh =====
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribe((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await axiosRaw.post("/Auth/refresh", {}); // ⭐ KHÔNG gửi refreshToken

      const newAccess = res.data.accessToken;
      const newExpires = res.data.expiresAt;

      // ⭐ Cập nhật access token vào FE
      auth.token = newAccess;
      auth.expiresAt = newExpires;

      onRefreshed(newAccess);

      // gắn token mới vào request cũ
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

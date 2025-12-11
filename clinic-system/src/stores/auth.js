// import { defineStore } from "pinia";

// export const useAuthStore = defineStore("auth", {
//   state: () => ({
//     token: localStorage.getItem("accessToken") || null,
//     user: JSON.parse(localStorage.getItem("user")) || {}, 
//     refreshToken: localStorage.getItem("refreshToken") || null,
//     expiresAt: localStorage.getItem("expiresAt") || null,
//   }),

//   actions: {
//     login(token, user, refreshToken, expiresAt) {
//       this.token = token;
//       this.user = user || {}; 
//       this.refreshToken = refreshToken;
//       this.expiresAt = expiresAt;

//       localStorage.setItem("accessToken", token);
//       localStorage.setItem("user", JSON.stringify(this.user));
//       if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
//       if (expiresAt) localStorage.setItem("expiresAt", expiresAt);
//     },

//     async logout() {
//       try {
//         if (this.refreshToken) {
//           await axios.post("https://clinic-management-system-production-2598.up.railway.app/api/Auth/logout", {
//             refreshToken: this.refreshToken,
//           });
//         }
//       } catch (err) {
//         console.warn("⚠️ Logout API error (vẫn tiếp tục logout FE):", err);
//       }

//       // ========================
//       // ========================
//       this.token = null;
//       this.refreshToken = null;
//       this.user = null;

//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("expiresAt");
//       localStorage.removeItem("user");

//       // localStorage.clear();

//       // ========================
//       // ========================
//       window.location.href = "/login";
//     },

//     restoreSession() {
//       const token = localStorage.getItem("accessToken");
//       const user = localStorage.getItem("user");
//       const refreshToken = localStorage.getItem("refreshToken");
//       const expiresAt = localStorage.getItem("expiresAt");

//       this.token = token || null;
//       this.user = user ? JSON.parse(user) : {}; 
//       this.refreshToken = refreshToken || null;
//       this.expiresAt = expiresAt || null;
//     },
//   },
// });
import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  persist: {
    key: "auth",
    storage: localStorage,
    serializer: {
      serialize(value) {
        // Không bao giờ lưu refreshToken
        const { refreshToken, ...safeData } = value;
        return JSON.stringify(safeData);
      },
      deserialize(value) {
        return JSON.parse(value);
      }
    }
  },

  state: () => ({
    token: null,
    expiresAt: null,
    user: {},
    // ❗ refreshToken sẽ không được dùng nữa (do BE lưu trong cookie)
    refreshToken: null,
  }),

  getters: {
    isTokenExpired(state) {
      if (!state.expiresAt) return true;
      return new Date(state.expiresAt) < new Date();
    },
  },

  actions: {
    // ⭐ LOGIN — FE chỉ nhận accessToken + user + expiresAt
    login(accessToken, user, expiresAt) {
      this.token = accessToken;
      this.expiresAt = expiresAt;
      this.user = user;
      // ❗ Không có refreshToken ở đây
    },

    // ⭐ LOGOUT — FE chỉ gọi API xoá cookie
    async logout() {
      try {
        await axios.post(
          "https://clinic-management-system-production-2598.up.railway.app/api/Auth/logout",
          {},
          { withCredentials: true }    // ❗ cookie gửi lên để BE xoá
        );
      } catch (err) {
        console.warn("Logout API error:", err);
      }

      this.token = null;
      this.expiresAt = null;
      this.user = {};

      localStorage.removeItem("auth");

      window.location.href = "/login";
    },

    // ⭐ REFRESH TOKEN — FE KHÔNG gửi refreshToken nữa
    async refreshAccessToken() {
      try {
        const res = await axios.post(
          "https://clinic-management-system-production-2598.up.railway.app/api/Auth/refresh",
          {},
          { withCredentials: true }   // cookie tự gửi
        );

        this.token = res.data.accessToken;
        this.expiresAt = res.data.expiresAt;

        return true;
      } catch (err) {
        console.error("Refresh token failed:", err);
        this.logout();
        return false;
      }
    },
  },
});

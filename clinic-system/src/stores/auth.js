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
  // ⭐ persist CHỈ lưu token, expiresAt, user → KHÔNG LƯU refreshToken
  persist: {
    paths: ["token", "expiresAt", "user"],
  },

  state: () => ({
    token: null,          // lưu localStorage
    refreshToken: null,   // ⭐ chỉ nằm trong RAM
    expiresAt: null,      
    user: {},             
  }),

  getters: {
    isTokenExpired(state) {
      if (!state.expiresAt) return true;
      return new Date(state.expiresAt) < new Date();
    },
  },

  actions: {
    // ⭐ Lưu token
    login(accessToken, user, refreshToken, expiresAt) {
      this.token = accessToken;
      this.refreshToken = refreshToken;  // KHÔNG lưu ra localStorage
      this.user = user;
      this.expiresAt = expiresAt;
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      this.expiresAt = null;
      this.user = {};

      localStorage.removeItem("pinia-auth"); // xoá persist
      window.location.href = "/login";
    },

    // ⭐ Hàm refresh token (cho router nếu cần)
    async refreshAccessToken() {
      if (!this.refreshToken) return false;

      try {
        const res = await axios.post(
          "https://clinic-management-system-production-2598.up.railway.app/api/Auth/refresh",
          { refreshToken: this.refreshToken }
        );

        this.token = res.data.accessToken;
        this.refreshToken = res.data.refreshToken;
        this.expiresAt = res.data.expiresAt;

        return true;
      } catch {
        this.logout();
        return false;
      }
    },
  },
});

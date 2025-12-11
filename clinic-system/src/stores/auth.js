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
        // Không bao giờ lưu refreshToken (do dùng cookie)
        const { refreshToken, ...safeData } = value;
        return JSON.stringify(safeData);
      },
      deserialize(value) {
        return JSON.parse(value);
      },
    },
  },

  state: () => ({
    token: null,
    expiresAt: null,
    user: {}, // luôn để {}
    refreshToken: null, // không dùng nữa nhưng để có property
  }),

  getters: {
    isTokenExpired(state) {
      if (!state.expiresAt) return true;
      return new Date(state.expiresAt) < new Date();
    },
  },

  actions: {
   decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    this.user = {
      userId: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      fullName: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase(),
    };

  } catch (err) {
    console.error("Decode token error:", err);
    this.user = {};
  }
}
,
    restoreSession() {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const data = JSON.parse(stored);
        this.token = data.token || null;
        this.expiresAt = data.expiresAt || null;

        if (this.token) {
          this.decodeToken(this.token); // ⭐ Lấy lại role khi reload
        }
      }
    },
    // ⭐ FE nhận từ BE: accessToken + expiresAt
    login(accessToken, user, expiresAt) {
      this.token = accessToken;
      this.expiresAt = expiresAt;
      this.user = user || {}; // tránh null
      this.decodeToken(accessToken);
    },

    // ⭐ Logout — chỉ xóa cookie BE & reset state FE
    async logout() {
      try {
        await axios.post(
          "https://clinic-management-system-production-2598.up.railway.app/api/Auth/logout",
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.warn("Logout API error:", err);
      }

      // reset state
      this.token = null;
      this.expiresAt = null;
      this.user = {};

      // vì persist → phải remove đúng key
      localStorage.removeItem("auth");

      window.location.href = "/login";
    },

    // ⭐ Refresh access token từ cookie
    async refreshAccessToken() {
      try {
        const res = await axios.post(
          "https://clinic-management-system-production-2598.up.railway.app/api/Auth/refresh",
          {},
          { withCredentials: true }
        );

        this.token = res.data.accessToken;
        this.expiresAt = res.data.expiresAt;
        this.decodeToken(this.token);

        return true;
      } catch (err) {
        console.error("Refresh token failed:", err);
        await this.logout();
        return false;
      }
    },
  },
});

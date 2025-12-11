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

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("accessToken") || null,
    user: JSON.parse(localStorage.getItem("user")) || {}, 

    // ❗ Refresh token giờ chỉ lưu trong RAM
    refreshToken: null,  

    expiresAt: localStorage.getItem("expiresAt") || null,
  }),

  actions: {
    login(accessToken, user, refreshToken, expiresAt) {
      this.token = accessToken;
      this.user = user || {}; 
      this.refreshToken = refreshToken;  // ➜ Chỉ lưu trong RAM
      this.expiresAt = expiresAt;

      // Lưu vào localStorage (chỉ những thứ an toàn)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(this.user));
      if (expiresAt) localStorage.setItem("expiresAt", expiresAt);

      // ❗ Tuyệt đối KHÔNG lưu refresh token vào localStorage
    },

    async logout() {
      try {
        if (this.refreshToken) {
          await axios.post(
            "https://clinic-management-system-production-2598.up.railway.app/api/Auth/logout",
            { refreshToken: this.refreshToken }
          );
        }
      } catch (err) {
        console.warn("⚠️ Logout API error (vẫn tiếp tục logout FE):", err);
      }

      // Xoá state
      this.token = null;
      this.refreshToken = null;
      this.user = null;

      // Xoá localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("user");

      window.location.href = "/login";
    },

    restoreSession() {
      // Chỉ restore những thứ an toàn từ localStorage
      this.token = localStorage.getItem("accessToken") || null;

      const user = localStorage.getItem("user");
      this.user = user ? JSON.parse(user) : {};

      this.expiresAt = localStorage.getItem("expiresAt") || null;

      // ❗ Refresh token KHÔNG khôi phục được → user reload trang phải login lại
      this.refreshToken = null;
    },
  },
});

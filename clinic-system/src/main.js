// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// import { createPinia } from "pinia";
// import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// import { useAuthStore } from "./stores/auth";
// import { applyTheme } from "./utils/applyTheme";
// import Toast from "vue-toastification";
// import "vue-toastification/dist/index.css";

// // Toast options
// const toastOptions = {
//     position: "top-right",
//     timeout: 2500,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
// };

// // Create APP ONCE
// const app = createApp(App);

// // Create PINIA ONCE
// const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);

// // Use plugins
// app.use(pinia);        // ⭐ Phải dùng pinia này — không được dùng createPinia()
// app.use(router);
// app.use(Toast, toastOptions);

// // Apply theme config
// applyTheme();

// // Restore session BEFORE mount
// // const auth = useAuthStore();
// // ❗ Không cần restoreSession nếu bạn dùng persist, nhưng nếu bạn có logic custom thì giữ lại
// // auth.restoreSession?.();

// // Mount app
// app.mount("#app");
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { useAuthStore } from "./stores/auth";
import { applyTheme } from "./utils/applyTheme";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "axios";

// Toast UI config
const toastOptions = {
  position: "top-right",
  timeout: 2500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const app = createApp(App);

// ========== PINIA ==========
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// ⭐ Restore session ngay sau khi pinia được tạo
const auth = useAuthStore();
auth.restoreSession(); // <----- BẮT BUỘC

// ========== PLUGINS ==========
app.use(router);
app.use(Toast, toastOptions);

// ⭐ Bật cookie toàn app
axios.defaults.withCredentials = true;

// Nếu token hết hạn → thử refresh token
if (auth.token && auth.isTokenExpired) {
  auth.refreshAccessToken();
}

applyTheme();

app.mount("#app");

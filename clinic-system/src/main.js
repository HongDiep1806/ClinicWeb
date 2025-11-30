import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "./stores/auth";
import { applyTheme } from "./utils/applyTheme";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Toast options
const toastOptions = {
    position: "top-right",
    timeout: 2500,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

// Create the app ONCE
const app = createApp(App);

// Apply plugins
app.use(createPinia());
app.use(router);
app.use(Toast, toastOptions);

// Apply theme config
applyTheme();

// Restore session BEFORE mounting router
const auth = useAuthStore();
auth.restoreSession();

// Mount app
app.mount("#app");

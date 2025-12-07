<template>
    <header class="navbar-header">
        <div class="page-container topbar-menu">
            <div class="d-flex align-items-center gap-2">

                <!-- Logo -->
                <a href="index.html" class="logo">

                    <!-- Logo Normal -->
                    <span class="logo-light">
                        <span class="logo-lg"><img src="/img/logo.svg" alt="logo"></span>
                        <span class="logo-sm"><img src="/img/logo-small.svg" alt="small logo"></span>
                    </span>

                    <!-- Logo Dark -->
                    <span class="logo-dark">
                        <span class="logo-lg"><img src="/img/logo-white.svg" alt="dark logo"></span>
                    </span>
                </a>

                <!-- Sidebar Mobile Button -->
                <a id="mobile_btn" class="mobile-btn" href="#sidebar">
                    <i class="ti ti-menu-deep fs-24"></i>
                </a>

                <button class="sidenav-toggle-btn btn border-0 p-0 active" id="toggle_btn2">
                    <i class="ti ti-arrow-right"></i>
                </button>

                <!-- Search -->
                <div class="me-auto d-flex align-items-center header-search d-lg-flex d-none">
                    <!-- Search -->
                    <div class="input-icon-start position-relative me-2">
                        <!-- <span class="input-icon-addon">
                            <i class="ti ti-search"></i>
                        </span>
                        <input type="text" class="form-control shadow-sm" placeholder="Search">
                        <span class="input-icon-addon text-dark shadow fs-18 d-inline-flex p-0 header-search-icon"><i
                                class="ti ti-command"></i></span> -->
                                <h4 class="fw-bold mb-0">Dashboard</h4>
                    </div>
                    <!-- /Search -->
                </div>

            </div>

            <div class="d-flex align-items-center">

                <!-- Search for Mobile -->
                <!-- <div class="header-item d-flex d-lg-none me-2">
                    <button class="topbar-link btn btn-icon" data-bs-toggle="modal" data-bs-target="#searchModal"
                        type="button">
                        <i class="ti ti-search fs-16"></i>
                    </button>
                </div> -->

                <!-- AI Assistance -->
                <!-- <a href="javascript:void(0);" class="btn btn-liner-gradient me-3 d-lg-flex d-none">AI Assistance<i
                        class="ti ti-chart-bubble-filled ms-1"></i></a> -->
<!-- 
                <div class="header-item">
                    <div class="dropdown me-2">
                        <a href="patient-appointments.html" class="btn topbar-link"><i
                                class="ti ti-calendar-due"></i></a>
                    </div>
                </div> -->

                <!-- <div class="header-item">
                    <div class="dropdown me-2">
                        <a href="patient-profile-settings.html" class="btn topbar-link"><i
                                class="ti ti-settings-2"></i></a>
                    </div>
                </div> -->

                <!-- Light/Dark Mode Button -->
                <!-- <div class="header-item d-none d-sm-flex me-2">
                        <button class="topbar-link btn btn-icon topbar-link" id="light-dark-mode" type="button">
                            <i class="ti ti-moon fs-16"></i>
                        </button>
                    </div>
                     -->

                <!-- Notification Dropdown -->
                <div class="header-item">
                    <!-- <div class="dropdown me-3">

                        <button class="topbar-link btn btn-icon topbar-link dropdown-toggle drop-arrow-none"
                            data-bs-toggle="dropdown" data-bs-offset="0,24" type="button" aria-haspopup="false"
                            aria-expanded="false">
                            <i class="ti ti-bell-check fs-16 animate-ring"></i>
                            <span class="notification-badge"></span>
                        </button>

                        
                    </div> -->
                </div>

                <!-- User Dropdown -->
                <!-- User Dropdown -->
                <div class="dropdown profile-dropdown d-flex align-items-center">
                    <a href="javascript:void(0);"
                        class="topbar-link dropdown-toggle drop-arrow-none d-flex align-items-center"
                        data-bs-toggle="dropdown" data-bs-offset="0,22">

                        <!-- Avatar Circle -->
                        <div v-if="authStore.user?.name" class="avatar-circle-small me-2"
                            :style="{ backgroundColor: getColor(authStore.user.name) }">
                            {{ getInitial(authStore.user.name) }}
                        </div>

                        <!-- Fallback Icon -->
                        <div v-else class="avatar-icon-small me-2">
                            <i class="ti ti-user"></i>
                        </div>

                        <span class="online text-success">
                            <i class="ti ti-circle-filled bg-white rounded-circle border border-white"></i>
                        </span>
                    </a>


                    <div class="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">

                        <!-- USER INFO -->
                        <div class="d-flex align-items-center bg-light rounded-3 p-2 mb-2">
                            <div v-if="authStore.user?.name" class="avatar-circle-small me-2"
                                :style="{ backgroundColor: getColor(authStore.user.name) }">
                                {{ getInitial(authStore.user.name) }}
                            </div>

                            <div v-else class="avatar-icon-small me-2">
                                <i class="ti ti-user"></i>
                            </div>

                            <div>
                                <p class="fw-semibold text-dark mb-0">{{ userName }}</p>
                                <span class="fs-13 text-muted">{{ userRole }}</span>
                            </div>
                        </div>

                        <router-link class="dropdown-item" to="/profile">
                            <i class="ti ti-user-circle me-1"></i> Profile Settings
                        </router-link>

                        <!-- <a class="dropdown-item" @click="router.push('/activity-logs')">
                            <i class="ti ti-receipt me-1"></i> Activity Logs
                        </a> -->

                        <a class="dropdown-item" @click="router.push('/help')">
                            <i class="ti ti-help me-1"></i> Help & Support
                        </a>

                        <div class="pt-2 mt-2 border-top">
                            <button class="dropdown-item text-danger" @click="handleLogout">
                                <i class="ti ti-logout me-1 fs-17"></i> Log Out
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import axiosInstance from '../api/axiosInstance'


const router = useRouter();

const authStore = useAuthStore();

// Lấy thông tin từ store (hoặc null nếu chưa có)
const userName = computed(() => authStore.user?.name || "User");
const userRole = computed(() => authStore.user?.role || "Role");

const handleLogout = async () => {
    const auth = useAuthStore();
    await auth.logout();
    router.push("/login");
};
const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : "?";
};

const getColor = (name) => {
  const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};



// Gọi lại script theme
onMounted(() => {
    if (window.setThemeAndSidebarTheme) {
        try {
            window.setThemeAndSidebarTheme();
        } catch (e) {
            console.warn("Theme script reload failed:", e);
        }
    }
});
</script>


<style scoped>
.avatar-circle-small {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 16px;
}

.avatar-icon-small {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #6c757d;
}

.navbar-header {
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
}

.profile-dropdown img {
    object-fit: cover;
}

.topbar-link {
    cursor: pointer;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
}

.dropdown-item i {
    font-size: 17px;
}
</style>

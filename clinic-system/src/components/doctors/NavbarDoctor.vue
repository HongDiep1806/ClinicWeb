<template>
  <!-- Topbar Start -->
  <header class="navbar-header">
    <div class="page-container topbar-menu">

      <!-- LEFT -->
      <div class="d-flex align-items-center gap-2">

        <!-- Logo -->
        <router-link to="/doctor/dashboard" class="logo">

          <span class="logo-light">
            <span class="logo-lg">
              <img src="/img/logo.svg" alt="logo" />
            </span>

            <span class="logo-sm">
              <img src="/img/logo-small.svg" alt="small logo" />
            </span>
          </span>

          <span class="logo-dark">
            <span class="logo-lg">
              <img src="/img/logo-white.svg" alt="dark logo" />
            </span>
          </span>

        </router-link>

        <!-- Sidebar mobile -->
        <a id="mobile_btn" class="mobile-btn" href="#sidebar">
          <i class="ti ti-menu-deep fs-24"></i>
        </a>

        <button class="sidenav-toggle-btn btn border-0 p-0 active" id="toggle_btn2">
          <i class="ti ti-arrow-right"></i>
        </button>

        <!-- Search -->
        <div class="me-auto d-flex align-items-center header-search d-lg-flex d-none">

          <div class="input-icon-start position-relative me-2">

            <span class="input-icon-addon">
              <i class="ti ti-search"></i>
            </span>

            <input
              type="text"
              class="form-control shadow-sm"
              placeholder="Search patient..."
            />

          </div>

        </div>

      </div>

      <!-- RIGHT -->
      <div class="d-flex align-items-center">

        <!-- Mobile search -->
        <div class="header-item d-flex d-lg-none me-2">
          <button
            class="topbar-link btn btn-icon"
            data-bs-toggle="modal"
            data-bs-target="#searchModal"
          >
            <i class="ti ti-search fs-16"></i>
          </button>
        </div>

        <!-- Appointments -->
        <div class="header-item">

          <router-link
            to="/doctor/appointments"
            class="btn topbar-link"
          >
            <i class="ti ti-calendar-due"></i>
          </router-link>

        </div>

        <!-- Profile settings -->
        <div class="header-item">

          <router-link
            to="/doctor/profile"
            class="btn topbar-link"
          >
            <i class="ti ti-settings-2"></i>
          </router-link>

        </div>

        <!-- Dark mode -->
        <div class="header-item d-none d-sm-flex me-2">

          <button
            class="topbar-link btn btn-icon"
            id="light-dark-mode"
            type="button"
          >
            <i class="ti ti-moon fs-16"></i>
          </button>

        </div>

        <!-- Notifications -->
        <div class="header-item">

          <div class="dropdown me-3">

            <button
              class="topbar-link btn btn-icon dropdown-toggle drop-arrow-none"
              data-bs-toggle="dropdown"
            >
              <i class="ti ti-bell-check fs-16 animate-ring"></i>
              <span class="notification-badge"></span>
            </button>

            <div
              class="dropdown-menu dropdown-menu-end dropdown-menu-lg p-0"
              style="min-height: 200px"
            >

              <div class="p-2 border-bottom">
                <h6 class="m-0 fs-16 fw-semibold">
                  Notifications
                </h6>
              </div>

              <div class="p-3 text-center text-muted">
                No new notifications
              </div>

            </div>

          </div>

        </div>

        <!-- USER -->
        <div class="dropdown profile-dropdown d-flex align-items-center">

          <a
            href="javascript:void(0);"
            class="dropdown-toggle drop-arrow-none d-flex align-items-center"
            data-bs-toggle="dropdown"
          >

            <div
              v-if="authStore.user?.fullName"
              class="avatar-circle-small me-2"
              :style="{ backgroundColor: getColor(authStore.user.fullName) }"
            >
              {{ getInitial(authStore.user.fullName) }}
            </div>

            <div v-else class="avatar-icon-small me-2">
              <i class="ti ti-user"></i>
            </div>

          </a>

          <!-- dropdown -->
          <div class="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">

            <div class="d-flex align-items-center bg-light rounded-3 p-2 mb-2">

              <div
                class="avatar-circle-small me-2"
                :style="{ backgroundColor: getColor(authStore.user.fullName) }"
              >
                {{ getInitial(authStore.user.fullName) }}
              </div>

              <div>
                <p class="fw-semibold text-dark mb-0">
                  {{ userName }}
                </p>

                <span class="fs-13 text-muted">
                  Doctor
                </span>
              </div>

            </div>

            <router-link
              class="dropdown-item"
              to="/doctor/profile"
            >
              <i class="ti ti-user-circle me-1"></i>
              Profile
            </router-link>

            <div class="pt-2 mt-2 border-top">

              <button
                class="dropdown-item text-danger"
                @click="handleLogout"
              >
                <i class="ti ti-logout me-1"></i>
                Log Out
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  </header>
</template>

<script setup>
import { computed, onMounted } from "vue"
import { useAuthStore } from "../../stores/auth"
import { useRouter } from "vue-router"

const router = useRouter()
const authStore = useAuthStore()

/* USER */

const userName = computed(() =>
  authStore.user?.fullName || "Doctor"
)

const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : "?"
}

const getColor = (name) => {

  const colors = [
    "#4e73df",
    "#1cc88a",
    "#36b9cc",
    "#f6c23e",
    "#e74a3b",
  ]

  let hash = 0

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

/* LOGOUT */

const handleLogout = async () => {

  await authStore.logout()

  router.push("/login")

}

/* THEME */

onMounted(() => {

  setTimeout(() => {

    if (window.setThemeAndSidebarTheme) {
      window.setThemeAndSidebarTheme()
    }

  }, 150)

})
</script>

<style>

.profile-dropdown > a {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.avatar-circle-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: #fff;
}

.avatar-icon-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
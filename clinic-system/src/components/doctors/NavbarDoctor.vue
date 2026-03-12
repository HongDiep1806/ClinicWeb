<template>
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

        <!-- Mobile sidebar -->
        <a id="mobile_btn" class="mobile-btn" href="#sidebar">
          <i class="ti ti-menu-deep fs-24"></i>
        </a>

        <!-- Sidebar toggle -->
        <button class="sidenav-toggle-btn btn border-0 p-0 active" id="toggle_btn2">
          <i class="ti ti-arrow-right"></i>
        </button>

      </div>

      <!-- RIGHT -->
      <div class="d-flex align-items-center">

        <!-- Appointments -->
        <div class="header-item me-2">

          <router-link to="/doctor/appointments" class="btn topbar-link">
            <i class="ti ti-calendar-due"></i>
          </router-link>

        </div>

        <!-- USER -->
        <div class="dropdown profile-dropdown d-flex align-items-center">

          <a href="javascript:void(0);" class="dropdown-toggle drop-arrow-none d-flex align-items-center"
            data-bs-toggle="dropdown">

            <div v-if="authStore.user?.fullName" class="avatar-circle-small me-2"
              :style="{ backgroundColor: getColor(authStore.user.fullName) }">
              {{ getInitial(authStore.user.fullName) }}
            </div>

            <div v-else class="avatar-icon-small me-2">
              <i class="ti ti-user"></i>
            </div>

          </a>

          <!-- dropdown -->
          <div class="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">

            <div class="d-flex align-items-center bg-light rounded-3 p-2 mb-2">

              <div class="avatar-circle-small me-2" :style="{ backgroundColor: getColor(authStore.user.fullName) }">
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

            <router-link class="dropdown-item" to="/doctor/profile">
              <i class="ti ti-user-circle me-1"></i>
              Profile
            </router-link>

            <div class="pt-2 mt-2 border-top">

              <button class="dropdown-item text-danger" @click="handleLogout">
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

import { computed, onMounted, ref } from "vue"
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

/* DARK MODE */

const isDark = ref(false)

const toggleDarkMode = () => {

  document.body.classList.toggle("dark")

  isDark.value = document.body.classList.contains("dark")

  localStorage.setItem(
    "theme",
    isDark.value ? "dark" : "light"
  )

}

/* LOAD THEME */

onMounted(() => {

  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    document.body.classList.add("dark")
    isDark.value = true
  }

})

</script>

<style>
.profile-dropdown>a {
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
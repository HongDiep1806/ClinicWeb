<template>
  <!-- Topbar Start -->
  <header class="navbar-header">
    <div class="page-container topbar-menu">
      <div class="d-flex align-items-center gap-2">
        <!-- Logo -->
        <router-link to="/patient/home" class="logo">
          <!-- Logo Normal -->
          <span class="logo-light">
            <span class="logo-lg">
              <img :src="logoLightLg" alt="logo" />
            </span>
            <span class="logo-sm">
              <img :src="logoLightSm" alt="small logo" />
            </span>
          </span>

          <!-- Logo Dark -->
          <span class="logo-dark">
            <span class="logo-lg">
              <img :src="logoDarkLg" alt="dark logo" />
            </span>
          </span>
        </router-link>

        <!-- Sidebar Mobile Button -->
        <a id="mobile_btn" class="mobile-btn" href="#sidebar">
          <i class="ti ti-menu-deep fs-24"></i>
        </a>

        <button class="sidenav-toggle-btn btn border-0 p-0 active" id="toggle_btn2" type="button">
          <i class="ti ti-arrow-right"></i>
        </button>

        <!-- Search (Desktop) -->
        <div class="me-auto d-flex align-items-center header-search d-lg-flex d-none">
          <div class="input-icon-start position-relative me-2">
            <span class="input-icon-addon">
              <i class="ti ti-search"></i>
            </span>
            <input type="text" class="form-control shadow-sm" placeholder="Search" />
            <span class="input-icon-addon text-dark shadow fs-18 d-inline-flex p-0 header-search-icon">
              <i class="ti ti-command"></i>
            </span>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center">
        <!-- Search for Mobile -->
        <div class="header-item d-flex d-lg-none me-2">
          <button class="topbar-link btn btn-icon" data-bs-toggle="modal" data-bs-target="#searchModal" type="button">
            <i class="ti ti-search fs-16"></i>
          </button>
        </div>

        <!-- AI Assistance -->
        <a href="javascript:void(0);" class="btn btn-liner-gradient me-3 d-lg-flex d-none">
          AI Assistance <i class="ti ti-chart-bubble-filled ms-1"></i>
        </a>

        <!-- Appointments -->
        <div class="header-item">
          <div class="dropdown me-2">
            <router-link :to="appointmentsTo" class="btn topbar-link">
              <i class="ti ti-calendar-due"></i>
            </router-link>
          </div>
        </div>

        <!-- Settings -->
        <div class="header-item">
          <div class="dropdown me-2">
            <router-link to="/profile" class="btn topbar-link">
              <i class="ti ti-settings-2"></i>
            </router-link>
          </div>
        </div>

        <!-- Light/Dark Mode Button -->
        <div class="header-item d-none d-sm-flex me-2">
          <button class="topbar-link btn btn-icon topbar-link" id="light-dark-mode" type="button">
            <i class="ti ti-moon fs-16"></i>
          </button>
        </div>

        <!-- Notification Dropdown -->
        <div class="header-item">
          <div class="dropdown me-3">
            <button class="topbar-link btn btn-icon topbar-link dropdown-toggle drop-arrow-none"
              data-bs-toggle="dropdown" data-bs-offset="0,24" type="button" aria-haspopup="false" aria-expanded="false">
              <i class="ti ti-bell-check fs-16 animate-ring"></i>
              <span class="notification-badge"></span>
            </button>

            <div class="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg" style="min-height: 300px;">
              <div class="p-2 border-bottom">
                <div class="row align-items-center">
                  <div class="col">
                    <h6 class="m-0 fs-16 fw-semibold">Notifications</h6>
                  </div>
                </div>
              </div>

              <!-- Notification Body -->
              <div class="notification-body position-relative z-2 rounded-0" data-simplebar>
                <!-- Item -->
                <div class="dropdown-item notification-item py-3 text-wrap border-bottom" id="notification-1">
                  <div class="d-flex">
                    <div class="me-2 position-relative flex-shrink-0">
                      <img :src="doctor1" class="avatar-md rounded-circle" alt="" />
                    </div>
                    <div class="flex-grow-1">
                      <p class="mb-0 fw-medium text-dark">Dr. Smith</p>
                      <p class="mb-1 text-wrap">
                        updated the <span class="fw-medium text-dark">surgery</span> schedule.
                      </p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fs-12"><i class="ti ti-clock me-1"></i>4 min ago</span>
                        <div class="notification-action d-flex align-items-center float-end gap-2">
                          <a href="javascript:void(0);" class="notification-read rounded-circle bg-danger"
                            data-bs-toggle="tooltip" data-bs-original-title="Make as Read"
                            aria-label="Make as Read"></a>
                          <button class="btn rounded-circle p-0" data-dismissible="#notification-1" type="button">
                            <i class="ti ti-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Item -->
                <div class="dropdown-item notification-item py-3 text-wrap border-bottom" id="notification-2">
                  <div class="d-flex">
                    <div class="me-2 position-relative flex-shrink-0">
                      <img :src="doctor6" class="avatar-md rounded-circle" alt="" />
                    </div>
                    <div class="flex-grow-1">
                      <p class="mb-0 fw-medium text-dark">Dr. Patel</p>
                      <p class="mb-1 text-wrap">
                        completed a <span class="fw-medium text-dark">follow-up</span> report for patient
                        <span class="fw-medium text-dark">Emily</span>.
                      </p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fs-12"><i class="ti ti-clock me-1"></i>8 min ago</span>
                        <div class="notification-action d-flex align-items-center float-end gap-2">
                          <a href="javascript:void(0);" class="notification-read rounded-circle bg-danger"
                            data-bs-toggle="tooltip" data-bs-original-title="Make as Read"
                            aria-label="Make as Read"></a>
                          <button class="btn rounded-circle p-0" data-dismissible="#notification-2" type="button">
                            <i class="ti ti-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Item -->
                <div class="dropdown-item notification-item py-3 text-wrap border-bottom" id="notification-3">
                  <div class="d-flex">
                    <div class="me-2 position-relative flex-shrink-0">
                      <img :src="doctor2" class="avatar-md rounded-circle" alt="" />
                    </div>
                    <div class="flex-grow-1">
                      <p class="mb-0 fw-medium text-dark">Emily</p>
                      <p class="mb-1 text-wrap">
                        booked an appointment with <span class="fw-medium text-dark">Dr. Patel</span> for
                        <span class="fw-medium text-dark">April 15</span>
                      </p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fs-12"><i class="ti ti-clock me-1"></i>15 min ago</span>
                        <div class="notification-action d-flex align-items-center float-end gap-2">
                          <a href="javascript:void(0);" class="notification-read rounded-circle bg-danger"
                            data-bs-toggle="tooltip" data-bs-original-title="Make as Read"
                            aria-label="Make as Read"></a>
                          <button class="btn rounded-circle p-0" data-dismissible="#notification-3" type="button">
                            <i class="ti ti-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Item -->
                <div class="dropdown-item notification-item py-3 text-wrap" id="notification-4">
                  <div class="d-flex">
                    <div class="me-2 position-relative flex-shrink-0">
                      <img :src="doctor7" class="avatar-md rounded-circle" alt="" />
                    </div>
                    <div class="flex-grow-1">
                      <p class="mb-0 fw-medium text-dark">Amelia</p>
                      <p class="mb-1 text-wrap">
                        completed the <span class="fw-medium text-dark">pre-visit</span> health questionnaire.
                      </p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fs-12"><i class="ti ti-clock me-1"></i>20 min ago</span>
                        <div class="notification-action d-flex align-items-center float-end gap-2">
                          <a href="javascript:void(0);" class="notification-read rounded-circle bg-danger"
                            data-bs-toggle="tooltip" data-bs-original-title="Make as Read"
                            aria-label="Make as Read"></a>
                          <button class="btn rounded-circle p-0" data-dismissible="#notification-4" type="button">
                            <i class="ti ti-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- View All -->
              <div class="p-2 rounded-bottom border-top text-center">
                <router-link :to="notificationsTo" class="text-center text-decoration-underline fs-14 mb-0">
                  View All Notifications
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- User Dropdown -->
        <div class="dropdown profile-dropdown d-flex align-items-center">
          <a href="javascript:void(0);" class="dropdown-toggle drop-arrow-none d-flex align-items-center"
            data-bs-toggle="dropdown" data-bs-offset="0,22">
            <!-- Avatar Circle -->
            <div v-if="authStore.user?.fullName" class="avatar-circle-small me-2"
              :style="{ backgroundColor: getColor(authStore.user.fullName) }">
              {{ getInitial(authStore.user.fullName) }}
            </div>

            <div v-else class="avatar-icon-small me-2">
              <i class="ti ti-user"></i>
            </div>

            <span class="online text-success">
              <i class="ti ti-circle-filled bg-white rounded-circle border border-white"></i>
            </span>
          </a>

          <div class="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
            <div class="d-flex align-items-center bg-light rounded-3 p-2 mb-2">
              <div v-if="authStore.user?.fullName" class="avatar-circle-small me-2"
                :style="{ backgroundColor: getColor(authStore.user.fullName) }">
                {{ getInitial(authStore.user.fullName) }}
              </div>

              <div v-else class="avatar-icon-small me-2">
                <i class="ti ti-user"></i>
              </div>

              <div>
                <p class="fw-semibold text-dark mb-0">{{ userName }}</p>
                <span class="fs-13 text-muted text-capitalize">{{ userRole }}</span>
              </div>
            </div>

            <router-link class="dropdown-item" to="/profile">
              <i class="ti ti-user-circle me-1"></i> Profile Settings
            </router-link>

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
  <!-- Topbar End -->

  <!-- Search Modal -->
  <div class="modal fade" id="searchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content bg-transparent">
        <div class="card shadow-none mb-0">
          <div class="px-3 py-2 d-flex flex-row align-items-center" id="search-top">
            <i class="ti ti-search fs-22"></i>
            <input type="search" class="form-control border-0" placeholder="Search" />
            <button type="button" class="btn p-0" data-bs-dismiss="modal" aria-label="Close">
              <i class="ti ti-x fs-22"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

/* ================= USER INFO ================= */

const userName = computed(() => authStore.user?.fullName || "User");
const userRole = computed(() => authStore.user?.role || "Patient");

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

/* ================= LOGOUT ================= */

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};

/* ================= THEME SCRIPT ================= */

onMounted(() => {
  setTimeout(() => {
    if (window.setThemeAndSidebarTheme) {
      window.setThemeAndSidebarTheme();
    }
  }, 150);
});

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
  font-size: 16px;
}
</style>


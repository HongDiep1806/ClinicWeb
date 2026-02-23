<template>
  <div class="sidebar" id="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div>
        <router-link to="/patient/home" class="logo logo-normal">
          <img src="/img/logo.svg" alt="Logo" />
        </router-link>
        <router-link to="/patient/home" class="logo-small">
          <img src="/img/logo-small.svg" alt="Logo" />
        </router-link>
        <router-link to="/patient/home" class="dark-logo">
          <img src="/img/logo-white.svg" alt="Logo" />
        </router-link>
      </div>

      <button class="sidebar-close">
        <i class="ti ti-x align-middle"></i>
      </button>
    </div>

    <!-- Menu -->
    <div class="sidebar-inner" data-simplebar>
      <div id="sidebar-menu" class="sidebar-menu">
        <ul>
          <li class="menu-title"><span>Main Menu</span></li>

          <li>
            <ul>
              <!-- Dashboard -->
              <li>
                <router-link
                  to="/patient/home"
                  active-class="router-active"
                  exact-active-class="router-active"
                >
                  <i class="ti ti-layout-dashboard"></i>
                  <span>Dashboard</span>
                </router-link>
              </li>

              <!-- Appointments -->
              <li>
                <router-link
                  to="/patient/appointments"
                  active-class="router-active"
                  exact-active-class="router-active"
                >
                  <i class="ti ti-calendar-check"></i>
                  <span>Appointments</span>
                </router-link>
              </li>

              <!-- Doctors -->
              <li>
                <router-link
                  to="/patient/doctors"
                  active-class="router-active"
                  exact-active-class="router-active"
                >
                  <i class="ti ti-stethoscope"></i>
                  <span>Doctors</span>
                </router-link>
              </li>

              <!-- Prescriptions -->
              <li>
                <router-link
                  to="/patient/prescriptions"
                  active-class="router-active"
                  exact-active-class="router-active"
                >
                  <i class="ti ti-prescription"></i>
                  <span>Prescriptions</span>
                </router-link>
              </li>

              <!-- Invoices -->
              <li>
                <router-link
                  to="/patient/invoices"
                  active-class="router-active"
                  exact-active-class="router-active"
                >
                  <i class="ti ti-star"></i>
                  <span>Invoice</span>
                </router-link>
              </li>

              <!-- Settings -->
              <li class="submenu" :class="{ 'submenu-open': isSettingsRoute }">
                <a href="javascript:void(0);">
                  <i class="ti ti-settings"></i>
                  <span>Settings</span>
                  <span class="menu-arrow"></span>
                </a>
                <ul>
                  <li>
                    <router-link
                      to="/patient/profile-settings"
                      active-class="router-active"
                      exact-active-class="router-active"
                    >
                      Profile Settings
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/patient/password-settings"
                      active-class="router-active"
                      exact-active-class="router-active"
                    >
                      Change Password
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/patient/notifications-settings"
                      active-class="router-active"
                      exact-active-class="router-active"
                    >
                      Notifications
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router"

export default {
  name: "SidebarPatient",
  setup() {
    const route = useRoute()

    const isSettingsRoute = [
      "/patient/profile-settings",
      "/patient/password-settings",
      "/patient/notifications-settings",
    ].includes(route.path)

    return { isSettingsRoute }
  },
  mounted() {
    // gọi lại JS theme (GIỐNG ADMIN)
    if (typeof window.setThemeAndSidebarTheme === "function") {
      setTimeout(() => {
        window.setThemeAndSidebarTheme()
      }, 200)
    }

    // mobile close
    if (window.$) {
      const $ = window.$
      $(".sidebar-close").off("click").on("click", function () {
        $("html").removeClass("menu-opened")
        $(".sidebar-overlay").fadeOut()
        $("body").removeClass("slide-nav")
      })
    }
  },
}
</script>
<style scoped>
    /* ===== SAFE ROUTER ACTIVE (KHÔNG GÂY MINI SIDEBAR) ===== */
.sidebar a.router-active {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #fff;
}

.sidebar a.router-active span {
  display: inline !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/* ===== AUTO OPEN SUBMENU SETTINGS ===== */
.sidebar .submenu.submenu-open > ul {
  display: block;
}

</style>
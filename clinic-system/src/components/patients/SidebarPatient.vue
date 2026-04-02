<template>
  <div class="sidebar" id="sidebar">

    <!-- Logo -->
    <div class="sidebar-logo">
      <div>
        <router-link to="/patient/home" class="logo logo-normal">
          <img src="/img/logo.svg" />
        </router-link>

        <router-link to="/patient/home" class="logo-small">
          <img src="/img/logo-small.svg" />
        </router-link>

        <router-link to="/patient/home" class="dark-logo">
          <img src="/img/logo-white.svg" />
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

          <!-- MAIN -->
          <li class="menu-title">
            <span>Main Menu</span>
          </li>

          <li>
            <ul>

              <li>
                <router-link to="/patient/home" active-class="router-active">
                  <i class="ti ti-layout-dashboard"></i>
                  <span>Dashboard</span>
                </router-link>
              </li>

            </ul>
          </li>

          <!-- CLINIC -->
          <li class="menu-title">
            <span>Clinic</span>
          </li>

          <li>
            <ul>

              <li>
                <router-link to="/patient/appointments" active-class="router-active">
                  <i class="ti ti-calendar-check"></i>
                  <span>Appointments</span>
                </router-link>
              </li>

              <li>
                <router-link to="/patient/doctors" active-class="router-active">
                  <i class="ti ti-stethoscope"></i>
                  <span>Doctors</span>
                </router-link>
              </li>

              <li>
                <router-link to="/patient/medical-records" active-class="router-active"
                  :class="{ 'router-active': $route.path.includes('/patient/prescriptions') }">
                  <i class="ti ti-prescription"></i>
                  <span>Medical Records</span>
                </router-link>
              </li>

            </ul>
          </li>

          <!-- SETTINGS -->
          <li class="menu-title">
            <span>Settings</span>
          </li>

          <li>
            <ul>

              <li>
                <router-link to="/patient/profile" active-class="router-active">
                  <i class="ti ti-user"></i>
                  <span>My Profile</span>
                </router-link>
              </li>

            </ul>
          </li>

        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "SidebarPatient",

  mounted() {
    // theme init
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
</style>
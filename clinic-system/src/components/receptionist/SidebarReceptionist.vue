<template>
    <div class="sidebar" id="sidebar">

        <!-- Logo -->
        <div class="sidebar-logo">
            <div>
                <router-link to="/receptionist/dashboard" class="logo logo-normal">
                    <img src="/img/logo.svg" alt="Logo" />
                </router-link>

                <router-link to="/receptionist/dashboard" class="logo-small">
                    <img src="/img/logo-small.svg" alt="Logo" />
                </router-link>

                <router-link to="/receptionist/dashboard" class="dark-logo">
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

                    <!-- MAIN MENU -->
                    <li class="menu-title">
                        <span>Main Menu</span>
                    </li>

                    <li>
                        <ul>

                            <li>
                                <router-link to="/receptionist/dashboard" active-class="router-active"
                                    exact-active-class="router-active">
                                    <i class="ti ti-layout-dashboard"></i>
                                    <span>Receptionist Dashboard</span>
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
                                <router-link to="/receptionist/appointments" active-class="router-active"
                                    exact-active-class="router-active">
                                    <i class="ti ti-calendar-check"></i>
                                    <span>Appointments</span>
                                </router-link>
                            </li>

                            <li>
                                <router-link to="/receptionist/add-appointment" active-class="router-active"
                                    exact-active-class="router-active">
                                    <i class="ti ti-calendar-plus"></i>
                                    <span>Create Appointment</span>
                                </router-link>
                            </li>

                            <li>
                                <router-link to="/receptionist/doctor-schedule" active-class="router-active"
                                    exact-active-class="router-active">
                                    <i class="ti ti-calendar-event"></i>
                                    <span>Doctor Schedule</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/receptionist/patients" active-class="router-active"
                                    exact-active-class="router-active">
                                    <i class="ti ti-users"></i>
                                    <span>Patients</span>
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
                                <router-link to="/receptionist/profile" active-class="router-active"
                                    exact-active-class="router-active">
                                    <i class="ti ti-user"></i>
                                    <span>My Profile</span>
                                </router-link>
                            </li>

                            <!-- <li class="submenu" :class="{ 'submenu-open': isSettingsRoute }">
                                <a href="javascript:void(0);">
                                    <i class="ti ti-settings"></i>
                                    <span>Account Settings</span>
                                    <span class="menu-arrow"></span>
                                </a>

                                <ul>
                                    <li>
                                        <router-link to="/doctor/profile-settings" active-class="router-active"
                                            exact-active-class="router-active">
                                            Profile Settings
                                        </router-link>
                                    </li>

                                    <li>
                                        <router-link to="/doctor/password-settings" active-class="router-active"
                                            exact-active-class="router-active">
                                            Change Password
                                        </router-link>
                                    </li>
                                </ul>

                            </li> -->

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
    name: "SidebarReceptionist",

    setup() {
        const route = useRoute()

        const isSettingsRoute = [
            "/receptionist/profile-settings",
            "/receptionist/password-settings"
        ].includes(route.path)

        return { isSettingsRoute }
    },

    mounted() {

        if (typeof window.setThemeAndSidebarTheme === "function") {
            setTimeout(() => {
                window.setThemeAndSidebarTheme()
            }, 200)
        }

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

.sidebar .submenu.submenu-open>ul {
    display: block;
}
</style>
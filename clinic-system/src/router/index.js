import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth"; // ✅ Thêm dòng này
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import PatientDashboard from "../views/PatientDashboard.vue";
import DoctorDashboard from "../views/DoctorDashboard.vue";
import PatientAppointments from "../views/PatientAppointments.vue";
import Doctors from "../views/Doctors.vue";
import AddDoctor from "../views/AddDoctor.vue";
import DoctorSchedule from "../views/DoctorSchedule.vue";
import EditDoctor from "../views/EditDoctor.vue";
import Patients from "../views/Patients.vue";
import AddPatient from "../views/AddPatient.vue";
import EditPatient from "../views/EditPatient.vue";
import Appointments from "../views/Appointments.vue";
import AddAppointments from "../views/AddAppointments.vue";
import Departments from "../views/Departments.vue";

// ================== CẤU HÌNH ROUTES ==================
const routes = [
  {
    path: "/admin-dashboard",
    name: "admin-dashboard",
    component: HomeView,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/patient-dashboard",
    name: "patient-dashboard",
    component: PatientDashboard,
    meta: { requiresAuth: true, allowRoles: ["patient"] },
  },
  {
    path: "/doctor-dashboard",
    name: "doctor-dashboard",
    component: DoctorDashboard,
    meta: { requiresAuth: true, allowRoles: ["doctor"] },
  },
  {
    path: "/patient-appointments",
    name: "patient-appointments",
    component: PatientAppointments,
    meta: { requiresAuth: true },
  },
  {
    path: "/doctors",
    name: "doctors",
    component: Doctors,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-doctor",
    name: "add-doctor",
    component: AddDoctor,
    meta: { requiresAuth: true },
  },
  {
    path: "/doctor-schedule",
    name: "doctor-schedule",
    component: DoctorSchedule,
    meta: { requiresAuth: true },
  },
  {
  path: "/edit-doctor/:id",
  name: "edit-doctor",
  component: EditDoctor,
  meta: { requiresAuth: true },
},
{
  path: "/patients",
  name: "patients",
  component: Patients,
  meta: { requiresAuth: true },
},
{
  path: "/add-patient",
  name: "add-patient",
  component: AddPatient,
  meta: { requiresAuth: true },
},
{
  path: "/edit-patient/:id",
  name: "edit-patient",
  component: EditPatient,
  meta: { requiresAuth: true },
},
{
  path: "/appointments",
  name: "appointments",
  component: Appointments,
  meta: { requiresAuth: true },
},
{
  path: "/add-appointment",
  name: "add-appointment",
  component: AddAppointments,
  meta: { requiresAuth: true },
},
{
  path: "/departments",
  name: "departments",
  component: Departments,
  meta: { requiresAuth: true },
},





];

// ================== TẠO ROUTER ==================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Khôi phục từ localStorage khi load app
  auth.restoreSession();

  const token = auth.token;
  const refresh = auth.refreshToken;
  const isExpired = auth.isTokenExpired;
  const role = auth.user?.role?.toLowerCase();

  // ===== CASE 1: Không có token -> bắt buộc login =====
  if (!token && !refresh) {
    if (to.name !== "login") return next({ name: "login" });
    return next();
  }

  // ===== CASE 2: Có token nhưng token HẾT HẠN =====
  if (token && isExpired) {
    // Cố refresh
    const refreshed = await auth.refreshAccessToken();

    // Refresh thất bại → quay login
    if (!refreshed) return next({ name: "login" });
  }

  // ===== CASE 3: Có token HỢP LỆ -> Auto redirect theo vai trò =====
  if (token && to.name === "login") {
    if (role === "admin") return next({ name: "admin-dashboard" });
    if (role === "doctor") return next({ name: "doctor-dashboard" });
    return next({ name: "patient-dashboard" });
  }

  // ===== CASE 4: Route cần login nhưng chưa login =====
  if (to.meta.requiresAuth && !auth.token) {
    return next({ name: "login" });
  }
  // ===== CASE 5: Check quyền truy cập theo role =====
  if (to.meta.allowRoles && !to.meta.allowRoles.includes(role)) {
    // Nếu không có quyền → redirect theo đúng dashboard
    if (role === "admin") return next({ name: "admin-dashboard" });
    if (role === "doctor") return next({ name: "doctor-dashboard" });
    return next({ name: "patient-dashboard" });
  }

  // ===== Cho phép đi tiếp =====
  next();
});

export default router;

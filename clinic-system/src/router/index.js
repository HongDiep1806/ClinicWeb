import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import PatientDashboard from "../views/PatientDashboard.vue";
import DoctorDashboard from "../views/DoctorDashboard.vue";
// import PatientAppointments from "../views/PatientAppointment.vue";
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
import Staff from "../views/Staff.vue";
import AddStaff from "../views/AddStaff.vue";
import EditStaff from "../views/EditStaff.vue";
import Profile from "../views/Profile.vue";
//
import Home from "../views/patients/Home.vue";
import PatientAppointments from "../views/patients/PatientAppointments.vue";
import PatientDoctors from "../views/patients/PatientDoctors.vue";
import PatientPrescriptions from "../views/patients/PatientPrescriptions.vue";
import PatientMedicalRecords from "../views/patients/PatientMedicalRecords.vue";
import PatientAddAppointment from "../views/patients/PatientAddAppointment.vue";
import PatientProfile from "../views/patients/PatientProfile.vue";
//
import DoctorHome from "../views/doctors/DoctorHome.vue";
import DoctorAppointments from "../views/doctors/DoctorAppointments.vue";
import DoctorExamine from "../views/doctors/DoctorExamine.vue";
import DoctorMedicalRecordDetail from "../views/doctors/DoctorMedicalRecordDetail.vue";
import DoctorMedicalRecords from "../views/doctors/DoctorMedicalRecords.vue";
import DoctorProfile from "../views/doctors/DoctorProfile.vue";
//
import ForgetPasword from "../views/ForgetPasword.vue";
import ResetPassword from "../views/ResetPassword.vue";
//
import ReceptionistHome from "../views/receptionist/ReceptionistHome.vue";
import ReceptionistAppointments from "../views/receptionist/ReceptionistAppointments.vue";
import ReceptionistAddAppointment from "../views/receptionist/ReceptionistAddAppointment.vue";
import ReceptionistDoctorSchedule from "../views/receptionist/ReceptionistDoctorSchedule.vue";
import ReceptionistProfile from "../views/receptionist/ReceptionistProfile.vue";  
import ReceptionistPatients from "../views/receptionist/ReceptionistPatients.vue";
import ReceptionistAddPatient from "../views/receptionist/ReceptionistAddPatient.vue";
import ReceptionistEditPatient from "../views/receptionist/ReceptionistEditPatient.vue";
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
    path: "/doctor-dashboard",
    name: "doctor-dashboard",
    component: DoctorDashboard,
    meta: { requiresAuth: true, allowRoles: ["doctor"] },
  },
  // {
  //   path: "/patient-appointments",
  //   name: "patient-appointments",
  //   component: PatientAppointments,
  //   meta: { requiresAuth: true },
  // },
  {
    path: "/doctors",
    name: "doctors",
    component: Doctors,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/add-doctor",
    name: "add-doctor",
    component: AddDoctor,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/doctor-schedule",
    name: "doctor-schedule",
    component: DoctorSchedule,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/edit-doctor/:id",
    name: "edit-doctor",
    component: EditDoctor,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/patients",
    name: "patients",
    component: Patients,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/add-patient",
    name: "add-patient",
    component: AddPatient,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/edit-patient/:id",
    name: "edit-patient",
    component: EditPatient,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/appointments",
    name: "appointments",
    component: Appointments,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/add-appointment",
    name: "add-appointment",
    component: AddAppointments,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/departments",
    name: "departments",
    component: Departments,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/staff",
    name: "staff",
    component: Staff,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/add-staff",
    name: "add-staff",
    component: AddStaff,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/edit-staff/:id",
    name: "edit-staff",
    component: EditStaff,
    meta: { requiresAuth: true, allowRoles: ["admin"] },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { requiresAuth: true, allowRoles: ["admin",] },
  },
  {
    path: "/patient/home",
    name: "patient-home",
    component: Home,
    meta: { requiresAuth: true, allowRoles: ["patient"] },
  },  
  {
    path: "/patient/appointments",
    name: "patient-appointments",
    component: PatientAppointments,
    meta: { requiresAuth: true, allowRoles: ["patient"] },
  },
  {
    path: "/patient/doctors",
    name: "patient-doctors",
    component: PatientDoctors,
    meta: { requiresAuth: true, allowRoles: ["patient"] },
  },
  {
    path: "/patient/prescriptions/:appointmentId",
    name: "patient-prescriptions",
    component: PatientPrescriptions,
    meta: { requiresAuth: true, allowRoles: ["patient"] },
  },
  {
    path: "/patient/medical-records",
    name: "patient-medical-records",
    component: PatientMedicalRecords,
    meta: { requiresAuth: true, allowRoles: ["patient"] },

  },
  {
    path: "/patient/add-appointment",
    name: "patient-add-appointment",
    component: PatientAddAppointment,
    meta: { requiresAuth: true, allowRoles: ["patient"] },

  },
  {
    path: "/patient/profile",
    name: "patient-profile",
    component: PatientProfile,
    meta: { requiresAuth: true, allowRoles: ["patient"] },

  },
  {
    path: "/doctor/home",
    name: "doctor-home",
    component: DoctorHome,
    meta: { requiresAuth: true, allowRoles: ["doctor"] },
  },
  {
    path: "/doctor/appointments",
    name: "doctor-appointments",
    component: DoctorAppointments,
    meta: { requiresAuth: true, allowRoles: ["doctor"] },
  },
  {
    path: "/doctor/examine/:id",
    name: "doctor-examine",
    component: DoctorExamine,
    meta: { requiresAuth: true, allowRoles: ["doctor"] },
  },
  {
    path: "/doctor/edit-record/:recordId",
    name: "doctor-edit-record",
    component: DoctorExamine,
    meta: { requiresAuth: true, allowRoles: ["doctor"] },
  },
  {
    path: "/doctor/medical-records/:appointmentId",
    name: "doctor-medical-records",
    component: DoctorMedicalRecordDetail,
    meta: { requiresAuth: true, allowRoles: ["doctor"] },
  },
  {
    path: "/doctor/medical-records",
    name: "doctor-medical-records-list",
    component: DoctorMedicalRecords,
    meta: { requiresAuth: true, allowRoles: ["doctor"] },
  },
  {
    path: "/doctor/profile",
    name: "doctor-profile",
    component: DoctorProfile,
    meta: { requiresAuth: true, allowRoles: ["doctor"] },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgetPasword,
    meta: { requiresAuth: false },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
    meta: { requiresAuth: false },
  },
  {
    path: "/receptionist/dashboard",
    name: "receptionist-dashboard",
    component: ReceptionistHome,
    meta: { requiresAuth: true, allowRoles: ["receptionist"] },
  },
  {
    path: "/receptionist/appointments",
    name: "receptionist-appointments",
    component: ReceptionistAppointments,
    meta: { requiresAuth: true, allowRoles: ["receptionist"] },
  },
  {
    path: "/receptionist/add-appointment",
    name: "receptionist-add-appointment",
    component: ReceptionistAddAppointment,
    meta: { requiresAuth: true, allowRoles: ["receptionist"] },
  },
  {
    path: "/receptionist/doctor-schedule",
    name: "receptionist-doctor-schedule",
    component: ReceptionistDoctorSchedule,
    meta: { requiresAuth: true, allowRoles: ["receptionist"] },
  },
 
  {
    path: "/receptionist/profile",
    name: "receptionist-profile",
    component: ReceptionistProfile,
    meta: { requiresAuth: true, allowRoles: ["receptionist"] },
  },
  {
    path: "/receptionist/patients",
    name: "receptionist-patients",
    component: ReceptionistPatients,
    meta: { requiresAuth: true, allowRoles: ["receptionist"] },
  },
  {
    path: "/receptionist/add-patient",
    name: "receptionist-add-patient",
    component: ReceptionistAddPatient,
    meta: { requiresAuth: true, allowRoles: ["receptionist"] },

  },
  {
    path: "/receptionist/edit-patient/:id",
    name: "receptionist-edit-patient",
    component: ReceptionistEditPatient,
    meta: { requiresAuth: true, allowRoles: ["receptionist"] },
  }
  
];

// ================== TẠO ROUTER ==================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  const token = auth.token;
  const isExpired = auth.isTokenExpired;
  const role = auth.user?.role?.toLowerCase(); // có thể undefined

  // CASE 1 — chưa login
  if (!token) {
    const publicPages = ["login", "forgot-password", "reset-password"];

    if (!publicPages.includes(to.name)) {
      return next({ name: "login" });
    }

    return next();
  }

  // CASE 2 — Token hết hạn → refresh
  if (isExpired) {
    const ok = await auth.refreshAccessToken();
    if (!ok) return next({ name: "login" });

    // Sau refresh → đảm bảo user không bị undefined
    if (!auth.user) auth.user = {};
  }

  // CASE 3 — Đã login → không quay lại trang login
  if (token && to.name === "login") {
    if (role === "admin") return next({ name: "admin-dashboard" });
    if (role === "doctor") return next({ name: "doctor-home" });
    if (role === "receptionist")
      return next({ name: "receptionist-dashboard" });
    return next({ name: "patient-home" });
  }

  // CASE 4 — Route yêu cầu login
  if (to.meta.requiresAuth && !auth.token) {
    return next({ name: "login" });
  }

  // CASE 5 — Kiểm tra role (chỉ khi role có tồn tại)
  if (role && to.meta.allowRoles && !to.meta.allowRoles.includes(role)) {
    if (role === "admin") return next({ name: "admin-dashboard" });
    if (role === "doctor") return next({ name: "doctor-home" });
    if (role === "receptionist")
      return next({ name: "receptionist-dashboard" });
    return next({ name: "patient-home" });
  }

  next();
});

export default router;

<template>
  <div class="main-wrapper">
    <NavbarPatient />
    <SidebarPatient />

    <div class="page-wrapper">
      <div class="content">

        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 class="fw-bold mb-1">Patient Dashboard</h4>
            <p class="text-muted mb-0">
              Welcome back, {{ patientName }}
            </p>
          </div>

          <button class="btn btn-primary" @click="router.push('/patient/book-appointment')">
            <i class="ti ti-plus me-1"></i>
            New Appointment
          </button>
        </div>

        <!-- Summary Cards -->
        <div class="row mb-4">

          <!-- Total -->
          <div class="col-md-4 d-flex">
            <div class="card flex-fill shadow-sm hover-card">
              <div class="card-body d-flex align-items-center">
                <span class="avatar bg-primary text-white me-3">
                  <i class="ti ti-calendar"></i>
                </span>
                <div>
                  <p class="text-muted mb-1">Total Appointments</p>
                  <h3 class="fw-bold mb-0">{{ totalAppointments }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming -->
          <div class="col-md-4 d-flex">
            <div class="card flex-fill shadow-sm hover-card">
              <div class="card-body d-flex align-items-center">
                <span class="avatar bg-info text-white me-3">
                  <i class="ti ti-clock"></i>
                </span>
                <div>
                  <p class="text-muted mb-1">Upcoming Appointment</p>
                  <div v-if="upcomingAppointment">
                    <h6 class="fw-semibold mb-1">
                      {{ formatDate(upcomingAppointment.date) }}
                      <span class="badge bg-info-subtle text-info">
                        {{ getShiftLabel(upcomingAppointment.date) }}
                      </span>
                    </h6>


                  </div>

                  <h6 v-else class="fw-semibold mb-0">
                    No upcoming appointment
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <!-- Last visit -->
          <div class="col-md-4 d-flex">
            <div class="card flex-fill shadow-sm hover-card">
              <div class="card-body d-flex align-items-center">
                <span class="avatar bg-success text-white me-3">
                  <i class="ti ti-history"></i>
                </span>
                <div>
                  <p class="text-muted mb-1">Last Visit</p>
                  <h6 class="fw-semibold mb-0">
                    {{ lastVisit || 'No visit yet' }}
                  </h6>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Upcoming Appointments -->
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Upcoming Appointments</h5>
            <button class="btn btn-sm btn-outline-primary" @click="router.push('/patient/appointments')">
              View All
            </button>
          </div>

          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Shift</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="appointments.length === 0">
                    <td colspan="3" class="text-center text-muted py-4">
                      No appointments found
                    </td>
                  </tr>

                  <tr v-for="item in appointments" :key="item.id">
                    <td>{{ item.doctorName }}</td>
                    <td>{{ formatDate(item.date) }}</td>
                    <td>{{ getShiftLabel(item.date) }}</td>
                    <td>
                      <span :class="getStatusBadge(item.status)">
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- <p class="text-muted fs-13 mt-2 px-3 pb-3">
              This table displays the patient's upcoming scheduled appointments.
            </p> -->
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="footer text-center bg-white p-2 border-top mt-4">
        <p class="mb-0 text-muted">2025 © Clinic Management System</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../../stores/auth"
import { getPatientAppointments } from "../../services/appointmentService"
import NavbarPatient from "../../components/patients/NavbarPatient.vue"
import SidebarPatient from "../../components/patients/SidebarPatient.vue"

const router = useRouter()
const authStore = useAuthStore()

/* ================= USER ================= */

const patientName = computed(() =>
  authStore.user?.fullName || "Patient"
)

/* ================= STATE ================= */

const appointments = ref([])
const totalAppointments = ref(0)
const upcomingAppointment = ref(null)
const lastVisit = ref(null)

/* ================= LOAD DATA ================= */

const loadAppointments = async () => {
  try {
    const patientId = authStore.user?.userId
    if (!patientId) return

    const res = await getPatientAppointments(patientId)
    const data = res.data || []

    appointments.value = data
    totalAppointments.value = data.length

    // Upcoming
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingList = data
      .filter(a => {
        const appointmentDate = new Date(a.date);
        appointmentDate.setHours(0, 0, 0, 0);

        return (
          (a.status === "Pending" || a.status === "Confirmed") &&
          appointmentDate >= today
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    upcomingAppointment.value = upcomingList[0] || null;

    // Last visit
    const completed = data
      .filter(a => a.status === "Completed")
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    lastVisit.value = completed[0]?.date || null

  } catch (err) {
    console.error("Load appointments error:", err)
  }
}
const getStatusBadge = (status) => {
  switch (status) {
    case "Pending":
      return "badge bg-warning-subtle text-warning fw-semibold"

    case "Confirmed":
      return "badge bg-success-subtle text-success fw-semibold"

    case "Completed":
      return "badge bg-info-subtle text-info fw-semibold"

    case "Cancelled":
      return "badge bg-danger-subtle text-danger fw-semibold"

    case "NoShow":
      return "badge bg-secondary-subtle text-secondary fw-semibold"

    default:
      return "badge bg-light text-dark"
  }
}
const getShiftLabel = (dateStr) => {
  if (!dateStr) return "-"

  const date = new Date(dateStr)
  const hour = date.getHours()

  if (hour < 12) {
    return "Morning (08:00 – 12:00)"
  } else {
    return "Afternoon (13:00 – 17:00)"
  }
}
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB") // dd/mm/yyyy
}


onMounted(() => {
  loadAppointments()
})
</script>


<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}
</style>

<template>
  <div class="main-wrapper">
    <NavbarPatient />
    <SidebarPatient />

    <div class="page-wrapper">
      <div class="content">

        <!-- Header -->
        <div class="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-bottom">
          <div class="flex-grow-1">
            <h4 class="fw-bold mb-0">Appointments</h4>
            <p class="text-muted mb-0 small">
              View and track your appointments
            </p>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary" @click="router.push('/patient/dashboard')">
              <i class="ti ti-arrow-left me-1"></i>
              Back
            </button>

            <button class="btn btn-primary" @click="router.push('/patient/book-appointment')">
              <i class="ti ti-plus me-1"></i>
              New Appointment
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row g-2 align-items-end">

              <div class="col-lg-5">
                <label class="form-label mb-1">Search</label>
                <div class="input-icon-start position-relative">
                  <span class="input-icon-addon">
                    <i class="ti ti-search"></i>
                  </span>
                  <input
                    v-model="q"
                    type="text"
                    class="form-control"
                    placeholder="Search doctor, status..."
                  />
                </div>
              </div>

              <div class="col-lg-3">
                <label class="form-label mb-1">From</label>
                <input v-model="fromDate" type="date" class="form-control" />
              </div>

              <div class="col-lg-3">
                <label class="form-label mb-1">To</label>
                <input v-model="toDate" type="date" class="form-control" />
              </div>

              <div class="col-lg-1 d-grid">
                <button class="btn btn-light" @click="resetFilters">
                  Reset
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="card shadow-sm">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="fw-bold mb-0">Your Appointments</h5>
            <span class="text-muted small">
              {{ filteredAppointments.length }} items
            </span>
          </div>

          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table mb-0 align-middle">
                <thead class="table-light">
                  <tr>
                    <th style="min-width:220px">Date & Shift</th>
                    <th style="min-width:220px">Doctor</th>
                    <!-- <th style="min-width:140px">Mode</th> -->
                    <th style="min-width:140px">Status</th>
                    <th class="text-end" style="min-width:120px">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="loading">
                    <td colspan="5" class="text-center py-4 text-muted">
                      Loading...
                    </td>
                  </tr>

                  <tr v-else-if="filteredAppointments.length === 0">
                    <td colspan="5" class="text-center py-4 text-muted">
                      No appointments found
                    </td>
                  </tr>

                  <tr v-else v-for="item in filteredAppointments" :key="item.appointmentId || item.id">
                    <!-- Date & Shift -->
                    <td>
                      <div class="fw-semibold text-dark">
                        {{ formatDate(item.date) }}
                      </div>
                      <div class="d-flex gap-2 mt-1">
                        <span class="badge bg-info-subtle text-info">
                          {{ getShiftLabel(item.date) }}
                        </span>
                        <!-- <span class="text-muted small">
                          {{ formatTime(item.date) }}
                        </span> -->
                      </div>
                    </td>

                    <!-- Doctor -->
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="avatar avatar-md me-2 bg-light d-flex align-items-center justify-content-center rounded-circle">
                          <i class="ti ti-stethoscope"></i>
                        </div>
                        <div>
                          <div class="fw-semibold text-dark">
                            {{ item.doctorName || 'Doctor' }}
                          </div>
                          <div class="text-muted small">
                            {{ item.departmentName || '' }}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Mode (demo) -->
                    <!-- <td>
                      <span class="badge bg-secondary-subtle text-secondary">
                        In-person
                      </span>
                    </td> -->

                    <!-- Status -->
                    <td>
                      <span :class="getStatusBadge(item.status)">
                        {{ item.status }}
                      </span>
                    </td>

                    <!-- Action -->
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-primary" @click="viewDetails(item)">
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Optional note -->
            <div class="px-3 py-3 border-top text-muted small">
              Tip: If you miss your shift, the receptionist may help you book another slot (e.g., afternoon).
            </div>

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

const loading = ref(false)
const appointments = ref([])

const q = ref("")
const fromDate = ref("")
const toDate = ref("")

const parseDateOnly = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  // normalize to date-only for comparisons
  d.setHours(0, 0, 0, 0)
  return d
}

const formatDate = (dateStr) => {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB") // dd/mm/yyyy
}

const formatTime = (dateStr) => {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

const getShiftLabel = (dateStr) => {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  const hour = d.getHours()
  return hour < 12
    ? "Morning (08:00 – 12:00)"
    : "Afternoon (13:00 – 17:00)"
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

const filteredAppointments = computed(() => {
  const keyword = (q.value || "").trim().toLowerCase()
  const from = fromDate.value ? parseDateOnly(fromDate.value) : null
  const to = toDate.value ? parseDateOnly(toDate.value) : null

  return (appointments.value || [])
    .filter(a => {
      // keyword filter
      if (keyword) {
        const hay = `${a.doctorName || ""} ${a.status || ""} ${a.departmentName || ""}`.toLowerCase()
        if (!hay.includes(keyword)) return false
      }

      // date range filter
      const d = parseDateOnly(a.date)
      if (!d) return true
      if (from && d < from) return false
      if (to && d > to) return false

      return true
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // recent first
})

const resetFilters = () => {
  q.value = ""
  fromDate.value = ""
  toDate.value = ""
}

const loadAppointments = async () => {
  try {
    loading.value = true

    const patientId = authStore.user?.userId
    if (!patientId) return

    const res = await getPatientAppointments(patientId)
    appointments.value = res.data || []
  } catch (err) {
    console.error("Load patient appointments error:", err)
  } finally {
    loading.value = false
  }
}

const viewDetails = (item) => {
  // bạn có thể route qua detail page nếu có:
  // router.push(`/patient/appointments/${item.appointmentId}`)
  console.log("View details:", item)
}

onMounted(() => {
  loadAppointments()
})
</script>

<style scoped>
/* optional: match dashboard hover behavior */
</style>
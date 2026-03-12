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
            <!-- <button class="btn btn-outline-secondary" @click="router.push('/patient/dashboard')">
              <i class="ti ti-arrow-left me-1"></i>
              Back
            </button> -->

            <button class="btn btn-primary" @click="openCreateModal">
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
                  <input v-model="q" type="text" class="form-control" placeholder="Search doctor, status..." />
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

                  <tr v-else v-for="item in paginatedAppointments" :key="item.appointmentId || item.id">
                    <!-- Date & Shift -->
                    <td>
                      <div class="fw-semibold text-dark">
                        {{ formatDate(item.date) }}
                      </div>
                      <div class="d-flex gap-2 mt-1">
                        <span :class="getShiftClass(item.date)">
                          {{ getShiftLabel(item.date) }}
                        </span>
                        <!-- <span class="text-muted small">
                          {{ formatTime(item.date) }}
                        </span> -->
                      </div>
                    </td>

                    <!-- Doctor -->
                    <!-- Doctor -->
                    <td>
                      <div class="d-flex align-items-center">
                        <div
                          class="avatar avatar-md bg-light rounded-circle me-2 d-flex align-items-center justify-content-center"
                          style="width: 35px; height: 35px;">
                          <i class="ti ti-stethoscope text-primary"></i>
                        </div>
                        <div>
                          <div class="fw-semibold text-dark">
                            {{ item.doctorName || 'Doctor' }}
                          </div>
                          <div class="text-muted small">
                            {{ item.departmentName || 'No Department' }} <!-- Hiển thị tên phòng ban -->
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

                      <button class="btn btn-sm btn-outline-primary me-2" @click="openView(item)"
                        data-bs-toggle="offcanvas" data-bs-target="#view_details">
                        View
                      </button>

                      <button v-if="item.status === 'Pending'" class="btn btn-sm btn-outline-danger"
                        @click="openCancelModal(item)">
                        Cancel
                      </button>

                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="totalPages > 1" class="d-flex justify-content-end p-3 border-top">
                <nav>
                  <ul class="pagination mb-0">

                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button class="page-link" @click="currentPage--">Prev</button>
                    </li>

                    <li v-for="page in totalPages" :key="page" class="page-item"
                      :class="{ active: currentPage === page }">
                      <button class="page-link" @click="currentPage = page">
                        {{ page }}
                      </button>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button class="page-link" @click="currentPage++">Next</button>
                    </li>

                  </ul>
                </nav>
              </div>
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

  <div class="offcanvas offcanvas-end offcanvas-offset" tabindex="-1" id="view_details">
    <div class="offcanvas-header d-block pb-0 px-0">
      <div class="border-bottom d-flex align-items-center justify-content-between pb-3 px-3">
        <h5 class="offcanvas-title fs-18 fw-bold">
          Appointment Details
          <span class="badge badge-soft-primary border pt-1 px-2 border-primary fw-medium ms-2">
            #AP{{ selectedAppointment?.appointmentId || selectedAppointment?.id }}
          </span>
        </h5>
        <button type="button" class="custom-btn-close" data-bs-dismiss="offcanvas" aria-label="Close">
          <i class="ti ti-x fs-16 text-dark"></i>
        </button>
      </div>
    </div>

    <div class="offcanvas-body pt-0 px-0">
      <h6 class="bg-light py-2 px-3 fw-bold mb-0 text-uppercase fs-12">When & Where</h6>
      <div class="px-3 my-4">

        <!-- Doctor -->
        <div class="bg-light p-3 mb-3 border rounded-3 d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-md me-2 bg-white rounded-circle">
              <i class="ti ti-stethoscope fs-20 text-primary"></i>
            </div>
            <span class="text-dark fw-bold">
              {{ selectedAppointment?.doctorName }}
              <span class="text-body fs-13 fw-normal d-block">
                {{ selectedAppointment?.departmentName || 'No Department' }} <!-- Hiển thị tên phòng ban -->
              </span>
            </span>
          </div>
        </div>

        <div class="detail-list">
          <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
            Appointment On
            <span class="text-body fw-normal">{{ formatDate(selectedAppointment?.date) }}</span>
          </p>

          <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
            Shift
            <span :class="getShiftClass(selectedAppointment?.date)"> {{ getShiftLabel(selectedAppointment?.date) }}
            </span>
          </p>

          <!-- Trong modal khi xem chi tiết appointment -->
          <!-- Trong Modal Chi Tiết -->
          <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
            Department
            <span class="text-body fw-normal">
              {{ selectedAppointment?.departmentName }}
            </span>
          </p>

          <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
            Status
            <span :class="getStatusBadge(selectedAppointment?.status)">
              {{ selectedAppointment?.status }}
            </span>
          </p>
        </div>
      </div>

      <h6 class="bg-light py-2 px-3 fw-bold mb-0 text-uppercase fs-12">Appointment Info</h6>
      <div class="px-3 my-4">
        <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Created At
          <span class="text-body fw-normal small">
            {{ selectedAppointment?.createdAt ? formatDateTime(selectedAppointment.createdAt) : 'N/A' }}
          </span>
        </p>

        <div class="mt-4">
          <label class="text-dark fw-semibold mb-1 fs-14">Reason / Notes</label>
          <div class="p-3 bg-light rounded-3 text-muted fs-13 border-dashed">
            {{ selectedAppointment?.reason || 'No additional notes provided.' }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- modal cancel -->
  <!-- Cancel Confirmation Modal -->
  <div class="modal fade" id="cancelModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title fw-bold text-danger">
            Confirm Cancellation
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          Are you sure you want to cancel this appointment?
          <div class="mt-2 text-muted small">
            This action cannot be undone.
          </div>

          <!-- <div v-if="appointmentToCancel" class="mt-3 small text-muted">
            <strong>{{ formatDate(appointmentToCancel.date) }}</strong>
            - {{ appointmentToCancel.doctorName }}
          </div> -->
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" data-bs-dismiss="modal">
            Keep
          </button>

          <button class="btn btn-danger" @click="confirmCancel">
            Yes, Cancel
          </button>
        </div>

      </div>
    </div>
  </div>
  <!-- end cancel modal -->
  <!-- start create modal -->
  <!-- Create Appointment Modal -->
  <div class="modal fade" id="createModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title fw-bold">Book Appointment</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div class="row g-3">

            <!-- Department -->
            <div class="col-md-6">
              <label class="form-label">Department</label>
              <select v-model="form.departmentId" class="form-select">
                <option value="">Select department</option>
                <option v-for="d in departments" :key="d.departmentId" :value="d.departmentId">
                  {{ d.name }}
                </option>
              </select>
            </div>

            <!-- Date -->
            <div class="col-md-6">
              <label class="form-label">Date</label>
              <input type="date" v-model="form.date" class="form-control"
                :min="new Date().toISOString().split('T')[0]" />
            </div>

            <!-- Shift -->
            <div class="col-md-6">
              <label class="form-label">Shift</label>
              <select v-model="form.shift" class="form-select">
                <option value="">Select shift</option>
                <option value="morning">Morning (08:00 – 12:00)</option>
                <option value="afternoon">Afternoon (13:00 – 17:00)</option>
              </select>
            </div>

            <!-- Doctor -->
            <div class="col-md-6">
              <label class="form-label">Doctor</label>
              <select v-model="form.doctorId" class="form-select">
                <option value="">Select doctor</option>
                <option v-for="doc in doctors" :key="doc.userId" :value="doc.userId">
                  {{ doc.fullName }}
                </option>
              </select>
            </div>

            <!-- Reason -->
            <div class="col-12">
              <label class="form-label">Reason</label>
              <textarea v-model="form.reason" class="form-control" rows="3"></textarea>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary" @click="submitCreate" :disabled="creating">
            {{ creating ? "Booking..." : "Book Appointment" }}
          </button>
        </div>

      </div>
    </div>
  </div>
  <!-- end create modal -->
  <!-- toast -->
  <!-- Toast -->
  <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999">
    <div id="liveToast" class="toast align-items-center text-bg-success border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          {{ toastMessage }}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast">
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../../stores/auth"
import { getPatientAppointments } from "../../services/appointmentService"
import { getDepartments } from "../../services/departmentService"
import NavbarPatient from "../../components/patients/NavbarPatient.vue"
import SidebarPatient from "../../components/patients/SidebarPatient.vue"
import { updateAppointmentStatus } from "../../services/appointmentService"
import { bookAppointment } from "../../services/appointmentService"
import { getDoctorsByWeekday } from "../../services/appointmentService"

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const appointments = ref([])
const departments = ref([]);  // Dùng `ref` để khai báo mảng departments
const appointmentToCancel = ref(null)
const toastMessage = ref("")

const q = ref("")
const fromDate = ref("")
const toDate = ref("")
const selectedAppointment = ref(null)

const openView = (item) => {
  selectedAppointment.value = item
}
const openCancelModal = (item) => {
  appointmentToCancel.value = item

  const modal = new bootstrap.Modal(
    document.getElementById("cancelModal")
  )

  modal.show()
}
const showToast = (message, type = "success") => {
  toastMessage.value = message

  const toastEl = document.getElementById("liveToast")

  toastEl.classList.remove(
    "text-bg-success",
    "text-bg-danger",
    "text-bg-warning"
  )

  toastEl.classList.add(`text-bg-${type}`)

  const toast = new bootstrap.Toast(toastEl)
  toast.show()
}
watch(fromDate, (newFrom) => {
  if (!newFrom || !toDate.value) return

  const from = parseDateOnly(newFrom)
  const to = parseDateOnly(toDate.value)

  if (from && to && from > to) {
    showToast("From date cannot be after To date", "warning")
    fromDate.value = "" // reset field vừa nhập
  }
})

watch(toDate, (newTo) => {
  if (!newTo || !fromDate.value) return

  const from = parseDateOnly(fromDate.value)
  const to = parseDateOnly(newTo)

  if (from && to && to < from) {
    showToast("To date cannot be before From date", "warning")
    toDate.value = "" // reset field vừa nhập
  }
})
const confirmCancel = async () => {
  if (!appointmentToCancel.value) return

  try {
    await updateAppointmentStatus({
      appointmentId: appointmentToCancel.value.appointmentId,
      status: "Cancelled"
    })

    showToast("Appointment cancelled successfully", "success")

    await loadAppointments()

  } catch (error) {
    showToast("Cancel failed. Please try again.", "danger")
  }

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("cancelModal")
  )
  modal.hide()

  appointmentToCancel.value = null
}
const getShiftClass = (dateStr) => {
  if (!dateStr) return "badge bg-light text-dark"

  const hour = new Date(dateStr).getHours()

  return hour < 12
    ? "badge bg-info-subtle text-info fw-bold"      // giữ xanh cũ
    : "badge bg-warning-subtle text-warning fw-bold" // vàng pastel nhẹ
}

// Hàm format ngày giờ giống Admin (UTC to Local)
const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  const utc = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
  return new Date(utc).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

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

const loadDepartments = async () => {
  try {
    const res = await getDepartments()

    const data = res?.data ?? res ?? []

    departments.value = data.filter(
      d => d.status === "Active"
    )

  } catch (err) {
    console.error("Error loading departments:", err)
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
    const patientId = authStore.user?.userId; // Kiểm tra có patientId hợp lệ không
    if (!patientId) {
      console.error("Không tìm thấy patient ID.");
      return;  // Dừng hàm nếu không có patientId
    }

    // Gọi API để lấy danh sách lịch hẹn của bệnh nhân
    const res = await getPatientAppointments(patientId);
    console.log("Dữ liệu lịch hẹn:", res.data); // Kiểm tra xem dữ liệu có hợp lệ không

    // Gán kết quả API vào mảng appointments
    appointments.value = res.data || []; // Nếu không có dữ liệu, sử dụng mảng rỗng
  } catch (err) {
    console.error("Lỗi khi tải lịch hẹn:", err); // Log lỗi nếu có
  }
};

const viewDetails = (item) => {
  // bạn có thể route qua detail page nếu có:
  // router.push(`/patient/appointments/${item.appointmentId}`)
  console.log("View details:", item)
}
const form = ref({
  departmentId: "",
  date: "",
  shift: "",
  doctorId: "",
  reason: ""
})

const doctors = ref([])
const creating = ref(false)
const openCreateModal = () => {
  form.value = {
    departmentId: "",
    date: "",
    shift: "",
    doctorId: "",
    reason: ""
  }

  doctors.value = []

  const modal = new bootstrap.Modal(
    document.getElementById("createModal")
  )
  modal.show()
}
watch(
  () => [form.value.departmentId, form.value.date, form.value.shift],
  async ([departmentId, date, shift]) => {

    if (!departmentId || !date || !shift) {
      doctors.value = []
      form.value.doctorId = ""
      return
    }

    const weekday = new Date(date).getDay()

    try {
      const res = await getDoctorsByWeekday(weekday)

      const data = res.data || []

      doctors.value = data.filter(d =>
        Number(d.departmentId) === Number(departmentId)
      )

      console.log("Doctors filtered:", doctors.value)

    } catch (err) {
      doctors.value = []
    }
  }
)
const buildDateTime = () => {
  const base = new Date(form.value.date)

  if (form.value.shift === "morning") {
    base.setHours(8, 0, 0)
  } else {
    base.setHours(13, 0, 0)
  }

  return base
}
const submitCreate = async () => {
  if (!form.value.departmentId || !form.value.date || !form.value.shift || !form.value.doctorId) {
    showToast("Please fill all required fields", "warning")
    console.log("FORM DATA:", form)
    return
  }

  creating.value = true

  try {
    await bookAppointment({
      patientId: authStore.user.userId,
      doctorId: form.value.doctorId,
      date: buildDateTime(),
      reason: form.value.reason || null
    })

    showToast("Appointment booked successfully", "success")

    await loadAppointments()

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("createModal")
    )
    modal.hide()

  } catch (err) {
    showToast("Booking failed. Please try again.", "danger")
  }

  creating.value = false
}
onMounted(async () => {
  await loadAppointments()
  console.log("Appointments loaded:", appointments.value) // Kiểm tra dữ liệu sau khi tải
  await loadDepartments()
  console.log("Departments loaded:", departments.value)
})
const currentPage = ref(1)
const pageSize = ref(5) // mỗi trang 5 item
const totalPages = computed(() => {
  return Math.ceil(filteredAppointments.value.length / pageSize.value)
})

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAppointments.value.slice(start, end)
})
watch([q, fromDate, toDate], () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* optional: match dashboard hover behavior */
/* Style cho Offcanvas giống Preclinic Admin */
.offcanvas-offset {
  top: 20px;
  bottom: 20px;
  right: 20px;
  border-radius: 12px;
  height: calc(100vh - 40px);
}

.badge-soft-primary {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.fs-18 {
  font-size: 18px;
}

.fs-13 {
  font-size: 13px;
}

.fs-15 {
  font-size: 15px;
}

.custom-btn-close {
  background: #f8f9fa;
  border-radius: 30%;
  padding: 8px;
  border: 1px solid #eee;
}

.border-dashed {
  border: 1px dashed #dee2e6 !important;
}

.fs-12 {
  font-size: 12px;
}

.detail-list p {
  border-bottom: 1px solid #f8f9fa;
  padding-bottom: 8px;
}

.detail-list p:last-child {
  border-bottom: none;
}
</style>
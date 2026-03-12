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
                      <span :class="getShiftClass(upcomingAppointment.date)">
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
        <!-- Table -->
        <div class="card shadow-sm">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="fw-bold mb-0">Your Appointments</h5>
            <span class="text-muted small">
              {{ appointments.length }} items
            </span>
          </div>

          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table mb-0 align-middle">
                <thead class="table-light">
                  <tr>
                    <th style="min-width:220px">Date & Shift</th>
                    <th style="min-width:220px">Doctor</th>
                    <th style="min-width:140px">Status</th>
                    <th class="text-end" style="min-width:120px">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="appointments.length === 0">
                    <td colspan="4" class="text-center py-4 text-muted">
                      No appointments found
                    </td>
                  </tr>

                  <tr v-for="item in sortedAppointments" :key="item.id">
                    <!-- Date & Shift -->
                    <td>
                      <div class="fw-semibold text-dark">
                        {{ formatDate(item.date) }}
                      </div>
                      <div class="d-flex gap-2 mt-1">
                        <span :class="getShiftClass(item.date)">
                          {{ getShiftLabel(item.date) }}
                        </span>
                      </div>
                    </td>

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

                    <!-- Status -->
                    <td>
                      <span :class="getStatusBadge(item.status)">
                        {{ item.status }}
                      </span>
                    </td>

                    <!-- Action -->
                    <td class="text-end">
                      <!-- View Appointment -->
                      <button class="btn btn-sm btn-outline-primary" @click="openView(item)" data-bs-toggle="offcanvas"
                        data-bs-target="#view_details"> View </button>

                      <button v-if="item.status === 'Pending'" class="btn btn-sm btn-outline-danger ms-2"
                        @click="openCancelModal(item)">
                        Cancel
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
  <!-- view appointment details modal -->
  <!-- View Appointment Details Modal -->
  <div class="offcanvas offcanvas-end offcanvas-offset" tabindex="-1" id="view_details">
    <div class="offcanvas-header d-block pb-0 px-0">
      <div class="border-bottom d-flex align-items-center justify-content-between pb-3 px-3">
        <h5 class="offcanvas-title fs-18 fw-bold">
          Appointment Details
          <!-- <span class="badge badge-soft-primary border border-primary fw-medium ms-2">
            #AP{{ selectedAppointment?.appointmentId || selectedAppointment?.id }}
          </span> -->
          <span class="badge badge-soft-primary border pt-1 px-2 border-primary fw-medium ms-2">
            #AP{{ selectedAppointment?.appointmentId || selectedAppointment?.id }}
          </span>
        </h5>
        <button type="button" class="btn-close custom-btn-close opacity-100" data-bs-dismiss="offcanvas">
          <i class="ti ti-x bg-white fs-16 text-dark"></i>
        </button>
      </div>
    </div>

    <div class="offcanvas-body pt-0 px-0">
      <h6 class="bg-light py-2 px-3 fw-bold mb-0 text-uppercase fs-12">When & Where</h6>
      <div class="px-3 my-4">
        <div class="bg-light p-3 mb-3 border rounded-3 d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-md me-2 bg-white rounded-circle">
              <i class="ti ti-stethoscope fs-20 text-primary"></i>
            </div>
            <span class="text-dark fw-bold">{{ selectedAppointment?.doctorName }}<span
                class="text-body fs-13 fw-normal d-block">
                {{ selectedAppointment?.departmentName || 'No Department' }} <!-- Hiển thị tên phòng ban -->
              </span></span>
          </div>
        </div>

        <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Appointment On
          <span class="text-body fw-normal">{{ formatDate(selectedAppointment?.date) }}</span>
        </p>
        <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Shift
          <span :class="getShiftClass(selectedAppointment?.date)">
            {{ getShiftLabel(selectedAppointment?.date) }}
          </span>
        </p>

        <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Status
          <span :class="getStatusBadge(selectedAppointment?.status)">
            {{ selectedAppointment?.status }}
          </span>
        </p>

        <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Department
          <span class="text-body fw-normal">{{ selectedAppointment?.departmentName || 'No Department' }}</span>
        </p>
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
  <!-- end view modal -->
  <!-- start edit modal -->
  <!-- Modal Edit Appointment -->
  <div class="modal fade" id="edit_modal" v-show="editModalVisible">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content" v-if="selectedAppointment">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">
            Edit Appointment
            <span class="badge badge-soft-primary border border-primary fw-medium ms-2">
              #AP{{ selectedAppointment?.appointmentId || selectedAppointment?.id }}
            </span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click="closeEditModal"></button>
        </div>

        <div class="modal-body">
          <!-- Doctor -->
          <div class="mb-3">
            <label class="fw-semibold">Doctor</label>
            <div class="form-control bg-light">
              {{ selectedAppointment.doctorName }} — {{ selectedAppointment.departmentName }}
            </div>
          </div>

          <!-- Patient -->
          <div class="mb-3">
            <label class="fw-semibold">Patient</label>
            <div class="form-control bg-light">
              {{ selectedAppointment.patientName }}
            </div>
          </div>

          <!-- Date -->
          <div class="mb-3">
            <label class="fw-semibold">Appointment Date</label>
            <div class="form-control bg-light">
              {{ formatDate(selectedAppointment.date) }}
            </div>
          </div>

          <!-- Created At -->
          <div class="mb-3">
            <label class="fw-semibold">Created At</label>
            <div class="form-control bg-light">
              {{ formatDateTime(selectedAppointment.createdAt) }}
            </div>
          </div>

          <!-- Status Dropdown -->
          <div class="mb-3">
            <label class="fw-semibold">Status</label>
            <select class="form-select" v-model="selectedAppointment.status">
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="NoShow">NoShow</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" data-bs-dismiss="modal" @click="closeEditModal">Cancel</button>
          <button class="btn btn-primary" @click="submitEdit">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
  <!-- end edit modal -->
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
  <!-- toast -->
  <!-- Toast -->
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div id="appToast" class="toast align-items-center text-bg-success border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body" id="toastMessage">
          Success
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../../stores/auth"
import {
  getPatientAppointments,
  updateAppointmentStatus
} from "../../services/appointmentService"
import NavbarPatient from "../../components/patients/NavbarPatient.vue"
import SidebarPatient from "../../components/patients/SidebarPatient.vue"
import { getDepartments } from "../../services/departmentService"

const router = useRouter()
const authStore = useAuthStore()

/* ================= USER ================= */

const patientName = computed(() =>
  authStore.user?.fullName || "Patient"
)
const appointmentToCancel = ref(null)

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
const getShiftClass = (dateStr) => {
  if (!dateStr) return "badge bg-light text-dark"

  const hour = new Date(dateStr).getHours()

  return hour < 12
    ? "badge bg-info-subtle text-info fw-bold"
    : "badge bg-warning-subtle text-warning fw-bold"
}
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB") // dd/mm/yyyy
}
const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString("en-GB")  // dd/mm/yyyy, hh:mm:ss
}
const selectedAppointment = ref(null); // Khai báo selectedAppointment bằng ref để nó có thể được theo dõi và cập nhật khi thay đổi

const openView = (item) => {
  selectedAppointment.value = item; // Gán dữ liệu vào selectedAppointment
};
const openEdit = (item) => {
  selectedAppointment.value = item;  // Lưu lịch hẹn vào selectedAppointment để hiển thị thông tin trong modal
};

const submitEdit = async () => {
  try {
    await updateAppointmentStatus({
      appointmentId: selectedAppointment.value.appointmentId,
      status: selectedAppointment.value.status
    });

    await loadAppointments(); // reload lại data cho chắc

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("edit_modal")
    );
    modal.hide();

    console.log("Appointment updated successfully!");
  } catch (error) {
    console.error("Failed to update appointment:", error);
  }
};
const showToast = (message, type = "success") => {
  const toastEl = document.getElementById("appToast");
  const toastBody = document.getElementById("toastMessage");

  toastBody.innerText = message;

  // đổi màu theo type
  toastEl.classList.remove("text-bg-success", "text-bg-danger");
  toastEl.classList.add(
    type === "success" ? "text-bg-success" : "text-bg-danger"
  );

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
};
const openCancelModal = (item) => {
  appointmentToCancel.value = item

  const modal = new bootstrap.Modal(
    document.getElementById("cancelModal")
  )

  modal.show()
}
const confirmCancel = async () => {
  if (!appointmentToCancel.value) return

  try {
    await updateAppointmentStatus({
      appointmentId: appointmentToCancel.value.appointmentId,
      status: "Cancelled"
    })

    await loadAppointments()

    showToast("Appointment cancelled successfully!", "success")

  } catch (error) {
    console.error("Cancel failed:", error)
    showToast("Failed to cancel appointment.", "error")
  }

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("cancelModal")
  )
  modal.hide()

  appointmentToCancel.value = null
}

const cancelAppointment = async (item) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this appointment?"
  );

  if (!confirmed) return;

  try {
    await updateAppointmentStatus({
      appointmentId: item.appointmentId,
      status: "Cancelled"
    });

    await loadAppointments();

    showToast("Appointment cancelled successfully!", "success");

  } catch (error) {
    console.error("Cancel failed:", error);
    showToast("Failed to cancel appointment.", "error");
  }
};
const sortedAppointments = computed(() => {
  return [...appointments.value].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )
})



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

.badge-soft-primary {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}
</style>

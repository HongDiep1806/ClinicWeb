<template>
    <div class="main-wrapper">
        <NavbarPatient />
        <SidebarPatient />

        <div class="page-wrapper">
            <div class="content">

                <!-- Header -->
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h4 class="fw-bold mb-1">Doctors</h4>
                        <p class="text-muted mb-0 small">
                            Browse and choose your preferred doctor
                        </p>
                    </div>
                </div>

                <!-- Filter -->
                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <div class="col-md-4">
                            <label class="form-label mb-1">Department</label>
                            <select v-model="selectedDepartment" class="form-select">
                                <option value="">All Departments</option>
                                <option v-for="d in departments" :key="d.departmentId" :value="d.departmentId">
                                    {{ d.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Doctors List -->
                <div class="card shadow-sm mb-3" v-for="doc in filteredDoctors" :key="doc.userId">
                    <div class="card-body d-flex align-items-center justify-content-between">

                        <div class="d-flex align-items-center">
                            <div class="avatar rounded-circle text-white fw-semibold me-3 d-flex align-items-center justify-content-center"
                                :style="{ backgroundColor: getColor(doc.fullName), width: '45px', height: '45px' }">
                                {{ getInitial(doc.fullName) }}
                            </div>

                            <div>
                                <div class="fw-bold">{{ doc.fullName }}</div>
                                <div class="text-muted small">{{ doc.departmentName }}</div>
                                <div class="text-muted small">Gender: {{ doc.gender }}</div>
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary" @click="openDoctorDetail(doc)"
                                data-bs-toggle="offcanvas" data-bs-target="#doctor_detail">
                                View
                            </button>

                            <button class="btn btn-sm btn-primary" @click="goToBook(doc)">
                                Book
                            </button>
                        </div>

                    </div>
                </div>
                <div class="d-flex justify-content-center mt-4">

                    <nav>
                        <ul class="pagination">

                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="currentPage--">
                                    Prev
                                </button>
                            </li>

                            <li v-for="p in totalPages" :key="p" class="page-item"
                                :class="{ active: currentPage === p }">

                                <button class="page-link" @click="currentPage = p">
                                    {{ p }}
                                </button>

                            </li>

                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">

                                <button class="page-link" @click="currentPage++">
                                    Next
                                </button>

                            </li>

                        </ul>
                    </nav>

                </div>

            </div>

            <div class="footer text-center bg-white p-2 border-top mt-4">
                <p class="mb-0 text-muted">2025 © Clinic Management System</p>
            </div>
        </div>
    </div>

    <!-- Doctor Detail -->
    <div class="offcanvas offcanvas-end offcanvas-offset" tabindex="-1" id="doctor_detail">
        <div class="offcanvas-header border-bottom d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Doctor Profile</h5>
            <button type="button" class="custom-btn-close" data-bs-dismiss="offcanvas">
                <i class="ti ti-x"></i>
            </button>
        </div>

        <div class="offcanvas-body">

            <!-- Avatar -->
            <div class="text-center mb-4">
                <div class="avatar rounded-circle text-white fw-bold mx-auto mb-3 d-flex align-items-center justify-content-center"
                    :style="{
                        backgroundColor: getColor(selectedDoctor?.fullName || ''),
                        width: '90px',
                        height: '90px',
                        fontSize: '32px'
                    }">
                    {{ getInitial(selectedDoctor?.fullName) }}
                </div>

                <h5 class="fw-bold mb-1">
                    {{ selectedDoctor?.fullName }}
                </h5>

                <span class="badge bg-light text-dark border px-3 py-2 rounded-pill">
                    {{ selectedDoctor?.departmentName }}
                </span>
            </div>

            <!-- Info -->
            <ul class="list-group mb-4">
                <li class="list-group-item d-flex justify-content-between">
                    <span class="text-muted">Gender</span>
                    <span class="fw-medium">{{ selectedDoctor?.gender }}</span>
                </li>

                <li class="list-group-item d-flex justify-content-between">
                    <span class="text-muted">Status</span>
                    <span class="badge bg-success-subtle text-success">
                        Available
                    </span>
                </li>
            </ul>

            <!-- Working Schedule -->
            <div class="mb-4">
                <label class="fw-semibold mb-2">Working Schedule</label>

                <div v-if="doctorSchedules.length === 0" class="text-muted small">
                    No working schedule assigned
                </div>

                <div v-for="s in doctorSchedules" :key="s.scheduleId"
                    class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <span class="fw-medium">
                        {{ s.dayOfWeek }}
                    </span>

                    <span :class="getShiftClass(s.startTime)">
                        {{ getShiftLabel(s.startTime) }}
                    </span>
                </div>
            </div>

            <div class="d-grid">
                <button class="btn btn-primary" @click="goToBook(selectedDoctor)">
                    Book Appointment
                </button>
            </div>

        </div>
    </div>

    <!-- Book Modal -->
    <!-- Book Modal -->
    <div class="modal fade" id="bookModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title fw-bold">
                        Book with {{ bookingDoctor?.fullName }}
                    </h5>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">

                    <div class="mb-3">
                        <label class="form-label">Date</label>
                        <input type="date" v-model="form.date" class="form-control"
                            :min="new Date().toISOString().split('T')[0]" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Shift</label>

                        <select v-model="form.shift" class="form-select">

                            <!-- placeholder -->
                            <option value="" disabled>
                                Select shift
                            </option>

                            <!-- shift hợp lệ -->
                            <option v-if="availableShift" :value="availableShift">
                                {{ availableShift === "morning"
                                    ? "Morning (08:00 - 12:00)"
                                    : "Afternoon (13:00 - 17:00)" }}
                            </option>

                        </select>

                        <div v-if="!availableShift && form.date" class="text-danger small mt-1">
                            Doctor not available on this day
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Reason</label>
                        <textarea v-model="form.reason" class="form-control"></textarea>
                    </div>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-light" data-bs-dismiss="modal">
                        Cancel
                    </button>
                    <button class="btn btn-primary" @click="submitBooking">
                        Book Appointment
                    </button>
                </div>

            </div>
        </div>
    </div>
    <!-- end book modal -->
    <!-- success toast -->

    <div class="toast-container position-fixed top-0 end-0 p-3">

        <div id="successToast" class="toast align-items-center text-bg-success border-0">
            <div class="d-flex">
                <div class="toast-body">
                    Appointment booked successfully
                </div>
                <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
        <!-- end success toast -->

        <!-- warning toast -->
        <div id="warningToast" class="toast align-items-center text-bg-danger border-0" data-bs-delay="2500">
            <div class="d-flex">
                <div class="toast-body">
                    Please select date and shift
                </div>
                <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
        <!-- end warning toast -->
        <!-- error toast -->
        <div id="errorToast" class="toast align-items-center text-bg-danger border-0" data-bs-delay="3000">
            <div class="d-flex">
                <div class="toast-body">
                    You already have an appointment on this day
                </div>
                <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
        <!-- end error toast -->

    </div>


</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import NavbarPatient from "../../components/patients/NavbarPatient.vue"
import SidebarPatient from "../../components/patients/SidebarPatient.vue"
import { getAllDoctors } from "../../services/doctorService"
import { getDepartments } from "../../services/departmentService"
import { getScheduleByDoctor } from "../../services/scheduleService"
import { bookAppointment } from "../../services/appointmentService"
import { useAuthStore } from "../../stores/auth"
import { watch } from "vue"



const authStore = useAuthStore()

const form = ref({
    date: "",
    shift: "",
    reason: ""
})
const showErrorToast = (msg) => {

    const toastEl = document.getElementById("errorToast")

    if (!toastEl) return

    toastEl.querySelector(".toast-body").innerText = msg

    const toast = new bootstrap.Toast(toastEl)

    toast.show()
}

const buildDateTime = () => {
    const date = form.value.date

    if (form.value.shift === "morning") {
        return `${date}T08:00:00`
    }

    return `${date}T13:00:00`
}

const submitBooking = async () => {

    if (!form.value.date || !form.value.shift) {
        new bootstrap.Toast(
            document.getElementById("warningToast")
        ).show()
        return
    }

    try {

        await bookAppointment({
            patientId: authStore.user.userId,
            doctorId: bookingDoctor.value.userId,
            date: buildDateTime(),
            reason: form.value.reason || null
        })

        bootstrap.Modal.getInstance(
            document.getElementById("bookModal")
        ).hide()

        new bootstrap.Toast(
            document.getElementById("successToast")
        ).show()

    } catch (err) {

        let message = "Booking failed"

        if (err?.response?.data) {

            const text = err.response.data.toString().toLowerCase()

            if (text.includes("already")) {
                message = "You already have an appointment on this day"
            }
        }

        showErrorToast(message)
    }
}
const availableShift = computed(() => {
    if (!form.value.date || !bookingDoctor.value) return null

    const weekday = new Date(form.value.date)
        .toLocaleString("en-US", { weekday: "long" })

    const schedule = doctorSchedules.value.find(
        s => s.dayOfWeek === weekday
    )

    if (!schedule) return null

    return schedule.startTime.startsWith("08")
        ? "morning"
        : "afternoon"
})

const router = useRouter()

const doctors = ref([])
const currentPage = ref(1)
const pageSize = 5
const departments = ref([])
const selectedDepartment = ref("")
const selectedDoctor = ref(null)
const doctorSchedules = ref([])

const orderedDays = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
]

const loadDoctors = async () => {
    const res = await getAllDoctors()
    const map = new Map()

        ; (res.data || []).forEach(d => {
            if (!map.has(d.userId)) {
                map.set(d.userId, {
                    ...d,
                    isActive: d.status === "Active",
                    departmentName:
                        departments.value.find(x => x.departmentId == d.departmentId)?.name || "N/A"
                })
            }
        })

    doctors.value = [...map.values()].filter(d => d.isActive)
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

const filteredDoctors = computed(() => {

    let data = doctors.value

    if (selectedDepartment.value) {
        data = data.filter(
            d => Number(d.departmentId) === Number(selectedDepartment.value)
        )
    }

    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize

    return data.slice(start, end)
})
const totalPages = computed(() => {

    let data = doctors.value

    if (selectedDepartment.value) {
        data = data.filter(
            d => Number(d.departmentId) === Number(selectedDepartment.value)
        )
    }

    return Math.ceil(data.length / pageSize)
})
watch(selectedDepartment, () => {
    currentPage.value = 1
})

const openDoctorDetail = async (doc) => {
    selectedDoctor.value = doc

    const res = await getScheduleByDoctor(doc.userId)
    doctorSchedules.value = (res.data || []).sort(
        (a, b) =>
            orderedDays.indexOf(a.dayOfWeek) -
            orderedDays.indexOf(b.dayOfWeek)
    )
}

const getShiftLabel = (startTime) => {
    if (!startTime) return ""
    return startTime.startsWith("08")
        ? "Morning (08:00 - 12:00)"
        : "Afternoon (13:00 - 17:00)"
}

const getShiftClass = (startTime) => {
    if (!startTime) return "badge bg-light text-dark"

    return startTime.startsWith("08")
        ? "badge bg-info-subtle text-info fw-semibold"
        : "badge bg-warning-subtle text-warning fw-semibold"
}

const getInitial = (name) =>
    name?.charAt(0).toUpperCase() || "?"

const getColor = (name) => {
    const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"]
    let hash = 0
    for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
}

const bookingDoctor = ref(null)

const goToBook = async (doc) => {
    bookingDoctor.value = doc

    // reset form
    form.value = {
        date: "",
        shift: "",
        reason: ""
    }

    const res = await getScheduleByDoctor(doc.userId)
    doctorSchedules.value = res.data || []

    const modal = new bootstrap.Modal(
        document.getElementById("bookModal")
    )
    modal.show()
}

onMounted(async () => {
    await loadDepartments()
    await loadDoctors()
})
watch(availableShift, (val) => {
    form.value.shift = val || ""
})
</script>

<style scoped>
.offcanvas-offset {
    top: 20px;
    bottom: 20px;
    right: 20px;
    border-radius: 12px;
    height: calc(100vh - 40px);
}

.custom-btn-close {
    background-color: #f8f9fa;
    border-radius: 50%;
    padding: 8px;
    border: 1px solid #eee;
}
</style>
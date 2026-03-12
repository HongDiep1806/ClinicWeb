<template>

    <div class="main-wrapper">

        <NavbarDoctor />
        <SidebarDoctor />

        <div class="page-wrapper">

            <div class="content">

                <!-- HEADER -->
                <div class="d-flex align-items-center justify-content-between mb-4">

                    <div>
                        <h4 class="fw-bold mb-0">
                            Appointments
                        </h4>

                        <p class="text-muted mb-0">
                            Manage your patient appointments
                        </p>
                    </div>

                </div>

                <!-- FILTER -->
                <div class="card shadow-sm mb-3">

                    <div class="card-body">

                        <div class="row g-2">

                            <div class="col-md-4">

                                <input v-model="search" type="text" class="form-control"
                                    placeholder="Search patient...">

                            </div>

                            <div class="col-md-3">

                                <select v-model="statusFilter" class="form-select">

                                    <option value="">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="NoShow">No Show</option>

                                </select>

                            </div>

                            <div class="col-md-3">

                                <input type="date" v-model="dateFilter" class="form-control" />

                            </div>

                            <div class="col-md-2">

                                <button class="btn btn-primary w-100" @click="clearFilter">
                                    Reset
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                <!-- TABLE -->

                <div class="card shadow-sm">

                    <div class="card-body p-0">

                        <div class="table-responsive">

                            <table class="table table-hover mb-0">

                                <thead class="table-light">

                                    <tr>

                                        <th>Date</th>
                                        <th>Patient</th>
                                        <th>Status</th>
                                        <th>Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    <tr v-for="a in paginatedAppointments" :key="a.appointmentId">

                                        <td>
                                            {{ formatDate(a.date) }} - {{ formatTime(a.date) }}
                                        </td>

                                        <td>

                                            <div class="d-flex align-items-center">

                                                <div class="avatar bg-primary-subtle text-primary me-2">
                                                    <i class="ti ti-user"></i>
                                                </div>

                                                <div>

                                                    <div class="fw-semibold">
                                                        {{ a.patientName || "Patient" }}
                                                    </div>

                                                    <div class="text-muted small">
                                                        {{ a.patientPhone }}
                                                    </div>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <span :class="getStatusBadge(a.status)">
                                                {{ a.status }}
                                            </span>


                                        </td>

                                        <td class="text-start">

                                            <button class="btn btn-sm btn-outline-secondary me-2" @click="openView(a)"
                                                data-bs-toggle="offcanvas" data-bs-target="#view_details">
                                                View
                                            </button>

                                            <router-link v-if="a.status === 'Confirmed'"
                                                :to="`/doctor/examine/${a.appointmentId}`"
                                                class="btn btn-sm btn-outline-primary">
                                                Examine
                                            </router-link>

                                        </td>

                                    </tr>

                                    <tr v-if="filteredAppointments.length === 0">

                                        <td colspan="5" class="text-center text-muted py-4">
                                            No appointments found
                                        </td>

                                    </tr>

                                </tbody>

                            </table>
                            <div v-if="totalPages > 1" class="d-flex justify-content-end p-3 border-top">

                                <nav>

                                    <ul class="pagination mb-0">

                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                            <button class="page-link" @click="currentPage--">
                                                Prev
                                            </button>
                                        </li>

                                        <li v-for="page in totalPages" :key="page" class="page-item"
                                            :class="{ active: currentPage === page }">

                                            <button class="page-link" @click="currentPage = page">
                                                {{ page }}
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

                    </div>

                </div>

            </div>

            <!-- FOOTER -->

            <div class="footer text-center bg-white p-2 border-top mt-4">
                <p class="mb-0 text-muted">
                    2025 © Clinic Management System
                </p>
            </div>

        </div>

    </div>

    <!-- APPOINTMENT DETAILS -->

    <div class="offcanvas offcanvas-end offcanvas-offset" tabindex="-1" id="view_details">

        <div class="offcanvas-header d-block pb-0 px-0">

            <div class="border-bottom d-flex align-items-center justify-content-between pb-3 px-3">

                <h5 class="offcanvas-title fs-18 fw-bold">

                    Appointment Details

                    <span class="badge badge-soft-primary border pt-1 px-2 border-primary fw-medium ms-2">
                        #AP{{ selectedAppointment?.appointmentId }}
                    </span>

                </h5>

                <button type="button" class="custom-btn-close" data-bs-dismiss="offcanvas">

                    <i class="ti ti-x fs-16 text-dark"></i>

                </button>

            </div>

        </div>

        <div class="offcanvas-body pt-0 px-0">

            <!-- DOCTOR + PATIENT -->

            <h6 class="bg-light py-2 px-3 fw-bold mb-0 text-uppercase fs-12">
                Appointment With
            </h6>

            <div class="px-3 my-4">

                <div class="bg-light p-3 mb-3 border rounded-3 d-flex align-items-center justify-content-between">

                    <div class="d-flex align-items-center">

                        <div class="avatar avatar-md me-2 bg-white rounded-circle">
                            <i class="ti ti-stethoscope fs-20 text-primary"></i>
                        </div>

                        <span class="text-dark fw-bold">

                            Dr. {{ selectedAppointment?.doctorName }}

                            <span class="text-body fs-13 fw-normal d-block">
                                Patient: {{ selectedAppointment?.patientName }}
                            </span>

                        </span>

                    </div>

                </div>

                <div class="detail-list">

                    <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">

                        Appointment On

                        <span class="text-body fw-normal">
                            {{ formatDate(selectedAppointment?.date) }} {{ formatTime(selectedAppointment?.date) }}
                        </span>

                    </p>

                    <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">

                        Shift

                        <span class="badge bg-info-subtle text-info fw-semibold">
                            {{ getShiftLabel(selectedAppointment?.date) }}
                        </span>

                    </p>

                    <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">

                        Status

                        <span :class="getStatusBadge(selectedAppointment?.status)">
                            {{ selectedAppointment?.status }}
                        </span>


                    </p>
                    <div v-if="selectedAppointment?.status === 'Completed'" class="mt-3">

                        <button class="btn btn-success w-100" data-bs-dismiss="offcanvas" @click="goToPrescription">
                            <i class="ti ti-pill me-1"></i>
                            View Medical Record
                        </button>

                    </div>

                </div>

            </div>

            <!-- NOTES -->

            <h6 class="bg-light py-2 px-3 fw-bold mb-0 text-uppercase fs-12">
                Appointment Notes
            </h6>

            <div class="px-3 my-4">

                <label class="text-dark fw-semibold mb-1 fs-14">
                    Reason / Notes
                </label>

                <div class="p-3 bg-light rounded-3 text-muted fs-13 border-dashed">

                    {{ selectedAppointment?.reason || "No additional notes provided." }}

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import { ref, onMounted, computed, watch } from "vue"
import NavbarDoctor from "../../components/doctors/NavbarDoctor.vue"
import SidebarDoctor from "../../components/doctors/SidebarDoctor.vue"

import { useAuthStore } from "../../stores/auth"
import { getDoctorAppointments } from "../../services/appointmentService"
import { getMedicalRecordByAppointment } from "../../services/medicalRecordService"

import { useRouter } from "vue-router"

const router = useRouter()

const goToPrescription = async () => {

    try {

        const appointmentId = selectedAppointment.value.appointmentId

        const res = await getMedicalRecordByAppointment(appointmentId)

        const record = res.data

        if (!record) {

            alert("Medical record not found")
            return

        }

        const recordId = record.medicalRecordId

        router.push(`/doctor/medical-records/${appointmentId}`)
    }
    catch (err) {

        console.error("Get medical record error", err)

    }

}
const authStore = useAuthStore()

const appointments = ref([])

const search = ref("")
const statusFilter = ref("")
const dateFilter = ref("")

const selectedAppointment = ref(null)
const currentPage = ref(1)
const pageSize = ref(5)

const loadAppointments = async () => {

    try {

        const doctorId = authStore.user?.userId

        const res = await getDoctorAppointments(doctorId)

        appointments.value = (res.data || []).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        )
        console.log("Loaded appointments", appointments.value)

    }
    catch (err) {

        console.error("Load appointments error", err)

    }

}

const formatDate = (date) => {

    if (!date) return "-"

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })

}

const formatTime = (dateStr) => {

    if (!dateStr) return ""

    return new Date(dateStr).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    })

}

const getShiftLabel = (dateStr) => {

    if (!dateStr) return "-"

    const hour = new Date(dateStr).getHours()

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

    const keyword = (search.value || "").toLowerCase()

    return appointments.value.filter(a => {

        const name = (a.patientName || "").toLowerCase()

        const matchSearch =
            !keyword || name.includes(keyword)

        const matchStatus =
            !statusFilter.value ||
            a.status === statusFilter.value

        const matchDate =
            !dateFilter.value ||
            a.date?.startsWith(dateFilter.value)

        return matchSearch && matchStatus && matchDate

    })

})
const totalPages = computed(() => {
    return Math.ceil(filteredAppointments.value.length / pageSize.value)
})

const paginatedAppointments = computed(() => {

    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value

    return filteredAppointments.value.slice(start, end)

})

const clearFilter = () => {

    search.value = ""
    statusFilter.value = ""
    dateFilter.value = ""

}

const openView = (item) => {
    selectedAppointment.value = item
}

onMounted(loadAppointments)
watch([search, statusFilter, dateFilter], () => {
    currentPage.value = 1
})

</script>

<style scoped>
.avatar {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

table td {
    vertical-align: middle;
}

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

.fs-12 {
    font-size: 12px;
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

.detail-list p {
    border-bottom: 1px solid #f8f9fa;
    padding-bottom: 8px;
}

.detail-list p:last-child {
    border-bottom: none;
}
</style>
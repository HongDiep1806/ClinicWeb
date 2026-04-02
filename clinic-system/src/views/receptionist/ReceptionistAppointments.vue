<template>
    <div class="main-wrapper">
        <NavbarReceptionist />
        <SidebarReceptionist />

        <div class="page-wrapper">
            <div class="content">

                <!-- HEADER -->
                <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                    <h4 class="fw-semibold mb-0">
                        Receptionist Appointments
                        <span class="badge bg-primary-subtle text-primary ms-2">
                            {{ appointments.length }}
                        </span>
                    </h4>

                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-secondary" @click="filterToday">
                            Today
                        </button>

                        <router-link to="/receptionist/add-appointment" class="btn btn-primary">
                            <i class="ti ti-plus me-1"></i>
                            New Appointment
                        </router-link>
                    </div>
                </div>

                <!-- FILTERS -->
                <div class="d-flex gap-3 mb-3 flex-wrap">

                    <input v-model="searchText" class="form-control" placeholder="Search patient / doctor"
                        style="width:220px" />

                    <!-- <input
            v-model="doctorSearch"
            class="form-control"
            placeholder="Doctor"
            style="width:200px"
          /> -->

                    <select v-model="selectedDepartment" class="form-select" style="width:200px">
                        <option value="">All Departments</option>
                        <option v-for="d in departments" :key="d.departmentId">
                            {{ d.name }}
                        </option>
                    </select>

                    <select v-model="selectedStatus" class="form-select" style="width:160px">
                        <option value="">All Status</option>
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                        <option>NoShow</option>
                    </select>

                    <input type="date" v-model="startDate" class="form-control" style="width:170px" />
                    <input type="date" v-model="endDate" class="form-control" style="width:170px" />

                    <button class="btn btn-primary px-4" @click="resetFilters">
                        <i class="ti ti-refresh me-1"></i>
                        Reset
                    </button>

                </div>

                <!-- TABLE -->
                <div class="table-responsive">

                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th width="80"></th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr v-for="item in paginatedAppointments" :key="item.appointmentId"
                                :class="isToday(item.date) ? 'today-row' : ''">

                                <td>{{ formatTime(item.date) }}</td>

                                <td>{{ item.patientName }}</td>

                                <td>{{ item.doctorName }}</td>

                                <td>{{ item.departmentName }}</td>

                                <td>
                                    <span :class="statusClass(item.status)">
                                        {{ item.status }}
                                    </span>
                                </td>

                                <td>

                                    <div class="dropdown">
                                        <i class="ti ti-dots-vertical" data-bs-toggle="dropdown"
                                            style="cursor:pointer"></i>

                                        <ul class="dropdown-menu">

                                            <li>
                                                <a class="dropdown-item" @click="openView(item)"
                                                    data-bs-toggle="offcanvas" data-bs-target="#view_details">
                                                    View
                                                </a>
                                            </li>

                                            <li v-if="item.status === 'Pending' && isToday(item.date)"> <a
                                                    class="dropdown-item text-success" @click="confirmArrival(item)">
                                                    Confirm Arrival
                                                </a>
                                            </li>

                                            <li v-if="item.status !== 'Cancelled'">
                                                <a class="dropdown-item text-danger" @click="openCancelModal(item)">
                                                    Cancel
                                                </a>
                                            </li>

                                        </ul>

                                    </div>

                                </td>

                            </tr>

                        </tbody>
                    </table>

                </div>

                <!-- PAGINATION -->

                <div class=" d-flex justify-content-center mt-3">

                    <ul class="pagination">

                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="currentPage--">Prev</button>
                        </li>

                        <li class="page-item" v-for="n in totalPages" :key="n" :class="{ active: currentPage === n }">
                            <button class="page-link" @click="currentPage = n">
                                {{ n }}
                            </button>
                        </li>

                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="currentPage++">Next</button>
                        </li>

                    </ul>

                </div>

            </div>
        </div>
    </div>

    <div class="modal fade" id="cancel_modal" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Cancel Appointment</h5>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">

                    <label class="form-label">Reason</label>

                    <textarea class="form-control" rows="3" v-model="cancelReason"
                        placeholder="Enter cancellation reason..."></textarea>

                </div>

                <div class="modal-footer">

                    <button class="btn btn-light" data-bs-dismiss="modal" :disabled="isCancelling">
                        Cancel
                    </button>

                    <button class="btn btn-danger d-inline-flex align-items-center" @click="confirmCancel"
                        :disabled="isCancelling">
                        <span v-if="isCancelling" class="spinner-border spinner-border-sm me-2" role="status"
                            aria-hidden="true"></span>
                        {{ isCancelling ? "Cancelling..." : "Confirm Cancel" }}
                    </button>

                </div>

            </div>
        </div>
    </div>

    <!-- MODALS -->
    <div class="offcanvas offcanvas-offset offcanvas-end" tabindex="-1" id="view_details">
        <div class="offcanvas-header d-block pb-0 px-0">
            <div class="border-bottom d-flex align-items-center justify-content-between pb-3 px-3">

                <h5 class="offcanvas-title fs-18 fw-bold">
                    Appointment Details
                    <span class="badge badge-soft-primary border pt-1 px-2 border-primary fw-medium ms-2">
                        #AP{{ selectedAppointment?.appointmentId }}
                    </span>
                </h5>

                <button type="button" class="btn-close custom-btn-close opacity-100" data-bs-dismiss="offcanvas">
                    <i class="ti ti-x bg-white fs-16 text-dark"></i>
                </button>
            </div>
        </div>

        <div class="offcanvas-body pt-0 px-0">

            <!-- WHEN & WHERE -->
            <h6 class="bg-light py-2 px-3 fw-bold">When & Where</h6>
            <div class="px-3 my-4">

                <div class="bg-light p-3 mb-3 border rounded-3 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <div class="avatar avatar-md me-2 bg-white rounded-circle">
                            <i class="ti ti-stethoscope fs-20 text-primary"></i>
                        </div>
                        <span class="text-dark fw-semibold">
                            {{ selectedAppointment?.doctorName }}
                            <span class="text-body fs-13 fw-normal d-block">
                                {{ selectedAppointment?.departmentName }}
                            </span>
                        </span>
                    </div>
                </div>

                <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
                    Appointment On
                    <span class="text-body fw-normal">
                        {{ formatDateOnly(selectedAppointment?.date) }}
                    </span>
                </p>

                <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
                    Created At
                    <span class="text-body fw-normal">
                        {{ formatDateTime(selectedAppointment?.createdAt) }}
                    </span>
                </p>

                <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
                    Status
                    <span class="text-body fw-normal">
                        {{ selectedAppointment?.status }}
                    </span>
                </p>

                <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
                    Department
                    <span class="text-body fw-normal">
                        {{ selectedAppointment?.departmentName }}
                    </span>
                </p>

            </div>

            <!-- PATIENT -->
            <h6 class="bg-light py-2 px-3 fw-bold">Patient</h6>

            <div class="px-3 my-4">
                <div class="d-flex align-items-center">
                    <div class="avatar avatar-md me-2 bg-light rounded-circle">
                        <i class="ti ti-user text-secondary fs-20"></i>
                    </div>
                    <span class="text-dark fw-semibold">
                        {{ selectedAppointment?.patientName }}
                    </span>
                </div>
            </div>

        </div>
    </div>

</template>

<script>

import NavbarReceptionist from "../../components/receptionist/NavbarReceptionist.vue"
import SidebarReceptionist from "../../components/receptionist/SidebarReceptionist.vue"


import {
    getAllAppointments,
    updateAppointmentStatus
} from "../../services/appointmentService"

import { getDepartments } from "../../services/departmentService"

import { useToast } from "vue-toastification"

export default {

    components: {
        NavbarReceptionist,
        SidebarReceptionist
    },

    data() {
        return {
            appointments: [],
            departments: [],

            searchText: "",
            doctorSearch: "",
            selectedDepartment: "",
            selectedStatus: "",

            startDate: "",
            endDate: "",

            currentPage: 1,
            pageSize: 10,
            cancelReason: "",
            cancelTarget: null,
            isCancelling: false,


            toast: useToast(),
            selectedAppointment: null,
        }
    },

    mounted() {
        this.loadAppointments()
        this.loadDepartments()
    },

    computed: {

        filteredAppointments() {

            return this.appointments.filter(a => {

                const matchText =
                    !this.searchText ||
                    a.patientName.toLowerCase().includes(this.searchText.toLowerCase()) ||
                    a.doctorName.toLowerCase().includes(this.searchText.toLowerCase())

                const matchDoctor =
                    !this.doctorSearch ||
                    a.doctorName.toLowerCase().includes(this.doctorSearch.toLowerCase())

                const matchDept =
                    !this.selectedDepartment ||
                    a.departmentName === this.selectedDepartment

                const matchStatus =
                    !this.selectedStatus ||
                    a.status === this.selectedStatus

                let matchDate = true

                if (this.startDate) {
                    matchDate = matchDate && new Date(a.date) >= new Date(this.startDate)
                }

                if (this.endDate) {
                    matchDate = matchDate && new Date(a.date) <= new Date(this.endDate)
                }

                return matchText && matchDoctor && matchDept && matchStatus && matchDate
            })
        },

        paginatedAppointments() {
            const start = (this.currentPage - 1) * this.pageSize
            return this.filteredAppointments.slice(start, start + this.pageSize)
        },

        totalPages() {
            return Math.ceil(this.filteredAppointments.length / this.pageSize)
        }

    },

    methods: {
        formatDateOnly(dateStr) {
            if (!dateStr) return "N/A"

            const d = new Date(dateStr)

            const day = String(d.getDate()).padStart(2, "0")
            const month = String(d.getMonth() + 1).padStart(2, "0")
            const year = d.getFullYear()

            return `${day}/${month}/${year}`
        },

        formatDateTime(dateStr) {
            if (!dateStr) return "N/A"

            return new Date(dateStr).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
        },
        resetFilters() {

            this.searchText = ""
            this.doctorSearch = ""
            this.selectedDepartment = ""
            this.selectedStatus = ""

            this.startDate = ""
            this.endDate = ""

            this.currentPage = 1

        },

        async loadAppointments() {
            const res = await getAllAppointments()

            this.appointments = res.data.sort((a, b) => {
                const aCreated = new Date(a.createdAt || a.date)
                const bCreated = new Date(b.createdAt || b.date)
                return bCreated - aCreated
            })
        },
        openCancelModal(item) {
            this.cancelTarget = item
            this.cancelReason = ""
            this.isCancelling = false

            const modal = new bootstrap.Modal(
                document.getElementById("cancel_modal")
            )

            modal.show()
        },

        async loadDepartments() {
            const res = await getDepartments()
            this.departments = res
        },

        formatTime(date) {
            return new Date(date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        },

        isToday(date) {
            const d = new Date(date)
            const t = new Date()
            return d.toDateString() === t.toDateString()
        },

        statusClass(status) {

            switch (status) {

                case "Pending":
                    return "badge bg-warning-subtle text-warning"

                case "Confirmed":
                    return "badge bg-success-subtle text-success"

                case "Completed":
                    return "badge bg-info-subtle text-info"

                case "Cancelled":
                    return "badge bg-danger-subtle text-danger"

                case "NoShow":
                    return "badge bg-secondary-subtle text-secondary"
            }

        },

        filterToday() {
            const today = new Date().toISOString().split("T")[0]
            this.startDate = today
            this.endDate = today
        },

        async confirmArrival(item) {

            const now = new Date()

            const apptDate = new Date(item.date)

            const apptDay = apptDate.toDateString()
            const today = new Date().toDateString()

            if (apptDay === today) {

                const hour = apptDate.getHours()

                let shiftEnd = new Date(apptDate)

                if (hour < 12) {
                    shiftEnd.setHours(12, 0, 0, 0)
                } else {
                    shiftEnd.setHours(17, 0, 0, 0)
                }

                // 🔥 fix chắc chắn: so timestamp
                if (now.getTime() > shiftEnd.getTime()) {
                    this.toast.error("Cannot confirm past shift")
                    return
                }
            }

            await updateAppointmentStatus({
                appointmentId: item.appointmentId,
                status: "Confirmed"
            })

            item.status = "Confirmed"

            this.toast.success("Patient confirmed")
        },

        async quickCancel(item) {

            const cancelReason = ref("")
            const cancelTarget = ref(null)

            const openCancelModal = (item) => {
                cancelTarget.value = item
                cancelReason.value = ""

                const modal = new bootstrap.Modal(
                    document.getElementById("cancel_modal")
                )

                modal.show()
            }
        },
        async confirmCancel() {
            if (!this.cancelReason) {
                this.toast.error("Please enter cancel reason")
                return
            }

            if (this.isCancelling) return

            this.isCancelling = true

            try {
                await updateAppointmentStatus({
                    appointmentId: this.cancelTarget.appointmentId,
                    status: "Cancelled",
                    reason: this.cancelReason
                })

                this.cancelTarget.status = "Cancelled"
                this.toast.success("Appointment cancelled")

                bootstrap.Modal.getInstance(
                    document.getElementById("cancel_modal")
                ).hide()
            } catch (error) {
                console.error(error)
                this.toast.error("Cancel appointment failed")
            } finally {
                this.isCancelling = false
            }
        },
        openView(item) {
            this.selectedAppointment = item
        }



    }



}
</script>

<style scoped>
.today-row td {
    background: #fff8db !important;
}

.table-responsive {
    overflow: visible !important;
}
</style>
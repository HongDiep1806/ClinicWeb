<template>
    <div class="main-wrapper">

        <NavbarReceptionist />
        <SidebarReceptionist />

        <div class="page-wrapper">

            <div class="content">

                <!-- HEADER -->
                <div class="mb-4">
                    <h4 class="fw-bold">
                        Welcome back, {{ authStore.user?.fullName }}
                    </h4>

                    <p class="text-muted mb-0">
                        Clinic overview and appointment management
                    </p>
                </div>

                <!-- STATS -->
                <div class="row">

                    <div class="col-xl-3 col-md-6 mb-3">
                        <div class="card shadow-sm stat-card">
                            <div class="card-body d-flex align-items-center">

                                <div class="stat-icon bg-primary-subtle text-primary me-3">
                                    <i class="ti ti-calendar"></i>
                                </div>

                                <div>
                                    <div class="text-muted small">Today Appointments</div>
                                    <h5 class="fw-bold mb-0">{{ todayAppointments }}</h5>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6 mb-3">
                        <div class="card shadow-sm stat-card">
                            <div class="card-body d-flex align-items-center">

                                <div class="stat-icon bg-warning-subtle text-warning me-3">
                                    <i class="ti ti-clock"></i>
                                </div>

                                <div>
                                    <div class="text-muted small">Pending</div>
                                    <h5 class="fw-bold mb-0">{{ pendingAppointments }}</h5>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6 mb-3">
                        <div class="card shadow-sm stat-card">
                            <div class="card-body d-flex align-items-center">

                                <div class="stat-icon bg-success-subtle text-success me-3">
                                    <i class="ti ti-user"></i>
                                </div>

                                <div>
                                    <div class="text-muted small">Total Patients</div>
                                    <h5 class="fw-bold mb-0">{{ totalPatients }}</h5>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6 mb-3">
                        <div class="card shadow-sm stat-card">
                            <div class="card-body d-flex align-items-center">

                                <div class="stat-icon bg-info-subtle text-info me-3">
                                    <i class="ti ti-stethoscope"></i>
                                </div>

                                <div>
                                    <div class="text-muted small">Doctors Today</div>
                                    <h5 class="fw-bold mb-0">{{ doctorsToday }}</h5>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

                <!-- QUICK ACTION -->
                <div class="row mb-3">

                    <div class="col-md-4">
                        <router-link to="/receptionist/add-appointment"
                            class="card quick-card shadow-sm text-decoration-none">

                            <div class="card-body text-center">

                                <i class="ti ti-calendar-plus quick-icon"></i>

                                <h6 class="mt-2 fw-bold">Create Appointment</h6>

                            </div>

                        </router-link>
                    </div>

                    <div class="col-md-4">
                        <router-link to="/receptionist/appointments"
                            class="card quick-card shadow-sm text-decoration-none">

                            <div class="card-body text-center">

                                <i class="ti ti-list-details quick-icon"></i>

                                <h6 class="mt-2 fw-bold">Manage Appointments</h6>

                            </div>

                        </router-link>
                    </div>

                    <div class="col-md-4">
                        <router-link to="/receptionist/doctor-schedule"
                            class="card quick-card shadow-sm text-decoration-none">

                            <div class="card-body text-center">

                                <i class="ti ti-calendar-event quick-icon"></i>

                                <h6 class="mt-2 fw-bold">Doctor Schedule</h6>

                            </div>

                        </router-link>
                    </div>

                </div>

                <!-- CHART -->
                <div class="card shadow-sm">

                    <div class="card-header">
                        <h6 class="fw-bold mb-0">Appointments This Week</h6>
                    </div>

                    <div class="card-body">
                        <div ref="chartRef"></div>
                    </div>

                </div>

                <!-- TODAY APPOINTMENTS -->
                <div class="card shadow-sm mt-3">

                    <div class="card-header d-flex justify-content-between align-items-center">

                        <h6 class="fw-bold mb-0">
                            Today's Appointments
                        </h6>

                        <router-link to="/receptionist/appointments" class="btn btn-sm btn-primary">
                            View All
                        </router-link>

                    </div>

                    <div class="card-body">

                        <div v-if="appointments.length === 0" class="text-muted">
                            No appointments today
                        </div>

                        <div v-for="a in appointments" :key="a.appointmentId"
                            class="d-flex justify-content-between align-items-center border-bottom py-3">

                            <!-- LEFT -->
                            <div>
                                <div class="fw-semibold">{{ a.patientName }}</div>
                                <div class="text-muted small">{{ a.doctorName }}</div>
                            </div>

                            <!-- RIGHT -->
                            <div class="d-flex align-items-center gap-3">

                                <span class="badge bg-warning" v-if="a.status === 'Pending'">Pending</span>
                                <span class="badge bg-success" v-if="a.status === 'Completed'">Completed</span>
                                <span class="badge bg-danger" v-if="a.status === 'Cancelled'">Cancelled</span>

                                <span class="text-muted small">
                                    <i class="ti ti-clock"></i> {{ a.time }}
                                </span>

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
</template>

<script setup>

import { ref, onMounted } from "vue"
import ApexCharts from "apexcharts"

import NavbarReceptionist from "../../components/receptionist/NavbarReceptionist.vue"
import SidebarReceptionist from "../../components/receptionist/SidebarReceptionist.vue"

import { useAuthStore } from "../../stores/auth"
import { getAllAppointments } from "../../services/appointmentService"
import { getAllPatients } from "../../services/patientService"

const authStore = useAuthStore()

const todayAppointments = ref(0)
const pendingAppointments = ref(0)
const totalPatients = ref(0)
const doctorsToday = ref(0)

const appointments = ref([])
const chartRef = ref(null)

let chart = null

const loadDashboard = async () => {

    const res = await getAllAppointments()
    const data = res.data

    //     console.log("Appointments API response:", res)
    // console.log("Appointments data:", data)
    // console.log("Total appointments:", data.length)
    // console.log("Patient IDs:", data.map(a => a.patientId))
    // console.log("Unique Patient IDs:", [...new Set(data.map(a => a.patientId))])
    // console.log(
    //   "Valid Patient IDs:",
    //   data.filter(a => a.patientId !== null && a.patientId !== undefined).map(a => a.patientId)
    // )
    // console.log(
    //   "Total unique valid patients:",
    //   new Set(
    //     data
    //       .filter(a => a.patientId !== null && a.patientId !== undefined)
    //       .map(a => a.patientId)
    //   ).size
    // )

    const today = new Date().toISOString().split("T")[0]

    const todayList = data.filter(a => a.date?.startsWith(today))
    appointments.value = todayList.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    )

    const patientRes = await getAllPatients()
    totalPatients.value = patientRes.data.length
    pendingAppointments.value =
        todayList.filter(a => a.status === "Pending").length

    doctorsToday.value =
        new Set(todayList.map(a => a.doctorId)).size


    const now = new Date()

    const day = now.getDay() || 7

    const firstDay = new Date(now)
    firstDay.setDate(now.getDate() - day + 1)
    firstDay.setHours(0, 0, 0, 0)

    const lastDay = new Date(firstDay)
    lastDay.setDate(firstDay.getDate() + 6)
    lastDay.setHours(23, 59, 59, 999)

    const weekAppointments = data.filter(a => {

        const d = new Date(a.date.split("T")[0])

        return d >= firstDay && d <= lastDay

    })

    initChart(weekAppointments)

}

const initChart = (data) => {

    const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const counts = [0, 0, 0, 0, 0, 0, 0]

    data.forEach(a => {

        const day = new Date(a.date).getDay()
        const index = day === 0 ? 6 : day - 1

        counts[index]++

    })

    const options = {
        chart: {
            type: "bar",
            height: 280
        },
        series: [{
            name: "Appointments",
            data: counts
        }],
        xaxis: {
            categories: week
        },
        colors: ["#3b82f6"]
    }

    if (chart) chart.destroy()

    chart = new ApexCharts(chartRef.value, options)
    chart.render()

}

onMounted(() => {

    loadDashboard()

})

</script>
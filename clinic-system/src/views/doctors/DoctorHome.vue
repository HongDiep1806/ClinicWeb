<template>
  <div class="main-wrapper">

    <NavbarDoctor />
    <SidebarDoctor />

    <div class="page-wrapper">

      <div class="content">

        <!-- HEADER -->
        <div class="mb-4">
          <h4 class="fw-bold">
            Welcome back, {{ authStore.user?.fullName }}
          </h4>
          <p class="text-muted mb-0">
            Here is your schedule overview
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
                  <div class="text-muted small">Pending Today</div>
                  <h5 class="fw-bold mb-0">{{ pendingAppointments }}</h5>
                </div>

              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card shadow-sm stat-card">
              <div class="card-body d-flex align-items-center">

                <div class="stat-icon bg-success-subtle text-success me-3">
                  <i class="ti ti-check"></i>
                </div>

                <div>
                  <div class="text-muted small">Completed Today</div>
                  <h5 class="fw-bold mb-0">{{ completedAppointments }}</h5>
                </div>

              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card shadow-sm stat-card">
              <div class="card-body d-flex align-items-center">

                <div class="stat-icon bg-info-subtle text-info me-3">
                  <i class="ti ti-users"></i>
                </div>

                <div>
                  <div class="text-muted small">Total Patients</div>
                  <h5 class="fw-bold mb-0">{{ totalPatients }}</h5>
                </div>

              </div>
            </div>
          </div>

        </div>

        <!-- UPCOMING + CHART -->
        <div class="row mt-3">

          <!-- UPCOMING -->
          <div class="col-lg-4 d-flex">

            <div class="card shadow-sm flex-fill">

              <div class="card-header">
                <h6 class="fw-bold mb-0">Next Appointment</h6>
              </div>

              <div v-if="nextAppointment" class="card-body">

                <div class="d-flex align-items-center mb-3">

                  <div class="avatar bg-primary-subtle text-primary rounded-circle me-2">
                    <i class="ti ti-user"></i>
                  </div>

                  <div>
                    <div class="fw-semibold">
                      {{ nextAppointment.patientName }}
                    </div>

                    <div class="text-muted small">
                      {{ nextAppointment.reason }}
                    </div>
                  </div>

                </div>

                <div class="text-muted small mb-3">

                  <i class="ti ti-calendar me-1"></i>
                  {{ nextAppointment.date }}

                  •

                  <i class="ti ti-clock ms-1 me-1"></i>
                  {{ nextAppointment.time }}

                </div>

                <router-link :to="`/doctor/examine/${nextAppointment.appointmentId}`" class="btn btn-primary w-100">
                  Start Appointment
                </router-link>

              </div>

              <div v-else class="card-body text-muted">
                No upcoming appointments
              </div>

            </div>

          </div>

          <!-- CHART -->
          <div class="col-lg-8 d-flex">

            <div class="card shadow-sm flex-fill">

              <div class="card-header">
                <h6 class="fw-bold mb-0">
                  Appointments This Week </h6>
              </div>

              <div class="card-body">
                <div ref="chartRef"></div>
              </div>

            </div>

          </div>

        </div>

        <!-- TODAY SCHEDULE -->
        <div class="card shadow-sm mt-3">

          <div class="card-header d-flex justify-content-between align-items-center">

            <h6 class="fw-bold mb-0">
              Today's Schedule
            </h6>

            <router-link to="/doctor/appointments" class="btn btn-sm btn-primary">
              View All
            </router-link>

          </div>

          <div class="card-body">

            <div v-if="appointments.length === 0" class="text-muted">
              No appointments today
            </div>

            <div v-for="a in appointments" :key="a.appointmentId"
              class="d-flex justify-content-between align-items-center border-bottom py-3">

              <div>
                <div class="fw-semibold">{{ a.patientName }}</div>
                <div class="text-muted small">{{ a.reason }}</div>
              </div>

              <div>

                <span class="badge me-2" :class="getShiftClass(a.shift)">
                  {{ a.shift }}
                </span>

                <span class="badge bg-success" v-if="a.status === 'Completed'">
                  Completed
                </span>

                <span class="badge bg-warning" v-if="a.status === 'Pending'">
                  Pending
                </span>

                <span class="badge bg-danger" v-if="a.status === 'Cancelled'">
                  Cancelled
                </span>

              </div>

              <div>

                <router-link :to="`/doctor/examine/${a.appointmentId}`" class="btn btn-sm btn-outline-primary">
                  Examine
                </router-link>

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

import NavbarDoctor from "../../components/doctors/NavbarDoctor.vue"
import SidebarDoctor from "../../components/doctors/SidebarDoctor.vue"

import { useAuthStore } from "../../stores/auth"
import { getDoctorAppointments } from "../../services/appointmentService"

const chartRef = ref(null)

const authStore = useAuthStore()

const todayAppointments = ref(0)
const pendingAppointments = ref(0)
const completedAppointments = ref(0)
const cancelledAppointments = ref(0)
const totalPatients = ref(0)

const nextAppointment = ref(null)
const appointments = ref([])

let chart = null

const getShiftClass = (shift) => {
  if (shift === "Morning") return "bg-info-subtle text-info"
  return "bg-warning-subtle text-warning"
}

const loadDashboard = async () => {

  try {

    const doctorId = authStore.user?.userId
    const res = await getDoctorAppointments(doctorId)

    const data = res.data

    const today = new Date().toISOString().split("T")[0]

    const todayList = data.filter(a =>
      a.date?.startsWith(today)
    )

    todayList.sort((a, b) =>
      new Date(`${a.date} ${a.time}`) -
      new Date(`${b.date} ${b.time}`)
    )

    appointments.value = todayList

    todayAppointments.value = todayList.length

    pendingAppointments.value =
      todayList.filter(a => a.status === "Pending").length

    completedAppointments.value =
      todayList.filter(a => a.status === "Completed").length

    cancelledAppointments.value =
      todayList.filter(a => a.status === "Cancelled").length

    totalPatients.value =
      new Set(data.map(a => a.patientId)).size

    nextAppointment.value = todayList.find(a => a.status === "Pending") || null

    initChart(data)
  }
  catch (err) {

    console.error("Dashboard load error", err)

  }

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

    colors: ["#3b82f6"],

    dataLabels: {
      enabled: false
    }

  }

  if (chart) {
    chart.destroy()
  }

  chart = new ApexCharts(
    chartRef.value,
    options
  )

  chart.render()

}

onMounted(loadDashboard)

</script>

<style scoped>
.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card {
  transition: 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
}
</style>
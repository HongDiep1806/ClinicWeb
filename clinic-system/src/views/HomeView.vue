<template>
    <div class="main-wrapper">

        <!-- Topbar -->
        <Navbar />

        <!-- Sidebar -->
        <Sidebar />
        <div class="d-flex align-items-sm-center justify-content-between flex-wrap gap-2 mb-4">
                    <div>
                        <h4 class="fw-bold mb-0">Dashboard </h4>
                    </div>
                    
				</div>

        <!-- PAGE CONTENT -->
        <div class="page-wrapper">
            <div class="container-fluid dashboard-container">

                <!-- ===== SUMMARY CARDS ===== -->
                <!-- ===== SUMMARY CARDS ===== -->
                <div class="row mb-4">

                    <div class="col-xl-3 col-md-6 mb-3" v-for="card in summaryCards" :key="card.id">
                        <div class="position-relative border card rounded-2 shadow-sm overflow-hidden">
                            <img :src="card.bgImg" alt="bg" class="position-absolute start-0 top-0 opacity-25">

                            <div class="card-body position-relative">
                                <div class="d-flex align-items-center mb-2 justify-content-between">
                                    <span :class="'avatar rounded-circle ' + card.bg">
                                        <i :class="card.icon + ' fs-24 text-white'"></i>
                                    </span>

                                    <!-- <div class="text-end">
                                        <span v-if="card.percent >= 0"
                                            class="badge px-2 py-1 fs-12 fw-medium bg-success">
                                            +{{ card.percent }}%
                                        </span>
                                        <span v-else class="badge px-2 py-1 fs-12 fw-medium bg-danger">
                                            {{ card.percent }}%
                                        </span>
                                        <p class="fs-12 mb-0">in last 7 Days</p>
                                    </div> -->
                                </div>

                                <p class="mb-1 text-muted">{{ card.title }}</p>
                                <h3 class="fw-bold mb-0">{{ card.value }}</h3>

                                <!-- <div class="mt-3">
                                    <div :id="'mini-chart-' + card.id" class="chart-set"></div>
                                </div> -->
                            </div>
                        </div>
                    </div>

                </div>


                <!-- ===== APPOINTMENT CHART ===== -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0">Appointment Statistics</h5>
                        <select v-model="chartMode" class="form-select form-select-sm w-auto">
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <div class="card-body">
                        <div id="appointment-chart"></div>
                    </div>
                </div>

                <!-- ===== RECENT APPOINTMENTS ===== -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0">Recent Appointments</h5>
                    </div>

                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th>Doctor</th>
                                        <th>Patient</th>
                                        <th>Date</th>
                                        <!-- <th>Type</th> -->
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="item in recentAppointments" :key="item.id">
                                        <td>{{ item.doctorName }}</td>
                                        <td>{{ item.patientName }}</td>
                                        <td>{{ formatDate(item.appointmentDate) }}</td>
                                        <!-- <td>{{ item.appointmentType }}</td> -->
                                        <td>
                                            <span class="badge bg-success"
                                                v-if="item.status === 'Completed'">Completed</span>
                                            <span class="badge bg-warning text-dark"
                                                v-else-if="item.status === 'Pending'">Pending</span>
                                            <span class="badge bg-danger" v-else>Cancelled</span>
                                        </td>
                                    </tr>

                                    <tr v-if="recentAppointments.length === 0">
                                        <td colspan="5" class="text-center py-3 text-muted">No appointments found.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- ===== TOP DOCTORS ===== -->
                <div class="card shadow-sm mb-5">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0">Top Doctors (by appointments)</h5>
                    </div>

                    <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center"
                                v-for="doc in topDoctors" :key="doc.id">
                                <div>
                                    <strong>{{ doc.name }}</strong>
                                    <div class="text-muted fs-12">{{ doc.department }}</div>
                                </div>
                                <span class="badge bg-primary">{{ doc.count }} appointments</span>
                            </li>

                            <li class="list-group-item text-center py-3 text-muted" v-if="topDoctors.length === 0">
                                No doctors found.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            <!-- Footer -->
            <div class="footer text-center bg-white p-2 border-top">
                <p class="text-dark mb-0">2025 © Preclinic, All Rights Reserved</p>
            </div>
        </div>

    </div>
</template>

<script>
import ApexCharts from "apexcharts";
import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";

import { getAllDoctors, getAllPatients } from "../services/userService";
import { getAllAppointments } from "../services/appointmentService";
import { getDepartments } from "../services/departmentService";

export default {
    name: "AdminDashboard",
    components: { Sidebar, Navbar },

    data() {
        return {
            doctors: [],
            patients: [],
            departments: [],
            appointments: [],
            chartMode: "weekly",
        };
    },

    computed: {
        summaryCards() {
            return [
                {
                    id: 1,
                    title: "Doctors",
                    value: this.doctors.length ?? 0,
                    percent: 95,
                    icon: "ti ti-calendar-heart",
                    bg: "bg-primary",
                    bgImg: "/img/bg/bg-01.svg"
                },
                {
                    id: 2,
                    title: "Patients",
                    value: this.patients.length ?? 0,
                    percent: 25,
                    icon: "ti ti-calendar-heart",
                    bg: "bg-danger",
                    bgImg: "/img/bg/bg-02.svg"
                },
                {
                    id: 3,
                    title: "Appointment",
                    value: this.appointments.length ?? 0,
                    percent: -15,
                    icon: "ti ti-calendar",
                    bg: "bg-info",
                    bgImg: "/img/bg/bg-03.svg"
                },
                {
                    id: 4,
                    title: "Revenue",
                    value: "$55,1240",
                    percent: 25,
                    icon: "ti ti-medical-cross",
                    bg: "bg-success",
                    bgImg: "/img/bg/bg-04.svg"
                }
            ];
        },


        recentAppointments() {
            return [...this.appointments]
                .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                .slice(0, 10);
        },

        topDoctors() {
            const count = {};

            this.appointments.forEach(appt => {
                count[appt.doctorId] = (count[appt.doctorId] || 0) + 1;
            });

            return Object.entries(count)
                .map(([id, count]) => {
                    const doc = this.doctors.find(d => d.userId == id);
                    return {
                        id,
                        name: doc?.fullName || "Unknown",
                        department: doc?.departmentName || "",
                        count,
                    };
                })
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
        }
    },
    watch: {
        chartMode() {
            this.$nextTick(() => this.renderChart());
        }
    },


    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },

        renderChart() {
            if (!this.appointments.length) return;

            let chartData;

            switch (this.chartMode) {
                case "weekly":
                    chartData = this.getWeeklyData();
                    break;

                case "monthly":
                    chartData = this.getMonthlyData();
                    break;

                case "yearly":
                    chartData = this.getYearlyData();
                    break;
            }

            const options = {
                chart: {
                    height: 320,
                    type: "line",
                    toolbar: { show: false }
                },

                stroke: {
                    width: [0, 3],     // cột = 0px, line = 3px
                    curve: "smooth"
                },

                dataLabels: {
                    enabled: true,
                    enabledOnSeries: [1]   // chỉ hiện label cho line
                },

                series: [
                    {
                        name: "Appointments",
                        type: "column",
                        data: chartData.values
                    },
                    {
                        name: "Trend",
                        type: "line",
                        data: chartData.values
                    }
                ],

                colors: ["#2E37A4", "#00d3c7"],   // cột xanh, line đỏ

                xaxis: {
                    categories: chartData.labels
                },

                yaxis: [
                    {
                        title: { text: "Appointments" }
                    }
                ],

                legend: {
                    position: "top"
                },

                plotOptions: {
                    bar: {
                        borderRadius: 5,
                        columnWidth: "45%"
                    }
                }
            };

            if (this._chartInstance) {
                this._chartInstance.destroy();
            }

            this._chartInstance = new ApexCharts(
                document.querySelector("#appointment-chart"),
                options
            );

            this._chartInstance.render();
        },


        getWeeklyData() {
            const now = new Date();
            const currentYear = now.getFullYear();

            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const map = { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 0: "Sun" };
            const result = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

            this.appointments.forEach(a => {
                const dateStr = a.appointmentDate.split("T")[0];
                const d = new Date(dateStr + "T00:00:00");

                if (d.getFullYear() === currentYear) {
                    const dayName = map[d.getDay()];
                    result[dayName]++;
                }
            });

            return {
                labels: days,
                values: days.map(d => result[d])
            };
        },


        getMonthlyData() {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const result = {};

            this.appointments.forEach(a => {
                // CHUẨN HOÁ FORMAT: cắt theo T để tránh lỗi timezone
                const dateStr = a.appointmentDate.split("T")[0];
                const d = new Date(dateStr + "T00:00:00");

                if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                    const day = d.getDate();
                    result[day] = (result[day] || 0) + 1;
                }
            });

            const labels = Object.keys(result);
            const values = Object.values(result);

            return { labels, values };
        },


        getYearlyData() {
            const now = new Date();
            const currentYear = now.getFullYear();

            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const result = Array(12).fill(0);

            this.appointments.forEach(a => {
                const dateStr = a.appointmentDate.split("T")[0];
                const d = new Date(dateStr + "T00:00:00");

                if (d.getFullYear() === currentYear) {
                    result[d.getMonth()]++;
                }
            });

            return {
                labels: months,
                values: result
            };
        },



        async loadData() {
            try {
                const doctorRes = await getAllDoctors();
                const patientRes = await getAllPatients();
                const deptRes = await getDepartments();
                const apptRes = await getAllAppointments();

                this.doctors = doctorRes?.data ?? [];
                this.patients = patientRes?.data ?? [];
                this.departments = deptRes?.data ?? [];
                this.appointments = apptRes?.data ?? [];

                this.$nextTick(() => this.renderChart());
            } catch (e) {
                console.error("Dashboard load failed", e);
            }
        }
    },

    mounted() {
        this.loadData();
        this.$nextTick(() => {
            this.summaryCards.forEach(card => {
                const el = document.querySelector("#mini-chart-" + card.id);
                if (!el) return;

                const chart = new ApexCharts(el, {
                    chart: { type: "bar", height: 50, sparkline: { enabled: true } },
                    series: [{ data: [2, 4, 3, 6, 5, 8, 7] }],
                    colors: ["#4A90E2"]
                });
                chart.render();
            });
        });


    }
};
</script>

<style>
.dashboard-container {
    padding-left: 20px;
    padding-right: 20px;
}

.fs-12 {
    font-size: 12px;
}

.fs-24 {
    font-size: 24px;
}
</style>

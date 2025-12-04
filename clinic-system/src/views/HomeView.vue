<template>
    <div class="main-wrapper">
        <Navbar />
        <Sidebar />

        <div class="page-wrapper">
            <div class="container-fluid dashboard-container">

                <!-- TITLE -->
                <div class="d-flex align-items-center justify-content-between mb-4" style="gap: 10px;">
                    <h4 class="fw-bold mb-0"></h4>
                </div>

                <!-- ========== SUMMARY CARDS + MINI CHARTS ========== -->
                <div class="row">
                    <div class="col-xl-3 col-md-6 mb-4" v-for="card in summaryCards" :key="card.id">
                        <div class="card summary-card shadow-sm">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p class="text-muted fs-13 mb-1">{{ card.title }}</p>
                                        <h3 class="fw-bold">{{ card.value }}</h3>
                                    </div>

                                    <span :class="'avatar avatar-md rounded-circle ' + card.iconBg">
                                        <i :class="card.icon"></i>
                                    </span>
                                </div>

                                <div :id="'mini-chart-' + card.id" class="mini-chart"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ========== MAIN CHARTS ROW ========== -->
                <div class="row dashboard-chart-equal">

                    <!-- APPOINTMENT TREND CHART -->
                    <div class="col-xl-8 mb-4">
                        <div class="card shadow-sm">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="fw-bold mb-0">Appointment Statistics</h5>

                                <div class="d-flex align-items-center" style="gap: 10px;">
                                    <select v-model="chartMode" class="form-select form-select-sm w-auto">
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>

                                    <!-- ACTION DROPDOWN -->
                                    <div class="dropdown">
                                        <button class="btn btn-light btn-sm" data-bs-toggle="dropdown">
                                            <i class="ti ti-dots-vertical"></i>
                                        </button>

                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <button class="dropdown-item" @click="downloadChart('appointment')">
                                                    <i class="ti ti-photo"></i> Download PNG
                                                </button>
                                            </li>

                                            <li>
                                                <button class="dropdown-item" @click="exportChartCSV('appointment')">
                                                    <i class="ti ti-file-spreadsheet"></i> Export CSV
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            <div class="card-body">
                                <div id="appointment-chart" style="height: 340px;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- STATUS DONUT -->
                    <div class="col-xl-4 mb-4">
                        <div class="card shadow-sm">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="fw-bold mb-0">Status Overview</h5>

                                <div class="dropdown">
                                    <button class="btn btn-light btn-sm" data-bs-toggle="dropdown">
                                        <i class="ti ti-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li><button class="dropdown-item" @click="downloadChart('status')">
                                                <i class="ti ti-photo"></i> Download PNG
                                            </button></li>

                                        <li><button class="dropdown-item" @click="exportChartCSV('status')">
                                                <i class="ti ti-file-spreadsheet"></i> Download CSV
                                            </button></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="card-body">
                                <div id="status-donut"></div>
                            </div>
                        </div>

                    </div>

                </div>

                <!-- ========= SECONDARY CHARTS ========= -->
                <!-- ========= SECONDARY CHARTS (8 - 4) ========= -->
                <div class="row dashboard-chart-equal">

                    <!-- DOCTOR WORKLOAD (8) -->
                    <div class="col-xl-8 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="fw-bold mb-0">Doctor Workload</h5>

                                <div class="dropdown">
                                    <button class="btn btn-light btn-sm" data-bs-toggle="dropdown">
                                        <i class="ti ti-dots-vertical"></i>
                                    </button>

                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <button class="dropdown-item" @click="downloadChart('workload')">
                                                <i class="ti ti-photo"></i> Download PNG
                                            </button>
                                        </li>

                                        <li>
                                            <button class="dropdown-item" @click="exportChartCSV('workload')">
                                                <i class="ti ti-file-spreadsheet"></i> Export CSV
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="card-body">
                                <div id="doctor-workload"></div>
                            </div>
                        </div>
                    </div>

                    <!-- CALENDAR (4) -->
                    <div class="col-xl-4 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-header">
                                <h5 class="fw-bold mb-0">Calendar</h5>
                            </div>
                            <div class="card-body p-0 calendar-box">
                                <div id="calendar-mini"></div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- RECENT APPOINTMENTS -->
                <div class="col-xl-12">
                    <div class="card shadow-sm">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="fw-bold mb-0">Recent Appointments</h5>

                            <div class="dropdown">
                                <button class="btn btn-light btn-sm" data-bs-toggle="dropdown">
                                    <i class="ti ti-dots-vertical"></i>
                                </button>

                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><button class="dropdown-item" @click="downloadRecentAppointmentsCSV">
                                            <i class="ti ti-file-spreadsheet"></i> Export CSV
                                        </button></li>

                                    <!-- <li><button class="dropdown-item" @click="downloadRecentAppointmentsExcel">
                                            <i class="ti ti-file-type-xls"></i> Export Excel
                                        </button></li> -->
                                </ul>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Doctor</th>
                                            <th>Patient</th>
                                            <th>Location</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>


                                    <tbody>
                                        <tr v-for="item in recentAppointments" :key="item.appointmentId">
                                            <td>
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="avatar avatar-md bg-light rounded-circle me-2">
                                                        <i class="ti ti-stethoscope text-primary"></i>
                                                    </div>
                                                    <span>{{ item.doctorName }}</span>
                                                </div>
                                            </td>

                                            <td>
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="avatar avatar-md bg-light rounded-circle me-2">
                                                        <i class="ti ti-user text-secondary"></i>
                                                    </div>
                                                    <span>{{ item.patientName }}</span>
                                                </div>
                                            </td>
                                            <td>{{ item.departmentName }}</td>


                                            <td>{{ formatDate(item.date) }}</td>

                                            <td>
                                                <span :class="statusBadge(item.status)">
                                                    {{ item.status }}
                                                </span>
                                            </td>
                                        </tr>

                                        <tr v-if="recentAppointments.length === 0">
                                            <td colspan="4" class="text-center text-muted py-3">
                                                No appointment found.
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- </div> -->

            <div class="footer bg-white text-center p-2 border-top">
                2025 © Preclinic
            </div>
        </div>

    </div>
</template>


<script>
import ApexCharts from "apexcharts";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

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

            _chartAppointment: null,
            _chartStatusDonut: null,
            _chartWorkload: null,
            _chartGrowth: null,
            _miniCharts: {},
        };
    },

    computed: {
        /* ---------- SUMMARY CARDS ---------- */
        summaryCards() {
            return [
                {
                    id: 1,
                    title: "Doctors",
                    value: this.doctors.length,
                    icon: "ti ti-stethoscope fs-20 text-white",
                    iconBg: "bg-primary",
                },
                {
                    id: 2,
                    title: "Patients",
                    value: this.patients.length,
                    icon: "ti ti-users fs-20 text-white",
                    iconBg: "bg-success",
                },
                {
                    id: 3,
                    title: "Appointments",
                    value: this.appointments.length,
                    icon: "ti ti-calendar-event fs-20 text-white",
                    iconBg: "bg-info",
                },
                {
                    id: 4,
                    title: "Departments",
                    value: this.departments.length,
                    icon: "ti ti-building-hospital fs-20 text-white",
                    iconBg: "bg-danger",
                },
            ];
        },

        /* ---------- RECENT APPOINTMENTS (7 ngày) ---------- */
        recentAppointments() {
            const today = new Date();

            return this.appointments
                .filter(a => {
                    const d = new Date(a.date);
                    const diff = (today - d) / (1000 * 60 * 60 * 24);
                    return diff <= 7 && diff >= 0;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10);
        },
    },

    watch: {
        chartMode() {
            this.$nextTick(() => this.renderAppointmentChart());
        },
    },

    mounted() {
        this.loadData();
    },

    methods: {
        /* ------------------------------------------
         * LOAD DATA
         * ------------------------------------------ */
        async loadData() {
            try {
                const [dr, pt, dp, ap] = await Promise.all([
                    getAllDoctors(),
                    getAllPatients(),
                    getDepartments(),
                    getAllAppointments(),
                ]);

                this.doctors = Array.isArray(dr) ? dr : (dr?.data ?? []);
                this.patients = Array.isArray(pt) ? pt : (pt?.data ?? []);
                this.departments = Array.isArray(dp) ? dp : (dp?.data ?? []);
                const appointmentsRaw = Array.isArray(ap) ? ap : (ap?.data ?? []);

                /* ---------- MAP THÊM DEPARTMENT NAME VÀO APPOINTMENT ---------- */
                this.appointments = appointmentsRaw.map(a => {
                    const doctor = this.doctors.find(d => d.userId === a.doctorId);
                    const dep = doctor
                        ? this.departments.find(x => x.departmentId === doctor.departmentId)
                        : null;

                    return {
                        ...a,
                        departmentName: dep ? dep.name : "N/A"
                    };
                });

                this.$nextTick(() => {
                    this.renderMiniCharts();
                    this.renderAppointmentChart();
                    this.renderStatusDonut();
                    this.renderWorkloadChart();
                    this.renderPatientGrowth();
                    this.renderCalendar();
                });

            } catch (err) {
                console.error("Dashboard load failed:", err);
            }
        }
        ,
        async downloadChart(type) {
            let chart;

            switch (type) {
                case "appointment":
                    chart = this._chartAppointment;
                    break;
                case "status":
                    chart = this._chartStatusDonut;
                    break;
                case "workload":
                    chart = this._chartWorkload;
                    break;
            }

            if (!chart) return;

            const { imgURI } = await chart.dataURI();

            const link = document.createElement("a");
            link.href = imgURI;
            link.download = `${type}-chart.png`;
            link.click();
        }
        ,
        exportChartCSV(type) {
            let header = "";
            let rows = "";

            if (type === "status") {
                header = "Status,Number of Appointments,Percentage\n";

                // Đếm số lượng từng status
                const count = {
                    Pending: 0,
                    Confirmed: 0,
                    Completed: 0,
                    Cancelled: 0,
                    NoShow: 0
                };

                this.appointments.forEach(a => {
                    count[a.status] = (count[a.status] || 0) + 1;
                });

                // Tổng tất cả
                const total = Object.values(count).reduce((a, b) => a + b, 0);

                rows = Object.entries(count)
                    .map(([status, totalStatus]) => {
                        const percent = total === 0
                            ? "0%"
                            : ((totalStatus / total) * 100).toFixed(1) + "%";
                        return `${status},${totalStatus},${percent}`;
                    })
                    .join("\n");
            }
            if (type === "workload") {
                header = "Doctor,Number of Appointments\n";

                const count = {};
                this.appointments.forEach(a => {
                    count[a.doctorId] = (count[a.doctorId] || 0) + 1;
                });

                rows = Object.entries(count)
                    .map(([id, total]) => {
                        const d = this.doctors.find(x => x.userId == id);
                        return `${d.fullName},${total}`;
                    })
                    .join("\n");
            }


            // Xuất CSV
            const blob = new Blob([header + rows], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${type}-chart.csv`;
            link.click();
        }

        ,

        /* ------------------------------------------
         * STATUS BADGE (Pastel)
         * ------------------------------------------ */
        statusBadge(status) {
            switch (status) {
                case "Pending": return "badge status-pending";
                case "Confirmed": return "badge status-confirmed";
                case "Completed": return "badge status-completed";
                case "Cancelled": return "badge status-cancelled";
                case "NoShow": return "badge status-noshow";
                default: return "badge status-noshow";
            }
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString("en-GB");
        },

        /* ------------------------------------------
         * MINI SPARKLINE CHART (SUMMARY CARDS)
         * ------------------------------------------ */
        renderMiniCharts() {
            this.summaryCards.forEach(card => {
                const el = document.querySelector(`#mini-chart-${card.id}`);
                if (!el) return;

                const chart = new ApexCharts(el, {
                    chart: {
                        type: "area",
                        height: 60,
                        sparkline: { enabled: true },
                    },
                    series: [{
                        data: [5, 8, 6, 10, 7, 11, 9] // random đẹp
                    }],
                    stroke: { width: 2 },
                    colors: ["#4A90E2"],
                    fill: { type: "gradient", gradient: { opacityFrom: 0.45, opacityTo: 0.05 } }
                });

                chart.render();
                this._miniCharts[card.id] = chart;
            });
        },
        downloadRecentAppointmentsCSV() {
            if (!this.recentAppointments.length) return;

            const header = "Doctor,Patient,Department,Date,Status\n";

            const rows = this.recentAppointments
                .map(a =>
                    `${a.doctorName},${a.patientName},${a.departmentName},${this.formatDate(a.date)},${a.status}`
                )
                .join("\n");

            const blob = new Blob([header + rows], { type: "text/csv" });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "recent_appointments.csv";
            link.click();
        }
        ,

        /* ------------------------------------------
         * APPOINTMENT TREND (Line + Column)
         * ------------------------------------------ */
        renderAppointmentChart() {
            if (this._chartAppointment) this._chartAppointment.destroy();
            if (!this.appointments.length) return;

            let chartData = this.getAppointmentData();

            this._chartAppointment = new ApexCharts(
                document.querySelector("#appointment-chart"),
                {
                    chart: { type: "line", height: 330, toolbar: { show: false } },
                    stroke: { width: [0, 3], curve: "smooth" },
                    dataLabels: { enabled: true, enabledOnSeries: [1] },

                    series: [
                        { name: "Appointments", type: "column", data: chartData.values },
                        { name: "Trend", type: "line", data: chartData.values }
                    ],

                    colors: ["#2E37A4", "#00b8a9"],
                    xaxis: { categories: chartData.labels },
                    plotOptions: {
                        bar: { borderRadius: 6, columnWidth: "45%" }
                    }
                }
            );

            this._chartAppointment.render();
        },

        getAppointmentData() {
            switch (this.chartMode) {
                case "weekly": return this.getWeeklyData();
                case "monthly": return this.getMonthlyData();
                case "yearly": return this.getYearlyData();
            }
        },

        /* -------- WEEKLY -------- */
        getWeeklyData() {
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const result = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

            this.appointments.forEach(a => {
                const d = new Date(a.date);
                const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const name = map[d.getDay()];
                if (result[name] !== undefined) result[name]++;
            });

            return {
                labels: days,
                values: days.map(d => result[d]),
            };
        },

        /* -------- MONTHLY -------- */
        getMonthlyData() {
            const now = new Date();
            const month = now.getMonth();
            const year = now.getFullYear();

            const map = {};

            this.appointments.forEach(a => {
                const d = new Date(a.date);
                if (d.getMonth() === month && d.getFullYear() === year) {
                    const day = d.getDate();
                    map[day] = (map[day] || 0) + 1;
                }
            });

            return {
                labels: Object.keys(map),
                values: Object.values(map),
            };
        },

        /* -------- YEARLY -------- */
        getYearlyData() {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const result = Array(12).fill(0);

            this.appointments.forEach(a => {
                const d = new Date(a.date);
                result[d.getMonth()]++;
            });

            return { labels: months, values: result };
        },

        /* ------------------------------------------
         * STATUS DONUT CHART
         * ------------------------------------------ */
        renderStatusDonut() {
            if (this._chartStatusDonut) this._chartStatusDonut.destroy();

            const count = {
                Pending: 0,
                Confirmed: 0,
                Completed: 0,
                Cancelled: 0,
                NoShow: 0
            };

            this.appointments.forEach(a => {
                count[a.status] = (count[a.status] || 0) + 1;
            });

            this._chartStatusDonut = new ApexCharts(
                document.querySelector("#status-donut"),
                {
                    chart: { type: "donut", height: 300 },

                    labels: ["Pending", "Confirmed", "Completed", "Cancelled", "NoShow"],

                    series: [
                        count.Pending,
                        count.Confirmed,
                        count.Completed,
                        count.Cancelled,
                        count.NoShow
                    ],

                    /* 🎨 NEW PASTEL COLORS (Đậm – rõ hơn) */
                    colors: [
                        "#FFE08A",  // Pending
                        "#A3E4B7",  // Confirmed
                        "#A5D8FF",  // Completed
                        "#FFB3C6",  // Cancelled
                        "#D6D6D6"   // NoShow
                    ],

                    fill: { opacity: 1 },

                    states: {
                        hover: {
                            filter: {
                                type: "lighten",
                                value: 0.2
                            }
                        }
                    },

                    dataLabels: {
                        enabled: true,
                        formatter: (v) => `${v.toFixed(1)}%`,
                        style: {
                            fontSize: "14px",
                            fontWeight: "600"
                        }
                    },

                    stroke: { width: 0 },

                    legend: {
                        position: "bottom",
                        fontSize: "13px"
                    }
                }
            );

            this._chartStatusDonut.render();
        }
        ,

        /* ------------------------------------------
         * DOCTOR WORKLOAD (Bar Chart)
         * ------------------------------------------ */
        renderWorkloadChart() {
            if (this._chartWorkload) this._chartWorkload.destroy();

            const count = {};
            this.appointments.forEach(a => {
                count[a.doctorId] = (count[a.doctorId] || 0) + 1;
            });

            const labels = [];
            const values = [];

            Object.entries(count).forEach(([id, total]) => {
                const d = this.doctors.find(x => x.userId == id);
                if (d) {
                    labels.push(d.fullName);
                    values.push(total);
                }
            });

            this._chartWorkload = new ApexCharts(
                document.querySelector("#doctor-workload"),
                {
                    chart: { type: "bar", height: 300, toolbar: { show: false } },
                    series: [{ name: "Appointments", data: values }],
                    xaxis: { categories: labels },
                    plotOptions: { bar: { borderRadius: 6 } },
                    colors: ["#2e37a4d9"],
                }
            );

            this._chartWorkload.render();
        },

        /* ------------------------------------------
         * PATIENT GROWTH (7 days line chart)
         * ------------------------------------------ */
        renderPatientGrowth() {
            if (this._chartGrowth) this._chartGrowth.destroy();

            const result = {};
            const today = new Date();

            [...Array(7)].forEach((_, i) => {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const key = d.toLocaleDateString("en-GB");
                result[key] = 0;
            });

            this.patients.forEach(p => {
                const d = new Date(p.createdAt);
                const k = d.toLocaleDateString("en-GB");
                if (result[k] !== undefined) result[k]++;
            });

            const labels = Object.keys(result).reverse();
            const values = Object.values(result).reverse();

            this._chartGrowth = new ApexCharts(
                document.querySelector("#patient-growth"),
                {
                    chart: { type: "area", height: 300 },
                    series: [{ name: "New Patients", data: values }],
                    xaxis: { categories: labels },
                    colors: ["#00b8a9"],
                    stroke: { width: 3 },
                    fill: {
                        type: "gradient",
                        gradient: { opacityFrom: 0.45, opacityTo: 0.05 }
                    }
                }
            );

            this._chartGrowth.render();
        },

        /* ------------------------------------------
         * MINI CALENDAR (simple version)
         * ------------------------------------------ */
        renderCalendar() {
            const el = document.querySelector("#calendar-mini");
            if (!el) return;

            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const today = now.getDate();

            const firstDay = new Date(year, month, 1).getDay();
            const totalDays = new Date(year, month + 1, 0).getDate();
            const startIndex = firstDay === 0 ? 6 : firstDay - 1;

            let daysHtml = "";

            for (let i = 0; i < startIndex; i++) {
                daysHtml += `<div class="calendar-empty"></div>`;
            }

            for (let d = 1; d <= totalDays; d++) {
                const isToday = d === today;
                daysHtml += `
      <div class="calendar-day ${isToday ? "today" : ""}">
        ${d}
      </div>`;
            }

            el.innerHTML = `
    <div class="p-3 text-center">
      <h6 class="fw-bold">${now.toLocaleString("en-US", { month: "long" })} ${year}</h6>
      <div class="calendar-grid calendar-labels">
        <div>Mo</div><div>Tu</div><div>We</div>
        <div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
      </div>
      <div class="calendar-grid calendar-days mt-2">
        ${daysHtml}
      </div>
    </div>
  `;
        }


    }
};
</script>


<style>
.dashboard-container {
    padding-left: 20px;
    padding-right: 20px;
}

/* Make secondary charts equal height */
.dashboard-chart-equal .card {
    height: 420px;
}

/* Compact calendar box */
.calendar-box {
    padding: 14px !important;
}

#calendar-mini {
    padding: 12px !important;
}

#calendar-mini h6 {
    font-size: 16px;
    margin-bottom: 10px;
}

/* Smaller days */
.calendar-grid {
    gap: 4px !important;
}

.calendar-grid div {
    padding: 4px 0 !important;
    font-size: 12px !important;
}

.calendar-day {
    padding: 6px 0 !important;
}

.calendar-day.today {
    padding: 6px 0 !important;
    font-size: 13px !important;
}


.card {
    border-radius: 14px !important;
    border: none !important;
}


.card-header {
    border-bottom: none !important;
}

/* ------------------------------
   SUMMARY CARD
   ------------------------------ */
.summary-card {
    transition: 0.25s ease;
}

.summary-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* avatar icon in summary card */
.avatar-circle {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ------------------------------
   MINI SPARKLINE CHART
   ------------------------------ */
.chart-mini {
    margin-top: 8px;
}

/* ------------------------------
   STATUS BADGES (Pastel)
   ------------------------------ */
.status-pending {
    background: #fff5d6 !important;
    color: #d2a200 !important;
    font-weight: 800;
}

.status-confirmed {
    background: #e1f7e6 !important;
    color: #2e8b57 !important;
    font-weight: 800;
}

.status-completed {
    background: #d9efff !important;
    color: #0d6efd !important;
    font-weight: 800;
}

.status-cancelled {
    background: #ffe1e5 !important;
    color: #d6336c !important;
    font-weight: 800;
}

.status-noshow {
    background: #ececec !important;
    color: #6c757d !important;
    font-weight: 800;
}

/* ------------------------------
   RECENT APPOINTMENTS TABLE
   ------------------------------ */
.table-hover tbody tr:hover {
    background-color: #f5f9ff !important;
}

/* .table td,
.table th {
    vertical-align: ;
} */
/* ====== CLEAN WHITE THEAD ====== */
.table thead th,
.table-light th {
    background-color: #eaecff !important;
    color: #2d3954 !important;
    border-bottom: 2px solid #eef2f9 !important;
}

/* Align thead with avatar + gap inside tbody */
/* .table thead th:first-child,
.table thead th:nth-child(2) {
    padding-left: 52px !important;
} */





/* pastel avatar circle */
.avatar-soft {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.bg-light-soft {
    background: #f1f3f5 !important;
}

/* Doctor icon color */
.icon-doctor {
    color: #4a6cf7 !important;
}

/* Patient icon color */
.icon-patient {
    color: #6c757d !important;
}

/* ------------------------------
   CALENDAR MINI WIDGET
   ------------------------------ */
#calendar-mini {
    background: white;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

#calendar-mini h6 {
    font-size: 18px;
    font-weight: 700;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
}

.calendar-grid div {
    font-size: 13px;
    padding: 6px 0;
    text-align: center;
    background: #f5faff;
    border-radius: 6px;
    color: #3c4a59;
    font-weight: 500;
}

/* ------------------------------
   STATUS DONUT CHART CONTAINER
   ------------------------------ */
#status-donut {
    margin-top: -10px;
}

/* ------------------------------
   DOCTOR WORKLOAD BAR CHART
   ------------------------------ */
#doctor-workload {
    margin-top: 10px;
}

/* ------------------------------
   PATIENT GROWTH AREA CHART
   ------------------------------ */
#patient-growth {
    margin-top: 10px;
}

/* ------------------------------
   SECTION TITLES
   ------------------------------ */
.section-title {
    font-weight: 700;
    font-size: 18px;
}

/* ------------------------------
   HOMEPAGE GRID SPACING
   ------------------------------ */
.widget-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 22px;
}

/* ------------------------------
   WIDGET BOX (calendar, donut,…)
   ------------------------------ */
.widget-box {
    background: white;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.06);
    transition: 0.2s;
}

.widget-box:hover {
    transform: translateY(-4px);
}

/* ------------------------------
   TOP DOCTORS LIST
   ------------------------------ */
.list-group-item {
    border: none !important;
    border-bottom: 1px solid #eee !important;
}

.list-group-item:last-child {
    border-bottom: none !important;
}

.list-group-item strong {
    font-weight: 600;
}

/* ------------------------------
   ADD EXTRA FEEL: SOFT GRADIENT
   ------------------------------ */
.card-gradient {
    background: linear-gradient(135deg, #f1f6ff, #ffffff) !important;
}

/* ------------------------------
   PAGE TITLE
   ------------------------------ */
.page-wrapper h4 {
    color: #3e4a60;
    font-weight: 700;
}

/* ------------------------------
   SHADOW FOR CHART CARDS
   ------------------------------ */
.card.shadow-chart {
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05) !important;
}

/* === FIX HEIGHT FOR CHART ROW (Make both equal height) === */
.dashboard-chart-equal {
    display: flex;
    align-items: stretch;
}

.dashboard-chart-equal .card {
    height: 420px;
    /* 👈 chỉnh cao/thấp theo ý bạn */
}

.dashboard-chart-equal .card-body {
    height: calc(100% - 60px);
    /* trừ phần header */
}

/* Calendar wrapper */
#calendar-mini {
    padding: 20px;
}

/* Lưới chung */
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
}

/* Label hàng đầu */
.calendar-labels div {
    font-size: 13px;
    font-weight: 600;
    color: #6b7a99;
}

/* Ngày trong tháng */
.calendar-day {
    font-size: 13px;
    border-radius: 6px;
    padding: 8px 0;
    background: #f5faff;
    color: #3c4a59;
    font-weight: 500;
    text-align: center;
    cursor: default;
}

/* Ô trống */
.calendar-empty {
    padding: 8px 0;
}

/* Highlight hôm nay */
.calendar-day.today {
    background: #4A90E2;
    color: white;
    font-weight: 700;
}

.avatar-soft-primary {
    background-color: #e8eaff !important;
    color: #4a6cf7 !important;
}

.avatar-soft-info {
    background-color: #e7f5ff !important;
    color: #1c7ed6 !important;
}

.avatar-soft-success {
    background-color: #e6fcf5 !important;
    color: #0ca678 !important;
}

.avatar-soft-danger {
    background-color: #ffe8e8 !important;
    color: #e03131 !important;
}

.avatar.avatar-sm {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.avatar-sm i {
    font-size: 16px;
}

.card-header .btn-light.btn-sm {
    padding: 4px 6px;
    border-radius: 8px;
}
</style>

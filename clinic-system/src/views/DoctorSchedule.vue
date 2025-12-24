<template>
    <div class="main-wrapper">
        <Navbar />
        <Sidebar />

        <div class="page-wrapper">
            <div class="content">

                <!-- HEADER -->
                <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                    <h4 class="fw-bold mb-0">
                        Doctor Schedule
                        <span class="badge badge-soft-primary fs-13 ms-2">
                            Total Doctors: {{ doctors.length }}
                        </span>
                    </h4>
                </div>

                <!-- TABLE -->
                <div class="table-responsive">
                    <table class="table table-nowrap">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Department</th>
                                <th>Phone</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-if="loading">
                                <td colspan="4" class="text-center py-4">Loading...</td>
                            </tr>

                            <tr v-for="doc in doctors" :key="doc.userId">
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="avatar rounded-circle text-white fw-semibold me-2 d-flex align-items-center justify-content-center"
                                            :style="{ backgroundColor: getColor(doc.fullName), width: '45px', height: '45px' }">
                                            {{ getInitial(doc.fullName) }}
                                        </div>
                                        <div>
                                            <div class="fw-semibold">{{ doc.fullName }}</div>
                                            <small class="text-muted">{{ doc.departmentName }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td>{{ doc.departmentName }}</td>
                                <td>{{ doc.phone || "N/A" }}</td>

                                <td>
                                    <a href="javascript:void(0)" @click="openScheduleModal(doc)">
                                        <i class="ti ti-eye"></i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

        <!-- MODAL -->
        <div id="doctor_schedule_modal" class="modal fade">
            <div class="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
                <div class="modal-content p-3">

                    <div class="modal-header">
                        <h5>Edit Doctor Schedule</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <input class="form-control mb-3" :value="selectedDoctor.fullName" disabled />

                        <!-- DAY BUTTONS -->
                        <div class="d-flex gap-2 flex-wrap mb-3">
                            <button v-for="d in days" :key="d" class="btn"
                                :class="activeDay === d ? 'btn-primary' : 'btn-light'" @click="activeDay = d">
                                {{ d }}
                            </button>
                        </div>

                        <p v-if="hasConfirmedFutureAppointmentForDay(selectedDoctor.userId, activeDay)"
                            class="text-danger fw-semibold">
                            ⚠ This day has confirmed appointments. You cannot turn off the schedule.
                        </p>

                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" v-model="schedules[activeDay].isAssigned" />
                            <label class="form-check-label">Assigned</label>
                        </div>

                        <div class="mb-3">
                            <label class="fw-semibold">Work Shift</label>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" value="Morning"
                                    v-model="schedules[activeDay].shift" :disabled="!schedules[activeDay].isAssigned" />
                                Morning (08:00 - 12:00)
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" value="Afternoon"
                                    v-model="schedules[activeDay].shift" :disabled="!schedules[activeDay].isAssigned" />
                                Afternoon (13:00 - 17:00)
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button class="btn btn-primary" @click="saveAllSchedules">
                            Save Weekly Schedule
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>


<script>
import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";

import { getAllDoctors } from "../services/doctorService";
import { getDepartments } from "../services/departmentService";
import {
    createSchedule,
    getScheduleByDoctor,
    deleteSchedule
} from "../services/scheduleService";

import {
    getAllAppointments,
    updateAppointmentStatus
} from "../services/appointmentService";

import { useToast } from "vue-toastification";

export default {
    name: "DoctorSchedule",
    components: { Sidebar, Navbar },

    data() {
        return {
            doctors: [],
            departments: [],
            loading: false,

            selectedDoctor: {},
            activeDay: "Monday",
            allAppointments: [],

            days: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],

            schedules: {
                Monday: { locked: false, isAssigned: false, shift: "Morning" },
                Tuesday: { locked: false, isAssigned: false, shift: "Morning" },
                Wednesday: { locked: false, isAssigned: false, shift: "Morning" },
                Thursday: { locked: false, isAssigned: false, shift: "Morning" },
                Friday: { locked: false, isAssigned: false, shift: "Morning" },
                Saturday: { locked: false, isAssigned: false, shift: "Morning" },
                Sunday: { locked: false, isAssigned: false, shift: "Morning" }
            }
        };
    }
    ,

    async created() {
        await this.loadData();
    },

    methods: {
        /* ================== UTIL ================== */
        createEmptySchedule() {
            return {
                scheduleId: null,
                isAssigned: false,
                shift: "Morning",
                originalShift: null,
                locked: false
            };
        },

        dayToNumber(day) {
            return {
                Sunday: 0,
                Monday: 1,
                Tuesday: 2,
                Wednesday: 3,
                Thursday: 4,
                Friday: 5,
                Saturday: 6
            }[day];
        },

        getInitial(name) {
            return name?.charAt(0).toUpperCase() || "?";
        },

        getColor(name) {
            const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"];
            let hash = 0;
            for (let c of name) {
                hash = c.charCodeAt(0) + ((hash << 5) - hash);
            }
            return colors[Math.abs(hash) % colors.length];
        },

        /* ================== LOAD DATA ================== */
        async loadData() {
            this.loading = true;

            const [docRes, deptRes] = await Promise.all([
                getAllDoctors(),
                getDepartments()
            ]);

            const deptMap = {};
            (deptRes.data ?? deptRes).forEach(d => {
                deptMap[d.departmentId] = d.name;
            });

            this.doctors = (docRes.data ?? docRes)
                .filter(d => d.status === "Active")
                .map(d => ({
                    ...d,
                    departmentName: deptMap[d.departmentId] || "No Department"
                }));

            this.loading = false;
        },

        /* ================== APPOINTMENT LOGIC ================== */
        hasConfirmedAppointment(doctorId, day) {
            const targetDay = this.dayToNumber(day);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return this.allAppointments.some(a => {
                if (a.doctorId !== doctorId) return false;
                if (a.status !== "CONFIRMED") return false;

                // ✅ Parse date AN TOÀN
                const raw = a.date.split(" ")[0]; // 1/3/2026
                const [month, date, year] = raw.split("/").map(Number);

                const apptDate = new Date(year, month - 1, date);
                apptDate.setHours(0, 0, 0, 0);

                // ❗ chỉ lock tương lai
                if (apptDate < today) return false;

                return apptDate.getDay() === targetDay;
            });
        }
        ,

        async cancelPendingAppointments(doctorId, day) {
            const targetDay = this.dayToNumber(day);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const list = this.allAppointments.filter(a => {
                if (a.doctorId !== doctorId) return false;
                if (a.status !== "PENDING") return false;

                const raw = a.date.split(" ")[0];
                const [month, date, year] = raw.split("/").map(Number);
                const apptDate = new Date(year, month - 1, date);
                apptDate.setHours(0, 0, 0, 0);

                if (apptDate < today) return false;

                return apptDate.getDay() === targetDay;
            });

            for (let a of list) {
                await updateAppointmentStatus({
                    appointmentId: a.appointmentId,
                    status: "CANCELLED",
                    reason: "Cancelled due to schedule change"
                });
            }
        }
        ,

        /* ================== MODAL ================== */
        async openScheduleModal(doc) {
            this.selectedDoctor = doc;
            this.activeDay = "Monday";

            const apptRes = await getAllAppointments();
            this.allAppointments = apptRes.data ?? apptRes;

            // reset schedules
            this.days.forEach(d => {
                this.schedules[d] = {
                    ...this.createEmptySchedule(),
                    locked: this.hasConfirmedAppointment(doc.userId, d)
                };
            });

            // load existing schedules
            const res = await getScheduleByDoctor(doc.userId);
            (res.data ?? res).forEach(s => {
                const shift = s.startTime.startsWith("08")
                    ? "Morning"
                    : "Afternoon";

                this.schedules[s.dayOfWeek] = {
                    ...this.schedules[s.dayOfWeek],
                    scheduleId: s.scheduleId,
                    isAssigned: true,
                    shift,
                    originalShift: shift
                };
            });

            new bootstrap.Modal(
                document.getElementById("doctor_schedule_modal")
            ).show();
        },
        hasConfirmedFutureAppointmentForDay(doctorId, day) {
            const targetDay = this.dayToNumber(day);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return this.allAppointments.some(a => {
                if (a.doctorId !== doctorId) return false;
                if (a.status !== "Confirmed" && a.status !== "CONFIRMED") return false;

                const raw = a.date.split(" ")[0]; // MM/DD/YYYY
                const [month, date, year] = raw.split("/").map(Number);
                const apptDate = new Date(year, month - 1, date);
                apptDate.setHours(0, 0, 0, 0);

                return apptDate >= today && apptDate.getDay() === targetDay;
            });
        }
        ,

        /* ================== SAVE ================== */
        async saveAllSchedules() {
            const toast = useToast();

            for (let day of this.days) {
                const item = this.schedules[day];
                console.log("===== SAVE CHECK =====");
                console.log("Day:", day);
                console.log("isAssigned:", item.isAssigned);
                console.log("doctorId:", this.selectedDoctor.userId);

                // ❌ nếu tắt Assigned mà còn CONFIRMED → CHẶN
                if (!item.isAssigned) {
                    const hasConfirmed =
                        this.hasConfirmedFutureAppointmentForDay(
                            this.selectedDoctor.userId,
                            day
                        );
                    console.log("hasConfirmedFutureAppointment:", hasConfirmed);


                    if (hasConfirmed) {
                        toast.error(
                            `Cannot turn off ${day} because there are confirmed appointments`
                        );
                        continue;
                    }

                }

                // 🔄 huỷ PENDING
                await this.cancelPendingAppointments(
                    this.selectedDoctor.userId,
                    day
                );

                // xoá schedule
                if (!item.isAssigned && item.scheduleId) {
                    await deleteSchedule(item.scheduleId);
                }

                // tạo schedule
                if (item.isAssigned && !item.scheduleId) {
                    const time =
                        item.shift === "Morning"
                            ? { start: "08:00", end: "12:00" }
                            : { start: "13:00", end: "17:00" };

                    await createSchedule({
                        doctorId: this.selectedDoctor.userId,
                        dayOfWeek: day,
                        startTime: time.start + ":00",
                        endTime: time.end + ":00",
                        roomNumber: this.selectedDoctor.departmentName
                    });
                }
            }


            toast.success("Weekly schedule saved successfully");

            bootstrap.Modal.getInstance(
                document.getElementById("doctor_schedule_modal")
            ).hide();
        }
    }
};
</script>

<template>
    <div class="main-wrapper">
        <NavbarPatient />
        <SidebarPatient />

        <div class="page-wrapper">
            <div class="content">

                <!-- BACK -->
                <div class="mb-4">
                    <h6 class="fw-bold mb-0 d-flex align-items-center" style="cursor:pointer" @click="goBack">
                        <i class="ti ti-chevron-left me-1"></i>
                        Book Appointment
                    </h6>
                </div>

                <div class="card">
                    <div class="card-body">

                        <!-- DEPARTMENT -->
                        <div class="mb-3">
                            <label class="form-label">Department *</label>
                            <select v-model="form.departmentId" class="form-select" @change="loadDoctors">
                                <option value="">Select department</option>
                                <option v-for="d in departments" :key="d.departmentId" :value="d.departmentId">
                                    {{ d.name }}
                                </option>
                            </select>
                        </div>

                        <!-- DATE -->
                        <div class="mb-3">
                            <label class="form-label">Date *</label>
                            <input type="date" v-model="form.date" class="form-control"
                                :min="new Date().toISOString().split('T')[0]" @change="loadDoctors" />
                        </div>

                        <!-- SHIFT -->
                        <div class="mb-3">
                            <label class="form-label">Shift *</label>

                            <div class="d-flex gap-4">

                                <!-- Morning -->
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" value="Morning" v-model="form.shift"
                                        :disabled="disableMorning()" @change="loadDoctors" />
                                    <label class="form-check-label">
                                        Morning
                                    </label>
                                </div>

                                <!-- Afternoon -->
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" value="Afternoon" v-model="form.shift"
                                        :disabled="disableAfternoon()" @change="loadDoctors" />
                                    <label class="form-check-label">
                                        Afternoon
                                    </label>
                                </div>

                            </div>
                        </div>

                        <!-- DOCTOR -->
                        <div class="mb-3">
                            <label class="form-label">Doctor *</label>

                            <select v-model="form.doctorId" class="form-select">
                                <option value="">Select doctor</option>

                                <option v-for="d in doctors" :key="d.userId" :value="d.userId">
                                    {{ d.fullName }} ({{ d.remainingSlots }} slots)
                                </option>
                            </select>

                            <div v-if="doctors.length === 0 && form.date && form.departmentId"
                                class="text-danger small mt-1">
                                No doctors available
                            </div>
                        </div>

                        <!-- REASON -->
                        <div class="mb-3">
                            <label class="form-label">Reason</label>
                            <textarea v-model="form.reason" class="form-control"></textarea>
                        </div>

                    </div>
                </div>

                <!-- ACTION -->
                <div class="d-flex justify-content-end mt-3">
                    <button class="btn btn-light me-2" @click="goBack">
                        Cancel
                    </button>

                    <button class="btn btn-primary" @click="submit">
                        Book Appointment
                    </button>
                </div>

            </div>
        </div>
    </div>
    <!--  -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
        <div id="appToast" class="toast align-items-center text-bg-success border-0">
            <div class="d-flex">
                <div class="toast-body" id="toastMessage">
                    Success
                </div>
                <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useAuthStore } from "../../stores/auth"
import { getPatientAppointments } from "../../services/appointmentService"

import NavbarPatient from "../../components/patients/NavbarPatient.vue"
import SidebarPatient from "../../components/patients/SidebarPatient.vue"

import { getDepartments } from "../../services/departmentService"
import { getDoctorsByWeekday, bookAppointment } from "../../services/appointmentService"
import { getScheduleByDoctor } from "../../services/scheduleService"

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const departments = ref([])
const doctors = ref([])
const allAppointments = ref([])

const form = ref({
    departmentId: "",
    doctorId: "",
    date: "",
    shift: "",
    reason: ""
})

/* ===== COMMON ===== */
const goBack = () => router.back()

const getWeekday = (dateStr) => {
    const day = new Date(dateStr).getDay()
    return day === 0 ? 6 : day - 1
}

const buildDateTime = () => {
    if (form.value.shift === "Morning") return `${form.value.date}T08:00:00`
    return `${form.value.date}T13:00:00`
}

/* ===== LOAD DOCTOR ===== */
const loadDoctors = async () => {
    if (!form.value.departmentId || !form.value.date || !form.value.shift) {
        doctors.value = []
        form.value.doctorId = ""
        return
    }

    try {
        const weekdayIndex = getWeekday(form.value.date)

        const weekdayNames = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ]

        const dayName = weekdayNames[weekdayIndex]

        const res = await getDoctorsByWeekday(weekdayIndex)
        const data = res?.data ?? res ?? []

        const matchedDoctors = []

        for (const doc of data) {
            if (Number(doc.departmentId) !== Number(form.value.departmentId)) continue

            let schedules = []

            try {
                const schRes = await getScheduleByDoctor(doc.userId)
                schedules = schRes.data || []
            } catch (err) {
                console.error("Load schedule error:", err)
                continue
            }

            const matchedSchedule = schedules.find(s => {
                const start = s.startTime.substring(0, 5)
                const shift =
                    start === "08:00" ? "Morning" :
                        start === "13:00" ? "Afternoon" : ""

                return s.dayOfWeek === dayName && shift === form.value.shift
            })

            if (!matchedSchedule) continue

            matchedDoctors.push(doc)
        }

        doctors.value = matchedDoctors

        if (!doctors.value.some(d => Number(d.userId) === Number(form.value.doctorId))) {
            form.value.doctorId = ""
        }

    } catch (err) {
        console.error("Load doctors error:", err)
        doctors.value = []
        form.value.doctorId = ""
    }
}
/* ===== SUBMIT ===== */
const submit = async () => {
    // ===== VALIDATION =====
    if (!form.value.departmentId) return showToast("Select department", "warning")
    if (!form.value.date) return showToast("Select date", "warning")
    if (!form.value.shift) return showToast("Select shift", "warning")
    if (!form.value.doctorId) return showToast("Select doctor", "warning")

    // ===== TIME VALIDATION (QUAN TRỌNG) =====
    const now = new Date()

    let shiftEnd

    if (form.value.shift === "Morning") {
        shiftEnd = new Date(form.value.date + "T12:00:00")
    } else {
        shiftEnd = new Date(form.value.date + "T17:00:00")
    }

    // ❌ nếu đã qua giờ kết thúc ca → chặn
    if (now > shiftEnd) {
        return showToast("This shift has already ended", "danger")
    }

    // ===== CALL API =====
    const isDuplicate = allAppointments.value.some(a => {

        if (a.status === "Cancelled") return false

        if (a.patientId !== authStore.user.userId) return false
        if (a.doctorId !== form.value.doctorId) return false

        const d = new Date(a.date)
        const selected = new Date(form.value.date)

        const sameDate =
            d.getFullYear() === selected.getFullYear() &&
            d.getMonth() === selected.getMonth() &&
            d.getDate() === selected.getDate()

        if (!sameDate) return false

        const hour = d.getHours()
        const apptShift = hour < 12 ? "Morning" : "Afternoon"

        return apptShift === form.value.shift
    })

    if (isDuplicate) {
        return showToast("You already booked this shift", "danger")
    }
    try {
        await bookAppointment({
            patientId: authStore.user.userId,
            doctorId: form.value.doctorId,
            date: buildDateTime(),
            reason: form.value.reason || null
        })

        allAppointments.value =
            (await getPatientAppointments(authStore.user.userId)).data

        showToast("Appointment booked successfully 🎉", "success")
        router.push("/patient/appointments")

    } catch (err) {
        console.error("Booking error:", err)

        let message = "Failed to book appointment"

        const res = err?.response?.data

        const text = typeof res === "string"
            ? res.toLowerCase()
            : res?.message?.toLowerCase() || ""

        if (text.includes("already")) {
            message = "You already booked this shift"
        }
        else if (text.includes("not scheduled")) {
            message = "Doctor is not working on this day"
        }
        else if (res?.message) {
            message = res.message
        }
        else if (typeof res === "string") {
            message = res
        }

        showToast(message, "danger")
    }
}

/* ===== INIT ===== */
onMounted(async () => {
    try {
        // load departments
        const resDept = await getDepartments()
        const data = resDept?.data ?? resDept ?? []
        departments.value = data.filter(d => d.status === "Active")

        // 🔥 load appointment của patient
        allAppointments.value =
            (await getPatientAppointments(authStore.user.userId)).data

    } catch (err) {
        console.error("Init error:", err)
    }

    // auto fill doctor nếu có
    const doctorId = route.query.doctorId
    if (doctorId) {
        form.value.doctorId = Number(doctorId)
    }
})
const showToast = (message, type = "success") => {
    const toastEl = document.getElementById("appToast")
    const toastBody = document.getElementById("toastMessage")

    toastBody.innerText = message

    toastEl.classList.remove(
        "text-bg-success",
        "text-bg-danger",
        "text-bg-warning"
    )

    toastEl.classList.add(
        type === "success"
            ? "text-bg-success"
            : type === "danger"
                ? "text-bg-danger"
                : "text-bg-warning"
    )

    const toast = new bootstrap.Toast(toastEl)
    toast.show()
}
const isToday = (dateStr) => {
    const today = new Date()
    const selected = new Date(dateStr)

    return today.toDateString() === selected.toDateString()
}
const disableMorning = () => {
    if (!form.value.date) return false
    if (!isToday(form.value.date)) return false

    return new Date().getHours() >= 12
}

const disableAfternoon = () => {
    if (!form.value.date) return false
    if (!isToday(form.value.date)) return false

    return new Date().getHours() >= 17
}
</script>
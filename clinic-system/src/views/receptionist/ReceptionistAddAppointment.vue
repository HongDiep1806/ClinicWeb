<template>
    <div class="main-wrapper">

        <NavbarReceptionist />
        <SidebarReceptionist />

        <div class="page-wrapper">
            <div class="content">

                <!-- BACK -->
                <div class="mb-4">
                    <h6 class="fw-bold mb-0 d-flex align-items-center" style="cursor:pointer" @click="goBack">
                        <i class="ti ti-chevron-left me-1"></i>
                        Receptionist Appointments
                    </h6>
                </div>

                <div class="card">
                    <div class="card-body">

                        <!-- PATIENT -->
                        <div class="mb-3 position-relative patient-select">

                            <label class="form-label">Patient *</label>

                            <div class="input-group">

                                <input type="text" class="form-control" placeholder="Search patient..."
                                    v-model="patientSearch" @focus="showPatientDropdown = true"
                                    @input="showPatientDropdown = true" />

                                <span class="input-group-text bg-white" style="cursor:pointer"
                                    @click="togglePatientDropdown">
                                    <i class="ti ti-chevron-down"></i>
                                </span>

                            </div>

                            <ul v-if="showPatientDropdown && filteredPatients.length"
                                class="dropdown-menu show w-100 mt-1 shadow-sm" style="max-height:220px; overflow:auto">

                                <li v-for="p in filteredPatients" :key="p.userId"
                                    class="dropdown-item d-flex justify-content-between" @click="selectPatient(p)">

                                    <span>{{ p.fullName }}</span>

                                    <span class="badge bg-secondary-subtle text-secondary">
                                        #PT{{ p.userId }}
                                    </span>

                                </li>

                            </ul>

                        </div>

                        <!-- DEPARTMENT -->
                        <div class="mb-3 position-relative department-select">

                            <label class="form-label">Department *</label>

                            <div class="input-group">

                                <input type="text" class="form-control" placeholder="Search department..."
                                    v-model="departmentSearch" @focus="showDepartmentDropdown = true"
                                    @input="showDepartmentDropdown = true" />

                                <span class="input-group-text bg-white" style="cursor:pointer"
                                    @click="toggleDepartmentDropdown">
                                    <i class="ti ti-chevron-down"></i>
                                </span>

                            </div>

                            <ul v-if="showDepartmentDropdown && filteredDepartments.length"
                                class="dropdown-menu show w-100 mt-1 shadow-sm">

                                <li v-for="d in filteredDepartments" :key="d.departmentId" class="dropdown-item"
                                    @click="selectDepartment(d)">

                                    {{ d.name }}

                                </li>

                            </ul>

                        </div>

                        <!-- DATE -->
                        <div class="mb-3">

                            <label class="form-label">Date *</label>

                            <input id="datePicker" type="text" class="form-control datetimepicker"
                                placeholder="DD/MM/YYYY" />

                        </div>

                        <!-- SHIFT -->
                        <div class="mb-3">

                            <label class="form-label">Work Shift *</label>

                            <div class="d-flex gap-4">

                                <div class="form-check">

                                    <input type="radio" class="form-check-input" value="Morning" v-model="form.shift"
                                        @change="loadDoctors" />

                                    <label class="form-check-label">
                                        Morning (08:00 – 12:00)
                                    </label>

                                </div>

                                <div class="form-check">

                                    <input type="radio" class="form-check-input" value="Afternoon" v-model="form.shift"
                                        @change="loadDoctors" />

                                    <label class="form-check-label">
                                        Afternoon (13:00 – 17:00)
                                    </label>

                                </div>

                            </div>

                        </div>

                        <!-- DOCTOR -->
                        <div class="mb-3 position-relative doctor-select">

                            <label class="form-label">Doctor *</label>

                            <div class="input-group">

                                <input type="text" class="form-control" :disabled="doctors.length === 0"
                                    placeholder="Search doctor..." v-model="doctorSearch"
                                    @focus="doctors.length && (showDoctorDropdown = true)"
                                    @input="doctors.length && (showDoctorDropdown = true)" />

                                <span class="input-group-text bg-white"
                                    :style="{ cursor: doctors.length ? 'pointer' : 'not-allowed' }"
                                    @click="doctors.length && toggleDoctorDropdown()">
                                    <i class="ti ti-chevron-down"></i>
                                </span>

                            </div>

                            <ul v-if="showDoctorDropdown && filteredDoctors.length"
                                class="dropdown-menu show w-100 mt-1 shadow-sm">

                                <li v-for="d in filteredDoctors" :key="d.userId"
                                    class="dropdown-item d-flex justify-content-between" @click="selectDoctor(d)">

                                    <span>{{ d.fullName }}</span>

                                    <span class="badge" :class="d.remainingSlots > 50
                                        ? 'bg-success-subtle text-success'
                                        : 'bg-warning-subtle text-warning'">
                                        {{ d.remainingSlots }} slots
                                    </span>

                                </li>

                            </ul>

                        </div>

                        <!-- REASON -->
                        <div class="mb-3">

                            <label class="form-label">Reason</label>

                            <textarea class="form-control" rows="2" v-model="form.reason"
                                placeholder="Optional note..."></textarea>

                        </div>

                    </div>
                </div>

                <!-- ACTION -->
                <div class="d-flex justify-content-end mt-3">

                    <button class="btn btn-light me-2" @click="goBack">
                        Cancel
                    </button>

                    <button class="btn btn-primary" @click="submit">
                        Create Appointment
                    </button>

                </div>

            </div>
        </div>

    </div>
</template>
<script setup>

import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"

import NavbarReceptionist from "../../components/receptionist/NavbarReceptionist.vue"
import SidebarReceptionist from "../../components/receptionist/SidebarReceptionist.vue"

import { getAllPatients } from "../../services/userService"
import { getDepartments } from "../../services/departmentService"
import { getDoctorsByWeekday, bookAppointment, getAllAppointments } from "../../services/appointmentService"
import { getScheduleByDoctor } from "../../services/scheduleService"
import moment from "moment"

import { useToast } from "vue-toastification"

const router = useRouter()
const toast = useToast()

const patients = ref([])
const departments = ref([])
const doctors = ref([])

const form = ref({
    patientId: "",
    departmentId: "",
    date: "",
    shift: "",
    doctorId: "",
    reason: ""
})

const DAILY_KPI = 200
const allAppointments = ref([])

const patientSearch = ref("")
const departmentSearch = ref("")
const doctorSearch = ref("")

const showPatientDropdown = ref(false)
const showDepartmentDropdown = ref(false)
const showDoctorDropdown = ref(false)

const filteredPatients = computed(() => {
    if (!patientSearch.value) return patients.value
    return patients.value.filter(p => p.fullName.toLowerCase().includes(patientSearch.value.toLowerCase()))
})

const filteredDepartments = computed(() => {
    if (!departmentSearch.value) return departments.value
    return departments.value.filter(d => d.name.toLowerCase().includes(departmentSearch.value.toLowerCase()))
})

const filteredDoctors = computed(() => {
    if (!doctorSearch.value) return doctors.value
    return doctors.value.filter(d => d.fullName.toLowerCase().includes(doctorSearch.value.toLowerCase()))
})

const selectPatient = (p) => {
    form.value.patientId = p.userId
    patientSearch.value = p.fullName
    showPatientDropdown.value = false
}

const selectDepartment = async (d) => {
    form.value.departmentId = d.departmentId
    departmentSearch.value = d.name
    showDepartmentDropdown.value = false

    form.value.doctorId = ""
    doctorSearch.value = ""
    doctors.value = []

    await loadDoctors()
}

const selectDoctor = (d) => {
    form.value.doctorId = d.userId
    doctorSearch.value = d.fullName
    showDoctorDropdown.value = false
}

const togglePatientDropdown = () => showPatientDropdown.value = !showPatientDropdown.value
const toggleDepartmentDropdown = () => showDepartmentDropdown.value = !showDepartmentDropdown.value
const toggleDoctorDropdown = () => showDoctorDropdown.value = !showDoctorDropdown.value

const goBack = () => router.push("/receptionist/appointments")

const getWeekday = (date) => {
    const day = new Date(date).getDay()
    return day === 0 ? 6 : day - 1
}

const buildDate = (date, shift) => {
    if (shift === "Morning") return `${date}T08:00:00`
    if (shift === "Afternoon") return `${date}T13:00:00`
}

const loadDoctors = async () => {
    if (!form.value.departmentId || !form.value.date || !form.value.shift) {
        doctors.value = []
        return
    }

    const weekdayIndex = getWeekday(form.value.date)

    const res = await getDoctorsByWeekday(weekdayIndex)
    const doctorList = res.data || []

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
    const matchedDoctors = []

    for (const doc of doctorList) {
        if (doc.departmentId != form.value.departmentId) continue

        let schedules = []

        try {
            const schRes = await getScheduleByDoctor(doc.userId)
            schedules = schRes.data || []
        } catch (err) {
            console.error("Schedule API error for doctor:", doc.userId, err)
            continue
        }

        const matchedSchedule = schedules.find(s => {
            const start = s.startTime.substring(0, 5)
            const shift =
                start === "08:00" ? "Morning" :
                    start === "13:00" ? "Afternoon" : ""

            return (
                s.dayOfWeek === dayName &&
                shift === form.value.shift
            )
        })

        if (!matchedSchedule) continue

        const appointmentCount = allAppointments.value.filter(a => {
            if (a.doctorId !== doc.userId) return false
            if (a.status === "Cancelled") return false

            const apptDate = a.date.substring(0, 10)
            if (apptDate !== form.value.date) return false

            const d = new Date(a.date)
            const hour = d.getHours()
            const apptShift = hour < 12 ? "Morning" : "Afternoon"

            return apptShift === form.value.shift
        }).length

        const remainingSlots = DAILY_KPI - appointmentCount
        if (remainingSlots <= 0) continue

        matchedDoctors.push({
            ...doc,
            remainingSlots
        })
    }

    matchedDoctors.sort((a, b) => b.remainingSlots - a.remainingSlots)
    doctors.value = matchedDoctors

    if (!doctors.value.some(d => d.userId === form.value.doctorId)) {
        form.value.doctorId = ""
        doctorSearch.value = ""
    }
}

const submit = async () => {
    if (!form.value.patientId) return toast.error("Select patient")
    if (!form.value.departmentId) return toast.error("Select department")
    if (!form.value.date) return toast.error("Select date")
    if (!form.value.shift) return toast.error("Select shift")
    if (!form.value.doctorId) return toast.error("Select doctor")

    const now = new Date()

    // ===== check ngày quá khứ =====
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selectedDate = new Date(form.value.date)
    selectedDate.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
        toast.error("Cannot book past date")
        return
    }

    // ===== nếu là hôm nay thì check ca đã qua chưa =====
    const isToday = selectedDate.getTime() === today.getTime()

    if (isToday) {
        let shiftEnd = new Date(form.value.date)

        if (form.value.shift === "Morning") {
            shiftEnd.setHours(12, 0, 0, 0)
        } else if (form.value.shift === "Afternoon") {
            shiftEnd.setHours(17, 0, 0, 0)
        }

        if (now >= shiftEnd) {
            toast.error("Cannot book past shift")
            return
        }
    }

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

    const schRes = await getScheduleByDoctor(Number(form.value.doctorId))
    const schedules = schRes.data || []

    const hasValidShift = schedules.some(s => {
        const start = s.startTime.substring(0, 5)
        const shift =
            start === "08:00" ? "Morning" :
                start === "13:00" ? "Afternoon" : ""

        return s.dayOfWeek === dayName && shift === form.value.shift
    })

    if (!hasValidShift) {
        toast.error("Doctor not working this shift")
        return
    }

    const payload = {
        patientId: Number(form.value.patientId),
        doctorId: Number(form.value.doctorId),
        date: buildDate(form.value.date, form.value.shift),
        reason: form.value.reason || null
    }

    const isDuplicate = allAppointments.value.some(a => {
        if (a.status === "Cancelled") return false
        if (a.patientId !== Number(form.value.patientId)) return false
        if (a.doctorId !== Number(form.value.doctorId)) return false

        const d = new Date(a.date)
        const sameDate = d.toISOString().split("T")[0] === form.value.date
        if (!sameDate) return false

        const hour = d.getHours()
        const apptShift = hour < 12 ? "Morning" : "Afternoon"

        if (apptShift !== form.value.shift) return false

        return true
    })

    if (isDuplicate) {
        toast.error("This appointment already exists")
        return
    }

    try {
        await bookAppointment(payload)
        toast.success("Appointment created")
        router.push("/receptionist/appointments")
    } catch (err) {
        const msg =
            err.response?.data?.message ||
            err.response?.data ||
            "Create appointment failed"

        toast.error(msg)
    }
}

onMounted(async () => {

    patients.value = (await getAllPatients()).data
    departments.value = await getDepartments()
    allAppointments.value = (await getAllAppointments()).data

    const today = new Date()

    const iso = moment(today).format("YYYY-MM-DD")
    const display = moment(today).format("DD/MM/YYYY")

    form.value.date = iso
    $("#datePicker").val(display)

    $("#datePicker")
        .datetimepicker({
            format: "DD/MM/YYYY",
            minDate: today
        })
        .on("dp.change", async (e) => {

            form.value.date = e.date.format("YYYY-MM-DD")

            await loadDoctors()

        })

})

</script>
<template>
    <div class="main-wrapper">

        <NavbarReceptionist />
        <SidebarReceptionist />

        <div class="page-wrapper">
            <div class="content">

                <!-- HEADER -->
                <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                    <h4 class="fw-semibold mb-0">
                        Doctor Weekly Schedule
                        <span class="badge bg-primary-subtle text-primary ms-2">
                            {{ doctors.length }} doctors
                        </span>
                    </h4>
                </div>

                <!-- TABLE -->
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">

                        <thead class="table-light">
                            <tr>
                                <th style="width:220px">Doctor</th>
                                <th v-for="d in days" :key="d">{{ d }}</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr v-if="loading">
                                <td colspan="8" class="text-center py-4">
                                    Loading schedule...
                                </td>
                            </tr>

                            <tr v-for="doc in doctors" :key="doc.userId">

                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="avatar rounded-circle text-white fw-semibold me-2 d-flex align-items-center justify-content-center"
                                            :style="{ backgroundColor: getColor(doc.fullName), width: '40px', height: '40px' }">
                                            {{ getInitial(doc.fullName) }}
                                        </div>

                                        <div>
                                            <div class="fw-semibold">{{ doc.fullName }}</div>
                                            <small class="text-muted">{{ doc.departmentName }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td v-for="d in days" :key="d">

                                    <span v-if="getShift(doc.userId, d)" :class="['badge', getShiftClass(doc.userId, d)]">
                                        {{ getShift(doc.userId, d) }}
                                    </span>

                                    <span v-else class="text-muted">
                                        -
                                    </span>

                                </td>

                            </tr>

                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</template>
<script>

import NavbarReceptionist from "../../components/receptionist/NavbarReceptionist.vue"
import SidebarReceptionist from "../../components/receptionist/SidebarReceptionist.vue"

import { getAllDoctors } from "../../services/doctorService"
import { getDepartments } from "../../services/departmentService"
import { getScheduleByDoctor } from "../../services/scheduleService"

export default {

    components: {
        NavbarReceptionist,
        SidebarReceptionist
    },

    data() {
        return {

            loading: false,

            doctors: [],
            schedules: [],

            days: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ]

        }
    },

    async created() {
        await this.loadData()
    },

    methods: {

        async loadData() {

            this.loading = true

            const [docRes, deptRes] = await Promise.all([
                getAllDoctors(),
                getDepartments()
            ])

            const deptMap = {}
                ; (deptRes.data ?? deptRes).forEach(d => {
                    deptMap[d.departmentId] = d.name
                })

            this.doctors = (docRes.data ?? docRes)
                .filter(d => d.status === "Active")
                .map(d => ({
                    ...d,
                    departmentName: deptMap[d.departmentId] || "No Department"
                }))

            // load schedules
            for (let doc of this.doctors) {

                const res = await getScheduleByDoctor(doc.userId)

                    ; (res.data ?? res).forEach(s => {

                        this.schedules.push({
                            doctorId: doc.userId,
                            day: s.dayOfWeek,
                            shift: s.startTime.startsWith("08") ? "Morning" : "Afternoon"
                        })

                    })

            }

            this.loading = false
        },

        getShift(doctorId, day) {

            const s = this.schedules.find(
                x => x.doctorId === doctorId && x.day === day
            )

            return s?.shift || null
        },

        getInitial(name) {
            return name?.charAt(0).toUpperCase() || "?"
        },

        getColor(name) {

            const colors = [
                "#4e73df",
                "#1cc88a",
                "#36b9cc",
                "#f6c23e"
            ]

            let hash = 0
            for (let c of name)
                hash = c.charCodeAt(0) + ((hash << 5) - hash)

            return colors[Math.abs(hash) % colors.length]
        },
        getShiftClass(doctorId, day) {
            const shift = this.getShift(doctorId, day)

            if (shift === "Morning")
                return "badge bg-success-subtle text-success"

            if (shift === "Afternoon")
                return "badge bg-warning-subtle text-warning"

            return ""
        }

    }

}

</script>
<style scoped></style>
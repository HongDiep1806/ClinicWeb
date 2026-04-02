<template>

    <div class="main-wrapper">

        <NavbarPatient />
        <SidebarPatient />

        <div class="page-wrapper">
            <div class="content">

                <h4 class="fw-bold mb-3">My Medical Records</h4>

                <div class="card shadow-sm">

                    <div class="card-body p-0">

                        <table class="table table-hover mb-0">

                            <thead class="table-light">
                                <tr>
                                    <th>Appointment</th>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Diagnosis</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr v-if="loading">
                                    <td colspan="5" class="text-center">Loading...</td>
                                </tr>

                                <tr v-else-if="filteredRecords.length === 0">
                                    <td colspan="5" class="text-center">No records</td>
                                </tr>

                                <tr v-for="r in paginatedRecords" :key="r.medicalRecordId">
                                    <td>#AP{{ r.appointment?.appointmentId }}</td>

                                    <td>{{ r.appointment?.doctorName }}</td>

                                    <td>{{ formatDate(r.appointment?.date) }}</td>
                                    <td>{{ r.diagnosisDescription }}</td>

                                    <td>
                                        <button class="btn btn-sm btn-primary"
                                            @click="viewRecord(r.appointment?.appointmentId)">
                                            View
                                        </button>
                                    </td>

                                </tr>

                            </tbody>

                        </table>
                        <div class="d-flex justify-content-between align-items-center p-3">

                            <span class="text-muted small">
                                Page {{ currentPage }} / {{ totalPages }}
                            </span>

                            <div class="btn-group"  v-if="totalPages > 1">
                                <button class="btn btn-sm btn-outline-secondary" :disabled="currentPage === 1"
                                    @click="currentPage--">
                                    Prev
                                </button>

                                <button class="btn btn-sm btn-outline-secondary" :disabled="currentPage === totalPages"
                                    @click="currentPage++">
                                    Next
                                </button>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>

    </div>

</template>
<script setup>

import { ref, onMounted, computed, watch } from "vue"
import { useRouter } from "vue-router"

import NavbarPatient from "../../components/patients/NavbarPatient.vue"
import SidebarPatient from "../../components/patients/SidebarPatient.vue"

import { getPatientMedicalRecords } from "../../services/medicalRecordService"
import { useAuthStore } from "../../stores/auth"

const router = useRouter()
const authStore = useAuthStore()

const records = ref([])
const loading = ref(false)
const search = ref("")
const formatDate = (date) => {
    if (!date) return ""

    const d = new Date(date)
    if (isNaN(d)) return ""

    return d.toLocaleDateString("vi-VN")
}

const loadRecords = async () => {

    try {
        loading.value = true

        const res = await getPatientMedicalRecords()

        records.value = (res.data || []).sort((a, b) => {
            const dateA = new Date(a.appointment?.date || 0)
            const dateB = new Date(b.appointment?.date || 0)
            return dateB - dateA // mới → cũ
        })

    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }

}

const filteredRecords = computed(() => {

    const keyword = (search.value || "").toLowerCase()

    return records.value.filter(r => {

        const doctor = (r.appointment?.doctorName || "").toLowerCase()

        return !keyword || doctor.includes(keyword)

    })

})

const currentPage = ref(1)
const pageSize = ref(5)

const paginatedRecords = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredRecords.value.slice(start, start + pageSize.value)
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredRecords.value.length / pageSize.value))
)

const viewRecord = (appointmentId) => {
    router.push(`/patient/prescriptions/${appointmentId}`)
}

onMounted(loadRecords)
watch(totalPages, (newTotal) => {
    if (currentPage.value > newTotal) {
        currentPage.value = newTotal
    }
})
</script>
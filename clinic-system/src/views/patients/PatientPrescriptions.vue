<template>
    <div class="main-wrapper">
        <NavbarPatient />
        <SidebarPatient />

        ```
        <div class="page-wrapper">
            <div class="content">

                <!-- HEADER -->
                <div class="d-flex align-items-center justify-content-between mb-4 no-print">
                    <div>
                        <h4 class="fw-bold mb-0">Medical Record</h4>
                        <p class="text-muted mb-0">Electronic prescription details</p>
                    </div>

                    <div>
                        <!-- <button class="btn btn-warning me-2" @click="goToEdit">
                            <i class="ti ti-edit me-1"></i> Edit
                        </button> -->
                        <button class="btn btn-primary me-2" @click="printPrescription">
                            <i class="ti ti-printer me-1"></i> Print
                        </button>
                        <button class="btn btn-light" @click="router.back()">
                            <i class="ti ti-arrow-left me-1"></i> Back
                        </button>
                    </div>
                </div>

                <!-- HEADER PRESCRIPTION -->
                <div class="card shadow-sm mb-4">
                    <div class="card-body d-flex justify-content-between align-items-center">

                        <div class="d-flex align-items-center">
                            <img src="/img/logo.svg" class="clinic-logo me-3" />
                            <div>
                                <div class="fw-bold">Clinic Management</div>
                                <div class="text-muted small">123 Nguyen Trai, HCM</div>
                                <div class="text-muted small">Phone: 0123 456 789</div>
                            </div>
                        </div>

                        <div class="text-end">
                            <div class="fw-bold fs-5">Electronic Prescription</div>
                            <div class="small text-muted">#MR{{ route.params.appointmentId }}</div>
                            <div class="small mt-2">
                                <div><strong>Date:</strong> {{ formatDate(medicalRecord?.appointment?.date) }}</div>
                                <div><strong>Doctor:</strong> {{ doctorName }}</div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- PATIENT INFO -->
                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <div class="row">

                            <div class="col-md-6">
                                <div><strong>Patient:</strong> {{ medicalRecord?.appointment?.patient?.fullName || "N/A"
                                }}</div>
                                <div><strong>Patient ID:</strong> #PT{{ medicalRecord?.appointment?.patient?.userId }}
                                </div>
                            </div>

                            <div class="col-md-6 text-end">
                                <div><strong>Appointment:</strong> #AP{{ medicalRecord?.appointmentId }}</div>
                                <div><strong>Date:</strong> {{ formatDate(medicalRecord?.appointment?.date) }}</div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- DIAGNOSIS -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header">
                        <h6 class="fw-bold mb-0">Diagnosis</h6>
                    </div>
                    <div class="card-body">
                        <div class="diagnosis-cell">
                            {{ medicalRecord?.diagnosisDescription }}
                        </div>
                    </div>
                </div>

                <!-- TREATMENT -->
                <!-- <div class="card shadow-sm mb-4">
      <div class="card-header"><h6 class="fw-bold mb-0">Treatment</h6></div>
      <div class="card-body text-muted small">
        {{ medicalRecord?.treatment || "No treatment provided" }}
      </div>
    </div> -->

                <!-- NOTE -->
                <!-- <div class="card shadow-sm mb-4">
                    <div class="card-header">
                        <h6 class="fw-bold mb-0">Doctor Notes</h6>
                    </div>
                    <div class="card-body text-muted small">
                        {{ medicalRecord?.note || "No notes" }}
                    </div>
                </div> -->

                <!-- TABLE -->
                <div class="card shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0">Prescription List</h6>
                        <span class="text-muted small">{{ prescriptions.length }} medicines</span>
                    </div>

                    <div class="card-body p-0">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Medicine</th>
                                    <th>Dosage</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-if="loading">
                                    <td colspan="4" class="text-center py-3">Loading...</td>
                                </tr>

                                <tr v-else-if="prescriptions.length === 0">
                                    <td colspan="4" class="text-center py-3">No data</td>
                                </tr>

                                <tr v-for="(p, i) in prescriptions" :key="p.prescriptionId">
                                    <td>{{ i + 1 }}</td>
                                    <td>
                                        <span class="badge bg-light text-dark me-1">
                                            {{ p.medicine?.name }}
                                        </span>

                                        <div class="text-muted small">
                                            Unit: {{ p.medicine?.unit }}
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge bg-success-subtle text-success fw-semibold">
                                            {{ p.dosage }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="fw-semibold text-primary">
                                            {{ p.quantity }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- FOOT -->
                        <div class="p-4 border-top">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="small text-muted mb-1">Instructions</div>
                                    <div class="small">
                                        Take medicines as prescribed. Do not skip doses.
                                    </div>
                                </div>

                                <div class="col-md-6 text-end">
                                    <div class="fw-semibold">Doctor Signature</div>
                                    <div style="height:50px"></div>
                                    <div class="border-top pt-2 small">{{ doctorName }}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
        ```

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"

// import NavbarDoctor from "../../components/doctors/NavbarDoctor.vue"
// import SidebarDoctor from "../../components/doctors/SidebarDoctor.vue"
import NavbarPatient from "../../components/patients/NavbarPatient.vue"
import SidebarPatient from "../../components/patients/SidebarPatient.vue"

import { getMedicalRecordByAppointment, getPrescriptionsByAppointment } from "../../services/medicalRecordService"
import { useAuthStore } from "../../stores/auth"

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const prescriptions = ref([])
const loading = ref(false)
const medicalRecord = ref(null)

const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}

const doctorName = computed(() => {
    return medicalRecord.value?.appointment?.doctor?.fullName
        ? `Dr. ${medicalRecord.value.appointment.doctor.fullName}`
        : "Doctor"
})

const loadMedicalRecord = async () => {
    const res = await getMedicalRecordByAppointment(route.params.appointmentId)
    medicalRecord.value = res.data
}

const loadPrescriptions = async () => {
    loading.value = true
    const res = await getPrescriptionsByAppointment(route.params.appointmentId)
    prescriptions.value = res.data || []
    loading.value = false
}

const printPrescription = () => window.print()

const goToEdit = async () => {
    const res = await getMedicalRecordByAppointment(route.params.appointmentId)
    router.push(`/doctor/edit-record/${res.data.medicalRecordId}`)
}

onMounted(() => {
    loadMedicalRecord()
    loadPrescriptions()
})
</script>

<style scoped>
.clinic-logo {
    width: 60px;
}

.diagnosis-cell {
    max-width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.badge {
    font-size: 12px;
    padding: 6px 10px;
}

.card {
    border-radius: 12px;
}

table td {
    vertical-align: middle;
}

table tbody tr:hover {
    background: #f8f9fa;
}

@media print {

    .no-print,
    .sidebar,
    .navbar,
    .footer,
    .btn {
        display: none !important;
    }

    table,
    th,
    td {
        border: 1px solid #000 !important;
    }
}
</style>

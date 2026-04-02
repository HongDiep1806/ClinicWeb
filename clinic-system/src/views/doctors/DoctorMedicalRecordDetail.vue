<template>

  <div class="main-wrapper">

    <NavbarDoctor />
    <SidebarDoctor />

    <div class="page-wrapper">

      <div class="content">

        <!-- HEADER -->

        <div class="d-flex align-items-center justify-content-between mb-4 no-print">

          <div>
            <h4 class="fw-bold mb-0">Medical Record</h4>
            <p class="text-muted mb-0">
              Electronic prescription details
            </p>
          </div>

          <div>

            <button class="btn btn-warning me-2" @click="goToEdit">
              <i class="ti ti-edit me-1"></i>
              Edit
            </button>
            <button class="btn btn-primary me-2" @click="printPrescription">
              <i class="ti ti-printer me-1"></i>
              Print
            </button>

            <button class="btn btn-light" @click="router.back()">
              <i class="ti ti-arrow-left me-1"></i>
              Back
            </button>

          </div>

        </div>

        <div class="card shadow-sm mb-4 prescription-header">

          <div class="card-body">

            <div class="d-flex justify-content-between align-items-center">

              <!-- LEFT: LOGO + CLINIC -->
              <div class="d-flex align-items-center">

                <img src="/img/logo.svg" class="clinic-logo me-3" />

                <div>
                  <!-- <div class="fw-bold fs-5">Preclinic</div> -->
                  <div class="text-muted small">123 Nguyen Trai, Ho Chi Minh City</div>
                  <div class="text-muted small">Phone: 0123 456 789</div>
                </div>

              </div>

              <!-- RIGHT: PRESCRIPTION INFO -->
              <div class="text-end">

                <div class="fw-bold fs-5">
                  Electronic Prescription
                </div>

                <div class="text-muted small">
                  Record #MR{{ route.params.appointmentId }}
                </div>

                <div class="small mt-2">
                  <div><strong>Date:</strong> {{ today }}</div>
                  <div><strong>Doctor:</strong> {{ doctorName }}</div>
                </div>

              </div>

            </div>

          </div>

        </div>
        <!-- PRESCRIPTION HEADER -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">

            <div class="row">

              <div class="col-md-6">
                <div><strong>Patient:</strong> {{ medicalRecord?.appointment?.patient?.fullName || "N/A" }}</div>
                <div><strong>Patient ID:</strong> #PT{{ medicalRecord?.appointment?.patient?.userId }}</div>
              </div>

              <div class="col-md-6 text-end">
                <div><strong>Appointment:</strong> #AP{{ medicalRecord?.appointmentId }}</div>
                <div><strong>Date:</strong> {{ formatDate(medicalRecord?.appointment?.date) }}</div>
              </div>

            </div>

          </div>
        </div>

        <!-- <div class="card shadow-sm mb-4">

          <div class="card-body">

            <div class="d-flex justify-content-between align-items-start flex-wrap">

              <div>
                <h5 class="fw-bold mb-1">Electronic Prescription</h5>

                <div class="text-muted small">
                  Record #MR{{ route.params.appointmentId }}
                </div>
              </div>

              <div class="text-end small">

                <div>
                  <strong>Date:</strong> {{ today }}
                </div>

                <div>
                  <strong>Doctor:</strong> {{ doctorName }}
                </div>

              </div>

            </div>

          </div>

        </div> -->

        <div class="card shadow-sm mb-4">
          <div class="card-header">
            <h6 class="fw-bold mb-0">Diagnosis</h6>
          </div>

          <div class="card-body">
            <div class="text-muted small">
              {{ medicalRecord?.diagnosisDescription || "No diagnosis provided" }}
            </div>
          </div>
        </div>
        <!-- PRESCRIPTION TABLE -->

        <div class="card shadow-sm">

          <div class="card-header d-flex justify-content-between align-items-center">

            <h6 class="fw-bold mb-0">
              Prescription List
            </h6>

            <span class="text-muted small">
              {{ prescriptions.length }} medicines
            </span>

          </div>

          <div class="card-body p-0">

            <div class="table-responsive">

              <table class="table table-bordered table-hover mb-0">

                <thead class="table-light">

                  <tr>
                    <th style="width:50%">Medicine</th>
                    <th style="width:25%">Dosage</th>
                    <th style="width:25%">Quantity</th>
                  </tr>

                </thead>

                <tbody>

                  <tr v-if="loading">

                    <td colspan="3" class="text-center py-4 text-muted">
                      Loading...
                    </td>

                  </tr>

                  <tr v-else-if="prescriptions.length === 0">

                    <td colspan="3" class="text-center py-4 text-muted">
                      No prescriptions found
                    </td>

                  </tr>

                  <tr v-else v-for="(p, index) in prescriptions" :key="p.prescriptionId">


                    <td>
                      <div class="fw-semibold">
                        {{ p.medicine?.name }}
                      </div>
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

                      <span class="fw-semibold">
                        {{ p.quantity }}
                      </span>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            <!-- INSTRUCTION + SIGNATURE -->

            <div class="p-4 border-top">

              <div class="row">

                <div class="col-md-6">

                  <div class="text-muted small mb-1">
                    Instructions
                  </div>

                  <div class="small">
                    Take medicines according to doctor's instructions.
                    Follow dosage strictly and complete the full course.
                  </div>

                </div>

                <div class="col-md-6 text-end">

                  <div class="fw-semibold">
                    Doctor Signature
                  </div>

                  <div class="mt-4 border-top pt-2 small">
                    {{ doctorName }}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div class="footer text-center bg-white p-2 border-top mt-4">
        <p class="mb-0 text-muted">
          2025 © Clinic Management System
        </p>
      </div>

    </div>

  </div>

</template>

<script setup>

import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"

import NavbarDoctor from "../../components/doctors/NavbarDoctor.vue"
import SidebarDoctor from "../../components/doctors/SidebarDoctor.vue"

import { getMedicalRecordByAppointment } from "../../services/medicalRecordService"
import { getPrescriptionsByAppointment } from "../../services/medicalRecordService"
import { useAuthStore } from "../../stores/auth"

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()


const prescriptions = ref([])
const loading = ref(false)
const medicalRecord = ref(null)
const loadMedicalRecord = async () => {

  try {
    const appointmentId = route.params.appointmentId
    const res = await getMedicalRecordByAppointment(appointmentId)

    medicalRecord.value = res.data
  }
  catch (err) {
    console.error("Load medical record error", err)
  }

}

const today = new Date().toLocaleDateString("en-GB")
const printPrescription = () => {
  window.print()
}
const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}

/* fake doctor name (có thể lấy từ authStore nếu có) */

const doctorName = computed(() => {
  return authStore.user?.fullName
    ? `Dr. ${authStore.user.fullName}`
    : "Doctor"
})
const loadPrescriptions = async () => {

  try {

    loading.value = true

    const appointmentId = route.params.appointmentId

    const res = await getPrescriptionsByAppointment(appointmentId)

    prescriptions.value = res.data || []

  }
  catch (err) {

    console.error("Load prescriptions error", err)

  }
  finally {

    loading.value = false

  }

}

const goToEdit = async () => {

  try {

    const appointmentId = route.params.appointmentId

    const res = await getMedicalRecordByAppointment(appointmentId)

    const recordId = res.data.medicalRecordId

    router.push(`/doctor/edit-record/${recordId}`)

  }
  catch (err) {

    console.error("Get record error", err)

  }

}

onMounted(() => {
  loadPrescriptions()
  loadMedicalRecord()
})
</script>

<style scoped>
@media print {

  .no-print {
    display: none !important;
  }

}

.clinic-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

@media print {

  .sidebar,
  .navbar,
  .footer,
  .btn {
    display: none !important;
  }

  .page-wrapper {
    margin: 0;
    padding: 0;
  }

  .card {
    box-shadow: none;
    border: none;
  }

}

table td {
  vertical-align: middle;
}

.card {
  border-radius: 12px;
}

.badge {
  font-size: 12px;
  padding: 6px 10px;
}
</style>
<template>

  <div class="main-wrapper">

    <NavbarDoctor />
    <SidebarDoctor />

    <div class="page-wrapper">

      <div class="content">

        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">

          <div>
            <h4 class="fw-bold mb-0">Prescriptions</h4>
            <p class="text-muted mb-0">
              Medical record prescriptions
            </p>
          </div>

          <button class="btn btn-light" @click="router.back()">
            <i class="ti ti-arrow-left me-1"></i>
            Back
          </button>

        </div>

        <!-- Table -->
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

              <table class="table table-hover mb-0">

                <thead class="table-light">

                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Quantity</th>
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

                  <tr v-else v-for="p in prescriptions" :key="p.prescriptionId">

                    <td>
                      {{ p.medicine?.name || "Medicine" }}
                    </td>

                    <td>
                      {{ p.dosage }}
                    </td>

                    <td>
                      {{ p.quantity }}
                    </td>

                  </tr>

                </tbody>

              </table>

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

import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

import NavbarDoctor from "../../components/doctors/NavbarDoctor.vue"
import SidebarDoctor from "../../components/doctors/SidebarDoctor.vue"

import { getMedicalRecordByAppointment } from "../../services/medicalRecordService"
import { getPrescriptionsByRecord } from "../../services/prescriptionService"
import { getPrescriptionsByAppointment } from "../../services/medicalRecordService"

const route = useRoute()
const router = useRouter()

const prescriptions = ref([])
const loading = ref(false)

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

onMounted(loadPrescriptions)

</script>

<style scoped>
table td {
  vertical-align: middle;
}
</style>
<template>

    <div class="main-wrapper">

        <NavbarDoctor />
        <SidebarDoctor />

        <div class="page-wrapper">

            <div class="content">

                <!-- HEADER -->

                <div class="mb-4">
                    <h4 class="fw-bold">Patient Examination</h4>
                    <p class="text-muted mb-0">
                        Complete patient consultation
                    </p>
                </div>

                <div class="row">

                    <!-- PATIENT INFO -->

                    <div class="col-lg-4">

                        <div class="card shadow-sm">

                            <div class="card-header">
                                <h6 class="fw-bold mb-0">Patient Information</h6>
                            </div>

                            <div v-if="appointment" class="card-body">

                                <div class="d-flex align-items-center mb-3">

                                    <div class="avatar bg-primary-subtle text-primary me-2">
                                        <i class="ti ti-user"></i>
                                    </div>

                                    <div>

                                        <div class="fw-semibold">
                                            {{ appointment.patientName }}
                                        </div>

                                        <div class="text-muted small">
                                            {{ appointment.patientPhone }}
                                        </div>

                                    </div>

                                </div>

                                <hr>

                                <p class="text-muted small mb-1">Appointment Time</p>

                                <div class="fw-semibold mb-3">
                                    {{ formatDate(appointment.date) }} {{ formatTime(appointment.date) }}
                                </div>

                                <p class="text-muted small mb-1">Reason</p>

                                <div class="bg-light p-2 rounded small">
                                    {{ appointment.reason || "No reason provided" }}
                                </div>

                            </div>

                        </div>

                    </div>


                    <!-- EXAMINATION -->

                    <div class="col-lg-8">

                        <div class="card shadow-sm">

                            <div class="card-header">
                                <h6 class="fw-bold mb-0">Medical Examination</h6>
                            </div>

                            <div class="card-body">

                                <!-- DIAGNOSIS -->

                                <div class="mb-3">

                                    <label class="form-label fw-semibold">
                                        Diagnosis
                                    </label>

                                    <textarea v-model="diagnosis" class="form-control" rows="3"
                                        placeholder="Enter diagnosis">
</textarea>

                                </div>


                                <!-- MEDICINE -->

                                <div class="row g-2 mb-3">

                                    <div class="col-md-4">

                                        <select v-model="selectedMedicine" class="form-select">

                                            <option value="">Select Medicine</option>

                                            <option v-for="m in medicinesList" :key="m.medicineId"
                                                :value="m.medicineId">

                                                {{ m.name }}

                                            </option>

                                        </select>

                                    </div>

                                    <div class="col-md-4">

                                        <input v-model="dosage" class="form-control" placeholder="Dosage" />

                                    </div>

                                    <div class="col-md-2">

                                        <input type="number" v-model="quantity" class="form-control" />

                                    </div>

                                    <div class="col-md-2">

                                        <button class="btn btn-primary w-100" @click="addMedicine">
                                            Add
                                        </button>

                                    </div>

                                </div>


                                <!-- PRESCRIPTION TABLE -->

                                <table v-if="medicines.length" class="table table-sm">

                                    <thead>

                                        <tr>
                                            <th>Medicine</th>
                                            <th>Dosage</th>
                                            <th>Qty</th>
                                            <th></th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        <tr v-for="(m, i) in medicines" :key="i">

                                            <td>
                                                {{ getMedicineName(m.medicineId) }}
                                            </td>

                                            <td>
                                                {{ m.dosage }}
                                            </td>

                                            <td>
                                                {{ m.quantity }}
                                            </td>

                                            <td>

                                                <button class="btn btn-sm btn-danger" @click="removeMedicine(i)">
                                                    Remove
                                                </button>

                                            </td>

                                        </tr>

                                    </tbody>

                                </table>


                                <!-- COMPLETE -->

                                <button class="btn btn-success mt-3" @click="completeExamination" :disabled="loading">
                                    {{ loading ? "Processing..." : "Complete Appointment" }}
                                </button>

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
    <!-- start toast -->
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999">
        <div id="liveToast" class="toast align-items-center text-bg-success border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    {{ toastMessage }}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast">
                </button>
            </div>
        </div>
    </div>
    <!-- end toast -->

</template>


<script setup>

import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

import NavbarDoctor from "../../components/doctors/NavbarDoctor.vue"
import SidebarDoctor from "../../components/doctors/SidebarDoctor.vue"

import { getAppointmentDetail, updateAppointmentStatus } from "../../services/appointmentService"
import { createMedicalRecord } from "../../services/medicalRecordService"
import { createPrescription } from "../../services/prescriptionService"
import { getAllMedicines } from "../../services/medicineService"

const route = useRoute()
const router = useRouter()

const appointment = ref(null)

const diagnosis = ref("")
const notes = ref("")

const medicinesList = ref([])

const selectedMedicine = ref(null)
const dosage = ref("")
const quantity = ref(1)

const medicines = ref([])

const loading = ref(false)
const toastMessage = ref("")
const showToast = (message, type = "success") => {

    toastMessage.value = message

    const toastEl = document.getElementById("liveToast")

    toastEl.classList.remove(
        "text-bg-success",
        "text-bg-danger",
        "text-bg-warning"
    )

    toastEl.classList.add(`text-bg-${type}`)

    const toast = new bootstrap.Toast(toastEl)
    toast.show()
}

const loadAppointment = async () => {
    try {
        const id = route.params.id
        const res = await getAppointmentDetail(id)
        appointment.value = res.data
    } catch (err) {
        console.error("Load appointment error", err)
    }
}

const loadMedicines = async () => {
    try {
        const res = await getAllMedicines()
        medicinesList.value = res.data
    } catch (err) {
        console.error("Load medicines error", err)
    }
}

const addMedicine = () => {

    if (!selectedMedicine.value) {
        alert("Please select medicine")
        return
    }

    if (!dosage.value) {
        alert("Please enter dosage")
        return
    }

    medicines.value.push({
        medicineId: selectedMedicine.value,
        dosage: dosage.value,
        quantity: quantity.value
    })

    selectedMedicine.value = null
    dosage.value = ""
    quantity.value = 1
}

const removeMedicine = (index) => {
    medicines.value.splice(index, 1)
}

const getMedicineName = (id) => {
    const m = medicinesList.value.find(x => x.medicineId === id)
    return m ? m.name : ""
}

const completeExamination = async () => {

    if (!diagnosis.value) {
        showToast("Diagnosis is required", "warning")
        return
    }

    if (medicines.value.length === 0) {
        showToast("Please add at least one medicine", "warning")
        return
    }

    try {

        loading.value = true

        const recordRes = await createMedicalRecord({
            AppointmentId: appointment.value.appointmentId,
            DiagnosisDescription: diagnosis.value,
            Treatment: "",
            Note: notes.value || ""
        })
        console.log("MedicalRecord Response:", recordRes.data)

        const recordId =
            recordRes.data.recordId ||
            recordRes.data.id ||
            recordRes.data.medicalRecordId

        for (const m of medicines.value) {

            await createPrescription({
                RecordId: recordId,
                MedicineId: m.medicineId,
                Dosage: m.dosage,
                Quantity: m.quantity
            })

        }
        await updateAppointmentStatus({
            appointmentId: appointment.value.appointmentId,
            status: "Completed"
        })

        showToast("Examination completed successfully", "success")

        router.push("/doctor/appointments")

    } catch (err) {

        console.error("Complete examination error", err)

        showToast("Failed to complete examination", "danger")

    } finally {
        loading.value = false
    }
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    })
}

onMounted(() => {
    loadAppointment()
    loadMedicines()
})

</script>


<style scoped>
.avatar {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}
</style>
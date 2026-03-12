<template>

    <div class="main-wrapper">

        <NavbarDoctor />
        <SidebarDoctor />

        <div class="page-wrapper">

            <div class="content">

                <div class="mb-4">
                    <h4 class="fw-bold">
                        {{ isEditMode ? "Edit Medical Record" : "Patient Examination" }}
                    </h4>

                    <p class="text-muted mb-0">
                        {{ isEditMode ? "Update patient medical record" : "Complete patient consultation" }}
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
                                        placeholder="Enter diagnosis"></textarea>

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
                                            <th>Action</th>
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

                                                <button class="btn btn-sm btn-warning me-1" @click="editMedicine(i)">
                                                    Edit
                                                </button>

                                                <button class="btn btn-sm btn-danger" @click="removeMedicine(i)">
                                                    Remove
                                                </button>

                                            </td>

                                        </tr>

                                    </tbody>

                                </table>

                                <!-- SUBMIT -->

                                <button class="btn btn-success mt-3" @click="submitRecord" :disabled="loading">

                                    {{ loading
                                        ? "Processing..."
                                        : isEditMode
                                            ? "Update Medical Record"
                                            : "Complete Appointment"
                                    }}

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
    <div class="position-fixed top-0 end-0 p-3" style="z-index:9999">
        <div id="appToast" class="toast align-items-center text-bg-success border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body" id="toastMessage">
                    Success
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    </div>

</template>
<script setup>

import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

import NavbarDoctor from "../../components/doctors/NavbarDoctor.vue"
import SidebarDoctor from "../../components/doctors/SidebarDoctor.vue"

import {
    getAppointmentDetail,
    updateAppointmentStatus
} from "../../services/appointmentService"

import {
    createMedicalRecord,
    getMedicalRecordById,
    updateMedicalRecord
} from "../../services/medicalRecordService"

import {
    createPrescription,
    deletePrescription
} from "../../services/prescriptionService"

import { getAllMedicines } from "../../services/medicineService"
const showToast = (message, type = "success") => {

    const toastEl = document.getElementById("appToast")
    const toastBody = document.getElementById("toastMessage")

    toastBody.innerText = message

    toastEl.classList.remove(
        "text-bg-success",
        "text-bg-danger",
        "text-bg-warning"
    )

    toastEl.classList.add(`text-bg-${type}`)

    const toast = new bootstrap.Toast(toastEl)
    toast.show()

}

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
const removedPrescriptions = ref([])
const editingPrescriptionId = ref(null)

const recordId = ref(null)
const isEditMode = ref(false)

const loading = ref(false)

const loadAppointment = async () => {

    try {

        const id = route.params.id
        if (!id) return

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

const loadMedicalRecord = async () => {

    try {

        const res = await getMedicalRecordById(recordId.value)

        const record = res.data

        diagnosis.value = record.diagnosisDescription
        notes.value = record.note

        appointment.value = record.appointment

        medicines.value = record.prescriptions.map(p => ({
            prescriptionId: p.prescriptionId,
            medicineId: p.medicineId,
            dosage: p.dosage,
            quantity: p.quantity
        }))

    } catch (err) {

        console.error("Load record error", err)

    }

}

const addMedicine = () => {

    if (!selectedMedicine.value) {
        showToast("Please select medicine", "warning")
        return
    }

    if (!dosage.value) {
        showToast("Please enter dosage", "warning")
        return
    }

    if (!editingPrescriptionId.value) {

        const exists = medicines.value.some(
            m => m.medicineId === selectedMedicine.value
        )

        if (exists) {
            showToast("Medicine already added", "warning")
            return
        }

    }

    if (editingPrescriptionId.value) {
        removedPrescriptions.value.push(editingPrescriptionId.value)
    }

    medicines.value.push({
        prescriptionId: null,
        medicineId: selectedMedicine.value,
        dosage: dosage.value,
        quantity: quantity.value
    })

    editingPrescriptionId.value = null
    selectedMedicine.value = null
    dosage.value = ""
    quantity.value = 1

}

const editMedicine = (index) => {

    const m = medicines.value[index]

    editingPrescriptionId.value = m.prescriptionId || null

    selectedMedicine.value = m.medicineId
    dosage.value = m.dosage
    quantity.value = m.quantity

    medicines.value.splice(index, 1)

}
const removeMedicine = (index) => {

    const m = medicines.value[index]

    if (m.prescriptionId) {
        removedPrescriptions.value.push(m.prescriptionId)
    }

    medicines.value.splice(index, 1)

}

const getMedicineName = (id) => {

    const m = medicinesList.value.find(x => x.medicineId === id)

    return m ? m.name : ""

}

const submitRecord = async () => {
    if (!diagnosis.value.trim()) {
        showToast("Please enter diagnosis", "warning")
        return
    }

    if (medicines.value.length === 0) {
        showToast("Please add at least one medicine", "warning")
        return
    }

    try {

        loading.value = true

        let currentRecordId = recordId.value

        /* UPDATE MODE */

        if (isEditMode.value) {

            await updateMedicalRecord(currentRecordId, {

                DiagnosisDescription: diagnosis.value,
                Treatment: "",
                Note: notes.value || ""

            })

        }

        /* CREATE MODE */

        else {

            const recordRes = await createMedicalRecord({

                AppointmentId: appointment.value.appointmentId,
                DiagnosisDescription: diagnosis.value,
                Treatment: "",
                Note: notes.value || ""

            })

            currentRecordId =
                recordRes.data.recordId ||
                recordRes.data.id ||
                recordRes.data.medicalRecordId

        }

        /* DELETE REMOVED PRESCRIPTIONS */

        for (const id of removedPrescriptions.value) {

            await deletePrescription(id)

        }

        /* SAVE PRESCRIPTIONS */

        for (const m of medicines.value) {

            if (!m.prescriptionId) {

                await createPrescription({

                    RecordId: currentRecordId,
                    MedicineId: m.medicineId,
                    Dosage: m.dosage,
                    Quantity: m.quantity

                })

            }

        }

        /* COMPLETE APPOINTMENT */

        if (!isEditMode.value) {

            await updateAppointmentStatus({

                appointmentId: appointment.value.appointmentId,
                status: "Completed"

            })

        }

        showToast("Medical record saved successfully", "success")

        setTimeout(() => {
            router.back()
        }, 1000)

    } catch (err) {

        console.error("Save record error", err)
        showToast("Failed to save medical record", "danger")

    } finally {

        loading.value = false
        removedPrescriptions.value = []

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

onMounted(async () => {

    if (route.params.recordId) {

        isEditMode.value = true
        recordId.value = route.params.recordId

        await loadMedicalRecord()

    } else {

        await loadAppointment()

    }

    await loadMedicines()

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
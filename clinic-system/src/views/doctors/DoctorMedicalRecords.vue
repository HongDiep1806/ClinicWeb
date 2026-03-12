<template>

<div class="main-wrapper">

<NavbarDoctor />
<SidebarDoctor />

<div class="page-wrapper">

<div class="content">

<!-- HEADER -->

<div class="d-flex justify-content-between align-items-center mb-4">

<div>
<h4 class="fw-bold mb-0">Medical Records</h4>
<p class="text-muted mb-0">
All examination records of your patients
</p>
</div>

</div>

<!-- FILTER -->

<div class="card shadow-sm mb-3">

<div class="card-body">

<div class="row g-2">

<div class="col-md-4">

<input
v-model="search"
type="text"
class="form-control"
placeholder="Search patient..."
>

</div>

<div class="col-md-2">

<button class="btn btn-primary w-100" @click="clearFilter">
Reset
</button>

</div>

</div>

</div>

</div>

<!-- TABLE -->

<div class="card shadow-sm">

<div class="card-header d-flex justify-content-between align-items-center">

<h6 class="fw-bold mb-0">
Medical Record List
</h6>

<span class="text-muted small">
{{ filteredRecords.length }} records
</span>

</div>

<div class="card-body p-0">

<div class="table-responsive">

<table class="table table-hover mb-0">

<thead class="table-light">

<tr>

<th>Appointment</th>
<th>Patient</th>
<th>Date</th>
<th>Diagnosis</th>
<th>Medicines</th>
<th>Action</th>

</tr>

</thead>

<tbody>

<tr v-if="loading">

<td colspan="6" class="text-center py-4 text-muted">
Loading...
</td>

</tr>

<tr v-else-if="filteredRecords.length === 0">

<td colspan="6" class="text-center py-4 text-muted">
No medical records found
</td>

</tr>

<tr v-else v-for="r in filteredRecords" :key="r.medicalRecordId">

<!-- APPOINTMENT ID -->

<td>

<span class="badge badge-soft-primary border border-primary fw-medium">

#AP{{ r.appointment?.appointmentId }}

</span>

</td>

<!-- PATIENT -->

<td>

<div class="d-flex align-items-center">

<div class="avatar bg-primary-subtle text-primary me-2">
<i class="ti ti-user"></i>
</div>

<div>

<div class="fw-semibold">
{{ r.appointment?.patient?.fullName || "Patient" }}
</div>

</div>

</div>

</td>

<!-- DATE -->

<td>
{{ formatDate(r.appointment?.date) }}
</td>

<!-- DIAGNOSIS -->

<td class="diagnosis-cell">
{{ r.diagnosisDescription }}
</td>

<!-- MEDICINES -->

<td>

<span
v-for="p in r.prescriptions.slice(0,2)"
:key="p.prescriptionId"
class="badge bg-light text-dark me-1"
>

{{ p.medicine?.name }}

</span>

<span
v-if="r.prescriptions.length > 2"
class="text-muted small"
>

+{{ r.prescriptions.length - 2 }} more

</span>

</td>

<!-- ACTION -->

<td>

<button
class="btn btn-sm btn-primary"
@click="viewRecord(r.appointment?.appointmentId)"
>

<i class="ti ti-eye me-1"></i>
View

</button>

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

import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"

import NavbarDoctor from "../../components/doctors/NavbarDoctor.vue"
import SidebarDoctor from "../../components/doctors/SidebarDoctor.vue"

import { getDoctorMedicalRecords } from "../../services/medicalRecordService"

const router = useRouter()

const records = ref([])
const loading = ref(false)
const search = ref("")

const loadRecords = async () => {

try{

loading.value = true

const res = await getDoctorMedicalRecords()
console.log("Medical Records Data:", res.data)


records.value = (res.data || []).sort(
(a,b)=> new Date(b.appointment?.date) - new Date(a.appointment?.date)
)

}catch(err){

console.error("Load medical records error",err)

}finally{

loading.value = false

}

}

const filteredRecords = computed(()=>{

const keyword = (search.value || "").toLowerCase()

return records.value.filter(r=>{

const patient = (r.appointment?.patient?.fullName || "").toLowerCase()

return !keyword || patient.includes(keyword)

})

})

const clearFilter = ()=>{

search.value = ""

}

const viewRecord = (appointmentId)=>{

router.push(`/doctor/medical-records/${appointmentId}`)
}

const formatDate = (date)=>{

if(!date) return ""

return new Date(date).toLocaleDateString("en-GB",{
day:"2-digit",
month:"short",
year:"numeric"
})

}

onMounted(loadRecords)

</script>

<style scoped>

.avatar{
width:40px;
height:40px;
display:flex;
align-items:center;
justify-content:center;
border-radius:50%;
}

table td{
vertical-align:middle;
}

.badge{
font-size:12px;
}

.badge-soft-primary{
background:rgba(13,110,253,.1);
color:#0d6efd;
}

table tbody tr:hover{
background:#f8f9fa;
}

.diagnosis-cell{
max-width:260px;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
}

</style>
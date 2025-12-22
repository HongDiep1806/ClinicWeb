<template>
  <div class="main-wrapper">
    <Sidebar />
    <Navbar />
    <div class="page-wrapper">

      <div class="content">
        <div class="mb-4">
          <h6 class="fw-bold mb-0 d-flex align-items-center" style="cursor:pointer" @click="goBack">
            <i class="ti ti-chevron-left me-1"></i>Appointments
          </h6>
        </div>

        <div class="card">
          <div class="card-body">

            <!-- PATIENT -->
            <div class="mb-3">
              <label class="form-label">Patient *</label>
              <select v-model="form.patientId" class="form-select">
                <option value="">Select</option>
                <option v-for="p in patients" :key="p.userId" :value="p.userId">
                  {{ p.fullName }}
                </option>
              </select>
            </div>

            <!-- DEPARTMENT -->
            <div class="mb-3">
              <label class="form-label">Department *</label>
              <select v-model="form.departmentId" class="form-select" @change="loadFilteredDoctors">
                <option value="">Select</option>
                <option v-for="d in departments" :key="d.departmentId" :value="d.departmentId">
                  {{ d.name }}
                </option>
              </select>
            </div>

            <!-- DATE -->
            <div class="mb-3">
              <label class="form-label">Date *</label>

              <input
                id="datePicker"
                type="text"
                class="form-control datetimepicker"
                placeholder="DD/MM/YYYY"
              />

              <p v-if="isWeekend" class="text-danger small mt-1">
                This date falls on a weekend. No doctors available.
              </p>
            </div>

            <!-- DOCTOR -->
            <div class="mb-3">
              <label class="form-label">Doctor *</label>

              <select v-model="form.doctorId" class="form-select" :disabled="doctors.length === 0">
                <option value="">Select Doctor</option>

                <option v-for="d in doctors" :key="d.userId" :value="d.userId">
                  {{ d.fullName }}
                </option>
              </select>

              <p v-if="!isWeekend && doctors.length === 0 && form.date" class="text-danger small mt-1">
                No doctors available on this weekday.
              </p>
            </div>

          </div>
        </div>

        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-light me-2" @click="goBack">Cancel</button>
          <button class="btn btn-primary" @click="submit">Create Appointment</button>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";
import { getAllPatients } from "../services/userService";
import { getDepartments } from "../services/departmentService";
import { getDoctorsByWeekday } from "../services/appointmentService";
import { bookAppointment } from "../services/appointmentService";
import { useToast } from "vue-toastification";

export default {
  components: { Sidebar, Navbar },

  setup() {
    const router = useRouter();
    const toast = useToast();

    const patients = ref([]);
    const departments = ref([]);
    const doctors = ref([]);
    const isWeekend = ref(false);

    const form = ref({
      patientId: "",
      departmentId: "",
      doctorId: "",
      date: ""
    });

    const goBack = () => router.back();

    const getWeekday = (dateStr) => {
      const js = new Date(dateStr).getDay();
      if (js === 0 || js === 6) return null;
      return js - 1;
    };

    // ============================================
    // LOAD DOCTOR THEO (DEPARTMENT + WEEKDAY)
    // ============================================
    const loadFilteredDoctors = async () => {
      if (!form.value.departmentId || !form.value.date) return;

      const weekday = getWeekday(form.value.date);
      if (weekday === null) {
        doctors.value = [];
        isWeekend.value = true;
        return;
      }

      isWeekend.value = false;

      // CALL BACKEND
      const res = await getDoctorsByWeekday(weekday);
      let list = res.data;

      // FILTER TIẾP THEO DEPARTMENT
      doctors.value = list.filter(
        d => d.departmentId == form.value.departmentId
      );
    };


    // ============================================
    // MOUNTED
    // ============================================
   onMounted(async () => {
  patients.value = (await getAllPatients()).data.filter(p => p.status === "Active");

  // 🔥 CHỈ LẤY DEPARTMENT ACTIVE
  const all = await getDepartments();
  departments.value = all.filter(d => d.status === "Active");

  const today = new Date();
  const iso = moment(today).format("YYYY-MM-DD");
  const display = moment(today).format("DD/MM/YYYY");

  $("#datePicker").val(display);
  form.value.date = iso;

  $("#datePicker")
    .datetimepicker({
      format: "DD/MM/YYYY",
      minDate: today
    })
    .on("dp.change", async (e) => {
      form.value.date = e.date.format("YYYY-MM-DD");
      await loadFilteredDoctors();
    });
});


    const submit = async () => {
      if (!form.value.patientId) return toast.error("Please select patient");
      if (!form.value.departmentId) return toast.error("Please select department");
      if (!form.value.date) return toast.error("Please select date");
      if (!form.value.doctorId) return toast.error("Please select doctor");

      try {
        await bookAppointment(form.value);
        toast.success("Appointment created!");
        router.back();
      } catch {
        toast.error("Failed");
      }
    };

    return {
      form,
      patients,
      departments,
      doctors,
      submit,
      goBack,
      isWeekend,
      loadFilteredDoctors
    };
  }
};
</script>

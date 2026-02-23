<template>
  <div class="main-wrapper">
    <Sidebar />
    <Navbar />

    <div class="page-wrapper">
      <div class="content">
        <!-- BACK -->
        <div class="mb-4">
          <h6 class="fw-bold mb-0 d-flex align-items-center" style="cursor:pointer" @click="goBack">
            <i class="ti ti-chevron-left me-1"></i>
            Appointments
          </h6>
        </div>

        <div class="card">
          <div class="card-body">

            <!-- PATIENT (SEARCH + SELECT + ICON) -->
            <div class="mb-3 position-relative patient-select">
              <label class="form-label">Patient *</label>

              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search or select patient..."
                  v-model="patientSearch" @focus="showPatientDropdown = true" @input="showPatientDropdown = true" />

                <span class="input-group-text bg-white" style="cursor:pointer" @click="togglePatientDropdown">
                  <i class="ti ti-chevron-down"></i>
                </span>
              </div>

              <ul v-if="showPatientDropdown && filteredPatients.length" class="dropdown-menu show w-100 mt-1 shadow-sm"
                style="max-height:220px; overflow-y:auto;">
                <!-- <li v-for="p in filteredPatients" :key="p.userId" class="dropdown-item" @click="selectPatient(p)">
                  {{ p.fullName }}
                </li> -->
                <li v-for="p in filteredPatients" :key="p.userId"
                  class="dropdown-item d-flex justify-content-between align-items-end" @click="selectPatient(p)">
                  <span>{{ p.fullName }}</span>

                  <span class="badge bg-secondary-subtle text-secondary ms-2">
                    #PT{{ p.userId }}
                  </span>
                </li>

              </ul>

              <div v-if="showPatientDropdown && !filteredPatients.length"
                class="dropdown-menu show w-100 mt-1 p-2 text-muted small">
                No patients found
              </div>
            </div>

            <!-- DEPARTMENT (SEARCH + SELECT + ICON) -->
            <div class="mb-3 position-relative department-select">
              <label class="form-label">Department *</label>

              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search or select department..."
                  v-model="departmentSearch" @focus="showDepartmentDropdown = true"
                  @input="showDepartmentDropdown = true" />

                <span class="input-group-text bg-white" style="cursor:pointer" @click="toggleDepartmentDropdown">
                  <i class="ti ti-chevron-down"></i>
                </span>
              </div>

              <ul v-if="showDepartmentDropdown && filteredDepartments.length"
                class="dropdown-menu show w-100 mt-1 shadow-sm" style="max-height:220px; overflow-y:auto;">
                <li v-for="d in filteredDepartments" :key="d.departmentId" class="dropdown-item"
                  @click="selectDepartment(d)">
                  {{ d.name }}
                </li>


              </ul>

              <div v-if="showDepartmentDropdown && !filteredDepartments.length"
                class="dropdown-menu show w-100 mt-1 p-2 text-muted small">
                No departments found
              </div>
            </div>

            <!-- DATE -->
            <div class="mb-3">
              <label class="form-label">Date *</label>

              <input id="datePicker" type="text" class="form-control datetimepicker" placeholder="DD/MM/YYYY" />

              <p v-if="isWeekend" class="text-danger small mt-1">
                This date falls on a weekend. No doctors available.
              </p>
            </div>
            <div class="mb-3">
              <label class="form-label">Work Shift *</label>

              <div class="d-flex gap-4">
                <div class="form-check">
                  <input class="form-check-input" type="radio" value="Morning" v-model="form.shift"
                    @change="loadFilteredDoctors" />
                  <label class="form-check-label">
                    Morning (08:00 – 12:00)
                  </label>
                </div>

                <div class="form-check">
                  <input class="form-check-input" type="radio" value="Afternoon" v-model="form.shift"
                    @change="loadFilteredDoctors" />
                  <label class="form-check-label">
                    Afternoon (13:00 – 17:00)
                  </label>
                </div>
              </div>
            </div>


            <!-- DOCTOR (SEARCH + SELECT + ICON) -->
            <div class="mb-3 position-relative doctor-select">
              <label class="form-label">Doctor *</label>

              <div class="input-group">
                <input type="text" class="form-control" :disabled="doctors.length === 0"
                  placeholder="Search or select doctor..." v-model="doctorSearch"
                  @focus="doctors.length && (showDoctorDropdown = true)"
                  @input="doctors.length && (showDoctorDropdown = true)" />

                <span class="input-group-text bg-white"
                  :style="{ cursor: doctors.length ? 'pointer' : 'not-allowed', opacity: doctors.length ? 1 : 0.6 }"
                  @click="doctors.length && toggleDoctorDropdown()">
                  <i class="ti ti-chevron-down"></i>
                </span>
              </div>

              <ul v-if="showDoctorDropdown && filteredDoctors.length" class="dropdown-menu show w-100 mt-1 shadow-sm"
                style="max-height:220px; overflow-y:auto;">
                <!-- <li v-for="d in filteredDoctors" :key="d.userId" class="dropdown-item" @click="selectDoctor(d)">
                  {{ d.fullName }}
                </li> -->
                <li v-for="d in filteredDoctors" :key="d.userId"
                  class="dropdown-item d-flex justify-content-between align-items-end" @click="selectDoctor(d)">
                  <span>{{ d.fullName }}</span>

                  <span class="badge" :class="d.remainingSlots > 50
                    ? 'bg-success-subtle text-success'
                    : 'bg-warning-subtle text-warning'">
                    {{ d.remainingSlots }} slots
                  </span>
                </li>
              </ul>

              <div v-if="showDoctorDropdown && !filteredDoctors.length"
                class="dropdown-menu show w-100 mt-1 p-2 text-muted small">
                No doctors found
              </div>

              <p v-if="!isWeekend && doctors.length === 0 && form.date && form.departmentId"
                class="text-danger small mt-1">
                No doctors available on this weekday.
              </p>
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

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";

import { getAllPatients } from "../services/userService";
import { getDepartments } from "../services/departmentService";
import { getDoctorsByWeekday, bookAppointment } from "../services/appointmentService";
import { getAllAppointments } from "../services/appointmentService";


import { useToast } from "vue-toastification";
import { getScheduleByDoctor } from "../services/scheduleService";

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
      date: "",
      shift: "",
      doctorId: ""
    });
    const DAILY_KPI = 200;
    // lấy toàn bộ appointment 1 lần (cache)
    const allAppointments = ref([]);




    /* ===== PATIENT AUTOCOMPLETE ===== */
    const patientSearch = ref("");
    const showPatientDropdown = ref(false);

    const filteredPatients = computed(() => {
      if (!patientSearch.value) return patients.value;
      return patients.value.filter(p =>
        (p.fullName || "").toLowerCase().includes(patientSearch.value.toLowerCase())
      );
    });

    const selectPatient = (patient) => {
      form.value.patientId = patient.userId;
      patientSearch.value = patient.fullName;
      showPatientDropdown.value = false;
    };

    const togglePatientDropdown = () => {
      showPatientDropdown.value = !showPatientDropdown.value;
    };

    /* ===== DEPARTMENT AUTOCOMPLETE ===== */
    const departmentSearch = ref("");
    const showDepartmentDropdown = ref(false);

    const filteredDepartments = computed(() => {
      if (!departmentSearch.value) return departments.value;
      return departments.value.filter(d =>
        (d.name || "").toLowerCase().includes(departmentSearch.value.toLowerCase())
      );
    });

    const selectDepartment = async (dept) => {
      form.value.departmentId = dept.departmentId;
      departmentSearch.value = dept.name;
      showDepartmentDropdown.value = false;

      // clear doctor when department changes
      form.value.doctorId = "";
      doctorSearch.value = "";
      doctors.value = [];

      await loadFilteredDoctors();
    };

    const toggleDepartmentDropdown = () => {
      showDepartmentDropdown.value = !showDepartmentDropdown.value;
    };

    /* ===== DOCTOR AUTOCOMPLETE ===== */
    const doctorSearch = ref("");
    const showDoctorDropdown = ref(false);

    const filteredDoctors = computed(() => {
      if (!doctorSearch.value) return doctors.value;
      return doctors.value.filter(d =>
        (d.fullName || "").toLowerCase().includes(doctorSearch.value.toLowerCase())
      );
    });

    const selectDoctor = (doc) => {
      form.value.doctorId = doc.userId;
      doctorSearch.value = doc.fullName;
      showDoctorDropdown.value = false;
    };

    const toggleDoctorDropdown = () => {
      showDoctorDropdown.value = !showDoctorDropdown.value;
    };

    /* ===== COMMON ===== */
    const goBack = () => router.back();

    const getWeekday = (dateStr) => {
      const day = new Date(dateStr).getDay();

      // Chủ nhật
      if (day === 0) return 6;

      // Thứ 2 → Thứ 7
      return day - 1;
    };
    const buildAppointmentDateTime = (dateStr, shift) => {
      if (shift === "Morning") return `${dateStr}T08:00:00`;
      if (shift === "Afternoon") return `${dateStr}T13:00:00`;
      return `${dateStr}T00:00:00`;
    };


    // const loadFilteredDoctors = async () => {
    //   if (!form.value.departmentId || !form.value.date || !form.value.shift) {
    //     doctors.value = [];
    //     return;
    //   }

    //   const weekdayIndex = getWeekday(form.value.date);
    //   isWeekend.value = false;

    //   const res = await getDoctorsByWeekday(weekdayIndex);
    //   const doctorList = res.data || [];

    //   const weekdayNames = [
    //     "Monday",
    //     "Tuesday",
    //     "Wednesday",
    //     "Thursday",
    //     "Friday",
    //     "Saturday",
    //     "Sunday"
    //   ];

    //   // ✅ DÒNG QUAN TRỌNG
    //   const dayName = weekdayNames[weekdayIndex];

    //   const matchedDoctors = [];

    //   for (const doc of doctorList) {
    //     if (doc.departmentId != form.value.departmentId) continue;

    //     const schRes = await getScheduleByDoctor(doc.userId);
    //     const schedules = schRes.data || [];

    //     const matched = schedules.find(s => {
    //       const start = s.startTime.substring(0, 5);
    //       const shift =
    //         start === "08:00" ? "Morning" :
    //           start === "13:00" ? "Afternoon" : "";

    //       return (
    //         s.dayOfWeek === dayName &&
    //         shift === form.value.shift
    //       );
    //     });

    //     if (matched) matchedDoctors.push(doc);
    //   }

    //   doctors.value = matchedDoctors;

    //   if (!doctors.value.some(d => d.userId === form.value.doctorId)) {
    //     form.value.doctorId = "";
    //     doctorSearch.value = "";
    //   }
    // };
    const loadFilteredDoctors = async () => {
      if (!form.value.departmentId || !form.value.date || !form.value.shift) {
        doctors.value = [];
        return;
      }

      const weekdayIndex = getWeekday(form.value.date);
      isWeekend.value = false;

      const res = await getDoctorsByWeekday(weekdayIndex);
      const doctorList = res.data || [];

      const weekdayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ];

      const dayName = weekdayNames[weekdayIndex];

      const matchedDoctors = [];

      for (const doc of doctorList) {
        if (doc.departmentId != form.value.departmentId) continue;

        // 1️⃣ check schedule theo ngày + ca
        const schRes = await getScheduleByDoctor(doc.userId);
        const schedules = schRes.data || [];

        const matchedSchedule = schedules.find(s => {
          const start = s.startTime.substring(0, 5);
          const shift =
            start === "08:00" ? "Morning" :
              start === "13:00" ? "Afternoon" : "";

          return (
            s.dayOfWeek === dayName &&
            shift === form.value.shift
          );
        });

        if (!matchedSchedule) continue;

        // trong vòng for doctor
        const appointmentCount = allAppointments.value.filter(a => {
          if (a.doctorId !== doc.userId) return false;
          if (a.status === "Cancelled") return false;

          // cùng ngày
          if (a.date !== form.value.date) return false;

          // cùng ca
          const hour = Number(a.time?.substring(0, 2) || 0);
          const apptShift = hour < 12 ? "Morning" : "Afternoon";

          return apptShift === form.value.shift;
        }).length;

        const remainingSlots = DAILY_KPI - appointmentCount;

        // ẩn doctor full KPI
        if (remainingSlots <= 0) continue;

        matchedDoctors.push({
          ...doc,
          remainingSlots
        });




        // const remainingSlots = DAILY_KPI - appointmentCount;

        // // 3️⃣ nếu muốn ẩn doctor full KPI
        // if (remainingSlots <= 0) continue;

        // matchedDoctors.push({
        //   ...doc,
        //   remainingSlots
        // });
      }

      // 4️⃣ SORT giảm dần theo remaining slots
      matchedDoctors.sort(
        (a, b) => b.remainingSlots - a.remainingSlots
      );

      doctors.value = matchedDoctors;

      // clear doctor nếu không còn hợp lệ
      if (!doctors.value.some(d => d.userId === form.value.doctorId)) {
        form.value.doctorId = "";
        doctorSearch.value = "";
      }
    };




    onMounted(async () => {
      allAppointments.value = (await getAllAppointments()).data || [];

      patients.value = (await getAllPatients()).data.filter(p => p.status === "Active");

      const allDepartments = await getDepartments();
      departments.value = allDepartments.filter(d => d.status === "Active");

      const today = new Date();
      const iso = moment(today).format("YYYY-MM-DD");
      const display = moment(today).format("DD/MM/YYYY");

      form.value.date = iso;
      $("#datePicker").val(display);

      $("#datePicker")
        .datetimepicker({
          format: "DD/MM/YYYY",
          minDate: today
        })
        .on("dp.change", async (e) => {
          form.value.date = e.date.format("YYYY-MM-DD");
          await loadFilteredDoctors();
        });

      /* CLOSE DROPDOWNS WHEN CLICK OUTSIDE */
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".patient-select")) showPatientDropdown.value = false;
        if (!e.target.closest(".department-select")) showDepartmentDropdown.value = false;
        if (!e.target.closest(".doctor-select")) showDoctorDropdown.value = false;
      });
    });

    const submit = async () => {
      if (!form.value.patientId) return toast.error("Please select patient");
      if (!form.value.departmentId) return toast.error("Please select department");
      if (!form.value.date) return toast.error("Please select date");
      if (!form.value.shift) return toast.error("Please select work shift");
      if (!form.value.doctorId) return toast.error("Please select doctor");

      const payload = {
        patientId: form.value.patientId,
        doctorId: form.value.doctorId,
        date: buildAppointmentDateTime(form.value.date, form.value.shift), reason: null
      };

      try {
        await bookAppointment(payload);
        toast.success("Appointment created!");
        router.back();
      } catch (err) {
        console.error(err);
        toast.error("Failed to create appointment");
      }
    };


    return {
      form,
      patients,
      patientSearch,
      filteredPatients,
      showPatientDropdown,
      selectPatient,
      togglePatientDropdown,

      departments,
      departmentSearch,
      filteredDepartments,
      showDepartmentDropdown,
      selectDepartment,
      toggleDepartmentDropdown,

      doctors,
      doctorSearch,
      filteredDoctors,
      showDoctorDropdown,
      selectDoctor,
      toggleDoctorDropdown,

      isWeekend,
      loadFilteredDoctors,
      submit,
      goBack
    };
  }
};
</script>

<template>
  <div class="main-wrapper">
    <Sidebar />
    <Navbar />

    <div class="page-wrapper">
      <div class="content">
        <!-- BACK -->
        <div class="mb-4">
          <h6
            class="fw-bold mb-0 d-flex align-items-center"
            style="cursor:pointer"
            @click="goBack"
          >
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
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search or select patient..."
                  v-model="patientSearch"
                  @focus="showPatientDropdown = true"
                  @input="showPatientDropdown = true"
                />

                <!-- DROPDOWN ICON -->
                <span
                  class="input-group-text bg-white"
                  style="cursor:pointer"
                  @click="togglePatientDropdown"
                >
                  <i class="ti ti-chevron-down"></i>
                </span>
              </div>

              <!-- DROPDOWN LIST -->
              <ul
                v-if="showPatientDropdown && filteredPatients.length"
                class="dropdown-menu show w-100 mt-1 shadow-sm"
                style="max-height:220px; overflow-y:auto;"
              >
                <li
                  v-for="p in filteredPatients"
                  :key="p.userId"
                  class="dropdown-item"
                  @click="selectPatient(p)"
                >
                  {{ p.fullName }}
                </li>
              </ul>

              <!-- EMPTY -->
              <div
                v-if="showPatientDropdown && !filteredPatients.length"
                class="dropdown-menu show w-100 mt-1 p-2 text-muted small"
              >
                No patients found
              </div>
            </div>

            <!-- DEPARTMENT -->
            <div class="mb-3">
              <label class="form-label">Department *</label>
              <select
                v-model="form.departmentId"
                class="form-select"
                @change="loadFilteredDoctors"
              >
                <option value="">Select</option>
                <option
                  v-for="d in departments"
                  :key="d.departmentId"
                  :value="d.departmentId"
                >
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

              <select
                v-model="form.doctorId"
                class="form-select"
                :disabled="doctors.length === 0"
              >
                <option value="">Select Doctor</option>
                <option
                  v-for="d in doctors"
                  :key="d.userId"
                  :value="d.userId"
                >
                  {{ d.fullName }}
                </option>
              </select>

              <p
                v-if="!isWeekend && doctors.length === 0 && form.date"
                class="text-danger small mt-1"
              >
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
import {
  getDoctorsByWeekday,
  bookAppointment
} from "../services/appointmentService";

import { useToast } from "vue-toastification";

export default {
  components: {
    Sidebar,
    Navbar
  },

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

    /* ===== PATIENT AUTOCOMPLETE ===== */
    const patientSearch = ref("");
    const showPatientDropdown = ref(false);

    const filteredPatients = computed(() => {
      if (!patientSearch.value) return patients.value;

      return patients.value.filter(p =>
        p.fullName
          .toLowerCase()
          .includes(patientSearch.value.toLowerCase())
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

    /* ===== COMMON ===== */
    const goBack = () => router.back();

    const getWeekday = (dateStr) => {
      const day = new Date(dateStr).getDay();
      if (day === 0 || day === 6) return null;
      return day - 1;
    };

    const loadFilteredDoctors = async () => {
      if (!form.value.departmentId || !form.value.date) return;

      const weekday = getWeekday(form.value.date);

      if (weekday === null) {
        doctors.value = [];
        isWeekend.value = true;
        return;
      }

      isWeekend.value = false;

      const res = await getDoctorsByWeekday(weekday);
      doctors.value = res.data.filter(
        d => d.departmentId == form.value.departmentId
      );
    };

    onMounted(async () => {
      patients.value = (await getAllPatients()).data.filter(
        p => p.status === "Active"
      );

      const allDepartments = await getDepartments();
      departments.value = allDepartments.filter(
        d => d.status === "Active"
      );

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

      /* CLOSE DROPDOWN WHEN CLICK OUTSIDE */
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".patient-select")) {
          showPatientDropdown.value = false;
        }
      });
    });

    const submit = async () => {
      if (!form.value.patientId)
        return toast.error("Please select patient");
      if (!form.value.departmentId)
        return toast.error("Please select department");
      if (!form.value.date)
        return toast.error("Please select date");
      if (!form.value.doctorId)
        return toast.error("Please select doctor");

      try {
        await bookAppointment(form.value);
        toast.success("Appointment created!");
        router.back();
      } catch {
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
      doctors,
      isWeekend,
      loadFilteredDoctors,
      submit,
      goBack
    };
  }
};
</script>

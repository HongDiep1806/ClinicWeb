<template>
  <div class="main-wrapper">
    <Navbar />
    <Sidebar />

    <div class="page-wrapper">
      <div class="content">
        <div class="row">
          <div class="col-lg-10 mx-auto">

            <div class="d-flex align-items-center mb-3">
              <h6 class="fw-bold mb-0">
                <i class="ti ti-chevron-left me-1 fs-14"></i> Patient
              </h6>
            </div>

            <div class="card">
              <div class="card-body">

                <form @submit.prevent="handleSubmit">
                  <h5 class="fs-18 fw-bold mb-3">New Patient</h5>

                  <!-- Avatar Preview -->
                  <div class="mb-3 d-flex align-items-center">
                    <label class="form-label me-3">Profile Image</label>
                    <div class="avatar-circle d-flex align-items-center justify-content-center"
                      :style="{ backgroundColor: avatarColor }">
                      <span class="avatar-initial">{{ avatarInitial }}</span>
                    </div>
                  </div>

                  <!-- Full Name -->
                  <div class="mb-3">
                    <label class="form-label">Full Name *</label>
                    <input v-model="form.fullName" type="text" class="form-control" required />
                  </div>

                  <!-- Email -->
                  <div class="mb-3">
                    <label class="form-label">Email *</label>
                    <input v-model="form.email" type="email" class="form-control" required />
                  </div>

                  <!-- Password -->
                  <div class="mb-3">
                    <label class="form-label">Password *</label>
                    <div class="input-group">
                      <input :type="showPassword ? 'text' : 'password'" v-model="form.password"
                        class="form-control" required />
                      <span class="input-group-text" @click="showPassword = !showPassword"
                        style="cursor:pointer">
                        <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                      </span>
                    </div>
                    <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
                  </div>

                  <!-- Confirm Password -->
                  <div class="mb-3">
                    <label class="form-label">Confirm Password *</label>
                    <div class="input-group">
                      <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                        class="form-control" required />
                      <span class="input-group-text" @click="showConfirmPassword = !showConfirmPassword"
                        style="cursor:pointer">
                        <i :class="showConfirmPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                      </span>
                    </div>
                    <small v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</small>
                  </div>

                  <!-- Phone -->
                  <div class="mb-3">
                    <label class="form-label">Phone *</label>
                    <input v-model="form.phone" type="text" class="form-control" required />
                    <small v-if="errors.phone" class="text-danger">{{ errors.phone }}</small>
                  </div>

                  <!-- DOB -->
                  <div class="mb-3">
                    <label class="form-label">Date of Birth *</label>
                    <VueDatePicker v-model="dobModel" type="date" :formats="{ input: 'dd.MM.yyyy' }"
                      :time-config="{ enableTimePicker: false }"
                      :class="{ 'is-invalid': errors.dob }" />
                    <small v-if="errors.dob" class="text-danger">{{ errors.dob }}</small>
                  </div>

                  <!-- Gender -->
                  <div class="mb-3">
                    <label class="form-label">Gender *</label>
                    <select v-model="form.gender" class="form-control" required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <!-- Address -->
                  <div class="mb-3">
                    <label class="form-label">Address *</label>
                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <select v-model="selectedProvince" @change="onProvinceChange"
                          class="form-control" :class="{ 'is-invalid': errors.address }">
                          <option value="">Select Province/City</option>
                          <option v-for="p in provinces" :key="p.matinhBNV" :value="p.matinhBNV">
                            {{ p.tentinhmoi }}
                          </option>
                        </select>
                      </div>
                      <div class="col-md-6 mb-2">
                        <select v-model="selectedWard" class="form-control"
                          :class="{ 'is-invalid': errors.address }">
                          <option value="">Select Ward</option>
                          <option v-for="w in wards" :key="w.maphuongxa" :value="w.maphuongxa">
                            {{ w.tenphuongxa }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <small v-if="errors.address" class="text-danger">{{ errors.address }}</small>
                  </div>

                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-light" @click="handleCancel">
                      Cancel
                    </button>
                    <button class="btn btn-primary">Add Patient</button>
                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="footer text-center bg-white p-2 border-top">
        <p class="text-dark mb-0">2025 © Preclinic</p>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import { createPatient } from "../services/patientService";
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import vnAddress from "../data/vietnam-address-2024.json";
import { useToast } from "vue-toastification";

export default {
  name: 'AddPatient',
  components: { Sidebar, Navbar, VueDatePicker },

  data() {
    return {
      form: {
        fullName: "",
        gender: "",
        phone: "",
        address: "",
        email: "",
        password: "",
        roleId: 2 // Patient role
      },
      dobModel: null,
      showPassword: false,
      showConfirmPassword: false,
      confirmPassword: "",
      errors: {
        password: "",
        confirmPassword: "",
        phone: "",
        dob: "",
        address: ""
      },
      selectedProvince: "",
      selectedWard: "",
      provinces: vnAddress,
      wards: []
    };
  },

  methods: {
    handleCancel() {
      this.$router.back();
    },

    onProvinceChange() {
      const province = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
      this.wards = province ? province.phuongxa : [];
      this.selectedWard = "";
    },

    buildAddress() {
      const province = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
      const ward = this.wards.find(w => w.maphuongxa === this.selectedWard);
      if (!province || !ward) return "";
      return `${ward.tenphuongxa}, ${province.tentinhmoi}`;
    },

    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      return `${d.getFullYear()}-${month}-${day}`;
    },

    async handleSubmit() {
      this.errors = { password: "", confirmPassword: "", phone: "", dob: "", address: "" };
      const toast = useToast();

      if (!this.form.password || this.form.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters.";
        return;
      }

      if (this.confirmPassword !== this.form.password) {
        this.errors.confirmPassword = "Passwords do not match.";
        return;
      }

      if (!this.form.phone || this.form.phone.length < 10) {
        this.errors.phone = "Invalid phone number.";
        return;
      }

      if (!this.dobModel) {
        this.errors.dob = "Date of birth is required.";
        return;
      }

      if (!this.selectedProvince || !this.selectedWard) {
        this.errors.address = "Please select full address.";
        return;
      }

      try {
        const dobFormatted = this.formatDate(this.dobModel);
        const payload = {
          fullName: this.form.fullName,
          dob: dobFormatted,
          gender: this.form.gender,
          phone: this.form.phone,
          address: this.buildAddress(),
          email: this.form.email,
          password: this.form.password,
          roleId: this.form.roleId
        };

        await createPatient(payload);
        toast.success("Patient created successfully!");
        this.$router.push("/patients");

      } catch (error) {
        if (error.response?.status === 409 && error.response.data?.message === "EMAIL_IN_USE") {
          toast.error("Email already exists!");
        } else {
          toast.error("Failed to create patient!");
        }
        console.error("API FAILED:", error);
      }
    }
  },

  computed: {
    avatarInitial() {
      return this.form.fullName ? this.form.fullName.charAt(0).toUpperCase() : "?";
    },

    avatarColor() {
      if (!this.form.fullName) return "#6c757d";
      const colors = ["#858796"];
      let hash = 0;
      for (let i = 0; i < this.form.fullName.length; i++) {
        hash = this.form.fullName.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    }
  }
};
</script>

<style>
.avatar-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  font-size: 28px;
  font-weight: bold;
  color: white;
}

.is-invalid {
  border: 1px solid #dc3545 !important;
  border-radius: 6px !important;
}
</style>

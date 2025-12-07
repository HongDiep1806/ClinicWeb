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
                <i class="ti ti-chevron-left me-1"></i> Staff
              </h6>
            </div>

            <div class="card">
              <div class="card-body">

                <form @submit.prevent="handleSubmit">
                  <h5 class="fs-18 fw-bold mb-3">Add Staff</h5>

                  <!-- Avatar -->
                  <div class="mb-3 d-flex align-items-center">
                    <label class="form-label me-3">Profile Image</label>
                    <div
                      class="avatar-circle d-flex align-items-center justify-content-center"
                      :style="{ backgroundColor: avatarColor }"
                    >
                      <span class="avatar-initial">{{ avatarInitial }}</span>
                    </div>
                  </div>

                  <!-- FULL NAME -->
                  <div class="mb-3">
                    <label class="form-label">Full Name *</label>
                    <input v-model="form.fullName" type="text" class="form-control" required />
                  </div>

                  <!-- EMAIL -->
                  <div class="mb-3">
                    <label class="form-label">Email *</label>
                    <input v-model="form.email" type="email" class="form-control" required />
                  </div>

                  <!-- PASSWORD -->
                  <div class="mb-3">
                    <label class="form-label">Password *</label>
                    <div class="input-group">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="form.password"
                        class="form-control"
                        required
                      />
                      <span class="input-group-text" @click="showPassword = !showPassword">
                        <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                      </span>
                    </div>
                    <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
                  </div>

                  <!-- CONFIRM PASSWORD -->
                  <div class="mb-3">
                    <label class="form-label">Confirm Password *</label>
                    <div class="input-group">
                      <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        v-model="confirmPassword"
                        class="form-control"
                        required
                      />
                      <span class="input-group-text" @click="showConfirmPassword = !showConfirmPassword">
                        <i :class="showConfirmPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                      </span>
                    </div>
                    <small v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</small>
                  </div>

                  <!-- PHONE -->
                  <div class="mb-3">
                    <label class="form-label">Phone *</label>
                    <input v-model="form.phone" type="text" class="form-control" required />
                    <small v-if="errors.phone" class="text-danger">{{ errors.phone }}</small>
                  </div>

                  <!-- DOB -->
                  <div class="mb-3">
                    <label class="form-label">Date of Birth *</label>

                    <VueDatePicker
                      v-model="dobModel"
                      type="date"
                      :formats="{ input: 'dd.MM.yyyy' }"
                      :time-config="{ enableTimePicker: false }"
                      :class="{ 'is-invalid': errors.dob }"
                    />

                    <small v-if="errors.dob" class="text-danger">{{ errors.dob }}</small>
                  </div>

                  <!-- Gender -->
                  <div class="mb-3">
                    <label class="form-label">Gender *</label>
                    <select v-model="form.gender" class="form-control" required>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <!-- ADDRESS -->
                  <div class="mb-3">
                    <label class="form-label">Address *</label>

                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <select
                          v-model="selectedProvince"
                          @change="onProvinceChange"
                          class="form-control"
                          :class="{ 'is-invalid': errors.address }"
                        >
                          <option value="">Select Province</option>
                          <option v-for="p in provinces" :key="p.matinhBNV" :value="p.matinhBNV">
                            {{ p.tentinhmoi }}
                          </option>
                        </select>
                      </div>

                      <div class="col-md-6 mb-2">
                        <select
                          v-model="selectedWard"
                          class="form-control"
                          :class="{ 'is-invalid': errors.address }"
                        >
                          <option value="">Select Ward</option>
                          <option v-for="w in wards" :key="w.maphuongxa" :value="w.maphuongxa">
                            {{ w.tenphuongxa }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <small v-if="errors.address" class="text-danger">{{ errors.address }}</small>
                  </div>

                  <!-- Submit -->
                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-light" @click="$router.back()">Cancel</button>
                    <button class="btn btn-primary">Add Staff</button>
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
import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import vnAddress from "../data/vietnam-address-2024.json";
import { createStaff } from "../services/staffService";
import { useToast } from "vue-toastification";

export default {
  name: "AddStaff",
  components: { Sidebar, Navbar, VueDatePicker },

  data() {
    return {
      form: {
        fullName: "",
        email: "",
        password: "",
        phone: "",
        gender: "",
        address: "",
        dob: "",
        departmentId: null,
        roleId: 3   // Receptionist
      },

      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,

      dobModel: null,

      selectedProvince: "",
      selectedWard: "",
      provinces: vnAddress,
      wards: [],

      errors: { password: "", confirmPassword: "", phone: "", dob: "", address: "" }
    };
  },

  methods: {
    onProvinceChange() {
      const province = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
      this.wards = province ? province.phuongxa : [];
      this.selectedWard = "";
    },

    buildAddress() {
      const p = this.provinces.find(x => x.matinhBNV === this.selectedProvince);
      const w = this.wards.find(x => x.maphuongxa === this.selectedWard);
      return p && w ? `${w.tenphuongxa}, ${p.tentinhmoi}` : "";
    },

    formatDate(date) {
      const d = new Date(date);
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${d.getFullYear()}-${m}-${day}`;
    },

    async handleSubmit() {
      const toast = useToast();
      this.errors = { password: "", confirmPassword: "", phone: "", dob: "", address: "" };

      if (this.form.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters.";
        return;
      }

      if (this.form.password !== this.confirmPassword) {
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

      this.form.dob = this.formatDate(this.dobModel);
      this.form.address = this.buildAddress();

      try {
        await createStaff(this.form);
        toast.success("Staff created successfully!");
        this.$router.push("/staff");
      } catch (error) {
        if (error.response?.status === 409) toast.error("Email already exists!");
        else toast.error("Failed to create staff");
      }
    }
  },

  computed: {
    avatarInitial() {
      return this.form.fullName ? this.form.fullName.charAt(0).toUpperCase() : "?";
    },
    avatarColor() {
      return "#6c757d"; // default grey
    }
  }
};
</script>

<style scoped>
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

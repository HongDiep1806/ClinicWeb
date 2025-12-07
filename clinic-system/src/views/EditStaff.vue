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
                <i class="ti ti-chevron-left me-1 fs-14"></i> Edit Staff
              </h6>
            </div>

            <div class="card">
              <div class="card-body">

                <form @submit.prevent="handleSubmit">
                  <h5 class="fs-18 fw-bold mb-3">Staff Information</h5>

                  <!-- AVATAR -->
                  <div class="mb-3 d-flex align-items-center">
                    <label class="form-label me-3">Profile Image</label>
                    <div class="avatar-circle d-flex align-items-center justify-content-center"
                      :style="{ backgroundColor: avatarColor }">
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

                  <!-- GENDER -->
                  <div class="mb-3">
                    <label class="form-label">Gender *</label>
                    <select v-model="form.gender" class="form-control" required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <!-- ADDRESS -->
                  <div class="mb-3">
                    <label class="form-label">Address *</label>
                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <select v-model="selectedProvince" @change="onProvinceChange"
                          class="form-control">
                          <option value="">Select Province</option>
                          <option v-for="p in provinces" :key="p.matinhBNV" :value="p.matinhBNV">
                            {{ p.tentinhmoi }}
                          </option>
                        </select>
                      </div>

                      <div class="col-md-6 mb-2">
                        <select v-model="selectedWard" class="form-control">
                          <option value="">Select Ward</option>
                          <option v-for="w in wards" :key="w.maphuongxa" :value="w.maphuongxa">
                            {{ w.tenphuongxa }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- SUBMIT -->
                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-light" @click="handleCancel">Cancel</button>
                    <button class="btn btn-primary">Save Changes</button>
                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer text-center bg-white p-2 border-top">
        <p class="mb-0">2025 © Preclinic</p>
      </div>
    </div>
  </div>
</template>


<script>
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import vnAddress from "../data/vietnam-address-2024.json";
import { getStaffById, editStaff } from "../services/staffService";
import { useToast } from "vue-toastification";

export default {
  name: "EditStaff",
  components: { Navbar, Sidebar, VueDatePicker },

  data() {
    return {
      userId: null,
      form: {
        userId: null,
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        dob: "",
        roleId: 3,
        departmentId: null
      },

      dobModel: null,

      selectedProvince: "",
      selectedWard: "",
      provinces: vnAddress,
      wards: [],

      errors: { phone: "", dob: "" }
    };
  },

  async mounted() {
    this.userId = this.$route.params.id;
    await this.loadStaff(this.userId);
  },

  methods: {
    handleCancel() {
      this.$router.back();
    },

    // Load staff by ID
    async loadStaff(id) {
      try {
        const res = await getStaffById(id);
        const s = res.data;

        this.form = {
          userId: s.userId,
          fullName: s.fullName,
          email: s.email,
          phone: s.phone,
          gender: s.gender,
          address: s.address,
          roleId: 3,
          departmentId: null
        };

        // === DOB FIX ===
        if (s.dob) {
          const clean = s.dob.split(".")[0];
          const iso = clean.replace(" ", "T");
          this.dobModel = new Date(iso);
        }

        // === ADDRESS PARSE ===
        if (s.address) {
          const [wardName, provinceName] = s.address.split(",").map(x => x.trim());
          const province = this.provinces.find(p => p.tentinhmoi === provinceName);

          if (province) {
            this.selectedProvince = province.matinhBNV;
            this.wards = province.phuongxa;

            const ward = this.wards.find(w => w.tenphuongxa === wardName);
            if (ward) this.selectedWard = ward.maphuongxa;
          }
        }

      } catch (err) {
        console.error("Load staff failed:", err);
      }
    },

    onProvinceChange() {
      const province = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
      this.wards = province ? province.phuongxa : [];
      this.selectedWard = "";
    },

    buildAddress() {
      const p = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
      const w = this.wards.find(w => w.maphuongxa === this.selectedWard);
      return p && w ? `${w.tenphuongxa}, ${p.tentinhmoi}` : "";
    },

    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    },

    async handleSubmit() {
      const toast = useToast();

      if (!this.form.phone || this.form.phone.length < 9) {
        this.errors.phone = "Invalid phone number";
        return;
      }

      if (!this.dobModel) {
        this.errors.dob = "Date of birth is required.";
        return;
      }

      const payload = {
        userId: this.form.userId,
        fullName: this.form.fullName,
        email: this.form.email,
        phone: this.form.phone,
        gender: this.form.gender,
        dob: this.formatDate(this.dobModel),
        address: this.buildAddress(),
        roleId: 3,
        departmentId: null
      };

      try {
        await editStaff(this.userId, payload);
        toast.success("Staff updated successfully!");
        this.$router.push("/staff");
      } catch (err) {
        if (err.response?.status === 409)
          toast.error("Email already exists!");
        else toast.error("Failed to update staff");
      }
    }
  },

  computed: {
    avatarInitial() {
      return this.form.fullName ? this.form.fullName.charAt(0).toUpperCase() : "?";
    },
    avatarColor() {
      return "#6c757d"; // xám mặc định
    }
  }
};
</script>

<style scoped>
.avatar-circle {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  color: white;
}
</style>

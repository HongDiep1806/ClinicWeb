<template>
  <div class="main-wrapper">
    <Navbar />
    <Sidebar />

    <div class="page-wrapper">
      <div class="content container-fluid">

        <h4 class="fw-bold mb-4">My Profile</h4>

        <div class="card shadow-sm">
          <div class="card-body">

            <!-- ======================
                 PROFILE IMAGE
            ======================== -->
            <div class="mb-4 pb-3 border-bottom">
              <label class="fw-semibold mb-2">Profile Image</label>
              <div class="d-flex align-items-center">
                <div class="avatar-circle-large me-3" :style="{ backgroundColor: getColor(form.fullName) }">
                  {{ getInitial(form.fullName) }}
                </div>
              </div>
            </div>

            <!-- ======================
                 UPDATE INFO FORM
            ======================== -->
            <h5 class="fw-bold">Basic Information</h5>

            <form @submit.prevent="saveProfile">

              <div class="row mt-3">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Full Name *</label>
                  <input v-model="form.fullName" class="form-control" />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Email *</label>
                  <input v-model="form.email" class="form-control" />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Phone *</label>
                  <input v-model="form.phone" class="form-control" />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Gender</label>
                  <select v-model="form.gender" class="form-control">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Date of Birth</label>
                  <VueDatePicker v-model="dobModel" type="date" :formats="{ input: 'dd.MM.yyyy' }"
                    :time-config="{ enableTimePicker: false }" />
                </div>

                <!-- Address -->
                <div class="col-12">
                  <label class="form-label">Address</label>

                  <div class="row">
                    <div class="col-md-6 mb-2">
                      <select v-model="selectedProvince" @change="onProvinceChange" class="form-control">
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
              </div>

              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-primary">Save Changes</button>
              </div>
            </form>

            <!-- ======================
                 CHANGE PASSWORD
            ======================== -->
            <div class="border-top mt-4 pt-4">
              <h5 class="fw-bold">Change Password</h5>

              <form @submit.prevent="changePassword">
                <div class="row mt-3">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Current Password</label>
                    <input type="password" v-model="password.current" class="form-control" />
                  </div>

                  <div class="col-md-4 mb-3">
                    <label class="form-label">New Password</label>
                    <input type="password" v-model="password.new" class="form-control" />
                  </div>

                  <div class="col-md-4 mb-3">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" v-model="password.confirm" class="form-control" />
                  </div>
                </div>

                <div class="d-flex justify-content-end mt-3">
                  <button class="btn btn-primary">Update Password</button>
                </div>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { useAuthStore } from "../stores/auth";
import { getUserById, updateUser, changePassword } from "../services/userService";
import vnAddress from "../data/vietnam-address-2024.json";
import { useToast } from "vue-toastification";

export default {
  components: { Navbar, Sidebar, VueDatePicker },

  data() {
    return {
      auth: useAuthStore(),
      form: {
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
      },

      dobModel: null,

      provinces: vnAddress,
      selectedProvince: "",
      selectedWard: "",
      wards: [],

      password: {
        current: "",
        new: "",
        confirm: "",
      },
    };
  },

  async mounted() {
    await this.loadUser();
  },

  methods: {
    async loadUser() {
      const toast = useToast();
      try {
        const id = this.auth.user?.userId;

        if (!id) {
          toast.error("User ID missing");
          return;
        }

        const res = await getUserById(id);
        const u = res.data;

        this.form.fullName = u.fullName;
        this.form.email = u.email;
        this.form.phone = u.phone;
        this.form.gender = u.gender;
        this.form.address = u.address;

        if (u.dob) this.dobModel = new Date(u.dob.replace(" ", "T"));

        // Parse address
        if (u.address) {
          const [wardName, provinceName] = u.address.split(",").map(x => x.trim());

          const province = this.provinces.find(p => p.tentinhmoi === provinceName);
          if (province) {
            this.selectedProvince = province.matinhBNV;
            this.wards = province.phuongxa;

            const ward = this.wards.find(w => w.tenphuongxa === wardName);
            if (ward) this.selectedWard = ward.maphuongxa;
          }
        }

      } catch (e) {
        console.error("Load user failed:", e);
      }
    },

    onProvinceChange() {
      const province = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
      this.wards = province ? province.phuongxa : [];
      this.selectedWard = "";
    },

    buildAddress() {
      if (!this.selectedProvince && !this.selectedWard) return this.form.address; // giữ nguyên

      if ((this.selectedProvince && !this.selectedWard) ||
        (!this.selectedProvince && this.selectedWard)) {
        return null; // lỗi
      }

      const province = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
      const ward = this.wards.find(w => w.maphuongxa === this.selectedWard);

      return `${ward.tenphuongxa}, ${province.tentinhmoi}`;
    },

    async saveProfile() {
      const toast = useToast();

      const addressBuilt = this.buildAddress();

      if (addressBuilt === null) {
        toast.error("Please select BOTH province and ward.");
        return;
      }

      const payload = {
        fullName: this.form.fullName,
        email: this.form.email,
        phone: this.form.phone,
        gender: this.form.gender,
        dob: this.dobModel ? this.dobModel.toISOString().split("T")[0] : null,
        address: addressBuilt,
      };

      try {
        const oldEmail = this.auth.user.email;

        await updateUser(this.auth.user.userId, payload);

        const emailChanged = payload.email !== oldEmail;

        if (emailChanged) {
          toast.success("Email updated successfully! Please login again.");

          // Cho người dùng thấy toast trong 1.2s rồi logout
          setTimeout(() => {
            this.auth.logout();
          }, 1200);

          return;
        }

        toast.success("Profile updated!");

      } catch (err) {
        toast.error("Update failed.");
      }
    }
    ,

    async changePassword() {
      const toast = useToast();

      // ===== VALIDATION =====
      if (!this.password.current || !this.password.new || !this.password.confirm) {
        toast.error("Please fill in all password fields.");
        return;
      }

      if (this.password.new.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }

      if (this.password.new !== this.password.confirm) {
        toast.error("Passwords do not match.");
        return;
      }

      try {
        await changePassword(this.auth.user.userId, {
          currentPassword: this.password.current,
          newPassword: this.password.new
        });

        // ===== PASSWORD CHANGED SUCCESSFULLY =====
        toast.success("Password updated successfully! Please login again.");

        // Delay 1.2s để người dùng đọc toast rồi logout
        setTimeout(() => {
          this.auth.logout();
        }, 1200);

      } catch (err) {
        if (err.response?.data?.message === "Current password is incorrect") {
          toast.error("Current password is incorrect!");
        } else {
          toast.error("Failed to change password.");
        }
      }
    }
    ,

    getInitial(name) {
      return name ? name.charAt(0).toUpperCase() : "?";
    },

    getColor(name) {
      const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];
      let hash = 0;
      for (let i = 0; i < (name || "").length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    },
  },
};
</script>

<style scoped>
.avatar-circle-large {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  font-size: 36px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

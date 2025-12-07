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
                                <i class="ti ti-chevron-left me-1 fs-14"></i> Doctor
                            </h6>
                        </div>

                        <div class="card">
                            <div class="card-body">

                                <form @submit.prevent="handleSubmit">
                                    <h5 class="fs-18 fw-bold mb-3">New Doctor</h5>

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
                                            <input :type="showConfirmPassword ? 'text' : 'password'"
                                                v-model="confirmPassword" class="form-control" required />
                                            <span class="input-group-text"
                                                @click="showConfirmPassword = !showConfirmPassword"
                                                style="cursor:pointer">
                                                <i :class="showConfirmPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                                            </span>
                                        </div>
                                        <small v-if="errors.confirmPassword" class="text-danger">{{
                                            errors.confirmPassword }}</small>
                                    </div>


                                    <!-- Phone -->
                                    <div class="mb-3">
                                        <label class="form-label">Phone *</label>
                                        <input v-model="form.phone" type="text" class="form-control" required />
                                        <small v-if="errors.phone" class="text-danger">{{ errors.phone }}</small>
                                    </div>


                                    <!-- DOB -->
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
                                        <label class="form-label">Gender</label>
                                        <select v-model="form.gender" class="form-control" required>
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>

                                    <!-- Address -->
                                    <!-- Address -->
                                    <div class="mb-3">
                                        <label class="form-label">Address *</label>

                                        <div class="row">
                                            <div class="col-md-6 mb-2">
                                                <select v-model="selectedProvince" @change="onProvinceChange"
                                                    class="form-control" :class="{ 'is-invalid': errors.address }">
                                                    <option value="">Select Province/City</option>
                                                    <option v-for="p in provinces" :key="p.matinhBNV"
                                                        :value="p.matinhBNV">
                                                        {{ p.tentinhmoi }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="col-md-6 mb-2">
                                                <select v-model="selectedWard" class="form-control"
                                                    :class="{ 'is-invalid': errors.address }">
                                                    <option value="">Select Ward</option>
                                                    <option v-for="w in wards" :key="w.maphuongxa"
                                                        :value="w.maphuongxa">
                                                        {{ w.tenphuongxa }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <small v-if="errors.address" class="text-danger">{{ errors.address }}</small>
                                    </div>



                                    <!-- Department -->
                                    <div class="mb-3">
                                        <label class="form-label">Department *</label>
                                        <select v-model="form.departmentId" class="form-control" required>
                                            <option value="">Select</option>

                                            <option v-for="dept in departments" :key="dept.departmentId"
                                                :value="dept.departmentId">
                                                {{ dept.name }}
                                            </option>

                                        </select>

                                    </div>

                                    <!-- Role -->
                                    <!-- <div class="mb-3">
                                        <label class="form-label">Role</label>
                                        <select v-model="form.roleId" class="form-control">
                                            <option value="4">Doctor</option>
                                        </select>
                                    </div> -->

                                    <div class="d-flex justify-content-end gap-2">
                                        <button type="button" class="btn btn-light" @click="handleCancel">
                                            Cancel
                                        </button>
                                        <button class="btn btn-primary">Add Doctor</button>
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
import { createDoctor } from "../services/doctorService";
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { getDepartments } from "../services/departmentService";
import vnAddress from "../data/vietnam-address-2024.json";
import { useToast } from "vue-toastification";





export default {
    name: 'AddDoctor',
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
                departmentId: "",
                roleId: 4
            },

            dobModel: null,
            today: new Date(),
            departments: [],
            showPassword: false,
            showConfirmPassword: false,
            confirmPassword: "",
            errors: {
                password: "",
                confirmPassword: "",
                phone: "",
            },
            selectedProvince: "",
            selectedWard: "",
            provinces: vnAddress,
            wards: [],



        };
    },
    async mounted() {
        try {
            const res = await getDepartments();
            this.departments = res.filter(d => d.status === "Active"); // ✔ chỉ hiện active
        } catch (err) {
            console.error("Failed to load departments", err);
        }
    }
    ,



    methods: {
        handleCancel() {
            this.$router.back();   // hoặc this.$router.push("/doctors")
        },


        buildAddress() {
            const province = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
            const ward = this.wards.find(w => w.maphuongxa === this.selectedWard);

            if (!province || !ward) return "";
            return `${ward.tenphuongxa}, ${province.tentinhmoi}`;
        },
        onProvinceChange() {
            const province = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
            this.wards = province ? province.phuongxa : [];
            this.selectedWard = "";
        },
        formatDOB(date) {
            if (!date) return "";
            const d = new Date(date);
            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        },



        formatDate(date) {
            if (!date) return null;

            const d = new Date(date);
            if (isNaN(d.getTime())) return null;  // <-- chống Invalid Date

            const month = (d.getMonth() + 1).toString().padStart(2, "0");
            const day = d.getDate().toString().padStart(2, "0");
            return `${d.getFullYear()}-${month}-${day}`;
        }
        ,

        async handleSubmit() {
            this.errors = { password: "", confirmPassword: "", phone: "", dob: "", address: "" };
            const toast = useToast();

            /* ===== PASSWORD ===== */
            if (!this.form.password || this.form.password.length < 6) {
                this.errors.password = "Password must be at least 6 characters.";
                return;
            }

            if (this.confirmPassword !== this.form.password) {
                this.errors.confirmPassword = "Passwords do not match.";
                return;
            }

            /* ===== PHONE ===== */
            if (!this.form.phone || this.form.phone.length < 10) {
                this.errors.phone = "Invalid phone number.";
                return;
            }

            /* ===== DOB ===== */
            if (!this.dobModel || this.dobModel === "" || this.dobModel === null) {
                this.errors.dob = "Date of birth is required.";
                return;
            }


            /* ===== ADDRESS ===== */
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
                    departmentId: Number(this.form.departmentId),
                    roleId: Number(this.form.roleId)
                };

                await createDoctor(payload);
                toast.success("Doctor created successfully!");
                this.$router.push("/doctors");

            } catch (error) {
                if (error.response?.status === 409 && error.response.data?.message === "EMAIL_IN_USE") {
                    toast.error("Email already exists!");
                } else {
                    toast.error("Failed to create doctor!");
                }
                console.error("API FAILED:", error);
            }
        }



    },

    computed: {
        avatarInitial() {
            if (!this.form.fullName) return "?";
            return this.form.fullName.charAt(0).toUpperCase();
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

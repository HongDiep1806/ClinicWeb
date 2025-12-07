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
                                <i class="ti ti-chevron-left me-1 fs-14"></i> Edit Doctor
                            </h6>
                        </div>

                        <div class="card">
                            <div class="card-body">

                                <form @submit.prevent="handleSubmit">
                                    <h5 class="fs-18 fw-bold mb-3">Doctor Information</h5>

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

                                    <!-- Phone -->
                                    <div class="mb-3">
                                        <label class="form-label">Phone *</label>
                                        <input v-model="form.phone" type="text" class="form-control" required />
                                        <small v-if="errors.phone" class="text-danger">{{ errors.phone }}</small>
                                    </div>

                                    <!-- DOB -->
                                    <div class="mb-3">
                                        <label class="form-label">Date of Birth</label>
                                        <VueDatePicker v-model="dobModel" type="date" :formats="{ input: 'dd.MM.yyyy' }"
                                            :time-config="{ enableTimePicker: false }" />

                                    </div>

                                    <!-- Gender -->
                                    <div class="mb-3">
                                        <label class="form-label">Gender</label>
                                        <select v-model="form.gender"  class="form-control">
                                            <option value="" disabled>Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>

                                    <!-- Address -->
                                    <!-- Address -->
                                    <div class="mb-3">
                                        <label class="form-label">Address</label>

                                        <div class="row">
                                            <!-- Province -->
                                            <div class="col-md-6 mb-2">
                                                <select v-model="selectedProvince" class="form-control"
                                                    @change="onProvinceChange">
                                                    <option value="" disabled>Select Province/City</option>
                                                    <option v-for="p in provinces" :key="p.matinhBNV"
                                                        :value="p.matinhBNV">
                                                        {{ p.tentinhmoi }}
                                                    </option>
                                                </select>
                                            </div>

                                            <!-- Ward -->
                                            <div class="col-md-6 mb-2">
                                                <select v-model="selectedWard" class="form-control">
                                                    <option value="" disabled>Select Ward</option>
                                                    <option v-for="w in wards" :key="w.maphuongxa"
                                                        :value="w.maphuongxa">
                                                        {{ w.tenphuongxa }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>


                                    <!-- Department -->
                                    <div class="mb-3">
                                        <label class="form-label">Department *</label>
                                        <select v-model="form.departmentId" class="form-control" required>
                                            <option value="" disabled>Select</option>

                                            <option v-for="dept in departments" :key="dept.departmentId"
                                                :value="dept.departmentId" :disabled="dept.status === 'Inactive'">
                                                {{ dept.name }}
                                                <span v-if="dept.status === 'Inactive'">(Inactive)</span>
                                            </option>

                                        </select>
                                    </div>

                                    <div class="d-flex justify-content-end gap-2">
                                        <button type="button" class="btn btn-light" @click="handleCancel">
                                            Cancel
                                        </button>
                                        <button class="btn btn-primary">Save Changes</button>
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
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import { getDepartments } from "../services/departmentService";
import { getAllDoctors } from "../services/doctorService";
import { editDoctor } from "../services/doctorService";
import vnAddress from "../data/vietnam-address-2024.json";
import { useToast } from "vue-toastification";
import { getUserById } from '../services/userService';



export default {
    name: 'EditDoctor',
    components: { Sidebar, Navbar, VueDatePicker },

    data() {
        return {
            form: {
                userId: null,
                fullName: "",
                gender: "",
                phone: "",
                address: "",
                email: "",
                departmentId: ""
            },

            dobModel: null,
            today: new Date(),
            departments: [],
            errors: {
                phone: "",
            },
            selectedProvince: "",
            selectedWard: "",
            provinces: vnAddress,
            wards: [],

        };
    },

    async mounted() {
        const doctorId = this.$route.params.id;
        this.userId = doctorId;
        await this.loadDepartments();
        console.log("PARAM ID =", this.$route.params.id);

        await this.loadDoctor(doctorId);

    },

    methods: {
        handleCancel() {
            this.$router.back();   // hoặc this.$router.push("/doctors")
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


        async loadDepartments() {
            const res = await getDepartments();

            // load doctor để biết khoa hiện tại
            const doctorId = this.$route.params.id;
            const doctorsRes = await getAllDoctors();
            const list = doctorsRes.data ?? doctorsRes;

            const doctor = list.find(d => d.userId == doctorId);
            const doctorDeptId = doctor?.departmentId;

            // Lấy tất cả khoa active + khoa hiện tại (dù inactive)
            this.departments = res.filter(d =>
                d.status === "Active" || d.departmentId === doctorDeptId
            );
        }
        ,

       async loadDoctor(id) {
    try {
        const res = await getUserById(id);
        const doctor = res.data;

        if (!doctor) {
            alert("Doctor not found");
            this.$router.push("/doctors");
            return;
        }

        // Gán form
        this.form = {
            userId: doctor.userId,
            fullName: doctor.fullName,
            gender: doctor.gender,
            phone: doctor.phone,
            address: doctor.address,
            email: doctor.email,
            departmentId: doctor.departmentId
        };

        // ===========================
        // FIX DOB — PARSE CHUẨN
        // ===========================
        if (doctor.dob) {
            const cleanDob = doctor.dob.replace(" ", "T");
            this.dobModel = new Date(cleanDob);
        } else {
            this.dobModel = null;
        }

        // ===========================
        // ADDRESS
        // ===========================
        if (doctor.address) {
            const parts = doctor.address.split(",").map(x => x.trim());
            const wardName = parts[0];
            const provinceName = parts[1];

            const province = this.provinces.find(p => p.tentinhmoi === provinceName);
            if (province) {
                this.selectedProvince = province.matinhBNV;
                this.wards = province.phuongxa;

                const ward = this.wards.find(w => w.tenphuongxa === wardName);
                if (ward) {
                    this.selectedWard = ward.maphuongxa;
                }
            }
        }

    } catch (err) {
        console.error("Failed to load doctor:", err);
        this.$router.push("/doctors");
    }
}

,


        formatDate(date) {
            if (!date) return null;
            const d = new Date(date);
            return `${d.getFullYear()}-${(d.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
        },

        async handleSubmit() {
    const toast = useToast();
    this.errors.phone = "";

    // -------- REQUIRED FIELDS --------
    if (!this.form.fullName || !this.form.email || !this.form.gender ||
        !this.form.phone || !this.selectedProvince || !this.selectedWard ||
        !this.form.departmentId) 
    {
        toast.error("Please fill in all required fields.");
        return;
    }

    // -------- PHONE --------
    if (this.form.phone.length < 10) {
        this.errors.phone = "Invalid phone number.";
        return;
    }

    const payload = {
        userId: this.form.userId,
        fullName: this.form.fullName,
        dob: this.dobModel ? this.formatDate(this.dobModel) : null,
        gender: this.form.gender,
        phone: this.form.phone,
        address: this.buildAddress(),
        email: this.form.email,
        departmentId: Number(this.form.departmentId)
    };

    try {
        await editDoctor(this.userId, payload);
        toast.success("Doctor updated successfully!");
        this.$router.push("/doctors");
    } catch (err) {
        if (err.response && err.response.status === 409) {
            toast.error("Email already exists. Please choose another.");
            return;
        }
        toast.error("Failed to update doctor.");
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
            return "#858796";
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
</style>

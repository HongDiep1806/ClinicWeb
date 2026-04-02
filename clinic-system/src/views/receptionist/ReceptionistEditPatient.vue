<template>
    <div class="main-wrapper">
        <NavbarReceptionist />
        <SidebarReceptionist />

        <div class="page-wrapper">
            <div class="content">
                <div class="row">
                    <div class="col-lg-10 mx-auto">

                        <div class="d-flex align-items-center mb-3">
                            <h6 class="fw-bold mb-0">
                                <i class="ti ti-chevron-left me-1 fs-14"></i> Edit Patient
                            </h6>
                        </div>

                        <div class="card">
                            <div class="card-body">

                                <form @submit.prevent="handleSubmit">
                                    <h5 class="fw-bold mb-3">Patient Information</h5>

                                    <!-- AVATAR -->
                                    <div class="mb-3 d-flex align-items-center">
                                        <label class="form-label me-3">Profile</label>
                                        <div class="avatar-circle" :style="{ backgroundColor: avatarColor }">
                                            {{ avatarInitial }}
                                        </div>
                                    </div>

                                    <!-- NAME -->
                                    <div class="mb-3">
                                        <label class="form-label">Full Name</label>
                                        <input v-model="form.fullName" class="form-control" required />
                                    </div>

                                    <!-- EMAIL (LOCK) -->
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input v-model="form.email" class="form-control" disabled />
                                    </div>

                                    <!-- PHONE -->
                                    <div class="mb-3">
                                        <label class="form-label">Phone</label>
                                        <input v-model="form.phone" class="form-control" />
                                        <small v-if="errors.phone" class="text-danger">{{ errors.phone }}</small>
                                    </div>

                                    <!-- DOB -->
                                    <div class="mb-3">
                                        <label class="form-label">Date of Birth</label>
                                        <VueDatePicker v-model="dobModel" :time-config="{ enableTimePicker: false }" />
                                    </div>

                                    <!-- GENDER -->
                                    <div class="mb-3">
                                        <label class="form-label">Gender</label>
                                        <select v-model="form.gender" class="form-control">
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>

                                    <!-- ADDRESS -->
                                    <div class="mb-3">
                                        <label class="form-label">Address</label>

                                        <div class="row">
                                            <div class="col-md-6 mb-2">
                                                <select v-model="selectedProvince" @change="onProvinceChange"
                                                    class="form-control">
                                                    <option value="">Province</option>
                                                    <option v-for="p in provinces" :key="p.matinhBNV"
                                                        :value="p.matinhBNV">
                                                        {{ p.tentinhmoi }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="col-md-6 mb-2">
                                                <select v-model="selectedWard" class="form-control">
                                                    <option value="">Ward</option>
                                                    <option v-for="w in wards" :key="w.maphuongxa"
                                                        :value="w.maphuongxa">
                                                        {{ w.tenphuongxa }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-end gap-2">
                                        <button type="button" class="btn btn-light" @click="handleCancel">
                                            Cancel
                                        </button>
                                        <button class="btn btn-primary">Save</button>
                                    </div>

                                </form>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="footer text-center bg-white p-2 border-top">
                <p class="mb-0">2025 © Clinic Management System</p>
            </div>
        </div>
    </div>
</template>

<script>
import NavbarReceptionist from "../../components/receptionist/NavbarReceptionist.vue";
import SidebarReceptionist from "../../components/receptionist/SidebarReceptionist.vue";
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import vnAddress from "../../data/vietnam-address-2024.json";
import { editPatient } from "../../services/patientService";
import { getUserById } from "../../services/userService";
import { useToast } from "vue-toastification";

export default {
    components: { NavbarReceptionist, SidebarReceptionist, VueDatePicker },

    data() {
        return {
            userId: null,
            form: {
                userId: null,
                fullName: "",
                gender: "",
                phone: "",
                email: "",
                address: ""
            },
            dobModel: null,
            selectedProvince: "",
            selectedWard: "",
            provinces: vnAddress,
            wards: [],
            errors: { phone: "" }
        };
    },

    async mounted() {
        this.userId = this.$route.params.id;
        await this.loadPatient(this.userId);
    },

    methods: {
        handleCancel() {
            this.$router.back();
        },

        async loadPatient(id) {
            try {
                const res = await getUserById(id);
                const p = res.data;

                this.form = {
                    userId: p.userId,
                    fullName: p.fullName,
                    gender: p.gender,
                    phone: p.phone,
                    email: p.email,
                    address: p.address
                };

                if (p.dob) {
                    const iso = p.dob.split("T")[0]
                    this.dobModel = new Date(iso)
                }
                if (p.address) {
                    const [wardName, provinceName] = p.address.split(",").map(x => x.trim())

                    const province = this.provinces.find(pr => pr.tentinhmoi === provinceName)

                    if (province) {
                        this.selectedProvince = province.matinhBNV
                        this.wards = province.phuongxa

                        const ward = this.wards.find(w => w.tenphuongxa === wardName)
                        if (ward) this.selectedWard = ward.maphuongxa
                    }
                }

            } catch {
                this.$router.push("/receptionist/patients");
            }
        },

        onProvinceChange() {
            const province = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
            this.wards = province ? province.phuongxa : [];
        },

        buildAddress() {
            const p = this.provinces.find(p => p.matinhBNV === this.selectedProvince);
            const w = this.wards.find(w => w.maphuongxa === this.selectedWard);
            return p && w ? `${w.tenphuongxa}, ${p.tentinhmoi}` : null;
        },

        formatDate(date) {
            return new Date(date).toISOString().split("T")[0];
        },

        async handleSubmit() {
            const toast = useToast();

            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(this.form.phone)) {
                this.errors.phone = "Invalid phone number";
                return;
            }

            try {
                await editPatient(this.userId, {
                    ...this.form,
                    dob: this.dobModel ? this.formatDate(this.dobModel) : null,
                    address: this.buildAddress()
                });

                toast.success("Updated successfully");
                this.$router.push("/receptionist/patients");

            } catch (e) {
                toast.error("Update failed");
                console.error(e);
            }
        }
    },

    computed: {
        avatarInitial() {
            return this.form.fullName?.charAt(0)?.toUpperCase() || "?";
        },
        avatarColor() {
            return "#858796";
        }
    }
};
</script>

<style scoped>
.avatar-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
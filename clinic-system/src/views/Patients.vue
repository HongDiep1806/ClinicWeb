<template>
    <div class="main-wrapper">
        <Navbar />
        <Sidebar />

        <div class="page-wrapper">
            <div class="content">

                <!-- Header -->
                <div class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                    <h4 class="fw-bold mb-0">
                        Patients List
                        <span class="badge badge-soft-primary fs-13 ms-2">
                            Total : {{ patients.length }}
                        </span>
                    </h4>

                    <router-link to="/add-patient" class="btn btn-primary fs-13">
                        <i class="ti ti-plus me-1"></i> New Patient
                    </router-link>
                </div>
                <div class="d-flex gap-2 mb-3">
                    <input v-model="searchText" type="text" class="form-control w-auto" placeholder="Search patient..."
                        style="max-width: 250px;" />
                    <select v-model="selectedStatus" class="form-select" style="max-width: 180px;">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>


                <!-- Table -->
                <div class="table-responsive">
                    <table class="table table-nowrap datatable">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-if="patients.length === 0">
                                <td colspan="5" class="text-center py-4">No data</td>
                            </tr>

                            <tr v-for="p in paginatedPatients" :key="p.userId">

                                <!-- PATIENT -->
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-circle me-2"
                                            :style="{ backgroundColor: getColor(p.fullName) }">
                                            {{ getInitial(p.fullName) }}
                                        </div>

                                        <div>
                                            <span class="fw-semibold">{{ p.fullName }}</span>
                                            <div class="text-muted fs-13">{{ p.gender }}</div>
                                        </div>
                                    </div>
                                </td>

                                <td>{{ p.email || 'N/A' }}</td>

                                <td>{{ p.phone || 'N/A' }}</td>
                                <td>{{ p.address || 'N/A' }}</td>

                                <!-- STATUS -->
                                <td>
                                    <span class="badge fs-13"
                                        :class="p.isActive ? 'badge-soft-success text-success' : 'badge-soft-danger text-danger'">
                                        {{ p.isActive ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                <!-- ACTION -->
                                <!-- ACTION -->
                                <td class="text-center">
                                    <div class="d-flex justify-content-center gap-2">

                                        <!-- View -->
                                        <button class="btn btn-sm btn-light border" title="View" @click="openView(p)">
                                            <i class="ti ti-eye"></i>
                                        </button>

                                        <!-- Edit -->
                                        <router-link :to="`/edit-patient/${p.userId}`" class="btn btn-sm btn-primary"
                                            title="Edit" v-if="p.status === 'Active'">
                                            <i class="ti ti-pencil"></i>
                                        </router-link>

                                        <!-- TOGGLE STATUS -->
                                        <button class="btn btn-sm"
                                            :class="p.status === 'Active' ? 'btn-danger' : 'btn-success'"
                                            @click="toggleStatus(p)"
                                            :title="p.status === 'Active' ? 'Deactivate' : 'Activate'">
                                            <i :class="p.status === 'Active' ? 'ti ti-ban' : 'ti ti-check'"></i>
                                        </button>

                                    </div>
                                </td>


                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-center mt-3">
                    <nav>
                        <ul class="pagination">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="currentPage--">Previous</button>
                            </li>

                            <li class="page-item" v-for="n in totalPages" :key="n"
                                :class="{ active: currentPage === n }">
                                <button class="page-link" @click="currentPage = n">{{ n }}</button>
                            </li>

                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button class="page-link" @click="currentPage++">Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>


            </div>

            <!-- Footer -->
            <div class="footer text-center bg-white p-2 border-top">
                <p class="mb-0">2025 © Preclinic</p>
            </div>
        </div>

        <!-- Delete Modal -->
        <div class="modal fade" id="delete_modal">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content">
                    <div class="modal-body text-center">
                        <div class="mb-3">
                            <span class="avatar avatar-lg bg-danger text-white">
                                <i class="ti ti-trash fs-24"></i>
                            </span>
                        </div>
                        <h5 class="fw-bold">Delete Confirmation</h5>
                        <p>Are you sure you want to delete?</p>
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
                            <button class="btn btn-danger" @click="confirmDelete">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- VIEW DETAILS MODAL -->
        <div class="modal fade" id="view_modal">
            <div class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">Patient Details</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body" v-if="selectedPatient">

                        <div class="d-flex align-items-center mb-3">
                            <div class="avatar-circle me-3"
                                :style="{ backgroundColor: getColor(selectedPatient.fullName) }">
                                {{ getInitial(selectedPatient.fullName) }}
                            </div>

                            <div>
                                <h6 class="fw-bold mb-0">{{ selectedPatient.fullName }}</h6>
                                <small class="text-muted">{{ selectedPatient.gender }}</small>
                            </div>
                        </div>

                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">Email</span>
                                <span>{{ selectedPatient.email }}</span>
                            </li>

                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">Phone</span>
                                <span>{{ selectedPatient.phone }}</span>
                            </li>

                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">Address</span>
                                <span>{{ selectedPatient.address || 'N/A' }}</span>
                            </li>

                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">DOB</span>
                                <span>{{ selectedPatient.dob ? selectedPatient.dob.split('T')[0] : 'N/A' }}</span>
                            </li>

                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">Status</span>
                                <span :class="selectedPatient.isActive ? 'text-success' : 'text-danger'">
                                    {{ selectedPatient.isActive ? 'Active' : 'Inactive' }}
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>


    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { getAllPatients, deletePatient } from "../services/patientService";
import { useToast } from "vue-toastification";
import { togglePatientStatus } from "../services/patientService";

export default {
    name: "Patients",

    components: { Navbar, Sidebar },

    data() {
        return {
            patients: [],
            deleteId: null,
            selectedPatient: null,
            deleteModal: null,
            viewModal: null,
            searchText: "",
            searchText: "",
            selectedStatus: "",
            currentPage: 1,
            pageSize: 10,
            selectedStatus: "",
            searchText: "",


        };
    },
    computed: {
        filteredPatients() {
            return this.patients.filter(p => {
                const matchName = p.fullName.toLowerCase().includes(this.searchText.toLowerCase());

                const matchStatus =
                    !this.selectedStatus ||
                    (this.selectedStatus === "Active" && p.isActive) ||
                    (this.selectedStatus === "Inactive" && !p.isActive);

                return matchName && matchStatus;
            });
        },

        totalPages() {
            return Math.ceil(this.filteredPatients.length / this.pageSize);
        },

        paginatedPatients() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredPatients.slice(start, start + this.pageSize);
        }
    },

    methods: {
        async loadPatients() {
            try {
                const res = await getAllPatients();
                this.patients = res.data.map(p => ({
                    ...p,
                    isActive: p.status === "Active"   
                }));

            } catch (e) {
                console.error("Failed to load patients:", e);
            }
        },

        openView(patient) {
            this.selectedPatient = patient;
            this.viewModal.show();
        },

        openDelete(id) {
            this.deleteId = id;
            this.deleteModal.show();
        },

        async confirmDelete() {
            const toast = useToast();
            try {
                await deletePatient(this.deleteId);

                // 🔥 LOAD LẠI DỮ LIỆU TỪ API – ĐÚNG LOGIC SOFT DELETE
                await this.loadPatients();

                toast.success("User deleted successfully");

                this.deleteModal.hide();
                this.deleteId = null;

            } catch (e) {
                toast.error("Delete failed");
                console.error("Delete failed:", e);
            }
        },

        getInitial(name) {
            return name ? name.charAt(0).toUpperCase() : "?";
        },

        getColor(name) {
            const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b", "#858796"];
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            return colors[Math.abs(hash) % colors.length];
        },
        async toggleStatus(user) {
            const toast = useToast();

            try {
                await togglePatientStatus(user.userId);

                toast.success(
                    user.status === "Active"
                        ? "User deactivated"
                        : "User activated"
                );

                await this.loadPatients();

            } catch (e) {
                toast.error("Failed to update status");
                console.error(e);
            }
        },

    },

    mounted() {
        this.loadPatients();

        // Lấy modal instance
        this.deleteModal = new bootstrap.Modal(document.getElementById("delete_modal"));
        this.viewModal = new bootstrap.Modal(document.getElementById("view_modal"));
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

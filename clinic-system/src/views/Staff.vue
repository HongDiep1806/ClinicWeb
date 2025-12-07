<template>
    <div class="main-wrapper">
        <Navbar />
        <Sidebar />

        <div class="page-wrapper">
            <div class="content">

                <!-- Header -->
                <div class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                    <h4 class="fw-bold mb-0">
                        Staff List
                        <span class="badge badge-soft-primary fs-13 ms-2">
                            Total : {{ staff.length }}
                        </span>
                    </h4>

                    <router-link to="/add-staff" class="btn btn-primary fs-13">
                        <i class="ti ti-plus me-1"></i> New Staff
                    </router-link>
                </div>

                <!-- SEARCH + FILTER -->
                <div class="d-flex gap-2 mb-3">
                    <input v-model="searchText" type="text" class="form-control w-auto"
                        placeholder="Search staff..." style="max-width: 250px;" />

                    <select v-model="selectedStatus" class="form-select" style="max-width: 180px;">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <!-- TABLE -->
                <div class="table-responsive">
                    <table class="table table-nowrap datatable">
                        <thead>
                            <tr>
                                <th>Staff</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-if="staff.length === 0">
                                <td colspan="6" class="text-center py-4">No staff found</td>
                            </tr>

                            <tr v-for="s in paginatedStaff" :key="s.userId">
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-circle me-2" :style="{ backgroundColor: getColor(s.fullName) }">
                                            {{ getInitial(s.fullName) }}
                                        </div>
                                        <div>
                                            <span class="fw-semibold">{{ s.fullName }}</span>
                                        </div>
                                    </div>
                                </td>

                                <td>{{ s.email }}</td>
                                <td>{{ s.phone }}</td>
                                <td>{{ s.address || 'N/A' }}</td>

                                <td>
                                    <span class="badge fs-13"
                                        :class="s.isActive ? 'badge-soft-success text-success' : 'badge-soft-danger text-danger'">
                                        {{ s.isActive ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                <!-- ACTION -->
                                <td class="text-center">
                                    <div class="d-flex justify-content-center gap-2">

                                        <!-- View -->
                                        <button @click="openView(s)" class="btn btn-sm btn-light border">
                                            <i class="ti ti-eye"></i>
                                        </button>

                                        <!-- Edit -->
                                        <router-link :to="`/edit-staff/${s.userId}`" class="btn btn-sm btn-primary"
                                            v-if="s.isActive">
                                            <i class="ti ti-pencil"></i>
                                        </router-link>

                                        <!-- Toggle Status -->
                                        <button @click="toggleStatus(s)" class="btn btn-sm"
                                            :class="s.isActive ? 'btn-danger' : 'btn-success'">
                                            <i :class="s.isActive ? 'ti ti-ban' : 'ti ti-check'"></i>
                                        </button>

                                    </div>
                                </td>

                            </tr>
                        </tbody>

                    </table>
                </div>

                <!-- PAGINATION -->
                <div class="d-flex justify-content-center mt-3">
                    <nav>
                        <ul class="pagination">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="currentPage--">Previous</button>
                            </li>

                            <li v-for="n in totalPages" :key="n" class="page-item" :class="{ active: currentPage === n }">
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

        <!-- VIEW MODAL -->
        <div class="modal fade" id="view_modal">
            <div class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="fw-bold">Staff Details</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body" v-if="selectedStaff">
                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">Name</span>
                                <span>{{ selectedStaff.fullName }}</span>
                            </li>

                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">Email</span>
                                <span>{{ selectedStaff.email }}</span>
                            </li>

                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">Phone</span>
                                <span>{{ selectedStaff.phone }}</span>
                            </li>

                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">Address</span>
                                <span>{{ selectedStaff.address }}</span>
                            </li>

                            <li class="list-group-item d-flex justify-content-between">
                                <span class="fw-semibold">Status</span>
                                <span :class="selectedStaff.isActive ? 'text-success' : 'text-danger'">
                                    {{ selectedStaff.isActive ? 'Active' : 'Inactive' }}
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
import { getAllStaff, toggleStaffStatus } from "../services/staffService";
import { useToast } from "vue-toastification";

export default {
    name: "StaffList",

    components: { Navbar, Sidebar },

    data() {
        return {
            staff: [],
            selectedStaff: null,
            searchText: "",
            selectedStatus: "",
            currentPage: 1,
            pageSize: 10,
            viewModal: null
        };
    },

    computed: {
        filteredStaff() {
            return this.staff.filter(s => {
                const matchName = s.fullName.toLowerCase().includes(this.searchText.toLowerCase());
                const matchStatus =
                    !this.selectedStatus ||
                    (this.selectedStatus === "Active" && s.isActive) ||
                    (this.selectedStatus === "Inactive" && !s.isActive);

                return matchName && matchStatus;
            });
        },

        paginatedStaff() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredStaff.slice(start, start + this.pageSize);
        },

        totalPages() {
            return Math.ceil(this.filteredStaff.length / this.pageSize);
        }
    },

    methods: {
        async loadStaff() {
            try {
                const res = await getAllStaff();
                this.staff = res.data.map(s => ({
                    ...s,
                    isActive: s.status === "Active"
                }));
            } catch (e) {
                console.error("Failed to load staff:", e);
            }
        },

        openView(s) {
            this.selectedStaff = s;
            this.viewModal.show();
        },

        async toggleStatus(s) {
            const toast = useToast();

            try {
                await toggleStaffStatus(s.userId);

                toast.success(s.isActive ? "Staff deactivated" : "Staff activated");
                this.loadStaff();
            } catch {
                toast.error("Failed to update status");
            }
        },

        getInitial(name) {
            return name ? name.charAt(0).toUpperCase() : "?";
        },

        getColor(name) {
            const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            return colors[Math.abs(hash) % colors.length];
        }
    },

    mounted() {
        this.loadStaff();
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

<template>
    <div class="main-wrapper">
        <Navbar />
        <Sidebar />

        <div class="page-wrapper">
            <div class="content">

                <!-- PAGE HEADER -->
                <div class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                    <h4 class="fw-bold mb-0">
                        Departments
                        <span class="badge badge-soft-primary fs-13 ms-2">
                            Total: {{ departments.length }}
                        </span>
                    </h4>

                    <button class="btn btn-primary fs-13" data-bs-toggle="modal" data-bs-target="#add_modal">
                        <i class="ti ti-plus me-1"></i> Add Department
                    </button>
                </div>


                <!-- Search + Sort -->
                <div class="d-flex gap-2 mb-3 flex-wrap">

                    <!-- SEARCH -->
                    <input v-model="searchText" type="text" class="form-control w-auto" placeholder="Search by name..."
                        style="max-width: 240px;" />

                    <!-- SORT -->
                    <select v-model="sortOption" class="form-select w-auto" style="max-width: 180px;">
                        <option value="az">Name A → Z</option>
                        <option value="za">Name Z → A</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                <!-- TABLE -->
                <div class="table-responsive">
                    <table class="table table-nowrap">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th class="text-center"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="d in paginatedDepartments" :key="d.departmentId">
                                <td class="fw-semibold">{{ d.name }}</td>
                                <td class="text-muted">{{ d.description || '—' }}</td>

                                <td class="text-end action-item">
                                    <a href="javascript:void(0);" data-bs-toggle="dropdown">
                                        <i class="ti ti-dots-vertical"></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end p-2">
                                        <li>
                                            <a class="dropdown-item" @click="openEdit(d)" data-bs-toggle="modal"
                                                data-bs-target="#edit_modal">
                                                Edit
                                            </a>
                                        </li>

                                        <li>
                                            <a class="dropdown-item text-danger" @click="departmentToDelete = d"
                                                data-bs-toggle="modal" data-bs-target="#delete_modal">
                                                Delete
                                            </a>
                                        </li>
                                    </ul>
                                </td>
                            </tr>

                            <tr v-if="filteredDepartments.length === 0">
                                <td colspan="3" class="text-center py-4 text-muted">No departments found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- PAGINATION -->
                <div class="d-flex justify-content-center mt-3">
                    <ul class="pagination">

                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="currentPage--">Previous</button>
                        </li>

                        <li class="page-item" v-for="n in totalPages" :key="n" :class="{ active: n === currentPage }">
                            <button class="page-link" @click="currentPage = n">{{ n }}</button>
                        </li>

                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="currentPage++">Next</button>
                        </li>

                    </ul>
                </div>

            </div>

            <!-- FOOTER -->
            <div class="footer text-center bg-white p-2 border-top">
                <p class="text-dark mb-0">2025 © Preclinic</p>
            </div>
        </div>

        <!-- ADD MODAL -->
        <div class="modal fade" id="add_modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">Add Department</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <label class="fw-semibold">Name</label>
                        <input v-model="newDept.name" class="form-control mb-3" />

                        <label class="fw-semibold">Description</label>
                        <textarea v-model="newDept.description" class="form-control" rows="3"></textarea>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button class="btn btn-primary" @click="createDepartment">Add</button>
                    </div>

                </div>
            </div>
        </div>

        <!-- EDIT MODAL -->
        <div class="modal fade" id="edit_modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">Edit Department</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <label class="fw-semibold">Name</label>
                        <input v-model="editModel.name" class="form-control mb-3" />

                        <label class="fw-semibold">Description</label>
                        <textarea v-model="editModel.description" class="form-control" rows="3"></textarea>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button class="btn btn-primary" @click="updateDepartment">Save</button>
                    </div>

                </div>
            </div>
        </div>

        <!-- DELETE MODAL -->
        <div class="modal fade" id="delete_modal">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content">

                    <div class="modal-body text-center">
                        <h5 class="fw-bold mb-1">Delete Department</h5>
                        <p class="text-muted">Are you sure?</p>

                        <div class="d-flex justify-content-center">
                            <button class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
                            <button class="btn btn-danger" @click="deleteDepartment" data-bs-dismiss="modal">
                                Yes, Delete
                            </button>
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
import { useToast } from "vue-toastification";
import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from "../services/departmentService";


export default {
    name: "Departments",
    components: { Navbar, Sidebar },

    data() {
        return {
            departments: [],

            searchText: "",
            sortOption: "az",

            newDept: { name: "", description: "" },
            editModel: {},

            departmentToDelete: null,

            currentPage: 1,
            pageSize: 8,

            toast: useToast(),
        };
    },
    watch: {
        searchText() {
            this.currentPage = 1;
        },
        sortOption() {
            this.currentPage = 1;
        }
    }
    ,

    computed: {
        filteredDepartments() {
            let list = [...this.departments];

            // search
            if (this.searchText) {
                const s = this.searchText.toLowerCase();
                list = list.filter(x => x.name.toLowerCase().includes(s));
            }

            // sort
            switch (this.sortOption) {
                case "az":
                    list.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "za":
                    list.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case "newest":
                    list.sort((a, b) => b.departmentId - a.departmentId);
                    break;
                case "oldest":
                    list.sort((a, b) => a.departmentId - b.departmentId);
                    break;
            }

            return list;
        },

        paginatedDepartments() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredDepartments.slice(start, start + this.pageSize);
        },

        totalPages() {
            return Math.ceil(this.filteredDepartments.length / this.pageSize);
        },
    },

    methods: {
        async loadDepartments() {
            try {
                const res = await getDepartments();
                this.departments = res; // res đã là array theo API thật
            } catch (err) {
                console.error(err);
                this.toast.error("Failed to load departments!");
            }
        },

        openEdit(d) {
            this.editModel = { ...d };
        },

        async createDepartment() {
            if (!this.newDept.name) return this.toast.error("Name required!");

            try {
                const res = await createDepartment(this.newDept);

                this.toast.success("Department added successfully!");
                const modal = bootstrap.Modal.getInstance(document.getElementById("add_modal"));
                if (modal) modal.hide();



                // reload dữ liệu mới từ API
                await this.loadDepartments();

                this.newDept = { name: "", description: "" };
            } catch (err) {
                console.error(err);
                this.toast.error("Failed to add department!");
            }
        },

        async updateDepartment() {
            try {
                await updateDepartment(this.editModel.departmentId, {
                    name: this.editModel.name,
                    description: this.editModel.description,
                });

                this.toast.success("Department updated successfully!");
                 const modal = bootstrap.Modal.getInstance(document.getElementById("edit_modal"));
                if (modal) modal.hide();

                await this.loadDepartments();

            } catch (err) {
                console.error(err);
                this.toast.error("Update department failed!");
            }
        },

       async deleteDepartment() {
    try {
        await deleteDepartment(this.departmentToDelete.departmentId);

        this.toast.success("Department deleted!");
        await this.loadDepartments();
    } catch (err) {
        const msg = err.response?.data?.error;

        if (msg === "This department still has assigned doctors.") {
            this.toast.error("Cannot delete: This department still has doctors.");
        } else {
            this.toast.error("Delete failed!");
        }
    }
}
,
    },

    mounted() {
        this.loadDepartments();
    },
};
</script>

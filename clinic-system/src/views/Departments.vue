<template>
  <div class="main-wrapper">
    <Navbar />
    <Sidebar />

    <div class="page-wrapper">
      <div class="content">

        <!-- HEADER -->
        <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <h4 class="fw-semibold mb-0 d-flex align-items-center">
            Departments
            <span class="badge badge-soft-primary fs-13 ms-2 px-2 py-1">
              Total : {{ departments.length }}
            </span>
          </h4>

          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add_modal">
            <i class="ti ti-plus me-1"></i> New Department
          </button>
        </div>

        <!-- SEARCH + FILTER -->
        <div class="d-flex gap-2 mb-3">

          <input v-model="searchText" type="text" class="form-control w-auto"
            placeholder="Search department..." style="max-width: 240px;" />

          <select v-model="selectedStatus" class="form-select" style="max-width: 150px;">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <!-- TABLE -->
        <div class="table-responsive">
          <table class="table table-nowrap">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in filteredDepartments" :key="item.departmentId">

                <td class="fw-semibold text-dark">{{ item.name }}</td>
                <td>{{ item.description }}</td>

                <td>
                  <span :class="statusClass(item.status)">
                    {{ item.status }}
                  </span>
                </td>

                <td class="action-item">
                  <a href="javascript:void(0);" data-bs-toggle="dropdown">
                    <i class="ti ti-dots-vertical"></i>
                  </a>

                  <ul class="dropdown-menu p-2">
                    <li>
                      <a class="dropdown-item" @click="openView(item)" data-bs-toggle="offcanvas"
                        data-bs-target="#view_details">
                        View
                      </a>
                    </li>

                    <li>
                      <a class="dropdown-item" @click="openEdit(item)" data-bs-toggle="modal"
                        data-bs-target="#edit_modal">
                        Edit
                      </a>
                    </li>

                    <li>
                      <a class="dropdown-item text-danger" @click="openToggle(item)" data-bs-toggle="modal"
                        data-bs-target="#toggle_modal">
                        {{ item.status === 'Active' ? 'Deactivate' : 'Activate' }}
                      </a>
                    </li>
                  </ul>
                </td>
              </tr>

              <tr v-if="departments.length === 0">
                <td colspan="4" class="text-center py-4 text-muted">
                  No departments found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <div class="footer text-center bg-white p-2 border-top">
        <p class="text-dark mb-0">2025 © Preclinic</p>
      </div>
    </div>
  </div>

  <!-- VIEW DETAILS -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="view_details">
    <div class="offcanvas-header d-block pb-0 px-0">
      <div class="border-bottom d-flex align-items-center justify-content-between pb-3 px-3">

        <h5 class="offcanvas-title fs-18 fw-bold">
          Department Details
          <span class="badge badge-soft-primary border pt-1 px-2 border-primary fw-medium ms-2">
            #{{ selectedDepartment?.departmentId }}
          </span>
        </h5>

        <button type="button" class="btn-close custom-btn-close opacity-100" data-bs-dismiss="offcanvas">
          <i class="ti ti-x bg-white fs-16 text-dark"></i>
        </button>
      </div>
    </div>

    <div class="offcanvas-body pt-3 px-3">
      <p class="fw-semibold text-dark">Name</p>
      <p>{{ selectedDepartment?.name }}</p>

      <p class="fw-semibold mt-3 text-dark">Description</p>
      <p>{{ selectedDepartment?.description }}</p>

      <p class="fw-semibold mt-3 text-dark">Status</p>
      <p>{{ selectedDepartment?.status }}</p>
    </div>
  </div>

  <!-- EDIT MODAL -->
  <div class="modal fade" id="edit_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" v-if="editModel">

        <div class="modal-header">
          <h5 class="modal-title fw-bold">
            Edit Department
            <span class="badge bg-primary ms-2">#{{ editModel?.departmentId }}</span>
          </h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">

          <div class="mb-3">
            <label class="fw-semibold">Name</label>
            <input type="text" class="form-control" v-model="editModel.name" />
          </div>

          <div class="mb-3">
            <label class="fw-semibold">Description</label>
            <textarea class="form-control" v-model="editModel.description"></textarea>
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary" @click="submitEdit">Save</button>
        </div>

      </div>
    </div>
  </div>

  <!-- TOGGLE MODAL -->
  <div class="modal fade" id="toggle_modal">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">

        <div class="modal-body text-center">
          <h5 class="fw-bold mb-1">
            {{ toggleTarget?.status === 'Active' ? 'Deactivate Department' : 'Activate Department' }}
          </h5>

          <p class="mb-3">
            Are you sure you want to
            {{ toggleTarget?.status === 'Active' ? 'deactivate' : 'activate' }}
            this department?
          </p>

          <div class="d-flex justify-content-center">
            <button class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-danger" @click="confirmToggle" data-bs-dismiss="modal">
              Yes, Continue
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ADD MODAL -->
  <div class="modal fade" id="add_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title fw-bold">Add New Department</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">

          <div class="mb-3">
            <label class="fw-semibold">Name *</label>
            <input type="text" class="form-control" v-model="addModel.name" />
          </div>

          <div class="mb-3">
            <label class="fw-semibold">Description</label>
            <textarea class="form-control" v-model="addModel.description"></textarea>
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary" @click="submitAdd">Create</button>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import {
  getDepartments,
  updateDepartment,
  toggleDepartmentStatus,
  createDepartment     // 👉 FIXED HERE
} from "../services/departmentService";

import { useToast } from "vue-toastification";

export default {
  name: "Departments",
  components: { Navbar, Sidebar },

  data() {
    return {
      departments: [],
      selectedDepartment: null,
      toggleTarget: null,
      editModel: null,

      addModel: {               // 👉 FIXED HERE
        name: "",
        description: ""
      },

      searchText: "",
      selectedStatus: "",

      toast: useToast(),
    };
  },

  mounted() {
    this.loadDepartments();
  },

  computed: {
    filteredDepartments() {
      return this.departments.filter((d) => {
        const matchText =
          !this.searchText ||
          d.name.toLowerCase().includes(this.searchText.toLowerCase());

        const matchStatus =
          !this.selectedStatus || d.status === this.selectedStatus;

        return matchText && matchStatus;
      });
    },
  },

  methods: {
    async loadDepartments() {
      try {
        const res = await getDepartments();
        this.departments = res;
      } catch (err) {
        console.error("Error loading departments:", err);
      }
    },

    statusClass(status) {
      switch (status) {
        case "Active":
          return "badge bg-success-subtle text-success fw-semibold";
        case "Inactive":
          return "badge bg-danger-subtle text-danger fw-semibold";
        default:
          return "badge bg-light text-dark";
      }
    },

    openView(item) {
      this.selectedDepartment = item;
    },

    openEdit(item) {
      this.editModel = { ...item };
    },

    async submitEdit() {
      try {
        await updateDepartment(this.editModel.departmentId, this.editModel);

        const dept = this.departments.find(
          (d) => d.departmentId === this.editModel.departmentId
        );

        if (dept) {
          dept.name = this.editModel.name;
          dept.description = this.editModel.description;
        }

        bootstrap.Modal.getInstance(
          document.getElementById("edit_modal")
        ).hide();

        this.toast.success("Department updated!");
      } catch (err) {
        console.error(err);
        this.toast.error("Failed to update department!");
      }
    },

    openToggle(item) {
      this.toggleTarget = item;
    },

    async confirmToggle() {
      try {
        await toggleDepartmentStatus(this.toggleTarget.departmentId);

        this.toggleTarget.status =
          this.toggleTarget.status === "Active" ? "Inactive" : "Active";

        this.toast.success("Status updated!");
      } catch (err) {
        console.error(err);

        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "UNKNOWN_ERROR";

        if (message === "DEPARTMENT_HAS_ACTIVE_DOCTORS") {
          this.toast.error("Cannot deactivate department: department still has active doctors.");
          return;
        }

        this.toast.error("Failed to update status!");
      }
    },

    async submitAdd() {
      if (!this.addModel.name.trim()) {
        this.toast.error("Department name is required!");
        return;
      }

      try {
        await createDepartment({
          name: this.addModel.name,
          description: this.addModel.description
        });

        await this.loadDepartments();

        bootstrap.Modal.getInstance(
          document.getElementById("add_modal")
        ).hide();

        this.addModel = { name: "", description: "" };

        this.toast.success("Department created!");

      } catch (err) {
        console.error(err);
        this.toast.error("Failed to create department!");
      }
    },
  }
};
</script>

<style>
.badge {
  font-size: 13px;
  padding: 6px 10px;
}

.action-item {
  text-align: right;
}

textarea {
  min-height: 80px;
}

.table tbody tr td {
  vertical-align: middle;
}
</style>

<template>
  <div class="main-wrapper">
    <Navbar />
    <Sidebar />

    <div class="page-wrapper">
      <div class="content">

        <!-- HEADER -->
        <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <h4 class="fw-semibold mb-0">Appointments</h4>
          <router-link to="/add-appointment" class="btn btn-primary">
            <i class="ti ti-plus me-1"></i> New Appointment
          </router-link>
        </div>
        <!-- SEARCH + FILTERS -->
        <div class="d-flex gap-2 mb-3">

          <!-- SEARCH -->
          <input v-model="searchText" type="text" class="form-control w-auto" placeholder="Search patient / doctor..."
            style="max-width: 240px;" />

          <!-- FILTER DEPARTMENT -->
          <select v-model="selectedDepartment" class="form-select" style="max-width: 200px;">
            <option value="">All Departments</option>
            <option v-for="d in departments" :key="d.departmentId" :value="d.name">
              {{ d.name }}
            </option>
          </select>

          <!-- FILTER STATUS (optional) -->
          <select v-model="selectedStatus" class="form-select" style="max-width: 150px;">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="NoShow">NoShow</option>
          </select>
          <input type="date" v-model="startDate" lang="en" :class="{ 'is-invalid': showDateError }" class="form-control w-auto" />

          <input type="date" v-model="endDate" lang="en" :class="{ 'is-invalid': showDateError }" class="form-control w-auto" />


        </div>


        <!-- TABLE -->
        <div class="table-responsive">
          <table class="table table-nowrap">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Location</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in paginatedAppointments" :key="item.appointmentId">

                <!-- DATE -->
                <td>{{ formatDate(item.date) }}</td>

                <!-- PATIENT -->
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar avatar-md bg-light rounded-circle me-2">
                      <i class="ti ti-user text-secondary"></i>
                    </div>
                    <span class="text-dark fw-semibold">{{ item.patientName }}</span>
                  </div>
                </td>

                <!-- DOCTOR -->
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar avatar-md bg-light rounded-circle me-2">
                      <i class="ti ti-stethoscope text-primary"></i>
                    </div>
                    <span class="fw-semibold">{{ item.doctorName }}</span>
                  </div>
                </td>

                <!-- DEPARTMENT -->
                <td>{{ item.departmentName }}</td>


                <!-- STATUS -->
                <td>
                  <span :class="statusClass(item.status)">
                    {{ item.status }}
                  </span>
                </td>

                <!-- ACTION MENU -->
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
                      <a class="dropdown-item text-danger" @click="openDelete(item)" data-bs-toggle="modal"
                        data-bs-target="#delete_modal">
                        Delete
                      </a>
                    </li>
                  </ul>
                </td>

              </tr>

              <!-- NO DATA -->
              <tr v-if="appointments.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
                  No appointments found.
                </td>
              </tr>

            </tbody>
          </table>
          <div class="d-flex justify-content-center mt-3">
            <nav>
              <ul class="pagination">

                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="currentPage--">Previous</button>
                </li>

                <li class="page-item" v-for="n in totalPages" :key="n" :class="{ active: currentPage === n }">
                  <button class="page-link" @click="currentPage = n">
                    {{ n }}
                  </button>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="currentPage++">Next</button>
                </li>

              </ul>
            </nav>
          </div>

        </div>

      </div>

      <div class="footer text-center bg-white p-2 border-top">
        <p class="text-dark mb-0">2025 © Preclinic</p>
      </div>

    </div>
  </div>
  <!-- VIEW APPOINTMENT DETAILS -->
  <!-- VIEW APPOINTMENT DETAILS -->
  <div class="offcanvas offcanvas-offset offcanvas-end" tabindex="-1" id="view_details">
    <div class="offcanvas-header d-block pb-0 px-0">
      <div class="border-bottom d-flex align-items-center justify-content-between pb-3 px-3">

        <h5 class="offcanvas-title fs-18 fw-bold">
          Appointment Details
          <span class="badge badge-soft-primary border pt-1 px-2 border-primary fw-medium ms-2">
            #AP{{ selectedAppointment?.appointmentId }}
          </span>
        </h5>

        <button type="button" class="btn-close custom-btn-close opacity-100" data-bs-dismiss="offcanvas">
          <i class="ti ti-x bg-white fs-16 text-dark"></i>
        </button>
      </div>
    </div>

    <div class="offcanvas-body pt-0 px-0">

      <!-- WHEN & WHERE -->
      <h6 class="bg-light py-2 px-3 fw-bold">When & Where</h6>
      <div class="px-3 my-4">

        <!-- DOCTOR -->
        <div class="bg-light p-3 mb-3 border rounded-3 d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-md me-2 bg-white rounded-circle">
              <i class="ti ti-stethoscope fs-20 text-primary"></i>
            </div>
            <span class="text-dark fw-semibold">
              {{ selectedAppointment?.doctorName }}
              <span class="text-body fs-13 fw-normal d-block">
                {{ selectedAppointment?.departmentName }}
              </span>

            </span>
          </div>
        </div>

        <!-- DATE -->
        <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Appointment On
          <span class="text-body fw-normal">
            {{ formatDateOnly(selectedAppointment?.date) }}
          </span>
        </p>

        <!-- CREATED AT -->
        <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Created At
          <span class="text-body fw-normal">
            {{ formatDateTime(selectedAppointment?.createdAt) }}
          </span>
        </p>

        <!-- STATUS -->
        <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Status
          <span class="text-body fw-normal">{{ selectedAppointment?.status }}</span>
        </p>

        <!-- DEPARTMENT -->
        <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Department
          <span class="text-body fw-normal">{{ selectedAppointment?.departmentName }}</span>
        </p>



      </div>
      <h6 class="bg-light py-2 px-3 fw-bold">Patient</h6>

      <div class="px-3 my-4">
        <!-- PATIENT -->
        <div class="mt-3 mb-4 px-3">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-md me-2 bg-light rounded-circle">
              <i class="ti ti-user text-secondary fs-20"></i>
            </div>
            <span class="text-dark fw-semibold">
              {{ selectedAppointment?.patientName }}
            </span>
          </div>
        </div>


        <!-- STATUS -->
        <!-- <p class="text-dark mb-3 fw-semibold d-flex justify-content-between">
          Status
          <span class="text-body fw-normal">{{ selectedAppointment?.status }}</span>
        </p> -->

      </div>

    </div>

  </div>


  <!-- DELETE CONFIRMATION MODAL -->
  <div class="modal fade" id="delete_modal">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-body text-center">

          <h5 class="fw-bold mb-1">Delete Confirmation</h5>
          <p class="mb-3">Are you sure want to delete?</p>

          <div class="d-flex justify-content-center">
            <button class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-danger" @click="confirmDelete" data-bs-dismiss="modal">
              Yes, Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
  <!-- EDIT APPOINTMENT MODAL -->
  <div class="modal fade" id="edit_modal" v-if="editModel">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title fw-bold">
            Edit Appointment
            <span class="badge bg-primary ms-2">#AP{{ editModel?.appointmentId }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">

          <!-- Doctor -->
          <div class="mb-3">
            <label class="fw-semibold">Doctor</label>
            <div class="form-control bg-light">
              {{ editModel?.doctorName }} — {{ editModel?.departmentName }}
            </div>
          </div>

          <!-- Patient -->
          <div class="mb-3">
            <label class="fw-semibold">Patient</label>
            <div class="form-control bg-light">
              {{ editModel?.patientName }}
            </div>
          </div>

          <!-- Date -->
          <div class="mb-3">
            <label class="fw-semibold">Appointment Date</label>
            <div class="form-control bg-light">
              {{ formatDateOnly(editModel?.date) }}
            </div>
          </div>

          <!-- Created At -->
          <div class="mb-3">
            <label class="fw-semibold">Created At</label>
            <div class="form-control bg-light">
              {{ formatDateTime(editModel?.createdAt) }}
            </div>
          </div>

          <!-- STATUS DROPDOWN -->
          <!-- STATUS DROPDOWN -->
          <div class="mb-3">
            <label class="fw-semibold">Status</label>
            <select class="form-select" v-model="editModel.status">
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="NoShow">NoShow</option>
            </select>
          </div>


        </div>

        <div class="modal-footer">
          <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary" @click="submitEdit">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  </div>


</template>

<script>
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { getAllAppointments } from "../services/appointmentService";
import { getDepartments } from "../services/departmentService";
import { getUserById } from "../services/userService";
import { updateAppointmentStatus } from "../services/appointmentService";
import { useToast } from "vue-toastification";



export default {
  name: "Appointments",
  components: { Navbar, Sidebar },

  data() {
    return {
      appointments: [],
      selectedAppointment: null,
      appointmentToDelete: null,
      departments: [],
      editModel: null,
      toast: useToast(),
      searchText: "",
      selectedDepartment: "",
      selectedStatus: "",
      currentPage: 1,
      pageSize: 10,
      startDate: "",
      endDate: "",
      showDateError: false,








    };
  },
  mounted() {
    this.loadAppointments();
    this.loadDepartments();
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {
    filteredAppointments() {

      const hasStart = !!this.startDate;
      const hasEnd = !!this.endDate;

      // Validate date range only once
      if (hasStart && hasEnd) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);

        if (start > end) {

          // Nếu chưa báo lỗi → báo 1 lần
          if (!this.showDateError) {
            this.toast.error("Start date must be earlier than End date.");
            this.showDateError = true;
          }

          return this.appointments;
        }
      }

      // Nếu ngày hợp lệ → reset cờ lỗi
      this.showDateError = false;

      return this.appointments.filter(a => {

        // SEARCH
        const matchText =
          !this.searchText ||
          a.patientName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          a.doctorName.toLowerCase().includes(this.searchText.toLowerCase());

        // DEPARTMENT
        const matchDept =
          !this.selectedDepartment ||
          a.departmentName === this.selectedDepartment;

        // STATUS
        const matchStatus =
          !this.selectedStatus || a.status === this.selectedStatus;

        // DATE RANGE
        let matchDate = true;

        if (hasStart) {
          matchDate = matchDate && new Date(a.date) >= new Date(this.startDate);
        }
        if (hasEnd) {
          matchDate = matchDate && new Date(a.date) <= new Date(this.endDate);
        }

        return matchText && matchDept && matchStatus && matchDate;
      });
    }



    ,
    paginatedAppointments() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredAppointments.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredAppointments.length / this.pageSize);
    }

  },

  methods: {

    openEdit(item) {
      this.editModel = { ...item };
    }
    ,
    async submitEdit() {
      try {
        await updateAppointmentStatus({
          appointmentId: this.editModel.appointmentId,
          status: this.editModel.status
        });

        // Cập nhật ngay UI
        const target = this.appointments.find(a => a.appointmentId === this.editModel.appointmentId);
        if (target) target.status = this.editModel.status;

        // Đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('edit_modal'));
        modal.hide();

        // TOAST SUCCESS
        this.toast.success("Appointment updated!");

      } catch (err) {
        console.error("Error updating status:", err);

        // TOAST ERROR
        this.toast.error("Update failed!");
      }
    }

    ,
    async loadDepartments() {
      try {
        const res = await getDepartments();
        this.departments = res;
      } catch (err) {
        console.error("Error loading departments:", err);
      }
    },
    getDepartmentName(id) {
      const dept = this.departments.find(d => d.departmentId === id);
      return dept ? dept.name : "N/A";
    }
    ,

    formatDateOnly(dateStr) {
      if (!dateStr) return "N/A";
      const d = new Date(dateStr);

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();

      return `${day}/${month}/${year}`;
    },

    formatDateTime(dateStr) {
      if (!dateStr) return "N/A";
      const d = new Date(dateStr);

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();

      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} – ${hours}:${minutes}`;
    },

    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB");
    },

    openDelete(item) {
      this.appointmentToDelete = item;
    },

    confirmDelete() {
      console.log("Deleting:", this.appointmentToDelete);
      // TODO: call delete API
    },

    async loadAppointments() {
      try {
        const res = await getAllAppointments();
        const appts = res.data;

        // load departments trước
        if (this.departments.length === 0) {
          const depRes = await getDepartments();
          this.departments = depRes;
        }

        // map thêm departmentName vào mỗi appointment
        const finalList = [];

        for (const a of appts) {
          try {
            // gọi API get user theo doctorId
            const userRes = await getUserById(a.doctorId);
            const doctor = userRes.data;

            const depId = doctor.departmentId;

            const dep = this.departments.find(d => d.departmentId === depId);

            finalList.push({
              ...a,
              departmentId: depId,
              departmentName: dep ? dep.name : "N/A"
            });
          } catch (err) {
            console.error("Cannot load doctor:", err);
            finalList.push({
              ...a,
              departmentId: null,
              departmentName: "N/A"
            });
          }
        }

        this.appointments = finalList;

      } catch (err) {
        console.error("Error loading appointments:", err);
      }
    }
    ,
    openView(item) {
      this.selectedAppointment = item;
    }
    ,


    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB");
    },

    statusClass(status) {
      switch (status) {
        case "Pending":
          return "badge bg-warning-subtle text-warning fw-semibold";

        case "Confirmed":
          return "badge bg-success-subtle text-success fw-semibold";

        case "Completed":
          return "badge bg-info-subtle text-info fw-semibold";

        case "Cancelled":
          return "badge bg-danger-subtle text-danger fw-semibold";

        case "NoShow":
          return "badge bg-secondary-subtle text-secondary fw-semibold";

        default:
          return "badge bg-light text-dark";
      }
    }


  },


};
</script>
<style>
.is-invalid {
  border-color: #dc3545 !important;
  background-color: #ffecec !important;
}
</style>

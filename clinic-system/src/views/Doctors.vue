<template>
  <div class="main-wrapper">
    <Navbar />
    <SideBar />

    <div class="page-wrapper">
      <div class="content">

        <!-- HEADER -->
        <div class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
          <div>
 <h4 class="fw-bold mb-0">
      Doctors
      <span class="badge bg-primary-subtle text-primary ms-2 px-2 py-1 fs-13">
        Total: {{ doctors.length }}
      </span>
    </h4>            
          </div>
          <router-link to="/add-doctor" class="btn btn-primary fs-13">
            <i class="ti ti-plus me-1"></i> Add Doctor
          </router-link>
        </div>

        <!-- FILTERS -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <input v-model="searchText" type="text" class="form-control w-auto" placeholder="Search doctor..." style="max-width:220px">
          <select v-model="selectedDepartment" class="form-select w-auto" style="max-width:200px">
            <option value="">All Departments</option>
            <option v-for="d in departments" :key="d.departmentId" :value="d.departmentId">{{ d.name }}</option>
          </select>
          <select v-model="selectedStatus" class="form-select w-auto" style="max-width:150px">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <!-- DOCTOR GRID -->
        <div class="row">
          <div v-for="d in paginatedDoctors" :key="d.userId" class="col-xl-4 col-md-6 mb-3">
            <div class="card doctor-card shadow-sm">
              <div class="card-body d-flex align-items-center">

                <!-- AVATAR -->
                <div class="doctor-avatar">
                  <div class="avatar-circle" :style="{ backgroundColor: getColor(d.fullName) }">
                    {{ getInitial(d.fullName) }}
                  </div>
                </div>

                <!-- INFO -->
                <div class="flex-fill">
                  <div class="d-flex align-items-center justify-content-between">
                    <h6 class="mb-0 fw-semibold">
                      {{ d.fullName }}
                      <i v-if="!d.isActive" class="ti ti-alert-circle text-danger ms-1" title="Inactive doctor"></i>
                    </h6>

                    <!-- DROPDOWN -->
                    <div class="dropdown">
                      <a href="#" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical"></i></a>
                      <ul class="dropdown-menu dropdown-menu-end">
                        <li v-if="d.isActive">
                          <router-link :to="`/edit-doctor/${d.userId}`" class="dropdown-item">
                            <i class="ti ti-edit me-1"></i> Edit
                          </router-link>
                        </li>
                        <li>
                          <button class="dropdown-item" @click="openToggleConfirm(d)" :disabled="loading">
                            <i :class="d.isActive ? 'ti ti-ban' : 'ti ti-check'"></i>
                            {{ d.isActive ? "Deactivate" : "Activate" }}
                          </button>
                        </li>
                        <li>
                          <button class="dropdown-item" @click="openView(d)">
                            <i class="ti ti-user"></i> View Details
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="text-muted fs-13">{{ d.email }}</div>
                  <div class="fs-13">Gender: {{ d.gender }}</div>
                  <div class="fs-13">Department: {{ d.departmentName || "N/A" }}</div>

                 <span class="badge fs-13 mt-1" :class="d.isActive ? 'badge-soft-success' : 'badge-soft-danger'">
  {{ d.isActive ? "Active" : "Inactive" }}
</span>


                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- PAGINATION -->
        <div class="d-flex justify-content-center mt-3">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage===1 }">
              <button class="page-link" @click="currentPage--">Previous</button>
            </li>
            <li v-for="n in totalPages" :key="n" class="page-item" :class="{ active: n===currentPage }">
              <button class="page-link" @click="currentPage=n">{{ n }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage===totalPages }">
              <button class="page-link" @click="currentPage++">Next</button>
            </li>
          </ul>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="footer text-center bg-white p-2 border-top">
        <p class="mb-0">2025 © Preclinic</p>
      </div>
    </div>

    <!-- VIEW MODAL -->
    <div class="modal fade" id="view_modal">
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Doctor Details</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedDoctor">
            <div class="d-flex align-items-center mb-3">
              <div class="avatar-circle me-3" :style="{ backgroundColor: getColor(selectedDoctor.fullName) }">{{ getInitial(selectedDoctor.fullName) }}</div>
              <div>
                <h6 class="fw-bold mb-0">{{ selectedDoctor.fullName }}</h6>
                <small class="text-muted">{{ selectedDoctor.gender }}</small>
              </div>
            </div>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between"><span>Email</span><span>{{ selectedDoctor.email }}</span></li>
              <li class="list-group-item d-flex justify-content-between"><span>Phone</span><span>{{ selectedDoctor.phone }}</span></li>
              <li class="list-group-item d-flex justify-content-between"><span>Address</span><span>{{ selectedDoctor.address }}</span></li>
              <li class="list-group-item d-flex justify-content-between"><span>Department</span><span>{{ selectedDoctor.departmentName }}</span></li>
              <li class="list-group-item d-flex justify-content-between"><span>Status</span><span :class="selectedDoctor.isActive?'text-success':'text-danger'">{{ selectedDoctor.isActive?"Active":"Inactive" }}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- ERROR MODAL -->
    <div class="modal fade" id="error_modal">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content p-3 text-center">
          <i class="ti ti-alert-triangle text-warning" style="font-size:48px"></i>
          <h5 class="fw-bold mt-2 mb-1">Action Failed</h5>
          <p class="text-muted mb-3">{{ errorMessage }}</p>
          <button class="btn btn-primary" data-bs-dismiss="modal">OK</button>
        </div>
      </div>
    </div>

    <!-- CONFIRM TOGGLE MODAL -->
    <div class="modal fade" id="toggle_modal">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-body text-center">
            <h5 class="fw-bold mb-2">{{ toggleTarget?.isActive?"Deactivate Doctor":"Activate Doctor" }}</h5>
            <p class="text-muted">{{ toggleTarget?.isActive?"Are you sure you want to deactivate this doctor?":"Restore this doctor to active status?" }}</p>
            <div class="d-flex justify-content-center">
              <button class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
              <button class="btn btn-primary" @click="confirmToggle" data-bs-dismiss="modal" :disabled="loading">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EMAIL MODAL -->
    <div class="modal fade" id="email_modal">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content p-3">
          <h5 class="fw-bold mb-2">Email Conflict</h5>
          <p class="text-muted fs-14">This email is already in use. Enter a new one to restore the doctor.</p>
          <label class="form-label mt-2">New Email</label>
          <input v-model="newEmail" type="email" class="form-control mb-2">
          <div class="text-end">
            <button class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" @click="confirmRestoreEmail">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING OVERLAY -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary"></div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import SideBar from "../components/Sidebar.vue";
import axiosInstance from "../api/axiosInstance";
import { getDepartments } from "../services/departmentService";
import { useToast } from "vue-toastification";
import {getAllDoctors} from "../services/doctorService";

export default {
  name: "Doctors",
  components:{Navbar,SideBar},
  data(){return{
    doctors:[],departments:[],selectedDoctor:null,
    searchText:"",selectedDepartment:"",selectedStatus:"",
    viewModal:null,errorModal:null,toggleModal:null,emailModal:null,
    toggleTarget:null,errorMessage:"",oldEmail:"",newEmail:"",
    currentPage:1,pageSize:9,loading:false
  }},
  computed:{
    filteredDoctors(){ return this.doctors.filter(d=>{
      const matchName=d.fullName.toLowerCase().includes(this.searchText.toLowerCase());
      const matchDept=!this.selectedDepartment||d.departmentId==this.selectedDepartment;
      const matchStatus=!this.selectedStatus||(this.selectedStatus==="Active"&&d.isActive)||(this.selectedStatus==="Inactive"&&!d.isActive);
      return matchName&&matchDept&&matchStatus;
    })},
    totalPages(){ return Math.ceil(this.filteredDoctors.length/this.pageSize)},
    paginatedDoctors(){ const start=(this.currentPage-1)*this.pageSize; return this.filteredDoctors.slice(start,start+this.pageSize)}
  },
  methods:{
    getInitial(name){return name?name.charAt(0).toUpperCase():"?"},
    getColor(name){const colors=["#4e73df","#1cc88a","#36b9cc","#f6c23e","#e74a3b","#858796"];let hash=0;for(let i=0;i<name.length;i++){hash=name.charCodeAt(i)+((hash<<5)-hash);}return colors[Math.abs(hash)%colors.length]},
    openView(doctor){this.selectedDoctor=doctor;this.viewModal.show()},
    openToggleConfirm(doctor){this.toggleTarget=doctor;this.toggleModal.show()},
    openError(msg){this.errorMessage=msg;this.errorModal.show()},
    async confirmToggle(){
      const toast=useToast();this.loading=true;
      try{
        const res=await axiosInstance.put(`/User/toggle-status/${this.toggleTarget.userId}`);
        toast.success(this.toggleTarget.isActive?"Doctor deactivated":"Doctor activated");
        await this.loadDoctors();
      }catch(err){
        const res=err.response;
        if(res?.status===409){
          const msg=res.data?.message;
          if(msg==="EMAIL_CONFLICT"){this.oldEmail=this.toggleTarget.email;this.emailModal.show();this.loading=false;return}
          if(msg==="DOCTOR_HAS_CONFIRMED_APPOINTMENTS"){this.openError("This doctor still has confirmed appointments. They must be completed or reassigned before deactivation.");this.loading=false;return}
          if(msg==="DOCTOR_HAS_PENDING_APPOINTMENTS"){this.openError("This doctor has pending appointments. Please cancel or reassign them.");this.loading=false;return}
          this.openError(msg||"Cannot update doctor status");this.loading=false;return
        }
        toast.error("Failed to update doctor status");
      }
      this.loading=false;
    },
    async confirmRestoreEmail(){
      const toast=useToast();
      try{
        await axiosInstance.put(`/User/restore-with-email/${this.toggleTarget.userId}`,{newEmail:this.newEmail});
        toast.success("Doctor restored successfully");
        this.newEmail="";this.emailModal.hide();await this.loadDoctors();
      }catch(err){if(err.response?.data==="EMAIL_IN_USE"){toast.error("Email already in use.");return}toast.error("Restore failed.");}
    },
    async loadDepartments(){this.departments=await getDepartments()},
    async loadDoctors() {
  const res = await getAllDoctors();
  console.log(res);

  const map = new Map();
  res.data.forEach(d => {
    if (!map.has(d.userId)) {
      map.set(d.userId, {
        ...d,
        // map trực tiếp từ API status
        isActive: d.status === "Active",
        departmentName: this.departments.find(x => x.departmentId == d.departmentId)?.name || "N/A"
      });
    }
  });

  this.doctors = [...map.values()];
}


  },
  async mounted(){
    this.viewModal=new bootstrap.Modal("#view_modal");
    this.errorModal=new bootstrap.Modal("#error_modal");
    this.toggleModal=new bootstrap.Modal("#toggle_modal");
    this.emailModal=new bootstrap.Modal("#email_modal");
    await this.loadDepartments();await this.loadDoctors();
  }
}
</script>

<style scoped>
.doctor-card{border-radius:10px}
.avatar-circle{width:55px;height:55px;border-radius:50%;font-size:22px;font-weight:bold;color:white;display:flex;align-items:center;justify-content:center}
.loading-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.6);display:flex;justify-content:center;align-items:center;z-index:9999}
.badge-soft-success{background:#e7f8ef;color:#28a745}
.badge-soft-danger{background:#fdeaea;color:#dc3545}
.dropdown-item i{margin-right:6px}
</style>

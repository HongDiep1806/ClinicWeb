<template>
    <!-- Begin Wrapper -->
    <div class="main-wrapper">

        <!-- Topbar Start -->
        <Navbar />
        <!-- Topbar End -->

        <!-- Search Modal -->
        <div class="modal fade" id="searchModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-transparent">
                    <div class="card shadow-none mb-0">
                        <div class="px-3 py-2 d-flex flex-row align-items-center" id="search-top">
                            <i class="ti ti-search fs-22"></i>
                            <input type="search" class="form-control border-0" placeholder="Search">
                            <button type="button" class="btn p-0" data-bs-dismiss="modal" aria-label="Close"><i
                                    class="ti ti-x fs-22"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidenav Menu Start -->
        <SideBar />
        <!-- Sidenav Menu End -->

        <!-- ========================
			Start Page Content
		========================= -->

        <div class="page-wrapper">

            <!-- Start Content -->
            <div class="content">

                <!-- Start Page Header -->
                <div class="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3">
                    <div class="flex-grow-1">
                        <h4 class="fw-bold mb-0"> Doctor Grid <span
                                class="badge badge-soft-primary fs-13 fw-medium ms-2">Total Doctors : 565</span></h4>
                    </div>
                    <div class="text-end d-flex">
                        <!-- <div class="dropdown me-2">
                            <a href="javascript:void(0);"
                                class="btn btn-white bg-white fs-14 py-1 border d-inline-flex text-dark align-items-center"
                                data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                <i class="ti ti-filter text-gray-5 me-1"></i>Filters
                            </a>
                            <div class="dropdown-menu dropdown-lg dropdown-menu-end filter-dropdown p-0"
                                id="filter-dropdown">
                                <div
                                    class="d-flex align-items-center justify-content-between border-bottom filter-header">
                                    <h4 class="mb-0">Filter</h4>
                                    <div class="d-flex align-items-center">
                                        <a href="javascript:void(0);"
                                            class="link-danger text-decoration-underline">Clear All</a>
                                    </div>
                                </div>
                                <form action="#">
                                    <div class="filter-body pb-0">
                                        <div class="mb-3">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <label class="form-label">Doctor</label>
                                                <a href="javascript:void(0);" class="link-primary mb-1">Reset</a>
                                            </div>
                                            <select class="select2" multiple="multiple">
                                                <option value="m-1" selected>Dr. Mick Thompson</option>
                                                <option value="m-2">Dr. Sarah Johnson</option>
                                                <option value="m-3">Dr. Emily Carter</option>
                                                <option value="m-4">Dr. David Lee</option>
                                                <option value="m-5">Dr. Anna Kim</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <label class="form-label">Designation</label>
                                                <a href="javascript:void(0);" class="link-primary mb-1">Reset</a>
                                            </div>
                                            <select class="select2" multiple="multiple">
                                                <option value="m-1" selected>Cardiologist</option>
                                                <option value="m-2">Orthopedic Surgeon</option>
                                                <option value="m-3">Pediatrician</option>
                                                <option value="m-4">Gynecologist</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <label class="form-label">Department</label>
                                                <a href="javascript:void(0);" class="link-primary mb-1">Reset</a>
                                            </div>
                                            <select class="select2" multiple="multiple">
                                                <option value="m-1" selected>Cardiology</option>
                                                <option value="m-2">Orthopedics</option>
                                                <option value="m-3">Pediatrics</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label mb-1 text-dark fs-14 fw-medium">Date<span
                                                    class="text-danger">*</span></label>
                                            <div class="input-icon-end position-relative">
                                                <input type="text" class="form-control datetimepicker"
                                                    placeholder="dd/mm/yyyy">
                                                <span class="input-icon-addon">
                                                    <i class="ti ti-calendar"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <label class="form-label">Amount</label>
                                                <a href="javascript:void(0);" class="link-primary mb-1">Reset</a>
                                            </div>
                                            <select class="select2" multiple="multiple">
                                                <option value="m-1" selected>$501 - $1000</option>
                                                <option value="m-2">$501 - $1100</option>
                                                <option value="m-3">$701 - $1200</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <label class="form-label">Status</label>
                                                <a href="javascript:void(0);" class="link-primary mb-1">Reset</a>
                                            </div>
                                            <select class="select2" multiple="multiple">
                                                <option value="m-1" selected>Available</option>
                                                <option value="m-2">Unavailable</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="filter-footer d-flex align-items-center justify-content-end border-top">
                                        <a href="javascript:void(0);" class="btn btn-light btn-md me-2"
                                            id="close-filter">Close</a>
                                        <button type="submit" class="btn btn-primary btn-md">Filter</button>
                                    </div>
                                </form>
                            </div>
                        </div> -->

                        <router-link to="/add-doctor" class="btn btn-primary ms-2 fs-13 btn-md">
                            <i class="ti ti-plus me-1"></i> New Doctor
                        </router-link>


                    </div>
                </div>
                <!-- End Page Header -->

                <div class="row">

                    <div class="col-xl-4 col-md-6" v-for="doctor in doctors" :key="doctor.id">
                        <div class="card">
                            <div class="card-body d-flex align-items-center flex-sm-nowrap flex-wrap row-gap-3">
                                <div class="doctor-avatar-wrapper">
                                    <div class="avatar-circle-list"
                                        :style="{ backgroundColor: getColor(doctor.fullName) }">
                                        <span class="avatar-initial-list">{{ getInitial(doctor.fullName) }}</span>
                                    </div>
                                </div>


                                <div class="flex-fill">
                                    <div class="d-flex align-items-center justify-content-between mb-1">
                                        <h6 class="mb-0 fw-semibold"><a href="doctor-details.html">{{ doctor.fullName
                                        }}</a></h6>
                                        <div class="action-item">
                                            <a href="javascript:void(0);" data-bs-toggle="dropdown">
                                                <i class="ti ti-dots-vertical"></i>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <router-link :to="`/edit-doctor/${doctor.userId}`"
                                                        class="dropdown-item d-flex align-items-center">
                                                        Edit
                                                    </router-link>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);"
                                                        class="dropdown-item d-flex align-items-center"
                                                        data-bs-toggle="modal" data-bs-target="#delete_modal">Delete</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <span class="d-block mb-2 fs-13">{{ doctor.email }}</span>
                                    <p class="mb-2 fs-13">Gender : {{ doctor.gender }}</p>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h6 class="text-primary fs-14 mb-0"><span
                                                class="text-muted fs-13 fw-normal">Address : </span> {{ doctor.address
                                            }}</h6>
                                        <a href="appointment-calendar.html"
                                            class="avatar avatar-xs border text-muted fs-14"><i
                                                class="ti ti-calendar-cog"></i></a>
                                    </div>
                                </div>
                            </div><!-- end card body -->
                        </div><!-- end card -->
                    </div><!-- end col -->
                </div>

                <div class="text-center">
                    <a href="#" class="btn btn-white bg-white text-dark fs-13">Load More<span
                            class="spinner-border spinner-border-sm ms-1"></span></a>
                </div>

            </div>
            <!-- End Content -->

            <!-- Footer Start -->
            <div class="footer text-center bg-white p-2 border-top">
                <p class="text-dark mb-0">2025 &copy; <a href="javascript:void(0);" class="link-primary">Preclinic</a>,
                    All Rights Reserved</p>
            </div>
            <!-- Footer End -->

        </div>

        <!-- ========================
			End Page Content
		========================= -->

        <!-- Start Delete Modal  -->
        <div class="modal fade" id="delete_modal">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content">
                    <div class="modal-body text-center position-relative z-1">
                        <img src="/img/bg/delete-modal-bg-01.png" alt=""
                            class="img-fluid position-absolute top-0 start-0 z-n1">
                        <img src="/img/bg/delete-modal-bg-02.png" alt=""
                            class="img-fluid position-absolute bottom-0 end-0 z-n1">
                        <div class="mb-3">
                            <span class="avatar avatar-lg bg-danger text-white"><i class="ti ti-trash fs-24"></i></span>
                        </div>
                        <h5 class="fw-bold mb-1">Delete Confirmation</h5>
                        <p class="mb-3">Are you sure want to delete?</p>
                        <div class="d-flex justify-content-center">
                            <a href="javascript:void(0);" class="btn btn-light position-relative z-1 me-3"
                                data-bs-dismiss="modal">Cancel</a>
                            <a href="doctors.html" class="btn btn-danger position-relative z-1">Yes, Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Delete Modal  -->

        <!-- Start Delete Modal  -->
        <div class="modal fade" id="success_modal">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content">
                    <div class="modal-body text-center position-relative z-1">
                        <div class="mb-3">
                            <span class="avatar avatar-lg bg-success text-white"><i
                                    class="ti ti-check fs-24"></i></span>
                        </div>
                        <h5 class="fw-bold mb-1">Added Successfully</h5>
                        <p class="mb-3">Doctor has been added to your List</p>
                        <div class="d-flex justify-content-center">
                            <a href="javascript:void(0);" class="btn btn-light position-relative z-1 me-3"
                                data-bs-dismiss="modal">Cancel</a>
                            <a href="doctor-details.html" class="btn btn-primary position-relative z-1">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Delete Modal  -->

    </div>
    <!-- End Wrapper -->
</template>
<script>
import SideBar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
import router from '../router';
export default {
    name: 'Doctors',
    components: {
        SideBar, Navbar
    },
    data() {
        return {
            doctors: []
        }
    },
    methods: {
        async doctorList() {
            await axiosInstance.get('/User/get-all-doctors')
                .then(response => {
                    this.doctors = response.data;
                })
                .catch(error => {
                    console.error('Load doctors failed:', error);
                });
        },
        // Lấy chữ cái đầu
        getInitial(name) {
            if (!name) return "?";
            return name.charAt(0).toUpperCase();
        },

        // Tạo màu avatar ổn định từ tên
        getColor(name) {
            if (!name) return "#6c757d";
            const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b", "#858796"];
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            return colors[Math.abs(hash) % colors.length];
        }

    },
    mounted() {
        this.doctorList();
    }
}
</script>
<style>
.avatar-circle-list {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    font-size: 22px;
    font-weight: bold;
    color: white;
}

.avatar-initial-list {
    transform: translateY(2px);
}

.doctor-avatar-wrapper {
    margin-right: 20px;
    /* giống khoảng cách của template */
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-circle-list {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    font-size: 22px;
    font-weight: 600;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-initial-list {
    transform: translateY(1px);
}
</style>
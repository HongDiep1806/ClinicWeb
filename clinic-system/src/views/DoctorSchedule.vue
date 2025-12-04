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
        <Sidebar />
        <!-- Sidenav Menu End -->

        <!-- ========================
			Start Page Content
		========================= -->

        <div class="page-wrapper">

            <!-- Start Content -->
            <div class="content">

                <!-- Start Page Header -->
                <div class="d-flex align-items-sm-center flex-sm-row flex-column gap-2 mb-3 pb-3 border-bottom">
                    <div class="flex-grow-1">
                        <h4 class="fw-bold mb-0"> Doctor Schedule<span
                                class="badge badge-soft-primary fs-13 fw-medium ms-2">Total Doctors : 565</span></h4>
                    </div>
                    <div class="text-end d-flex">
                        <!-- dropdown-->
                        <div class="dropdown me-1">
                            <a href="javascript:void(0);"
                                class="btn btn-md fs-14 fw-normal border bg-white rounded text-dark d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                Export<i class="ti ti-chevron-down ms-2"></i>
                            </a>
                            <ul class="dropdown-menu p-2">
                                <li>
                                    <a class="dropdown-item" href="#">Download as PDF</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#">Download as Excel</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- End Page Header -->



                <div class="table-responsive">
                    <table class="table table-nowrap datatable">
                        <thead class="thead-light">
                            <tr>
                                <th>Doctor</th>
                                <th>Department</th>
                                <th>Phone</th>
                                <!-- <th>Availability</th> -->
                                <th></th>
                            </tr>
                        </thead>
                        <!-- <tbody>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-01.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. Mick Thompson</a></h6>
                                            <span class="fs-13 d-block"> Cardiologist </span>
                                        </div>
                                    </div>
                                </td>
                                <td>Cardiology </td>
                                <td>+1 54554 54584</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio1" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio1">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio2" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio2">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio3">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio3">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio4" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio4">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio5" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio5">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio6">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio6">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio7">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio7">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-02.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. Sarah Johnson</a></h6>
                                            <span class="fs-13 d-block"> Orthopedic Surgeon </span>
                                        </div>
                                    </div>
                                </td>
                                <td>Orthopedics</td>
                                <td>+1 43554 54584</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio-2" id="btnradio8" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio8">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio-2" id="btnradio9" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio9">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio-2" id="btnradio10">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio10">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio-2" id="btnradio11" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio11">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio-2" id="btnradio12" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio12">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio-2" id="btnradio13">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio13">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio-2" id="btnradio14">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio14">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-03.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. Emily Carter</a></h6>
                                            <span class="fs-13 d-block"> Pediatrician </span>
                                        </div>
                                    </div>
                                </td>
                                <td>Pediatrics</td>
                                <td>+1 471254 54585</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio15" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio15">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio16" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio16">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio17">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio17">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio18" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio18">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio19" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio19">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio20">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio20">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio21">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio21">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-04.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. David Lee</a></h6>
                                            <span class="fs-13 d-block">Gynecologist</span>
                                        </div>
                                    </div>
                                </td>
                                <td>Gynecology</td>
                                <td>+1 54114 54586</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio22" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio22">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio23" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio23">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio24">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio24">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio25" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio25">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio26" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio26">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio27">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio27">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio28">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio28">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-05.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. Anna Kim</a></h6>
                                            <span class="fs-13 d-block">Psychiatrist</span>
                                        </div>
                                    </div>
                                </td>
                                <td>Psychiatry</td>
                                <td>+1 51247 54587</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio29" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio29">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio30" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio30">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio31">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio31">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio32" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio32">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio33" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio33">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio34">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio34">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio35">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio35">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-06.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. John Smith</a></h6>
                                            <span class="fs-13 d-block">Neurosurgeon</span>
                                        </div>
                                    </div>
                                </td>
                                <td>Neurology</td>
                                <td>+1 41452 54588</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio36" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio36">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio37" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio37">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio38">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio38">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio39" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio39">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio40" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio40">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio41">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio41">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio42">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio42">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-07.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. Lisa White</a></h6>
                                            <span class="fs-13 d-block">Oncologist</span>
                                        </div>
                                    </div>
                                </td>
                                <td>Oncologist</td>
                                <td>+1 51425 54589</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio43" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio43">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio44" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio44">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio45">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio45">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio46" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio46">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio47" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio47">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio48">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio48">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio49">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio49">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-08.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. Patricia Brown</a></h6>
                                            <span class="fs-13 d-block">Pulmonologist</span>
                                        </div>
                                    </div>
                                </td>
                                <td>Pulmonologist</td>
                                <td>+1 42565 54590</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio50" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio50">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio51" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio51">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio52">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio52">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio53" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio53">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio54" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio54">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio55">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio55">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio56">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio56">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-09.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. Rachel Green</a></h6>
                                            <span class="fs-13 d-block">Urologist</span>
                                        </div>
                                    </div>
                                </td>
                                <td>Urologist</td>
                                <td>+1 45214 54591</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio57" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio57">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio58" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio58">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio59">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio59">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio60" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio60">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio61" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio61">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio62">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio62">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio63">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio63">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <a href="doctor-details.html" class="avatar me-2">
                                            <img src="/img/doctors/doctor-09.jpg" alt="Doctor" class="rounded-circle">
                                        </a>
                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold"><a href="doctor-details.html">Dr. Michael Smith</a></h6>
                                            <span class="fs-13 d-block">Cardiologist</span>
                                        </div>
                                    </div>
                                </td>
                                <td>Cardiologist</td>
                                <td>+1 41245 54592</td>
                                <td>
                                    <div class="availabity-check d-flex align-items-center gap-2" role="group" aria-label="Basic radio toggle button group">
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio64" checked="">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio64">M</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio65" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio65">T</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio66">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio66">W</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio67" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio67">T</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio68" checked>
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio68">F</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio69">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio69">S</label>
                                        </div>   
                                        <div>
                                            <input type="checkbox" class="btn-check" name="btnradio" id="btnradio70">
                                            <label class="btn btn-icon btn-sm rounded-circle btn-light" for="btnradio70">S</label>
                                        </div>   
                                    </div>
                                </td>
                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <a href="appointment-calendar.html">
                                            <i class="ti ti-calendar-cog"></i>
                                        </a>
                                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#doctor_detil">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        </tbody> -->
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="4" class="text-center py-4">
                                    Loading...
                                </td>
                            </tr>

                            <tr v-for="doc in doctors" :key="doc.userId">
                                <td>
                                    <div class="d-flex align-items-center">
                                        <!-- <span class="avatar me-2">
                                            <img :src="doc.avatarUrl || '/img/default-avatar.png'" alt="Doctor"
                                                class="rounded-circle" />
                                        </span> -->
                                        <div class="avatar avatar-lg rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold me-2"
                                            :style="{ backgroundColor: getColor(doc.fullName), width: '45px', height: '45px', fontSize: '16px' }">
                                            {{ getInitial(doc.fullName) }}
                                        </div>

                                        <div>
                                            <h6 class="mb-1 fs-14 fw-semibold">{{ doc.fullName }}</h6>
                                            <span class="fs-13">{{ doc.departmentName }}</span>
                                        </div>
                                    </div>
                                </td>

                                <td>{{ doc.departmentName }}</td>
                                <td>{{ doc.phone || 'N/A' }}</td>

                                <!-- <td>
                                    <span class="badge bg-success">Active</span>
                                </td> -->

                                <td>
                                    <div class="action-item d-flex align-items-center gap-2">
                                        <!-- <a href="javascript:void(0);"><i class="ti ti-calendar-cog"></i></a> -->
                                        <a href="javascript:void(0);" @click="openScheduleModal(doc)">
                                            <i class="ti ti-eye"></i>
                                        </a>

                                    </div>
                                </td>
                            </tr>
                        </tbody>


                    </table>
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

        <!-- Start Edit Modal -->
        <!-- Start Edit Schedule Modal -->
        <div id="doctor_schedule_modal" class="modal fade">
            <div class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content p-3">

                    <!-- Header -->
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Doctor Schedule</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <!-- Body -->
                    <!-- Doctor Info -->
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Doctor</label>
                        <input type="text" class="form-control" :value="selectedDoctor.fullName" disabled />
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Status</label>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" v-model="schedules[activeDay].isAssigned">
                            <span v-if="schedules[activeDay].isAssigned"
                                class="text-success fw-bold ms-2">Assigned</span>
                            <span v-else class="text-danger fw-bold ms-2">Not Assigned</span>
                        </div>
                    </div>


                    <!-- DAY BUTTONS -->
                    <div class="d-flex gap-2 mb-3">
                        <button v-for="d in days" :key="d" class="btn"
                            :class="activeDay === d ? 'btn-primary' : 'btn-light'" @click="activeDay = d">
                            {{ d }}
                        </button>
                    </div>

                    <!-- SCHEDULE AREA -->
                    <div class="border rounded p-3">

                        <!-- STATUS -->
                        <p v-if="!schedules[activeDay].scheduleId" class="text-danger">
                            Not Assigned
                        </p>
                        <p v-else class="text-success">
                            Assigned
                        </p>
                        <!-- Start Time -->
                        <div class="mb-3">
                            <label class="form-label">Start Time</label>
                            <input type="time" class="form-control" v-model="schedules[activeDay].startTime"
                                :disabled="!schedules[activeDay].isAssigned">
                        </div>

                        <!-- End Time -->
                        <div class="mb-3">
                            <label class="form-label">End Time</label>
                            <input type="time" class="form-control" v-model="schedules[activeDay].endTime"
                                :disabled="!schedules[activeDay].isAssigned">
                        </div>

                        <!-- Room -->
                        <div class="mb-3">
                            <label class="form-label">Room Number</label>
                            <input type="text" class="form-control" v-model="schedules[activeDay].roomNumber" disabled>
                        </div>

                    </div>


                    <!-- Footer -->
                    <div class="modal-footer">
                        <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button class="btn btn-primary" @click="saveSchedule">Save</button>
                    </div>

                </div>
            </div>
        </div>

        <!-- End Edit Modal -->

    </div>
    <!-- End Wrapper -->

</template>
<script>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import { getAllDoctors } from '../services/doctorService'
import { getDepartments } from '../services/departmentService'
import {
    createSchedule,
    getScheduleByDoctor,
    deleteSchedule
} from "../services/scheduleService";
import { useToast } from "vue-toastification";



export default {
    name: 'DoctorSchedule',

    components: {
        Sidebar,
        Navbar
    },

    data() {
        return {
            doctors: [],
            departments: [],
            loading: false,

            selectedDoctor: {},

            schedule: {
                doctorId: null,
                dayOfWeek: "",
                startTime: "",
                endTime: "",
                roomNumber: ""
            },
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],

            activeDay: "Monday",

            schedules: {
                Monday: { scheduleId: null, isAssigned: false, startTime: "07:00", endTime: "19:00", roomNumber: "" },
                Tuesday: { scheduleId: null, isAssigned: false, startTime: "07:00", endTime: "19:00", roomNumber: "" },
                Wednesday: { scheduleId: null, isAssigned: false, startTime: "07:00", endTime: "19:00", roomNumber: "" },
                Thursday: { scheduleId: null, isAssigned: false, startTime: "07:00", endTime: "19:00", roomNumber: "" },
                Friday: { scheduleId: null, isAssigned: false, startTime: "07:00", endTime: "19:00", roomNumber: "" }
            },



        };
    },


    async created() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;

                // Gọi API song song
                const [doctorRes, deptRes] = await Promise.all([
                    getAllDoctors(),
                    getDepartments()
                ]);

                // Dữ liệu raw từ backend
                this.doctors = doctorRes.data ?? doctorRes;
                this.departments = deptRes.data ?? deptRes;

                // Tạo bản đồ ID -> Name
                const deptMap = {};
                this.departments.forEach(d => {
                    deptMap[d.departmentId] = d.name;
                });

                // Map DepartmentName
                this.doctors = this.doctors
                    .filter(d => d.status === "Active")  
                    .map(doc => ({
                        ...doc,
                        departmentName:
                            doc.departmentId && deptMap[doc.departmentId]
                                ? deptMap[doc.departmentId]
                                : "No Department"
                    }));

            } catch (error) {
                console.error("Error load data:", error);
            } finally {
                this.loading = false;
            }
        },
        getInitial(name) {
            if (!name) return "?";
            return name.charAt(0).toUpperCase();
        },

        getColor(name) {
            if (!name) return "#6c757d";
            const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b", "#858796"];
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            return colors[Math.abs(hash) % colors.length];
        },
        async openScheduleModal(doc) {
            this.selectedDoctor = doc;
            this.activeDay = "Monday";

            // Reset toàn bộ ngày
            for (let d of this.days) {
                this.schedules[d] = {
                    scheduleId: null,
                    isAssigned: false,
                    startTime: "07:00",
                    endTime: "19:00",
                    roomNumber: doc.departmentName
                };
            }

            // Gọi API
            const res = await getScheduleByDoctor(doc.userId);
            const list = Array.isArray(res.data) ? res.data : res;

            // Gắn dữ liệu có sẵn
            list.forEach(s => {
                this.schedules[s.dayOfWeek] = {
                    scheduleId: s.scheduleId,
                    isAssigned: true,
                    startTime: s.startTime.substring(0, 5),
                    endTime: s.endTime.substring(0, 5),
                    roomNumber: doc.departmentName
                };
            });

            // Mở modal
            const modal = new bootstrap.Modal(document.getElementById("doctor_schedule_modal"));
            modal.show();
        },
        closeModal() {
            const modalEl = document.getElementById("doctor_schedule_modal");
            const modal = bootstrap.Modal.getInstance(modalEl);

            if (modal) modal.hide();
        },
        async saveSchedule() {
            try {
                const day = this.activeDay;
                const item = this.schedules[day];

                const toast = useToast();

                // CASE 1: Not Assigned → DELETE
                if (!item.isAssigned) {
                    if (item.scheduleId) {
                        await deleteSchedule(item.scheduleId);
                        item.scheduleId = null;

                        toast.success(`Removed schedule for ${day}`);

                        // ⛔ Auto close modal
                        this.closeModal();
                    } else {
                        toast.info(`Nothing to remove for ${day}`);
                    }
                    return;
                }

                // CASE 2: Assigned + chưa có scheduleId → CREATE
                if (!item.scheduleId) {
                    const payload = {
                        doctorId: this.selectedDoctor.userId,
                        dayOfWeek: day,
                        startTime: item.startTime + ":00",
                        endTime: item.endTime + ":00",
                        roomNumber: item.roomNumber
                    };

                    const res = await createSchedule(payload);

                    if (res?.data?.scheduleId) {
                        item.scheduleId = res.data.scheduleId;
                    }

                    toast.success(`Created schedule for ${day}`);

                    // ⛔ Auto close modal
                    this.closeModal();
                    return;
                }

                // CASE 3: Assigned + đã có schedule → no update
                toast.info(`Schedule for ${day} is already assigned. Nothing to update.`);

                // ⛔ Auto close modal
                this.closeModal();

            } catch (err) {
                console.error("Save schedule error:", err);
                useToast().error("Save failed!");
            }
        }

    }
}
</script>

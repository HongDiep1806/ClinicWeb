<template>
	<div class="main-wrapper auth-bg auth-bg-custom position-relative overflow-hidden">

		<!-- Start Content -->
		<div class="container-fuild position-relative z-1">
			<div class="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
				<!-- start row -->
				<div class="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap py-3">
					<div class="col-lg-4 mx-auto">
						<form @submit.prevent="handleLogin" class="d-flex justify-content-center align-items-center">
							<div class="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pb-0 flex-fill">
								<div class=" mx-auto mb-4 text-center">
									<img src="/img/logo.svg" class="img-fluid" alt="Logo">
								</div>
								<div class="card border-1 p-lg-3 shadow-md rounded-3 mb-4">
									<div class="card-body">
										<div class="text-center mb-3">
											<h5 class="mb-1 fs-20 fw-bold">Sign In</h5>
											<p class="mb-0">Please enter below details to access the dashboard</p>
										</div>
										<div class="mb-3">
											<label class="form-label">Email Address</label>
											<div class="input-group">
												<span class="input-group-text border-end-0 bg-white">
													<i class="ti ti-mail fs-14 text-dark"></i>
												</span>
												<input type="text" v-model="email"
													class="form-control border-start-0 ps-0"
													placeholder="Enter Email Address">
											</div>
										</div>
										<div class="mb-3">
											<label class="form-label">Password</label>
											<div class="position-relative">
												<div class="pass-group input-group position-relative border rounded">
													<span class="input-group-text bg-white border-0">
														<i class="ti ti-lock text-dark fs-14"></i>
													</span>
													<input type="password" v-model="password"
														class="pass-input form-control ps-0 border-0"
														placeholder="****************">
													<span class="input-group-text bg-white border-0">
														<i class="ti toggle-password ti-eye-off text-dark fs-14"></i>
													</span>
												</div>
											</div>
										</div>
										<div class="d-flex align-items-center justify-content-between mb-3">
											<div class="d-flex align-items-center">
												<div class="form-check form-check-md mb-0">
													<input class="form-check-input" id="remember_me" type="checkbox">
													<label for="remember_me"
														class="form-check-label mt-0 text-dark">Remember Me</label>
												</div>
											</div>
											<div class="text-end">
												<a href="forgot-password-basic.html" class="text-danger">Forgot
													Password?</a>
											</div>
										</div>
										<!-- <div class="mb-2">
											<button type="submit" class="btn bg-primary text-white w-100">Login</button>
										</div>		
																										 -->
										<div class="mb-2">
											<button type="submit" class="btn bg-primary text-white w-100"
												:disabled="loading">
												<span v-if="!loading">Login</span>
												<span v-else>Logging in...</span>
											</button>
										</div>
										<div v-if="errorMessage" class="text-danger text-center mt-2">
											{{ errorMessage }}
										</div>
										<div class="text-center">
											<h6 class="fw-normal fs-14 text-dark mb-0">Don’t have an account yet?
												<a href="register-basic.html" class="hover-a"> Register</a>
											</h6>
										</div>
									</div><!-- end card body -->
								</div><!-- end card -->
							</div>
						</form>
						<p class="text-dark text-center"> Copyright &copy; 2025 - Preclinic </p>
					</div><!-- end col -->
				</div>
				<!-- end row -->
			</div>
		</div>
		<!-- End Content -->
	</div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/auth";


export default {
	name: "Login",
	data() {
		return {
			email: "",
			password: "",
			loading: false,
			errorMessage: "",
		};
	},
	methods: {
		async handleLogin() {
			this.loading = true;
			this.errorMessage = "";

			try {
				// Login API
				const response = await axios.post("https://localhost:7205/api/Auth/login", {
					email: this.email,
					password: this.password,
				});

				const { accessToken, refreshToken, expiresAt } = response.data;

				const decoded = jwtDecode(accessToken);
				const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
				const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
				const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

				const auth = useAuthStore();
				const user = { role, name, email };
				auth.login(accessToken, user, refreshToken, expiresAt);

				const userRole = role.toLowerCase();

				if (userRole === "admin") {
					this.$router.replace({ name: "admin-dashboard" });
				} else if (userRole === "doctor") {
					this.$router.replace({ name: "doctor-dashboard" });
				} else if (userRole === "receptionist") {
					this.$router.replace({ name: "receptionist-dashboard" });
				} else {
					this.$router.replace({ name: "patient-dashboard" });
				}

			} catch (error) {
				this.errorMessage =
					error.response?.data?.message || "Login failed. Please check your credentials.";
			} finally {
				this.loading = false;
			}
		},
	},

};
</script>

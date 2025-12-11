<template>
  <div class="main-wrapper auth-bg auth-bg-custom position-relative overflow-hidden">
    <div class="container-fuild position-relative z-1">
      <div class="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div class="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap py-3">
          <div class="col-lg-4 mx-auto">

            <form @submit.prevent="handleLogin" class="d-flex justify-content-center align-items-center">
              <div class="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pb-0 flex-fill">

                <div class="mx-auto mb-4 text-center">
                  <img src="/img/logo.svg" class="img-fluid" alt="Logo" />
                </div>

                <div class="card border-1 p-lg-3 shadow-md rounded-3 mb-4">
                  <div class="card-body">

                    <div class="text-center mb-3">
                      <h5 class="mb-1 fs-20 fw-bold">Sign In</h5>
                      <p class="mb-0">Please enter details to access the dashboard</p>
                    </div>

                    <!-- Email -->
                    <div class="mb-3">
                      <label class="form-label">Email Address</label>
                      <div class="input-group">
                        <span class="input-group-text bg-white border-end-0">
                          <i class="ti ti-mail fs-14 text-dark"></i>
                        </span>
                        <input type="text" v-model="email" class="form-control border-start-0 ps-0"
                          placeholder="Enter Email Address" />
                      </div>
                    </div>

                    <!-- Password -->
                    <!-- Password -->
<div class="mb-3">
  <label class="form-label">Password</label>
  <div class="position-relative">
    <div class="pass-group input-group border rounded">

      <span class="input-group-text bg-white border-0">
        <i class="ti ti-lock text-dark fs-14"></i>
      </span>

      <input
        :type="showPassword ? 'text' : 'password'"
        v-model="password"
        class="form-control border-0 ps-0"
        placeholder="*********"
      />

      <!-- Eye Icon -->
      <span
        class="input-group-text bg-white border-0 pe-2 pointer"
        @click="togglePassword"
        style="cursor: pointer;"
      >
        <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'" class="fs-16"></i>
      </span>
    </div>
  </div>
</div>


                    <!-- Remember + Forgot -->
                    <div class="d-flex align-items-center justify-content-between mb-3">
                      <div class="form-check">
                        <input class="form-check-input" id="remember" type="checkbox" />
                        <label for="remember" class="form-check-label text-dark">Remember Me</label>
                      </div>
                      <a href="#" class="text-danger">Forgot Password?</a>
                    </div>

                    <!-- Button -->
                    <div class="mb-2">
                      <button type="submit" class="btn bg-primary text-white w-100" :disabled="loading">
                        <span v-if="!loading">Login</span>
                        <span v-else>Logging in...</span>
                      </button>
                    </div>

                    <!-- Error -->
                    <div v-if="errorMessage" class="text-danger text-center mt-2">{{ errorMessage }}</div>
                  </div>
                </div>

              </div>
            </form>

            <p class="text-dark text-center">© 2025 Preclinic</p>
          </div>
        </div>
      </div>
    </div>
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
      showPassword: false,  
    };
  },

  methods: {
     togglePassword() {
    this.showPassword = !this.showPassword;  
  },
    async handleLogin() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const response = await axios.post("https://clinic-management-system-production-2598.up.railway.app/api/Auth/login", {
          email: this.email,
          password: this.password,
        });

        const { accessToken, refreshToken, expiresAt } = response.data;
        const decoded = jwtDecode(accessToken);

        // ⭐ LẤY USER ID TỪ TOKEN ⭐
        const userId =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        const role =
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const name =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        const email =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

        const auth = useAuthStore();
        auth.login(accessToken, { userId, role, name, email }, refreshToken, expiresAt);

        // Redirect by role
        const normalized = role.toLowerCase();
        const target = {
          admin: "admin-dashboard",
          doctor: "doctor-dashboard",
          receptionist: "receptionist-dashboard",
          patient: "patient-dashboard",
        }[normalized] || "patient-dashboard";

        this.$router.replace({ name: target });
      } catch (err) {
        this.errorMessage =
          err.response?.data?.message || "Invalid email or password.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

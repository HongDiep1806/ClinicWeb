<template>
  <div class="container mt-5" style="max-width:400px">
    <div class="card p-4 shadow">
      <h4 class="text-center mb-3">Forgot Password</h4>

      <div class="mb-3">
        <label>Email</label>
        <input v-model="email" type="email" class="form-control" />
      </div>

      <button class="btn btn-primary w-100" @click="submit" :disabled="loading">
        <span v-if="!loading">Send Reset Link</span>
        <span v-else>Sending...</span>
      </button>

      <p class="text-success mt-3 text-center" v-if="message">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../api/axiosInstance";
export default {
  data() {
    return {
      email: "",
      loading: false,
      message: ""
    };
  },

  methods: {
    async submit() {
      this.loading = true;

      try {
        await axiosInstance.post(
          "/user/forgot-password",
          { email: this.email }
        );

        this.message =
          "If the email exists, a reset link has been sent.";
      } catch (err) {
        console.log(err);
      }

      this.loading = false;
    }
  }
};
</script>
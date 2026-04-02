<template>
  <div class="container mt-5" style="max-width:400px">
    <div class="card p-4 shadow">
      <h4 class="text-center mb-3">Reset Password</h4>

      <div class="mb-3">
        <label>New Password</label>
        <input v-model="password" type="password" class="form-control" />
      </div>

      <button class="btn btn-success w-100" @click="reset">
        Reset Password
      </button>

      <p v-if="message" class="text-success mt-3 text-center">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      password: "",
      token: "",
      message: ""
    };
  },

  mounted() {
    this.token = this.$route.query.token;
  },

  methods: {
    async reset() {
      try {
        await axios.post(
          "https://localhost:7205/api/user/reset-password",
          {
            token: this.token,
            newPassword: this.password
          }
        );

        this.message = "Password reset successfully";

        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (err) {
        alert("Invalid or expired token");
      }
    }
  }
};
</script>
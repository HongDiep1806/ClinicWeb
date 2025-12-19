<template>
  <router-view />
</template>


<!-- <script>
import HomeView from './views/HomeView.vue'
import Login from './views/Login.vue';
export default {
  components: { Login }
}
</script> -->
<style>
/* .toggle-theme {
  display: none !important;
} *//* Option đang hover */
.multiselect__option--highlight {
  background: var(--theme-navy);
  color: #fff;
}

/* Option đã chọn */
.multiselect__option--selected {
  background: #e9ecf8;
  color: var(--theme-navy);
  font-weight: 600;
}

/* Text trong ô select */
.multiselect__single {
  color: #1e2a5a;
}

</style>

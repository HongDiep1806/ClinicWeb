import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/', // ⭐ THÊM DÒNG NÀY
  plugins: [vue()],
  server: {
    host: true,
    port: 80,
    allowedHosts: ['clinic.sys']
  }
})
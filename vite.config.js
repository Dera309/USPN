import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: '/',
  server: {
    port: 3000,
    strictPort: false,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      }
    }
  },
  preview: {
    port: 4173,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:              resolve(__dirname, 'index.html'),
        login:             resolve(__dirname, 'pages/login.html'),
        register:          resolve(__dirname, 'pages/register.html'),
        forgotPassword:    resolve(__dirname, 'pages/forgot-password.html'),
        tracking:          resolve(__dirname, 'pages/tracking.html'),
        services:          resolve(__dirname, 'pages/services.html'),
        about:             resolve(__dirname, 'pages/about.html'),
        contact:           resolve(__dirname, 'pages/contact.html'),
        quote:             resolve(__dirname, 'pages/quote.html'),
        booking:           resolve(__dirname, 'pages/booking.html'),
        dashboard:         resolve(__dirname, 'pages/dashboard.html'),
        adminDashboard:    resolve(__dirname, 'pages/admin/dashboard.html'),
        adminShipments:    resolve(__dirname, 'pages/admin/shipments.html'),
        adminShipmentEdit: resolve(__dirname, 'pages/admin/shipment-edit.html'),
        adminUsers:        resolve(__dirname, 'pages/admin/users.html'),
      }
    }
  }
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The browser only talks to http://localhost:5173. Vite forwards every /api
      // request to the Spring Boot backend. Because the browser sees ONE origin,
      // the session cookie and the CSRF cookie work without any CORS setup.
      '/api': 'http://localhost:8080',
    },
  },
})

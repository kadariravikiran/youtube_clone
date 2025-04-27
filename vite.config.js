import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 4173,  // Default port or the port specified in the environment variable
    host: '0.0.0.0',  // Ensures the server is accessible externally
  },
});

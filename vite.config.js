import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from any IP
    port: process.env.PORT || 3000, // Use Render's port or fallback to 3000
  },
  preview: {
    allowedHosts: ['youtube-clone-4-ogwk.onrender.com'],
  }
});

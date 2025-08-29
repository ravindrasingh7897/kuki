import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// ...existing code...

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Proxy is only for local development. In production, set VITE_API_BASE_URL in Vercel dashboard to your Render backend URL.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
  react(),
  // ...existing code...
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

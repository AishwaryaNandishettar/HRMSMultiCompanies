import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  define: {
    global: "window", // fix for sockjs-client
  },

  // Tell Vite's pre-bundler (esbuild) to include these packages explicitly.
  // FullCalendar uses ESM subpath exports that esbuild can't auto-discover,
  // and recharts needs react-is as a peer dep.
  optimizeDeps: {
    include: [
      "@fullcalendar/core",
      "@fullcalendar/core/internal",
      "@fullcalendar/core/preact",
      "@fullcalendar/daygrid",
      "@fullcalendar/timegrid",
      "@fullcalendar/interaction",
      "@fullcalendar/react",
      "react-is",
    ],
  },

  server: {
    port: 5176,
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:8082",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

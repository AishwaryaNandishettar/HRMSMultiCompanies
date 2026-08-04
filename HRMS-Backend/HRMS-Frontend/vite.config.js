import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    define: {
      global: "window",
    },

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
  port:
    mode === "company-a"
      ? 5176
      : mode === "company-b"
      ? 5177
      : mode === "company-c"
      ? 5178
      : 5173,

  proxy: {
    "/api": {
      target: env.VITE_API_BASE_URL || "http://localhost:8082",
      changeOrigin: true,
      secure: false,
    },
  },
},
  };
});
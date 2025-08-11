import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // resolve: {
  //   alias: {
  //     '@fortawesome/fontawesome-svg-core': path.resolve(__dirname, 'node_modules/@fortawesome/fontawesome-svg-core'),
  //   },
  // },
  // optimizeDeps: {
  //   include: [
  //     "@fortawesome/fontawesome-svg-core",
  //     "@fortawesome/free-solid-svg-icons",
  //     "@fortawesome/react-fontawesome",
  //   ],
  // },
  // build: {
  //   rollupOptions: {
  //     external: ["@fortawesome/fontawesome-svg-core"],
  //   },
  // }
});

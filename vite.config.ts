import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
const BASE_PATH = "/user-weather-dashboard/";

export default defineConfig({
  base: BASE_PATH,
  plugins: [react(), tsconfigPaths()]
});

import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  build: {
    target: "chrome95",
    sourcemap: true,
  },
  plugins: [solid()],
});

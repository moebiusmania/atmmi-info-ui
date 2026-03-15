import Vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

const exclude = ["**/node_modules/**", "**/build/**", "**/.output/**"];

export default defineConfig({
  plugins: [Vue()],
  test: {
    coverage: {
      exclude: [...exclude, "**/__tests__/**", "**/.nuxt/**"],
      reporter: ["html"],
    },
    environment: "happy-dom",
    exclude,
    setupFiles: ["./vitest.setup.ts"],
  },
});

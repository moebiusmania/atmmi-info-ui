/// <reference types="vitest" />

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

const exclude = ["**/node_modules/**", "**/build/**", "**/.output/**"];

export default defineConfig({
	plugins: [Vue()],
	test: {
		coverage: {
			exclude: [...exclude, "**/__tests__/**", "**/.nuxt/**"],
			reporter: ["html"],
		},
		environment: "jsdom",
		exclude,
		globals: true,
	},
});

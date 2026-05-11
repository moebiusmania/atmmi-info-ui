import { fresh } from "@fresh/plugin-vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [fresh()],
	server: {
		port: 3000,
		host: "localhost",
	},
});

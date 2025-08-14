// https://v3.nuxtjs.org/api/configuration/nuxt.config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  // modules: [],

  experimental: {
    componentIslands: true,
  },

  compatibilityDate: "2024-10-26",

  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});

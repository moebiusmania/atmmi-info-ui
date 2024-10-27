// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],

  experimental: {
    componentIslands: true,
  },

  compatibilityDate: "2024-10-26",
});
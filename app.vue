<script lang="ts" setup>
useHead({
  title: "ATM Milano Info Dashboard",
  meta: [
    { name: "description", content: "ATM Milano info & status webapp." },
    { name: "author", content: "Salvatore Laisa" },
  ],
  link: [
    {
      rel: "icon",
      href: "https://www.atm.it/_layouts/atm/images/favicon.ico",
      type: "image/x-icon",
    },
  ],
  htmlAttrs: {
    lang: "it-IT",
    "data-theme": "corporate",
  },
});
</script>

<template>
  <div class="bg-gray-50 dark:bg-base-200 h-screen">
    <Header />
    <Dashboard />
    <Footer />
  </div>
</template>

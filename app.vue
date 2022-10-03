<script lang="ts" setup>
useHead({
  title: "ATM Milano Info Dashboard",
  htmlAttrs: {
    lang: "en",
    "data-theme": "corporate",
  },
});
</script>

<template>
  <div class="bg-gray-50 h-screen">
    <Header />
    <Dashboard />
    <Footer />
  </div>
</template>

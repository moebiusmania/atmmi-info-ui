<script lang="ts" setup>
const itemStyle = "mb-5 break-inside-avoid";
</script>

<template>
  <main
    class="container mx-auto my-4 px-4 py-2 columns-1 md:columns-2 xl:columns-3 gap-5"
  >
    <div :class="itemStyle"><StatusV1 /></div>
    <div :class="itemStyle"><Surface /></div>
    <div :class="itemStyle"><Traffic /></div>
    <div :class="itemStyle"><News /></div>
    <div :class="itemStyle"><StaticMap /></div>
    <div :class="itemStyle"><Shortcut /></div>
  </main>
</template>

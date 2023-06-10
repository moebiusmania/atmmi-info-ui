<script setup lang="ts">
type Props = {
  title: string;
};

const { title } = defineProps<Props>();
</script>
<template>
  <div class="card bg-white shadow-lg">
    <div class="card-body">
      <h2 class="card-title">{{ title }}</h2>
      <slot />
    </div>
  </div>
</template>

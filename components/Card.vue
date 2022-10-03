<script setup lang="ts">
type Props = {
  title: string;
};

const { title } = defineProps<Props>();
</script>
<template>
  <div class="card bordered bg-white shadow-md">
    <div class="card-body">
      <h2 class="card-title">{{ title }}</h2>
      <slot />
    </div>
  </div>
</template>

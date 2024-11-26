<script lang="ts" setup>
const resource: string = "/api/surface";

const { status, data, error } = await useFetch<Array<string>>(resource);

if (error.value) console.error("ERROR from useFetch: ", error.value);
</script>

<template>
  <Card title="Linee di superficie">
    <p v-for="item in data">{{ item }}</p>
  </Card>
</template>
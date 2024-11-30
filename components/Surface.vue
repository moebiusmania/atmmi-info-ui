<script lang="ts" setup>
const resource: string = "/api/surface";

const { data, error } = await useFetch<Array<string>>(resource);

if (error.value) console.error("ERROR from useFetch: ", error.value);
</script>

<template>
  <Card title="Linee di superficie">
    <p v-if="data && data.length > 0" v-for="item in data">{{ item }}</p>
    <p v-else>☀️ Nessun avviso disponibile</p>
  </Card>
</template>

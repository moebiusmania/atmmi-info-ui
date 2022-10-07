<script lang="ts" setup>
import { loadingClass } from "./utils";
import type { News } from "../types/news";

const resource: string = "/api/traffic";

const loading = ref(true);
const data = ref(
  Array(6).fill({
    text: "foo",
    url: "bar",
  })
);

onMounted(async (): Promise<void> => {
  $fetch(resource)
    .then((json: Array<News>) => (data.value = json))
    .then(() => (loading.value = false));
});
</script>
<template>
  <Card title="Cambiamenti">
    <ul>
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="loading ? 'my-2 animate-pulse' : 'list-disc list-inside'"
      >
        <div v-if="loading" :class="loadingClass()"></div>
        <a
          v-else
          :href="item.url"
          target="_blank"
          rel="nofollow noopener"
          class="hover:underline hover:text-primary"
          >{{ item.text }}</a
        >
      </li>
    </ul>
  </Card>
</template>

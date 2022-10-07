<script lang="ts" setup>
import type { News } from "../types/news";

const resource: string = "/api/news";

const loading = ref(true);
const data = ref(
  Array(10).fill({
    text: "foo",
    url: "bar",
  })
);

const loadingClass = (): string => {
  const value: number = Math.ceil(Math.random() * 4);
  return `h-4 bg-gray-400 rounded w-${value}/4`;
};

onMounted(async (): Promise<void> => {
  $fetch(resource)
    .then((json: Array<News>) => (data.value = json))
    .then(() => (loading.value = false));
});
</script>
<template>
  <Card title="ATM informa">
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

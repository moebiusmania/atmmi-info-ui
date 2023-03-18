<script lang="ts" setup>
import type { Ref } from 'vue'

import { loadingClass } from "./utils";
import type { News } from "../types/news";

const resource: string = "/api/news";

const loading: Ref<boolean> = ref(true);
const data: Ref<Array<News>> = ref(
  Array(10).fill({
    text: "foo",
    url: "bar",
  })
);

onMounted(async (): Promise<void> => {
  const json: Array<News> = await $fetch(resource)
  data.value = json
  loading.value = false
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

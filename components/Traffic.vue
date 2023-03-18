<script lang="ts" setup>
import { loadingClass } from "./utils";
import type { News } from "../types/news";

const resource: string = "/api/traffic";

const { pending, data } = useLazyFetch<Array<News>>(resource)
</script>

<template>
  <Card title="Cambiamenti">
    <ul>
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="pending ? 'my-2 animate-pulse' : 'list-disc list-inside'"
      >
        <div v-if="pending" :class="loadingClass()"></div>
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

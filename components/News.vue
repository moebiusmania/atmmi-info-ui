<script lang="ts" setup>
import { loadingClass } from "./utils";
import type { News } from "../types/news";

const resource: string = "/api/news";

const { status, data: raw, error } = await useFetch<Array<News>>(resource);

if (error.value) console.error("ERROR from useFetch: ", error.value);

const data = raw?.value?.slice(0, 7) ?? [];
const isPending = status.value === "pending";
</script>

<template>
  <Card title="ATM informa">
    <ul class="list-none">
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="isPending ? 'my-2 animate-pulse' : 'my-2 align-middle'"
      >
        <div v-if="isPending" :class="loadingClass()"></div>
        <a
          v-else
          :href="item.url"
          target="_blank"
          rel="nofollow noopener"
          class="hover:underline hover:text-primary"
          >🔗  {{ item.text }}</a
        >
      </li>
    </ul>
  </Card>
</template>

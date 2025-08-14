<script lang="ts" setup>
import { loadingClass } from "./utils";
import type { News } from "../types/news";

const resource: string = "/api/traffic";

const { status, data, error } = await useFetch<Array<News>>(resource);
const isPending = status.value === "pending";

if (error.value) console.log("ERROR from useFetch: ", error.value);
</script>

<template>
  <Card title="Cambiamenti">
    <ul>
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
          >🔗 {{ item.text }}</a
        >
      </li>
    </ul>
  </Card>
</template>

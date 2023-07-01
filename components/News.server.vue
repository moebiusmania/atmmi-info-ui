<script lang="ts" setup>
import { loadingClass, mockNews } from "./utils";
import type { News } from "../types/news";

const resource: string = "/api/news";

const { pending, data, error } = await useFetch<Array<News>>(resource, {
  default: mockNews,
});

if (error.value) console.log("ERROR from useFetch: ", error.value);
</script>

<template>
  <article class="card bg-white shadow-lg">
    <div class="card-body">
      <h2 class="card-title">ATM informa</h2>
      <ul class="list-none">
        <li
          v-for="(item, index) in data"
          :key="index"
          :class="pending ? 'my-2 animate-pulse' : 'my-2 align-middle'"
        >
          <div v-if="pending" :class="loadingClass()"></div>
          <a
            v-else
            :href="item.url"
            target="_blank"
            rel="nofollow noopener"
            class="hover:underline hover:text-primary"
            ><Icon name="ri:external-link-fill" /> {{ item.text }}</a
          >
        </li>
      </ul>
    </div>
  </article>
</template>

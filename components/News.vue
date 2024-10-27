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
  <article class="card bg-white shadow-lg">
    <div class="card-body">
      <h2 class="card-title">ATM informa</h2>
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
            ><Icon name="ri:external-link-fill" /> {{ item.text }}</a
          >
        </li>
      </ul>
    </div>
  </article>
</template>

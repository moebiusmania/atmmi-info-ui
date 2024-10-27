<script lang="ts" setup>
import { loadingClass } from "./utils";
import type { News } from "../types/news";

const resource: string = "/api/traffic";

const { status, data, error } = await useFetch<Array<News>>(resource);
const isPending = status.value === "pending";

if (error.value) console.log("ERROR from useFetch: ", error.value);
</script>

<template>
  <article class="card bg-white shadow-lg">
    <div class="card-body">
      <h2 class="card-title">Cambiamenti</h2>
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
            ><Icon name="ri:external-link-fill" /> {{ item.text }}</a
          >
        </li>
      </ul>
    </div>
  </article>
</template>

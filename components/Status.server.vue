<script lang="ts" setup>
import { loadingClass } from "./utils";
import type { LineStatus } from "../types/line";

const resource: string = "/api/status";

const lineClass = (line: string): string =>
  `badge badge-lg bg-line-${line} rounded-none border-0 w-10`;

const { pending, data, error } = await useFetch<Array<LineStatus>>(resource);

if (error.value) console.error("ERROR from useFetch: ", error.value);
</script>

<template>
  <article class="card bg-white shadow-lg">
    <div class="card-body">
      <h2 class="card-title">Status linee MM</h2>
      <ul>
        <li
          v-for="(item, index) in data"
          :key="index"
          :class="pending ? 'my-2 animate-pulse' : 'my-2'"
        >
          <div :class="pending ? loadingClass() : lineClass(item.line)">
            <span v-if="!pending" class="text-base-100">{{ item.line }}</span>
          </div>
          {{ " " }}
          <!-- <span v-if="!pending">{{ item.text }} |{{ " " }} {{ item.status }}{{ " " }}</span> -->
          <span v-if="!pending">{{ " " }} {{ item.status }}</span>
        </li>
      </ul>
    </div>
  </article>
</template>

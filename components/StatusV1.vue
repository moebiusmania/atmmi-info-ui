<script lang="ts" setup>
import { loadingClass } from "./utils";
import type { LineStatus } from "../types/line";

const resource: string = "/api/v1/status";

const lineClass = (line: string): string =>
	`badge badge-lg bg-line-${line} rounded-none border-0 w-10`;

const { status, data, error } = await useFetch<Array<LineStatus>>(resource);

const inactive: Array<string> = ["tratta sospesa", "rallentata"];
const isPending = status.value === "pending";

const notActive = (status: string): string =>
	inactive.includes(status.toLocaleLowerCase()) ? "font-bold" : "font-normal";

if (error.value) console.error("ERROR from useFetch: ", error.value);
</script>

<template>
  <Card title="Status linee MM">
    <ul>
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="isPending ? 'my-2 animate-pulse' : 'my-2'"
      >
        <div :class="isPending ? loadingClass() : lineClass(item.line)">
          <span v-if="!isPending" class="text-base-100">{{ item.line }}</span>
        </div>
        {{ " " }}
        <!-- <span v-if="!isPending">{{ item.text }} |{{ " " }} {{ item.status }}{{ " " }}</span> -->
        <span v-if="!isPending" :class="notActive(item.status)"
          >{{ " " }} {{ item.status }}</span
        >
      </li>
    </ul>
  </Card>
</template>

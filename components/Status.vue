<script lang="ts" setup>
import type { LineStatus } from "../types/line";

const resource: string = "/api/status";

const lineClass = (line: string): string =>
  `badge badge-lg bg-line-${line} rounded-none border-0 w-10`;

const { data } = await useFetch<Array<LineStatus>>(resource);

const inactive: Array<string> = ["tratta sospesa", "rallentata"];

const notActive = (status: string): string =>
  inactive.includes(status.toLocaleLowerCase()) ? "font-bold" : "font-normal";

const isOK = (status: string): string =>
  status.toLocaleLowerCase() === "regolare" ? "🟩" : "🟥";
</script>

<template>
  <Card title="Status linee MM">
    <ul>
      <li
        v-for="(item, index) in data"
        :key="index"
        class="my-3 flex gap-6 items-center"
      >
        <div :class="lineClass(item.line)">
          <span class="text-base-100">{{ item.line }}</span>
        </div>
        <ul>
          <li v-for="(direction, index) in item.directions" :key="index">
            <span :class="notActive(direction.status)"
              >{{ isOK(direction.status) }} {{ direction.label }}</span
            >
          </li>
        </ul>
      </li>
    </ul>
  </Card>
</template>

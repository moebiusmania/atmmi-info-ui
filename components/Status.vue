<script lang="ts" setup>
import { loadingClass } from "./utils";
import type { LineStatus } from "../types/line";

const resource: string = "/api/status";

const lineClass = (line: string): string =>
  `badge bg-line-${line} rounded-none border-0`;

const { pending, data } = useLazyFetch<Array<LineStatus>>(resource)
</script>

<template>
  <Card title="Status linee MM">
    <ul>
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="pending ? 'my-2 animate-pulse' : ''"
      >
        <div :class="pending ? loadingClass() : lineClass(item.line)">
          <span v-if="!pending">{{ item.line }}</span>
        </div>
        {{ " " }}
        <span v-if="!pending"
          >{{ item.text }} |{{ " " }} {{ item.status }}{{ " " }}</span
        >
      </li>
    </ul>
  </Card>
</template>

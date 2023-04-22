<script lang="ts" setup>
import { loadingClass, mockLine } from "./utils";
import type { LineStatus } from "../types/line";

const resource: string = "/api/status";

const lineClass = (line: string): string =>
  `badge bg-line-${line} rounded-none border-0`;

const { pending, data } = useFetch<Array<LineStatus>>(resource, {
  default: mockLine
})
</script>

<template>
  <Card title="Status linee MM">
    <ul>
      <li v-for="(item, index) in data" :key="index" :class="pending ? 'my-2 animate-pulse' : ''">
        <div :class="pending ? loadingClass() : lineClass(item.line)">
          <span v-if="!pending">{{ item.line }}</span>
        </div>
        {{ " " }}
        <!-- <span v-if="!pending">{{ item.text }} |{{ " " }} {{ item.status }}{{ " " }}</span> -->
        <span v-if="!pending">{{ " " }} {{ item.status }}</span>
      </li>
    </ul>
  </Card>
</template>

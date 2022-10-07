<script lang="ts" setup>
import type { LineStatus } from "../types/line";

const resource: string = "/api/status";

const loading = ref(true);
const data = ref(
  Array(10).fill({
    line: "foo",
    text: "bar",
    status: "pippo",
  })
);

const loadingClass = (): string => {
  const value: number = Math.ceil(Math.random() * 4);
  return `h-4 bg-gray-400 rounded w-${value}/4`;
};

const lineClass = (line: string): string =>
  `badge bg-line-${line} rounded-none border-0`;

onMounted(async (): Promise<void> => {
  $fetch(resource)
    .then((json: Array<LineStatus>) => (data.value = json))
    .then(() => (loading.value = false));
});
</script>
<template>
  <Card title="Status linee MM">
    <ul>
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="loading ? 'my-2 animate-pulse' : ''"
      >
        <div :class="loading ? loadingClass() : lineClass(item.line)">
          <span v-if="!loading">{{ item.line }}</span>
        </div>
        {{ " " }}
        <span v-if="!loading"
          >{{ item.text }} |{{ " " }} {{ item.status }}{{ " " }}</span
        >
      </li>
    </ul>
  </Card>
</template>

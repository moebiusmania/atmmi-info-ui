<script lang="ts" setup>
import type { Ref } from 'vue'

import { loadingClass } from "./utils";
import type { LineStatus } from "../types/line";

const resource: string = "/api/status";

const loading: Ref<boolean> = ref(true);
const data: Ref<Array<LineStatus>> = ref(
  Array(10).fill({
    line: "foo",
    text: "bar",
    status: "pippo",
  })
);

const lineClass = (line: string): string =>
  `badge bg-line-${line} rounded-none border-0`;

onMounted(async (): Promise<void> => {
  const json: Array<LineStatus> = await $fetch(resource)
  data.value = json
  loading.value = false
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

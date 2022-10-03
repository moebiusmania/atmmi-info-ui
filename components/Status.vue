<script lang="ts" setup>
type LineStatus = {
  line: string;
  text: string;
  status: string;
};

const mock: LineStatus = {
  line: "foo",
  text: "bar",
  status: "pippo",
};

const mockData: LineStatus[] = Array(10).fill(mock);

const resource: string = "https://atmmi-info-api.herokuapp.com/status";

const loading = ref(true);
const data = ref(mockData);

const loadingClass = (): string => {
  const value: number = Math.ceil(Math.random() * 4);
  return `h-4 bg-gray-400 rounded w-${value}/4`;
};

const lineClass = (line: string): string =>
  `badge bg-line-${line} rounded-none border-0`;

onMounted(async (): Promise<void> => {
  fetch(resource)
    .then((response) => response.json())
    .then((json: LineStatus[]) => (data.value = json))
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
        <span v-if="!loading"
          >{{ item.text }} |{{ " " }} {{ item.status }}{{ " " }}</span
        >
      </li>
    </ul>
  </Card>
</template>

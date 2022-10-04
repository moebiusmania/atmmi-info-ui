<script lang="ts" setup>
const today: Date = new Date();
</script>

<template>
  <footer class="text-center p-6">
    <p class="font-light text-sm">
      <span>{{ today.getFullYear() }}</span> - Sviluppato da{{ " " }}
      <a
        href="https://github.com/moebiusmania/atmmi-info-ui"
        target="_blank"
        class="underline"
        rel="noopener noreferrer"
      >
        Salvatore Laisa
      </a>
    </p>
    <p class="font-light text-sm mt-3">
      Progetto indipendente e non affiliato o supportato da ATM Milano S.p.A.
    </p>
  </footer>
</template>

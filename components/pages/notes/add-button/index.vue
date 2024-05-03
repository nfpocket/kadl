<template>
  <UButton icon="i-tabler-circle-plus" :ui="{ icon: { base: '!w-10 !h-10' } }" square variant="ghost" @click="emit('add')"></UButton>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (event: "add"): void }>();
</script>

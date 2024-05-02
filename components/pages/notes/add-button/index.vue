<template>
  <UCard class="card" @click="emit('add')">
    <div class="flex items-center justify-center flex-col gap-4">
      <UButton icon="i-tabler-circle-plus" class="pointer-events-none" :ui="{ icon: { base: '!w-10 !h-10' } }" square variant="ghost"></UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (event: "add"): void }>();
</script>

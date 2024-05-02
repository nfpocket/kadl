<template>
  <div
    class="flex items-center group gap-2 hover:bg-gray-500/10 focus-within:!bg-cornflower-blue-500/20 last-of-type:border-b-0 border-b-[1px] border-y-gray-500/25 py-[0.375rem]"
  >
    <UIcon name="i-heroicons-bars-4" class="ml-1 opacity-0" />
    <UCheckbox :model-value="false" />
    <USkeleton
      class="h-3"
      :style="{
        width: `${width}%`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
const width = ref(Math.random() * 50);
</script>

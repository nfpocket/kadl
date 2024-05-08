<template>
  <UTooltip :text="tooltip">
    <UButton icon="i-tabler-circle-plus" :ui="{ icon: { base: '!w-10 !h-10' } }" square variant="ghost" @click="emit('add')"></UButton>
  </UTooltip>
</template>

<script setup lang="ts">
const props = defineProps<{
  tooltip: string;
}>();

const emit = defineEmits<{ (event: "add"): void }>();

const { TAB_N } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (!TAB_N.value) return;

    e.preventDefault();
    e.stopPropagation();
  },
});

whenever(TAB_N, () => {
  emit("add");
});
</script>

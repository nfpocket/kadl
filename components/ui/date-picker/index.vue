<template>
  <UPopover v-model:open="open" :popper="{ placement: 'bottom-start' }">
    <UButton icon="i-heroicons-calendar-days-20-solid" :label="date ? format(date, 'd MMM, yyy') : 'Choose date'" />

    <template #panel>
      <UiDatePickerBase v-model="date" v-bind="{ ...$attrs }" :popover="true" :is-dark="colorMode.value === 'dark'" color="primary" />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { format } from "date-fns";

const date = defineModel<Date | null>({
  required: true,
});

const colorMode = useColorMode();
const open = ref(false);

watch(date, () => {
  open.value = false;
});
</script>

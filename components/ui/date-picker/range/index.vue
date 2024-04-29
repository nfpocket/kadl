<template>
  <UPopover v-model:open="open" :popper="{ placement: 'bottom-start' }">
    <UButton icon="i-heroicons-calendar-days-20-solid">
      <template v-if="selected?.start && selected?.end">
        {{ format(selected.start as Date, "d MMM, yyy") }} - {{ format(selected.end as Date, "d MMM, yyy") }}
      </template>
      <template v-else> Choose date range </template>
    </UButton>

    <template #panel>
      <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
        <div class="hidden sm:flex flex-col py-4">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="gray"
            variant="ghost"
            class="rounded-none px-6"
            :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
            truncate
            @click="selectRange(range.duration)"
          />
        </div>

        <UiDatePickerBase v-model.range="selected" v-bind="{ ...$attrs }" :popover="true" :is-dark="colorMode.value === 'dark'" color="primary" :columns="2" />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { format, isSameDay, sub, type Duration } from "date-fns";
import type { DatePickerRangeObject } from "v-calendar/dist/types/src/use/datePicker.js";

const ranges = [
  { label: "Last 7 days", duration: { days: 7 } },
  { label: "Last 14 days", duration: { days: 14 } },
  { label: "Last 30 days", duration: { days: 30 } },
  { label: "Last 3 months", duration: { months: 3 } },
  { label: "Last 6 months", duration: { months: 6 } },
  { label: "Last year", duration: { years: 1 } },
];
const selected = defineModel<DatePickerRangeObject>();

function isRangeSelected(duration: Duration) {
  if (!selected.value) return false;
  if (!selected.value.start || !selected.value.end) return false;

  return isSameDay(selected.value.start as Date, sub(new Date(), duration)) && isSameDay(selected.value.end as Date, new Date());
}

function selectRange(duration: Duration) {
  selected.value = { start: sub(new Date(), duration), end: new Date() };
}

const colorMode = useColorMode();
const open = ref(false);

watch(selected, () => {
  open.value = false;
});
</script>

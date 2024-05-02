<template>
  <UPopover :popper="{ placement: 'left' }">
    <UButton color="white" label="Filter" trailing-icon="i-tabler-filter" />

    <template #panel>
      <div class="p-4 flex flex-col gap-4 select-none min-w-[340px]">
        <div class="flex flex-col gap-1">
          <label class="flex items-center gap-2 cursor-pointer"><UToggle v-model="filterOptions.hideCompleted" />Hide completed</label>
          <label class="flex items-center gap-2 cursor-pointer"><UToggle v-model="filterOptions.groupByPriority" />Group by priority</label>
        </div>
        <div>
          Sort by

          <div class="flex items-center gap-2 fixed">
            <USelectMenu class="w-[150px]" v-model="filterOptions.sortBy" :options="sortOptions" value-attribute="value" option-attribute="label" />
            <USelectMenu
              class="w-[150px]"
              v-model="filterOptions.sortOrder"
              :options="sortOrderOptions"
              :disabled="filterOptions.sortBy === 'none'"
              value-attribute="value"
              option-attribute="label"
            />
          </div>
          <div class="h-8"></div>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
export type FilterOptions = {
  hideCompleted: boolean;
  groupByPriority: boolean;
  sortBy: "none" | "created_at" | "priority" | "title";
  sortOrder: "asc" | "desc";
};

const sortOptions = [
  { label: "None", value: "none" },
  { label: "Created at", value: "created_at" },
  { label: "Priority", value: "priority" },
  { label: "Title", value: "title" },
] satisfies {
  label: string;
  value: FilterOptions["sortBy"];
}[];

const sortOrderOptions = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
] satisfies {
  label: string;
  value: FilterOptions["sortOrder"];
}[];

const filterOptions = defineModel<FilterOptions>({
  default: {
    hideCompleted: false,
    groupByPriority: false,
    sortBy: "none",
    sortOrder: "asc",
  },
});
</script>

<template>
  <div class="flex items-center gap-2">
    <div v-if="hasActiveSorting" class="italic text-xs opacity-50">
      Sorting <strong>{{ filterOptions.sortOrder === "asc" ? "ascending" : "descending" }}</strong> by
      <strong>{{ userNotesSortOptions.find((option) => option.value === filterOptions.sortBy)?.label }}</strong>
    </div>

    <UPopover :popper="{ placement: 'left' }">
      <UButton
        :color="hasActiveSorting ? 'primary' : 'gray'"
        :variant="hasActiveSorting ? 'outline' : 'solid'"
        label="Filter"
        trailing-icon="i-tabler-filter"
      />

      <template #panel>
        <div class="p-4 flex flex-col gap-4 select-none min-w-[340px]">
          <div>
            Sort by

            <div class="flex items-center gap-2">
              <USelectMenu
                v-model="filterOptions.sortBy"
                :options="userNotesSortOptions"
                value-attribute="value"
                option-attribute="label"
                :popper="{
                  strategy: 'fixed',
                }"
              />
              <USelectMenu
                v-model="filterOptions.sortOrder"
                :options="UserNotesSortOrderOptions"
                :disabled="filterOptions.sortBy === 'none'"
                value-attribute="value"
                option-attribute="label"
                :popper="{
                  strategy: 'fixed',
                }"
              />
            </div>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
const filterOptions = defineModel<UserNotesFilterOptions>({
  default: {
    sortBy: "none",
    sortOrder: "asc",
  },
});

const hasActiveSorting = computed(() => filterOptions.value.sortBy !== "none");
</script>

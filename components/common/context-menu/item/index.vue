<template>
  <div class="flex flex-col" @click="menu.hide">
    <UDivider v-if="menuItem.type === 'divider'"></UDivider>
    <NuxtLink
      v-else-if="menuItem.type === 'link'"
      :to="menuItem.to"
      class="flex-1 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
    >
      <UIcon v-if="menuItem.icon" :name="menuItem.icon" />
      <div>
        {{ menuItem.label }}
      </div>
    </NuxtLink>
    <button
      v-else-if="menuItem.type === 'action'"
      class="flex-1 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
      @click="menuItem.action"
    >
      <UIcon v-if="menuItem.icon" :name="menuItem.icon" />
      <div>
        {{ menuItem.label }}
      </div>
    </button>
    <div v-else>
      <UDropdown class="w-full" :items="[[...menuItem.items]]" mode="hover" :popper="{ placement: 'right' }">
        <button class="flex-1 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
          <UIcon v-if="menuItem.icon" :name="menuItem.icon" />

          {{ menuItem.label }}

          <UIcon name="i-tabler-chevron-right" />
        </button>
      </UDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  menuItem: MenuItem;
}>();

const menu = useContextMenu();
</script>

<template>
  <Teleport to="body">
    <UContextMenu ref="menuRef" :model-value="menu.visible.value" :virtual-element="virtualElement">
      <div>
        <div v-for="(menuItem, index) in menu.items.value" :key="index" class="flex flex-col">
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
            v-else
            class="flex-1 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            @click="menuItem.action"
          >
            <UIcon v-if="menuItem.icon" :name="menuItem.icon" />
            <div>
              {{ menuItem.label }}
            </div>
          </button>
        </div>
      </div>
    </UContextMenu>
  </Teleport>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const menu = useContextMenu();

const menuRef = ref<HTMLDivElement>();

const virtualElement = computed(() => {
  if (!menu.position.value) return { getBoundingClientRect: () => ({}) };

  const top = menu.position.value.y;
  const left = menu.position.value.x;

  return {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      top,
      left,
    }),
  };
});

onClickOutside(menuRef, () => menu.hide());
</script>

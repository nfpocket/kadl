<template>
  <Teleport to="body">
    <UContextMenu ref="menuRef" :popper="{ strategy: 'fixed' }" :model-value="menu.visible.value" :virtual-element="virtualElement">
      <div>
        <ContextMenuItem v-for="(menuItem, index) in menu.items.value" :key="index" :menu-item="menuItem" />
      </div>
    </UContextMenu>
  </Teleport>
</template>

<script setup lang="ts">
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

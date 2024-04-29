<template>
  <div class="h-full flex flex-col overflow-hidden">
    <LayoutTopBar />
    <div class="h-full flex-1 overflow-hidden p-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();

watch(
  () => user.value,
  () => {
    if (!user.value) {
      return navigateTo("/auth/login");
    }

    navigateTo("/notes");
  },
  { deep: true }
);
</script>

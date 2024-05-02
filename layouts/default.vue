<template>
  <div class="h-full flex flex-col overflow-hidden">
    <LayoutTopBar />
    <div class="h-full flex-1 overflow-hidden p-4 flex flex-col">
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

    useUserSettings().init();
    navigateTo("/projects");
  },
  { deep: true }
);

onMounted(() => {
  if (!user.value) {
    return;
  }

  useUserSettings().init();
});
</script>

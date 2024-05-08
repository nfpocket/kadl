<template>
  <div class="h-screen overflow-hidden">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <ContextMenu />
  </div>
</template>

<script setup lang="ts">
useCustomTabKey();
</script>

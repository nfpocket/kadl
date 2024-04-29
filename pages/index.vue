<template>
  <div class="p-4 flex flex-col gap-8">
    <div class="font-semibold text-5xl">Kadl</div>

    <UButton v-if="user" to="/notes" icon="i-tabler-note" label="Go to your notes" />
    <UButton v-else to="/auth/login" icon="i-tabler-login" label="Login" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Home",
});

const user = useSupabaseUser();
</script>

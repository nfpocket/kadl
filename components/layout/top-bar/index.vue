<template>
  <div class="border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
    <div class="flex items-center gap-1 w-full">
      <NuxtLink to="/" class="font-semibold text-3xl p-2 select-none cursor-pointer">Kadl</NuxtLink>

      <div class="ml-auto flex items-center gap-4 mr-2">
        <button v-if="user" @click="handleLogout" class="hover:underline">Logout</button>

        <ThemeToggle />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const handleLogout = async () => {
  await supabase.auth.signOut();
};
</script>

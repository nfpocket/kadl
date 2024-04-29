<template>
  <UCard>
    <template #header> <USkeleton class="h-4 w-[150px]" /> </template>

    <div class="flex flex-col gap-2">
      <USkeleton class="h-4 w-[250px]" />
      <USkeleton class="h-4 w-[200px]" />
    </div>
  </UCard>
</template>

<script setup lang="ts"></script>

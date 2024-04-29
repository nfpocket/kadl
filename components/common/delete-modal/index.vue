<template>
  <UModal :model-value="true" @close="emit('cancel')">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header> {{ title }} </template>

      {{ description }}

      <template #footer>
        <div class="flex flex-row-reverse">
          <div class="flex items-center gap-4">
            <UButton label="Cancel" color="gray" variant="solid" :disabled="loading" @click="emit('cancel')" />
            <UButton label="Delete" color="red" variant="solid" :loading="loading" @click="emit('delete')" />
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  loading: boolean;
}>();
const emit = defineEmits<{
  (event: "cancel"): void;
  (event: "delete"): void;
}>();
</script>

<template>
  <NotesDayCard v-if="noteDay" :note-day="noteDay" class="w-full h-full" />
  <NotesDayCardSkeleton v-else-if="noteDaysApi.loading.value" class="w-full h-full" />

  <UCard v-else>
    <template #header>
      <div class="text-xl">Note not found</div>
    </template>

    <div class="flex flex-col items-center gap-6">
      <div class="text-5xl font-bold">404</div>

      <div>Day not found</div>

      <UButton icon="i-tabler-arrow-left" label="go back " @click="$router.back()" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Tables } from "~/types/supabase";

const route = useRoute();
const noteId = computed(() => Number(route.params.id));

const noteDaysApi = useNoteDaysApi();

const noteDay = ref<Tables<"note_days"> | null>(null);

const loadNoteDay = async () => {
  noteDay.value = await noteDaysApi.getNoteDayById(noteId.value);
};

loadNoteDay();
</script>

<template>
  <NotesNoteCard v-if="note" :note="note" class="w-full h-full" />
  <NotesNoteCardSkeleton v-else-if="notesApi.loading.value" class="w-full h-full" />

  <UCard v-else>
    <template #header>
      <div class="text-xl">Note not found</div>
    </template>

    <div class="flex flex-col items-center gap-6">
      <div class="text-5xl font-bold">404</div>

      <div>Day not found</div>

      <UButton to="/notes" icon="i-tabler-arrow-left" label="go back " />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Tables } from "~/types/supabase";

const route = useRoute();
const noteId = computed(() => Number(route.params.id));

const notesApi = useNotesApi();

const note = ref<Tables<"notes"> | null>(null);

const loadNoteDay = async () => {
  note.value = await notesApi.getNoteById(noteId.value);
};

loadNoteDay();
</script>

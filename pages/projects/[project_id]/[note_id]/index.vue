<template>
  <NotesNoteCard v-if="note" :note="note" class="w-full h-full" />
  <NotesNoteCardSkeleton v-else-if="notesApi.loading.value" class="w-full h-full" />

  <UCard v-else>
    <template #header>
      <div class="text-xl">Note not found</div>
    </template>

    <div class="flex flex-col items-center gap-6">
      <div class="text-5xl font-bold">404</div>

      <div>Note not found</div>

      <UButton to="/projects" icon="i-tabler-arrow-left" label="back to projects" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Tables } from "~/types/supabase";

const { noteId } = useParams();

const notesApi = useNotesApi();

const note = ref<Tables<"notes"> | null>(null);

const loadNote = async () => {
  if (noteId.value === null) return;

  note.value = await notesApi.getNoteById(noteId.value);
};

loadNote();
</script>

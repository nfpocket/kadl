<template>
  <UCard :ui="{ base: 'flex flex-col', body: { base: 'flex-1 flex flex-col overflow-auto', padding: '!px-0 py-5' } }">
    <template #header>
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-4">
          <div class="truncate">{{ format(new Date(noteDay.date), "'Notes from:' dd.MM.yyyy") }}</div>

          <UButton icon="i-tabler-arrow-left" label="Back" size="xs" color="gray" variant="solid" square @click="$router.back()" />
        </div>
        <div class="flex items-center justify-between gap-2">
          <UInput placeholder="Title" variant="seamless" size="xl" class="w-full" v-model="title" @update:model-value="handleUpdateTitle" />

          <DeleteModal
            v-if="showDeleteModal"
            :loading="noteDaysApi.loading.value"
            title="Are you sure you want to delete this day?"
            description="By deleting this day, all notes and subnotes will be deleted as well."
            @cancel="showDeleteModal = false"
            @delete="handleDelete"
          />
          <UButton icon="i-tabler-trash" size="xs" color="gray" variant="solid" square @click="requestDelete" />
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-6">
      <label class="flex flex-col gap-2 px-6">
        <span class="text-xs">Description</span>
        <UTextarea
          placeholder="Describe the note"
          variant="seamless"
          class="w-full"
          :rows="8"
          :autoresize="true"
          v-model="description"
          @update:model-value="handleUpdateDescription"
        />
      </label>

      <div class="flex flex-col gap-4">
        <span class="text-xs px-6">Subnotes</span>

        <div class="flex flex-col">
          <div v-if="loadingSubNotes && !subnotes.length">
            <NotesDayCardSubNoteSkeleton v-for="i in 5" :key="i" />
          </div>

          <NotesDayCardSubNote
            v-for="subnote in subnotes"
            :key="subnote.id"
            :note="subnote"
            @deleted="handleRemoveSubnote(subnote)"
            @add-after="handleAddNewAfter(subnote)"
          />
        </div>

        <div class="px-6">
          <UButton label="Add note" icon="i-tabler-plus" :block="false" color="gray" variant="solid" @click="handleAddNote" />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Tables } from "~/types/supabase";
import { format } from "date-fns";

const props = defineProps<{
  noteDay: Tables<"note_days">;
}>();

const noteDaysApi = useNoteDaysApi();
const notesApi = useNotesApi();

const subnotes = ref<Tables<"notes">[]>([]);
const loadingSubNotes = ref(false);

const title = ref(props.noteDay.title ?? "");
const description = ref(props.noteDay.description ?? "");

const handleUpdateTitle = throttle(async (value: string) => {
  const updatedNote = await noteDaysApi.updateNoteDay(props.noteDay.id, {
    title: value,
  });

  if (!updatedNote) {
    title.value = props.noteDay.title ?? "";
    return;
  }

  props.noteDay.title = updatedNote.title;
});

const handleUpdateDescription = throttle(async (value: string) => {
  const updatedNote = await noteDaysApi.updateNoteDay(props.noteDay.id, {
    description: value,
  });

  if (!updatedNote) {
    description.value = props.noteDay.description ?? "";
    return;
  }

  props.noteDay.description = updatedNote.description;
});

const handleAddNote = async () => {
  const newSubnote = await notesApi.createNoteFromDay(props.noteDay.id, {
    date: new Date().toISOString(),
  });
  if (!newSubnote) return;
  subnotes.value.push(newSubnote);
};

const loadSubNotes = async () => {
  loadingSubNotes.value = true;
  subnotes.value = await notesApi.getNotesOfDay(props.noteDay.id);
  loadingSubNotes.value = false;
};

const handleRemoveSubnote = (subnote: Tables<"notes">) => {
  subnotes.value = subnotes.value.filter((note) => note.id !== subnote.id);
};

const handleAddNewAfter = async (subnote: Tables<"notes">) => {
  const index = subnotes.value.findIndex((note) => note.id === subnote.id);
  const newSubnote = await notesApi.createNoteFromDay(props.noteDay.id, {
    date: new Date().toISOString(),
  });
  if (!newSubnote) return;

  subnotes.value.splice(index + 1, 0, newSubnote);
};

loadSubNotes();

const router = useRouter();
const showDeleteModal = ref(false);
const requestDelete = () => {
  showDeleteModal.value = true;
};
const handleDelete = async () => {
  const deleted = await noteDaysApi.deleteNoteDay(props.noteDay.id);
  if (!deleted) return;

  router.push("/notes");
  useToasts().success("Note day deleted successfully");
};
</script>

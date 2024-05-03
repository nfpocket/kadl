<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between px-6">
      <span>Subnotes</span>

      <NotesNoteCardSubNoteFilterPopover v-model="userSettings.filterOptions" />
    </div>

    <div class="flex flex-col">
      <div v-if="loadingSubNotes && !openSubnotes.length">
        <NotesNoteCardSubNoteSkeleton v-for="i in 5" :key="i" />
      </div>

      <div v-if="!loadingSubNotes && !openSubnotes.length" class="px-6">
        <div class="text-sm opacity-50 italic">No open notes</div>
      </div>

      <VueDraggable
        :disabled="userSettings.filterOptions.sortBy !== 'none'"
        key="id"
        :animation="150"
        handle=".handle"
        v-model="filteredAndSortedSubnotes"
        @update="handleNotesOrder"
      >
        <NotesNoteCardSubNote
          v-for="subnote in openSubnotes"
          :key="subnote.id"
          :note="subnote"
          @deleted="handleRemoveSubnote(subnote)"
          @add-after="handleAddNewAfter(subnote)"
          @priority-updated="handleUpdateFilteredAndSortedSubnotes"
          :can-drag="userSettings.filterOptions.sortBy === 'none'"
        />
      </VueDraggable>
    </div>

    <div class="px-6">
      <UButton label="Add note" icon="i-tabler-plus" :block="false" color="gray" variant="solid" @click="handleAddNote" />
    </div>
  </div>

  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between px-6">
      <span>Completed notes</span>
    </div>

    <div class="flex flex-col">
      <div v-if="loadingSubNotes && !completedSubnotes.length">
        <NotesNoteCardSubNoteSkeleton v-for="i in 5" :key="i" />
      </div>

      <div v-if="!loadingSubNotes && !completedSubnotes.length" class="px-6">
        <div class="text-sm opacity-50 italic">No completed notes</div>
      </div>

      <NotesNoteCardSubNote
        v-for="completedSubnote in completedSubnotes"
        :key="completedSubnote.id"
        :note="completedSubnote"
        @deleted="handleRemoveSubnote(completedSubnote)"
        @add-after="handleAddNewAfter(completedSubnote)"
        @priority-updated="handleUpdateFilteredAndSortedSubnotes"
        :can-drag="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable, type SortableEvent } from "vue-draggable-plus";
import type { Tables } from "~/types/supabase";

const props = defineProps<{
  note: Tables<"notes">;
}>();

const notesApi = useNotesApi();
const { userSettings } = useUserSettings();

const subnotes = ref<Tables<"notes">[]>([]);
const loadingSubNotes = ref(false);

const filteredAndSortedSubnotes = ref<Tables<"notes">[]>([]);
const openSubnotes = computed(() => filteredAndSortedSubnotes.value.filter((note) => !note.completed));
const completedSubnotes = computed(() => filteredAndSortedSubnotes.value.filter((note) => note.completed));

const filterAndSortSubnotes = () => {
  const sortBy = userSettings.value.filterOptions.sortBy;
  const sortOrder = userSettings.value.filterOptions.sortOrder;

  if (sortBy === "none") return subnotes.value;

  const handleSortByPriority = (a: Tables<"notes">, b: Tables<"notes">) => {
    const aPriority = getPriotiryNumber(a.priority);
    const bPriority = getPriotiryNumber(b.priority);

    return sortOrder === "asc" ? aPriority - bPriority : bPriority - aPriority;
  };

  return subnotes.value.toSorted((a, b) => {
    if (sortBy === "priority") {
      return handleSortByPriority(a, b);
    }

    return 0;
  });
};

const handleUpdateFilteredAndSortedSubnotes = () => {
  filteredAndSortedSubnotes.value = filterAndSortSubnotes();
};

watch(
  () => userSettings.value.filterOptions,
  () => {
    handleUpdateFilteredAndSortedSubnotes();
  },
  {
    deep: true,
  }
);

const handleAddNote = async () => {
  const newSubnote = await notesApi.createNoteFromNote(props.note.id, {
    order: subnotes.value.length,
  });
  if (!newSubnote) return;
  subnotes.value.push(newSubnote);
  handleUpdateFilteredAndSortedSubnotes();
};

const loadSubNotes = async () => {
  loadingSubNotes.value = true;
  subnotes.value = await notesApi.getNotesOfParent(props.note.id);
  handleUpdateFilteredAndSortedSubnotes();
  loadingSubNotes.value = false;
};

const handleRemoveSubnote = (subnote: Tables<"notes">) => {
  subnotes.value = subnotes.value.filter((note) => note.id !== subnote.id);
  handleUpdateFilteredAndSortedSubnotes();
};

const handleAddNewAfter = async (subnote: Tables<"notes">) => {
  const index = subnotes.value.findIndex((note) => note.id === subnote.id);
  const newSubnote = await notesApi.createNoteFromNote(props.note.id);
  if (!newSubnote) return;

  subnotes.value.splice(index + 1, 0, newSubnote);
  handleUpdateFilteredAndSortedSubnotes();

  const notesToUpdate = subnotes.value.slice(index + 1);
  const noteIds = notesToUpdate.map((note) => note.id);
  const noteOrderIndexes = notesToUpdate.map((_note, i) => i + index);

  notesApi.updateNotesOrder(noteIds, noteOrderIndexes);
};

const handleNotesOrder = async (event: SortableEvent) => {
  const from = event.oldIndex;
  const to = event.newIndex;

  if (from === undefined || to === undefined) return;

  const correctedFromIndex = Math.min(from, to);
  const correctedToIndex = Math.max(from, to) + 1;

  const notesToUpdate = filteredAndSortedSubnotes.value.slice(correctedFromIndex, correctedToIndex);

  const noteIds = notesToUpdate.map((note) => note.id);
  const noteOrders = notesToUpdate.map((_note, index) => correctedFromIndex + index);

  notesApi.updateNotesOrder(noteIds, noteOrders);
};

loadSubNotes();
</script>

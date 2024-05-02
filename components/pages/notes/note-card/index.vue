<template>
  <UCard :ui="{ base: 'flex flex-col', body: { base: 'flex-1 flex flex-col overflow-auto', padding: '!px-0 py-5' } }">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <UButton
            icon="i-tabler-check"
            size="xs"
            :label="note.checked ? 'Completed' : 'Mark completed'"
            :variant="note.checked ? 'soft' : 'outline'"
            color="green"
            @click="handleUpdateChecked"
          />

          <UBreadcrumb :links="breadcrumbs" />
        </div>

        <div class="flex items-center gap-2">
          <UButton :to="backRoutePath" icon="i-tabler-arrow-left" label="Back" size="xs" color="gray" variant="solid" square />

          <div>
            <DeleteModal
              v-if="showDeleteModal"
              :loading="notesApi.loading.value"
              title="Are you sure you want to delete this day?"
              description="By deleting this day, all notes and subnotes will be deleted as well."
              @cancel="showDeleteModal = false"
              @delete="handleDelete"
            />
            <UButton icon="i-tabler-trash" size="xs" color="gray" variant="solid" square @click="requestDelete" />
          </div>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-6">
      <div class="px-6">
        <UInput
          placeholder="Title"
          variant="seamless"
          size="xl"
          class="w-full"
          input-class="text-3xl"
          v-model="title"
          @update:model-value="handleUpdateTitle"
        />
      </div>

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

          <VueDraggable v-model="subnotes" :animation="150" handle=".handle" @update="handleNotesOrder">
            <NotesDayCardSubNote
              v-for="subnote in subnotes"
              :key="subnote.id"
              :note="subnote"
              @deleted="handleRemoveSubnote(subnote)"
              @add-after="handleAddNewAfter(subnote)"
            />
          </VueDraggable>
        </div>

        <div class="px-6">
          <UButton label="Add note" icon="i-tabler-plus" :block="false" color="gray" variant="solid" @click="handleAddNote" />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { QueryData } from "@supabase/supabase-js";
import { format } from "date-fns";
import { VueDraggable, type SortableEvent } from "vue-draggable-plus";
import type { Tables } from "~/types/supabase";

type BreakdcrumbLink = { id: number; label: string; to: string; icon?: string };

const props = defineProps<{
  note: Tables<"notes">;
}>();

const { projectId, dayId } = useParams();
const getNextItemRoute = (noteId: number) => {
  if (projectId.value === null || dayId.value === null) return "/projects";

  return `/projects/${projectId.value}/${dayId.value}/${noteId}`;
};

const notesApi = useNotesApi();

const subnotes = ref<Tables<"notes">[]>([]);
const loadingSubNotes = ref(false);

const title = ref(props.note.title ?? "");
const description = ref(props.note.description ?? "");

const backRoutePath = computed(() => {
  if (props.note.parent_note_id) {
    return `/projects/${projectId.value}/${dayId.value}/${props.note.parent_note_id}`;
  }

  return `/projects/${projectId.value}/${dayId.value}`;
});

const { META_BACKSPACE, CTRL_BACKSPACE } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (!(META_BACKSPACE.value || CTRL_BACKSPACE.value)) return;
    e.preventDefault();
  },
});
whenever(
  () => META_BACKSPACE.value || CTRL_BACKSPACE.value,
  () => {
    navigateTo(backRoutePath.value);
  }
);

const handleUpdateChecked = async () => {
  const updatedNote = await notesApi.updateNote(props.note.id, {
    checked: !props.note.checked,
  });

  if (!updatedNote) return;

  props.note.checked = updatedNote.checked;
};

const handleUpdateTitle = throttle(async (value: string) => {
  const updatedNote = await notesApi.updateNote(props.note.id, {
    title: value,
  });

  if (!updatedNote) {
    title.value = props.note.title ?? "";
    return;
  }

  props.note.title = updatedNote.title;
});

const handleUpdateDescription = throttle(async (value: string) => {
  const updatedNote = await notesApi.updateNote(props.note.id, {
    description: value,
  });

  if (!updatedNote) {
    description.value = props.note.description ?? "";
    return;
  }

  props.note.description = updatedNote.description;
});

const handleAddNote = async () => {
  const newSubnote = await notesApi.createNoteFromNote(props.note.id, {
    date: new Date().toISOString(),
    order: subnotes.value.length,
  });
  if (!newSubnote) return;
  subnotes.value.push(newSubnote);
};

const loadSubNotes = async () => {
  loadingSubNotes.value = true;
  subnotes.value = await notesApi.getNotesOfParent(props.note.id);
  loadingSubNotes.value = false;
};

const handleRemoveSubnote = (subnote: Tables<"notes">) => {
  subnotes.value = subnotes.value.filter((note) => note.id !== subnote.id);
};

const handleAddNewAfter = async (subnote: Tables<"notes">) => {
  const index = subnotes.value.findIndex((note) => note.id === subnote.id);
  const newSubnote = await notesApi.createNoteFromNote(props.note.id, {
    date: new Date().toISOString(),
  });
  if (!newSubnote) return;

  subnotes.value.splice(index + 1, 0, newSubnote);

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

  const notesToUpdate = subnotes.value.slice(correctedFromIndex, correctedToIndex);

  const noteIds = notesToUpdate.map((note) => note.id);
  const noteOrders = notesToUpdate.map((_note, index) => correctedFromIndex + index);

  notesApi.updateNotesOrder(noteIds, noteOrders);
};

const breadcrumbs = ref<BreakdcrumbLink[]>([]);
const loadBreadcrumbs = async () => {
  const parents = await notesApi.loadAllNoteParents(props.note.id);
  if (!parents) return;

  const dayParent = parents.find((parent) => parent.day_id !== null);

  if (!dayParent) return;

  const client = useNoteDaysApi().getClient();
  const rawQuery = "id, title, date, projects (id, title)";
  const query = client.select(rawQuery);

  type NoteDayWithProject = QueryData<typeof query>[number];

  const day = await useNoteDaysApi().getNoteDayById<NoteDayWithProject>(dayParent.day_id, rawQuery);
  const project = day?.projects;

  if (!day || !project) return;

  breadcrumbs.value = parents.reverse().map((parent) => ({
    id: parent.id,
    label: parent.title,
    to: `/projects/${project.id}/${day.id}/${parent.id}`,
    icon: "i-tabler-note",
  }));

  breadcrumbs.value.unshift({
    id: day.id,
    label: day.title || `Day ${format(new Date(day.date), "dd MMMM yyyy")}`,
    to: `/projects/${project.id}/${day.id}`,
    icon: "i-tabler-calendar",
  });

  breadcrumbs.value.unshift({
    id: project.id,
    label: project.title || `Project ${project.id}`,
    to: `/projects/${project.id}`,
    icon: "i-tabler-stack",
  });
};

loadSubNotes();
loadBreadcrumbs();

const showDeleteModal = ref(false);
const requestDelete = () => {
  showDeleteModal.value = true;
};
const handleDelete = async () => {
  const deleted = await notesApi.deleteNote(props.note.id);
  if (!deleted) return;

  navigateTo(backRoutePath.value);
  useToasts().success("Note  deleted successfully");
};
</script>

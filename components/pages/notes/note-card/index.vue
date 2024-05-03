<template>
  <UCard
    :ui="{
      base: 'flex flex-col',
      header: { base: `${getPriorityBackgroundClass(note.priority, false)} rounded-tl-lg rounded-tr-lg` },
      body: { base: 'flex-1 flex flex-col overflow-auto', padding: '!px-0 py-5' },
    }"
  >
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <UButton
            icon="i-tabler-check"
            size="xs"
            :label="note.completed ? 'Completed' : 'Mark completed'"
            :variant="note.completed ? 'soft' : 'outline'"
            color="green"
            @click="handleUpdateChecked"
          />
        </div>

        <div class="flex items-center flex-1 overflow-auto">
          <UBreadcrumb :links="breadcrumbs" />
        </div>

        <div class="flex items-center gap-2">
          <NotesPriorityButton :note="props.note" />

          <UButton :to="backRoutePath" icon="i-tabler-arrow-left" label="Back" size="xs" color="gray" variant="solid" square />

          <div>
            <DeleteModal
              v-if="showDeleteModal"
              :loading="notesApi.loading.value"
              title="Are you sure you want to delete this note?"
              description="By deleting this note, all connected notes and subnotes will be deleted as well."
              @cancel="showDeleteModal = false"
              @delete="handleDelete"
            />
            <UTooltip text="Delete note">
              <UButton icon="i-tabler-trash" size="xs" color="gray" variant="solid" square @click="requestDelete" />
            </UTooltip>
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
          :rows="4"
          :autoresize="true"
          v-model="description"
          @update:model-value="handleUpdateDescription"
        />
      </label>

      <NotesNoteCardSubNotes :note="note" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { QueryData } from "@supabase/supabase-js";
import type { Tables } from "~/types/supabase";

type BreakdcrumbLink = { id: number; label: string; to: string; icon?: string };

const props = defineProps<{
  note: Tables<"notes">;
}>();

const { projectId } = useParams();

const notesApi = useNotesApi();

const title = ref(props.note.title ?? "");
const description = ref(props.note.description ?? "");

const backRoutePath = computed(() => {
  if (props.note.parent_note_id) {
    return `/projects/${projectId.value}/${props.note.parent_note_id}`;
  }

  return `/projects/${projectId.value}`;
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
    completed: !props.note.completed,
  });

  if (!updatedNote) return;

  props.note.completed = updatedNote.completed;
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

const breadcrumbs = ref<BreakdcrumbLink[]>([]);
const loadBreadcrumbs = async () => {
  const parents = await notesApi.loadAllNoteParents(props.note.id);
  if (!parents) return;

  const projectParent = parents.find((parent) => parent.project_id !== null);

  if (!projectParent) return;

  const client = useNotesApi().getClient();
  const rawQuery = "id, title, projects (id, title)";
  const query = client.select(rawQuery);

  type NoteWithProject = QueryData<typeof query>[number];

  const note = await useNotesApi().getNoteById<NoteWithProject>(projectParent.id, rawQuery);
  const project = note?.projects;

  if (!project) return;

  breadcrumbs.value = parents.reverse().map((parent) => ({
    id: parent.id,
    label: parent.id === props.note.id ? "Current" : parent.title,
    to: `/projects/${project.id}/${parent.id}`,
    icon: "i-tabler-note",
  }));

  breadcrumbs.value.unshift({
    id: project.id,
    label: project.title || `Project ${project.id}`,
    to: `/projects/${project.id}`,
    icon: "i-tabler-stack",
  });
};

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

<template>
  <div class="flex flex-col gap-4 h-full">
    <div class="flex items-center justify-between">
      <div class="flex-1 flex items-center gap-2">
        <div class="bold text-3xl flex items-center gap-2">
          <USkeleton v-if="projectsApi.loading.value" class="w-[300px] h-6" />
          <span v-else>Project {{ project?.title || projectId }}</span>
        </div>
        <NotesAddButton @add="handleCreateNewNote" />
      </div>
      <UButton to="/projects" icon="i-tabler-arrow-left" label="Back" size="xs" color="gray" variant="solid" square />
    </div>

    <div class="flex flex-col gap-4 p-1 overflow-auto">
      <DeleteModal
        v-if="!!requestedNoteToDelete"
        :loading="notesApi.loading.value"
        title="Are you sure you want to delete this project?"
        description="By deleting this project, all connected notes and subnotes will be deleted as well."
        @cancel="requestedNoteToDelete = null"
        @delete="handleDeleteNote"
      />

      <NuxtLink v-for="note in notes" :key="note.id" :to="`/projects/${projectId}/${note.id}`" @contextmenu.stop.prevent="handleContextMenu($event, note)">
        <UCard class="card">
          <div>
            <div class="text-xs">Created at {{ format(new Date(note.created_at), "dd.MM.yyyy HH:mm") }}</div>

            <div class="line-clamp-2">
              <span v-if="note.title" class="text-xl">{{ note.title }}</span>
              <span v-else class="text-xl italic opacity-50">Title</span>
            </div>

            <div class="line-clamp-3">
              <span v-if="note.description" class="">{{ note.description }}</span>
              <span v-else class="italic opacity-50">Description</span>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <template v-if="!notes.length && notesApi.loading.value">
        <NotesSkeleton v-for="i in 10" :key="i" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import type { MenuItem } from "~/composables/contextmenu";
import { useToasts } from "~/composables/toasts";
import type { Tables } from "~/types/supabase";

useHead({
  title: "Notes",
});

const { projectId } = useParams();

const toasts = useToasts();
const notesApi = useNotesApi();
const projectsApi = useProjectsApi();

const notes = ref<Tables<"notes">[]>([]);
const project = ref<Tables<"projects"> | null>(null);

const loadProjectData = async () => {
  if (projectId.value === null) return;

  project.value = await projectsApi.getProjectById(projectId.value);
};

const loadNotes = async () => {
  if (projectId.value === null) return;

  notes.value = await notesApi.getNotesOfProject(projectId.value);
};

const handleCreateNewNote = async () => {
  if (projectId.value === null) return;

  const newNote = await notesApi.createNoteFromProject(projectId.value);

  if (!newNote) return;

  toasts.success("Note created successfully");

  navigateTo(`/projects/${projectId.value}/${newNote.id}`);
};

const requestedNoteToDelete = ref<Tables<"notes"> | null>(null);
const requestDelete = (note: Tables<"notes">) => {
  requestedNoteToDelete.value = note;
};
const handleDeleteNote = async () => {
  if (!requestedNoteToDelete.value) return;

  const deleted = await notesApi.deleteNote(requestedNoteToDelete.value.id);

  if (!deleted) {
    requestedNoteToDelete.value = null;
    return;
  }

  notes.value = notes.value.filter((n) => n.id !== requestedNoteToDelete.value!.id);
  toasts.success("Note deleted successfully");

  requestedNoteToDelete.value = null;
};

const contextMenu = useContextMenu();

const handleContextMenu = (event: MouseEvent, note: Tables<"notes">) => {
  const menuItems: MenuItem[] = [
    {
      type: "link",
      label: "View",
      icon: "i-tabler-eye",
      to: `/projects/${projectId.value}/${note.id}`,
    },
    {
      type: "divider",
    },
    {
      type: "action",
      label: "Delete",
      action: () => requestDelete(note),
      icon: "i-tabler-trash",
    },
  ];

  contextMenu.show(event, menuItems);
};

loadNotes();
loadProjectData();
</script>

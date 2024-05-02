<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="bold text-3xl">Project {{ project?.title || projectId }}</div>
      <UButton to="/projects" icon="i-tabler-arrow-left" label="Back" size="xs" color="gray" variant="solid" square />
    </div>

    <div class="flex flex-wrap gap-4">
      <DeleteModal
        v-if="!!requestedNoteDayToDelete"
        :loading="noteDaysApi.loading.value"
        title="Are you sure you want to delete this day?"
        description="By deleting this day, all notes and subnotes will be deleted as well."
        @cancel="requestedNoteDayToDelete = null"
        @delete="handleDeleteNoteDay"
      />

      <NuxtLink
        v-for="noteDay in noteDays"
        :key="noteDay.id"
        :to="`/projects/${projectId}/${noteDay.id}`"
        @contextmenu.stop.prevent="handleContextMenu($event, noteDay)"
      >
        <UCard class="card">
          <div class="flex flex-col gap-2">
            <div class="text-sm">{{ format(new Date(noteDay.date), "dd.MM.yyyy") }}</div>
            <UInput
              placeholder="Title"
              variant="seamless"
              size="xl"
              class="w-full"
              input-class="text-xl"
              :model-value="noteDay.title || ''"
              @update:model-value="handleUpdateTitle($event, noteDay)"
              @click.stop.prevent
              @keydown.enter="navigateTo(`/projects/${projectId}/${noteDay.id}`)"
            />
          </div>
        </UCard>
      </NuxtLink>
      <NotesDayCardAddButton @add="handleCreateNewNote(AddPanelsNote.RightMost)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { add, format, sub } from "date-fns";
import type { MenuItem } from "~/composables/contextmenu";
import { useToasts } from "~/composables/toasts";
import type { Tables } from "~/types/supabase";
import { AddPanelsNote } from "~/utils/notes";

useHead({
  title: "Notes",
});

const { projectId } = useParams();

const toasts = useToasts();
const noteDaysApi = useNoteDaysApi();
const projectsApi = useProjectsApi();

const noteDays = ref<Tables<"note_days">[]>([]);
const project = ref<Tables<"projects"> | null>(null);

const loadProjectData = async () => {
  if (projectId.value === null) return;

  project.value = await projectsApi.getProjectById(projectId.value);
};

const loadNoteDays = async () => {
  if (projectId.value === null) return;

  noteDays.value = await noteDaysApi.getNoteDaysByProjectId(projectId.value);
};

const handleCreateNewNote = async (insertAt: AddPanelsNote) => {
  if (projectId.value === null) return;

  const newNoteDate =
    insertAt === AddPanelsNote.CenterMost || !noteDays.value.length
      ? new Date()
      : insertAt === AddPanelsNote.LeftMost
      ? sub(new Date(noteDays.value[0].date), { days: 1 })
      : add(new Date(noteDays.value[noteDays.value.length - 1].date), { days: 1 });

  const newNoteDay = await noteDaysApi.createNoteDay({
    date: newNoteDate.toISOString(),
    project_id: projectId.value,
  });

  if (!newNoteDay) return;

  toasts.success("Note day created successfully");

  navigateTo(`/projects/${projectId.value}/${newNoteDay.id}`);
};

const handleUpdateTitle = throttle(async (value: string, noteDay: Tables<"note_days">) => {
  noteDaysApi.updateNoteDay(noteDay.id, {
    title: value,
  });
});

const requestedNoteDayToDelete = ref<Tables<"note_days"> | null>(null);
const requestDelete = (noteDay: Tables<"note_days">) => {
  requestedNoteDayToDelete.value = noteDay;
};
const handleDeleteNoteDay = async () => {
  if (!requestedNoteDayToDelete.value) return;

  const deleted = await noteDaysApi.deleteNoteDay(requestedNoteDayToDelete.value.id);

  if (!deleted) {
    requestedNoteDayToDelete.value = null;
    return;
  }

  noteDays.value = noteDays.value.filter((n) => n.id !== requestedNoteDayToDelete.value!.id);
  toasts.success("Note day deleted successfully");

  requestedNoteDayToDelete.value = null;
};

const contextMenu = useContextMenu();

const handleContextMenu = (event: MouseEvent, noteDay: Tables<"note_days">) => {
  const menuItems: MenuItem[] = [
    {
      type: "link",
      label: "View",
      icon: "i-tabler-eye",
      to: `/projects/${projectId.value}/${noteDay.id}`,
    },
    {
      type: "divider",
    },
    {
      type: "action",
      label: "Delete",
      action: () => requestDelete(noteDay),
      icon: "i-tabler-trash",
    },
  ];

  contextMenu.show(event, menuItems);
};

loadNoteDays();
loadProjectData();
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-4">
      <DeleteModal
        v-if="!!requestedNoteDayToDelete"
        :loading="noteDaysApi.loading.value"
        title="Are you sure you want to delete this day?"
        description="By deleting this day, all notes and subnotes will be deleted as well."
        @cancel="requestedNoteDayToDelete = null"
        @delete="handleDeleteNoteDay"
      />

      <NuxtLink v-for="noteDay in noteDays" :key="noteDay.id" :to="`/notes/day/${noteDay.id}`" @contextmenu.stop.prevent="handleContextMenu($event, noteDay)">
        <UCard class="card">
          <div class="flex flex-col gap-2">
            <div class="text-sm">{{ format(new Date(noteDay.date), "dd.MM.yyyy") }}</div>
            <div class="text-xl">
              <span v-if="noteDay.title">{{ noteDay.title }}</span>
              <span v-else class="italic opacity-75">Title</span>
            </div>
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

const toasts = useToasts();
const noteDaysApi = useNoteDaysApi();

const noteDays = ref<Tables<"note_days">[]>([]);

const loadNoteDays = async () => {
  noteDays.value = await noteDaysApi.getNoteDays();
};

const handleCreateNewNote = async (insertAt: AddPanelsNote) => {
  const newNoteDate =
    insertAt === AddPanelsNote.CenterMost || !noteDays.value.length
      ? new Date()
      : insertAt === AddPanelsNote.LeftMost
      ? sub(new Date(noteDays.value[0].date), { days: 1 })
      : add(new Date(noteDays.value[noteDays.value.length - 1].date), { days: 1 });

  const newNoteDay = await noteDaysApi.createNoteDay({
    date: newNoteDate.toISOString(),
  });

  if (!newNoteDay) return;

  toasts.success("Note day created successfully");

  useRouter().push(`/notes/day/${newNoteDay.id}`);
};

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
      to: `/notes/day/${noteDay.id}`,
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
</script>

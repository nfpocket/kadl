<template>
  <div
    class="flex items-center group gap-2 hover:bg-gray-500/10 focus-within:!bg-cornflower-blue-500/20 last-of-type:border-b-0 border-b-[1px] border-y-gray-500/25"
    @contextmenu.prevent.stop="onContextMenu"
    @dblclick="navigateTo(`/notes/note/${note.id}`)"
  >
    <DeleteModal
      v-if="showDeleteModal"
      :loading="notesApi.loading.value"
      title="Are you sure you want to delete this day?"
      description="By deleting this day, all notes and subnotes will be deleted as well."
      @cancel="showDeleteModal = false"
      @delete="handleDelete"
    />
    <UIcon name="i-heroicons-bars-4" class="ml-1 opacity-0 group-hover:opacity-50 cursor-grab handle" />
    <UCheckbox :model-value="note.checked" @update:model-value="handleUpdateChecked" />
    <UInput
      :class="note.checked ? 'line-through opacity-35' : ''"
      placeholder="Title"
      variant="none"
      autofocus
      class="w-full"
      :model-value="note.title || ''"
      @update:model-value="handleUpdateTitle"
      @keydown.enter="handleEnter"
    />

    <UButton :to="`/notes/note/${note.id}`" icon="i-tabler-chevron-right" size="sm" color="gray" variant="ghost" square />
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/composables/contextmenu";
import type { Tables } from "~/types/supabase";

const props = defineProps<{
  note: Tables<"notes">;
}>();

const emit = defineEmits<{ (event: "addAfter"): void; (event: "deleted"): void }>();

const notesApi = useNotesApi();

const handleUpdateTitle = throttle((title: string) => {
  notesApi.updateNote(props.note.id, { title });
});

const handleUpdateChecked = (checked: boolean) => {
  notesApi.updateNote(props.note.id, { checked });
};

const handleEnter = () => {
  emit("addAfter");
};

const contextMenu = useContextMenu();

const onContextMenu = (event: MouseEvent) => {
  const menuItems: MenuItem[] = [
    {
      type: "link",
      label: "View",
      icon: "i-tabler-eye",
      to: `/notes/note/${props.note.id}`,
    },
    {
      type: "divider",
    },
    {
      type: "action",
      label: "Delete",
      action: () => requestDelete(),
      icon: "i-tabler-trash",
    },
  ];

  contextMenu.show(event, menuItems);
};

const showDeleteModal = ref(false);
const requestDelete = () => {
  showDeleteModal.value = true;
};
const handleDelete = () => {
  notesApi.deleteNote(props.note.id);
  showDeleteModal.value = false;
  emit("deleted");
};
</script>

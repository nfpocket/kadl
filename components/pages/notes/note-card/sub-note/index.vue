<template>
  <div
    class="flex items-center group gap-2 hover:bg-gray-500/10 focus-within:!bg-cornflower-blue-500/20 last-of-type:border-b-0 border-b-[1px] border-y-gray-500/25"
    :class="priorityClass"
    @contextmenu.prevent.stop="onContextMenu"
  >
    <!-- @dblclick="navigateTo(getNextItemRoute(note.id))" -->
    <DeleteModal
      v-if="showDeleteModal"
      :loading="notesApi.loading.value"
      title="Are you sure you want to delete this note?"
      description="By deleting this note, all connected notes and subnotes will be deleted as well."
      @cancel="showDeleteModal = false"
      @delete="handleDelete"
    />
    <UIcon name="i-heroicons-bars-4" class="ml-1 opacity-0 text-black dark:text-white handle" :class="canDrag ? 'group-hover:opacity-50 cursor-grab' : ''" />
    <UCheckbox :model-value="note.completed" @update:model-value="handleUpdateCompleted" />
    <UInput
      :class="note.completed ? 'line-through opacity-35' : ''"
      placeholder="Title"
      variant="none"
      :autofocus="false"
      class="w-full"
      input-class="subnote"
      :model-value="note.title || ''"
      @update:model-value="handleUpdateTitle"
      @keydown="handleKeydown"
    />

    <div class="flex items-center">
      <UTooltip :text="`Priority ${getPriorityLabel(note.priority)}`">
        <UDropdown :items="[priorityOptions.map((option) => ({ ...option, click: () => handleUpdatePriority(option) }))]" :popper="{ arrow: true }">
          <UButton icon="i-tabler-exclamation-mark" :class="getPriorityIconClass(note.priority)" size="sm" color="gray" variant="ghost" square />
        </UDropdown>
      </UTooltip>
      <UTooltip text="Go to note">
        <UButton :to="getNextItemRoute(note.id)" icon="i-tabler-chevron-right" size="sm" color="gray" variant="ghost" square />
      </UTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/composables/contextmenu";
import type { Tables } from "~/types/supabase";

const props = defineProps<{
  note: Tables<"notes">;
  canDrag: boolean;
}>();

const emit = defineEmits<{ (event: "addAfter"): void; (event: "deleted"): void }>();

const { projectId } = useParams();
const getNextItemRoute = (noteId: number) => {
  if (projectId.value === null) return "/projects";

  return `/projects/${projectId.value}/${noteId}`;
};

const notesApi = useNotesApi();

const handleUpdateTitle = throttle((title: string) => {
  notesApi.updateNote(props.note.id, { title });
});

const handleUpdateCompleted = async (completed: boolean) => {
  const prevCompleted = props.note.completed;
  props.note.completed = completed;

  const updatedNote = await notesApi.updateNote(props.note.id, { completed });

  if (!updatedNote) {
    props.note.completed = prevCompleted;
  }
};

const handleUpdatePriority = (option: (typeof priorityOptions)[number]) => {
  notesApi.updateNote(props.note.id, { priority: option.value });
  props.note.priority = option.value;
};

const handleEnter = () => {
  emit("addAfter");
};

const priorityClass = computed(() => {
  return {
    "bg-red-700/25 hover:bg-red-700/30 text-red-700 animate-pulse": props.note.priority === "above all",
    "bg-red-500/25 hover:bg-red-500/30 text-red-500": props.note.priority === "high",
    "bg-yellow-500/25 hover:bg-yellow-500/30 text-yellow-500": props.note.priority === "middle",
    "bg-green-500/25 hover:bg-green-500/30 text-green-500": props.note.priority === "low",
  };
});

const getAllSubnoteElements = () => Array.from(document.getElementsByClassName("subnote")) as HTMLInputElement[];
const getSubnoteIndex = (subnote: HTMLInputElement) => getAllSubnoteElements().indexOf(subnote);

const getNextSubnote = (currentInput: HTMLInputElement) => {
  const subnoteElements = getAllSubnoteElements();
  const currentIndex = getSubnoteIndex(currentInput);
  if (currentIndex === -1 || currentIndex === subnoteElements.length - 1) {
    return null;
  }

  return subnoteElements[currentIndex + 1];
};

const getPreviousSubnote = (currentInput: HTMLInputElement) => {
  const subnoteElements = getAllSubnoteElements();
  const currentIndex = getSubnoteIndex(currentInput);
  if (currentIndex === -1 || currentIndex === 0) {
    return null;
  }

  return subnoteElements[currentIndex - 1];
};

const handleKeyboardUpDown = (event: KeyboardEvent) => {
  if (event.key === "ArrowDown") {
    const nextSubnote = getNextSubnote(event.target as HTMLInputElement);
    if (nextSubnote) {
      nextSubnote.focus();
      event.preventDefault();
    }

    return true;
  }

  if (event.key === "ArrowUp") {
    const previousSubnote = getPreviousSubnote(event.target as HTMLInputElement);
    if (previousSubnote) {
      previousSubnote.focus();
      event.preventDefault();
    }

    return true;
  }

  return false;
};

const handleKeyboardDelete = (event: KeyboardEvent) => {
  const meta = event.metaKey || event.ctrlKey;

  if (!meta) return false;
  if (!event.shiftKey) return false;
  if (event.key !== "Backspace") {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  requestDelete();

  return true;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (handleKeyboardUpDown(event)) {
    return;
  }

  if (handleKeyboardDelete(event)) {
    return;
  }

  if (event.key !== "Enter") {
    return;
  }

  if (event.metaKey || event.ctrlKey) {
    navigateTo(getNextItemRoute(props.note.id));
    return;
  }

  handleEnter();
};

const contextMenu = useContextMenu();

const onContextMenu = (event: MouseEvent) => {
  const menuItems: MenuItem[] = [
    {
      type: "link",
      label: "View",
      icon: "i-tabler-eye",
      to: getNextItemRoute(props.note.id),
    },
    {
      type: "options",
      label: "Priority",
      icon: "i-tabler-exclamation-mark",
      items: priorityOptions.map((option) => ({
        icon: "i-tabler-exclamation-mark",
        iconClass: getPriorityIconClass(option.value),
        label: option.label,
        click: () => handleUpdatePriority(option),
      })),
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

<template>
  <UTooltip :text="`Priority ${getPriorityLabel(note.priority)}`">
    <UDropdown :items="[priorityOptions.map((option) => ({ ...option, click: () => handleUpdatePriority(option) }))]" :popper="{ arrow: true }">
      <UButton icon="i-tabler-exclamation-mark" :class="getPriorityIconClass(note.priority)" size="sm" color="gray" variant="ghost" square />
    </UDropdown>
  </UTooltip>
</template>

<script setup lang="ts">
import type { Tables } from "~/types/supabase";

const props = defineProps<{
  note: Tables<"notes">;
}>();

const emit = defineEmits<{ (event: "priorityUpdated"): void }>();

const notesApi = useNotesApi();

const handleUpdatePriority = (option: (typeof priorityOptions)[number]) => {
  notesApi.updateNote(props.note.id, { priority: option.value });
  props.note.priority = option.value;
  emit("priorityUpdated");
};
</script>

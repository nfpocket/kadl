<template>
  <NotesDayCard v-if="noteDay" :note-day="noteDay" class="w-full h-full" />
  <NotesDayCardSkeleton v-else-if="noteDaysApi.loading.value" class="w-full h-full" />

  <UCard v-else>
    <template #header>
      <div class="text-xl">Day not found</div>
    </template>

    <div class="flex flex-col items-center gap-6">
      <div class="text-5xl font-bold">404</div>

      <div>Day not found</div>

      <UButton to="/projects" icon="i-tabler-arrow-left" label="back to projects" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { QueryData } from "@supabase/supabase-js";

const { dayId } = useParams();

const noteDaysApi = useNoteDaysApi();

const client = useNoteDaysApi().getClient();
const rawQuery = "*, projects (id, title)";
const query = client.select(rawQuery);
export type NoteDayWithProject = QueryData<typeof query>[number];

const noteDay = ref<NoteDayWithProject | null>(null);

const loadNoteDay = async () => {
  if (dayId.value === null) return;

  noteDay.value = await noteDaysApi.getNoteDayById<NoteDayWithProject>(dayId.value, rawQuery);
};

loadNoteDay();
</script>

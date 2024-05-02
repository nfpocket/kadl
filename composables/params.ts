export const useParams = () => {
  const route = useRoute();
  const toasts = useToasts();

  const projectId = computed(() => {
    const id = Number(route.params.project_id);

    if (isNaN(id)) {
      toasts.error("Invalid project id");
      return null;
    }

    return id;
  });
  const dayId = computed(() => {
    const id = Number(route.params.day_id);

    if (isNaN(id)) {
      toasts.error("Invalid day id");
      return null;
    }

    return id;
  });
  const noteId = computed(() => {
    const id = Number(route.params.note_id);

    if (isNaN(id)) {
      toasts.error("Invalid note id");
      return null;
    }

    return id;
  });

  return {
    projectId,
    dayId,
    noteId,
  };
};

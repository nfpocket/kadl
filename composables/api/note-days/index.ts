import type { Database, Tables } from "~/types/supabase";

type CreatableNoteData = Omit<Tables<"note_days">, "id" | "user_id" | "created_at" | "updated_at">;
type UpdatableNoteData = Omit<Tables<"note_days">, "id" | "user_id" | "created_at" | "updated_at">;

export const useNoteDaysApi = () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toasts = useToasts();
  const loading = ref(false);

  const getNoteDaysByProjectId = async <T = Tables<"note_days">>(projectId: number, selectQuery = "*") => {
    if (!user.value) return [];

    loading.value = true;
    const { data, error } = await client.from("note_days").select(selectQuery).eq("project_id", projectId).order("date", { ascending: true });
    loading.value = false;

    if (error) {
      console.error(error);
      toasts.error("Failed to load note days");

      return [];
    }

    return data as T[];
  };

  const getClient = () => {
    return client.from("note_days");
  };

  const getNoteDayById = async <T = Tables<"note_days">>(id: number, selectQuery = "*") => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client.from("note_days").select(selectQuery).eq("id", id).single<T>();
    loading.value = false;

    if (error || !data) {
      error && console.error(error);

      toasts.error("Failed to load note day details");
      return null;
    }

    return data;
  };

  const createNoteDay = async (noteData: Partial<CreatableNoteData> & { date: string; project_id: number }) => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client
      .from("note_days")
      .insert({ ...noteData, user_id: user.value.id })
      .select("*")
      .single();
    loading.value = false;

    if (error || !data) {
      console.error(error);

      toasts.error("Failed to create note day");
      return null;
    }

    return data;
  };

  const updateNoteDay = async (id: number, noteData: Partial<UpdatableNoteData>) => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client.from("note_days").update(noteData).eq("id", id).select("*").single();
    loading.value = false;

    if (error || !data) {
      console.error(error);

      toasts.error("Failed to update note day");
      return null;
    }

    return data;
  };

  const deleteNoteDay = async (id: number) => {
    if (!user.value) return null;

    loading.value = true;
    const { error } = await client.from("note_days").delete().eq("id", id);
    loading.value = false;

    if (error) {
      console.error(error);

      toasts.error("Failed to delete note day");
      return false;
    }

    return true;
  };

  return {
    getClient,
    getNoteDaysByProjectId,
    getNoteDayById,
    createNoteDay,
    updateNoteDay,
    deleteNoteDay,
    loading: readonly(loading),
  };
};

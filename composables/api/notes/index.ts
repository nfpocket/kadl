import type { Database, Tables } from "~/types/supabase";
// import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type CreatableNoteData = Omit<Tables<"notes">, "id" | "user_id" | "day_id" | "created_at" | "updated_at">;
type UpdatableNoteData = Omit<Tables<"notes">, "id" | "user_id" | "created_at" | "updated_at">;

export const useNotesApi = () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toasts = useToasts();
  const loading = ref(false);

  const getNotesOfDay = async (dayId: number) => {
    if (!user.value) return [];

    loading.value = true;
    const { data, error } = await client.from("notes").select("*").eq("day_id", dayId).order("date", { ascending: true });
    loading.value = false;

    if (error) {
      console.error(error);
      toasts.error("Failed to load notes");

      return [];
    }

    return data;
  };

  const getNotesOfParent = async (parentId: number) => {
    if (!user.value) return [];

    loading.value = true;
    const { data, error } = await client.from("notes").select("*").eq("parent_note_id", parentId).order("date", { ascending: true });
    loading.value = false;

    if (error) {
      console.error(error);
      toasts.error("Failed to load notes");

      return [];
    }

    return data;
  };

  const getNoteById = async (id: number) => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client.from("notes").select("*").eq("id", id).single();
    loading.value = false;

    if (error || !data) {
      error && console.error(error);

      toasts.error("Failed to load note details");
      return null;
    }

    return data;
  };

  const createNoteFromDay = async (noteDayId: number, noteData: Partial<CreatableNoteData>) => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client
      .from("notes")
      .insert({ ...noteData, user_id: user.value.id, day_id: noteDayId })
      .select("*")
      .single();
    loading.value = false;

    if (error || !data) {
      console.error(error);

      toasts.error("Failed to create note");
      return null;
    }

    return data;
  };

  const createNoteFromNote = async (noteParentId: number, noteData: Partial<CreatableNoteData>) => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client
      .from("notes")
      .insert({ ...noteData, user_id: user.value.id, parent_note_id: noteParentId })
      .select("*")
      .single();
    loading.value = false;

    if (error || !data) {
      console.error(error);

      toasts.error("Failed to create note");
      return null;
    }

    return data;
  };

  const updateNote = async (id: number, noteData: Partial<UpdatableNoteData>) => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client.from("notes").update(noteData).eq("id", id).select("*").single();
    loading.value = false;

    if (error || !data) {
      console.error(error);

      toasts.error("Failed to update note");
      return null;
    }

    return data;
  };

  const deleteNote = async (id: number) => {
    if (!user.value) return null;

    loading.value = true;
    const { error } = await client.from("notes").delete().eq("id", id);
    loading.value = false;

    if (error) {
      console.error(error);

      toasts.error("Failed to delete note");
      return false;
    }

    return true;
  };

  const loadAllNoteParents = async (noteId: number) => {
    if (!user.value) return [];

    const { data, error } = await client.rpc("get_all_parent_notes", { note_id: noteId });

    if (error || !data) {
      console.error(error);
      toasts.error("Failed to load note parents");
      return [];
    }

    return data;
  };
  //   const getRealtimeChannel = (channelName: string) => {
  //     return client.channel(channelName);
  //   };

  //   const removeRealtimeChannel = (channel: RealtimeChannel) => {
  //     channel.unsubscribe();
  //     client.removeChannel(channel);
  //   };

  return {
    getNotesOfDay,
    getNotesOfParent,
    getNoteById,
    createNoteFromDay,
    createNoteFromNote,
    loadAllNoteParents,
    updateNote,
    deleteNote,
    loading: readonly(loading),
  };
};

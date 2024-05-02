import type { WatchStopHandle } from "vue";
import type { Database } from "~/types/supabase";

export type UserNotesFilterOptions = {
  hideCompleted: boolean;
  groupByPriority: boolean;
  sortBy: "none" | "created_at" | "priority" | "title";
  sortOrder: "asc" | "desc";
};

export const userNotesSortOptions = [
  { label: "None", value: "none" },
  { label: "Created at", value: "created_at" },
  { label: "Priority", value: "priority" },
  { label: "Title", value: "title" },
] satisfies {
  label: string;
  value: UserNotesFilterOptions["sortBy"];
}[];

export const UserNotesSortOrderOptions = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
] satisfies {
  label: string;
  value: UserNotesFilterOptions["sortOrder"];
}[];

type UserSettings = {
  filterOptions: UserNotesFilterOptions;
};

const initialFilterOptions: UserNotesFilterOptions = {
  hideCompleted: false,
  groupByPriority: false,
  sortBy: "none",
  sortOrder: "asc",
};

const userSettings = ref<UserSettings>({
  filterOptions: initialFilterOptions,
});

export const useUserSettings = () => {
  const user = useSupabaseUser();
  const client = useSupabaseClient<Database>();

  let unwatchFilterOptions: WatchStopHandle | null = null;

  const init = async () => {
    if (!user.value) {
      return null;
    }

    const { data, error } = await client.from("user_settings").select("*").eq("user_id", user.value?.id).limit(1);

    if (error) {
      console.error("Failed to fetch user settings", error);
      return null;
    }

    if (!data || !data.length) {
      await client.from("user_settings").insert([{ user_id: user.value.id, subnotes_filter_options: initialFilterOptions }]);
    } else {
      userSettings.value = {
        filterOptions: data[0].subnotes_filter_options as UserNotesFilterOptions,
      };
    }

    unwatchFilterOptions = watch(
      () => userSettings.value.filterOptions,
      debounce(() => {
        updateFilterOptions(userSettings.value.filterOptions);
      }),
      {
        deep: true,
      }
    );

    return userSettings.value;
  };

  const updateFilterOptions = async (newFilterOptions: UserNotesFilterOptions) => {
    if (!user.value) {
      return null;
    }

    return await client.from("user_settings").update({ subnotes_filter_options: newFilterOptions }).eq("user_id", user.value.id).single();
  };

  onBeforeUnmount(() => {
    unwatchFilterOptions?.();
  });

  return {
    userSettings,
    init,
  };
};

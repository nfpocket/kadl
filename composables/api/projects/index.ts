import type { Database, Tables } from "~/types/supabase";

type CreatableProjectData = Omit<Tables<"projects">, "id" | "user_id" | "created_at" | "updated_at">;
type UpdatableProjectData = Omit<Tables<"projects">, "id" | "user_id" | "created_at" | "updated_at">;

export const useProjectsApi = () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toasts = useToasts();
  const loading = ref(false);

  const getProjects = async () => {
    if (!user.value) return [];

    loading.value = true;
    const { data, error } = await client.from("projects").select("*").order("order", { ascending: true });
    loading.value = false;

    if (error) {
      console.error(error);
      toasts.error("Failed to load projects");

      return [];
    }

    return data;
  };

  const getProjectById = async (id: number) => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client.from("projects").select("*").eq("id", id).single();
    loading.value = false;

    if (error || !data) {
      error && console.error(error);

      toasts.error("Failed to load project details");
      return null;
    }

    return data;
  };

  const createProject = async (projectData?: Partial<CreatableProjectData>) => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client
      .from("projects")
      .insert({ ...(projectData || {}), user_id: user.value.id })
      .select("*")
      .single();
    loading.value = false;

    if (error || !data) {
      console.error(error);

      toasts.error("Failed to create project");
      return null;
    }

    return data;
  };

  const updateProject = async (id: number, projectData: Partial<UpdatableProjectData>) => {
    if (!user.value) return null;

    loading.value = true;
    const { data, error } = await client.from("projects").update(projectData).eq("id", id).select("*").single();
    loading.value = false;

    if (error || !data) {
      console.error(error);

      toasts.error("Failed to update project");
      return null;
    }

    return data;
  };

  const deleteProject = async (id: number) => {
    if (!user.value) return null;

    loading.value = true;
    const { error } = await client.from("projects").delete().eq("id", id);
    loading.value = false;

    if (error) {
      console.error(error);

      toasts.error("Failed to delete project");
      return false;
    }

    return true;
  };

  return {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    loading: readonly(loading),
  };
};

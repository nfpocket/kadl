<template>
  <div class="flex flex-col gap-4 h-full">
    <div class="flex items-center gap-2">
      <div class="bold text-3xl">Projects</div>
      <NotesAddButton @add="handleCreateNewProject()" />
    </div>
    <div class="flex flex-col gap-4 p-1 overflow-auto">
      <DeleteModal
        v-if="!!requestedProjectToDelete"
        :loading="projectsApi.loading.value"
        title="Are you sure you want to delete this project?"
        description="By deleting this project, all connected notes and subnotes will be deleted as well."
        @cancel="requestedProjectToDelete = null"
        @delete="handleDeleteProject"
      />

      <NuxtLink v-for="project in projects" :key="project.id" :to="`/projects/${project.id}`" @contextmenu.stop.prevent="handleContextMenu($event, project)">
        <UCard class="card">
          <div>
            <div class="line-clamp-2">
              <span v-if="project.title" class="text-xl">{{ project.title }}</span>
              <span v-else class="text-xl italic opacity-50">Title</span>
            </div>

            <div class="line-clamp-3">
              <span v-if="project.description" class="">{{ project.description }}</span>
              <span v-else class="italic opacity-50">Description</span>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <template v-if="!projects.length && projectsApi.loading.value">
        <NotesSkeleton v-for="i in 10" :key="i" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/composables/contextmenu";
import { useToasts } from "~/composables/toasts";
import type { Tables } from "~/types/supabase";

useHead({
  title: "Projects",
});

const toasts = useToasts();
const projectsApi = useProjectsApi();

const projects = ref<Tables<"projects">[]>([]);

const loadProjects = async () => {
  projects.value = await projectsApi.getProjects();
};

const handleCreateNewProject = async () => {
  const newProject = await projectsApi.createProject();

  if (!newProject) return;

  toasts.success("Project created successfully");

  navigateTo(`/projects/${newProject.id}`);
};

const requestedProjectToDelete = ref<Tables<"projects"> | null>(null);
const requestDelete = (project: Tables<"projects">) => {
  requestedProjectToDelete.value = project;
};
const handleDeleteProject = async () => {
  if (!requestedProjectToDelete.value) return;

  const deleted = await projectsApi.deleteProject(requestedProjectToDelete.value.id);

  if (!deleted) {
    requestedProjectToDelete.value = null;
    return;
  }

  projects.value = projects.value.filter((n) => n.id !== requestedProjectToDelete.value!.id);
  toasts.success("Project deleted successfully");

  requestedProjectToDelete.value = null;
};

const contextMenu = useContextMenu();

const handleContextMenu = (event: MouseEvent, project: Tables<"projects">) => {
  const menuItems: MenuItem[] = [
    {
      type: "link",
      label: "View",
      icon: "i-tabler-eye",
      to: `/projects/${project.id}`,
    },
    {
      type: "divider",
    },
    {
      type: "action",
      label: "Delete",
      action: () => requestDelete(project),
      icon: "i-tabler-trash",
    },
  ];

  contextMenu.show(event, menuItems);
};

loadProjects();
</script>

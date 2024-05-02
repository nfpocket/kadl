<template>
  <div class="flex flex-col gap-4 h-full">
    <div class="bold text-3xl">Projects</div>
    <div class="flex flex-wrap gap-4 p-1">
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
          <div class="flex flex-col gap-2">
            <div>
              <span v-if="project.title" class="text-xl">{{ project.title }}</span>
              <span v-else class="text-xl italic">Title</span>
            </div>
            <!-- <UInput
              placeholder="Title"
              variant="seamless"
              size="xl"
              class="w-full"
              input-class="text-xl"
              :model-value="project.title || ''"
              @update:model-value="handleUpdateTitle($event, project)"
              @click.stop.prevent
              @keydown.enter="navigateTo(`/projects/${project.id}`)"
            /> -->
          </div>
        </UCard>
      </NuxtLink>
      <NotesAddButton @add="handleCreateNewProject()" />
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

const handleUpdateTitle = throttle(async (value: string, project: Tables<"projects">) => {
  projectsApi.updateProject(project.id, {
    title: value,
  });
});

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

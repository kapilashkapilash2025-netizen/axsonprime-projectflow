"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  archiveProject,
  createProject,
  deleteAllSampleData,
  updateProject,
} from "@/repositories/projectRepository";
import { recordActivity } from "@/repositories/activityRepository";
import { projectFormSchema } from "@/validation/project";

export interface ProjectActionState {
  error: string | null;
  fieldErrors: Record<string, string>;
}

function parseForm(formData: FormData) {
  return projectFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    status: formData.get("status"),
    priority: formData.get("priority"),
    techStack: formData.get("techStack") ?? "",
    repositoryUrl: formData.get("repositoryUrl") ?? "",
    targetReleaseDate: formData.get("targetReleaseDate") ?? "",
    progress: formData.get("progress") ?? 0,
  });
}

function fieldErrorsFrom(result: {
  error: {
    flatten: () => { fieldErrors: Record<string, string[] | undefined> };
  };
}) {
  const flat = result.error.flatten().fieldErrors;
  const errors: Record<string, string> = {};
  for (const [key, messages] of Object.entries(flat)) {
    if (messages?.[0]) errors[key] = messages[0];
  }
  return errors;
}

export async function createProjectAction(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFrom(result),
    };
  }

  const project = await createProject(result.data);
  await recordActivity(
    project.id,
    "project_created",
    `Created project '${project.name}'`,
  );
  revalidatePath("/");
  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProjectAction(
  projectId: string,
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFrom(result),
    };
  }

  const project = await updateProject(projectId, result.data);
  await recordActivity(
    project.id,
    "project_updated",
    `Updated project details for '${project.name}'`,
  );
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function archiveProjectAction(projectId: string) {
  const project = await archiveProject(projectId);
  await recordActivity(
    project.id,
    "project_archived",
    `Archived project '${project.name}'`,
  );
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
}

export async function resetSampleDataAction() {
  await deleteAllSampleData();
  revalidatePath("/");
  revalidatePath("/projects");
}

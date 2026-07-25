"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createTask,
  deleteTask,
  updateTask,
} from "@/repositories/taskRepository";
import { recordActivity } from "@/repositories/activityRepository";
import { taskFormSchema } from "@/validation/task";

export interface TaskActionState {
  error: string | null;
  fieldErrors: Record<string, string>;
}

function parseForm(formData: FormData) {
  return taskFormSchema.safeParse({
    projectId: formData.get("projectId"),
    phaseId: formData.get("phaseId") ?? "",
    parentTaskId: formData.get("parentTaskId") ?? "",
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    status: formData.get("status"),
    priority: formData.get("priority"),
    assignee: formData.get("assignee") ?? "",
    dueDate: formData.get("dueDate") ?? "",
    labels: formData.get("labels") ?? "",
    acceptanceCriteria: formData.get("acceptanceCriteria") ?? "",
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

export async function createTaskAction(
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFrom(result),
    };
  }

  const task = await createTask(result.data);
  await recordActivity(
    task.projectId,
    "task_created",
    `Added task '${task.title}'`,
  );
  revalidatePath("/tasks");
  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath("/");
  redirect(`/projects/${task.projectId}`);
}

export async function updateTaskAction(
  taskId: string,
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFrom(result),
    };
  }

  const task = await updateTask(taskId, result.data);
  await recordActivity(
    task.projectId,
    task.status === "COMPLETED" ? "task_completed" : "task_updated",
    `Updated task '${task.title}' (${task.status})`,
  );
  revalidatePath("/tasks");
  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath("/");
  redirect(`/projects/${task.projectId}`);
}

export async function deleteTaskAction(taskId: string, projectId: string) {
  await deleteTask(taskId);
  revalidatePath("/tasks");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
}

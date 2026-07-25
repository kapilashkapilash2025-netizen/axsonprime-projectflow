"use server";

import { revalidatePath } from "next/cache";
import { toggleMilestoneCompletion } from "@/repositories/milestoneRepository";
import { recordActivity } from "@/repositories/activityRepository";

export async function toggleMilestoneAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const completed = formData.get("completed") === "true";
  if (!id || !projectId) throw new Error("Invalid milestone update request.");

  const milestone = await toggleMilestoneCompletion(id, completed);
  await recordActivity(
    projectId,
    completed ? "milestone_completed" : "milestone_reopened",
    `Milestone '${milestone.name}' marked as ${completed ? "completed" : "not completed"}`,
  );

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
}

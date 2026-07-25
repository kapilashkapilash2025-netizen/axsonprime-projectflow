"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createIssue,
  deleteIssue,
  updateIssue,
} from "@/repositories/issueRepository";
import { recordActivity } from "@/repositories/activityRepository";
import { issueFormSchema } from "@/validation/issue";

export interface IssueActionState {
  error: string | null;
  fieldErrors: Record<string, string>;
}

function parseForm(formData: FormData) {
  return issueFormSchema.safeParse({
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    type: formData.get("type"),
    severity: formData.get("severity"),
    status: formData.get("status"),
    acceptanceCriteria: formData.get("acceptanceCriteria") ?? "",
    resolutionNotes: formData.get("resolutionNotes") ?? "",
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

export async function createIssueAction(
  _prevState: IssueActionState,
  formData: FormData,
): Promise<IssueActionState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFrom(result),
    };
  }

  const issue = await createIssue(result.data);
  await recordActivity(
    issue.projectId,
    "issue_created",
    `Opened issue '${issue.title}'`,
  );
  revalidatePath("/issues");
  revalidatePath(`/projects/${issue.projectId}`);
  revalidatePath("/");
  redirect(`/projects/${issue.projectId}`);
}

export async function updateIssueAction(
  issueId: string,
  _prevState: IssueActionState,
  formData: FormData,
): Promise<IssueActionState> {
  const result = parseForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFrom(result),
    };
  }

  const issue = await updateIssue(issueId, result.data);
  await recordActivity(
    issue.projectId,
    issue.status === "RESOLVED" ? "issue_resolved" : "issue_updated",
    `Updated issue '${issue.title}' (${issue.status})`,
  );
  revalidatePath("/issues");
  revalidatePath(`/projects/${issue.projectId}`);
  revalidatePath("/");
  redirect(`/projects/${issue.projectId}`);
}

export async function deleteIssueAction(issueId: string, projectId: string) {
  await deleteIssue(issueId);
  revalidatePath("/issues");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
}

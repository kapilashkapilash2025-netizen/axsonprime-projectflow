"use server";

import { revalidatePath } from "next/cache";
import { upsertGitHubLink } from "@/repositories/githubLinkRepository";
import { githubLinkFormSchema } from "@/validation/githubLink";

export interface GitHubLinkActionState {
  error: string | null;
}

export async function upsertGitHubLinkAction(
  projectId: string,
  _prevState: GitHubLinkActionState,
  formData: FormData,
): Promise<GitHubLinkActionState> {
  const result = githubLinkFormSchema.safeParse({
    projectId,
    repositoryUrl: formData.get("repositoryUrl") ?? "",
    branchName: formData.get("branchName") ?? "",
    issueNumber: formData.get("issueNumber") || "",
    pullRequestNumber: formData.get("pullRequestNumber") || "",
    pullRequestStatus: formData.get("pullRequestStatus") ?? "",
    commitRef: formData.get("commitRef") ?? "",
    ciStatus: formData.get("ciStatus") ?? "",
    reviewStatus: formData.get("reviewStatus") ?? "",
    mergeStatus: formData.get("mergeStatus") ?? "",
  });

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Invalid GitHub link details.",
    };
  }

  await upsertGitHubLink(result.data);
  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}

import { prisma } from "@/lib/db";
import type { GitHubLinkFormValues } from "@/validation/githubLink";

function toDbInput(values: GitHubLinkFormValues) {
  return {
    repositoryUrl: values.repositoryUrl || null,
    branchName: values.branchName || null,
    issueNumber: values.issueNumber ? Number(values.issueNumber) : null,
    pullRequestNumber: values.pullRequestNumber
      ? Number(values.pullRequestNumber)
      : null,
    pullRequestStatus: values.pullRequestStatus || null,
    commitRef: values.commitRef || null,
    ciStatus: values.ciStatus || null,
    reviewStatus: values.reviewStatus || null,
    mergeStatus: values.mergeStatus || null,
  };
}

export function upsertGitHubLink(values: GitHubLinkFormValues) {
  const data = toDbInput(values);
  return prisma.gitHubLink.upsert({
    where: { projectId: values.projectId },
    create: { projectId: values.projectId, ...data },
    update: data,
  });
}

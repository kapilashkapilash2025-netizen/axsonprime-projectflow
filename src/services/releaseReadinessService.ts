import { calculateReleaseReadiness } from "@/domain/releaseReadiness";
import type { ReleaseReadinessResult } from "@/domain/types";
import { prisma } from "@/lib/db";

export async function getReleaseReadiness(
  projectId: string,
): Promise<ReleaseReadinessResult> {
  const [tasks, criticalOpenIssues, qualityGates, latestRelease] =
    await Promise.all([
      prisma.task.findMany({ where: { projectId }, select: { status: true } }),
      prisma.issue.count({
        where: {
          projectId,
          severity: "CRITICAL",
          status: { in: ["OPEN", "IN_PROGRESS"] },
        },
      }),
      prisma.qualityGate.findMany({
        where: { projectId },
        select: { check: true, passed: true },
      }),
      prisma.release.findFirst({
        where: { projectId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const documentationGate = qualityGates.find(
    (g) => g.check === "DOCUMENTATION_REVIEW",
  );

  return calculateReleaseReadiness({
    requiredTasksTotal: tasks.length,
    requiredTasksCompleted: tasks.filter((t) => t.status === "COMPLETED")
      .length,
    criticalOpenIssues,
    qualityGates,
    documentationReviewed: documentationGate?.passed ?? false,
    changelogUpdated: latestRelease?.changelogUpdated ?? false,
    versionAssigned: Boolean(latestRelease?.version),
  });
}

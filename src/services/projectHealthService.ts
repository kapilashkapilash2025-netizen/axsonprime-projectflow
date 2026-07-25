import { calculateProjectHealthScore } from "@/domain/healthScore";
import type { ProjectHealthResult } from "@/domain/types";
import { prisma } from "@/lib/db";

export async function getProjectHealth(
  projectId: string,
): Promise<ProjectHealthResult> {
  const [tasks, issues, qualityGates, milestones] = await Promise.all([
    prisma.task.findMany({
      where: { projectId },
      select: { status: true, dueDate: true, completedAt: true },
    }),
    prisma.issue.findMany({
      where: { projectId },
      select: { status: true, severity: true },
    }),
    prisma.qualityGate.findMany({
      where: { projectId },
      select: { check: true, passed: true },
    }),
    prisma.milestone.findMany({
      where: { projectId },
      select: { dueDate: true, completed: true },
    }),
  ]);

  return calculateProjectHealthScore({
    tasks,
    issues,
    qualityGates,
    milestones,
    now: new Date(),
  });
}

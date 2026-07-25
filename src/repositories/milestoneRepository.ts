import { prisma } from "@/lib/db";

export function listMilestones() {
  return prisma.milestone.findMany({
    orderBy: { dueDate: "asc" },
    include: { project: { select: { id: true, name: true } } },
  });
}

export function listMilestonesForProject(projectId: string) {
  return prisma.milestone.findMany({
    where: { projectId },
    orderBy: { dueDate: "asc" },
  });
}

export function toggleMilestoneCompletion(id: string, completed: boolean) {
  return prisma.milestone.update({ where: { id }, data: { completed } });
}

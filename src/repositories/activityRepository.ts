import { prisma } from "@/lib/db";

export function recordActivity(
  projectId: string,
  type: string,
  message: string,
) {
  return prisma.activityEvent.create({ data: { projectId, type, message } });
}

export function listRecentActivity(limit = 15) {
  return prisma.activityEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { project: { select: { id: true, name: true } } },
  });
}

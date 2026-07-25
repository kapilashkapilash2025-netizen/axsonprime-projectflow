import { prisma } from "@/lib/db";

export function listReleasesForProject(projectId: string) {
  return prisma.release.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export function createRelease(
  projectId: string,
  version: string,
  changelogUpdated: boolean,
  notes?: string,
) {
  return prisma.release.create({
    data: { projectId, version, changelogUpdated, notes },
  });
}

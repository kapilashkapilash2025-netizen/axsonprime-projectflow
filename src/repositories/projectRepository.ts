import { prisma } from "@/lib/db";
import type { ProjectFormValues } from "@/validation/project";

export function listProjects() {
  return prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      phases: { orderBy: { order: "asc" } },
      tasks: { orderBy: { updatedAt: "desc" } },
      issues: { orderBy: { updatedAt: "desc" } },
      qualityGates: true,
      milestones: { orderBy: { dueDate: "asc" } },
      releases: { orderBy: { createdAt: "desc" } },
      activityEvents: { orderBy: { createdAt: "desc" }, take: 20 },
      githubLink: true,
    },
  });
}

function toDbInput(values: ProjectFormValues) {
  return {
    name: values.name,
    description: values.description || null,
    status: values.status,
    priority: values.priority,
    techStack: values.techStack || null,
    repositoryUrl: values.repositoryUrl || null,
    targetReleaseDate: values.targetReleaseDate
      ? new Date(values.targetReleaseDate)
      : null,
    progress: values.progress,
  };
}

export function createProject(values: ProjectFormValues) {
  return prisma.project.create({ data: toDbInput(values) });
}

export function updateProject(id: string, values: ProjectFormValues) {
  return prisma.project.update({ where: { id }, data: toDbInput(values) });
}

export function archiveProject(id: string) {
  return prisma.project.update({ where: { id }, data: { status: "ARCHIVED" } });
}

export function deleteAllSampleData() {
  return prisma.project.deleteMany({ where: { isSample: true } });
}

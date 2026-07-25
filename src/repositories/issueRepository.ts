import { prisma } from "@/lib/db";
import type { IssueFormValues } from "@/validation/issue";

export function listIssues() {
  return prisma.issue.findMany({
    orderBy: { updatedAt: "desc" },
    include: { project: { select: { id: true, name: true } } },
  });
}

export function listIssuesForProject(projectId: string) {
  return prisma.issue.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
  });
}

function toDbInput(values: IssueFormValues) {
  return {
    projectId: values.projectId,
    title: values.title,
    description: values.description || null,
    type: values.type,
    severity: values.severity,
    status: values.status,
    acceptanceCriteria: values.acceptanceCriteria || null,
    resolutionNotes: values.resolutionNotes || null,
  };
}

export function createIssue(values: IssueFormValues) {
  return prisma.issue.create({ data: toDbInput(values) });
}

export function updateIssue(id: string, values: IssueFormValues) {
  return prisma.issue.update({ where: { id }, data: toDbInput(values) });
}

export function deleteIssue(id: string) {
  return prisma.issue.delete({ where: { id } });
}

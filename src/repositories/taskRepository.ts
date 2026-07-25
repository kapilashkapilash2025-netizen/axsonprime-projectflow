import { prisma } from "@/lib/db";
import type { TaskFormValues } from "@/validation/task";

export function listTasks() {
  return prisma.task.findMany({
    orderBy: { updatedAt: "desc" },
    include: { project: { select: { id: true, name: true } } },
  });
}

export function listTasksForProject(projectId: string) {
  return prisma.task.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
  });
}

function toDbInput(values: TaskFormValues) {
  return {
    projectId: values.projectId,
    phaseId: values.phaseId || null,
    parentTaskId: values.parentTaskId || null,
    title: values.title,
    description: values.description || null,
    status: values.status,
    priority: values.priority,
    assignee: values.assignee || null,
    dueDate: values.dueDate ? new Date(values.dueDate) : null,
    labels: values.labels || null,
    acceptanceCriteria: values.acceptanceCriteria || null,
  };
}

export function createTask(values: TaskFormValues) {
  return prisma.task.create({ data: toDbInput(values) });
}

export async function updateTask(id: string, values: TaskFormValues) {
  const completedAt = values.status === "COMPLETED" ? new Date() : null;
  return prisma.task.update({
    where: { id },
    data: { ...toDbInput(values), completedAt },
  });
}

export function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}

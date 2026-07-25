import { z } from "zod";
import { PRIORITIES, TASK_STATUSES } from "@/domain/types";

export const taskFormSchema = z.object({
  projectId: z.string().trim().min(1),
  phaseId: z.string().trim().optional().or(z.literal("")),
  parentTaskId: z.string().trim().optional().or(z.literal("")),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(PRIORITIES),
  assignee: z.string().trim().max(120).optional().or(z.literal("")),
  dueDate: z.string().trim().optional().or(z.literal("")),
  labels: z.string().trim().max(300).optional().or(z.literal("")),
  acceptanceCriteria: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

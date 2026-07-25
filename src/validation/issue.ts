import { z } from "zod";
import { ISSUE_STATUSES, ISSUE_TYPES, SEVERITIES } from "@/domain/types";

export const issueFormSchema = z.object({
  projectId: z.string().trim().min(1),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  type: z.enum(ISSUE_TYPES),
  severity: z.enum(SEVERITIES),
  status: z.enum(ISSUE_STATUSES),
  acceptanceCriteria: z.string().trim().max(2000).optional().or(z.literal("")),
  resolutionNotes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type IssueFormValues = z.infer<typeof issueFormSchema>;

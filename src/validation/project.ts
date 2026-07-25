import { z } from "zod";
import { PRIORITIES, PROJECT_STATUSES } from "@/domain/types";

export const projectFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(PROJECT_STATUSES),
  priority: z.enum(PRIORITIES),
  techStack: z.string().trim().max(300).optional().or(z.literal("")),
  repositoryUrl: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^https:\/\//.test(value), {
      message: "Repository URL must start with https://",
    }),
  targetReleaseDate: z.string().trim().optional().or(z.literal("")),
  progress: z.coerce.number().int().min(0).max(100).default(0),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

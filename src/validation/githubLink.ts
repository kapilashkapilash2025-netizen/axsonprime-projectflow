import { z } from "zod";

export const githubLinkFormSchema = z.object({
  projectId: z.string().trim().min(1),
  repositoryUrl: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^https:\/\//.test(value), {
      message: "Repository URL must start with https://",
    }),
  branchName: z.string().trim().max(120).optional().or(z.literal("")),
  issueNumber: z.coerce.number().int().positive().optional().or(z.literal("")),
  pullRequestNumber: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal("")),
  pullRequestStatus: z.string().trim().max(60).optional().or(z.literal("")),
  commitRef: z.string().trim().max(80).optional().or(z.literal("")),
  ciStatus: z.string().trim().max(60).optional().or(z.literal("")),
  reviewStatus: z.string().trim().max(60).optional().or(z.literal("")),
  mergeStatus: z.string().trim().max(60).optional().or(z.literal("")),
});

export type GitHubLinkFormValues = z.infer<typeof githubLinkFormSchema>;

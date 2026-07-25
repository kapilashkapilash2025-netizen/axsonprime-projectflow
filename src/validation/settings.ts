import { z } from "zod";
import { PROJECT_STATUSES } from "@/domain/types";

export const settingsFormSchema = z.object({
  applicationName: z
    .string()
    .trim()
    .min(1, "Application name is required")
    .max(120),
  organizationName: z
    .string()
    .trim()
    .min(1, "Organization name is required")
    .max(120),
  defaultProjectStatus: z.enum(PROJECT_STATUSES),
  dateFormat: z.enum(["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy"]),
  themePreference: z.enum(["dark", "light", "system"]),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

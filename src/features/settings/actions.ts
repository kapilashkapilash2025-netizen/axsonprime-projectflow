"use server";

import { revalidatePath } from "next/cache";
import { updateSettings } from "@/repositories/settingsRepository";
import { settingsFormSchema } from "@/validation/settings";

export interface SettingsActionState {
  error: string | null;
  success: boolean;
}

export async function updateSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const result = settingsFormSchema.safeParse({
    applicationName: formData.get("applicationName"),
    organizationName: formData.get("organizationName"),
    defaultProjectStatus: formData.get("defaultProjectStatus"),
    dateFormat: formData.get("dateFormat"),
    themePreference: formData.get("themePreference"),
  });

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Invalid settings.",
      success: false,
    };
  }

  await updateSettings(result.data);
  revalidatePath("/settings");
  revalidatePath("/");
  return { error: null, success: true };
}

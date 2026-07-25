import { prisma } from "@/lib/db";
import type { SettingsFormValues } from "@/validation/settings";

const SETTINGS_ID = "singleton";

export async function getSettings() {
  const existing = await prisma.appSettings.findUnique({
    where: { id: SETTINGS_ID },
  });
  if (existing) return existing;
  return prisma.appSettings.create({ data: { id: SETTINGS_ID } });
}

export function updateSettings(values: SettingsFormValues) {
  return prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...values },
    update: values,
  });
}

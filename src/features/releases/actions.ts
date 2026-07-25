"use server";

import { revalidatePath } from "next/cache";
import { createRelease } from "@/repositories/releaseRepository";
import { recordActivity } from "@/repositories/activityRepository";
import { z } from "zod";

const releaseSchema = z.object({
  projectId: z.string().trim().min(1),
  version: z.string().trim().min(1, "Version is required").max(40),
  changelogUpdated: z.boolean(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export interface ReleaseActionState {
  error: string | null;
}

export async function createReleaseAction(
  projectId: string,
  _prevState: ReleaseActionState,
  formData: FormData,
): Promise<ReleaseActionState> {
  const result = releaseSchema.safeParse({
    projectId,
    version: formData.get("version"),
    changelogUpdated: formData.get("changelogUpdated") === "on",
    notes: formData.get("notes") ?? "",
  });

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Invalid release details.",
    };
  }

  await createRelease(
    projectId,
    result.data.version,
    result.data.changelogUpdated,
    result.data.notes || undefined,
  );
  await recordActivity(
    projectId,
    "release_recorded",
    `Recorded release ${result.data.version}`,
  );

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/releases");
  return { error: null };
}

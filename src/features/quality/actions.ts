"use server";

import { revalidatePath } from "next/cache";
import { setQualityGateStatus } from "@/repositories/qualityGateRepository";
import { recordActivity } from "@/repositories/activityRepository";
import { QUALITY_CHECK_TYPES, type QualityCheckType } from "@/domain/types";
import { titleCase } from "@/lib/utils";

export async function toggleQualityGateAction(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const check = String(formData.get("check") ?? "") as QualityCheckType;
  const passed = formData.get("passed") === "true";

  if (!projectId || !QUALITY_CHECK_TYPES.includes(check)) {
    throw new Error("Invalid quality gate update request.");
  }

  await setQualityGateStatus(projectId, check, passed);
  await recordActivity(
    projectId,
    passed ? "quality_gate_passed" : "quality_gate_failed",
    `${titleCase(check)} marked as ${passed ? "passing" : "failing"}`,
  );

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/quality");
  revalidatePath("/");
}

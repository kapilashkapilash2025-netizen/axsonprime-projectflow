import { prisma } from "@/lib/db";
import type { QualityCheckType } from "@/domain/types";

export function listQualityGatesForProject(projectId: string) {
  return prisma.qualityGate.findMany({ where: { projectId } });
}

export function setQualityGateStatus(
  projectId: string,
  check: QualityCheckType,
  passed: boolean,
  notes?: string,
) {
  return prisma.qualityGate.upsert({
    where: { projectId_check: { projectId, check } },
    create: { projectId, check, passed, notes, checkedAt: new Date() },
    update: { passed, notes, checkedAt: new Date() },
  });
}

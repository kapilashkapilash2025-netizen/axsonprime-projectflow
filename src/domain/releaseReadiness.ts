import type {
  ReleaseReadinessInput,
  ReleaseReadinessReason,
  ReleaseReadinessResult,
  ReleaseReadinessStatus,
} from "./types";

const HARD_BLOCKER_CHECKS = [
  "UNIT_TESTS",
  "PRODUCTION_BUILD",
  "E2E_TESTS",
] as const;

/**
 * Deterministic release-readiness assessment. Hard blockers (incomplete required tasks,
 * open critical issues, failing tests/build) force NOT_READY regardless of soft blockers.
 * Soft blockers (docs, changelog, version, non-critical quality checks) can only downgrade
 * READY to AT_RISK. Formula documented in docs/adr/0005-release-readiness-rules.md.
 */
export function calculateReleaseReadiness(
  input: ReleaseReadinessInput,
): ReleaseReadinessResult {
  const {
    requiredTasksTotal,
    requiredTasksCompleted,
    criticalOpenIssues,
    qualityGates,
    documentationReviewed,
    changelogUpdated,
    versionAssigned,
  } = input;

  const allRequiredTasksDone = requiredTasksCompleted >= requiredTasksTotal;
  const noCriticalIssues = criticalOpenIssues === 0;

  const hardBlockerGatesPassed = HARD_BLOCKER_CHECKS.every((check) => {
    const gate = qualityGates.find((g) => g.check === check);
    return gate?.passed === true;
  });

  const softQualityGatesPassed = qualityGates
    .filter(
      (g) => !(HARD_BLOCKER_CHECKS as readonly string[]).includes(g.check),
    )
    .every((g) => g.passed);

  const reasons: ReleaseReadinessReason[] = [
    { label: "All required tasks completed", satisfied: allRequiredTasksDone },
    { label: "No open critical issues", satisfied: noCriticalIssues },
    {
      label: "Unit, E2E, and production build checks pass",
      satisfied: hardBlockerGatesPassed,
    },
    {
      label: "Remaining quality gates pass",
      satisfied: softQualityGatesPassed,
    },
    { label: "Documentation reviewed", satisfied: documentationReviewed },
    { label: "Changelog updated", satisfied: changelogUpdated },
    { label: "Version assigned", satisfied: versionAssigned },
  ];

  const hasHardBlocker =
    !allRequiredTasksDone || !noCriticalIssues || !hardBlockerGatesPassed;
  const hasSoftBlocker =
    !softQualityGatesPassed ||
    !documentationReviewed ||
    !changelogUpdated ||
    !versionAssigned;

  let status: ReleaseReadinessStatus;
  if (hasHardBlocker) {
    status = "NOT_READY";
  } else if (hasSoftBlocker) {
    status = "AT_RISK";
  } else {
    status = "READY";
  }

  return { status, reasons };
}

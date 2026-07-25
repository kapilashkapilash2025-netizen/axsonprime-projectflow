import { describe, expect, it } from "vitest";
import { calculateReleaseReadiness } from "@/domain/releaseReadiness";
import type { ReleaseReadinessInput } from "@/domain/types";

function baseInput(
  overrides: Partial<ReleaseReadinessInput> = {},
): ReleaseReadinessInput {
  return {
    requiredTasksTotal: 5,
    requiredTasksCompleted: 5,
    criticalOpenIssues: 0,
    qualityGates: [
      { check: "LINT", passed: true },
      { check: "TYPE_CHECK", passed: true },
      { check: "UNIT_TESTS", passed: true },
      { check: "E2E_TESTS", passed: true },
      { check: "PRODUCTION_BUILD", passed: true },
      { check: "SECURITY_REVIEW", passed: true },
      { check: "ACCESSIBILITY_REVIEW", passed: true },
      { check: "DOCUMENTATION_REVIEW", passed: true },
    ],
    documentationReviewed: true,
    changelogUpdated: true,
    versionAssigned: true,
    ...overrides,
  };
}

describe("calculateReleaseReadiness", () => {
  it("is READY when every requirement is satisfied", () => {
    const result = calculateReleaseReadiness(baseInput());
    expect(result.status).toBe("READY");
    expect(result.reasons.every((r) => r.satisfied)).toBe(true);
  });

  it("is NOT_READY when required tasks are incomplete", () => {
    const result = calculateReleaseReadiness(
      baseInput({ requiredTasksCompleted: 3, requiredTasksTotal: 5 }),
    );
    expect(result.status).toBe("NOT_READY");
  });

  it("is NOT_READY when there are open critical issues, even if everything else passes", () => {
    const result = calculateReleaseReadiness(
      baseInput({ criticalOpenIssues: 2 }),
    );
    expect(result.status).toBe("NOT_READY");
  });

  it("is NOT_READY when unit tests or the production build are failing", () => {
    const result = calculateReleaseReadiness(
      baseInput({
        qualityGates: [
          { check: "UNIT_TESTS", passed: false },
          { check: "E2E_TESTS", passed: true },
          { check: "PRODUCTION_BUILD", passed: true },
        ],
      }),
    );
    expect(result.status).toBe("NOT_READY");
  });

  it("is AT_RISK when only soft blockers (docs/changelog/version) are missing", () => {
    const result = calculateReleaseReadiness(
      baseInput({ documentationReviewed: false, changelogUpdated: false }),
    );
    expect(result.status).toBe("AT_RISK");
  });

  it("is AT_RISK when a non-critical quality gate (e.g. lint) has not passed", () => {
    const result = calculateReleaseReadiness(
      baseInput({
        qualityGates: [
          { check: "LINT", passed: false },
          { check: "UNIT_TESTS", passed: true },
          { check: "E2E_TESTS", passed: true },
          { check: "PRODUCTION_BUILD", passed: true },
        ],
      }),
    );
    expect(result.status).toBe("AT_RISK");
  });

  it("reports a reason for each evaluated criterion", () => {
    const result = calculateReleaseReadiness(baseInput());
    expect(result.reasons.length).toBeGreaterThanOrEqual(7);
  });
});

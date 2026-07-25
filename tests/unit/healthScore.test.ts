import { describe, expect, it } from "vitest";
import { calculateProjectHealthScore } from "@/domain/healthScore";
import type { ProjectHealthInput } from "@/domain/types";

const NOW = new Date("2026-07-12T00:00:00Z");

function baseInput(
  overrides: Partial<ProjectHealthInput> = {},
): ProjectHealthInput {
  return {
    tasks: [],
    issues: [],
    qualityGates: [],
    milestones: [],
    now: NOW,
    ...overrides,
  };
}

describe("calculateProjectHealthScore", () => {
  it("gives a new project with no tasks and no gates a middling score", () => {
    const result = calculateProjectHealthScore(baseInput());
    expect(result.score).toBe(50);
    expect(result.breakdown.taskCompletionScore).toBe(50);
    expect(result.breakdown.qualityGateScore).toBe(0);
  });

  it("scores 100 when all tasks and gates are complete with no issues", () => {
    const result = calculateProjectHealthScore(
      baseInput({
        tasks: [{ status: "COMPLETED", dueDate: null, completedAt: NOW }],
        qualityGates: [{ check: "LINT", passed: true }],
      }),
    );
    expect(result.score).toBe(100);
  });

  it("is deterministic for the same input", () => {
    const input = baseInput({
      tasks: [{ status: "IN_PROGRESS", dueDate: null, completedAt: null }],
      qualityGates: [
        { check: "LINT", passed: true },
        { check: "UNIT_TESTS", passed: false },
      ],
    });
    const first = calculateProjectHealthScore(input);
    const second = calculateProjectHealthScore(input);
    expect(first).toEqual(second);
  });

  it("penalizes open critical issues, capped at the maximum penalty", () => {
    const input = baseInput({
      issues: Array.from({ length: 10 }, () => ({
        status: "OPEN" as const,
        severity: "CRITICAL" as const,
      })),
    });
    const result = calculateProjectHealthScore(input);
    expect(result.breakdown.criticalIssuePenalty).toBe(30);
    expect(result.score).toBe(20);
  });

  it("does not penalize resolved critical issues", () => {
    const input = baseInput({
      issues: [{ status: "RESOLVED", severity: "CRITICAL" }],
    });
    const result = calculateProjectHealthScore(input);
    expect(result.breakdown.criticalIssuePenalty).toBe(0);
  });

  it("penalizes overdue incomplete tasks, capped at the maximum penalty", () => {
    const overdue = new Date("2026-01-01T00:00:00Z");
    const input = baseInput({
      tasks: Array.from({ length: 10 }, () => ({
        status: "IN_PROGRESS" as const,
        dueDate: overdue,
        completedAt: null,
      })),
    });
    const result = calculateProjectHealthScore(input);
    expect(result.breakdown.overdueTaskPenalty).toBe(20);
  });

  it("never returns a score below 0 or above 100", () => {
    const overdue = new Date("2026-01-01T00:00:00Z");
    const worst = calculateProjectHealthScore(
      baseInput({
        tasks: Array.from({ length: 20 }, () => ({
          status: "BLOCKED" as const,
          dueDate: overdue,
          completedAt: null,
        })),
        issues: Array.from({ length: 20 }, () => ({
          status: "OPEN" as const,
          severity: "CRITICAL" as const,
        })),
        milestones: Array.from({ length: 20 }, () => ({
          dueDate: overdue,
          completed: false,
        })),
      }),
    );
    expect(worst.score).toBeGreaterThanOrEqual(0);

    const best = calculateProjectHealthScore(
      baseInput({
        tasks: [{ status: "COMPLETED", dueDate: null, completedAt: NOW }],
        qualityGates: [{ check: "LINT", passed: true }],
      }),
    );
    expect(best.score).toBeLessThanOrEqual(100);
  });
});

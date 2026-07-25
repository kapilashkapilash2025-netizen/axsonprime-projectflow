import type { ProjectHealthInput, ProjectHealthResult } from "./types";

const MAX_TASK_COMPLETION_POINTS = 50;
const MAX_QUALITY_GATE_POINTS = 50;
const MAX_CRITICAL_ISSUE_PENALTY = 30;
const MAX_OVERDUE_TASK_PENALTY = 20;
const MAX_OVERDUE_MILESTONE_PENALTY = 15;

const POINTS_PER_OPEN_CRITICAL_ISSUE = 10;
const POINTS_PER_OPEN_HIGH_ISSUE = 4;
const POINTS_PER_OVERDUE_TASK = 3;
const POINTS_PER_OVERDUE_MILESTONE = 5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Deterministic project health score (0-100). Pure function of its input snapshot —
 * same input always produces the same score. Formula documented in
 * docs/adr/0004-health-score-formula.md; keep this file and that ADR in sync.
 */
export function calculateProjectHealthScore(
  input: ProjectHealthInput,
): ProjectHealthResult {
  const { tasks, issues, qualityGates, milestones, now } = input;

  const taskCompletionScore =
    tasks.length === 0
      ? MAX_TASK_COMPLETION_POINTS
      : Math.round(
          (tasks.filter((t) => t.status === "COMPLETED").length /
            tasks.length) *
            MAX_TASK_COMPLETION_POINTS,
        );

  const qualityGateScore =
    qualityGates.length === 0
      ? 0
      : Math.round(
          (qualityGates.filter((g) => g.passed).length / qualityGates.length) *
            MAX_QUALITY_GATE_POINTS,
        );

  const openIssues = issues.filter(
    (i) => i.status === "OPEN" || i.status === "IN_PROGRESS",
  );
  const criticalIssuePenalty = clamp(
    openIssues.filter((i) => i.severity === "CRITICAL").length *
      POINTS_PER_OPEN_CRITICAL_ISSUE +
      openIssues.filter((i) => i.severity === "HIGH").length *
        POINTS_PER_OPEN_HIGH_ISSUE,
    0,
    MAX_CRITICAL_ISSUE_PENALTY,
  );

  const overdueTaskCount = tasks.filter(
    (t) =>
      t.status !== "COMPLETED" &&
      t.dueDate !== null &&
      t.dueDate.getTime() < now.getTime(),
  ).length;
  const overdueTaskPenalty = clamp(
    overdueTaskCount * POINTS_PER_OVERDUE_TASK,
    0,
    MAX_OVERDUE_TASK_PENALTY,
  );

  const overdueMilestoneCount = milestones.filter(
    (m) =>
      !m.completed && m.dueDate !== null && m.dueDate.getTime() < now.getTime(),
  ).length;
  const overdueMilestonePenalty = clamp(
    overdueMilestoneCount * POINTS_PER_OVERDUE_MILESTONE,
    0,
    MAX_OVERDUE_MILESTONE_PENALTY,
  );

  const score = clamp(
    taskCompletionScore +
      qualityGateScore -
      criticalIssuePenalty -
      overdueTaskPenalty -
      overdueMilestonePenalty,
    0,
    100,
  );

  return {
    score,
    breakdown: {
      taskCompletionScore,
      qualityGateScore,
      criticalIssuePenalty,
      overdueTaskPenalty,
      overdueMilestonePenalty,
    },
  };
}

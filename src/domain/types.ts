export const PROJECT_STATUSES = [
  "PLANNING",
  "ACTIVE",
  "PAUSED",
  "BLOCKED",
  "COMPLETED",
  "ARCHIVED",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PHASE_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;
export type PhaseStatus = (typeof PHASE_STATUSES)[number];

export const TASK_STATUSES = [
  "BACKLOG",
  "READY",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "COMPLETED",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const ISSUE_TYPES = [
  "BUG",
  "FEATURE",
  "SECURITY",
  "DOCUMENTATION",
  "TESTING",
  "TECH_DEBT",
] as const;
export type IssueType = (typeof ISSUE_TYPES)[number];

export const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const ISSUE_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "WONT_FIX",
] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const QUALITY_CHECK_TYPES = [
  "LINT",
  "TYPE_CHECK",
  "UNIT_TESTS",
  "INTEGRATION_TESTS",
  "E2E_TESTS",
  "PRODUCTION_BUILD",
  "SECURITY_REVIEW",
  "ACCESSIBILITY_REVIEW",
  "DOCUMENTATION_REVIEW",
] as const;
export type QualityCheckType = (typeof QUALITY_CHECK_TYPES)[number];

export interface QualityGateSummary {
  check: QualityCheckType;
  passed: boolean;
}

export interface TaskSummary {
  status: TaskStatus;
  dueDate: Date | null;
  completedAt: Date | null;
}

export interface IssueSummary {
  status: IssueStatus;
  severity: Severity;
}

export interface MilestoneSummary {
  dueDate: Date | null;
  completed: boolean;
}

/** Inputs to the deterministic project health score calculation. See docs/adr/0004-health-score-formula.md. */
export interface ProjectHealthInput {
  tasks: TaskSummary[];
  issues: IssueSummary[];
  qualityGates: QualityGateSummary[];
  milestones: MilestoneSummary[];
  now: Date;
}

export interface ProjectHealthResult {
  score: number;
  breakdown: {
    taskCompletionScore: number;
    qualityGateScore: number;
    criticalIssuePenalty: number;
    overdueTaskPenalty: number;
    overdueMilestonePenalty: number;
  };
}

export type ReleaseReadinessStatus = "READY" | "AT_RISK" | "NOT_READY";

export interface ReleaseReadinessInput {
  requiredTasksTotal: number;
  requiredTasksCompleted: number;
  criticalOpenIssues: number;
  qualityGates: QualityGateSummary[];
  documentationReviewed: boolean;
  changelogUpdated: boolean;
  versionAssigned: boolean;
}

export interface ReleaseReadinessReason {
  label: string;
  satisfied: boolean;
}

export interface ReleaseReadinessResult {
  status: ReleaseReadinessStatus;
  reasons: ReleaseReadinessReason[];
}

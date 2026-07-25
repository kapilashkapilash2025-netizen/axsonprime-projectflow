import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { titleCase } from "@/lib/utils";

const STATUS_VARIANTS: Record<string, NonNullable<BadgeProps["variant"]>> = {
  PLANNING: "neutral",
  ACTIVE: "accent",
  PAUSED: "warning",
  BLOCKED: "danger",
  COMPLETED: "success",
  ARCHIVED: "neutral",
  NOT_STARTED: "neutral",
  IN_PROGRESS: "accent",
  BACKLOG: "neutral",
  READY: "accent",
  IN_REVIEW: "warning",
  OPEN: "danger",
  RESOLVED: "success",
  WONT_FIX: "neutral",
  LOW: "neutral",
  MEDIUM: "accent",
  HIGH: "warning",
  CRITICAL: "danger",
  READY_RELEASE: "success",
  AT_RISK: "warning",
  NOT_READY: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANTS[status] ?? "neutral";
  return <Badge variant={variant}>{titleCase(status)}</Badge>;
}

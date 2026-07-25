import { cn } from "@/lib/utils";

function scoreColorClass(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

export function HealthScore({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-semibold tabular-nums",
        scoreColorClass(score),
        className,
      )}
      aria-label={`Health score ${score} out of 100`}
    >
      {score}
    </span>
  );
}

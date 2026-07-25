import { Check, X } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { ReleaseReadinessResult } from "@/domain/types";

export function ReleaseReadinessPanel({
  result,
}: {
  result: ReleaseReadinessResult;
}) {
  return (
    <div className="flex flex-col gap-3">
      <StatusBadge status={result.status} />
      <ul className="flex flex-col gap-1.5 text-sm">
        {result.reasons.map((reason) => (
          <li key={reason.label} className="flex items-center gap-2">
            {reason.satisfied ? (
              <Check
                className="h-4 w-4 shrink-0 text-success"
                aria-hidden="true"
              />
            ) : (
              <X className="h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
            )}
            <span className={reason.satisfied ? undefined : "text-foreground"}>
              {reason.label}
            </span>
            <span className="sr-only">
              {reason.satisfied ? "satisfied" : "not satisfied"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

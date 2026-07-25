import { QUALITY_CHECK_TYPES, type QualityCheckType } from "@/domain/types";
import { Button } from "@/components/ui/Button";
import { titleCase } from "@/lib/utils";
import { toggleQualityGateAction } from "./actions";

interface QualityChecklistProps {
  projectId: string;
  gates: { check: QualityCheckType; passed: boolean; notes: string | null }[];
}

export function QualityChecklist({ projectId, gates }: QualityChecklistProps) {
  const gateByCheck = new Map(gates.map((g) => [g.check, g]));

  return (
    <ul className="flex flex-col divide-y divide-border">
      {QUALITY_CHECK_TYPES.map((check) => {
        const gate = gateByCheck.get(check);
        const passed = gate?.passed ?? false;
        return (
          <li
            key={check}
            className="flex items-center justify-between gap-3 py-2.5 text-sm"
          >
            <div>
              <p className="font-medium">{titleCase(check)}</p>
              {gate?.notes && (
                <p className="text-xs text-muted-foreground">{gate.notes}</p>
              )}
            </div>
            <form action={toggleQualityGateAction}>
              <input type="hidden" name="projectId" value={projectId} />
              <input type="hidden" name="check" value={check} />
              <input type="hidden" name="passed" value={(!passed).toString()} />
              <Button
                type="submit"
                variant={passed ? "outline" : "primary"}
                size="sm"
              >
                {passed ? "Passing — mark failed" : "Mark as passing"}
              </Button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}

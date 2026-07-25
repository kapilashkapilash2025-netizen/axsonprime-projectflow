import { Card, CardContent } from "@/components/ui/Card";
import { Label, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { HealthScore } from "@/components/HealthScore";
import { PrintButton } from "@/components/PrintButton";
import { ReleaseReadinessPanel } from "@/features/releases/ReleaseReadinessPanel";
import { formatDate, titleCase } from "@/lib/utils";
import { listProjects, getProjectById } from "@/repositories/projectRepository";
import { getProjectHealth } from "@/services/projectHealthService";
import { getReleaseReadiness } from "@/services/releaseReadinessService";
import { QUALITY_CHECK_TYPES } from "@/domain/types";

export const dynamic = "force-dynamic";

interface ReportsPageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const projects = await listProjects();
  const { projectId } = await searchParams;
  const activeProjectId = projectId ?? projects[0]?.id;

  if (!activeProjectId) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Create a project to generate a report.
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = await getProjectById(activeProjectId);
  if (!project) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Project not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const [health, readiness] = await Promise.all([
    getProjectHealth(project.id),
    getReleaseReadiness(project.id),
  ]);

  const openRisks = [
    ...project.issues
      .filter(
        (i) =>
          i.status !== "RESOLVED" &&
          (i.severity === "CRITICAL" || i.severity === "HIGH"),
      )
      .map((i) => `${titleCase(i.severity)} ${titleCase(i.type)}: ${i.title}`),
    ...project.tasks
      .filter((t) => t.status === "BLOCKED")
      .map((t) => `Blocked task: ${t.title}`),
  ];

  const completedPhases = project.phases.filter(
    (p) => p.status === "COMPLETED",
  ).length;

  return (
    <div className="flex flex-col gap-6 print:gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            A print-friendly status report for a single project.
          </p>
        </div>
        <PrintButton />
      </div>

      <form method="get" className="flex items-end gap-3 no-print">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="projectId">Project</Label>
          <Select
            id="projectId"
            name="projectId"
            defaultValue={activeProjectId}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" variant="outline" size="sm">
          View report
        </Button>
      </form>

      <div className="rounded-lg border border-border bg-surface p-6 print:border-none print:p-0">
        <header className="mb-6 border-b border-border pb-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Project status report
          </p>
          <h2 className="text-xl font-semibold">{project.name}</h2>
          <p className="text-sm text-muted-foreground">
            Generated {formatDate(new Date())}
          </p>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <StatusBadge status={project.status} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Health score</p>
            <HealthScore score={health.score} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Release readiness</p>
            <StatusBadge status={readiness.status} />
          </div>
        </section>

        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Phase completion
          </h3>
          <p className="text-sm">
            {completedPhases} of {project.phases.length} phases completed.
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {project.phases.map((phase) => (
              <li key={phase.id} className="flex items-center justify-between">
                <span>{phase.name}</span>
                <StatusBadge status={phase.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Development progress
          </h3>
          <p className="text-sm">
            {project.tasks.filter((t) => t.status === "COMPLETED").length} of{" "}
            {project.tasks.length} tasks completed ({project.progress}% overall
            progress).
          </p>
        </section>

        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Quality checks
          </h3>
          <ul className="grid gap-1 text-sm sm:grid-cols-2">
            {QUALITY_CHECK_TYPES.map((check) => {
              const gate = project.qualityGates.find((g) => g.check === check);
              return (
                <li key={check} className="flex items-center justify-between">
                  <span>{titleCase(check)}</span>
                  <StatusBadge status={gate?.passed ? "COMPLETED" : "OPEN"} />
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Open risks
          </h3>
          {openRisks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No high-severity risks or blocked tasks recorded.
            </p>
          ) : (
            <ul className="list-inside list-disc text-sm">
              {openRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Release readiness detail
          </h3>
          <ReleaseReadinessPanel result={readiness} />
        </section>
      </div>
    </div>
  );
}

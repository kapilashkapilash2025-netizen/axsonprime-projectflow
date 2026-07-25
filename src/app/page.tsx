import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { HealthScore } from "@/components/HealthScore";
import { formatDate } from "@/lib/utils";
import { getDashboardData } from "@/services/dashboardService";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const body = (
    <Card className="h-full transition-colors hover:border-accent/40">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-3xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
  return href ? (
    <Link
      href={href}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {body}
    </Link>
  ) : (
    body
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (data.totalProjects === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-2xl font-semibold">Welcome to ProjectFlow</h1>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t have any projects yet.{" "}
          <Link
            href="/projects/new"
            className="text-accent underline underline-offset-4"
          >
            Create your first project
          </Link>{" "}
          to see it summarized here.
        </p>
      </div>
    );
  }

  const gatePassRate =
    data.qualityStatus.totalGates === 0
      ? null
      : Math.round(
          (data.qualityStatus.passedGates / data.qualityStatus.totalGates) *
            100,
        );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          An overview of everything ProjectFlow is tracking right now.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total projects"
          value={data.totalProjects}
          href="/projects"
        />
        <StatCard
          label="Active projects"
          value={data.activeProjects}
          href="/projects?status=ACTIVE"
        />
        <StatCard
          label="Completed tasks"
          value={data.completedTasks}
          href="/tasks?status=COMPLETED"
        />
        <StatCard label="Open tasks" value={data.openTasks} href="/tasks" />
        <StatCard
          label="Blocked tasks"
          value={data.blockedTasks}
          href="/tasks?status=BLOCKED"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Project health</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-2">
            {data.projectHealth.length === 0 && (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
            {data.projectHealth.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-sm"
              >
                <Link href={`/projects/${p.id}`} className="hover:underline">
                  {p.name}
                </Link>
                <HealthScore score={p.score} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test &amp; build status</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {gatePassRate === null ? (
              <p className="text-sm text-muted-foreground">
                No quality gates recorded yet. Add checks from a project&apos;s
                Quality tab.
              </p>
            ) : (
              <>
                <p className="text-3xl font-semibold tabular-nums">
                  {gatePassRate}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.qualityStatus.passedGates} of{" "}
                  {data.qualityStatus.totalGates} quality gates passing across
                  all projects
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release readiness</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-2 text-sm">
            <div className="flex justify-between">
              <span className="text-success">Ready</span>
              <span className="tabular-nums">
                {data.releaseReadiness.ready}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-warning">At risk</span>
              <span className="tabular-nums">
                {data.releaseReadiness.atRisk}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-danger">Not ready</span>
              <span className="tabular-nums">
                {data.releaseReadiness.notReady}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming milestones</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {data.upcomingMilestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No upcoming milestones.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {data.upcomingMilestones.map((m) => (
                  <li key={m.id} className="flex items-center justify-between">
                    <span>
                      {m.name}{" "}
                      <span className="text-muted-foreground">
                        — {m.projectName}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      {formatDate(m.dueDate)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {data.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No activity recorded yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {data.recentActivity.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span>
                      {a.message}{" "}
                      <span className="text-muted-foreground">
                        — {a.projectName}
                      </span>
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {formatDate(a.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

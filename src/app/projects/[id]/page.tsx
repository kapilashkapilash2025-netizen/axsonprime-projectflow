import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { HealthScore } from "@/components/HealthScore";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, isOverdue } from "@/lib/utils";
import { getProjectById } from "@/repositories/projectRepository";
import { getProjectHealth } from "@/services/projectHealthService";
import { getReleaseReadiness } from "@/services/releaseReadinessService";
import { archiveProjectAction } from "@/features/projects/actions";
import { toggleMilestoneAction } from "@/features/milestones/actions";
import { QualityChecklist } from "@/features/quality/QualityChecklist";
import { GitHubLinkForm } from "@/features/github/GitHubLinkForm";
import { ReleaseForm } from "@/features/releases/ReleaseForm";
import { ReleaseReadinessPanel } from "@/features/releases/ReleaseReadinessPanel";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const [health, readiness] = await Promise.all([
    getProjectHealth(id),
    getReleaseReadiness(id),
  ]);

  const boundArchiveAction = archiveProjectAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {project.name}
            </h1>
            {project.isSample && <Badge variant="neutral">Sample data</Badge>}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            <StatusBadge status={project.priority} />
            <span className="text-sm text-muted-foreground">
              Health score: <HealthScore score={health.score} />
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${id}/edit`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Edit
          </Link>
          {project.status !== "ARCHIVED" && (
            <form action={boundArchiveAction}>
              <Button type="submit" variant="ghost" size="sm">
                Archive
              </Button>
            </form>
          )}
        </div>
      </div>

      {project.description && (
        <p className="max-w-3xl text-sm text-muted-foreground">
          {project.description}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Tech stack</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-sm">
            {project.techStack || "Not specified"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Repository</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-sm">
            {project.repositoryUrl ? (
              <a
                href={project.repositoryUrl}
                className="break-all text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.repositoryUrl}
              </a>
            ) : (
              "Not linked"
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Target release</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-sm">
            {formatDate(project.targetReleaseDate)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-sm">
            <div className="mb-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full bg-accent"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            {project.progress}%
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phases</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {project.phases.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No phases defined yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {project.phases.map((phase) => (
                  <li
                    key={phase.id}
                    className="flex items-center justify-between"
                  >
                    <span>{phase.name}</span>
                    <StatusBadge status={phase.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {project.milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No milestones defined yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {project.milestones.map((milestone) => (
                  <li
                    key={milestone.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span
                      className={
                        milestone.completed
                          ? "line-through text-muted-foreground"
                          : undefined
                      }
                    >
                      {milestone.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          !milestone.completed && isOverdue(milestone.dueDate)
                            ? "text-danger"
                            : "text-muted-foreground"
                        }
                      >
                        {formatDate(milestone.dueDate)}
                      </span>
                      <form action={toggleMilestoneAction}>
                        <input type="hidden" name="id" value={milestone.id} />
                        <input type="hidden" name="projectId" value={id} />
                        <input
                          type="hidden"
                          name="completed"
                          value={(!milestone.completed).toString()}
                        />
                        <Button type="submit" variant="outline" size="sm">
                          {milestone.completed ? "Reopen" : "Complete"}
                        </Button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>
              Tasks (
              {project.tasks.filter((t) => t.status === "COMPLETED").length}/
              {project.tasks.length} complete)
            </CardTitle>
            <Link
              href={`/tasks/new?projectId=${id}`}
              className="text-xs text-accent hover:underline"
            >
              Add task
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            {project.tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks yet.</p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {project.tasks.slice(0, 6).map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{task.title}</span>
                    <StatusBadge status={task.status} />
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`/tasks?projectId=${id}`}
              className="mt-3 inline-block text-xs text-accent hover:underline"
            >
              View all tasks →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>
              Issues ({project.issues.filter((i) => i.status === "OPEN").length}{" "}
              open)
            </CardTitle>
            <Link
              href={`/issues/new?projectId=${id}`}
              className="text-xs text-accent hover:underline"
            >
              Report issue
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            {project.issues.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No issues recorded.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {project.issues.slice(0, 6).map((issue) => (
                  <li
                    key={issue.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{issue.title}</span>
                    <div className="flex gap-1.5">
                      <StatusBadge status={issue.severity} />
                      <StatusBadge status={issue.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`/issues?projectId=${id}`}
              className="mt-3 inline-block text-xs text-accent hover:underline"
            >
              View all issues →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quality gates</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <QualityChecklist projectId={id} gates={project.qualityGates} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release readiness</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ReleaseReadinessPanel result={readiness} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>GitHub workflow tracking</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <GitHubLinkForm
              projectId={id}
              defaultValues={{
                repositoryUrl:
                  project.githubLink?.repositoryUrl ??
                  project.repositoryUrl ??
                  "",
                branchName: project.githubLink?.branchName ?? "",
                issueNumber: project.githubLink?.issueNumber?.toString() ?? "",
                pullRequestNumber:
                  project.githubLink?.pullRequestNumber?.toString() ?? "",
                pullRequestStatus: project.githubLink?.pullRequestStatus ?? "",
                commitRef: project.githubLink?.commitRef ?? "",
                ciStatus: project.githubLink?.ciStatus ?? "",
                reviewStatus: project.githubLink?.reviewStatus ?? "",
                mergeStatus: project.githubLink?.mergeStatus ?? "",
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Releases</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-2">
            {project.releases.length > 0 && (
              <ul className="flex flex-col gap-1.5 text-sm">
                {project.releases.map((release) => (
                  <li
                    key={release.id}
                    className="flex items-center justify-between"
                  >
                    <span>{release.version}</span>
                    <span className="text-muted-foreground">
                      {formatDate(release.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <ReleaseForm projectId={id} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {project.activityEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No activity recorded yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5 text-sm">
              {project.activityEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between gap-4"
                >
                  <span>{event.message}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {formatDate(event.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

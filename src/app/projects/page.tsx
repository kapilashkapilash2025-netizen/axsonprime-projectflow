import Link from "next/link";
import { PRIORITIES, PROJECT_STATUSES } from "@/domain/types";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, titleCase } from "@/lib/utils";
import { listProjects } from "@/repositories/projectRepository";

export const dynamic = "force-dynamic";

interface ProjectsPageProps {
  searchParams: Promise<{ q?: string; status?: string; priority?: string }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { q = "", status = "", priority = "" } = await searchParams;
  const allProjects = await listProjects();

  const projects = allProjects.filter((p) => {
    const matchesQuery = q
      ? p.name.toLowerCase().includes(q.toLowerCase())
      : true;
    const matchesStatus = status ? p.status === status : true;
    const matchesPriority = priority ? p.priority === priority : true;
    return matchesQuery && matchesStatus && matchesPriority;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {allProjects.length} project{allProjects.length === 1 ? "" : "s"}{" "}
            tracked
          </p>
        </div>
        <Link
          href="/projects/new"
          className={buttonVariants({ variant: "primary" })}
        >
          New project
        </Link>
      </div>

      <form className="grid gap-4 sm:grid-cols-3" method="get">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q">Search by name</Label>
          <Input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Search projects..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status}>
            <option value="">All statuses</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {titleCase(s)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priority">Priority</Label>
          <Select id="priority" name="priority" defaultValue={priority}>
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {titleCase(p)}
              </option>
            ))}
          </Select>
        </div>
        <div className="sm:col-span-3">
          <Button type="submit" variant="outline" size="sm">
            Apply filters
          </Button>
        </div>
      </form>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No projects match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full transition-colors hover:border-accent/40">
                <CardContent className="flex flex-col gap-3 pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-medium">{project.name}</h2>
                    {project.isSample && (
                      <Badge variant="neutral">Sample</Badge>
                    )}
                  </div>
                  {project.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={project.status} />
                    <StatusBadge status={project.priority} />
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.progress}% complete</span>
                    <span>Target: {formatDate(project.targetReleaseDate)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

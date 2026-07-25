import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { getReleaseReadiness } from "@/services/releaseReadinessService";

export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  const projects = await prisma.project.findMany({
    include: { releases: { orderBy: { createdAt: "desc" } } },
    orderBy: { name: "asc" },
  });

  const readinessByProject = await Promise.all(
    projects.map(async (project) => ({
      project,
      readiness: await getReleaseReadiness(project.id),
    })),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Releases</h1>
        <p className="text-sm text-muted-foreground">
          Release-readiness status and recorded release history for every
          project.
        </p>
      </div>

      {readinessByProject.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No projects yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {readinessByProject.map(({ project, readiness }) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full transition-colors hover:border-accent/40">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>{project.name}</CardTitle>
                  <StatusBadge status={readiness.status} />
                </CardHeader>
                <CardContent className="pt-2 text-sm">
                  {project.releases.length === 0 ? (
                    <p className="text-muted-foreground">
                      No releases recorded yet.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-1.5">
                      {project.releases.slice(0, 3).map((release) => (
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

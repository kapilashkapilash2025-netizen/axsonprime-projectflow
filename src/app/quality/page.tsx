import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { QUALITY_CHECK_TYPES } from "@/domain/types";
import { prisma } from "@/lib/db";
import { titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function QualityPage() {
  const projects = await prisma.project.findMany({
    include: { qualityGates: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quality gates</h1>
        <p className="text-sm text-muted-foreground">
          {QUALITY_CHECK_TYPES.length} checks tracked per project — lint, type
          checking, tests, build, and reviews.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No projects yet. Create a project to start tracking quality gates.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const passed = project.qualityGates.filter((g) => g.passed).length;
            const total: number = QUALITY_CHECK_TYPES.length;
            const failingChecks = QUALITY_CHECK_TYPES.filter(
              (check) =>
                !project.qualityGates.find((g) => g.check === check)?.passed,
            );

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full transition-colors hover:border-accent/40">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 pt-2">
                    <p className="text-2xl font-semibold tabular-nums">
                      {passed}/{total}
                    </p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full bg-accent"
                        style={{
                          width: `${total === 0 ? 0 : (passed / total) * 100}%`,
                        }}
                      />
                    </div>
                    {failingChecks.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Outstanding: {failingChecks.map(titleCase).join(", ")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

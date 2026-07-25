import Link from "next/link";
import { ISSUE_STATUSES, ISSUE_TYPES, SEVERITIES } from "@/domain/types";
import { buttonVariants, Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, titleCase } from "@/lib/utils";
import { listIssues } from "@/repositories/issueRepository";
import { listProjects } from "@/repositories/projectRepository";

export const dynamic = "force-dynamic";

interface IssuesPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    severity?: string;
    type?: string;
    projectId?: string;
  }>;
}

export default async function IssuesPage({ searchParams }: IssuesPageProps) {
  const {
    q = "",
    status = "",
    severity = "",
    type = "",
    projectId = "",
  } = await searchParams;
  const [allIssues, projects] = await Promise.all([
    listIssues(),
    listProjects(),
  ]);

  const issues = allIssues.filter((issue) => {
    const matchesQuery = q
      ? issue.title.toLowerCase().includes(q.toLowerCase())
      : true;
    const matchesStatus = status ? issue.status === status : true;
    const matchesSeverity = severity ? issue.severity === severity : true;
    const matchesType = type ? issue.type === type : true;
    const matchesProject = projectId ? issue.projectId === projectId : true;
    return (
      matchesQuery &&
      matchesStatus &&
      matchesSeverity &&
      matchesType &&
      matchesProject
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>
          <p className="text-sm text-muted-foreground">
            {allIssues.length} issue{allIssues.length === 1 ? "" : "s"} across
            all projects
          </p>
        </div>
        <Link
          href="/issues/new"
          className={buttonVariants({ variant: "primary" })}
        >
          Report issue
        </Link>
      </div>

      <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" method="get">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q">Search by title</Label>
          <Input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Search issues..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="projectId">Project</Label>
          <Select id="projectId" name="projectId" defaultValue={projectId}>
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Type</Label>
          <Select id="type" name="type" defaultValue={type}>
            <option value="">All types</option>
            {ISSUE_TYPES.map((t) => (
              <option key={t} value={t}>
                {titleCase(t)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="severity">Severity</Label>
          <Select id="severity" name="severity" defaultValue={severity}>
            <option value="">All severities</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {titleCase(s)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status}>
            <option value="">All statuses</option>
            {ISSUE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {titleCase(s)}
              </option>
            ))}
          </Select>
        </div>
        <div className="lg:col-span-5">
          <Button type="submit" variant="outline" size="sm">
            Apply filters
          </Button>
        </div>
      </form>

      {issues.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No issues match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Title
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Project
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Type
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Severity
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${issue.projectId}`}
                      className="hover:underline"
                    >
                      {issue.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {issue.project.name}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={issue.type} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={issue.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(issue.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

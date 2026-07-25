import Link from "next/link";
import { PRIORITIES, TASK_STATUSES } from "@/domain/types";
import { buttonVariants, Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, isOverdue, titleCase } from "@/lib/utils";
import { listTasks } from "@/repositories/taskRepository";
import { listProjects } from "@/repositories/projectRepository";

export const dynamic = "force-dynamic";

interface TasksPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    priority?: string;
    projectId?: string;
    label?: string;
  }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const {
    q = "",
    status = "",
    priority = "",
    projectId = "",
    label = "",
  } = await searchParams;
  const [allTasks, projects] = await Promise.all([listTasks(), listProjects()]);

  const tasks = allTasks.filter((task) => {
    const matchesQuery = q
      ? task.title.toLowerCase().includes(q.toLowerCase())
      : true;
    const matchesStatus = status ? task.status === status : true;
    const matchesPriority = priority ? task.priority === priority : true;
    const matchesProject = projectId ? task.projectId === projectId : true;
    const matchesLabel = label
      ? (task.labels ?? "").toLowerCase().includes(label.toLowerCase())
      : true;
    return (
      matchesQuery &&
      matchesStatus &&
      matchesPriority &&
      matchesProject &&
      matchesLabel
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {allTasks.length} task{allTasks.length === 1 ? "" : "s"} across all
            projects
          </p>
        </div>
        <Link
          href="/tasks/new"
          className={buttonVariants({ variant: "primary" })}
        >
          New task
        </Link>
      </div>

      <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" method="get">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q">Search by title</Label>
          <Input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Search tasks..."
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
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status}>
            <option value="">All statuses</option>
            {TASK_STATUSES.map((s) => (
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            name="label"
            defaultValue={label}
            placeholder="e.g. frontend"
          />
        </div>
        <div className="lg:col-span-5">
          <Button type="submit" variant="outline" size="sm">
            Apply filters
          </Button>
        </div>
      </form>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No tasks match your filters.
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
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Priority
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Due date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${task.projectId}`}
                      className="hover:underline"
                    >
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {task.project.name}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.priority} />
                  </td>
                  <td
                    className={`px-4 py-3 ${task.status !== "COMPLETED" && isOverdue(task.dueDate) ? "text-danger" : "text-muted-foreground"}`}
                  >
                    {formatDate(task.dueDate)}
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

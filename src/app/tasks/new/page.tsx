import { TaskForm } from "@/features/tasks/TaskForm";
import { createTaskAction } from "@/features/tasks/actions";
import { listProjects } from "@/repositories/projectRepository";

interface NewTaskPageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function NewTaskPage({ searchParams }: NewTaskPageProps) {
  const { projectId } = await searchParams;
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New task</h1>
        <p className="text-sm text-muted-foreground">
          Track a unit of work against one of your projects.
        </p>
      </div>
      <TaskForm
        action={createTaskAction}
        submitLabel="Create task"
        projects={projects}
        defaultValues={
          projectId
            ? {
                projectId,
                title: "",
                description: "",
                status: "BACKLOG",
                priority: "MEDIUM",
                assignee: "",
                dueDate: "",
                labels: "",
                acceptanceCriteria: "",
              }
            : undefined
        }
      />
    </div>
  );
}

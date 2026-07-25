import { ProjectForm } from "@/features/projects/ProjectForm";
import { createProjectAction } from "@/features/projects/actions";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
        <p className="text-sm text-muted-foreground">
          Register a project so ProjectFlow can track its phases, tasks, and
          quality gates.
        </p>
      </div>
      <ProjectForm action={createProjectAction} submitLabel="Create project" />
    </div>
  );
}

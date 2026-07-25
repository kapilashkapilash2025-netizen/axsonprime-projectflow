import { notFound } from "next/navigation";
import { ProjectForm } from "@/features/projects/ProjectForm";
import { updateProjectAction } from "@/features/projects/actions";
import { getProjectById } from "@/repositories/projectRepository";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const boundAction = updateProjectAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit {project.name}
        </h1>
      </div>
      <ProjectForm
        action={boundAction}
        submitLabel="Save changes"
        defaultValues={{
          name: project.name,
          description: project.description ?? "",
          status: project.status,
          priority: project.priority,
          techStack: project.techStack ?? "",
          repositoryUrl: project.repositoryUrl ?? "",
          targetReleaseDate: project.targetReleaseDate
            ? project.targetReleaseDate.toISOString().slice(0, 10)
            : "",
          progress: project.progress,
        }}
      />
    </div>
  );
}

import { IssueForm } from "@/features/issues/IssueForm";
import { createIssueAction } from "@/features/issues/actions";
import { listProjects } from "@/repositories/projectRepository";

interface NewIssuePageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function NewIssuePage({
  searchParams,
}: NewIssuePageProps) {
  const { projectId } = await searchParams;
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Report an issue
        </h1>
        <p className="text-sm text-muted-foreground">
          Record a bug, feature request, security concern, or piece of technical
          debt.
        </p>
      </div>
      <IssueForm
        action={createIssueAction}
        submitLabel="Create issue"
        projects={projects}
        defaultValues={
          projectId
            ? {
                projectId,
                title: "",
                description: "",
                type: "BUG",
                severity: "MEDIUM",
                status: "OPEN",
                acceptanceCriteria: "",
                resolutionNotes: "",
              }
            : undefined
        }
      />
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { ISSUE_STATUSES, ISSUE_TYPES, SEVERITIES } from "@/domain/types";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui/Input";
import { titleCase } from "@/lib/utils";
import type { IssueActionState } from "./actions";

const INITIAL_STATE: IssueActionState = { error: null, fieldErrors: {} };

interface IssueFormProps {
  action: (
    state: IssueActionState,
    formData: FormData,
  ) => Promise<IssueActionState>;
  submitLabel: string;
  projects: { id: string; name: string }[];
  defaultValues?: {
    projectId: string;
    title: string;
    description: string;
    type: string;
    severity: string;
    status: string;
    acceptanceCriteria: string;
    resolutionNotes: string;
  };
}

export function IssueForm({
  action,
  submitLabel,
  projects,
  defaultValues,
}: IssueFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  return (
    <form
      action={formAction}
      className="flex max-w-2xl flex-col gap-5"
      noValidate
    >
      {state.error && (
        <p
          role="alert"
          className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="projectId">Project</Label>
        <Select
          id="projectId"
          name="projectId"
          defaultValue={defaultValues?.projectId}
          required
        >
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
        <FieldError>{state.fieldErrors.projectId}</FieldError>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
          maxLength={200}
        />
        <FieldError>{state.fieldErrors.title}</FieldError>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          maxLength={2000}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Type</Label>
          <Select
            id="type"
            name="type"
            defaultValue={defaultValues?.type ?? "BUG"}
          >
            {ISSUE_TYPES.map((type) => (
              <option key={type} value={type}>
                {titleCase(type)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="severity">Severity</Label>
          <Select
            id="severity"
            name="severity"
            defaultValue={defaultValues?.severity ?? "MEDIUM"}
          >
            {SEVERITIES.map((severity) => (
              <option key={severity} value={severity}>
                {titleCase(severity)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "OPEN"}
          >
            {ISSUE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="acceptanceCriteria">Acceptance criteria</Label>
        <Textarea
          id="acceptanceCriteria"
          name="acceptanceCriteria"
          defaultValue={defaultValues?.acceptanceCriteria}
          maxLength={2000}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="resolutionNotes">Resolution notes</Label>
        <Textarea
          id="resolutionNotes"
          name="resolutionNotes"
          defaultValue={defaultValues?.resolutionNotes}
          maxLength={2000}
        />
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

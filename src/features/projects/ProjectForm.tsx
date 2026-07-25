"use client";

import { useActionState } from "react";
import { PRIORITIES, PROJECT_STATUSES } from "@/domain/types";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui/Input";
import { titleCase } from "@/lib/utils";
import type { ProjectActionState } from "./actions";

interface ProjectFormProps {
  action: (
    state: ProjectActionState,
    formData: FormData,
  ) => Promise<ProjectActionState>;
  submitLabel: string;
  defaultValues?: {
    name: string;
    description: string;
    status: string;
    priority: string;
    techStack: string;
    repositoryUrl: string;
    targetReleaseDate: string;
    progress: number;
  };
}

const INITIAL_STATE: ProjectActionState = { error: null, fieldErrors: {} };

export function ProjectForm({
  action,
  submitLabel,
  defaultValues,
}: ProjectFormProps) {
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
        <Label htmlFor="name">Project name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          required
          maxLength={120}
        />
        <FieldError>{state.fieldErrors.name}</FieldError>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          maxLength={2000}
        />
        <FieldError>{state.fieldErrors.description}</FieldError>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "PLANNING"}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            name="priority"
            defaultValue={defaultValues?.priority ?? "MEDIUM"}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {titleCase(priority)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="techStack">Technology stack</Label>
        <Input
          id="techStack"
          name="techStack"
          placeholder="e.g. Next.js, TypeScript, Prisma"
          defaultValue={defaultValues?.techStack}
          maxLength={300}
        />
        <FieldError>{state.fieldErrors.techStack}</FieldError>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="repositoryUrl">Repository URL</Label>
        <Input
          id="repositoryUrl"
          name="repositoryUrl"
          type="url"
          placeholder="https://github.com/org/repo"
          defaultValue={defaultValues?.repositoryUrl}
          maxLength={300}
        />
        <FieldError>{state.fieldErrors.repositoryUrl}</FieldError>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="targetReleaseDate">Target release date</Label>
          <Input
            id="targetReleaseDate"
            name="targetReleaseDate"
            type="date"
            defaultValue={defaultValues?.targetReleaseDate}
          />
          <FieldError>{state.fieldErrors.targetReleaseDate}</FieldError>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            name="progress"
            type="number"
            min={0}
            max={100}
            defaultValue={defaultValues?.progress ?? 0}
          />
          <FieldError>{state.fieldErrors.progress}</FieldError>
        </div>
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

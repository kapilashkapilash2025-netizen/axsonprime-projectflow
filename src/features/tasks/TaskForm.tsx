"use client";

import { useActionState } from "react";
import { PRIORITIES, TASK_STATUSES } from "@/domain/types";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui/Input";
import { titleCase } from "@/lib/utils";
import type { TaskActionState } from "./actions";

const INITIAL_STATE: TaskActionState = { error: null, fieldErrors: {} };

interface TaskFormProps {
  action: (
    state: TaskActionState,
    formData: FormData,
  ) => Promise<TaskActionState>;
  submitLabel: string;
  projects: { id: string; name: string }[];
  defaultValues?: {
    projectId: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee: string;
    dueDate: string;
    labels: string;
    acceptanceCriteria: string;
  };
}

export function TaskForm({
  action,
  submitLabel,
  projects,
  defaultValues,
}: TaskFormProps) {
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

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "BACKLOG"}
          >
            {TASK_STATUSES.map((status) => (
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

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="assignee">Assignee</Label>
          <Input
            id="assignee"
            name="assignee"
            placeholder="Name (optional)"
            defaultValue={defaultValues?.assignee}
            maxLength={120}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dueDate">Due date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={defaultValues?.dueDate}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="labels">Labels</Label>
        <Input
          id="labels"
          name="labels"
          placeholder="comma,separated,labels"
          defaultValue={defaultValues?.labels}
          maxLength={300}
        />
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

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

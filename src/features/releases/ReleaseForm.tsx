"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { createReleaseAction, type ReleaseActionState } from "./actions";

const INITIAL_STATE: ReleaseActionState = { error: null };

export function ReleaseForm({ projectId }: { projectId: string }) {
  const boundAction = createReleaseAction.bind(null, projectId);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error && (
        <p
          role="alert"
          className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="version">Version</Label>
        <Input
          id="version"
          name="version"
          placeholder="0.2.0"
          required
          maxLength={40}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="changelogUpdated"
          name="changelogUpdated"
          type="checkbox"
          className="h-4 w-4"
        />
        <Label htmlFor="changelogUpdated">Changelog updated</Label>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          name="notes"
          placeholder="Optional release notes"
          maxLength={2000}
        />
      </div>
      <div>
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          {isPending ? "Recording..." : "Record release"}
        </Button>
      </div>
    </form>
  );
}

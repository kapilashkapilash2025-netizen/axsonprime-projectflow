"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { upsertGitHubLinkAction, type GitHubLinkActionState } from "./actions";

const INITIAL_STATE: GitHubLinkActionState = { error: null };

interface GitHubLinkFormProps {
  projectId: string;
  defaultValues: {
    repositoryUrl: string;
    branchName: string;
    issueNumber: string;
    pullRequestNumber: string;
    pullRequestStatus: string;
    commitRef: string;
    ciStatus: string;
    reviewStatus: string;
    mergeStatus: string;
  };
}

export function GitHubLinkForm({
  projectId,
  defaultValues,
}: GitHubLinkFormProps) {
  const boundAction = upsertGitHubLinkAction.bind(null, projectId);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      {state.error && (
        <p
          role="alert"
          className="col-span-2 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="repositoryUrl">Repository URL</Label>
        <Input
          id="repositoryUrl"
          name="repositoryUrl"
          defaultValue={defaultValues.repositoryUrl}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="branchName">Branch name</Label>
        <Input
          id="branchName"
          name="branchName"
          defaultValue={defaultValues.branchName}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="issueNumber">Issue number</Label>
        <Input
          id="issueNumber"
          name="issueNumber"
          type="number"
          min={1}
          defaultValue={defaultValues.issueNumber}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pullRequestNumber">Pull request number</Label>
        <Input
          id="pullRequestNumber"
          name="pullRequestNumber"
          type="number"
          min={1}
          defaultValue={defaultValues.pullRequestNumber}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pullRequestStatus">Pull request status</Label>
        <Input
          id="pullRequestStatus"
          name="pullRequestStatus"
          placeholder="open / merged / closed"
          defaultValue={defaultValues.pullRequestStatus}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="commitRef">Commit reference</Label>
        <Input
          id="commitRef"
          name="commitRef"
          placeholder="abc1234"
          defaultValue={defaultValues.commitRef}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ciStatus">CI status</Label>
        <Input
          id="ciStatus"
          name="ciStatus"
          placeholder="passing / failing"
          defaultValue={defaultValues.ciStatus}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reviewStatus">Review status</Label>
        <Input
          id="reviewStatus"
          name="reviewStatus"
          placeholder="in_review / approved"
          defaultValue={defaultValues.reviewStatus}
        />
      </div>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="mergeStatus">Merge status</Label>
        <Input
          id="mergeStatus"
          name="mergeStatus"
          placeholder="unmerged / merged"
          defaultValue={defaultValues.mergeStatus}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          {isPending ? "Saving..." : "Save GitHub details"}
        </Button>
      </div>
    </form>
  );
}

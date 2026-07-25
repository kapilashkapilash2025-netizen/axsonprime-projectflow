"use client";

import { useActionState } from "react";
import { PROJECT_STATUSES } from "@/domain/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { titleCase } from "@/lib/utils";
import { updateSettingsAction, type SettingsActionState } from "./actions";

const INITIAL_STATE: SettingsActionState = { error: null, success: false };

interface SettingsFormProps {
  defaultValues: {
    applicationName: string;
    organizationName: string;
    defaultProjectStatus: string;
    dateFormat: string;
    themePreference: string;
  };
}

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {state.error && (
        <p
          role="alert"
          className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className="rounded-md bg-success/10 px-3 py-2 text-sm text-success"
        >
          Settings saved.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="applicationName">Application name</Label>
        <Input
          id="applicationName"
          name="applicationName"
          defaultValue={defaultValues.applicationName}
          maxLength={120}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="organizationName">Organization name</Label>
        <Input
          id="organizationName"
          name="organizationName"
          defaultValue={defaultValues.organizationName}
          maxLength={120}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="defaultProjectStatus">Default project status</Label>
        <Select
          id="defaultProjectStatus"
          name="defaultProjectStatus"
          defaultValue={defaultValues.defaultProjectStatus}
        >
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {titleCase(status)}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dateFormat">Date format</Label>
        <Select
          id="dateFormat"
          name="dateFormat"
          defaultValue={defaultValues.dateFormat}
        >
          <option value="yyyy-MM-dd">YYYY-MM-DD</option>
          <option value="MM/dd/yyyy">MM/DD/YYYY</option>
          <option value="dd/MM/yyyy">DD/MM/YYYY</option>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="themePreference">Theme preference</Label>
        <Select
          id="themePreference"
          name="themePreference"
          defaultValue={defaultValues.themePreference}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">System</option>
        </Select>
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}

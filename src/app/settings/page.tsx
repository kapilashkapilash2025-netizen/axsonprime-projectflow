import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SettingsForm } from "@/features/settings/SettingsForm";
import { resetSampleDataAction } from "@/features/projects/actions";
import { getSettings } from "@/repositories/settingsRepository";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, sampleProjectCount] = await Promise.all([
    getSettings(),
    prisma.project.count({ where: { isSample: true } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Local application preferences. Nothing here is sent anywhere —
          settings are stored in your local database.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <SettingsForm
            defaultValues={{
              applicationName: settings.applicationName,
              organizationName: settings.organizationName,
              defaultProjectStatus: settings.defaultProjectStatus,
              dateFormat: settings.dateFormat,
              themePreference: settings.themePreference,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample data</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-2 text-sm">
          <p className="text-muted-foreground">
            {sampleProjectCount > 0
              ? `${sampleProjectCount} sample project(s) are currently loaded, clearly marked "Sample data" throughout the app.`
              : "No sample data is currently loaded."}
          </p>
          {sampleProjectCount > 0 && (
            <form action={resetSampleDataAction}>
              <Button type="submit" variant="danger" size="sm">
                Remove all sample data
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

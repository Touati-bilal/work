import { JsonImportExport } from "@/components/settings/JsonImportExport";
import { PeopleManager } from "@/components/settings/PeopleManager";
import { Card, SectionHeader } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium text-text-muted">Settings</p>
        <h1 className="text-xl font-bold text-text-primary tracking-tight mt-0.5">App Settings</h1>
      </div>

      <Card className="md:hidden">
        <SectionHeader title="Appearance" subtitle="Follows your device by default" />
        <ThemeToggle />
      </Card>

      <PeopleManager />
      <JsonImportExport />
    </div>
  );
}

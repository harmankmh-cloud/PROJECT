import { SettingsTabs } from "@/components/dashboard/SettingsTabs";
import { PageTransition } from "@/components/ui/PageTransition";

export default function SettingsPage() {
  return (
    <PageTransition>
      <SettingsTabs />
    </PageTransition>
  );
}

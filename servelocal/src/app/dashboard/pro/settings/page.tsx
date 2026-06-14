export default function ProSettingsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted">Notification preferences and account settings</p>
      <div className="mt-8 space-y-4">
        {["Email notifications for new leads", "SMS alerts for urgent jobs", "Weekly performance digest"].map(
          (label) => (
            <label
              key={label}
              className="flex items-center justify-between rounded-[14px] border border-border bg-surface p-4"
            >
              <span className="text-sm text-foreground">{label}</span>
              <input type="checkbox" defaultChecked className="accent-amber-500" />
            </label>
          )
        )}
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/Badge";

const JOBS = [
  { id: "1", client: "Sarah M.", service: "Pipe repair", status: "in_progress", step: 3 },
  { id: "2", client: "James K.", service: "Panel upgrade", status: "quote_sent", step: 1 },
  { id: "3", client: "Priya R.", service: "Deep clean", status: "completed", step: 4 },
];

const STEPS = ["Quote Sent", "Accepted", "In Progress", "Complete"];

export default function ProJobsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Jobs</h1>
      <p className="mt-1 text-sm text-muted">Active jobs with status tracker</p>

      <ul className="mt-6 space-y-4">
        {JOBS.map((job) => (
          <li key={job.id} className="rounded-[14px] border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-foreground">{job.client}</p>
                <p className="text-sm text-muted">{job.service}</p>
              </div>
              <Badge variant={job.status === "completed" ? "success" : "orange"}>
                {job.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="mt-4 flex gap-1">
              {STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < job.step ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">{STEPS[job.step - 1]}</p>
            {job.status === "in_progress" && (
              <button
                type="button"
                className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                Mark as Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

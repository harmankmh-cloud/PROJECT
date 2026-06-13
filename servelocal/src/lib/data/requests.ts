import { createDbClient, createServiceClient } from "@/lib/supabase/admin";
import type { ServiceRequest } from "@/lib/types";

export async function getUserServiceRequests(userId: string, email?: string) {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return [];

  const { data: byUser } = await admin
    .from("service_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (byUser?.length) return byUser as ServiceRequest[];

  if (!email) return [];

  const { data: byEmail } = await admin
    .from("service_requests")
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(50);

  return (byEmail || []) as ServiceRequest[];
}

export async function getServiceRequestById(
  requestId: string,
  userId: string,
  email?: string
): Promise<ServiceRequest | null> {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return null;

  const { data } = await admin.from("service_requests").select("*").eq("id", requestId).maybeSingle();
  if (!data) return null;

  const request = data as ServiceRequest;
  if (request.user_id === userId) return request;
  if (email && request.customer_email?.toLowerCase() === email.toLowerCase()) return request;
  return null;
}

export function groupRequestsByStatus(requests: ServiceRequest[]) {
  const open = requests.filter((r) => r.status === "open" || r.status === "new");
  const inProgress = requests.filter((r) =>
    ["matched", "quoted", "in_progress", "active"].includes(r.status)
  );
  const completed = requests.filter((r) => r.status === "completed" || r.status === "closed");
  return { open, inProgress, completed, all: requests };
}

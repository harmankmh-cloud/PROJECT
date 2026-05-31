import { redirect } from "next/navigation";

/** Scripts editing moved to full manage page */
export default async function AdminBusinessPromptsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/business/${id}#scripts`);
}

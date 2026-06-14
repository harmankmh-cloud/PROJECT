import { redirect } from "next/navigation";
import { getProviderBySlug } from "@/lib/data";

export default async function ProsAliasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = await getProviderBySlug(id);
  if (provider) {
    redirect(`/pro/${provider.slug}`);
  }
  redirect(`/pro/${id}`);
}

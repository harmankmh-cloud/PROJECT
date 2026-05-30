import Link from "next/link";
import { notFound } from "next/navigation";
import { PromptEditor } from "@/components/PromptEditor";
import { sortPrompts } from "@/lib/defaults";
import { getAdminBusinessWithPrompts } from "@/lib/admin-data";
import type { PromptTemplate } from "@/lib/types";

export default async function AdminBusinessPromptsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getAdminBusinessWithPrompts(id);

  if (!data) notFound();

  const sorted = sortPrompts(data.prompts as PromptTemplate[]);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <Link href="/admin/businesses" className="text-sm font-semibold text-gold-600 hover:underline">
            ← All businesses
          </Link>
          <h1 className="font-display mt-3 text-3xl text-brand-950">{data.business.name}</h1>
          <p className="mt-2 text-sm text-stone-500">
            Edit review scripts — business owners don&apos;t see this. Only you control AI wording.
          </p>
        </header>
        <PromptEditor businessId={data.business.id} prompts={sorted} />
      </div>
    </main>
  );
}

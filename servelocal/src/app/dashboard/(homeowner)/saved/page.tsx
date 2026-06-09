import { Bookmark } from "lucide-react";
import { SavedSearchesList } from "@/components/SavedSearchesList";
import { getUserSavedSearches } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const savedSearches = user ? await getUserSavedSearches(user.id) : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-slate-900">Saved</h1>
      <p className="mt-1 text-sm text-slate-500">Saved searches and pros you bookmark.</p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-700">Saved searches</h2>
        <SavedSearchesList initial={savedSearches} />
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-700">Saved pros</h2>
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Bookmark className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Bookmark pros from their profile — coming soon.</p>
        </div>
      </section>
    </div>
  );
}

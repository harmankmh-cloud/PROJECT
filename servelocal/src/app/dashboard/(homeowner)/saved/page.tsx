import { SavedProsList } from "@/components/homeowner/SavedProsList";
import { SavedSearchesList } from "@/components/SavedSearchesList";
import { getUserSavedSearches } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";

export default async function SavedPage() {
  const supabase = await createClient();
  const user = await getServerAuthUser();

  const savedSearches = user ? await getUserSavedSearches(user.id) : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Saved</h1>
      <p className="mt-1 text-sm text-muted">Saved searches and pros you bookmark.</p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-foreground">Saved searches</h2>
        <SavedSearchesList initial={savedSearches} />
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-foreground">Saved pros</h2>
        <div className="mt-4">
          <SavedProsList />
        </div>
      </section>
    </div>
  );
}

-- Allow business owners to read all reviews on their listing (including drafts)

drop policy if exists "Owners read business reviews" on reviews;
create policy "Owners read business reviews"
  on reviews for select
  using (
    exists (
      select 1 from businesses b
      where b.id = reviews.business_id and b.user_id = auth.uid()
    )
  );

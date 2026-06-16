-- RateLocal: tighten public insert policies on feedback and reviews

drop policy if exists "Anyone can submit feedback" on feedback_events;
create policy "Submit feedback for listed businesses"
  on feedback_events for insert
  with check (
    exists (
      select 1 from businesses b
      where b.id = feedback_events.business_id
        and b.slug is not null
    )
  );

drop policy if exists "Authenticated users insert reviews" on reviews;
create policy "Authenticated users insert reviews"
  on reviews for insert
  to authenticated
  with check (
    exists (
      select 1 from businesses b
      where b.id = reviews.business_id
        and b.slug is not null
    )
  );

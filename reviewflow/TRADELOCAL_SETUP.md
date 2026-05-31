# TradeLocal setup

**TradeLocal** is a BC service directory on RateLocal — find local trades, call direct (IndiaMART-style contacts, not doing the work yourself).

Public URL: **https://ratelocal.ca/trade**

---

## 1. Run SQL in Supabase

Copy **all SQL below** into Supabase → SQL Editor → Run (not the filename).

See `supabase/tradelocal.sql` in the repo for the full script.

---

## 2. Add your first listings (admin)

1. Go to **https://ratelocal.ca/admin/trade**
2. Or have tradies apply at **/trade/join**
3. Click **Approve** on pending listings

---

## 3. Marketing (manual first)

1. Sign up **20 tradies** in Surrey/Langley (free listing)
2. Facebook: “Find a plumber in Surrey — TradeLocal.ca/trade”
3. Charge **$49/mo** or **$25/lead** once you have traffic

---

## 4. Cities & categories

Edit `src/lib/tradelocal/constants.ts` to add cities.

Categories are in DB (`service_categories`) — add rows in Supabase for more trades.

---

## Disclaimer on site

TradeLocal lists **contacts only**. Customers hire pros directly. You are not the contractor.

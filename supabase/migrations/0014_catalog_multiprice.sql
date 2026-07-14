-- Catalog: one item holds a price per currency (RSD/EUR/USD) instead of a row per currency.
alter table public.service_items
  add column if not exists price_rsd numeric(12,2),
  add column if not exists price_eur numeric(12,2),
  add column if not exists price_usd numeric(12,2);

-- Backfill from the legacy single price/currency columns.
update public.service_items set price_eur = price where currency = 'EUR' and price_eur is null;
update public.service_items set price_rsd = price where currency = 'RSD' and price_rsd is null;
update public.service_items set price_usd = price where currency = 'USD' and price_usd is null;

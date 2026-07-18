import type { QuoteItem } from "@/lib/types";

export function quoteTotal(items: QuoteItem[]): number {
  return items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);
}

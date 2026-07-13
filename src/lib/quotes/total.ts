import type { QuoteItem } from "@/lib/types";

/** Sum of price × qty across quote line items. Pure — safe on client and server. */
export function quoteTotal(items: QuoteItem[]): number {
  return items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);
}

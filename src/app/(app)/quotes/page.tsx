import { getQuotes } from "@/lib/data/quotes";
import { QuotesView } from "@/components/quotes/QuotesView";

export default async function QuotesPage() {
  const quotes = await getQuotes();
  return <QuotesView quotes={quotes} />;
}

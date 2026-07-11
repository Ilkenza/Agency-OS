export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 py-8 text-black print:bg-white print:py-0">
      {children}
    </div>
  );
}

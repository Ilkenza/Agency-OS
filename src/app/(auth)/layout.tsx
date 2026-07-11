export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base px-4">
      {/* faint dot-grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      {/* soft gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.10] blur-[120px]"
      />
      <div className="relative z-10 w-full max-w-[400px]">{children}</div>
    </div>
  );
}

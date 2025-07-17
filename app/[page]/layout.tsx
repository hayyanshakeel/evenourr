// app/[page]/layout.tsx

// The root layout (app/layout.tsx) already includes the global footer,
// so it does not need to be included here again.
export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className="mx-8 max-w-2xl py-20 sm:mx-auto">{children}</div>
    </div>
  );
}

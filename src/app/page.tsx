export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-heading text-5xl font-bold text-primary">QuickRecall</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Rebuild in progress — RSC-first on the MongoDB design system.
      </p>
      <p className="text-sm text-muted-foreground/70">Phase 0 scaffold is live.</p>
    </main>
  );
}

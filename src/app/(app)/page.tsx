export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-heading text-5xl font-bold text-primary">QuickRecall</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        RSC-first rebuild on the MongoDB design system. Pick a topic from the sidebar.
      </p>
    </div>
  );
}

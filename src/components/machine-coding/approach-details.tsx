import type { ApproachData } from '@/types/content';

export default function ApproachDetails({ approach }: { approach: ApproachData }) {
  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{approach.description}</p>

      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Complexity</p>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-primary/40 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
          ⏱ Time: {approach.timeComplexity}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
          🗄 Space: {approach.spaceComplexity}
        </span>
      </div>

      {approach.pros && approach.pros.length > 0 && (
        <>
          <p className="mb-0.5 text-xs font-bold uppercase tracking-wide text-primary">✅ Pros</p>
          <ul className="mb-4 list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
            {approach.pros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </>
      )}

      {approach.cons && approach.cons.length > 0 && (
        <>
          <p className="mb-0.5 text-xs font-bold uppercase tracking-wide text-destructive">❌ Cons</p>
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
            {approach.cons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

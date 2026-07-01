import { Callout, Variant } from '@leafygreen-ui/callout';
import type { JsProblemMeta } from '@/types/content';

type Props = Omit<JsProblemMeta, 'title'>;

export default function JsProblemStatement({ description, examples, constraints, interviewTip, tags }: Props) {
  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{description}</p>

      <p className="mb-2 text-sm font-semibold">Examples</p>
      <div className="mb-4 space-y-2">
        {examples.map((ex) => (
          <div key={ex.input} className="rounded-md border border-border bg-muted/40 p-3 font-mono text-[13px]">
            <div>
              <span className="text-muted-foreground">Input: </span>
              <span className="text-[color:var(--chart-1)]">{ex.input}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Output: </span>
              <span className="text-primary">{ex.output}</span>
            </div>
            {ex.explanation && (
              <div className="mt-0.5 text-xs text-muted-foreground/70">
                {'// '}
                {ex.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {constraints && constraints.length > 0 && (
        <>
          <p className="mb-1 text-sm font-semibold">Constraints</p>
          <ul className="mb-4 list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
            {constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}

      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-primary/40 px-2 py-0.5 font-mono text-xs text-primary">
              {t}
            </span>
          ))}
        </div>
      )}

      <Callout variant={Variant.Important} title="Interview Tip">
        {interviewTip}
      </Callout>
    </div>
  );
}

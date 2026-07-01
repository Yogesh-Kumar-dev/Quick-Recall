import { Callout, Variant } from '@leafygreen-ui/callout';
import type { ProblemMeta } from '@/types/content';

type Props = Omit<ProblemMeta, 'title'>;

export default function ProblemStatement({ description, requirements, keyPatterns, interviewTip }: Props) {
  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{description}</p>

      <p className="mb-1 text-sm font-semibold">Requirements</p>
      <ul className="mb-4 list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
        {requirements.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <p className="mb-2 text-sm font-semibold">Key Patterns</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {keyPatterns.map((p) => (
          <span key={p} className="rounded-full border border-primary/40 px-2 py-0.5 font-mono text-xs text-primary">
            {p}
          </span>
        ))}
      </div>

      <Callout variant={Variant.Important} title="Interview Tip">
        {interviewTip}
      </Callout>
    </div>
  );
}

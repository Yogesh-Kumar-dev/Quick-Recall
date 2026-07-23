import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import GotchaCallout from '@/components/about/gotcha-callout';
import CodeBlock from '@/components/content/code-block';
import type { Feature } from '@/data/about/about-features';

// ==============================|| ABOUT — FEATURE DEEP DIVE ||============================== //

export default function FeatureDeepDiveView({ feature }: { feature: Feature }) {
  const { icon, title, tech, accent, deepDive } = feature;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <Link
        href="/about"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-primary"
      >
        <IconArrowLeft size={16} />
        Back to About
      </Link>

      <div className="flex flex-col gap-4 border-l-[3px] pl-5" style={{ borderLeftColor: accent }}>
        <div className="flex h-11 w-11 items-center justify-center rounded-md" style={{ color: accent, backgroundColor: `${accent}1f` }}>
          {icon}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold">{title}</h1>
          <p className="mt-2 font-mono text-xs tracking-wide text-muted-foreground">built with: {tech}</p>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{deepDive.tagline}</p>
      </div>

      {deepDive.sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="font-heading text-xl font-bold">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
          {section.code && <CodeBlock code={section.code} language={section.codeLang ?? 'typescript'} />}
        </section>
      ))}

      {deepDive.gotcha && <GotchaCallout>{deepDive.gotcha}</GotchaCallout>}

      <div className="space-y-2">
        <h2 className="font-heading text-xl font-bold">Where it lives in the repo</h2>
        <ul className="list-none space-y-1 pl-0">
          {deepDive.files.map((file) => (
            <li key={file} className="font-mono text-xs text-muted-foreground">
              {file}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

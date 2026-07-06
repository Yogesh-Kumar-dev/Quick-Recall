import { ExternalLink } from 'lucide-react';

// ─── External voice tools for extra practice ────────────────────────────────────

const PRACTICE_TOOLS = [
  {
    label: 'ChatGPT Voice',
    href: 'https://chatgpt.com/features/voice/',
    blurb: 'Hold a spoken mock interview and get instant follow-up questions.'
  },
  {
    label: 'Claude Voice',
    href: 'https://support.claude.com/en/articles/11101966-using-voice-mode-on-claude-mobile-apps',
    blurb: 'Talk through answers out loud in the Claude mobile app.'
  },
  {
    label: 'Gemini Live',
    href: 'https://gemini.google/overview/gemini-live/',
    blurb: 'Real-time back-and-forth voice conversations to rehearse with.'
  },
  {
    label: 'NotebookLM Audio',
    href: 'https://notebooklm.google/audio',
    blurb: 'Turn your notes into an audio overview to review on the go.'
  }
];

// ==============================|| AI VOICE TOOLS ||============================== //

// Full-width row of external AI voice partners, shown below the rehearsal tool
// (YouTube-style — like a "related" strip under the player).

export default function AiVoiceTools() {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Want a back-and-forth? Try an AI voice partner</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        {PRACTICE_TOOLS.map((tool) => (
          <a
            key={tool.label}
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <ExternalLink className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">{tool.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{tool.blurb}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

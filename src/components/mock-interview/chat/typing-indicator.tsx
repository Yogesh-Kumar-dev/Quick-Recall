// Bouncing dots typing indicator for chat bubbles.

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2.5">
      <span className="inline-block size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
      <span className="inline-block size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
      <span className="inline-block size-1.5 animate-bounce rounded-full bg-muted-foreground" />
    </div>
  );
}

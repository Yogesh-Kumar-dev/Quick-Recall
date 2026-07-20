'use client';

import { IconArrowUp, IconMicrophone, IconPlayerStop } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechInput } from './use-speech-input';

// The chat's live input row: a text box, an optional mic toggle that appends speech to the same
// value (so typing and speaking mix freely), and a send button.
export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  mic = false,
  allowEmpty = false,
  autoFocus = true
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  mic?: boolean;
  allowEmpty?: boolean;
  autoFocus?: boolean;
}) {
  const { listening, interim, supported, errorMsg, toggleListening } = useSpeechInput(
    (chunk) => onChange(value ? `${value} ${chunk}` : chunk),
    mic
  );

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed && !allowEmpty) return;
    onSubmit(trimmed);
  };

  return (
    <div>
      <div className="flex items-end gap-2">
        <Textarea
          rows={1}
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="min-h-10 resize-none"
        />
        {mic && supported && (
          <Button type="button" variant={listening ? 'destructive' : 'outline'} size="icon" onClick={toggleListening}>
            {listening ? <IconPlayerStop className="size-4" /> : <IconMicrophone className="size-4" />}
          </Button>
        )}
        <Button type="button" size="icon" onClick={submit} disabled={!value.trim() && !allowEmpty}>
          <IconArrowUp className="size-4" />
        </Button>
      </div>
      {interim && <p className="mt-1 text-xs text-muted-foreground italic">{interim}</p>}
      {errorMsg && <p className="mt-1 text-xs text-destructive">{errorMsg}</p>}
    </div>
  );
}

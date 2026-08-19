'use client';

import { IconChecklist, IconLoader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_TOPIC_PREFERENCES, TOPICS, type Topic } from '@/config/topics';
import type { TopicPreferences } from '@/types/topic-preferences';
import useTopicPreferences from './use-topic-preferences';

// ==============================|| SETTINGS - LEARNING PREFERENCES CARD ||============================== //

// Edits happen on a local draft; the user hits "Save preferences" to persist once. The live
// query then re-renders every gate (sidebar, route guard, indexes) instantly.

export default function TopicPreferencesCard() {
  const { prefs, loading, save } = useTopicPreferences();
  const [draft, setDraft] = useState<TopicPreferences | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (prefs && !draft) setDraft({ ...prefs });
  }, [prefs, draft]);

  const dirty = draft !== null && prefs !== undefined && TOPICS.some((t) => draft[t.id] !== prefs[t.id]);
  const allEnabled = draft === null || Object.values(draft).every(Boolean);

  const toggle = (topic: Topic) => {
    setDraft((d) => (d ? { ...d, [topic]: !d[topic] } : d));
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await save(draft);
      toast.success('Learning preferences saved.');
    } catch {
      toast.error('Could not save your preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconChecklist className="size-5 text-primary" />
          <CardTitle>Learning preferences</CardTitle>
        </div>
        <CardDescription>
          Choose the topics you want to focus on. Modules you switch off stay visible but inactive until you turn them back on here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading || !draft ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconLoader2 size={16} className="animate-spin" />
            Loading topics...
          </div>
        ) : (
          <>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {TOPICS.map((t) => (
                <label key={t.id} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60">
                  <input type="checkbox" checked={draft[t.id]} onChange={() => toggle(t.id)} className="size-4 accent-primary" />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>

            <p className="mt-4 text-sm text-muted-foreground">Don&apos;t try to master everything at once. Focus on one topic at a time.</p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button onClick={handleSave} disabled={saving || !dirty}>
                {saving && <IconLoader2 size={16} className="animate-spin" />}
                Save preferences
              </Button>
              {!allEnabled && (
                <Button variant="ghost" onClick={() => setDraft({ ...DEFAULT_TOPIC_PREFERENCES })}>
                  Enable all topics
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { resolvePrerequisites } from '@/data/note-sources';
import type { Note } from '@/types/content';

const DIFFICULTY_COLOR: Record<Note['difficulty'], 'green' | 'blue' | 'red'> = {
  basic: 'green',
  intermediate: 'blue',
  advanced: 'red'
};

function NoteSection({ note }: Readonly<{ note: Note }>) {
  const prereqs = resolvePrerequisites(note);
  return (
    <ExpandableSection variant="container" headerText={note.title} headerActions={<Badge color={DIFFICULTY_COLOR[note.difficulty]}>{note.difficulty}</Badge>}>
      <SpaceBetween size="xl">
        <Box>{note.summary}</Box>
        {prereqs.length > 0 && (
          <Box fontSize="body-s" color="text-body-secondary">
            Builds on: {prereqs.map((p) => p.title).join(', ')}
          </Box>
        )}
        <ul className="m-0 list-disc space-y-1 pl-5">
          {note.keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {note.gotcha && (
          <Alert type="warning" header="Gotcha">
            {note.gotcha}
          </Alert>
        )}
      </SpaceBetween>
    </ExpandableSection>
  );
}

// Cloudscape-native replacement for the app-wide NotesView (LeafyGreen ExpandableCard/Callout)
// used everywhere else — kept separate so /aws stays entirely Cloudscape, no design-system mixing.
export function AwsRelatedNotes({ notes }: Readonly<{ notes: Note[] }>) {
  if (notes.length === 0) return null;
  return (
    <Container header={<Header variant="h2">Related Notes</Header>}>
      <SpaceBetween size="s">
        {notes.map((note) => (
          <NoteSection key={note.id} note={note} />
        ))}
      </SpaceBetween>
    </Container>
  );
}

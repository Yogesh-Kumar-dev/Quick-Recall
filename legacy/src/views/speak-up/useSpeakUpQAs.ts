import { useCallback } from 'react';

// third party
import { useLiveQuery } from 'dexie-react-hooks';

// project imports
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import * as qaRepository from './qaRepository';

// types
import type { SpeakUpQAInput } from 'types/speak-up';

// ==============================|| SPEAK UP - useSpeakUpQAs HOOK ||============================== //

// Bridges UI ↔ repository. The list is a LIVE query: Dexie re-runs it and the
// component re-renders automatically whenever the speakUpQAs table changes — including
// edits made in another browser tab. So there's no local state to keep in sync and no
// optimistic patching; mutations just write, and the live query reflects them.
// Components never call the repository directly — they go through here.

type SnackColor = 'success' | 'error';

export default function useSpeakUpQAs() {
  const dispatch = useDispatch();

  // `undefined` until the first query resolves → that's our loading signal.
  const qas = useLiveQuery(() => qaRepository.getAll());
  const loading = qas === undefined;

  const notify = useCallback(
    (message: string, color: SnackColor) => {
      dispatch(
        openSnackbar({
          open: true,
          message,
          variant: 'alert',
          alert: { color },
          close: false
        })
      );
    },
    [dispatch]
  );

  const addQA = useCallback(
    async (input: SpeakUpQAInput) => {
      try {
        await qaRepository.create(input);
        notify('Answer saved.', 'success');
      } catch {
        notify('Could not save answer.', 'error');
      }
    },
    [notify]
  );

  const editQA = useCallback(
    async (id: string, input: SpeakUpQAInput) => {
      try {
        await qaRepository.update(id, input);
        notify('Answer updated.', 'success');
      } catch {
        notify('Could not update answer.', 'error');
      }
    },
    [notify]
  );

  const deleteQA = useCallback(
    async (id: string) => {
      try {
        await qaRepository.remove(id);
        notify('Answer deleted.', 'success');
      } catch {
        notify('Could not delete answer.', 'error');
      }
    },
    [notify]
  );

  return { qas: qas ?? [], loading, addQA, editQA, deleteQA };
}

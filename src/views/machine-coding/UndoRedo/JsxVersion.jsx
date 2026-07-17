'use client';
/**
 * UNDO / REDO — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Key concepts: history as { past, present, future }, useReducer, and the
 * rule that every NEW action clears the redo stack.
 *
 * Styling is intentionally minimal — the history model is the interview.
 */
import { useReducer } from 'react';

// The whole pattern in one shape: past ← present → future
const initialState = { past: [], present: 0, future: [] };

function historyReducer(state, action) {
  const { past, present, future } = state;

  switch (action.type) {
    case 'SET':
      // A new action: current value moves into the past, redo stack is CLEARED
      return { past: [...past, present], present: action.value, future: [] };
    case 'UNDO': {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      return { past: past.slice(0, -1), present: previous, future: [present, ...future] };
    }
    case 'REDO': {
      if (future.length === 0) return state;
      const [next, ...rest] = future;
      return { past: [...past, present], present: next, future: rest };
    }
    default:
      return state;
  }
}

export default function UndoRedo() {
  const [state, dispatch] = useReducer(historyReducer, initialState);
  const { past, present, future } = state;

  const set = (value) => dispatch({ type: 'SET', value });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24 }}>
      <span style={{ fontSize: 48, fontWeight: 700 }}>{present}</span>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => set(present - 1)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          −1
        </button>
        <button onClick={() => set(present + 1)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          +1
        </button>
        <button onClick={() => set(present * 2)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          ×2
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => dispatch({ type: 'UNDO' })} disabled={past.length === 0} style={{ padding: '8px 20px', cursor: 'pointer' }}>
          ↩ Undo ({past.length})
        </button>
        <button onClick={() => dispatch({ type: 'REDO' })} disabled={future.length === 0} style={{ padding: '8px 20px', cursor: 'pointer' }}>
          Redo ({future.length}) ↪
        </button>
      </div>

      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
        past: [{past.join(', ')}] · present: {present} · future: [{future.join(', ')}]
      </p>
    </div>
  );
}

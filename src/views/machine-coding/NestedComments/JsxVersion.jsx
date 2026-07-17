'use client';
/**
 * NESTED COMMENTS — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Key concepts: recursive rendering, immutable updates at arbitrary depth
 * (a recursive helper mirrors the recursive UI), local reply-box state.
 *
 * Styling is intentionally minimal — the recursion is the interview.
 */
import { useState } from 'react';

const INITIAL_COMMENTS = [
  {
    id: 1,
    text: 'Great explanation of closures!',
    replies: [
      { id: 2, text: 'Agreed — the loop example finally made it click.', replies: [] },
      { id: 3, text: 'Still confused about the memory part.', replies: [{ id: 4, text: 'Each call keeps its own scope alive.', replies: [] }] }
    ]
  },
  { id: 5, text: 'Can you cover prototypes next?', replies: [] }
];

// Recursive immutable update: find the parent anywhere in the tree, append the reply.
function addReply(comments, parentId, reply) {
  return comments.map((c) => {
    if (c.id === parentId) return { ...c, replies: [...c.replies, reply] };
    return { ...c, replies: addReply(c.replies, parentId, reply) };
  });
}

// One comment + its subtree. The component calling itself IS the pattern.
function Comment({ comment, onReply }) {
  const [showBox, setShowBox] = useState(false);
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    onReply(comment.id, text.trim());
    setText('');
    setShowBox(false);
  };

  return (
    <div style={{ borderLeft: '2px solid #ccc', paddingLeft: 12, marginTop: 10 }}>
      <p style={{ margin: 0 }}>{comment.text}</p>
      <button onClick={() => setShowBox((s) => !s)} style={{ fontSize: 12, cursor: 'pointer', border: 'none', background: 'none', color: '#1976d2', padding: 0 }}>
        {showBox ? 'Cancel' : 'Reply'}
      </button>
      {showBox && (
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply…" style={{ flex: 1, padding: 4 }} />
          <button onClick={submit} style={{ cursor: 'pointer' }}>
            Post
          </button>
        </div>
      )}
      {comment.replies.map((r) => (
        <Comment key={r.id} comment={r} onReply={onReply} />
      ))}
    </div>
  );
}

export default function NestedComments() {
  const [comments, setComments] = useState(INITIAL_COMMENTS);

  const handleReply = (parentId, text) => {
    const reply = { id: Date.now(), text, replies: [] };
    setComments((prev) => addReply(prev, parentId, reply));
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Comments</h3>
      {comments.map((c) => (
        <Comment key={c.id} comment={c} onReply={handleReply} />
      ))}
    </div>
  );
}

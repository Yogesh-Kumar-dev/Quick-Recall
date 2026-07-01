'use client';
/**
 * TODO LIST — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Zero MUI imports — only React hooks + native HTML + inline styles.
 * This is exactly what you'd write in a CodeSandbox/StackBlitz interview env.
 *
 * Same logic as MuiVersion — compare side by side to see how MUI wraps these
 * native elements under the hood.
 */
import { useState, useMemo } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Filter = 'all' | 'active' | 'completed';
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// ── Inline style constants (keeps JSX clean) ───────────────────────────────────
const styles = {
  wrapper: {
    maxWidth: 480,
    fontFamily: 'inherit',
    padding: 16,
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    background: '#fff'
  } as React.CSSProperties,
  row: { display: 'flex', gap: 8, marginBottom: 12 } as React.CSSProperties,
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: 14,
    outline: 'none'
  } as React.CSSProperties,
  addBtn: {
    padding: '8px 16px',
    background: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14,
    whiteSpace: 'nowrap'
  } as React.CSSProperties,
  filterBtn: (active: boolean): React.CSSProperties => ({
    padding: '4px 12px',
    borderRadius: 16,
    border: `1px solid ${active ? '#1976d2' : '#ccc'}`,
    background: active ? '#1976d2' : 'transparent',
    color: active ? '#fff' : '#666',
    cursor: 'pointer',
    fontSize: 13
  }),
  hr: { border: 'none', borderTop: '1px solid #eee', margin: '8px 0' } as React.CSSProperties,
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 0',
    borderBottom: '1px solid #f5f5f5'
  } as React.CSSProperties,
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#f44336',
    fontSize: 18,
    lineHeight: 1,
    padding: '0 4px',
    marginLeft: 'auto'
  } as React.CSSProperties,
  footer: { fontSize: 12, color: '#999', margin: '8px 0 0' } as React.CSSProperties
};

// ──────────────────────────────────────────────────────────────────────────────
export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Read a React book', completed: true },
    { id: 3, text: 'Build a machine coding project', completed: false }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all');

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const addTodo = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: trimmed, completed: false }]);
    setInputText('');
  };

  const toggleTodo = (id: number) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTodo = (id: number) => setTodos((prev) => prev.filter((t) => t.id !== id));

  // ── Derived state ─────────────────────────────────────────────────────────────
  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed);
    if (filter === 'completed') return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const remaining = todos.filter((t) => !t.completed).length;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={styles.wrapper}>
      {/* Input row */}
      <div style={styles.row}>
        <input
          style={styles.input}
          placeholder="What needs to be done?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button style={styles.addBtn} onClick={addTodo}>
          Add
        </button>
      </div>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {(['all', 'active', 'completed'] as Filter[]).map((f) => (
          <button key={f} style={styles.filterBtn(filter === f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <hr style={styles.hr} />

      {/* Todo list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filteredTodos.length === 0 && (
          <li style={{ color: '#999', fontSize: 14, padding: '12px 0', textAlign: 'center' }}>No items to show.</li>
        )}
        {filteredTodos.map((todo) => (
          <li key={todo.id} style={styles.listItem}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ cursor: 'pointer', flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: 14,
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#aaa' : 'inherit'
              }}
            >
              {todo.text}
            </span>
            <button style={styles.deleteBtn} onClick={() => deleteTodo(todo.id)} title="Delete">
              ✕
            </button>
          </li>
        ))}
      </ul>

      <hr style={styles.hr} />
      <p style={styles.footer}>
        {remaining} item{remaining !== 1 ? 's' : ''} left
      </p>
    </div>
  );
}

'use client';
/**
 * TODO LIST — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Pattern: Controlled input + derived state via useMemo
 *
 * Key decisions to explain in interviews:
 * 1. State shape: keep todos[] flat; never store "filteredTodos" in state
 * 2. useMemo for the derived filtered list — recomputes only when todos/filter change
 * 3. Unique IDs via Date.now() (simple) or crypto.randomUUID() (production)
 * 4. Immutable updates: spread operator / filter / map — never mutate state directly
 */
import { useState, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { IconTrash } from '@tabler/icons-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Filter = 'all' | 'active' | 'completed';
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
export default function TodoMui() {
  // STATE: The single source of truth — all todos
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Read a React book', completed: true },
    { id: 3, text: 'Build a machine coding project', completed: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  // ── Handlers ─────────────────────────────────────────────────────────────────

  // Add a new todo — guard against empty input
  const addTodo = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: trimmed, completed: false }]);
    setInputText(''); // reset input after adding
  };

  // Toggle a todo's completed status — immutable update with map
  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Remove a todo — filter out by id
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Derived state (useMemo) ───────────────────────────────────────────────────
  // Recalculates ONLY when todos or filter changes — not on every render
  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed);
    if (filter === 'completed') return todos.filter((t) => t.completed);
    return todos; // 'all'
  }, [todos, filter]);

  // Count remaining (active) items for the footer
  const remaining = todos.filter((t) => !t.completed).length;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Paper sx={{ p: 2.5, maxWidth: 520, borderRadius: 2 }} elevation={2}>
      {/* Input row */}
      <Stack direction="row" spacing={1} mb={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          // Allow adding with Enter key — common UX expectation
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <Button variant="contained" onClick={addTodo} sx={{ whiteSpace: 'nowrap' }}>
          Add
        </Button>
      </Stack>

      {/* Filter chips */}
      <Stack direction="row" spacing={1} mb={2}>
        {(['all', 'active', 'completed'] as Filter[]).map((f) => (
          <Chip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            onClick={() => setFilter(f)}
            color={filter === f ? 'primary' : 'default'}
            variant={filter === f ? 'filled' : 'outlined'}
            size="small"
            clickable
          />
        ))}
      </Stack>

      <Divider sx={{ mb: 1 }} />

      {/* Todo list */}
      <List dense disablePadding>
        {filteredTodos.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No items to show.
          </Typography>
        )}
        {filteredTodos.map((todo) => (
          <ListItem
            key={todo.id}
            disableGutters
            sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            secondaryAction={
              <IconButton size="small" onClick={() => deleteTodo(todo.id)} color="error" aria-label="delete">
                <IconTrash size={16} />
              </IconButton>
            }
          >
            <Checkbox size="small" checked={todo.completed} onChange={() => toggleTodo(todo.id)} sx={{ py: 0.5 }} />
            <ListItemText
              primary={todo.text}
              primaryTypographyProps={{
                variant: 'body2',
                sx: {
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.disabled' : 'text.primary'
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 1, mb: 1.5 }} />

      {/* Footer: remaining count */}
      <Typography variant="caption" color="text.secondary">
        {remaining} item{remaining !== 1 ? 's' : ''} left
      </Typography>
    </Paper>
  );
}

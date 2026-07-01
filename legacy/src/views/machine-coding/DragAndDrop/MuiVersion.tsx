'use client';
/**
 * DRAG & DROP KANBAN — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * HTML5 Drag and Drop API — no external library.
 *
 * Event sequence:
 *   dragstart  → fired on the CARD being dragged
 *   dragover   → fired on the DROP TARGET (column) — must preventDefault to allow drop
 *   dragleave  → fired when drag leaves the drop target
 *   drop       → fired when card is dropped on target column
 *   dragend    → fired on the card after drop (cleanup)
 *
 * Key trick: store drag data in a useRef (not state) to avoid unnecessary re-renders
 * during drag. Only call setColumns on drop.
 */
import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

// ── Types ─────────────────────────────────────────────────────────────────────
type ColumnId = 'todo' | 'inProgress' | 'done';
interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
}
type Columns = Record<ColumnId, Task[]>;

// ── Initial data ───────────────────────────────────────────────────────────────
const INITIAL_COLUMNS: Columns = {
  todo: [
    { id: 't1', title: 'Design the landing page', priority: 'high' },
    { id: 't2', title: 'Write unit tests', priority: 'medium' },
    { id: 't3', title: 'Update dependencies', priority: 'low' }
  ],
  inProgress: [
    { id: 't4', title: 'Build auth flow', priority: 'high' },
    { id: 't5', title: 'Fix pagination bug', priority: 'medium' }
  ],
  done: [
    { id: 't6', title: 'Set up CI/CD', priority: 'low' },
    { id: 't7', title: 'Code review PR #42', priority: 'medium' }
  ]
};

const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: '📋 Todo',
  inProgress: '⚙️ In Progress',
  done: '✅ Done'
};

const PRIORITY_COLOR = {
  high: '#ef5350',
  medium: '#fb8c00',
  low: '#66bb6a'
};

// ──────────────────────────────────────────────────────────────────────────────
export default function DragAndDropMui() {
  const [columns, setColumns] = useState<Columns>(INITIAL_COLUMNS);
  // Track which column is being hovered — for visual feedback
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);

  // Store drag source in a ref — no re-render needed during drag
  const dragData = useRef<{ taskId: string; fromColumn: ColumnId } | null>(null);

  // ── Drag handlers ─────────────────────────────────────────────────────────────

  const handleDragStart = (taskId: string, fromColumn: ColumnId) => {
    // Save what we're dragging (ref = no re-render)
    dragData.current = { taskId, fromColumn };
  };

  const handleDragOver = (e: React.DragEvent, columnId: ColumnId) => {
    // REQUIRED: without preventDefault, onDrop will never fire
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (toColumn: ColumnId) => {
    const drag = dragData.current;
    if (!drag) return;
    if (drag.fromColumn === toColumn) {
      // Same column: no-op
      setDragOverColumn(null);
      return;
    }

    // Immutable state update: move task from source to target
    setColumns((prev) => {
      const task = prev[drag.fromColumn].find((t) => t.id === drag.taskId);
      if (!task) return prev;
      return {
        ...prev,
        [drag.fromColumn]: prev[drag.fromColumn].filter((t) => t.id !== drag.taskId),
        [toColumn]: [...prev[toColumn], task]
      };
    });

    dragData.current = null;
    setDragOverColumn(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Box display="flex" gap={2} sx={{ overflowX: 'auto', pb: 1 }}>
      {(Object.keys(INITIAL_COLUMNS) as ColumnId[]).map((colId) => {
        const isOver = dragOverColumn === colId;
        return (
          <Paper
            key={colId}
            elevation={isOver ? 4 : 1}
            sx={{
              flex: '1 1 220px',
              minWidth: 200,
              p: 1.5,
              borderRadius: 2,
              border: isOver ? '2px dashed' : '2px solid transparent',
              borderColor: isOver ? 'primary.main' : 'transparent',
              bgcolor: isOver ? 'primary.50' : 'grey.50',
              transition: 'all 0.15s ease'
            }}
            onDragOver={(e) => handleDragOver(e, colId)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(colId)}
          >
            {/* Column header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Typography variant="subtitle2" fontWeight={700}>
                {COLUMN_LABELS[colId]}
              </Typography>
              <Chip label={columns[colId].length} size="small" variant="filled" color="default" />
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            {/* Task cards */}
            <Stack spacing={1} minHeight={80}>
              {columns[colId].length === 0 && (
                <Box
                  sx={{
                    py: 3,
                    textAlign: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    color: 'text.disabled',
                    fontSize: 13
                  }}
                >
                  Drop here
                </Box>
              )}
              {columns[colId].map((task) => (
                <Paper
                  key={task.id}
                  draggable // ← makes element draggable
                  onDragStart={() => handleDragStart(task.id, colId)}
                  elevation={1}
                  sx={{
                    p: 1.5,
                    cursor: 'grab',
                    borderRadius: 1.5,
                    userSelect: 'none',
                    '&:active': { cursor: 'grabbing' },
                    '&:hover': { bgcolor: 'background.paper', boxShadow: 3 },
                    transition: 'box-shadow 0.15s'
                  }}
                >
                  <Typography variant="body2" mb={0.5}>
                    {task.title}
                  </Typography>
                  <Chip
                    label={task.priority}
                    size="small"
                    sx={{
                      bgcolor: PRIORITY_COLOR[task.priority],
                      color: '#fff',
                      height: 18,
                      fontSize: 11
                    }}
                  />
                </Paper>
              ))}
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
}

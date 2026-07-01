'use client';
/**
 * DRAG & DROP KANBAN — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 */
import { useState, useRef } from 'react';

const INITIAL_COLUMNS = {
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

const COLUMN_LABELS = {
  todo: '📋 Todo',
  inProgress: '⚙️ In Progress',
  done: '✅ Done'
};

const PRIORITY_COLOR = {
  high: '#ef5350',
  medium: '#fb8c00',
  low: '#66bb6a'
};

export default function DragAndDrop() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const dragData = useRef(null);

  const handleDragStart = (taskId, fromColumn) => {
    dragData.current = { taskId, fromColumn };
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => setDragOverColumn(null);

  const handleDrop = (toColumn) => {
    const drag = dragData.current;
    if (!drag || drag.fromColumn === toColumn) {
      setDragOverColumn(null);
      return;
    }
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

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
      {Object.keys(INITIAL_COLUMNS).map((colId) => {
        const isOver = dragOverColumn === colId;
        return (
          <div
            key={colId}
            style={{
              flex: '1 1 200px',
              minWidth: 190,
              padding: 12,
              borderRadius: 10,
              border: isOver ? '2px dashed #1976d2' : '2px solid #e0e0e0',
              background: isOver ? '#e3f2fd' : '#fafafa',
              transition: 'all 0.15s ease'
            }}
            onDragOver={(e) => handleDragOver(e, colId)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(colId)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ fontSize: 14 }}>{COLUMN_LABELS[colId]}</strong>
              <span style={{ background: '#e0e0e0', borderRadius: 10, padding: '1px 8px', fontSize: 12, color: '#555' }}>
                {columns[colId].length}
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '0 0 10px' }} />

            <div style={{ minHeight: 60 }}>
              {columns[colId].length === 0 && (
                <div
                  style={{
                    padding: '20px 0',
                    textAlign: 'center',
                    border: '1px dashed #ccc',
                    borderRadius: 6,
                    fontSize: 13,
                    color: '#bbb'
                  }}
                >
                  Drop here
                </div>
              )}
              {columns[colId].map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id, colId)}
                  style={{
                    padding: '10px 12px',
                    marginBottom: 8,
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    cursor: 'grab',
                    userSelect: 'none',
                    fontSize: 14
                  }}
                >
                  <div style={{ marginBottom: 6 }}>{task.title}</div>
                  <span
                    style={{ background: PRIORITY_COLOR[task.priority], color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';
/**
 * SORTABLE TABLE — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Static employee data rendered in a table. A row of chips (one per sortable
 * field) lets the user sort by that field; clicking the active chip again flips
 * the direction asc ↔ desc.
 *
 * State is just the sort descriptor: { key, dir }.
 * The sorted rows are DERIVED from (data, sort) — never stored separately.
 * We sort a COPY ([...employees]) because Array.sort mutates in place.
 */
import { useState, useMemo } from 'react';

const EMPLOYEES = [
  { id: 1, name: 'Aarav Sharma', age: 29, department: 'Engineering', salary: 92000 },
  { id: 2, name: 'Diya Patel', age: 34, department: 'Design', salary: 78000 },
  { id: 3, name: 'Vihaan Reddy', age: 41, department: 'Engineering', salary: 120000 },
  { id: 4, name: 'Ananya Iyer', age: 26, department: 'Marketing', salary: 64000 },
  { id: 5, name: 'Kabir Nair', age: 38, department: 'Sales', salary: 85000 },
  { id: 6, name: 'Ishika Gupta', age: 31, department: 'Design', salary: 73000 },
  { id: 7, name: 'Rohan Mehta', age: 45, department: 'Engineering', salary: 134000 },
  { id: 8, name: 'Saanvi Joshi', age: 28, department: 'Marketing', salary: 69000 },
  { id: 9, name: 'Arjun Verma', age: 36, department: 'Sales', salary: 88000 },
  { id: 10, name: 'Myra Bose', age: 33, department: 'Engineering', salary: 98000 }
];

// Fields exposed as sortable chips.
const SORT_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'salary', label: 'Salary' }
];

const cell = { padding: '8px 12px', borderBottom: '1px solid #eef0f3', textAlign: 'left' };

export default function SortableTable() {
  const [sort, setSort] = useState({ key: null, dir: 'asc' });

  function handleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }

  const sorted = useMemo(() => {
    if (!sort.key) return EMPLOYEES;
    const factor = sort.dir === 'asc' ? 1 : -1;
    // copy first — sort() mutates, and mutating the source breaks "no sort" state
    return [...EMPLOYEES].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
      return String(av).localeCompare(String(bv)) * factor;
    });
  }, [sort]);

  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Sort by:</span>
        {SORT_FIELDS.map((f) => {
          const active = sort.key === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => handleSort(f.key)}
              style={{
                padding: '4px 12px',
                borderRadius: 999,
                border: '1px solid',
                borderColor: active ? '#2563eb' : '#d1d5db',
                background: active ? '#2563eb' : '#fff',
                color: active ? '#fff' : '#374151',
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              {f.label}
              {active ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
            </button>
          );
        })}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ ...cell, color: '#6b7280', fontWeight: 600 }}>Name</th>
            <th style={{ ...cell, color: '#6b7280', fontWeight: 600 }}>Age</th>
            <th style={{ ...cell, color: '#6b7280', fontWeight: 600 }}>Department</th>
            <th style={{ ...cell, color: '#6b7280', fontWeight: 600, textAlign: 'right' }}>Salary</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e) => (
            <tr key={e.id}>
              <td style={{ ...cell, fontWeight: 600 }}>{e.name}</td>
              <td style={cell}>{e.age}</td>
              <td style={cell}>{e.department}</td>
              <td style={{ ...cell, textAlign: 'right' }}>${e.salary.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

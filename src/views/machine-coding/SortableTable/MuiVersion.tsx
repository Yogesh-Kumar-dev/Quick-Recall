'use client';
/**
 * SORTABLE TABLE — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same sort logic as the TSX version. MUI Chip drives the sort field selection
 * (filled = active), and Table/TableRow/TableCell replace the raw table markup.
 */
import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

interface Employee {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
}

const EMPLOYEES: Employee[] = [
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

type SortKey = 'name' | 'age' | 'salary';
type SortDir = 'asc' | 'desc';

const SORT_FIELDS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'salary', label: 'Salary' }
];

export default function SortableTable() {
  const [sort, setSort] = useState<{ key: SortKey | null; dir: SortDir }>({ key: null, dir: 'asc' });

  function handleSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }

  const sorted = useMemo<Employee[]>(() => {
    if (!sort.key) return EMPLOYEES;
    const key = sort.key;
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...EMPLOYEES].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
      return String(av).localeCompare(String(bv)) * factor;
    });
  }, [sort]);

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2">Sort by:</Typography>
        {SORT_FIELDS.map((f) => (
          <Chip
            key={f.key}
            label={`${f.label}${sort.key === f.key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ''}`}
            onClick={() => handleSort(f.key)}
            color={sort.key === f.key ? 'primary' : 'default'}
            variant={sort.key === f.key ? 'filled' : 'outlined'}
            size="small"
          />
        ))}
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Department</TableCell>
            <TableCell align="right">Salary</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((e) => (
            <TableRow key={e.id} hover>
              <TableCell sx={{ fontWeight: 600 }}>{e.name}</TableCell>
              <TableCell>{e.age}</TableCell>
              <TableCell>{e.department}</TableCell>
              <TableCell align="right">${e.salary.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

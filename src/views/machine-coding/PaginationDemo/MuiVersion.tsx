'use client';
/**
 * PAGINATION — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Core formulas (memorize these):
 *   totalPages  = Math.ceil(data.length / itemsPerPage)
 *   startIndex  = (currentPage - 1) * itemsPerPage
 *   endIndex    = startIndex + itemsPerPage
 *   currentItems = data.slice(startIndex, endIndex)
 *
 * State: only currentPage + itemsPerPage
 * currentItems is DERIVED (computed in render, not stored in state)
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';

// ── Mock dataset ───────────────────────────────────────────────────────────────
interface User {
  id: number;
  name: string;
  role: string;
  status: string;
}
const USERS: User[] = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  name: `User ${String(i + 1).padStart(3, '0')}`,
  role: ['Frontend Dev', 'Backend Dev', 'Designer', 'DevOps', 'PM'][i % 5],
  status: i % 3 === 0 ? 'Inactive' : 'Active'
}));

// ──────────────────────────────────────────────────────────────────────────────
export default function PaginationMui() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // ── Derived values (NO state for these) ──────────────────────────────────────
  const totalPages = Math.ceil(USERS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage; // 0-based
  const endIndex = startIndex + itemsPerPage;
  const currentItems = USERS.slice(startIndex, endIndex);

  // Page number buttons — show at most 5 pages around current
  const getPageNumbers = (): number[] => {
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      range.push(i);
    }
    return range;
  };

  const handlePerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // reset to page 1 whenever per-page changes
  };

  return (
    <Box>
      {/* Controls row */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {startIndex + 1}–{Math.min(endIndex, USERS.length)} of {USERS.length} users
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Per page</InputLabel>
          <Select label="Per page" value={itemsPerPage} onChange={(e) => handlePerPageChange(Number(e.target.value))}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Data table */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, borderRadius: 1.5 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip label={user.status} size="small" color={user.status === 'Active' ? 'success' : 'default'} variant="outlined" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination controls */}
      <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
        {/* Previous */}
        <Button size="small" variant="outlined" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
          ← Prev
        </Button>

        {/* Page numbers */}
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            size="small"
            variant={page === currentPage ? 'contained' : 'outlined'}
            onClick={() => setCurrentPage(page)}
            sx={{ minWidth: 36, px: 0 }}
          >
            {page}
          </Button>
        ))}

        {/* Next */}
        <Button size="small" variant="outlined" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
          Next →
        </Button>
      </Stack>
    </Box>
  );
}

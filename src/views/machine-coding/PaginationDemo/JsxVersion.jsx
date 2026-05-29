'use client';
/**
 * PAGINATION — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 */
import { useState } from 'react';

const USERS = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  name: `User ${String(i + 1).padStart(3, '0')}`,
  role: ['Frontend Dev', 'Backend Dev', 'Designer', 'DevOps', 'PM'][i % 5],
  status: i % 3 === 0 ? 'Inactive' : 'Active'
}));

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(USERS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = USERS.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      range.push(i);
    }
    return range;
  };

  const handlePerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const btnBase = {
    padding: '5px 10px',
    border: '1px solid #ccc',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    background: 'transparent',
    minWidth: 36
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#666' }}>
          Showing {startIndex + 1}–{Math.min(endIndex, USERS.length)} of {USERS.length} users
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => handlePerPageChange(Number(e.target.value))}
          style={{ padding: '5px 8px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13 }}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginBottom: 12 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>ID</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Name</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Role</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px 12px' }}>{user.id}</td>
              <td style={{ padding: '8px 12px' }}>{user.name}</td>
              <td style={{ padding: '8px 12px' }}>{user.role}</td>
              <td style={{ padding: '8px 12px' }}>
                <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 12, border: `1px solid ${user.status === 'Active' ? '#4caf50' : '#bbb'}`, color: user.status === 'Active' ? '#2e7d32' : '#757575' }}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={{ ...btnBase, opacity: currentPage === 1 ? 0.4 : 1 }} disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
          ← Prev
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            style={{ ...btnBase, background: page === currentPage ? '#1976d2' : 'transparent', color: page === currentPage ? '#fff' : 'inherit', borderColor: page === currentPage ? '#1976d2' : '#ccc' }}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button style={{ ...btnBase, opacity: currentPage === totalPages ? 0.4 : 1 }} disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}

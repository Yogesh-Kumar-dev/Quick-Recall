'use client';
/**
 * TIC-TAC-TOE — TYPESCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Key concepts: minimal state (one array + whose turn), everything else
 * derived; immutable updates; winner detection over line indices.
 */
import { useState } from 'react';

type Cell = 'X' | 'O' | null;

// All 8 winning lines by cell index (rows, columns, diagonals)
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function getWinner(board: Cell[]): Cell {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default function TicTacToe() {
  // The ONLY state: 9 cells + whose turn. Winner/draw/status are all derived.
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = getWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const status = winner ? `Winner: ${winner}` : isDraw ? 'Draw!' : `Turn: ${xIsNext ? 'X' : 'O'}`;

  const play = (i: number) => {
    if (board[i] || winner) return; // occupied or game over — ignore
    const next = [...board]; // copy, never mutate state
    next[i] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);
  };

  const restart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24 }}>
      <p style={{ fontWeight: 600 }}>{status}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 64px)', gap: 4 }}>
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            style={{ height: 64, fontSize: 28, fontWeight: 700, cursor: cell || winner ? 'default' : 'pointer' }}
          >
            {cell}
          </button>
        ))}
      </div>
      <button onClick={restart} style={{ padding: '8px 20px', cursor: 'pointer' }}>
        Restart
      </button>
    </div>
  );
}

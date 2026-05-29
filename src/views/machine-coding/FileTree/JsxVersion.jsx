'use client';
/**
 * FILE TREE EXPLORER — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 */
import { useReducer } from 'react';

// ── Recursive helpers (pure functions) ────────────────────────────────────────
function toggleNode(nodes, id) {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, expanded: !n.expanded };
    if (n.children) return { ...n, children: toggleNode(n.children, id) };
    return n;
  });
}

function addNode(nodes, parentId, newNode) {
  return nodes.map((n) => {
    if (n.id === parentId) return { ...n, expanded: true, children: [...(n.children ?? []), newNode] };
    if (n.children) return { ...n, children: addNode(n.children, parentId, newNode) };
    return n;
  });
}

function deleteNode(nodes, id) {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => {
      if (n.children) return { ...n, children: deleteNode(n.children, id) };
      return n;
    });
}

function treeReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': return toggleNode(state, action.id);
    case 'ADD': return addNode(state, action.parentId, action.node);
    case 'DELETE': return deleteNode(state, action.id);
    default: return state;
  }
}

const INITIAL_TREE = [
  {
    id: 'src', name: 'src', type: 'folder', expanded: true,
    children: [
      {
        id: 'components', name: 'components', type: 'folder', expanded: true,
        children: [
          { id: 'btn', name: 'Button.tsx', type: 'file' },
          { id: 'input', name: 'Input.tsx', type: 'file' }
        ]
      },
      {
        id: 'pages', name: 'pages', type: 'folder', expanded: false,
        children: [
          { id: 'home', name: 'Home.tsx', type: 'file' },
          { id: 'about', name: 'About.tsx', type: 'file' }
        ]
      },
      { id: 'app', name: 'App.tsx', type: 'file' },
      { id: 'idx', name: 'index.ts', type: 'file' }
    ]
  },
  { id: 'pkg', name: 'package.json', type: 'file' },
  { id: 'ts', name: 'tsconfig.json', type: 'file' }
];

// ── Recursive component ────────────────────────────────────────────────────────
function Node({ node, depth, dispatch }) {
  const isFolder = node.type === 'folder';

  const handleAdd = (nodeType) => {
    const name = prompt(`New ${nodeType} name:`);
    if (!name?.trim()) return;
    dispatch({
      type: 'ADD',
      parentId: node.id,
      node: { id: `${Date.now()}`, name: name.trim(), type: nodeType, ...(nodeType === 'folder' ? { children: [], expanded: true } : {}) }
    });
  };

  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', paddingLeft: depth * 20, padding: `3px 4px 3px ${depth * 20}px`, borderRadius: 4, cursor: isFolder ? 'pointer' : 'default', fontSize: 14, fontFamily: 'monospace' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        onClick={() => isFolder && dispatch({ type: 'TOGGLE', id: node.id })}
      >
        <span style={{ marginRight: 6 }}>{isFolder ? (node.expanded ? '📂' : '📁') : '📄'}</span>
        <span style={{ flex: 1, userSelect: 'none' }}>{node.name}</span>

        <span onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 2 }}>
          {isFolder && (
            <>
              <button title="Add file" onClick={() => handleAdd('file')} style={actBtnStyle}>+📄</button>
              <button title="Add folder" onClick={() => handleAdd('folder')} style={actBtnStyle}>+📁</button>
            </>
          )}
          <button title="Delete" onClick={() => dispatch({ type: 'DELETE', id: node.id })} style={{ ...actBtnStyle, color: '#f44336' }}>✕</button>
        </span>
      </div>

      {isFolder && node.expanded && node.children?.map((child) => (
        <Node key={child.id} node={child} depth={depth + 1} dispatch={dispatch} />
      ))}
    </div>
  );
}

const actBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 12,
  padding: '0 3px',
  borderRadius: 3
};

// ──────────────────────────────────────────────────────────────────────────────
export default function FileTree() {
  const [tree, dispatch] = useReducer(treeReducer, INITIAL_TREE);

  return (
    <div style={{ maxWidth: 400, border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, fontFamily: 'monospace', background: '#fafafa' }}>
      <p style={{ fontSize: 13, color: '#888', margin: '0 0 8px' }}>📁 my-project — hover a row to see actions</p>
      <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '0 0 8px' }} />
      {tree.map((node) => (
        <Node key={node.id} node={node} depth={0} dispatch={dispatch} />
      ))}
    </div>
  );
}

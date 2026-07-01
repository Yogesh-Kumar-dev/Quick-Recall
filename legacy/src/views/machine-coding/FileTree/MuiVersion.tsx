'use client';
/**
 * FILE TREE EXPLORER — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Architecture:
 *   - TreeNode type: { id, name, type, expanded?, children? }
 *   - useReducer manages tree state with 3 actions: TOGGLE, ADD, DELETE
 *   - 3 pure helper functions recursively traverse the tree array
 *   - <TreeNodeComponent> is RECURSIVE — it renders its own children
 *
 * Recursive state update pattern (the key thing to explain in interviews):
 *
 *   function toggleNode(nodes, id) {
 *     return nodes.map(node => {
 *       if (node.id === id) return { ...node, expanded: !node.expanded }
 *       if (node.children) return { ...node, children: toggleNode(node.children, id) }
 *       return node
 *     })
 *   }
 *
 * This pattern (map + recurse into children) is the same for ADD and DELETE.
 */
import { useReducer } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { IconFilePlus, IconFolderPlus, IconTrash } from '@tabler/icons-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: TreeNode[];
}

type Action = { type: 'TOGGLE'; id: string } | { type: 'ADD'; parentId: string; node: TreeNode } | { type: 'DELETE'; id: string };

// ── Recursive helper functions ─────────────────────────────────────────────────
// These are pure functions — they don't mutate, they return new tree arrays.

function toggleNode(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === id) return { ...node, expanded: !node.expanded };
    // Recurse into children if this isn't the target
    if (node.children) return { ...node, children: toggleNode(node.children, id) };
    return node;
  });
}

function addNode(nodes: TreeNode[], parentId: string, newNode: TreeNode): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      // Found the parent — append to its children
      return { ...node, expanded: true, children: [...(node.children ?? []), newNode] };
    }
    if (node.children) return { ...node, children: addNode(node.children, parentId, newNode) };
    return node;
  });
}

function deleteNode(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes
    .filter((node) => node.id !== id) // remove this node if it matches
    .map((node) => {
      // For nodes that remain, recurse into children
      if (node.children) return { ...node, children: deleteNode(node.children, id) };
      return node;
    });
}

// ── Reducer ───────────────────────────────────────────────────────────────────
function treeReducer(state: TreeNode[], action: Action): TreeNode[] {
  switch (action.type) {
    case 'TOGGLE':
      return toggleNode(state, action.id);
    case 'ADD':
      return addNode(state, action.parentId, action.node);
    case 'DELETE':
      return deleteNode(state, action.id);
    default:
      return state;
  }
}

// ── Initial tree data ──────────────────────────────────────────────────────────
const INITIAL_TREE: TreeNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        expanded: true,
        children: [
          { id: 'btn', name: 'Button.tsx', type: 'file' },
          { id: 'input', name: 'Input.tsx', type: 'file' }
        ]
      },
      {
        id: 'pages',
        name: 'pages',
        type: 'folder',
        expanded: false,
        children: [
          { id: 'home', name: 'Home.tsx', type: 'file' },
          { id: 'about', name: 'About.tsx', type: 'file' }
        ]
      },
      { id: 'app', name: 'App.tsx', type: 'file' },
      { id: 'index', name: 'index.ts', type: 'file' }
    ]
  },
  { id: 'pkg', name: 'package.json', type: 'file' },
  { id: 'tsconfig', name: 'tsconfig.json', type: 'file' }
];

// ── Recursive TreeNode component ───────────────────────────────────────────────
function TreeNodeComponent({ node, depth, dispatch }: { node: TreeNode; depth: number; dispatch: React.Dispatch<Action> }) {
  const isFolder = node.type === 'folder';

  const handleAdd = (nodeType: 'file' | 'folder') => {
    const name = prompt(`New ${nodeType} name:`);
    if (!name?.trim()) return;
    dispatch({
      type: 'ADD',
      parentId: node.id,
      node: {
        id: `${Date.now()}`,
        name: name.trim(),
        type: nodeType,
        ...(nodeType === 'folder' ? { children: [], expanded: true } : {})
      }
    });
  };

  return (
    <Box>
      {/* Node row */}
      <Box
        display="flex"
        alignItems="center"
        sx={{
          pl: depth * 2.5,
          py: 0.25,
          borderRadius: 1,
          cursor: isFolder ? 'pointer' : 'default',
          '&:hover': { bgcolor: 'action.hover' },
          '&:hover .node-actions': { opacity: 1 }
        }}
        onClick={() => isFolder && dispatch({ type: 'TOGGLE', id: node.id })}
      >
        {/* Icon */}
        <Typography component="span" sx={{ mr: 0.75, fontSize: 16, userSelect: 'none' }}>
          {isFolder ? (node.expanded ? '📂' : '📁') : '📄'}
        </Typography>

        {/* Name */}
        <Typography variant="body2" sx={{ flex: 1, userSelect: 'none' }}>
          {node.name}
        </Typography>

        {/* Action buttons — visible on hover */}
        <Stack
          className="node-actions"
          direction="row"
          spacing={0}
          sx={{ opacity: 0, transition: 'opacity 0.15s' }}
          onClick={(e) => e.stopPropagation()} // don't toggle folder when clicking actions
        >
          {isFolder && (
            <>
              <Tooltip title="Add file">
                <IconButton size="small" onClick={() => handleAdd('file')}>
                  <IconFilePlus size={14} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add folder">
                <IconButton size="small" onClick={() => handleAdd('folder')}>
                  <IconFolderPlus size={14} />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => dispatch({ type: 'DELETE', id: node.id })}>
              <IconTrash size={14} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Recursive children — only shown if folder is expanded */}
      {isFolder &&
        node.expanded &&
        node.children?.map((child) => <TreeNodeComponent key={child.id} node={child} depth={depth + 1} dispatch={dispatch} />)}
    </Box>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
export default function FileTreeMui() {
  const [tree, dispatch] = useReducer(treeReducer, INITIAL_TREE);

  return (
    <Paper sx={{ p: 2, maxWidth: 420, borderRadius: 2, fontFamily: 'monospace' }} elevation={2}>
      <Typography variant="subtitle2" color="text.secondary" mb={1} sx={{ fontFamily: 'inherit' }}>
        📁 my-project{' '}
        <Typography component="span" variant="caption">
          (hover a node to see actions)
        </Typography>
      </Typography>
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1 }}>
        {tree.map((node) => (
          <TreeNodeComponent key={node.id} node={node} depth={0} dispatch={dispatch} />
        ))}
      </Box>
    </Paper>
  );
}

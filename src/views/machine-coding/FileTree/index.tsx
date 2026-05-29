// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/FileTree');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🔴 File Tree Explorer',
  description:
    "Build a collapsible file tree (like VS Code's sidebar). Folders expand/collapse on click. Users can add files or folders inside any folder, and delete any node.",
  requirements: [
    'Render a nested tree of folders and files',
    'Click a folder to toggle expand/collapse',
    'Add a file or folder inside any folder (prompt for name)',
    'Delete any file or folder (deleting a folder removes its children too)',
    'Show appropriate icons: 📁 (closed folder), 📂 (open folder), 📄 (file)',
    'Indent child nodes by depth level'
  ],
  keyPatterns: [
    'Recursive component (TreeNode renders itself)',
    'useReducer for tree state',
    'Recursive immutable tree update',
    'map() to update a node by ID',
    'filter() to delete a node by ID'
  ],
  interviewTip:
    'The key insight: tree state updates are recursive. Write helper functions — toggleNode(tree, id), addNode(tree, parentId, newNode), deleteNode(tree, id) — each using map/filter recursively. Using useReducer keeps the component clean: dispatch({ type: "TOGGLE", id }) instead of inline logic.'
};

export default function FileTreeApp() {
  return (
    <ProblemLayout
      problem={PROBLEM}
      versions={{
        jsx: { component: <JsxVersion />, code: jsxCode },
        tsx: { component: <TsxVersion />, code: tsxCode },
        mui: { component: <MuiVersion />, code: muiCode }
      }}
    />
  );
}

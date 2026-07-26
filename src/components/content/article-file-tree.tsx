import { File, Folder } from 'lucide-react';
import type { FileTreeNode } from '@/types/content';

// VS Code Explorer–style tree: folder/file icons + nested indent guide lines (no expand/collapse —
// the tree is always shown in full, since articles are static walkthroughs, not live filesystems).
function FileTreeRow({ node }: { node: FileTreeNode }) {
  const Icon = node.type === 'folder' ? Folder : File;
  return (
    <div>
      <div className="flex items-center gap-1.5 py-0.5 whitespace-nowrap">
        <Icon className={`size-3.5 shrink-0 ${node.type === 'folder' ? 'text-primary' : 'text-muted-foreground'}`} />
        <span>{node.name}</span>
        {node.comment && <span className="text-muted-foreground/60">{node.comment}</span>}
      </div>
      {node.children && node.children.length > 0 && (
        <div className="ml-1.75 border-l border-border pl-3">
          {node.children.map((child) => (
            <FileTreeRow key={child.name} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArticleFileTree({ root, nodes }: { root?: string; nodes: FileTreeNode[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-[13px] leading-relaxed">
      {root && (
        <div className="mb-1 flex items-center gap-1.5 whitespace-nowrap font-semibold">
          <Folder className="size-3.5 shrink-0 text-primary" />
          {root}
        </div>
      )}
      <div className={root ? 'ml-1.75 border-l border-border pl-3' : ''}>
        {nodes.map((node) => (
          <FileTreeRow key={node.name} node={node} />
        ))}
      </div>
    </div>
  );
}

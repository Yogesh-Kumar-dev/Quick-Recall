import type { ComponentType } from 'react';

// Isolated import of @leafygreen-ui/code (it bundles highlight.js — hundreds of KB) so the
// highlighter lives ONLY in the dynamically-imported code chunk. It is deliberately NOT re-exported
// from the ui-component/leafygreen barrel: that barrel isn't tree-shaken (the app doesn't mark its
// modules side-effect-free), so any barrel member would otherwise drag highlight.js into every
// consumer's First-Load JS. Import this module only from lazily-loaded components (see
// CodeBlockHighlighted / CodeViewerHighlighted).
import { Code, type CodeProps, Language as CodeLanguage, CopyButtonAppearance } from '@leafygreen-ui/code';

export const LGCode = Code as ComponentType<CodeProps>;
export { CodeLanguage as LGCodeLanguage, CopyButtonAppearance as LGCopyButtonAppearance };

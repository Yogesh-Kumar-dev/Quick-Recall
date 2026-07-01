// Ambient declarations for stylesheet imports.
//
// Next.js does NOT ship ambient types for plain `.css` / `.scss` side-effect imports, so the TS
// language server reports "Cannot find module or type declarations for side-effect import" on the
// global stylesheet imports in the root layout (`style.scss`, `tailwind.css`). The build still
// works because Next/webpack resolves the import — these declarations just satisfy the type checker.

// CSS Modules: declared first so the more specific `*.module.*` patterns win over the bare ones
// below. These are imported as a default export object of class-name strings
// (e.g. `import vars from './_themes-vars.module.scss'`).
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Plain stylesheet side-effect imports (e.g. `import './style.scss'`).
declare module '*.css';
declare module '*.scss';
declare module '*.sass';

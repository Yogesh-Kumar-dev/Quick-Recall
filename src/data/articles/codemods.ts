import type { Article } from '@/types/content';

export const codeModsArticle: Article = {
  id: 'codemods',
  slug: 'understanding-codemods',
  category: 'Frontend',
  title: 'Understanding Codemods: Automating Large-Scale Code Migrations',
  summary:
    'Learn what codemods are, how they use Abstract Syntax Trees to safely transform source code, and how frameworks and libraries such as MUI, Next.js, and React use them to automate large-scale upgrades.',
  topics: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Code Migration', 'Developer Tools', 'AST'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'heading',
      id: 'what-is-a-codemod',
      level: 2,
      text: 'What Is a Codemod?'
    },
    {
      type: 'paragraph',
      text: 'A codemod is a program that automatically transforms source code. Instead of manually opening hundreds of files and changing the same API, import, prop, or function call, a codemod analyzes the structure of your code and applies a predefined transformation.'
    },
    {
      type: 'paragraph',
      text: 'Codemods are especially useful when upgrading large applications. A library may introduce a breaking change that requires developers to update thousands of usages across a codebase. Doing that manually is slow, repetitive, and prone to human error, which is one of humanity’s more reliable contributions to software engineering.'
    },
    {
      type: 'paragraph',
      text: 'For example, imagine a component API changes from a boolean prop to a variant prop.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// Before
<Button primary>
  Save
</Button>

// After
<Button variant="primary">
  Save
</Button>`
    },
    {
      type: 'paragraph',
      text: 'Changing one component is trivial. Changing 2,000 components across multiple applications is a migration problem. A codemod can find every matching usage and perform the mechanical part of that migration automatically.'
    },

    {
      type: 'heading',
      id: 'why-not-find-and-replace',
      level: 2,
      text: 'Why Not Just Use Find and Replace?'
    },
    {
      type: 'paragraph',
      text: 'A simple text replacement tool only understands characters. It does not understand JavaScript, TypeScript, JSX, imports, functions, or component props.'
    },
    {
      type: 'paragraph',
      text: 'Suppose we want to rename every prop named primary.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// This should change
<Button primary />

// This should NOT change
const primary = getPrimaryColor();

// This should NOT change either
const message = "primary button";`
    },
    {
      type: 'paragraph',
      text: 'A global text replacement could modify all three. A codemod can understand that the first primary is a JSX attribute while the other two are unrelated JavaScript code.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'The important difference',
      text: 'Find and replace works with text. Codemods work with the structure of your source code.'
    },

    {
      type: 'heading',
      id: 'how-codemods-work',
      level: 2,
      text: 'How Codemods Work'
    },
    {
      type: 'paragraph',
      text: 'Most JavaScript and TypeScript codemods follow the same basic pipeline.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Parse the source code',
          text: 'The codemod reads a source file and converts it into an Abstract Syntax Tree, commonly called an AST.'
        },
        {
          title: 'Find matching code',
          text: 'The codemod searches the AST for the specific structure it wants to transform, such as an import, function call, JSX component, or prop.'
        },
        {
          title: 'Transform the AST',
          text: 'The matching nodes are changed according to the migration rules.'
        },
        {
          title: 'Generate source code',
          text: 'The modified AST is converted back into JavaScript or TypeScript source code.'
        },
        {
          title: 'Review and validate',
          text: 'Developers review the generated changes and run type checking, tests, linting, and application validation.'
        }
      ]
    },

    {
      type: 'heading',
      id: 'what-is-an-ast',
      level: 3,
      text: 'A Very Brief Introduction to ASTs'
    },
    {
      type: 'paragraph',
      text: 'An Abstract Syntax Tree is a structured representation of source code. Instead of seeing code as a string of characters, a parser breaks it into meaningful pieces.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const total = price + tax;`
    },
    {
      type: 'paragraph',
      text: 'A parser can represent this as a variable declaration containing a binary expression. The codemod can then inspect or modify those individual parts without accidentally changing unrelated text.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `VariableDeclaration
└── Identifier: total
└── BinaryExpression
    ├── Identifier: price
    ├── Operator: +
    └── Identifier: tax`
    },
    {
      type: 'paragraph',
      text: 'The exact AST structure depends on the parser, but the idea remains the same: the codemod works with code as structured data.'
    },

    {
      type: 'heading',
      id: 'simple-codemod-example',
      level: 2,
      text: 'Building a Simple Codemod'
    },
    {
      type: 'paragraph',
      text: 'Let us return to the Button migration. Assume our design system previously used primary as a boolean prop.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// Old API
<Button primary>Save</Button>`
    },
    {
      type: 'paragraph',
      text: 'The new API uses a variant prop instead.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// New API
<Button variant="primary">Save</Button>`
    },
    {
      type: 'paragraph',
      text: 'A codemod for this migration would need to do the following:'
    },
    {
      type: 'list',
      style: 'ordered',
      items: [
        'Find JSX elements named Button.',
        'Check whether the component has a primary attribute.',
        'Remove the primary attribute.',
        'Add variant="primary".',
        'Leave unrelated variables, strings, and components unchanged.'
      ]
    },
    {
      type: 'paragraph',
      text: 'Using a tool such as jscodeshift, a simplified transformation could look like this.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `export default function transformer(file, api) {
  const j = api.jscodeshift;

  const root = j(file.source);

  root
    .find(j.JSXOpeningElement, {
      name: {
        name: 'Button'
      }
    })
    .forEach((path) => {
      const hasPrimary = path.node.attributes.some(
        (attribute) =>
          attribute.type === 'JSXAttribute' &&
          attribute.name.name === 'primary'
      );

      if (!hasPrimary) {
        return;
      }

      path.node.attributes =
        path.node.attributes.filter(
          (attribute) =>
            attribute.type !== 'JSXAttribute' ||
            attribute.name.name !== 'primary'
        );

      path.node.attributes.push(
        j.jsxAttribute(
          j.jsxIdentifier('variant'),
          j.stringLiteral('primary')
        )
      );
    });

  return root.toSource();
}`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'This is intentionally simplified',
      text: 'Production codemods usually need to handle imports, aliased components, TypeScript syntax, spread props, formatting, edge cases, and multiple versions of an API.'
    },

    {
      type: 'heading',
      id: 'real-world-mui-codemods',
      level: 2,
      text: 'Real-World Example: MUI Codemods'
    },
    {
      type: 'paragraph',
      text: 'Material UI provides codemods to help applications migrate away from deprecated APIs and to automate parts of major-version upgrades. This is exactly the kind of problem codemods were made for: a component library changes an API, while potentially thousands of applications contain the old API.'
    },
    {
      type: 'paragraph',
      text: 'For example, Material UI provides a deprecations/all codemod that runs its current deprecation migrations against a target path.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `npx @mui/codemod@latest deprecations/all <path>`
    },
    {
      type: 'paragraph',
      text: 'MUI also documents more targeted codemods. One current example migrates deprecated Autocomplete APIs, including changes such as renderTags becoming renderValue and getTagProps becoming getItemProps.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// Before
<Autocomplete
  multiple
  options={options}
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        label={option.label}
        {...getTagProps({ index })}
      />
    ))
  }
/>

// After
<Autocomplete
  multiple
  options={options}
  renderValue={(value, getItemProps) =>
    value.map((option, index) => (
      <Chip
        label={option.label}
        {...getItemProps({ index })}
      />
    ))
  }
/>`
    },
    {
      type: 'paragraph',
      text: 'For MUI X major migrations, preset-safe codemods can automatically handle a portion of breaking changes. The remaining changes still require manual work, particularly when the required transformation cannot be determined safely from a single source file.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `npx @mui/x-codemod@latest v6.0.0/data-grid/preset-safe <path>`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'A codemod is not a guarantee',
      text: 'MUI explicitly documents cases that may require manual migration, such as spread props and cross-file dependencies. After running a codemod, applications should still be tested and reviewed.'
    },

    {
      type: 'heading',
      id: 'real-world-nextjs-codemods',
      level: 2,
      text: 'Real-World Example: Next.js Codemods'
    },
    {
      type: 'paragraph',
      text: 'Next.js maintains codemods specifically for upgrading applications when APIs are changed or deprecated. Its codemod tooling can transform individual APIs or help automate broader framework upgrades.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `npx @next/codemod <transform> <path>`
    },
    {
      type: 'paragraph',
      text: 'One example is the migration from the deprecated middleware convention to the proxy convention.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `npx @next/codemod@latest middleware-to-proxy .`
    },
    {
      type: 'paragraph',
      text: 'Another example removes the unstable_ prefix when an API has been stabilized.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Before
import {
  unstable_cacheTag as cacheTag
} from 'next/cache';

cacheTag();

// After
import {
  cacheTag
} from 'next/cache';

cacheTag();`
    },
    {
      type: 'paragraph',
      text: 'Next.js also provides an upgrade command that can update package versions and run relevant codemods as part of the migration process.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `# Upgrade to the latest major version
npx @next/codemod upgrade major`
    },
    {
      type: 'paragraph',
      text: 'A dry-run option is also available for individual transformations, allowing developers to inspect the intended changes before modifying the codebase.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `npx @next/codemod <transform> <path> --dry --print`
    },

    {
      type: 'heading',
      id: 'real-world-react-codemods',
      level: 2,
      text: 'Real-World Example: React 19 Codemods'
    },
    {
      type: 'paragraph',
      text: 'React also used codemods to help developers migrate applications to React 19. The React team worked with the Codemod team to provide automated transformations for several API and pattern changes.'
    },
    {
      type: 'paragraph',
      text: 'React provided a migration recipe that runs multiple transformations as part of the upgrade.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `npx codemod@latest react/19/migration-recipe`
    },
    {
      type: 'paragraph',
      text: 'One transformation migrates applications away from the deprecated ReactDOM.render API.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// Before
import { render } from 'react-dom';

render(
  <App />,
  document.getElementById('root')
);

// After
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root')
);

root.render(<App />);`
    },
    {
      type: 'paragraph',
      text: 'React 19 codemods can also automate migrations such as replacing useFormState with useActionState, updating the act import, replacing string refs, and handling selected TypeScript migration changes.'
    },

    {
      type: 'heading',
      id: 'real-world-javascript-to-typescript',
      level: 2,
      text: 'Real-World Example: Migrating JavaScript to TypeScript'
    },
    {
      type: 'paragraph',
      text: 'Codemods can also help migrate JavaScript applications toward TypeScript. This type of migration is more complicated than renaming a prop because JavaScript does not contain all of the type information required to automatically produce perfectly typed TypeScript.'
    },
    {
      type: 'paragraph',
      text: 'A migration tool can automate mechanical changes, such as renaming files, updating syntax, adding missing imports, or converting patterns that have a direct TypeScript equivalent. The remaining type information may still require TypeScript inference and manual developer input.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// JavaScript
function getUser(id) {
  return {
    id,
    name: 'Yogesh'
  };
}

const user = getUser(1);`
    },
    {
      type: 'paragraph',
      text: 'A migration can begin by converting the file to TypeScript and allowing the TypeScript compiler to identify the places where additional type information is needed.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return {
    id,
    name: 'Yogesh'
  };
}

const user = getUser(1);`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Automation has limits',
      text: 'A codemod can transform predictable syntax, but it cannot always infer the correct business-level types. For example, it may know that a function accepts a value, but it cannot always determine whether that value should be a string, number, union, generic, or application-specific domain type.'
    },
    {
      type: 'heading',
      id: 'gradual-typescript-migration',
      level: 3,
      text: 'Codemods Are Part of a Gradual Migration'
    },
    {
      type: 'paragraph',
      text: 'Large applications usually migrate gradually rather than converting every JavaScript file in a single pull request. A common approach is to allow JavaScript and TypeScript files to coexist while files are converted incrementally.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// tsconfig.json

{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true
  }
}`
    },
    {
      type: 'paragraph',
      text: 'This allows a team to introduce TypeScript into an existing JavaScript codebase and progressively improve type coverage. Codemods can help with the repetitive structural work, while the TypeScript compiler identifies places where additional type information is required.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Identify predictable transformations',
          text: 'Use codemods or automated scripts for mechanical changes that follow consistent patterns.'
        },
        {
          title: 'Convert files gradually',
          text: 'Rename or migrate selected JavaScript files to TypeScript or TSX rather than attempting to convert the entire application at once.'
        },
        {
          title: 'Enable compiler checking',
          text: 'Use TypeScript compiler options to gradually increase type checking across the application.'
        },
        {
          title: 'Fix compiler errors',
          text: 'Developers add types where inference is insufficient or where the existing JavaScript behavior is ambiguous.'
        },
        {
          title: 'Increase strictness',
          text: 'As the migration progresses, teams can enable stricter TypeScript compiler settings.'
        }
      ]
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'A useful pattern',
      text: 'MUI, Next.js, and React all demonstrate the same idea: when a breaking change follows a predictable structural pattern, the framework or library can encode that migration knowledge into a codemod.'
    },

    {
      type: 'heading',
      id: 'four-examples-compared',
      level: 2,
      text: 'What These Four Examples Have in Common'
    },
    {
      type: 'table',
      columns: ['Project or Migration', 'Migration Problem', 'What Automation Can Do'],
      rows: [
        [
          'MUI',
          'Component APIs and deprecated props change',
          'Rename props, migrate deprecated APIs, and automate parts of major upgrades'
        ],
        ['Next.js', 'Framework conventions and APIs evolve', 'Update deprecated APIs, rename conventions, and automate upgrade steps'],
        ['React', 'Core APIs and patterns are removed or replaced', 'Transform deprecated APIs and automate selected framework migrations'],
        [
          'JavaScript to TypeScript',
          'A large JavaScript codebase needs to adopt TypeScript',
          'Automate predictable syntax and structural changes while TypeScript and developers handle missing type information'
        ]
      ]
    },
    {
      type: 'paragraph',
      text: 'The codemod does not need to understand what the entire application does. It only needs to reliably identify a known code pattern and transform it into the new pattern.'
    },

    {
      type: 'heading',
      id: 'when-codemods-work-best',
      level: 2,
      text: 'When Codemods Work Best'
    },
    {
      type: 'paragraph',
      text: 'Codemods work best when the old and new APIs follow predictable structural patterns.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Renaming an import.',
        'Renaming a JSX prop.',
        'Replacing one function call with another.',
        'Changing a known API signature.',
        'Moving imports to a different package.',
        'Replacing a deprecated framework convention.',
        'Applying the same design-system migration across many repositories.'
      ]
    },

    {
      type: 'heading',
      id: 'where-codemods-struggle',
      level: 2,
      text: 'Where Codemods Struggle'
    },
    {
      type: 'paragraph',
      text: 'A codemod cannot safely automate every migration. The more application-specific context required, the more likely the transformation needs human review.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const buttonProps = {
  primary: isImportant
};

<Button {...buttonProps} />`
    },
    {
      type: 'paragraph',
      text: 'A simple codemod looking for a primary JSX attribute may not be able to safely transform this example. The value is hidden inside an object and may be shared across multiple components.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'Props hidden behind spread operators.',
        'Values defined in other files.',
        'Dynamic component names.',
        'Runtime-generated behavior.',
        'Custom abstractions built on top of the original API.',
        'Changes that require understanding business logic.'
      ]
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Automation should be conservative',
      text: 'A good codemod prefers leaving an uncertain case untouched rather than confidently generating incorrect code.'
    },

    {
      type: 'heading',
      id: 'codemods-in-enterprise',
      level: 2,
      text: 'How Enterprises Use Codemods'
    },
    {
      type: 'paragraph',
      text: 'Codemods become particularly valuable when an organization owns multiple applications or maintains an internal component library.'
    },
    {
      type: 'paragraph',
      text: 'Imagine an internal design system changing the Button API.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `// Version 1
<Button type="primary" />

// Version 2
<Button variant="primary" />`
    },
    {
      type: 'paragraph',
      text: 'Without a codemod, every team must perform the migration independently. Some teams will update immediately, some later, and some will discover the breaking change when a production build starts complaining at an inconvenient hour.'
    },
    {
      type: 'paragraph',
      text: 'With a codemod, the design-system team can ship the migration logic together with the new component version.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Define the new API',
          text: 'The design-system team decides how the component should change.'
        },
        {
          title: 'Create a codemod',
          text: 'The predictable migration from the old API to the new API is encoded as a source transformation.'
        },
        {
          title: 'Test against representative code',
          text: 'The codemod is tested against common component usages and known edge cases.'
        },
        {
          title: 'Run the migration',
          text: 'Application teams run the codemod against their repositories.'
        },
        {
          title: 'Validate the result',
          text: 'Type checking, linting, automated tests, and code review catch cases that cannot be safely automated.'
        }
      ]
    },

    {
      type: 'heading',
      id: 'safe-codemod-workflow',
      level: 2,
      text: 'A Safe Codemod Workflow'
    },
    {
      type: 'paragraph',
      text: 'A codemod should be treated like any other automated change to a codebase. It is useful precisely because it can change a lot of code quickly, which is also why blindly running one and immediately merging the result would be an ambitious way to spend an afternoon.'
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Create a branch',
          text: 'Run the migration in an isolated branch so the generated changes can be reviewed independently.'
        },
        {
          title: 'Use a dry run when available',
          text: 'Inspect what the codemod plans to change before allowing it to modify files.'
        },
        {
          title: 'Review the diff',
          text: 'Check that the transformation changed the intended code and did not introduce unexpected edits.'
        },
        {
          title: 'Run type checking',
          text: 'TypeScript can catch many invalid transformations immediately.'
        },
        {
          title: 'Run linting',
          text: 'Linting helps identify invalid imports, unused variables, and style issues introduced by the migration.'
        },
        {
          title: 'Run tests',
          text: 'Automated tests validate that the transformed application still behaves correctly.'
        },
        {
          title: 'Handle remaining cases manually',
          text: 'Not every migration can be automated. Review and fix the cases intentionally skipped by the codemod.'
        }
      ]
    },

    {
      type: 'heading',
      id: 'common-tools',
      level: 2,
      text: 'Common Tools for Building JavaScript and TypeScript Codemods'
    },
    {
      type: 'table',
      columns: ['Tool', 'Primary Use'],
      rows: [
        ['jscodeshift', 'AST-based JavaScript and TypeScript source transformations'],
        ['Babel', 'Parsing, traversing, and generating JavaScript and TypeScript ASTs'],
        ['ts-morph', 'TypeScript compiler API wrapper for TypeScript-aware transformations'],
        ['ast-grep', 'Structural search and rewriting using syntax-aware patterns'],
        ['Codemod', 'Creating, running, testing, and orchestrating code migrations']
      ]
    },
    {
      type: 'paragraph',
      text: 'The right tool depends on the codebase and the type of transformation. A simple JSX migration may work well with jscodeshift, while a TypeScript migration that requires type information may benefit from ts-morph or the TypeScript compiler API.'
    },

    {
      type: 'heading',
      id: 'codemods-vs-linters',
      level: 2,
      text: 'Codemods vs Linters'
    },
    {
      type: 'paragraph',
      text: 'Codemods and linters both analyze source code, but they solve different problems.'
    },
    {
      type: 'table',
      columns: ['Tool Type', 'Main Purpose'],
      rows: [
        ['Linter', 'Detect potentially incorrect, inconsistent, or undesirable code'],
        ['Codemod', 'Perform a deliberate structural transformation across source files']
      ]
    },
    {
      type: 'paragraph',
      text: 'A linter might tell you that an API is deprecated. A codemod can potentially rewrite that API into its replacement.'
    },
    {
      type: 'paragraph',
      text: 'Some overlap exists because ESLint rules can provide automatic fixes, but codemods are generally better suited to larger one-time migrations that involve multiple related transformations.'
    },

    {
      type: 'heading',
      id: 'key-takeaways',
      level: 2,
      text: 'Key Takeaways'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        'A codemod is a program that automatically transforms source code.',
        'Codemods work with code structure, usually through an Abstract Syntax Tree, rather than simple text replacement.',
        'They are particularly useful for large-scale API migrations and framework upgrades.',
        'MUI uses codemods to migrate deprecated APIs and automate parts of major-version upgrades.',
        'Next.js provides codemods for API changes, deprecated conventions, and framework upgrades.',
        'React used codemods to automate selected migrations for React 19.',
        'Codemods should automate predictable changes while leaving uncertain cases for human review.',
        'A safe migration workflow includes dry runs, diff review, type checking, linting, and automated tests.'
      ]
    },

    {
      type: 'heading',
      id: 'what-next',
      level: 2,
      text: 'What to Explore Next'
    },
    {
      type: 'paragraph',
      text: 'Understanding codemods becomes much easier once you see the underlying transformation happen. The next step is to build a small codemod that parses a React component, finds a specific JSX prop, transforms it, and runs the result against multiple example files.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'A practical exercise',
      text: 'Create a small React project containing ten Button components with different prop combinations. Then build a codemod that migrates primary, secondary, and danger boolean props into a single variant prop. This forces the codemod to handle multiple AST patterns and reveals why real migrations need careful testing.'
    }
  ]
};

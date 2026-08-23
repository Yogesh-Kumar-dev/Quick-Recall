import type { Article } from '@/types/content';

export const webComponentsArticle: Article = {
    id: 'web-components-enterprise-design-systems',
    slug: 'web-components-enterprise-design-systems',
    title: 'Web Components in Enterprise Applications',
    summary:
        'Learn what Web Components are, why enterprises may build framework-independent design systems, and how the same reusable components can be integrated into plain HTML, React, and Angular applications.',
    topics: [
        'Web Components',
        'Design Systems',
        'Frontend Architecture',
        'React',
        'Angular',
        'Enterprise Development',
    ],
    difficulty: 'intermediate',
    blocks: [
        {
            type: 'heading',
            id: 'introduction',
            level: 2,
            text: 'Why talk about Web Components?',
        },
        {
            type: 'paragraph',
            text:
                'Modern frontend applications are usually built with framework-specific component libraries. A React application might use MUI, an Angular application might use Angular Material, and another application might install separate libraries for charts, dialogs, forms, and other UI features.',
        },
        {
            type: 'paragraph',
            text:
                'There is nothing inherently wrong with that approach. Ready-made component libraries can dramatically reduce development time and provide well-tested building blocks. The problem becomes more interesting when a company maintains multiple applications built with different frontend technologies.',
        },
        {
            type: 'paragraph',
            text:
                'Imagine an organization with one legacy application built with plain HTML and JavaScript, another application built with React, and a third application built with Angular. All three applications need the same feedback experience, including consistent validation, accessibility, interactions, and visual design.',
        },
        {
            type: 'paragraph',
            text:
                'The organization could implement the same component separately for every framework. Or it could create the component once using browser-standard Web Components and allow each application to consume it.',
        },
        {
            type: 'callout',
            variant: 'note',
            title: 'The central idea',
            text:
                'Web Components are not necessarily a replacement for libraries such as MUI or Chart.js. They are an alternative way to build and distribute reusable UI components when framework independence is an important architectural requirement.',
        },

        {
            type: 'heading',
            id: 'what-are-web-components',
            level: 2,
            text: 'What are Web Components?',
        },
        {
            type: 'paragraph',
            text:
                'Web Components are a collection of browser technologies that allow developers to create reusable custom HTML elements with their own behavior, state, styles, and public APIs.',
        },
        {
            type: 'paragraph',
            text:
                'Instead of being limited to built-in HTML elements such as buttons, inputs, and dialogs, developers can define their own custom elements.',
        },
        {
            type: 'code',
            language: 'jsx',
            code: `<button>Save</button>

<input />

<dialog></dialog>`,
        },
        {
            type: 'paragraph',
            text:
                'With Web Components, an application can define and use custom elements such as these.',
        },
        {
            type: 'code',
            language: 'jsx',
            code: `<feedback-modal></feedback-modal>

<feedback-card></feedback-card>`,
        },
        {
            type: 'paragraph',
            text:
                'A Web Component can expose a public contract through attributes, JavaScript properties, methods, custom events, CSS custom properties, and selected Shadow DOM parts.',
        },
        {
            type: 'list',
            style: 'unordered',
            items: [
                'Custom HTML elements',
                'Encapsulated behavior',
                'Internal component state',
                'Shadow DOM style encapsulation',
                'Public properties and attributes',
                'Methods',
                'Custom events',
                'CSS customization APIs',
            ],
        },

        {
            type: 'heading',
            id: 'framework-independence',
            level: 2,
            text: 'The component should not care who is using it',
        },
        {
            type: 'paragraph',
            text:
                'One of the most useful properties of a Web Component is that its implementation does not need to depend on the framework used by the host application.',
        },
        {
            type: 'paragraph',
            text:
                'The Web Components project used in this article demonstrates this idea with reusable feedback components. The components are responsible for the user interface and interaction behavior, while the application consuming them remains responsible for application-specific logic.',
        },
        {
            type: 'table',
            columns: ['Component responsibility', 'Host application responsibility'],
            rows: [
                [
                    'Opening and closing UI',
                    'API requests',
                ],
                [
                    'Collecting user input',
                    'Authentication',
                ],
                [
                    'Client-side validation',
                    'Data persistence',
                ],
                [
                    'Keyboard interaction',
                    'Analytics',
                ],
                [
                    'Focus management',
                    'Business rules',
                ],
                [
                    'Accessibility behavior',
                    'Application state management',
                ],
            ],
        },
        {
            type: 'paragraph',
            text:
                'For example, when a user submits feedback, the component does not need to know which backend is being used or where the feedback will eventually be stored. Instead, it can emit a custom event containing the submitted data.',
        },
        {
            type: 'code',
            language: 'typescript',
            code: `document.addEventListener('feedback-submit', async (event) => {
  const customEvent = event as CustomEvent;

  const {
    rating,
    message,
    source,
    context,
  } = customEvent.detail;

  // The host application decides what happens next.
});`,
        },
        {
            type: 'paragraph',
            text:
                'The host application can then decide whether the data should be sent to a REST API, GraphQL service, server action, internal backend service, or another system entirely.',
        },

        {
            type: 'heading',
            id: 'why-enterprises-build-design-systems',
            level: 2,
            text: 'Why would an enterprise build its own component system?',
        },
        {
            type: 'paragraph',
            text:
                'A ready-made component library and an enterprise design system are related, but they are not exactly the same thing.',
        },
        {
            type: 'paragraph',
            text:
                'A component library provides reusable UI components. A design system defines a shared set of standards for building products. That system can include visual design, interaction patterns, accessibility requirements, documentation, testing standards, and the implementation used to distribute components.',
        },
        {
            type: 'list',
            style: 'unordered',
            items: [
                'Design tokens and colors',
                'Typography and spacing rules',
                'Reusable UI components',
                'Accessibility standards',
                'Interaction patterns',
                'Component APIs',
                'Documentation',
                'Testing requirements',
                'Versioning and release processes',
            ],
        },
        {
            type: 'paragraph',
            text:
                'A custom component system becomes more valuable when multiple applications need to share the same user experience but do not necessarily use the same frontend framework.',
        },
        {
            type: 'table',
            columns: ['Approach', 'Main advantage', 'Main limitation'],
            rows: [
                [
                    'Ready-made component library',
                    'Fast development within an existing ecosystem',
                    'Usually optimized for a specific framework',
                ],
                [
                    'Separate implementation per application',
                    'Each application can be customized independently',
                    'UI behavior and accessibility can drift over time',
                ],
                [
                    'Shared Web Components',
                    'Browser-standard components can be reused across frameworks',
                    'Requires careful API design and maintenance',
                ],
                [
                    'Enterprise design system',
                    'Consistent standards across products',
                    'Requires long-term ownership and investment',
                ],
            ],
        },

        {
            type: 'heading',
            id: 'example-component-system',
            level: 2,
            text: 'The example component system',
        },
        {
            type: 'paragraph',
            text:
                'The example used throughout this article is a small Web Components project built with Lit and TypeScript. It currently contains reusable feedback components that can be consumed by different applications.',
        },
        {
            type: 'code',
            language: 'jsx',
            code: `<feedback-modal></feedback-modal>

<feedback-card></feedback-card>`,
        },
        {
            type: 'paragraph',
            text:
                'The project also includes Storybook for isolated component development and documentation, automated tests, TypeScript support, a reusable library build, and playground applications demonstrating how the components can be consumed.',
        },
        {
            type: 'steps',
            items: [
                {
                    title: 'Build the component',
                    text:
                        'Create the reusable UI component using Web Component standards and define its public API.',
                },
                {
                    title: 'Document the component',
                    text:
                        'Use Storybook to demonstrate different states, properties, interactions, and supported use cases.',
                },
                {
                    title: 'Test the component',
                    text:
                        'Test the component independently from the applications that consume it.',
                },
                {
                    title: 'Package the component',
                    text:
                        'Build the component as a reusable package or library.',
                },
                {
                    title: 'Integrate it into applications',
                    text:
                        'Use the same component contract from plain HTML, React, Angular, or other supported environments.',
                },
            ],
        },
        {
            type: 'callout',
            variant: 'tip',
            title: 'Explore the implementation',
            text:
                'Source code: https://github.com/Yogesh-Kumar-dev/web-components\n\nLive Web Components demo: https://yogesh-kumar-dev.github.io/web-components/\n\nStorybook: https://yogesh-kumar-dev.github.io/web-components/storybook',
        },
        {
            type: 'heading',
            id: 'component-event-flow',
            level: 2,
            text: 'Separating component behavior from application logic',
        },
        {
            type: 'paragraph',
            text:
                'The feedback flow provides a useful example of how responsibilities can be separated between a reusable component and the application hosting it.',
        },
        {
            type: 'code',
            language: 'javascript',
            code: `User
  ↓
<feedback-modal>
  ↓
Validate input
  ↓
Dispatch "feedback-submit"
  ↓
Host application
  ↓
Send request to backend
  ↓
Update submission state`,
        },
        {
            type: 'paragraph',
            text:
                'The Web Component handles the interaction. The host application receives the submitted data and performs the application-specific operation.',
        },
        {
            type: 'code',
            language: 'typescript',
            code: `modal.submissionState = 'submitting';

try {
  await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  modal.submissionState = 'success';
} catch {
  modal.submissionState = 'error';
}`,
        },
        {
            type: 'paragraph',
            text:
                'The same Web Component can therefore be reused by multiple applications even when those applications communicate with completely different backend systems.',
        },

        {
            type: 'heading',
            id: 'plain-html-integration',
            level: 2,
            text: 'Integration 1: Using the component in plain HTML',
        },
        {
            type: 'paragraph',
            text:
                'The simplest environment for a Web Component is the browser itself. Once the custom element is registered, it can be used directly inside an HTML document.',
        },
        {
            type: 'code',
            language: 'jsx',
            code: `<feedback-modal
  source="html-demo"
  context="web-components-demo"
></feedback-modal>`,
        },
        {
            type: 'paragraph',
            text:
                'The host application can interact with the element through standard browser APIs.',
        },
        {
            type: 'code',
            language: 'typescript',
            code: `const modal = document.querySelector('feedback-modal');

modal?.show();`,
        },
        {
            type: 'paragraph',
            text:
                'The application can also listen for events dispatched by the component.',
        },
        {
            type: 'code',
            language: 'typescript',
            code: `document.addEventListener('feedback-submit', (event) => {
  const customEvent = event as CustomEvent;

  console.log(customEvent.detail);
});`,
        },
        {
            type: 'paragraph',
            text:
                'Complex objects can be passed through JavaScript properties instead of HTML attributes. This is useful when a component needs structured application data.',
        },
        {
            type: 'code',
            language: 'typescript',
            code: `const card = document.createElement('feedback-card');

card.feedback = feedback;
card.variant = 'compact';`,
        },
        {
            type: 'callout',
            variant: 'note',
            title: 'Live example',
            text:
                'The plain HTML implementation is deployed at yogesh-kumar-dev.github.io/web-components.',
        },

        {
            type: 'heading',
            id: 'react-integration',
            level: 2,
            text: 'Integration 2: Using the same component in React',
        },
        {
            type: 'paragraph',
            text:
                'React can render Web Components because custom elements are part of the browser platform. However, complex JavaScript properties and custom events may require an integration layer to provide a more natural React developer experience.',
        },
        {
            type: 'paragraph',
            text:
                'This implementation uses the Lit React integration utilities to create React-friendly wrappers around the underlying Web Components.',
        },
        {
            type: 'code',
            language: 'tsx',
            code: `import React from 'react';
import {
  createComponent,
  type EventName,
} from '@lit/react';

import {
  FeedbackCard as FeedbackCardElement,
  FeedbackModal as FeedbackModalElement,
} from 'reusable-lit-web-components';`,
        },
        {
            type: 'paragraph',
            text:
                'The wrapper exposes the Web Component through a React component interface.',
        },
        {
            type: 'code',
            language: 'tsx',
            code: `export const FeedbackCard = createComponent({
  tagName: 'feedback-card',
  elementClass: FeedbackCardElement,
  react: React,
});`,
        },
        {
            type: 'paragraph',
            text:
                'Custom DOM events can also be mapped to React-style event properties.',
        },
        {
            type: 'code',
            language: 'tsx',
            code: `export const FeedbackModal = createComponent({
  tagName: 'feedback-modal',
  elementClass: FeedbackModalElement,
  react: React,
  events: {
    onFeedbackSubmit: 'feedback-submit',
    onFeedbackClose: 'feedback-close',
  },
});`,
        },
        {
            type: 'paragraph',
            text:
                'The React application can then consume the reusable components using familiar JSX syntax.',
        },
        {
            type: 'code',
            language: 'tsx',
            code: `<FeedbackCard
  key={item.id}
  feedback={item}
/>

<FeedbackModal
  source="react-playground"
  context="web-components-demo"
  onFeedbackSubmit={handleFeedback}
/>`,
        },
        {
            type: 'paragraph',
            text:
                'The important part is that React is not receiving a rewritten React implementation of the component. The underlying UI is still the same Web Component. React is simply the host application using that component through an integration layer.',
        },
        {
            type: 'callout',
            variant: 'note',
            title: 'Live React example',
            text:
                'The React integration is deployed at yogesh-kumar-dev.github.io/react-playground/web-components.',
        },

        {
            type: 'heading',
            id: 'portfolio-integration',
            level: 2,
            text: 'A real application integration: Quick Pulse',
        },
        {
            type: 'paragraph',
            text:
                'Component playgrounds are useful for testing and documentation, but the more interesting demonstration happens when the reusable component is integrated into a real application.',
        },
        {
            type: 'paragraph',
            text:
                'The same Web Components are also integrated into the Quick Pulse section of the portfolio application.',
        },
        {
            type: 'steps',
            items: [
                {
                    title: 'Render the component',
                    text:
                        'The host application renders the reusable Web Component inside the application interface.',
                },
                {
                    title: 'User interaction',
                    text:
                        'The user interacts with the component and provides feedback.',
                },
                {
                    title: 'Component validation',
                    text:
                        'The component handles its own input validation and interaction behavior.',
                },
                {
                    title: 'Custom event',
                    text:
                        'The component emits a custom event containing the submitted information.',
                },
                {
                    title: 'Application logic',
                    text:
                        'The host application performs the backend request and manages application-specific behavior.',
                },
                {
                    title: 'Update component state',
                    text:
                        'The host can communicate the resulting submission state back to the component.',
                },
            ],
        },
        {
            type: 'callout',
            variant: 'tip',
            title: 'See it in action',
            text:
                'The portfolio implementation is available at yogesh-kumar-portfolio-v2.vercel.app in the Quick Pulse section.',
        },

        {
            type: 'heading',
            id: 'angular-integration',
            level: 2,
            text: 'Integration 3: Using the same component in Angular',
        },
        {
            type: 'paragraph',
            text:
                'Angular can also consume browser custom elements. The same Web Component implementation can be used without rewriting the component in Angular.',
        },
        {
            type: 'paragraph',
            text:
                'The exact integration code for this section should use the Angular implementation from the accompanying project source. This section is intentionally structured as a placeholder until the real Angular source and deployed example are added, so the article documents the actual implementation rather than generic Angular code.',
        },
        {
            type: 'callout',
            variant: 'warning',
            title: 'Implementation example pending',
            text:
                'Replace this section with the actual Angular source code, component registration flow, template usage, event handling, and deployed URL once the Angular example is added.',
        },

        {
            type: 'heading',
            id: 'styling-and-theming',
            level: 2,
            text: 'Styling and theming without breaking encapsulation',
        },
        {
            type: 'paragraph',
            text:
                'Shadow DOM helps protect the internal implementation of a component from accidental CSS conflicts in the host application. This is useful when the same component is consumed by applications with completely different styling systems.',
        },
        {
            type: 'paragraph',
            text:
                'Encapsulation does not mean that the component should be impossible to customize. A reusable component should expose intentional styling APIs.',
        },
        {
            type: 'paragraph',
            text:
                'CSS custom properties provide one way for the host application to customize supported aspects of the component.',
        },
        {
            type: 'code',
            language: 'javascript',
            code: `feedback-modal {
  --feedback-primary-color: #b45309;
  --feedback-surface-color: #ffffff;
  --feedback-border-radius: 12px;
}`,
        },
        {
            type: 'paragraph',
            text:
                'The host application can customize supported visual properties without depending on the internal DOM structure of the component.',
        },
        {
            type: 'callout',
            variant: 'tip',
            title: 'Design the public styling API',
            text:
                'A host application should not need to inspect the internal DOM of a component and target deeply nested selectors just to change a supported visual property. CSS custom properties and Shadow Parts allow customization to become part of the component contract.',
        },

        {
            type: 'heading',
            id: 'storybook-and-documentation',
            level: 2,
            text: 'Why Storybook matters in a component system',
        },
        {
            type: 'paragraph',
            text:
                'A reusable component needs more than source code. Other developers need to understand what the component does, which properties it accepts, which events it emits, which states it supports, and how it behaves in different scenarios.',
        },
        {
            type: 'paragraph',
            text:
                'Storybook provides an isolated environment where components can be developed, tested visually, and documented independently from the applications that consume them.',
        },
        {
            type: 'list',
            style: 'unordered',
            items: [
                'Explore component states',
                'Test properties and attributes',
                'Demonstrate event behavior',
                'Document the public API',
                'Review visual changes',
                'Provide examples for consuming teams',
            ],
        },
        {
            type: 'code',
            language: 'javascript',
            code: `Component API
      |
      +-- Storybook documentation
      +-- Automated tests
      +-- TypeScript definitions
      +-- Accessibility requirements
      |
      v
Published component package
      |
      +----------+----------+
      |          |          |
      v          v          v
    HTML       React      Angular`,
        },

        {
            type: 'heading',
            id: 'project-architecture',
            level: 2,
            text: 'A component-oriented project structure',
        },
        {
            type: 'paragraph',
            text:
                'A reusable component system benefits from organizing each component around its implementation and supporting files rather than around a specific application framework.',
        },
        {
            type: 'filetree',
            root: 'web-components/',
            nodes: [
                {
                    name: 'src',
                    type: 'folder',
                    children: [
                        {
                            name: 'components',
                            type: 'folder',
                            children: [
                                {
                                    name: 'feedback-modal',
                                    type: 'folder',
                                    children: [
                                        {
                                            name: 'feedback-modal.ts',
                                            type: 'file',
                                            comment: 'component implementation',
                                        },
                                        {
                                            name: 'feedback-modal.styles.ts',
                                            type: 'file',
                                            comment: 'component styles',
                                        },
                                        {
                                            name: 'feedback-modal.test.ts',
                                            type: 'file',
                                            comment: 'component tests',
                                        },
                                        {
                                            name: 'feedback-modal.stories.ts',
                                            type: 'file',
                                            comment: 'Storybook stories',
                                        },
                                    ],
                                },
                                {
                                    name: 'feedback-card',
                                    type: 'folder',
                                    children: [
                                        {
                                            name: 'feedback-card.ts',
                                            type: 'file',
                                            comment: 'component implementation',
                                        },
                                        {
                                            name: 'feedback-card.styles.ts',
                                            type: 'file',
                                            comment: 'component styles',
                                        },
                                        {
                                            name: 'feedback-card.test.ts',
                                            type: 'file',
                                            comment: 'component tests',
                                        },
                                        {
                                            name: 'feedback-card.stories.ts',
                                            type: 'file',
                                            comment: 'Storybook stories',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'types',
                            type: 'folder',
                        },
                        {
                            name: 'index.ts',
                            type: 'file',
                            comment: 'public package API',
                        },
                    ],
                },
                {
                    name: 'demo',
                    type: 'folder',
                    comment: 'plain HTML integration',
                },
                {
                    name: '.storybook',
                    type: 'folder',
                    comment: 'Storybook configuration',
                },
                {
                    name: 'vite.config.ts',
                    type: 'file',
                },
                {
                    name: 'vitest.config.ts',
                    type: 'file',
                },
            ],
        },
        {
            type: 'paragraph',
            text:
                'The important architectural boundary is that consuming applications should depend on the public component API rather than importing arbitrary internal files from the component implementation.',
        },

        {
            type: 'heading',
            id: 'web-components-vs-ready-made-libraries',
            level: 2,
            text: 'Web Components versus ready-made component libraries',
        },
        {
            type: 'paragraph',
            text:
                'Using Web Components is not automatically better than using a mature component library. Building and maintaining your own reusable components creates a significant long-term responsibility.',
        },
        {
            type: 'list',
            style: 'unordered',
            items: [
                'Designing stable component APIs',
                'Implementing new features',
                'Writing and maintaining tests',
                'Maintaining accessibility',
                'Managing browser compatibility',
                'Documenting components',
                'Versioning releases',
                'Handling breaking changes',
            ],
        },
        {
            type: 'paragraph',
            text:
                'For a small application or a product that needs to move quickly, using an existing library is often the correct engineering decision.',
        },
        {
            type: 'table',
            columns: [
                'Consideration',
                'Framework component library',
                'Shared Web Components',
            ],
            rows: [
                [
                    'Primary target',
                    'Usually one framework ecosystem',
                    'Browser platform',
                ],
                [
                    'Plain HTML usage',
                    'Usually framework dependent',
                    'Native custom elements',
                ],
                [
                    'Cross-framework reuse',
                    'Often requires separate implementations',
                    'Designed for reuse across applications',
                ],
                [
                    'Initial development speed',
                    'Usually faster',
                    'Requires more initial investment',
                ],
                [
                    'Customization',
                    'Limited by the library API',
                    'Fully controlled by the organization',
                ],
                [
                    'Maintenance',
                    'Mostly shared with the library maintainers',
                    'Owned by the organization',
                ],
                [
                    'Framework independence',
                    'Lower',
                    'Higher',
                ],
            ],
        },

        {
            type: 'heading',
            id: 'when-to-use-web-components',
            level: 2,
            text: 'When does this approach make sense?',
        },
        {
            type: 'paragraph',
            text:
                'A shared Web Components architecture is most useful when the organization has a real reason to maintain framework-independent UI building blocks.',
        },
        {
            type: 'list',
            style: 'unordered',
            items: [
                'Multiple applications use different frontend frameworks',
                'The same UI patterns must remain consistent across products',
                'The organization wants to own its component APIs and implementation',
                'A long-lived design system is being maintained by a dedicated team',
                'Applications need to consume shared components without migrating to the same framework',
            ],
        },
        {
            type: 'paragraph',
            text:
                'For a single application, the additional complexity may not provide enough value. The decision depends on how many applications need the components, how long those applications will be maintained, and how independent the UI layer needs to be from individual frameworks.',
        },

        {
            type: 'heading',
            id: 'final-takeaway',
            level: 2,
            text: 'The bigger idea behind Web Components',
        },
        {
            type: 'paragraph',
            text:
                'The most interesting thing about Web Components is not simply that developers can invent custom HTML tags.',
        },
        {
            type: 'paragraph',
            text:
                'The more important idea is architectural independence. A reusable component can expose a stable contract that applications interact with regardless of the framework used by the application.',
        },
        {
            type: 'list',
            style: 'unordered',
            items: [
                'Properties',
                'Attributes',
                'Methods',
                'Custom events',
                'CSS custom properties',
                'Shadow Parts',
            ],
        },
        {
            type: 'paragraph',
            text:
                'The implementation demonstrated in this article starts with a feedback modal and feedback card, but the same approach could be extended into a much larger component system containing forms, navigation, notifications, dialogs, tables, charts, and other shared UI patterns.',
        },
        {
            type: 'paragraph',
            text:
                'The framework used by an application can change over time. The component contract does not necessarily have to change with it.',
        },
        {
            type: 'callout',
            variant: 'note',
            title: 'Key takeaway',
            text:
                'Web Components are not a universal replacement for MUI, Chart.js, or framework-specific libraries. Their value becomes more compelling when an organization needs to share UI capabilities across applications without forcing every team to adopt the same frontend framework.',
        },
    ],
}
import type { Article } from '@/types/content';

export const mapAndSetReactStateArticle: Article = {
  id: 'map-and-set-react-state',
  slug: 'map-and-set-react-state',
  title: "Map and Set in React State: When Arrays Aren't the Best Tool",
  summary:
    "A practical guide to choosing between Array, Set, and Map in React state, covering when each structure shines, how to use them immutably, and why arrays aren't always the answer.",
  topics: ['React', 'JavaScript', 'Data Structures'],
  difficulty: 'intermediate',
  blocks: [
    {
      type: 'paragraph',
      text: "If you've been writing React for a while, there's a good chance your state looks something like this."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const [users, setUsers] = useState<User[]>([]);`
    },
    {
      type: 'paragraph',
      text: "Arrays are wonderfully familiar. They can hold almost anything, they're easy to render with .map(), and they work for a huge number of situations."
    },
    {
      type: 'paragraph',
      text: 'But eventually you run into problems like:'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        '"I need to find this item by ID."',
        '"I need to make sure this value appears only once."',
        '"I need to quickly check whether something is selected."',
        '"Why am I doing .find() every time?"',
        '"Why does removing one item require filtering the entire array?"'
      ]
    },
    {
      type: 'paragraph',
      text: "This is where Map and Set become useful. The important thing isn't to replace arrays with them everywhere. It's to understand what problem each data structure is designed to solve."
    },
    { type: 'heading', id: 'mental-model', level: 2, text: 'First, the mental model' },
    {
      type: 'paragraph',
      text: 'Think about these three structures.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const fruits = ['apple', 'banana', 'orange'];`
    },
    {
      type: 'paragraph',
      text: "That's an Array. It's essentially: 'I have an ordered collection of values.'"
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const selectedIds = new Set(['a1', 'b2', 'c3']);`
    },
    {
      type: 'paragraph',
      text: "That's a Set. It's essentially: 'I have a collection of unique values, and I care whether a value exists.'"
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const users = new Map([
  ['u1', { name: 'Alice' }],
  ['u2', { name: 'Bob' }],
]);`
    },
    {
      type: 'paragraph',
      text: "That's a Map. It's essentially: 'I have values identified by keys.'"
    },
    {
      type: 'paragraph',
      text: 'That distinction is the foundation.'
    },
    {
      type: 'table',
      columns: ['Structure', 'Mental model'],
      rows: [
        ['Array', 'Ordered list'],
        ['Set', 'Unique values'],
        ['Map', 'Key to value']
      ]
    },
    { type: 'heading', id: 'why-not-arrays', level: 2, text: 'Why not just use arrays for everything?' },
    {
      type: 'paragraph',
      text: 'You absolutely can. Suppose you have selected article IDs.'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const [selectedIds, setSelectedIds] = useState<string[]>([]);`
    },
    {
      type: 'paragraph',
      text: 'To check whether an article is selected:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `selectedIds.includes(article.id);`
    },
    {
      type: 'paragraph',
      text: 'To add an ID:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `setSelectedIds(prev => [...prev, article.id]);`
    },
    {
      type: 'paragraph',
      text: 'To remove it:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `setSelectedIds(prev =>
  prev.filter(id => id !== article.id)
);`
    },
    {
      type: 'paragraph',
      text: "This works. But notice something: you're using an array to represent a collection where uniqueness is important. That means you have to manually make sure you don't accidentally add the same ID twice. That's exactly the kind of problem Set is designed for."
    },
    { type: 'heading', id: 'set-unique-values', level: 2, text: 'Set: I only want unique values' },
    {
      type: 'paragraph',
      text: 'A Set contains unique values.'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const ids = new Set();

ids.add('a1');
ids.add('b2');
ids.add('a1');

console.log(ids);`
    },
    {
      type: 'paragraph',
      text: "The result contains 'a1' and 'b2'. a1 doesn't appear twice."
    },
    {
      type: 'paragraph',
      text: "That's the first major difference from an array. With an array, duplicates are perfectly legal. With a Set, duplicates disappear."
    },
    { type: 'heading', id: 'set-is-selected', level: 2, text: 'Set is great for is this selected?' },
    {
      type: 'paragraph',
      text: 'Imagine a list of articles where users can bookmark multiple articles. An array version:'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const [bookmarkedIds, setBookmarkedIds] =
  useState<string[]>([]);

const isBookmarked = bookmarkedIds.includes(article.id);`
    },
    {
      type: 'paragraph',
      text: 'With a Set:'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const [bookmarkedIds, setBookmarkedIds] =
  useState<Set<string>>(new Set());

const isBookmarked = bookmarkedIds.has(article.id);`
    },
    {
      type: 'paragraph',
      text: 'That reads nicely: does this Set have this ID? And adding or removing values becomes conceptually straightforward.'
    },
    { type: 'heading', id: 'set-immutability', level: 2, text: "Don't mutate a Set in React state" },
    {
      type: 'paragraph',
      text: 'This is wrong:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `bookmarkedIds.add(article.id); // wrong!`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Why this is wrong',
      text: "You're modifying the existing Set. React state should be treated as immutable. When you mutate state directly, React may not detect the change and your component won't re-render."
    },
    {
      type: 'paragraph',
      text: 'Instead, create a new Set:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `setBookmarkedIds(prev => {
  const next = new Set(prev);
  next.add(article.id);
  return next;
});`
    },
    {
      type: 'paragraph',
      text: 'Removing something:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `setBookmarkedIds(prev => {
  const next = new Set(prev);
  next.delete(article.id);
  return next;
});`
    },
    {
      type: 'paragraph',
      text: "The pattern is: create a new Set from the old one, modify the new Set, return the new Set. This is the same fundamental idea you've already been using with arrays."
    },
    { type: 'heading', id: 'map-key-value', level: 2, text: 'Map: give me the value for this key' },
    {
      type: 'paragraph',
      text: 'Now suppose you have articles. With an array:'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const [articles, setArticles] =
  useState<Article[]>([]);

const article = articles.find(
  article => article.id === 'a123'
);`
    },
    {
      type: 'paragraph',
      text: "That's perfectly reasonable. But conceptually, your data is really: article ID to article. That's exactly what Map represents."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `const articles = new Map<string, Article>();
articles.set('a123', article);
articles.get('a123');`
    },
    {
      type: 'paragraph',
      text: "So instead of articles.find(article => article.id === 'a123'), you have articles.get('a123'). The data structure itself expresses what you're trying to do."
    },
    { type: 'heading', id: 'map-in-state', level: 2, text: 'Map in React state' },
    {
      type: 'paragraph',
      text: 'You can keep a Map in React state:'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const [articles, setArticles] =
  useState<Map<string, Article>>(new Map());`
    },
    {
      type: 'paragraph',
      text: 'Adding an article:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `setArticles(prev => {
  const next = new Map(prev);
  next.set(article.id, article);
  return next;
});`
    },
    {
      type: 'paragraph',
      text: 'Updating an article:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `setArticles(prev => {
  const next = new Map(prev);
  next.set(article.id, {
    ...article,
    title: 'Updated title',
  });
  return next;
});`
    },
    {
      type: 'paragraph',
      text: 'Removing an article:'
    },
    {
      type: 'code',
      language: 'typescript',
      code: `setArticles(prev => {
  const next = new Map(prev);
  next.delete(article.id);
  return next;
});`
    },
    {
      type: 'paragraph',
      text: "Again, notice the pattern: create a new Map from the old one, modify the copy, return the copy. We're not doing prev.set(...) because that mutates the existing state."
    },
    { type: 'heading', id: 'practical-example', level: 2, text: 'A very practical React example' },
    {
      type: 'paragraph',
      text: 'Imagine a search screen. You have articles and you need to keep track of which ones are selected. An excellent combination is:'
    },
    {
      type: 'code',
      language: 'tsx',
      code: `const [articlesById, setArticlesById] =
  useState<Map<string, Article>>(new Map());

const [selectedIds, setSelectedIds] =
  useState<Set<string>>(new Set());`
    },
    {
      type: 'paragraph',
      text: "Now each structure has a very clear responsibility. The Map stores article ID to Article. The Set stores selected article IDs. You can ask articlesById.get('a2') and selectedIds.has('a2'). That's much more expressive than trying to make one giant array do everything."
    },
    { type: 'heading', id: 'react-rendering', level: 2, text: 'But React still likes arrays for rendering' },
    {
      type: 'paragraph',
      text: "This is where beginners sometimes think: if Map is so good, why don't I just use Map everywhere? Because React's rendering APIs and JavaScript's array methods make arrays extremely convenient."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `articles.map(article => (
  <ArticleCard
    key={article.id}
    article={article}
  />
))`
    },
    {
      type: 'paragraph',
      text: "With a Map, you can still render it, but notice that you've now converted the Map into something array-like just to render it."
    },
    {
      type: 'code',
      language: 'tsx',
      code: `Array.from(articlesById.values()).map(article => (
  <ArticleCard
    key={article.id}
    article={article}
  />
))`
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'A useful rule',
      text: 'Use the data structure that matches how you need to work with the data. If you primarily render an ordered collection, an array may be the simplest choice. If you frequently look things up by ID, a Map may make more sense.'
    },
    { type: 'heading', id: 'cheat-sheet', level: 2, text: 'Map vs Set vs Array' },
    {
      type: 'table',
      columns: ['Use when...', 'Mental model', 'Example'],
      rows: [
        ['You care about order, rendering with .map(), duplicates are fine', 'Ordered list', 'const articles: Article[] = [];'],
        ['You care about uniqueness, fast membership checks', 'Which unique things do I have?', 'const selectedIds = new Set<string>();'],
        [
          'You need key-to-value lookup, fast access by ID',
          'What value belongs to this key?',
          'const articlesById = new Map<string, Article>();'
        ]
      ]
    },
    { type: 'heading', id: 'immutability-rule', level: 2, text: 'The most important React rule' },
    {
      type: 'paragraph',
      text: "Whether you're using an Array, Set, or Map: don't mutate the existing state."
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Array
setItems(prev => [...prev, item]);

// Set
setIds(prev => {
  const next = new Set(prev);
  next.add(id);
  return next;
});

// Map
setArticles(prev => {
  const next = new Map(prev);
  next.set(id, article);
  return next;
});`
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Same principle, different syntax',
      text: "The syntax changes but the principle doesn't. Create a new state value, modify the new value, and give it back to React. This is the same pattern you already use with arrays via the spread operator."
    },
    { type: 'heading', id: 'final-mental-model', level: 2, text: 'One final mental model' },
    {
      type: 'paragraph',
      text: "Don't think of Map and Set as fancier arrays. Think of them as answering different questions."
    },
    {
      type: 'table',
      columns: ['Structure', 'Question it answers'],
      rows: [
        ['Array', 'What things do I have, in what order?'],
        ['Set', 'Which unique things do I have?'],
        ['Map', 'What value belongs to this key?']
      ]
    },
    {
      type: 'paragraph',
      text: 'Once you start thinking in those questions, choosing between them becomes much less mysterious. And your React state stops becoming a pile of arrays that humanity has somehow agreed to call architecture.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Knowledge check',
      text: "You need to track selected article IDs and duplicates should never exist. Array, Set, or Map?\nYou need to retrieve an article instantly using its ID. Array, Set, or Map?\nYou need to display articles in a specific order and frequently use .map(). Array, Set, or Map?\nWhy is selectedIds.add(id) problematic when selectedIds is React state?\nWhat does const next = new Map(prev); next.set(id, article); return next; accomplish?\nIf you can answer those five, you've moved from 'I've heard of Map and Set' to actually knowing when to reach for them."
    }
  ]
};

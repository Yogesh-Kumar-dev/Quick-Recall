// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/ShoppingCart');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Shopping Cart',
  description:
    'Build a product listing page with a shopping cart. Products can be added to the cart, their quantities adjusted, and removed. The cart persists across page refreshes using localStorage.',
  requirements: [
    'Display a grid of products (id, name, price, category)',
    'Add to Cart button on each product',
    'Cart sidebar/panel shows added items with quantity controls (+ / −)',
    'Remove individual items from the cart',
    'Show subtotal per item (price × quantity) and grand total',
    'Cart badge on the cart button shows total item count',
    'Persist cart to localStorage via a custom useLocalStorage hook',
    'Clear cart button empties the cart'
  ],
  keyPatterns: [
    'useLocalStorage<T>(key, initial) hook',
    'cart: CartItem[] (productId + quantity)',
    'Derived totals via Array.reduce()',
    'Add: find-or-append pattern',
    'Quantity update: map()',
    'Remove: filter()'
  ],
  interviewTip:
    'Never store product data in the cart — only store { productId, quantity }. Look up product details from the products array when rendering. This keeps cart state minimal. For totals: cartTotal = cart.reduce((sum, item) => sum + item.quantity * getProduct(item.productId).price, 0).'
};

export default function ShoppingCartApp() {
  return (
    <ProblemShell
      problem={PROBLEM}
      versions={{
        jsx: { component: <JsxVersion />, code: jsxCode },
        tsx: { component: <TsxVersion />, code: tsxCode }
      }}
    />
  );
}

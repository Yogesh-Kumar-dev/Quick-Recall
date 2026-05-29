'use client';
/**
 * SHOPPING CART — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Custom hook: useLocalStorage<T>(key, initialValue)
 *   - Reads from localStorage on first render (lazy initializer in useState)
 *   - Writes to localStorage every time state changes
 *   - Generic: works for any serialisable type
 *
 * Cart state shape: CartItem[] = { productId: number, quantity: number }[]
 * Why NOT store product in cart: product catalog can change; cart only needs IDs.
 *
 * Key operations (all return NEW arrays — no mutation):
 *   addToCart:      find existing → increment qty, OR append new item
 *   updateQty:      map → update matching item's quantity
 *   removeFromCart: filter → drop item by productId
 *   cartTotal:      reduce → sum of (qty × price) for each cart item
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import { IconShoppingCart, IconPlus, IconMinus, IconTrash, IconX } from '@tabler/icons-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
}
interface CartItem {
  productId: number;
  quantity: number;
}

// ── Products catalog ──────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1, name: 'React Masterclass', price: 49, category: 'Course', emoji: '⚛️' },
  { id: 2, name: 'TypeScript Pro', price: 39, category: 'Course', emoji: '🔷' },
  { id: 3, name: 'Node.js Handbook', price: 29, category: 'Book', emoji: '📗' },
  { id: 4, name: 'CSS Art Kit', price: 19, category: 'Design', emoji: '🎨' },
  { id: 5, name: 'Docker Deep Dive', price: 34, category: 'Course', emoji: '🐳' },
  { id: 6, name: 'System Design Guide', price: 59, category: 'Book', emoji: '🏗️' }
];

// ── useLocalStorage hook ───────────────────────────────────────────────────────
// Generic hook — reuse for any state that should persist across refreshes
function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Lazy initializer: runs only once. Reads from localStorage or falls back.
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage quota exceeded or unavailable — fail silently
    }
  };

  return [storedValue, setValue];
}

// ──────────────────────────────────────────────────────────────────────────────
export default function ShoppingCartMui() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('mc-cart-mui', []);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const getProduct = (id: number) => PRODUCTS.find((p) => p.id === id)!;

  // ── Cart operations ───────────────────────────────────────────────────────────

  const addToCart = (productId: number) => {
    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      // Already in cart → increment quantity
      setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      // New item → append with quantity 1
      setCart([...cart, { productId, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, delta: number) => {
    const updated = cart.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + delta } : item));
    // Remove items with quantity ≤ 0
    setCart(updated.filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId: number) => setCart(cart.filter((item) => item.productId !== productId));

  // ── Derived totals ────────────────────────────────────────────────────────────
  // Total item count (sum of all quantities) — for the badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Grand total price
  const grandTotal = cart.reduce((sum, item) => sum + item.quantity * getProduct(item.productId).price, 0);

  const cartQty = (productId: number) => cart.find((i) => i.productId === productId)?.quantity ?? 0;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">🛍️ Store</Typography>
        <Badge badgeContent={totalItems} color="error">
          <Button variant="outlined" startIcon={<IconShoppingCart size={18} />} onClick={() => setDrawerOpen(true)}>
            Cart {totalItems > 0 && `(₹${grandTotal})`}
          </Button>
        </Badge>
      </Box>

      {/* Product grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
        {PRODUCTS.map((product) => {
          const qty = cartQty(product.id);
          return (
            <Card key={product.id} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ pb: 1 }}>
                <Typography fontSize={32} lineHeight={1} mb={1}>
                  {product.emoji}
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {product.name}
                </Typography>
                <Chip label={product.category} size="small" sx={{ mt: 0.5 }} />
                <Typography variant="h6" color="primary" mt={1}>
                  ₹{product.price}
                </Typography>
                {qty > 0 && <Chip label={`${qty} in cart`} size="small" color="success" variant="outlined" sx={{ mt: 0.5 }} />}
              </CardContent>
              <CardActions sx={{ pt: 0 }}>
                <Button size="small" variant="contained" fullWidth onClick={() => addToCart(product.id)}>
                  {qty > 0 ? 'Add More' : 'Add to Cart'}
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>

      {/* Cart Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 340, p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>
              🛒 Cart ({totalItems} items)
            </Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <IconX size={18} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Empty state */}
          {cart.length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
              Your cart is empty. Add some products!
            </Typography>
          )}

          {/* Cart items */}
          <Stack spacing={1.5} sx={{ flex: 1, overflowY: 'auto' }}>
            {cart.map((item) => {
              const product = getProduct(item.productId);
              return (
                <Paper key={item.productId} variant="outlined" sx={{ p: 1.5, borderRadius: 1.5 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontSize={24}>{product.emoji}</Typography>
                    <Box flex={1} minWidth={0}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ₹{product.price} × {item.quantity} = ₹{product.price * item.quantity}
                      </Typography>
                    </Box>
                    <IconButton size="small" color="error" onClick={() => removeFromCart(item.productId)}>
                      <IconTrash size={14} />
                    </IconButton>
                  </Box>
                  {/* Quantity controls */}
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <IconButton size="small" onClick={() => updateQuantity(item.productId, -1)}>
                      <IconMinus size={14} />
                    </IconButton>
                    <Typography variant="body2" fontWeight={700} minWidth={20} textAlign="center">
                      {item.quantity}
                    </Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.productId, +1)}>
                      <IconPlus size={14} />
                    </IconButton>
                  </Box>
                </Paper>
              );
            })}
          </Stack>

          {/* Footer */}
          {cart.length > 0 && (
            <Box mt={2}>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="primary">
                  ₹{grandTotal}
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Button variant="contained" fullWidth size="large">
                  Checkout
                </Button>
                <Button variant="outlined" color="error" fullWidth onClick={() => setCart([])}>
                  Clear Cart
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}

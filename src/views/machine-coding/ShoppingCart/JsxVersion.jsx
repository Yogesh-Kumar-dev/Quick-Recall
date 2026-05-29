'use client';
/**
 * SHOPPING CART — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 */
import { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'React Masterclass', price: 49, category: 'Course', emoji: '⚛️' },
  { id: 2, name: 'TypeScript Pro', price: 39, category: 'Course', emoji: '🔷' },
  { id: 3, name: 'Node.js Handbook', price: 29, category: 'Book', emoji: '📗' },
  { id: 4, name: 'CSS Art Kit', price: 19, category: 'Design', emoji: '🎨' },
  { id: 5, name: 'Docker Deep Dive', price: 34, category: 'Course', emoji: '🐳' },
  { id: 6, name: 'System Design Guide', price: 59, category: 'Book', emoji: '🏗️' }
];

// ── useLocalStorage hook ────────────────────────────────────────────────────────
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = (value) => {
    setStoredValue(value);
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch { /* silent */ }
  };
  return [storedValue, setValue];
}

// ──────────────────────────────────────────────────────────────────────────────
export default function ShoppingCart() {
  const [cart, setCart] = useLocalStorage('mc-cart-js', []);
  const [cartOpen, setCartOpen] = useState(false);

  const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

  const addToCart = (productId) => {
    const existing = cart.find((i) => i.productId === productId);
    if (existing) {
      setCart(cart.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
  };

  const updateQty = (productId, delta) => {
    const updated = cart.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + delta } : i));
    setCart(updated.filter((i) => i.quantity > 0));
  };

  const removeItem = (productId) => setCart(cart.filter((i) => i.productId !== productId));

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const grandTotal = cart.reduce((sum, i) => sum + i.quantity * getProduct(i.productId).price, 0);
  const cartQty = (id) => cart.find((i) => i.productId === id)?.quantity ?? 0;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>🛍️ Store</span>
        <button
          onClick={() => setCartOpen(!cartOpen)}
          style={{ position: 'relative', padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
        >
          🛒 Cart {totalItems > 0 && `(₹${grandTotal})`}
          {totalItems > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -6, background: '#f44336', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {PRODUCTS.map((product) => {
            const qty = cartQty(product.id);
            return (
              <div key={product.id} style={{ border: '1px solid #e0e0e0', borderRadius: 10, padding: 14, background: '#fff' }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>{product.emoji}</div>
                <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>{product.name}</p>
                <span style={{ fontSize: 11, background: '#f0f0f0', padding: '2px 8px', borderRadius: 8, color: '#666' }}>{product.category}</span>
                <p style={{ color: '#1976d2', fontWeight: 700, fontSize: 16, margin: '8px 0 4px' }}>₹{product.price}</p>
                {qty > 0 && <p style={{ fontSize: 12, color: '#4caf50', margin: '0 0 6px' }}>{qty} in cart</p>}
                <button
                  onClick={() => addToCart(product.id)}
                  style={{ width: '100%', padding: '7px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                >
                  {qty > 0 ? 'Add More' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>

        {cartOpen && (
          <div style={{ width: 300, border: '1px solid #e0e0e0', borderRadius: 10, padding: 16, background: '#fff', display: 'flex', flexDirection: 'column', maxHeight: 520, flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong style={{ fontSize: 15 }}>🛒 Cart ({totalItems})</strong>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888' }}>✕</button>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0 0 12px' }} />

            {cart.length === 0 && <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center', margin: '20px 0' }}>Your cart is empty.</p>}

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {cart.map((item) => {
                const p = getProduct(item.productId);
                return (
                  <div key={item.productId} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 22 }}>{p.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>₹{p.price} × {item.quantity} = ₹{p.price * item.quantity}</p>
                      </div>
                      <button onClick={() => removeItem(item.productId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f44336', fontSize: 16 }}>✕</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.productId, -1)} style={qtyBtnStyle}>−</button>
                      <span style={{ fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, +1)} style={qtyBtnStyle}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {cart.length > 0 && (
              <div style={{ marginTop: 12, borderTop: '1px solid #eee', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 700, color: '#1976d2' }}>₹{grandTotal}</span>
                </div>
                <button style={{ width: '100%', padding: '10px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  Checkout
                </button>
                <button onClick={() => setCart([])} style={{ width: '100%', padding: '8px 0', background: 'transparent', color: '#f44336', border: '1px solid #f44336', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  width: 26, height: 26, border: '1px solid #ccc', borderRadius: 4, background: '#f5f5f5',
  cursor: 'pointer', fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
};

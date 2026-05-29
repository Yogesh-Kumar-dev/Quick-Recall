'use client';
/**
 * API DATA FETCHING — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Zero MUI. Fetches posts from JSONPlaceholder on button click.
 * Manages loading / error / data states.
 *
 * Pattern:
 *   const [data, setData] = useState([]);
 *   const [loading, setLoading] = useState(false);
 *   const [error, setError] = useState(null);
 *   async function fetchData() { setLoading(true); try {...} catch {...} finally { setLoading(false) } }
 */
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function APIDataFetching() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data: Post[] = await res.json();
      setPosts(data);
      setFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Posts</h3>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>jsonplaceholder.typicode.com</p>
        </div>
        <button
          onClick={fetchPosts}
          disabled={loading}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: loading ? '#9ca3af' : fetched ? '#0f172a' : '#2563eb',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite'
                }}
              />
              Loading…
            </>
          ) : fetched ? (
            '↻ Refresh'
          ) : (
            '⬇ Fetch Posts'
          )}
        </button>
      </div>

      {/* Spin keyframe — inline style trick */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: 13,
            marginBottom: 12
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Skeleton while loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 68,
                borderRadius: 8,
                background: `linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.2s infinite'
              }}
            />
          ))}
          <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      )}

      {/* Results */}
      {!loading && posts.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: '#fafafa'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    background: '#dbeafe',
                    color: '#1d4ed8',
                    borderRadius: 999,
                    padding: '1px 8px',
                    fontSize: 11,
                    fontWeight: 700
                  }}
                >
                  #{post.id}
                </span>
                <span
                  style={{
                    background: '#f0fdf4',
                    color: '#15803d',
                    borderRadius: 999,
                    padding: '1px 8px',
                    fontSize: 11
                  }}
                >
                  user {post.userId}
                </span>
              </div>
              <p style={{ margin: '0 0 3px', fontWeight: 600, fontSize: 13, textTransform: 'capitalize' }}>{post.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
                {post.body.substring(0, 90)}…
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {!loading && !fetched && !error && (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌐</div>
          <p style={{ margin: 0, fontSize: 14 }}>Click &ldquo;Fetch Posts&rdquo; to load data from the API</p>
        </div>
      )}
    </div>
  );
}

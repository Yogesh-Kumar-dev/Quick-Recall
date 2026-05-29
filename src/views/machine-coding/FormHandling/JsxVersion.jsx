'use client';
/**
 * FORM HANDLING — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 *
 * Patterns:
 * - Single handleChange via e.target.name (no field-specific handlers)
 * - Validate-on-submit + clear error on field change
 */
import { useState } from 'react';

function validate(data) {
  const errs = {};
  if (!data.name.trim()) errs.name = 'Name is required';
  if (!data.email.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Enter a valid email';
  if (!data.message.trim()) errs.message = 'Message is required';
  else if (data.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
  return errs;
}

const INITIAL = { name: '', email: '', message: '' };

export default function FormHandling() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
        <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>Form Submitted!</h3>
        <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 20px', display: 'inline-block', textAlign: 'left', marginBottom: 16 }}>
          <p style={{ margin: '4px 0', fontSize: 14 }}><strong>Name:</strong> {form.name}</p>
          <p style={{ margin: '4px 0', fontSize: 14 }}><strong>Email:</strong> {form.email}</p>
          <p style={{ margin: '4px 0', fontSize: 14 }}><strong>Message:</strong> {form.message}</p>
        </div>
        <br />
        <button
          onClick={() => { setForm(INITIAL); setErrors({}); setSubmitted(false); }}
          style={{ padding: '10px 24px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  const fieldWrap = { display: 'flex', flexDirection: 'column', gap: 4 };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151' };
  const inputStyle = (err) => ({
    padding: '10px 12px',
    fontSize: 14,
    borderRadius: 8,
    border: `1px solid ${err ? '#ef4444' : '#d1d5db'}`,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    background: err ? '#fff5f5' : '#fff',
    transition: 'border-color 0.15s'
  });
  const errorStyle = { fontSize: 12, color: '#ef4444', marginTop: 2 };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={fieldWrap}>
        <label style={labelStyle}>Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" style={inputStyle(!!errors.name)} />
        {errors.name && <span style={errorStyle}>{errors.name}</span>}
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" style={inputStyle(!!errors.email)} />
        {errors.email && <span style={errorStyle}>{errors.email}</span>}
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write your message (min 10 chars)…"
          rows={4}
          style={{ ...inputStyle(!!errors.message), resize: 'vertical' }}
        />
        {errors.message && <span style={errorStyle}>{errors.message}</span>}
      </div>

      <button
        type="submit"
        style={{ padding: '12px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15, marginTop: 4 }}
      >
        Submit
      </button>
    </form>
  );
}

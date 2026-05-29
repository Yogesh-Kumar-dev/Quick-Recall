'use client';
/**
 * FORM HANDLING — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same validate + handleChange pattern as PlainVersion.
 * MUI TextField's error / helperText props replace the inline error spans.
 */
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(data: FormData): Errors {
  const errs: Errors = {};
  if (!data.name.trim()) errs.name = 'Name is required';
  if (!data.email.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Enter a valid email';
  if (!data.message.trim()) errs.message = 'Message is required';
  else if (data.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
  return errs;
}

const INITIAL: FormData = { name: '', email: '', message: '' };

export default function FormHandling() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          Form Submitted!
        </Typography>
        <Box
          sx={{
            display: 'inline-block',
            textAlign: 'left',
            bgcolor: 'grey.50',
            borderRadius: 2,
            p: 2,
            mb: 2
          }}
        >
          <Typography variant="body2">
            <strong>Name:</strong> {form.name}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {form.email}
          </Typography>
          <Typography variant="body2">
            <strong>Message:</strong> {form.message}
          </Typography>
        </Box>
        <br />
        <Button
          variant="outlined"
          onClick={() => {
            setForm(INITIAL);
            setErrors({});
            setSubmitted(false);
          }}
        >
          Submit Another
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        name="name"
        label="Name"
        value={form.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        placeholder="John Doe"
        fullWidth
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        placeholder="john@example.com"
        fullWidth
      />
      <TextField
        name="message"
        label="Message"
        value={form.message}
        onChange={handleChange}
        error={!!errors.message}
        helperText={errors.message}
        placeholder="Write your message (min 10 chars)…"
        multiline
        rows={4}
        fullWidth
      />
      <Button type="submit" variant="contained" size="large" sx={{ mt: 0.5 }}>
        Submit
      </Button>
    </Box>
  );
}

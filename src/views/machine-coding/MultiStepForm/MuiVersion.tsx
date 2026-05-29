'use client';
/**
 * MULTI-STEP FORM — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Key patterns:
 * 1. One flat state object for all form data — no state per field
 * 2. currentStep drives conditional rendering (no router needed)
 * 3. Per-step validation: only validate fields for the CURRENT step
 * 4. Progress = (currentStep / TOTAL_STEPS) * 100  (derived, not stored)
 *
 * Step structure:
 *   STEP_CONFIG[currentStep] defines: title, fields, and validate()
 *   This makes adding a new step trivial — just push to STEP_CONFIG.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

// ── Form data shape ────────────────────────────────────────────────────────────
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
}

const INITIAL_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  experience: ''
};

// ── Step config — each step knows its fields + how to validate ─────────────────
// Adding a step = push one object here. No changes elsewhere needed.
const STEPS = [
  {
    title: 'Personal Info',
    subtitle: 'Tell us about yourself',
    validate: (d: FormData) => d.firstName.trim() && d.lastName.trim()
  },
  {
    title: 'Contact Details',
    subtitle: 'How can we reach you?',
    validate: (d: FormData) => d.email.trim() && d.phone.trim()
  },
  {
    title: 'Role & Experience',
    subtitle: "What's your background?",
    validate: (d: FormData) => d.role && d.experience
  },
  {
    title: 'Review & Submit',
    subtitle: 'Confirm your information',
    validate: () => true // review step is always valid
  }
];

const ROLES = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Designer', 'Product Manager', 'DevOps'];
const EXP = ['0–1 years', '1–3 years', '3–5 years', '5–10 years', '10+ years'];

// ──────────────────────────────────────────────────────────────────────────────
export default function MultiStepFormMui() {
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);

  // ── Derived values ────────────────────────────────────────────────────────────
  const TOTAL_STEPS = STEPS.length;
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100; // 25 → 50 → 75 → 100
  const isCurrentStepValid = STEPS[currentStep].validate(formData);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  // Single change handler for all fields — no need for per-field handlers
  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const next = () => {
    if (currentStep < TOTAL_STEPS - 1) setCurrentStep((s) => s + 1);
  };
  const back = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };
  const submit = () => setSubmitted(true);
  const reset = () => {
    setFormData(INITIAL_DATA);
    setCurrentStep(0);
    setSubmitted(false);
  };

  // ── Success screen ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <Paper sx={{ p: 3, maxWidth: 480, borderRadius: 2, textAlign: 'center' }} elevation={2}>
        <Typography variant="h4" mb={1}>
          🎉
        </Typography>
        <Typography variant="h5" fontWeight={700} mb={1}>
          Application Submitted!
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Thanks, {formData.firstName}! We&apos;ll reach you at {formData.email}.
        </Typography>
        <Button variant="outlined" onClick={reset}>
          Start Over
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 480, borderRadius: 2 }} elevation={2}>
      {/* ── Step indicator ─────────────────────────────────────────────────────── */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">
            Step {currentStep + 1} of {TOTAL_STEPS}
          </Typography>
          <Typography variant="caption" color="primary" fontWeight={700}>
            {Math.round(progress)}%
          </Typography>
        </Box>

        {/* LinearProgress = the progress bar */}
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />

        {/* Step dots */}
        <Stack direction="row" spacing={1} mt={1.5} justifyContent="space-between">
          {STEPS.map((step, i) => (
            <Chip
              key={i}
              label={step.title}
              size="small"
              color={i === currentStep ? 'primary' : i < currentStep ? 'success' : 'default'}
              variant={i <= currentStep ? 'filled' : 'outlined'}
              sx={{ flex: 1, fontSize: 10 }}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* ── Step title ───────────────────────────────────────────────────────────── */}
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        {STEPS[currentStep].title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2.5}>
        {STEPS[currentStep].subtitle}
      </Typography>

      {/* ── Step 0: Personal Info ─────────────────────────────────────────────── */}
      {currentStep === 0 && (
        <Stack spacing={2}>
          <TextField label="First Name" size="small" fullWidth value={formData.firstName} onChange={handleChange('firstName')} required />
          <TextField label="Last Name" size="small" fullWidth value={formData.lastName} onChange={handleChange('lastName')} required />
        </Stack>
      )}

      {/* ── Step 1: Contact ───────────────────────────────────────────────────── */}
      {currentStep === 1 && (
        <Stack spacing={2}>
          <TextField label="Email" type="email" size="small" fullWidth value={formData.email} onChange={handleChange('email')} required />
          <TextField label="Phone" type="tel" size="small" fullWidth value={formData.phone} onChange={handleChange('phone')} required />
        </Stack>
      )}

      {/* ── Step 2: Role ──────────────────────────────────────────────────────── */}
      {currentStep === 2 && (
        <Stack spacing={2}>
          <TextField select label="Job Role" size="small" fullWidth value={formData.role} onChange={handleChange('role')} required>
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Years of Experience"
            size="small"
            fullWidth
            value={formData.experience}
            onChange={handleChange('experience')}
            required
          >
            {EXP.map((e) => (
              <MenuItem key={e} value={e}>
                {e}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      )}

      {/* ── Step 3: Review ────────────────────────────────────────────────────── */}
      {currentStep === 3 && (
        <Stack spacing={1.5}>
          {[
            { label: 'Full Name', value: `${formData.firstName} ${formData.lastName}` },
            { label: 'Email', value: formData.email },
            { label: 'Phone', value: formData.phone },
            { label: 'Role', value: formData.role },
            { label: 'Experience', value: formData.experience }
          ].map(({ label, value }) => (
            <Box key={label} display="flex" justifyContent="space-between" sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {value || '—'}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      {/* ── Navigation buttons ───────────────────────────────────────────────── */}
      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Button variant="outlined" onClick={back} disabled={currentStep === 0}>
          ← Back
        </Button>

        {currentStep < TOTAL_STEPS - 1 ? (
          <Button variant="contained" onClick={next} disabled={!isCurrentStepValid}>
            Next →
          </Button>
        ) : (
          <Button variant="contained" color="success" onClick={submit}>
            Submit ✓
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

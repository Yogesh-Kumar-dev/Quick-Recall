'use client';
/**
 * OTP INPUT — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * The three things interviewers check:
 * 1. Auto-advance: after typing a digit, focus index + 1
 * 2. Backspace retreat: if current box is empty AND backspace pressed, focus index - 1
 * 3. Paste: split clipboard text, fill array, focus last filled box
 *
 * useRef pattern for DOM access:
 *   const inputRefs = useRef<HTMLInputElement[]>([])
 *   // Assign: ref={(el) => { if (el) inputRefs.current[i] = el }}
 *   // Focus:  inputRefs.current[i]?.focus()
 */
import { useState, useRef } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';

const OTP_LENGTH = 6;

export default function OTPMui() {
  // Array of strings, one per box
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [message, setMessage] = useState('');

  // Array of refs — one per input box
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // ── Handle single digit input ───────────────────────────────────────────────
  const handleChange = (index: number, value: string) => {
    // Only accept digits
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setMessage('');

    // Auto-advance: if a digit was entered and there's a next box, focus it
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ── Handle Backspace ────────────────────────────────────────────────────────
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Box has content: clear it (handleChange will run automatically)
        return;
      }
      // Box is already empty: move focus back to previous box
      if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
    // Allow navigating with arrow keys (browser default handles it)
  };

  // ── Handle Paste ────────────────────────────────────────────────────────────
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    // Strip non-digits, take first OTP_LENGTH characters
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);

    // Focus the last filled box (or the box after the last filled)
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  // ── Submit / Verify ─────────────────────────────────────────────────────────
  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setMessage(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setMessage(`✅ OTP verified: ${code}`);
  };

  const handleReset = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setMessage('');
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <Paper sx={{ p: 3, maxWidth: 420, borderRadius: 2 }} elevation={2}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Enter verification code
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2.5}>
        We sent a 6-digit code to your phone. Enter it below.
      </Typography>

      {/* OTP boxes */}
      <Stack direction="row" spacing={1.5} mb={3} justifyContent="center">
        {otp.map((digit, index) => (
          <OutlinedInput
            key={index}
            value={digit}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                padding: '10px 0'
              }
            }}
            sx={{
              width: 50,
              '& input': { px: 0 }
            }}
            // Register the ref for this input
            inputRef={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
            onPaste={handlePaste}
            // Select all text on focus — makes it easy to overwrite
            onFocus={(e) => e.target.select()}
          />
        ))}
      </Stack>

      {/* Status message */}
      {message && (
        <Alert severity={message.startsWith('✅') ? 'success' : 'warning'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Actions */}
      <Stack direction="row" spacing={1.5}>
        <Button variant="contained" fullWidth onClick={handleVerify} disabled={!isComplete}>
          Verify OTP
        </Button>
        <Button variant="outlined" onClick={handleReset} sx={{ whiteSpace: 'nowrap' }}>
          Reset
        </Button>
      </Stack>
    </Paper>
  );
}

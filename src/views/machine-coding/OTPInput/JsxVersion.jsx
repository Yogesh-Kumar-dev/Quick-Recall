'use client';
/**
 * OTP INPUT — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 */
import { useState, useRef } from 'react';

const OTP_LENGTH = 6;

export default function OTPInput() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [message, setMessage] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value && !/^[0-9]$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setMessage('');
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) return;
      if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setMessage(`error:Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setMessage(`success:OTP verified: ${code} ✅`);
  };

  const handleReset = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setMessage('');
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every((d) => d !== '');
  const msgType = message.startsWith('success:') ? 'success' : 'error';
  const msgText = message.replace(/^(success:|error:)/, '');

  return (
    <div style={{ maxWidth: 420, padding: 24, border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff' }}>
      <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 4px' }}>Enter verification code</p>
      <p style={{ fontSize: 14, color: '#888', margin: '0 0 20px' }}>We sent a 6-digit code to your phone.</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, justifyContent: 'center' }}>
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            style={{
              width: 48,
              height: 52,
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 700,
              border: `2px solid ${digit ? '#1976d2' : '#ccc'}`,
              borderRadius: 8,
              outline: 'none',
              transition: 'border-color 0.15s'
            }}
          />
        ))}
      </div>

      {msgText && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 14,
            background: msgType === 'success' ? '#e8f5e9' : '#fff8e1',
            color: msgType === 'success' ? '#2e7d32' : '#f57f17',
            border: `1px solid ${msgType === 'success' ? '#c8e6c9' : '#ffe082'}`
          }}
        >
          {msgText}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={handleVerify}
          disabled={!isComplete}
          style={{
            flex: 1,
            padding: '10px 0',
            background: isComplete ? '#1976d2' : '#e0e0e0',
            color: isComplete ? '#fff' : '#aaa',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            cursor: isComplete ? 'pointer' : 'not-allowed',
            fontWeight: 600
          }}
        >
          Verify OTP
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '10px 16px',
            background: 'transparent',
            border: '1px solid #ccc',
            borderRadius: 6,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

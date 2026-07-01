'use client';
/**
 * MULTI-STEP FORM — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Zero MUI. CSS progress bar via width percentage on an inner div.
 * Same flat-state + per-step validation pattern.
 */
import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
}

const INITIAL_DATA: FormData = { firstName: '', lastName: '', email: '', phone: '', role: '', experience: '' };

const STEPS = [
  { title: 'Personal Info', subtitle: 'Tell us about yourself', validate: (d: FormData) => d.firstName.trim() && d.lastName.trim() },
  { title: 'Contact Details', subtitle: 'How can we reach you?', validate: (d: FormData) => d.email.trim() && d.phone.trim() },
  { title: 'Role & Experience', subtitle: "What's your background?", validate: (d: FormData) => d.role && d.experience },
  { title: 'Review & Submit', subtitle: 'Confirm your information', validate: () => true }
];

const ROLES = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Designer', 'Product Manager', 'DevOps'];
const EXP = ['0–1 years', '1–3 years', '3–5 years', '5–10 years', '10+ years'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: 14,
  marginBottom: 12,
  boxSizing: 'border-box',
  outline: 'none'
};

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, color: '#555', marginBottom: 4, fontWeight: 500 };

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const TOTAL_STEPS = STEPS.length;
  // Derived: percentage complete. 25% → 50% → 75% → 100%
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const isValid = STEPS[currentStep].validate(formData);

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const next = () => setCurrentStep((s) => s + 1);
  const back = () => setCurrentStep((s) => s - 1);
  const submit = () => setSubmitted(true);
  const reset = () => {
    setFormData(INITIAL_DATA);
    setCurrentStep(0);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 440, padding: 24, border: '1px solid #e0e0e0', borderRadius: 10, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
        <p style={{ fontWeight: 700, fontSize: 18, margin: '0 0 6px' }}>Application Submitted!</p>
        <p style={{ color: '#888', fontSize: 14, margin: '0 0 20px' }}>
          Thanks, {formData.firstName}! We&apos;ll reach you at {formData.email}.
        </p>
        <button onClick={reset} style={{ padding: '8px 20px', border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 440, padding: 24, border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff' }}>
      {/* Progress bar header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#888' }}>
            Step {currentStep + 1} of {TOTAL_STEPS}
          </span>
          <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 700 }}>{Math.round(progress)}%</span>
        </div>

        {/* Progress bar — CSS width trick */}
        <div style={{ height: 8, background: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`, // ← the only thing that changes
              background: '#1976d2',
              borderRadius: 4,
              transition: 'width 0.3s ease' // smooth animation
            }}
          />
        </div>

        {/* Step labels */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: '3px 0',
                textAlign: 'center',
                fontSize: 11,
                borderRadius: 10,
                background: i === currentStep ? '#1976d2' : i < currentStep ? '#4caf50' : '#f0f0f0',
                color: i <= currentStep ? '#fff' : '#888'
              }}
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0 0 16px' }} />

      <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>{STEPS[currentStep].title}</p>
      <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>{STEPS[currentStep].subtitle}</p>

      {/* Step 0 */}
      {currentStep === 0 && (
        <div>
          <label style={labelStyle}>First Name *</label>
          <input style={inputStyle} value={formData.firstName} onChange={handleChange('firstName')} placeholder="John" />
          <label style={labelStyle}>Last Name *</label>
          <input style={inputStyle} value={formData.lastName} onChange={handleChange('lastName')} placeholder="Doe" />
        </div>
      )}

      {/* Step 1 */}
      {currentStep === 1 && (
        <div>
          <label style={labelStyle}>Email *</label>
          <input style={inputStyle} type="email" value={formData.email} onChange={handleChange('email')} placeholder="john@example.com" />
          <label style={labelStyle}>Phone *</label>
          <input style={inputStyle} type="tel" value={formData.phone} onChange={handleChange('phone')} placeholder="+91 9876543210" />
        </div>
      )}

      {/* Step 2 */}
      {currentStep === 2 && (
        <div>
          <label style={labelStyle}>Job Role *</label>
          <select style={{ ...inputStyle, appearance: 'auto' }} value={formData.role} onChange={handleChange('role')}>
            <option value="">Select role...</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <label style={labelStyle}>Years of Experience *</label>
          <select style={{ ...inputStyle, appearance: 'auto' }} value={formData.experience} onChange={handleChange('experience')}>
            <option value="">Select experience...</option>
            {EXP.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <div>
          {[
            ['Full Name', `${formData.firstName} ${formData.lastName}`],
            ['Email', formData.email],
            ['Phone', formData.phone],
            ['Role', formData.role],
            ['Experience', formData.experience]
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: '#f9f9f9',
                borderRadius: 6,
                marginBottom: 8
              }}
            >
              <span style={{ fontSize: 13, color: '#888' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{value || '—'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button
          onClick={back}
          disabled={currentStep === 0}
          style={{
            padding: '8px 18px',
            border: '1px solid #ccc',
            borderRadius: 6,
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 0 ? 0.4 : 1,
            fontSize: 14,
            background: 'transparent'
          }}
        >
          ← Back
        </button>

        {currentStep < TOTAL_STEPS - 1 ? (
          <button
            onClick={next}
            disabled={!isValid}
            style={{
              padding: '8px 18px',
              background: isValid ? '#1976d2' : '#e0e0e0',
              color: isValid ? '#fff' : '#aaa',
              border: 'none',
              borderRadius: 6,
              cursor: isValid ? 'pointer' : 'not-allowed',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={submit}
            style={{
              padding: '8px 18px',
              background: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Submit ✓
          </button>
        )}
      </div>
    </div>
  );
}

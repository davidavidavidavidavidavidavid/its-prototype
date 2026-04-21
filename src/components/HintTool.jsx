import { useState } from 'react';
import Fiona from './Fiona';

function buildHints(dividend, divisor) {
  const chunk = Math.floor(dividend / (divisor * 10)) * 10;
  const remainder = dividend - chunk * divisor;
  const remainderPerGroup = remainder / divisor;
  return [
    {
      step: 1,
      question: `If we put ${chunk} in each of the ${divisor} groups, how many cubes does that use up?`,
      hint: `Think: ${divisor} groups × ${chunk} each = ?`,
    },
    {
      step: 2,
      question: `We used ${chunk * divisor} cubes. How many are left out of ${dividend}?`,
      hint: `${dividend} − ${chunk * divisor} = ?`,
    },
    {
      step: 3,
      question: `We've got ${remainder} left. How many does each of the ${divisor} groups get from those?`,
      hint: `${remainder} shared equally among ${divisor} groups = ?`,
    },
  ];
}

export default function HintTool({ dividend, divisor, answer, onClose }) {
  const [step, setStep] = useState(0);
  const hints = buildHints(dividend, divisor);
  const current = hints[step];

  return (
    <div
      style={{
        background: 'var(--purple-bg)',
        border: '1.5px solid var(--purple-border)',
        borderRadius: 'var(--radius-panel)',
        padding: '16px',
        marginTop: 10,
      }}
    >
      <div className="flex items-start gap-3" style={{ marginBottom: 12 }}>
        <Fiona pose="gesturing" height={64} />
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--purple-dark)',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              margin: '0 0 4px',
            }}
          >
            Hint {step + 1} of {hints.length}
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
            {current.question}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '6px 0 0', fontStyle: 'italic' }}>
            {current.hint}
          </p>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
        {hints.map((_, i) => (
          <span
            key={i}
            className={`pip ${i <= step ? 'pip-purple' : 'pip-empty'}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            className="btn-outline"
            style={{ padding: '6px 14px', fontSize: 13 }}
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            ← Back
          </button>
          {step < hints.length - 1 && (
            <button
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: 13 }}
              onClick={() => setStep((s) => s + 1)}
            >
              Next →
            </button>
          )}
        </div>
        <button
          className="btn-outline"
          style={{ padding: '6px 14px', fontSize: 13 }}
          onClick={onClose}
        >
          Got it — I'll try
        </button>
      </div>
    </div>
  );
}

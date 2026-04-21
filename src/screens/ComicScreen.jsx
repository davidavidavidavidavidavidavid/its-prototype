import { useState } from 'react';
import Fiona from '../components/Fiona';
import { BlockDisplay } from '../components/Blocks';

// 4-step sequence for 48 ÷ 3
const STEPS = [
  {
    id: 1,
    caption: '48 TO DIVIDE — 3 EQUAL GROUPS',
    fionaBubble: 'We have 48 to divide into 3 equal groups. Can we give each group 10 to start?',
    panelQuestion: 'We have 48 to divide into 3 equal groups. If we give each group 10 first, do we have enough?',
    type: 'yesno',
    correct: 'yes',
    nudge: '3 groups × 10 = 30. We have 48 to start — is 48 enough to give 10 to each group?',
    visual: () => (
      <div className="flex flex-col items-center gap-4">
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px', textAlign: 'center' }}>48 to share</p>
          <BlockDisplay tens={4} ones={8} />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((g) => (
            <div key={g} style={{
              width: 64, height: 64,
              border: '2px dashed #afa9ec', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#aaa', background: '#f8f8ff',
            }}>
              Group {g}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    caption: '1 ROD IN EACH GROUP — 18 LEFT',
    fionaBubble: 'Good — 3 groups of 10 uses 30. How many still need to be divided?',
    panelQuestion: 'Each group gets 10. That uses 3 × 10 = 30. How many are still to be divided?',
    type: 'number',
    correct: 18,
    nudge: '48 total − 30 placed = ? still waiting to be shared.',
    visual: () => (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3">
          {[1, 2, 3].map((g) => (
            <div key={g} style={{
              background: '#eeedfe', border: '2px solid #afa9ec',
              borderRadius: 8, padding: 8,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <BlockDisplay tens={1} ones={0} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)' }}>10</span>
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px', textAlign: 'center' }}>Still to divide</p>
          <BlockDisplay tens={1} ones={8} />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    caption: '18 LEFT — 18 ÷ 3',
    fionaBubble: '18 left. 18 ÷ 3 — how many does each group get?',
    panelQuestion: '18 still need to be divided equally between 3 groups. How many does each group get?',
    type: 'number',
    correct: 6,
    nudge: 'Try splitting those 18 ones into 3 equal piles. How many in each pile?',
    visual: () => (
      <div className="flex flex-col items-center gap-4">
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px', textAlign: 'center' }}>18 ones to share between 3 groups</p>
          <BlockDisplay tens={0} ones={18} />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((g) => (
            <div key={g} style={{
              background: '#eeedfe', border: '2px dashed #afa9ec',
              borderRadius: 8, padding: '8px 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              minWidth: 52,
            }}>
              <BlockDisplay tens={1} ones={0} />
              <span style={{ fontSize: 10, color: '#afa9ec', fontStyle: 'italic' }}>+?</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4,
    caption: 'EACH GROUP: 10 + 6 = 16',
    fionaBubble: 'Each group got 10, then 6 more. How many are in each group?',
    panelQuestion: 'Each group got 10 first, then 6 more. How many are in each group?',
    type: 'number',
    correct: 16,
    nudge: "10 from the first round, 6 from the second. What's 10 + 6?",
    visual: () => (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3">
          {[1, 2, 3].map((g) => (
            <div key={g} style={{
              background: 'var(--teal-bg)', border: '2px solid var(--teal-border)',
              borderRadius: 8, padding: 8,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <BlockDisplay tens={1} ones={6} tealWrap={false} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal-dark)' }}>10+6</span>
            </div>
          ))}
        </div>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)',
          borderRadius: 8, padding: '6px 16px', fontSize: 13, color: 'var(--text-muted)',
        }}>
          10 + 6 = <strong style={{ color: 'var(--navy)' }}>?</strong>
        </div>
      </div>
    ),
  },
];

function YesNoButtons({ onAnswer, disabled }) {
  return (
    <div className="flex gap-3">
      <button className="btn-primary" style={{ minWidth: 80 }} disabled={disabled} onClick={() => onAnswer('yes')}>Yes</button>
      <button className="btn-outline"  style={{ minWidth: 80 }} disabled={disabled} onClick={() => onAnswer('no')}>No</button>
    </div>
  );
}

function NumberInput({ value, onChange, onSubmit, hasError, disabled }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        className={`answer-input${hasError ? ' error' : ''}`}
        style={{ width: 80 }}
        placeholder="?"
        disabled={disabled}
        autoFocus
      />
      <button className="btn-primary" onClick={onSubmit} disabled={!value || disabled}>Check</button>
    </div>
  );
}

export default function ComicScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [numberVal, setNumberVal] = useState('');
  const [answered, setAnswered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [nudge, setNudge] = useState(null);

  const current = STEPS[step];

  function handleAnswer(answer) {
    const correct =
      current.type === 'yesno'
        ? answer === current.correct
        : parseInt(answer, 10) === current.correct;
    if (correct) {
      setAnswered(true); setHasError(false); setNudge(null);
    } else {
      setHasError(true); setNudge(current.nudge);
    }
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      setAnswered(false); setHasError(false); setNudge(null); setNumberVal('');
    } else {
      onComplete();
    }
  }

  const fionaPose = answered ? 'happy' : hasError ? 'neutral-2' : step % 2 === 0 ? 'neutral' : 'gesturing';
  const bubbleText = nudge || current.fionaBubble;

  return (
    <div className="with-fiona" style={{ minHeight: '100vh' }}>

      {/* ── Left column: Fiona ── */}
      <div style={{
        background: 'var(--bg-fiona-panel)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '28px 18px',
      }}>
        {/* Badge */}
        <div style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 20, padding: '4px 14px', fontSize: 10, fontWeight: 700,
          color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 20,
        }}>
          Let's learn the strategy
        </div>

        <Fiona pose={fionaPose} height={200} />

        {/* Fiona speech bubble */}
        <div style={{
          background: hasError ? 'var(--coral-bg)' : answered ? 'var(--teal-bg)' : 'white',
          border: `2px solid ${hasError ? 'var(--coral-border)' : answered ? 'var(--teal-border)' : 'var(--bg-card-border)'}`,
          borderRadius: 10, padding: '10px 12px',
          fontSize: 13, lineHeight: 1.45,
          color: hasError ? 'var(--coral-dark)' : answered ? 'var(--teal-dark)' : 'var(--text-primary)',
          marginTop: 14, width: '100%',
          transition: 'background 0.2s, border-color 0.2s',
        }}>
          {bubbleText}
        </div>

        {/* Step dots — bottom of left column */}
        <div className="flex gap-2" style={{ marginTop: 'auto', paddingTop: 20 }}>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`pip ${i < step ? 'pip-green' : i === step ? 'pip-amber' : 'pip-dark'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Right column: visual + question ── */}
      <div style={{
        background: 'var(--bg-outer)', display: 'flex', flexDirection: 'column',
        padding: '28px 32px', gap: 0,
      }}>
        {/* Caption bar */}
        <div style={{
          background: '#fff7e6', border: '1px solid #e8d9b0',
          borderRadius: '8px 8px 0 0', padding: '6px 16px', marginBottom: 0,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--navy)' }}>
            {current.caption}
          </span>
        </div>

        {/* Main panel: visual top, question bottom */}
        <div style={{
          background: 'white', border: '2px solid var(--navy)',
          borderRadius: '0 0 12px 12px', overflow: 'hidden', flex: 1,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Visual area */}
          <div style={{
            flex: 1, padding: 28, background: '#fafafa',
            borderBottom: '2px solid var(--navy)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 200,
          }}>
            {current.visual()}
          </div>

          {/* Question + answer area */}
          <div style={{
            background: 'var(--purple-light)', padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              {current.panelQuestion}
            </p>

            {!answered && (
              <div>
                {current.type === 'yesno'
                  ? <YesNoButtons onAnswer={handleAnswer} disabled={answered} />
                  : <NumberInput value={numberVal} onChange={setNumberVal} onSubmit={() => handleAnswer(numberVal)} hasError={hasError} disabled={answered} />
                }
              </div>
            )}

            {answered && (
              <div style={{
                background: 'var(--teal-bg)', border: '1.5px solid var(--teal-border)',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 13, color: 'var(--teal-dark)', fontWeight: 600,
              }}>
                {step === STEPS.length - 1 ? '48 ÷ 3 = 16 — you chunked it! ✓' : 'Exactly right! ✓'}
              </div>
            )}
          </div>
        </div>

        {/* Next / Start problems button */}
        <div className="flex justify-end" style={{ marginTop: 16 }}>
          {answered && step < STEPS.length - 1 && (
            <button className="btn-primary" onClick={handleNext}>Next →</button>
          )}
          {answered && step === STEPS.length - 1 && (
            <button className="btn-navy" onClick={handleNext}>Start problems →</button>
          )}
        </div>
      </div>
    </div>
  );
}

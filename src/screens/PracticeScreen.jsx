import { useState, useEffect, useRef } from 'react';
import Fiona from '../components/Fiona';
import BlocksManipulative from '../components/BlocksManipulative';
import { useSession, PROBLEMS, SCAFFOLD_PROBLEMS, getMasteryStatus } from '../context/SessionContext';
import { classifyError } from '../lib/errors';
import { generateWordProblem, getFionaFeedback } from '../lib/anthropic';

// Socratic hint for each problem (by problem index)
const HINTS = [
  "You've got 48 and 3 groups — how much could each group take as a first chunk?",
  "You've got 85 and 5 groups — what chunk could you give each group to start?",
  "You've got 72 and 4 groups — how much could each group take first?",
  "You've got 96 and 6 groups — what would be a good first chunk for each group?",
  "You've got 78 and 3 groups — how much could each group take as a first chunk?",
];

function ScoreDots({ results, total = 5 }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const r = results[i];
        if (!r) return <span key={i} className="pip pip-empty" />;
        return <span key={i} className={`pip ${r.correct ? 'pip-green' : 'pip-dark'}`} />;
      })}
    </div>
  );
}

export default function PracticeScreen({ onComplete }) {
  const { state, dispatch } = useSession();
  const [inputVal, setInputVal]       = useState('');
  const [feedback, setFeedback]       = useState(null);
  const [cubesOpen, setCubesOpen]     = useState(false);
  const [hintActive, setHintActive]   = useState(false);
  const [wordProblem, setWordProblem] = useState('');
  const [wordProblemLoading, setWordProblemLoading] = useState(false);
  const [fionaText, setFionaText]     = useState("Let's work through this one together.");
  const [fionaPose, setFionaPose]     = useState('neutral');
  const [attemptContext, setAttemptContext] = useState('first_attempt');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const inputRef = useRef(null);

  const currentProblem = state.scaffoldActive
    ? SCAFFOLD_PROBLEMS[state.scaffoldPosition]
    : PROBLEMS[state.currentProblem];

  const problemIndex = state.currentProblem;

  // Mastery / ceiling check
  useEffect(() => {
    const status = getMasteryStatus(state);
    if (status) {
      const t = setTimeout(() => onComplete(status), 1000);
      return () => clearTimeout(t);
    }
  }, [state.rollingWindow, state.totalAttempted, state.currentProblem]);

  // Reset + load word problem when problem changes
  useEffect(() => {
    if (!currentProblem) return;
    setInputVal('');
    setFeedback(null);
    setCubesOpen(false);
    setHintActive(false);
    setAttemptContext('first_attempt');
    setFionaPose('neutral');
    setFionaText("Let's work through this one together.");
    setWordProblem('');
    setWordProblemLoading(true);
    generateWordProblem(currentProblem.dividend, currentProblem.divisor, currentProblem.answer)
      .then((text) => setWordProblem(text))
      .catch(() => setWordProblem(''))
      .finally(() => setWordProblemLoading(false));
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [problemIndex, state.scaffoldActive, state.scaffoldPosition]);

  async function handleCheck() {
    const val = parseInt(inputVal, 10);
    if (isNaN(val) || !currentProblem) return;

    if (val === currentProblem.answer) {
      setFeedback({ type: 'correct', text: 'Correct!' });
      setFionaPose('happy');
      setFionaText('You got it — exactly right!');
      setHintActive(false);
      dispatch({ type: 'RECORD_CORRECT' });
    } else {
      const errorType = classifyError(
        currentProblem.dividend, currentProblem.divisor,
        currentProblem.answer, val
      );
      setFionaPose('neutral-2');
      setFeedback({ type: 'error', text: '' });
      setFeedbackLoading(true);
      setHintActive(false);
      dispatch({ type: 'RECORD_INCORRECT', errorType });
      try {
        const text = await getFionaFeedback({
          dividend: currentProblem.dividend,
          divisor: currentProblem.divisor,
          answer: currentProblem.answer,
          studentAnswer: val,
          errorType,
          partialCorrect: false,
          context: attemptContext,
        });
        setFionaText(text);
        setFeedback({ type: 'error', text });
      } catch {
        const fallback = "Hmm — what chunk could we start with?";
        setFionaText(fallback);
        setFeedback({ type: 'error', text: fallback });
      } finally {
        setFeedbackLoading(false);
        setAttemptContext('after_hint');
      }
    }
  }

  function handleHintToggle() {
    if (hintActive) {
      setHintActive(false);
      setFionaText("Let's work through this one together.");
      setFionaPose('neutral');
    } else {
      const hintText = HINTS[problemIndex] ?? "What chunk could each group start with?";
      setHintActive(true);
      setFionaText(hintText);
      setFionaPose('gesturing');
      setAttemptContext('after_hint');
    }
  }

  const showScaffold = state.scaffoldActive;

  const leftPips = PROBLEMS.map((_, i) => {
    if (i < problemIndex) return 'green';
    if (i === problemIndex) return 'amber';
    return 'dark';
  });

  // Fiona bubble style: amber when hint active
  const bubbleBg     = hintActive ? 'var(--amber)' : feedbackLoading ? '#f9f8f5' : 'white';
  const bubbleBorder = hintActive ? '#c9a847' : 'var(--bg-card-border)';

  return (
    <div className="with-fiona" style={{ minHeight: '100vh' }}>

      {/* ── Left column: Fiona ── */}
      <div style={{
        background: 'var(--bg-fiona-panel)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '24px 16px', gap: 0,
      }}>
        {/* Badge */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 'var(--radius-badge)',
          padding: '4px 14px', fontSize: 10, fontWeight: 700,
          color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase',
          letterSpacing: '0.07em', marginBottom: 20,
        }}>
          Practice · Division
        </div>

        {/* Fiona */}
        <Fiona pose={fionaPose} height={200} />

        {/* Speech bubble */}
        <div style={{
          background: bubbleBg,
          border: `2px solid ${bubbleBorder}`,
          borderRadius: 10,
          padding: '10px 12px',
          fontSize: 13, lineHeight: 1.45,
          color: hintActive ? 'var(--amber-dark)' : 'var(--text-primary)',
          marginTop: 14,
          marginBottom: 'auto',
          width: '100%',
          transition: 'background 0.2s, border-color 0.2s, color 0.2s',
        }}>
          {feedbackLoading
            ? <span style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>Thinking…</span>
            : fionaText}
        </div>

        {/* Progress pips */}
        <div className="flex gap-2" style={{ marginTop: 18 }}>
          {leftPips.map((pipState, i) => (
            <span key={i} className={`pip pip-${pipState}`} title={`Problem ${i + 1}`} />
          ))}
        </div>
      </div>

      {/* ── Right column: workspace ── */}
      <div style={{ background: 'var(--bg-outer)', padding: '28px 32px', overflowY: 'auto' }}>

        {/* Problem counter + score dots */}
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            {showScaffold ? 'Scaffold practice' : `Problem ${problemIndex + 1} of ${PROBLEMS.length}`}
          </span>
          <ScoreDots results={state.results} />
        </div>

        {/* Word problem box — blue-soft */}
        <div style={{
          background: 'var(--blue-soft)',
          border: '1.5px solid #a3c8e8',
          borderRadius: 'var(--radius-panel)',
          padding: '12px 16px', marginBottom: 18, minHeight: 50,
        }}>
          {wordProblemLoading
            ? <p style={{ fontSize: 13, color: 'var(--blue-dark)', margin: 0, fontStyle: 'italic', opacity: 0.7 }}>Setting the scene…</p>
            : <p style={{ fontSize: 14, color: 'var(--blue-dark)', margin: 0, lineHeight: 1.5 }}>{wordProblem || '\u00A0'}</p>
          }
        </div>

        {/* Problem display */}
        <div className="flex items-center gap-4" style={{
          marginBottom: 18, padding: '18px 20px',
          background: 'var(--bg-card)', borderRadius: 'var(--radius-panel)',
          border: '1.5px solid var(--bg-card-border)',
        }}>
          <span style={{ fontSize: 40, fontWeight: 700, color: 'var(--navy)', letterSpacing: '-1px' }}>
            {currentProblem?.dividend} ÷ {currentProblem?.divisor} =
          </span>
          <input
            ref={inputRef}
            type="number"
            value={inputVal}
            onChange={(e) => { setInputVal(e.target.value); if (feedback?.type === 'error') setFeedback(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            className={`answer-input ${feedback?.type === 'error' ? 'error' : ''} ${feedback?.type === 'correct' ? 'correct' : ''}`}
            placeholder="?"
            disabled={feedback?.type === 'correct'}
          />
        </div>

        {/* Feedback box */}
        {feedback && (
          <div style={{
            background: feedback.type === 'correct' ? 'var(--teal-bg)' : 'var(--coral-bg)',
            border: `1.5px solid ${feedback.type === 'correct' ? 'var(--teal-border)' : 'var(--coral-border)'}`,
            borderRadius: 'var(--radius-panel)', padding: '12px 16px', marginBottom: 14,
          }}>
            {feedbackLoading
              ? <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>Fiona is thinking…</p>
              : <p style={{ fontSize: 14, color: feedback.type === 'correct' ? 'var(--teal-dark)' : 'var(--coral-dark)', margin: 0, lineHeight: 1.5 }}>{feedback.text}</p>
            }
          </div>
        )}

        {/* Scaffold notice */}
        {showScaffold && (
          <div style={{
            background: 'var(--amber)', border: '1.5px solid #c9a847',
            borderRadius: 'var(--radius-panel)', padding: '10px 14px',
            marginBottom: 14, fontSize: 13, color: 'var(--amber-dark)',
          }}>
            Let's try a simpler one first to warm up the strategy.
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          <button
            className="btn-outline"
            style={{
              fontSize: 13, padding: '7px 14px',
              background: hintActive ? 'var(--amber)' : undefined,
              borderColor: hintActive ? '#c9a847' : undefined,
              color: hintActive ? 'var(--amber-dark)' : undefined,
            }}
            onClick={handleHintToggle}
          >
            💡 {hintActive ? 'Hide hint' : 'Hint'}
          </button>
          <button
            className="btn-outline"
            style={{
              fontSize: 13, padding: '7px 14px',
              background: cubesOpen ? 'var(--blue-soft)' : undefined,
              borderColor: cubesOpen ? '#a3c8e8' : undefined,
            }}
            onClick={() => setCubesOpen((o) => !o)}
          >
            🧱 {cubesOpen ? 'Hide blocks' : 'Use blocks'}
          </button>
          {showScaffold && (
            <button
              className="btn-outline"
              style={{ fontSize: 13, padding: '7px 14px', color: 'var(--amber-dark)', borderColor: '#c9a847' }}
              onClick={() => dispatch({ type: 'ADVANCE_SCAFFOLD' })}
            >
              Easier problems →
            </button>
          )}
        </div>

        {/* Blocks manipulative */}
        {cubesOpen && currentProblem && (
          <BlocksManipulative
            dividend={currentProblem.dividend}
            divisor={currentProblem.divisor}
            answer={currentProblem.answer}
            onClose={() => setCubesOpen(false)}
            onSuccess={() => {
              setCubesOpen(false);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          />
        )}

        {/* Check answer button */}
        {feedback?.type !== 'correct' && (
          <div className="flex justify-end" style={{ marginTop: 16 }}>
            <button
              className="btn-primary"
              onClick={handleCheck}
              disabled={!inputVal || feedbackLoading}
            >
              Check answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

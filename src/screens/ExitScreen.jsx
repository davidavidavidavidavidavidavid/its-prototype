import Fiona from '../components/Fiona';
import { useSession } from '../context/SessionContext';

export default function ExitScreen({ outcome, onDone }) {
  const { state } = useSession();
  const isMastery = outcome === 'mastery';

  const correctCount = state.results.filter((r) => r.correct).length;
  const totalCount = Math.min(state.results.length, 5);

  const headerBg = isMastery ? '#1a2e20' : 'var(--bg-fiona-panel)';

  const scoreStripBg     = isMastery ? 'var(--green-soft)' : 'var(--amber)';
  const scoreStripBorder = isMastery ? '#7ebd68' : '#c9a847';
  const scoreStripColor  = isMastery ? 'var(--green-dark)' : 'var(--amber-dark)';
  const scoreLabel = 'TODAY\'S SESSION';
  const scoreText = isMastery
    ? `${correctCount} out of ${totalCount} — you've got this standard.`
    : `${correctCount} out of ${totalCount}. Keep practising — you're building the foundations.`;

  const headline  = isMastery ? 'You got it.' : 'Good work today, mathematician.';
  const bodyText  = isMastery
    ? "Working through division like that takes real thinking. The strategy of breaking numbers into chunks — that's one you'll keep using."
    : "Division with bigger numbers is genuinely hard. You worked through some tricky problems — that counts. Come back to this one and it'll start to click.";
  const bubbleText = isMastery
    ? 'That chunking strategy is yours now.'
    : "This one needs a bit more time. That's fine.";

  const bubbleBg     = isMastery ? 'var(--teal-bg)' : 'white';
  const bubbleBorder = isMastery ? 'var(--teal-border)' : 'var(--navy)';

  return (
    <div
      style={{ background: 'var(--bg-outer)', minHeight: '100vh' }}
      className="flex items-center justify-center p-6"
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-card)',
          maxWidth: 520,
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        {/* Header */}
        <div
          style={{ background: headerBg, padding: '24px 24px 20px' }}
          className="flex items-end gap-4"
        >
          <Fiona pose={isMastery ? 'happy' : 'neutral'} height={130} />
          <div style={{ flex: 1 }}>
            <div
              className="speech-bubble"
              style={{
                background: bubbleBg,
                borderColor: bubbleBorder,
                fontSize: 14,
                lineHeight: 1.45,
                color: 'var(--text-primary)',
              }}
            >
              {bubbleText}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)', margin: '0 0 10px' }}>
            {headline}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
            {bodyText}
          </p>

          {/* Score strip */}
          <div
            style={{
              background: scoreStripBg,
              border: `1.5px solid ${scoreStripBorder}`,
              borderRadius: 10,
              padding: '14px 16px',
              marginBottom: 22,
            }}
          >
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: scoreStripColor, margin: '0 0 8px',
            }}>
              {scoreLabel}
            </p>
            <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const result = state.results[i];
                let pipClass = 'pip pip-empty';
                if (result) pipClass = result.correct ? 'pip pip-green' : 'pip pip-dark';
                return <span key={i} className={pipClass} />;
              })}
            </div>
            <p style={{ fontSize: 13, color: scoreStripColor, margin: 0, lineHeight: 1.4 }}>
              {scoreText}
            </p>
          </div>

          <button className="btn-navy" style={{ width: '100%' }} onClick={onDone}>
            {isMastery ? 'Done for now' : 'Back to the Academy'}
          </button>
        </div>
      </div>
    </div>
  );
}

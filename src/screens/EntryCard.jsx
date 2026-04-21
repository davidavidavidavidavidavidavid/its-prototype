import Fiona from '../components/Fiona';

export default function EntryCard({ onStart }) {
  return (
    <div
      style={{ background: 'var(--bg-outer)', minHeight: '100vh' }}
      className="flex items-center justify-center p-6"
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-card)',
          maxWidth: 480,
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        {/* Top section — Fiona panel */}
        <div
          style={{ background: 'var(--bg-fiona-panel)', padding: '24px 24px 28px' }}
          className="flex items-end gap-4"
        >
          <Fiona pose="neutral" height={120} />
          <div style={{ flex: 1 }}>
            <div className="speech-bubble" style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--text-primary)' }}>
              I've got something for us to work on.
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 24px 24px' }}>
          {/* Tag pill */}
          <div style={{ marginBottom: 14 }}>
            <span style={{
              background: 'var(--purple-light)',
              border: '1px solid var(--purple-border)',
              color: 'var(--purple)',
              borderRadius: 'var(--radius-badge)',
              fontSize: 11, fontWeight: 600,
              padding: '3px 10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Extra practice · Division
            </span>
          </div>

          {/* Topic */}
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)', margin: '0 0 2px' }}>
              Dividing bigger numbers
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              Beyond the times table · Grade 3
            </p>
          </div>

          {/* Three chips */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: 22 }}>
            <div style={{
              flex: 1, background: '#ffe6ad', color: '#7a5200',
              borderRadius: '10px', padding: '10px',
              fontSize: '12px', fontWeight: 500, textAlign: 'center',
            }}>
              A short story to work through
            </div>
            <div style={{
              flex: 1, background: '#d3e7f6', color: '#1a4a6e',
              borderRadius: '10px', padding: '10px',
              fontSize: '12px', fontWeight: 500, textAlign: 'center',
            }}>
              Some problems to solve
            </div>
            <div style={{
              flex: 1, background: '#cde5b8', color: '#2a5c1a',
              borderRadius: '10px', padding: '10px',
              fontSize: '12px', fontWeight: 500, textAlign: 'center',
            }}>
              Fiona to help if you get stuck
            </div>
          </div>

          {/* CTA */}
          <button
            className="btn-navy"
            style={{ width: '100%', fontSize: 16, padding: '14px 28px' }}
            onClick={onStart}
          >
            Let's go
          </button>
        </div>
      </div>
    </div>
  );
}

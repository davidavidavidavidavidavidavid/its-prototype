import { useState } from 'react';

export default function CubesTool({ dividend, divisor, answer, onClose }) {
  const [groups, setGroups] = useState(Array(divisor).fill(0));
  const [selected, setSelected] = useState(null); // index of selected supply cube
  const [supply, setSupply] = useState(dividend);
  const [success, setSuccess] = useState(false);

  const totalPlaced = groups.reduce((a, b) => a + b, 0);

  function handleSupplyClick() {
    if (supply <= 0 || success) return;
    setSelected((s) => (s === 'supply' ? null : 'supply'));
  }

  function handleGroupClick(groupIdx) {
    if (success) return;
    if (selected === 'supply' && supply > 0) {
      const newGroups = [...groups];
      newGroups[groupIdx] += 1;
      const newSupply = supply - 1;
      setGroups(newGroups);
      setSupply(newSupply);
      setSelected(null);
      // check success: all groups equal answer and supply empty
      if (newGroups.every((g) => g === answer) && newSupply === 0) {
        setSuccess(true);
      }
    }
  }

  function handleReset() {
    setGroups(Array(divisor).fill(0));
    setSupply(dividend);
    setSelected(null);
    setSuccess(false);
  }

  const groupColors = ['#e8e4ff', '#ffe8e4', '#e4ffe8'];

  return (
    <div
      style={{
        background: 'var(--teal-bg)',
        border: '1.5px solid var(--teal-border)',
        borderRadius: 'var(--radius-panel)',
        padding: '16px',
        marginTop: 10,
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--teal-dark)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          margin: '0 0 12px',
        }}
      >
        Cubes — {dividend} ÷ {divisor}
      </p>

      {success ? (
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal-dark)', margin: '0 0 8px' }}>
            Each group has {answer}!
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px' }}>
            {dividend} ÷ {divisor} = {answer}
          </p>
          <button className="btn-outline" style={{ fontSize: 13 }} onClick={onClose}>
            Got it — I'll try
          </button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 12, color: 'var(--teal-dark)', margin: '0 0 12px' }}>
            Click a cube from the supply, then click a group to place it.
          </p>

          {/* Supply area */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 6px', fontWeight: 600 }}>
              Supply ({supply} left)
            </p>
            <div className="flex flex-wrap gap-1" style={{ minHeight: 32 }}>
              {Array.from({ length: supply }).map((_, i) => (
                <button
                  key={i}
                  onClick={handleSupplyClick}
                  title="Click to pick up a cube"
                  style={{
                    width: 24,
                    height: 24,
                    background: selected === 'supply' && i === 0 ? 'var(--purple-mid)' : 'var(--navy)',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    transform: selected === 'supply' && i === 0 ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
              {supply === 0 && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  All cubes placed
                </span>
              )}
            </div>
          </div>

          {/* Group zones */}
          <div className="flex gap-3" style={{ marginBottom: 12 }}>
            {groups.map((count, gi) => (
              <div
                key={gi}
                onClick={() => handleGroupClick(gi)}
                style={{
                  flex: 1,
                  minHeight: 80,
                  background: groupColors[gi % groupColors.length],
                  border: `2px solid ${selected === 'supply' ? 'var(--purple-mid)' : '#ccc'}`,
                  borderRadius: 8,
                  padding: 8,
                  cursor: selected === 'supply' ? 'pointer' : 'default',
                  transition: 'border-color 0.15s',
                }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', margin: '0 0 6px' }}>
                  Group {gi + 1}
                </p>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: count }).map((_, ci) => (
                    <div
                      key={ci}
                      style={{
                        width: 18,
                        height: 18,
                        background: 'var(--navy)',
                        borderRadius: 3,
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', margin: '6px 0 0', textAlign: 'right' }}>
                  {count}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button className="btn-outline" style={{ fontSize: 12, padding: '5px 12px' }} onClick={handleReset}>
              Reset
            </button>
            <button className="btn-outline" style={{ fontSize: 12, padding: '5px 12px' }} onClick={onClose}>
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}

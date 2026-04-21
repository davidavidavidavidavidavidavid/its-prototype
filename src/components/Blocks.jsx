// Shared base-10 block visual components.
// TensRod and OnesUnit use identical cell dimensions (16×16px, 1px gap)
// so splitting a rod produces no layout jump — only colour/wrapper changes.

export function TensRod({ selected, onDragStart, onClick, style = {} }) {
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onClick}
      title="Click to split into 10 ones"
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 1,
        border: `2px solid ${selected ? '#534AB7' : '#afa9ec'}`,
        background: '#eeedfe',
        borderRadius: 4,
        padding: 3,
        cursor: onDragStart ? 'grab' : onClick ? 'pointer' : 'default',
        boxShadow: selected ? '0 0 0 2px #7f77dd' : 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            background: '#7f77dd',
            borderTop: i > 0 ? '1px solid rgba(255,255,255,0.4)' : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function OnesUnit({ selected, onDragStart, onClick, ghost = false, style = {} }) {
  if (ghost) {
    return (
      <div style={{
        width: 16, height: 16,
        border: '1px dashed #c5c2ba',
        borderRadius: 2,
        background: 'transparent',
        ...style,
      }} />
    );
  }
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        width: 16,
        height: 16,
        background: selected ? '#c0643a' : '#f0997b',
        borderRadius: 2,
        cursor: onDragStart ? 'grab' : onClick ? 'pointer' : 'default',
        outline: selected ? '2px solid #534AB7' : 'none',
        outlineOffset: 1,
        userSelect: 'none',
        ...style,
      }}
    />
  );
}

// Static display of N tens + M ones (no interaction, for comic panels)
export function BlockDisplay({ tens, ones, tealWrap = false }) {
  const wrapStyle = tealWrap
    ? { background: 'var(--teal-bg)', border: '2px solid var(--teal-border)', borderRadius: 8, padding: 8 }
    : {};

  return (
    <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-start', ...wrapStyle }}>
      {Array.from({ length: tens }).map((_, i) => (
        <TensRod key={`rod-${i}`} />
      ))}
      {Array.from({ length: ones }).map((_, i) => (
        <OnesUnit key={`one-${i}`} />
      ))}
    </div>
  );
}

// A supply column: either a rod, or a stack of units+ghosts up to 10 rows
export function SupplyColumn({ rod, units }) {
  if (rod) return <TensRod {...rod} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from({ length: 10 }).map((_, row) => {
        const u = units.find((u) => u.row === row);
        if (u) return <OnesUnit key={row} {...u} />;
        return <OnesUnit key={row} ghost />;
      })}
    </div>
  );
}

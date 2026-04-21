import { useState, useRef, useCallback } from 'react';
import { TensRod, OnesUnit } from './Blocks';

let _nextId = 100;
function nextId() { return _nextId++; }

function initPieces(dividend) {
  const rods  = Math.floor(dividend / 10);
  const units = dividend % 10;
  const pieces = [];
  for (let c = 0; c < rods; c++) {
    pieces.push({ id: nextId(), type: 'rod', val: 10, loc: 'supply', col: c, row: 0 });
  }
  for (let c = 0; c < units; c++) {
    pieces.push({ id: nextId(), type: 'unit', val: 1, loc: 'supply', col: rods + c, row: 0 });
  }
  return pieces;
}

function groupCount(pieces, g) {
  return pieces
    .filter((p) => p.loc === `group_${g}`)
    .reduce((a, p) => a + p.val, 0);
}

export default function BlocksManipulative({ dividend, divisor, answer, onClose, onSuccess }) {
  const [pieces, setPieces] = useState(() => initPieces(dividend));
  const [splitPopover, setSplitPopover] = useState(null); // { id, x, y }
  const [selected, setSelected] = useState(new Set());
  const [dragOver, setDragOver] = useState(null); // 'supply' | 'group_0' etc.
  const dragIdsRef = useRef([]);

  const counts = [0, 1, 2].map((g) => groupCount(pieces, g));
  const allCorrect = counts.every((c) => c === answer);
  const allPlaced  = pieces.every((p) => p.loc !== 'supply');
  const success    = allCorrect && allPlaced;

  // --- Selection ---
  function toggleSelect(e, id) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.stopPropagation();
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function clearSelection() { setSelected(new Set()); }

  // --- Drag ---
  function handleDragStart(e, piece) {
    const ids = selected.has(piece.id) ? [...selected] : [piece.id];
    dragIdsRef.current = ids;
    e.dataTransfer.setData('text/plain', JSON.stringify(ids));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDrop(e, loc) {
    e.preventDefault();
    setDragOver(null);
    let ids;
    try { ids = JSON.parse(e.dataTransfer.getData('text/plain')); } catch { return; }
    setPieces((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, loc } : p));
    setSelected(new Set());
  }

  function handleDropToSupply(e) { handleDrop(e, 'supply'); }

  // --- Split ---
  function handleRodClick(e, piece) {
    if (e.ctrlKey || e.metaKey) { toggleSelect(e, piece.id); return; }
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setSplitPopover({ id: piece.id, x: rect.right + 6, y: rect.top });
  }

  function doSplit(rodId) {
    const rod = pieces.find((p) => p.id === rodId);
    if (!rod) return;
    const newUnits = Array.from({ length: 10 }, (_, i) => ({
      id: nextId(), type: 'unit', val: 1,
      loc: rod.loc, col: rod.col, row: i,
    }));
    setPieces((prev) => [...prev.filter((p) => p.id !== rodId), ...newUnits]);
    setSplitPopover(null);
  }

  // --- Group into rod (multi-select, value = 10) ---
  const selPieces = pieces.filter((p) => selected.has(p.id));
  const selVal    = selPieces.reduce((a, p) => a + p.val, 0);
  const canGroup  = selPieces.length > 0 && selVal === 10 && selPieces.every((p) => p.type === 'unit') && selPieces.every((p) => p.loc === selPieces[0].loc);

  function doGroupIntoRod() {
    const loc = selPieces[0].loc;
    const col = selPieces[0].col;
    const rod = { id: nextId(), type: 'rod', val: 10, loc, col, row: 0 };
    setPieces((prev) => [...prev.filter((p) => !selected.has(p.id)), rod]);
    setSelected(new Set());
  }

  // --- Reset ---
  function handleReset() {
    _nextId = 100;
    setPieces(initPieces(dividend));
    setSelected(new Set());
    setSplitPopover(null);
  }

  // --- Supply rendering ---
  const supplyPieces = pieces.filter((p) => p.loc === 'supply');
  const maxCol = supplyPieces.reduce((m, p) => Math.max(m, p.col), -1);
  const numSupplyCols = maxCol + 1;

  function renderSupplyCol(col) {
    const rod = supplyPieces.find((p) => p.col === col && p.type === 'rod');
    if (rod) {
      return (
        <TensRod
          key={rod.id}
          selected={selected.has(rod.id)}
          onDragStart={(e) => handleDragStart(e, rod)}
          onClick={(e) => handleRodClick(e, rod)}
        />
      );
    }
    const colUnits = supplyPieces.filter((p) => p.col === col && p.type === 'unit');
    return (
      <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Array.from({ length: 10 }).map((_, row) => {
          const u = colUnits.find((p) => p.row === row);
          if (u) {
            return (
              <OnesUnit
                key={u.id}
                selected={selected.has(u.id)}
                onDragStart={(e) => handleDragStart(e, u)}
                onClick={(e) => toggleSelect(e, u.id)}
              />
            );
          }
          return <OnesUnit key={row} ghost />;
        })}
      </div>
    );
  }

  const groupColors = ['#f0f0fa', '#f0faf4', '#faf4f0'];

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1.5px solid var(--bg-card-border)`,
        borderRadius: 'var(--radius-panel)',
        padding: 16,
        marginTop: 10,
        position: 'relative',
      }}
      onClick={() => { clearSelection(); setSplitPopover(null); }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue-dark)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
          Base-10 blocks — {dividend} ÷ {divisor}
        </p>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
              {selected.size} selected (value: {selVal})
            </span>
          )}
          {canGroup && (
            <button className="btn-outline" style={{ fontSize: 11, padding: '3px 10px' }} onClick={(e) => { e.stopPropagation(); doGroupIntoRod(); }}>
              Group into rod
            </button>
          )}
          <button className="btn-outline" style={{ fontSize: 11, padding: '3px 10px' }} onClick={(e) => { e.stopPropagation(); handleReset(); }}>
            Reset
          </button>
          <button className="btn-outline" style={{ fontSize: 11, padding: '3px 10px' }} onClick={(e) => { e.stopPropagation(); onClose(); }}>
            Close
          </button>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 10px' }}>
        Drag blocks into groups. Click a rod to split it into 10 ones. Ctrl+click to multi-select.
      </p>

      {success ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-dark)', margin: '0 0 4px' }}>
            {divisor} equal groups of {answer}!
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 14px' }}>
            {dividend} ÷ {divisor} = {answer}
          </p>
          <button
            className="btn-navy"
            style={{ fontSize: 13, padding: '8px 18px' }}
            onClick={(e) => { e.stopPropagation(); if (onSuccess) onSuccess(); else onClose(); }}
          >
            I've got it — let me type my answer
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Supply area */}
          <div style={{ minWidth: 120 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
              Supply
            </p>
            <div
              style={{
                minHeight: 180,
                background: '#f5f3ef',
                border: '1.5px dashed #d3d1c7',
                borderRadius: 8,
                padding: 8,
                display: 'flex',
                gap: 4,
                alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver('supply'); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={handleDropToSupply}
            >
              {numSupplyCols === 0 ? (
                <p style={{ fontSize: 11, color: 'var(--text-subtle)', fontStyle: 'italic', margin: 'auto' }}>
                  All blocks placed
                </p>
              ) : (
                Array.from({ length: numSupplyCols }).map((_, col) => (
                  <div key={col}>{renderSupplyCol(col)}</div>
                ))
              )}
            </div>
          </div>

          {/* Group zones */}
          <div style={{ flex: 1, display: 'flex', gap: 10, minWidth: 0 }}>
            {[0, 1, 2].map((g) => {
              const count = counts[g];
              const isCorrect = count === answer;
              const groupPieces = pieces.filter((p) => p.loc === `group_${g}`);
              return (
                <div
                  key={g}
                  style={{
                    flex: 1,
                    minHeight: 220,
                    background: isCorrect ? 'var(--teal-bg)' : groupColors[g],
                    border: `2px dashed ${isCorrect ? '#1D9E75' : '#d3d1c7'}`,
                    borderRadius: 8,
                    padding: 8,
                    transition: 'background 0.2s, border-color 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(`group_${g}`); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(e, `group_${g}`)}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                      Group {g + 1}
                    </p>
                    <span style={{
                      fontSize: 16, fontWeight: 700,
                      color: isCorrect ? 'var(--teal-dark)' : 'var(--navy)',
                    }}>
                      {count}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignContent: 'flex-start', flex: 1 }}>
                    {groupPieces.map((p) =>
                      p.type === 'rod' ? (
                        <TensRod
                          key={p.id}
                          selected={selected.has(p.id)}
                          onDragStart={(e) => handleDragStart(e, p)}
                          onClick={(e) => handleRodClick(e, p)}
                        />
                      ) : (
                        <OnesUnit
                          key={p.id}
                          selected={selected.has(p.id)}
                          onDragStart={(e) => handleDragStart(e, p)}
                          onClick={(e) => toggleSelect(e, p.id)}
                        />
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Split popover */}
      {splitPopover && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(splitPopover.x, window.innerWidth - 180),
            top: splitPopover.y,
            background: 'white',
            border: '1.5px solid var(--bg-card-border)',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            padding: '10px 12px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 160,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: '6px 12px' }}
            onClick={() => doSplit(splitPopover.id)}
          >
            Split into 10 ones
          </button>
          <button
            className="btn-outline"
            style={{ fontSize: 13, padding: '6px 12px' }}
            onClick={() => setSplitPopover(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

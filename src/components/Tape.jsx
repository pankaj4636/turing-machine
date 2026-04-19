/**
 * Tape.jsx
 * The main tape visualization with scrolling and head tracking.
 */

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cell from './Cell';
import { STATUS } from '../useTuringMachine';

export default function Tape({ tape, headIndex, status }) {
  const scrollRef = useRef(null);
  const isRunning = status === STATUS.RUNNING;

  // Auto-scroll to keep head in view
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cellWidth = 60; // 52px + 8px gap
    const targetScroll = headIndex * cellWidth - container.clientWidth / 2 + cellWidth / 2;
    container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
  }, [headIndex]);

  // Trim visible tape: show window around head
  const windowSize = 30;
  const start = Math.max(0, headIndex - windowSize);
  const end = Math.min(tape.length, headIndex + windowSize + 1);
  const visibleTape = tape.slice(start, end);
  const visibleHeadIndex = headIndex - start;

  return (
    <div style={{ position: 'relative' }}>
      {/* Tape track label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '8px', padding: '0 4px',
      }}>
        <span style={{
          fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)',
        }}>
          TAPE MEMORY
        </span>
        <div style={{
          flex: 1, height: '1px',
          background: 'linear-gradient(90deg, rgba(56,189,248,0.15), transparent)',
        }} />
        <span style={{
          fontSize: '10px', color: 'rgba(56,189,248,0.5)',
          fontFamily: 'Space Mono, monospace',
        }}>
          pos: {headIndex}
        </span>
      </div>

      {/* Tape scroll container */}
      <div
        ref={scrollRef}
        className="tape-scroll"
        style={{ position: 'relative' }}
      >
        {/* Fade edges */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px',
          background: 'linear-gradient(90deg, rgba(8,13,26,0.9), transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '40px',
          background: 'linear-gradient(-90deg, rgba(8,13,26,0.9), transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Cells row */}
        <div style={{
          display: 'flex',
          gap: '8px',
          width: 'max-content',
          position: 'relative',
          paddingBottom: '12px',
        }}>
          <AnimatePresence initial={false}>
            {visibleTape.map((symbol, i) => {
              const globalIndex = start + i;
              return (
                <Cell
                  key={`cell-${globalIndex}`}
                  symbol={symbol}
                  isActive={i === visibleHeadIndex}
                  isRunning={isRunning}
                  index={globalIndex}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Head position beam effect */}
      <HeadBeam headIndex={visibleHeadIndex} />
    </div>
  );
}

/** Glowing vertical beam under the active cell */
function HeadBeam({ headIndex }) {
  const cellWidth = 60;
  const offset = headIndex * cellWidth + 26; // center of cell

  return (
    <motion.div
      animate={{ left: offset }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'absolute',
        top: '30px',
        width: '1px',
        height: '60px',
        background: 'linear-gradient(to bottom, rgba(56,189,248,0.6), transparent)',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
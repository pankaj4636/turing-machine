/**
 * Cell.jsx
 * Individual tape cell with animations.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { BLANK } from '../useTuringMachine';

export default function Cell({ symbol, isActive, isRunning, index }) {
  const isBlank = symbol === BLANK;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`tape-cell ${isActive ? 'active' : ''} ${isBlank ? 'blank' : ''} ${isActive && isRunning ? 'running' : ''}`}
      style={{ position: 'relative' }}
    >
      {/* Cell index (small label) */}
      <span style={{
        position: 'absolute',
        top: '3px',
        right: '5px',
        fontSize: '8px',
        color: 'rgba(148,163,184,0.3)',
        fontFamily: 'Space Mono, monospace',
        lineHeight: 1,
      }}>
        {index}
      </span>

      {/* Symbol with write animation */}
      <AnimatePresence mode="wait">
        <motion.span
          key={symbol}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700 }}
        >
          {isBlank ? '·' : symbol}
        </motion.span>
      </AnimatePresence>

      {/* Active head triangle indicator */}
      {isActive && (
        <motion.div
          className="head-indicator"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      )}

      {/* Corner accent lines for active cell */}
      {isActive && (
        <>
          <span style={{
            position: 'absolute', top: 0, left: 0,
            width: '8px', height: '8px',
            borderTop: '2px solid rgba(56,189,248,0.7)',
            borderLeft: '2px solid rgba(56,189,248,0.7)',
            borderRadius: '2px 0 0 0',
          }} />
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: '8px', height: '8px',
            borderTop: '2px solid rgba(56,189,248,0.7)',
            borderRight: '2px solid rgba(56,189,248,0.7)',
            borderRadius: '0 2px 0 0',
          }} />
          <span style={{
            position: 'absolute', bottom: 0, left: 0,
            width: '8px', height: '8px',
            borderBottom: '2px solid rgba(56,189,248,0.7)',
            borderLeft: '2px solid rgba(56,189,248,0.7)',
            borderRadius: '0 0 0 2px',
          }} />
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '8px', height: '8px',
            borderBottom: '2px solid rgba(56,189,248,0.7)',
            borderRight: '2px solid rgba(56,189,248,0.7)',
            borderRadius: '0 0 2px 0',
          }} />
        </>
      )}
    </motion.div>
  );
}
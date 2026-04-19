/**
 * Controls.jsx
 * Playback controls: Start, Pause, Step, Reset + Speed slider.
 */

import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Zap } from 'lucide-react';
import { STATUS } from '../useTuringMachine';

const SPEED_LABELS = { 1: 'Crawl', 2: 'Slow', 3: 'Normal', 4: 'Fast', 5: 'Turbo' };

export default function Controls({ status, speed, onStart, onPause, onStep, onReset, onSpeedChange, isInitialized }) {
  const isRunning = status === STATUS.RUNNING;
  const isDone = status === STATUS.ACCEPTED || status === STATUS.REJECTED;
  const canStep = !isRunning && !isDone && isInitialized;
  const canStart = !isRunning && !isDone && isInitialized;
  const canPause = isRunning;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Main control buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {/* Start / Pause toggle */}
        {!isRunning ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="btn-control btn-primary"
            onClick={onStart}
            disabled={!canStart}
          >
            <Play size={14} />
            Start
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="btn-control btn-secondary"
            onClick={onPause}
            disabled={!canPause}
          >
            <Pause size={14} />
            Pause
          </motion.button>
        )}

        {/* Step button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="btn-control btn-secondary"
          onClick={onStep}
          disabled={!canStep && !isRunning}
        >
          <SkipForward size={14} />
          Step
        </motion.button>

        {/* Reset button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="btn-control btn-danger"
          onClick={onReset}
        >
          <RotateCcw size={14} />
          Reset
        </motion.button>
      </div>

      {/* Speed control */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} color="rgba(251,191,36,0.7)" />
            <span style={{
              fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'rgba(148,163,184,0.6)',
            }}>
              Speed
            </span>
          </div>
          <motion.span
            key={speed}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              fontSize: '12px', fontWeight: '700',
              color: 'rgba(251,191,36,0.8)',
              fontFamily: 'Space Mono, monospace',
            }}
          >
            {SPEED_LABELS[speed]}
          </motion.span>
        </div>
        <input
          type="range"
          min="1" max="5"
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          className="speed-slider"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[1,2,3,4,5].map(v => (
            <span key={v} style={{
              width: '2px', height: '6px', borderRadius: '1px',
              background: v <= speed ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.1)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
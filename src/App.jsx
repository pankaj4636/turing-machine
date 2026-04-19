/**
 * App.jsx
 * Main application layout for the Turing Machine Simulator.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Github, Info } from 'lucide-react';

import { useTuringMachine, STATUS } from './useTuringMachine';
import InputPanel from './components/InputPanel';
import Controls from './components/Controls';
import Tape from './components/Tape';
import StatusPanel from './components/StatusPanel';
import TransitionTable from './components/TransitionTable';

export default function App() {
  const tm = useTuringMachine();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Load a preset into the input fields and initialize
  const handleLoadPreset = useCallback((preset) => {
    tm.setInputString(preset.input);
    tm.setRulesText(preset.rules);
    setIsInitialized(false);
  }, [tm]);

  // Initialize TM with current input + rules
  const handleInitialize = useCallback(() => {
    tm.initialize(tm.inputString, tm.rulesText);
    setIsInitialized(true);
  }, [tm]);

  // Reset also clears initialized flag
  const handleReset = useCallback(() => {
    tm.reset();
    setIsInitialized(true);
  }, [tm]);

  const statusColor = {
    [STATUS.IDLE]: 'rgba(148,163,184,0.5)',
    [STATUS.RUNNING]: 'var(--accent-cyan)',
    [STATUS.PAUSED]: 'var(--accent-amber)',
    [STATUS.ACCEPTED]: 'var(--accent-emerald)',
    [STATUS.REJECTED]: 'var(--accent-rose)',
  }[tm.status];

  const statusLabel = {
    [STATUS.IDLE]: 'IDLE',
    [STATUS.RUNNING]: 'RUNNING',
    [STATUS.PAUSED]: 'PAUSED',
    [STATUS.ACCEPTED]: 'ACCEPTED',
    [STATUS.REJECTED]: 'REJECTED',
  }[tm.status];

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Ambient orbs */}
      <div className="orb" style={{
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.3), transparent 70%)',
        top: '-150px', right: '-100px',
      }} />
      <div className="orb" style={{
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(167,139,250,0.25), transparent 70%)',
        bottom: '0px', left: '-100px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 16px 40px' }}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 4px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(167,139,250,0.2))',
              border: '1.5px solid rgba(56,189,248,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(56,189,248,0.15)',
            }}>
              <Cpu size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <h1 style={{
                margin: 0, fontSize: '22px', fontWeight: '800',
                letterSpacing: '-0.02em', lineHeight: 1,
                background: 'linear-gradient(135deg, #e2e8f0 30%, rgba(56,189,248,0.9))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Turing Machine
              </h1>
              <div style={{
                fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em',
                color: 'rgba(148,163,184,0.45)', textTransform: 'uppercase', marginTop: '1px',
              }}>
                Simulator
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Status badge */}
            <motion.div
              key={tm.status}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="status-badge"
              style={{
                background: `${statusColor}18`,
                border: `1px solid ${statusColor}40`,
                color: statusColor,
              }}
            >
              <motion.span
                animate={tm.status === STATUS.RUNNING ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, display: 'inline-block' }}
              />
              {statusLabel}
            </motion.div>

            <button
              onClick={() => setShowInfo(v => !v)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', padding: '7px', color: 'rgba(148,163,184,0.6)',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Info size={15} />
            </button>
          </div>
        </header>

        {/* Info toast */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="glass-card"
              style={{ padding: '16px 20px', marginBottom: '20px', overflow: 'hidden' }}
            >
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(148,163,184,0.8)', lineHeight: 1.7 }}>
                A <strong style={{ color: 'var(--accent-cyan)' }}>Turing Machine</strong> is an abstract computation model with an infinite tape, a read/write head, and a finite set of states.
                Rules define: given a <em>state</em> and <em>symbol</em>, write a new symbol, move Left/Right, and transition to a new state.
                Halting states: <code style={{ color: 'var(--accent-emerald)', fontSize: '12px' }}>HALT_ACCEPT</code> and <code style={{ color: 'var(--accent-rose)', fontSize: '12px' }}>HALT_REJECT</code>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MAIN GRID ──────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 360px) 1fr',
          gap: '20px',
          alignItems: 'start',
        }}
          className="main-grid"
        >
          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Input Panel Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-card-bright"
              style={{ padding: '20px' }}
            >
              <SectionHeader label="Input Configuration" dot="cyan" />
              <div style={{ marginTop: '16px' }}>
                <InputPanel
                  inputString={tm.inputString}
                  rulesText={tm.rulesText}
                  onInputChange={tm.setInputString}
                  onRulesChange={tm.setRulesText}
                  onLoadPreset={handleLoadPreset}
                  onRun={handleInitialize}
                  isRunning={tm.status === STATUS.RUNNING}
                />
              </div>
            </motion.div>

            {/* Controls Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-bright"
              style={{ padding: '20px' }}
            >
              <SectionHeader label="Controls" dot="violet" />
              <div style={{ marginTop: '16px' }}>
                <Controls
                  status={tm.status}
                  speed={tm.speed}
                  onStart={tm.start}
                  onPause={tm.pause}
                  onStep={tm.step}
                  onReset={handleReset}
                  onSpeedChange={tm.setSpeed}
                  isInitialized={isInitialized}
                />
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Tape Visualization Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="glass-card-bright"
              style={{ padding: '20px', overflow: 'hidden' }}
            >
              <SectionHeader label="Tape Visualization" dot="cyan" />

              {/* Machine head label */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                margin: '14px 0 4px',
              }}>
                <div style={{
                  background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
                  borderRadius: '6px', padding: '4px 10px',
                  fontSize: '11px', color: 'rgba(56,189,248,0.7)',
                  fontFamily: 'Space Mono, monospace',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{
                    display: 'inline-block', width: '7px', height: '7px',
                    borderRadius: '50%', background: 'var(--accent-cyan)',
                    boxShadow: '0 0 6px rgba(56,189,248,0.8)',
                  }} />
                  READ/WRITE HEAD
                </div>
                <div style={{
                  fontSize: '11px', color: 'rgba(148,163,184,0.4)',
                  fontFamily: 'Space Mono, monospace',
                }}>
                  @ cell [{tm.headIndex}]
                </div>
              </div>

              <Tape
                tape={tm.tape}
                headIndex={tm.headIndex}
                status={tm.status}
              />

              {/* Empty state prompt */}
              {!isInitialized && (
                <div style={{
                  textAlign: 'center', padding: '8px',
                  fontSize: '12px', color: 'rgba(148,163,184,0.3)',
                }}>
                  ← Load an example or enter input, then click "Load &amp; Initialize"
                </div>
              )}
            </motion.div>

            {/* Status + Transition Table Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Status Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="glass-card-bright"
                style={{ padding: '20px' }}
              >
                <SectionHeader label="Machine State" dot="violet" />
                <div style={{ marginTop: '16px' }}>
                  <StatusPanel
                    currentState={tm.currentState}
                    tape={tm.tape}
                    headIndex={tm.headIndex}
                    activeRule={tm.activeRule}
                    stepCount={tm.stepCount}
                    status={tm.status}
                  />
                </div>
              </motion.div>

              {/* Transition Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card-bright"
                style={{ padding: '20px' }}
              >
                <SectionHeader label="Rules" dot="amber" />
                <div style={{ marginTop: '16px' }}>
                  {Object.keys(tm.rules).length > 0 ? (
                    <TransitionTable rules={tm.rules} activeRule={tm.activeRule} />
                  ) : (
                    <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.3)', fontStyle: 'italic' }}>
                      No rules loaded yet.
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center', marginTop: '32px',
          fontSize: '11px', color: 'rgba(100,116,139,0.4)',
          letterSpacing: '0.06em',
        }}>
          TURING MACHINE SIMULATOR · Built with React + Framer Motion
        </div>
      </div>

      {/* Responsive override via inline style tag */}
      <style>{`
        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .main-grid > div:nth-child(2) > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/** Small section header with colored dot */
function SectionHeader({ label, dot = 'cyan' }) {
  const dotColor = {
    cyan: 'var(--accent-cyan)',
    violet: 'var(--accent-violet)',
    amber: 'var(--accent-amber)',
    emerald: 'var(--accent-emerald)',
  }[dot];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: dotColor,
        boxShadow: `0 0 6px ${dotColor}`,
        flexShrink: 0,
      }} />
      <span style={{
        fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'rgba(148,163,184,0.55)',
      }}>
        {label}
      </span>
    </div>
  );
}
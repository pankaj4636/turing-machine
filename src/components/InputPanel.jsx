/**
 * InputPanel.jsx
 * Input fields for tape string + transition rules + preset buttons.
 */

import { motion } from 'framer-motion';
import { BookOpen, Wand2, ChevronRight } from 'lucide-react';
import { PRESETS } from '../presets';

export default function InputPanel({
  inputString, rulesText,
  onInputChange, onRulesChange,
  onLoadPreset, onRun,
  isRunning,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Presets */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginBottom: '10px',
        }}>
          <BookOpen size={13} color="rgba(167,139,250,0.7)" />
          <span style={{
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)',
          }}>
            Examples
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {PRESETS.map(preset => (
            <motion.button
              key={preset.id}
              whileTap={{ scale: 0.96 }}
              className="preset-btn"
              onClick={() => onLoadPreset(preset)}
              title={preset.description}
            >
              {preset.emoji} {preset.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tape input */}
      <div>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginBottom: '8px',
          fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'rgba(148,163,184,0.6)',
        }}>
          Input Tape
        </label>
        <input
          className="tm-input"
          type="text"
          value={inputString}
          onChange={e => onInputChange(e.target.value)}
          placeholder="Enter tape string (e.g. 1011010)"
          disabled={isRunning}
        />
        <div style={{ fontSize: '11px', color: 'rgba(100,116,139,0.7)', marginTop: '5px' }}>
          Use <code style={{ color: 'rgba(167,139,250,0.6)' }}>_</code> for blank symbol
        </div>
      </div>

      {/* Rules input */}
      <div>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginBottom: '8px',
          fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'rgba(148,163,184,0.6)',
        }}>
          Transition Rules
        </label>
        <textarea
          className="tm-textarea"
          value={rulesText}
          onChange={e => onRulesChange(e.target.value)}
          placeholder={`# Format: state,symbol -> newState,write,move\nq0,1 -> q0,0,R\nq0,0 -> q0,1,R\nq0,_ -> HALT_ACCEPT,_,R`}
          disabled={isRunning}
          rows={7}
        />
        <div style={{ fontSize: '11px', color: 'rgba(100,116,139,0.7)', marginTop: '5px' }}>
          Use <code style={{ color: 'rgba(56,189,248,0.6)' }}>HALT_ACCEPT</code> or <code style={{ color: 'rgba(251,113,133,0.6)' }}>HALT_REJECT</code> as states
        </div>
      </div>

      {/* Load & Run button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="btn-control btn-primary"
        onClick={onRun}
        disabled={isRunning || !inputString.trim() || !rulesText.trim()}
        style={{
          width: '100%', justifyContent: 'center',
          padding: '12px 20px', fontSize: '13px',
        }}
      >
        <Wand2 size={15} />
        Load & Initialize
        <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
      </motion.button>
    </div>
  );
}
/**
 * StatusPanel.jsx
 * Shows current TM state, symbol, active rule, step count, and result.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Activity, Hash, ArrowRight } from 'lucide-react';
import { STATUS, BLANK } from '../useTuringMachine';

function StatBox({ label, value, color = 'var(--accent-cyan)', icon }) {
  return (
    <div style={{
      background: 'rgba(8, 13, 26, 0.6)',
      border: '1px solid rgba(99,179,237,0.1)',
      borderRadius: '10px',
      padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: '4px',
      minWidth: '80px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {icon}
        <span style={{
          fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)',
        }}>
          {label}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            fontSize: '18px', fontWeight: '800',
            fontFamily: 'Space Mono, monospace',
            color,
            lineHeight: 1,
          }}
        >
          {value ?? '—'}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function StatusPanel({ currentState, tape, headIndex, activeRule, stepCount, status }) {
  const symbol = tape?.[headIndex] ?? BLANK;
  const isDone = status === STATUS.ACCEPTED || status === STATUS.REJECTED;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Stats grid */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <StatBox
          label="State"
          value={currentState}
          color="var(--accent-violet)"
          icon={<Activity size={10} color="rgba(167,139,250,0.6)" />}
        />
        <StatBox
          label="Symbol"
          value={symbol === BLANK ? '·' : symbol}
          color="var(--accent-cyan)"
          icon={<Hash size={10} color="rgba(56,189,248,0.6)" />}
        />
        <StatBox
          label="Steps"
          value={stepCount}
          color="var(--accent-amber)"
          icon={<ArrowRight size={10} color="rgba(251,191,36,0.6)" />}
        />
      </div>

      {/* Active rule */}
      <AnimatePresence>
        {activeRule && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{
              fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)',
              marginBottom: '6px',
            }}>
              Active Rule
            </div>
            <div className="rule-highlight">
              ({activeRule.from}, {activeRule.read === BLANK ? '_' : activeRule.read})
              {' → '}
              ({activeRule.newState}, {activeRule.write === BLANK ? '_' : activeRule.write}, {activeRule.move})
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {status === STATUS.ACCEPTED ? (
              <div className={`glass-card result-accepted`} style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={22} color="var(--accent-emerald)" />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--accent-emerald)' }}>
                      ACCEPTED
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(52,211,153,0.6)', marginTop: '2px' }}>
                      Reached HALT_ACCEPT state
                    </div>
                  </div>
                </div>
                <div style={{
                  marginTop: '10px', padding: '8px 10px', borderRadius: '7px',
                  background: 'rgba(52,211,153,0.06)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '12px', color: 'rgba(52,211,153,0.8)',
                  wordBreak: 'break-all',
                }}>
                  {tape?.filter(c => c !== '_').join('') || '(empty)'}
                </div>
              </div>
            ) : (
              <div className={`glass-card result-rejected`} style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <XCircle size={22} color="var(--accent-rose)" />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--accent-rose)' }}>
                      REJECTED
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(251,113,133,0.6)', marginTop: '2px' }}>
                      No transition found or HALT_REJECT reached
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
/**
 * TransitionTable.jsx
 * Visual table showing all parsed transition rules.
 * Highlights the currently active rule.
 */

import { motion } from 'framer-motion';
import { BLANK } from '../useTuringMachine';

export default function TransitionTable({ rules, activeRule }) {
  const entries = Object.entries(rules);
  if (entries.length === 0) return null;

  return (
    <div>
      <div style={{
        fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)',
        marginBottom: '8px',
      }}>
        Transition Table ({entries.length} rules)
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto', borderRadius: '8px' }}>
        <table className="transition-table">
          <thead>
            <tr>
              <th>State</th>
              <th>Read</th>
              <th>→</th>
              <th>New State</th>
              <th>Write</th>
              <th>Move</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, rule]) => {
              const [state, symbol] = key.split('|');
              const isActive = activeRule?.key === key;
              return (
                <motion.tr
                  key={key}
                  className={isActive ? 'active-rule' : ''}
                  animate={isActive ? { scale: 1.01 } : { scale: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <td style={{ color: 'rgba(167,139,250,0.8)', fontWeight: '600' }}>{state}</td>
                  <td style={{ color: 'rgba(56,189,248,0.8)' }}>{symbol === BLANK ? '_' : symbol}</td>
                  <td style={{ color: 'rgba(148,163,184,0.3)' }}>→</td>
                  <td style={{ color: isActive ? 'var(--accent-amber)' : 'rgba(167,139,250,0.8)', fontWeight: '600' }}>
                    {rule.newState}
                  </td>
                  <td style={{ color: isActive ? 'var(--accent-amber)' : 'rgba(56,189,248,0.8)' }}>
                    {rule.write === BLANK ? '_' : rule.write}
                  </td>
                  <td style={{
                    color: rule.move === 'R' ? 'rgba(52,211,153,0.8)' : 'rgba(251,113,133,0.8)',
                    fontWeight: '700',
                  }}>
                    {rule.move}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
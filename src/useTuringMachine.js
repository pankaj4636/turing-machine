/**
 * useTuringMachine.js
 * Core Turing Machine engine as a React hook.
 * Manages tape, head position, state, and step execution.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────
export const BLANK = '_';
export const HALT_ACCEPT = 'HALT_ACCEPT';
export const HALT_REJECT = 'HALT_REJECT';

export const STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

const SPEED_MAP = { 1: 800, 2: 400, 3: 200, 4: 80, 5: 30 };

/**
 * Parse transition rules from text format:
 * Each line: state,symbol -> newState,write,move
 * e.g. q0,1 -> q0,0,R
 */
export function parseRules(text) {
  const rules = {};
  const lines = text.trim().split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('->');
    if (parts.length !== 2) continue;
    const [lhs, rhs] = parts.map(s => s.trim());
    const [state, symbol] = lhs.split(',').map(s => s.trim());
    const [newState, write, move] = rhs.split(',').map(s => s.trim());
    if (!state || !symbol || !newState || !write || !move) continue;
    const key = `${state}|${symbol}`;
    rules[key] = { newState, write, move: move.toUpperCase() };
  }
  return rules;
}

/**
 * Build initial tape from input string, padded with blanks
 */
export function buildTape(input, padding = 5) {
  const padArr = Array(padding).fill(BLANK);
  const inputArr = input.split('');
  return [...padArr, ...inputArr, ...padArr];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTuringMachine() {
  const [tape, setTape] = useState(Array(12).fill(BLANK));
  const [headIndex, setHeadIndex] = useState(5);
  const [currentState, setCurrentState] = useState('q0');
  const [rules, setRules] = useState({});
  const [status, setStatus] = useState(STATUS.IDLE);
  const [stepCount, setStepCount] = useState(0);
  const [activeRule, setActiveRule] = useState(null);
  const [speed, setSpeed] = useState(3);
  const [inputString, setInputString] = useState('');
  const [rulesText, setRulesText] = useState('');

  const intervalRef = useRef(null);
  const tapeRef = useRef(tape);
  const headRef = useRef(headIndex);
  const stateRef = useRef(currentState);
  const rulesRef = useRef(rules);
  const statusRef = useRef(status);

  // Keep refs in sync
  useEffect(() => { tapeRef.current = tape; }, [tape]);
  useEffect(() => { headRef.current = headIndex; }, [headIndex]);
  useEffect(() => { stateRef.current = currentState; }, [currentState]);
  useEffect(() => { rulesRef.current = rules; }, [rules]);
  useEffect(() => { statusRef.current = status; }, [status]);

  /** Execute a single step of the TM */
  const executeStep = useCallback(() => {
    const tape = [...tapeRef.current];
    const head = headRef.current;
    const state = stateRef.current;
    const rules = rulesRef.current;

    // Check for halt states
    if (state === HALT_ACCEPT) {
      setStatus(STATUS.ACCEPTED);
      return false;
    }
    if (state === HALT_REJECT) {
      setStatus(STATUS.REJECTED);
      return false;
    }

    const symbol = tape[head] ?? BLANK;
    const key = `${state}|${symbol}`;
    const rule = rules[key];

    // No rule found → reject
    if (!rule) {
      setActiveRule(null);
      setStatus(STATUS.REJECTED);
      return false;
    }

    setActiveRule({ from: state, read: symbol, ...rule, key });

    // Apply write
    tape[head] = rule.write;

    // Extend tape if needed
    let newHead = head + (rule.move === 'R' ? 1 : -1);

    if (newHead < 0) {
      tape.unshift(BLANK);
      newHead = 0;
    }
    if (newHead >= tape.length) {
      tape.push(BLANK);
    }

    setTape([...tape]);
    setHeadIndex(newHead);
    setCurrentState(rule.newState);
    setStepCount(s => s + 1);

    // Check if new state is halt
    if (rule.newState === HALT_ACCEPT) {
      setStatus(STATUS.ACCEPTED);
      return false;
    }
    if (rule.newState === HALT_REJECT) {
      setStatus(STATUS.REJECTED);
      return false;
    }

    return true;
  }, []);

  /** Initialize / Reset the TM with given input and rules */
  const initialize = useCallback((input, rulesText, initialState = 'q0') => {
    stopInterval();
    const newTape = buildTape(input, 5);
    const parsedRules = parseRules(rulesText);
    const startHead = 5;

    setTape(newTape);
    setHeadIndex(startHead);
    setCurrentState(initialState);
    setRules(parsedRules);
    setStatus(STATUS.IDLE);
    setStepCount(0);
    setActiveRule(null);

    tapeRef.current = newTape;
    headRef.current = startHead;
    stateRef.current = initialState;
    rulesRef.current = parsedRules;
    statusRef.current = STATUS.IDLE;
  }, []);

  /** Start continuous execution */
  const start = useCallback(() => {
    if (statusRef.current === STATUS.ACCEPTED || statusRef.current === STATUS.REJECTED) return;
    setStatus(STATUS.RUNNING);
    statusRef.current = STATUS.RUNNING;
    startInterval();
  }, [speed]);

  /** Pause execution */
  const pause = useCallback(() => {
    stopInterval();
    if (statusRef.current === STATUS.RUNNING) {
      setStatus(STATUS.PAUSED);
      statusRef.current = STATUS.PAUSED;
    }
  }, []);

  /** Single step */
  const step = useCallback(() => {
    if (statusRef.current === STATUS.ACCEPTED || statusRef.current === STATUS.REJECTED) return;
    stopInterval();
    if (statusRef.current === STATUS.RUNNING) {
      setStatus(STATUS.PAUSED);
      statusRef.current = STATUS.PAUSED;
    }
    executeStep();
  }, [executeStep]);

  /** Reset to initial state */
  const reset = useCallback(() => {
    stopInterval();
    initialize(inputString, rulesText);
  }, [inputString, rulesText, initialize]);

  function startInterval() {
    stopInterval();
    const delay = SPEED_MAP[speed] || 400;
    intervalRef.current = setInterval(() => {
      if (statusRef.current !== STATUS.RUNNING) {
        clearInterval(intervalRef.current);
        return;
      }
      const cont = executeStep();
      if (!cont) {
        clearInterval(intervalRef.current);
      }
    }, delay);
  }

  function stopInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  // Restart interval when speed changes while running
  useEffect(() => {
    if (status === STATUS.RUNNING) {
      startInterval();
    }
    return () => stopInterval();
  }, [speed]);

  useEffect(() => () => stopInterval(), []);

  return {
    tape, headIndex, currentState, status,
    stepCount, activeRule, speed, rules,
    inputString, rulesText,
    setInputString, setRulesText, setSpeed,
    initialize, start, pause, step, reset,
  };
}
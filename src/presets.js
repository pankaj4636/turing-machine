/**
 * presets.js
 * Pre-built Turing Machine examples
 */

export const PRESETS = [
  {
    id: 'binary-flip',
    name: 'Binary Flip',
    description: '1→0, 0→1 on entire tape',
    emoji: '🔄',
    input: '1011010',
    initialState: 'q0',
    rules: `# Binary Flip: flip all 0s and 1s
# State q0: scanning right, flipping bits
q0,0 -> q0,1,R
q0,1 -> q0,0,R
q0,_ -> HALT_ACCEPT,_,R`,
  },
  {
    id: 'palindrome',
    name: 'Palindrome Check',
    description: 'Checks if binary string is palindrome',
    emoji: '🪞',
    input: '1001001',
    initialState: 'q0',
    rules: `# Palindrome checker for binary strings
# Mark leftmost symbol, find matching rightmost
# q0: reading leftmost symbol
q0,0 -> q1,X,R
q0,1 -> q2,X,R
q0,X -> HALT_ACCEPT,X,R
q0,_ -> HALT_ACCEPT,_,R

# q1: found 0 on left, seeking 0 on right
q1,0 -> q1,0,R
q1,1 -> q1,1,R
q1,X -> q1,X,R
q1,_ -> q3,_,L

# q2: found 1 on left, seeking 1 on right
q2,0 -> q2,0,R
q2,1 -> q2,1,R
q2,X -> q2,X,R
q2,_ -> q4,_,L

# q3: on right end, need to find 0
q3,0 -> q5,X,L
q3,1 -> HALT_REJECT,1,L
q3,X -> HALT_ACCEPT,X,L

# q4: on right end, need to find 1
q4,0 -> HALT_REJECT,0,L
q4,1 -> q5,X,L
q4,X -> HALT_ACCEPT,X,L

# q5: go back to leftmost unread symbol
q5,0 -> q5,0,L
q5,1 -> q5,1,L
q5,X -> q0,X,R`,
  },
  {
    id: 'unary-add',
    name: 'Unary Addition',
    description: 'Adds two unary numbers (111+11=11111)',
    emoji: '➕',
    input: '111+11',
    initialState: 'q0',
    rules: `# Unary addition: 111+11 => 11111
# Replace + with 1, delete trailing 1
q0,1 -> q0,1,R
q0,+ -> q0,1,R
q0,_ -> q1,_,L

# q1: delete last 1
q1,1 -> HALT_ACCEPT,_,L`,
  },
  {
    id: 'copy',
    name: 'String Copy',
    description: 'Copies a string of 1s: 111 → 111B111',
    emoji: '📋',
    input: '111',
    initialState: 'q0',
    rules: `# Copy: 111 -> 111_111
# q0: mark a 1 as X, remember we need to copy a 1
q0,1 -> q1,X,R
q0,_ -> q5,_,R
q0,Y -> q0,Y,R

# q1: move right past remaining 1s, Ys, to find blank
q1,1 -> q1,1,R
q1,Y -> q1,Y,R
q1,_ -> q2,_,R

# q2: move right past copied Ys to place a new 1
q2,Y -> q2,Y,R
q2,_ -> q3,Y,L

# q3: go all the way left
q3,Y -> q3,Y,L
q3,_ -> q4,_,L
q3,1 -> q3,1,L
q3,X -> q3,X,L

# q4: back to beginning, find next X
q4,X -> q0,Y,R
q4,Y -> q4,Y,R

# q5: convert X,Y back to 1
q5,X -> q5,1,R
q5,Y -> q5,1,R
q5,_ -> HALT_ACCEPT,_,R`,
  },
];
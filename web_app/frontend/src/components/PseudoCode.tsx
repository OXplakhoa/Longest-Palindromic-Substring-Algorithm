import React from 'react';
import type { Algorithm } from '../types';

interface PseudoCodeProps {
    algorithm: Algorithm;
    currentLine?: number;
}

const ALGORITHM_CODE: Record<Algorithm, string> = {
    brute_force: `function bruteForce(s):
  n = length(s)
  for i from 0 to n-1:
    for j from i to n-1:
      checkPalindrome(s, i, j)
      if isPalindrome:
        updateMax(i, j)`,
    
    expand_center: `function expandCenter(s):
  n = length(s)
  for i from 0 to n-1:
    # Odd length
    expand(i, i)
    # Even length
    expand(i, i+1)
    
  function expand(l, r):
    while l >= 0 and r < n and s[l] == s[r]:
      updateMax(l, r)
      l--, r++`,

    dynamic_programming: `function dynamicProgramming(s):
  n = length(s)
  dp = table(n, n, false)
  # Length 1
  for i from 0 to n-1: dp[i][i] = true
  # Length 2
  for i from 0 to n-2:
    if s[i] == s[i+1]: dp[i][i+1] = true
  # Length 3+
  for len from 3 to n:
    for i from 0 to n-len:
      j = i + len - 1
      if s[i] == s[j] and dp[i+1][j-1]:
        dp[i][j] = true
        updateMax(i, j)`,

    manacher: `function manacher(s):
  T = transform(s) # ^#a#b#a#$
  P = array(length(T), 0)
  C = 0, R = 0
  for i from 1 to length(T)-1:
    mirror = 2*C - i
    if i < R: P[i] = min(R-i, P[mirror])
    while T[i + 1 + P[i]] == T[i - 1 - P[i]]:
      P[i]++
    if i + P[i] > R:
      C = i, R = i + P[i]`
};

const PseudoCode: React.FC<PseudoCodeProps> = ({ algorithm, currentLine }) => {
    const codeLines = ALGORITHM_CODE[algorithm].split('\n');

    return (
        <div className="bg-slate-900 p-5 rounded-lg font-mono text-base h-full overflow-auto border border-slate-700">
            <h3 className="text-gray-300 mb-4 font-bold uppercase text-sm tracking-wider">Pseudo-Code</h3>
            <div className="flex flex-col gap-1">
                {codeLines.map((line, idx) => (
                    <div 
                        key={idx} 
                        className={`px-3 py-2 rounded-md transition-all duration-300 ${
                            (currentLine === idx + 1) 
                                ? 'bg-gradient-to-r from-blue-900/80 to-blue-800/60 text-blue-50 border-l-4 border-blue-400 font-bold shadow-lg scale-105' 
                                : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/50'
                        }`}
                    >
                        <span className="inline-block w-8 text-gray-600 select-none text-sm font-normal mr-3">{idx + 1}</span>
                        <span className={currentLine === idx + 1 ? 'text-white' : ''}>{line}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PseudoCode;

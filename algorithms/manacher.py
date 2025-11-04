# Manacher's Algorithm for Longest Palindromic Substring
from typing import Tuple, Dict, Any, List

def longest_palindrome(text: str, trace: bool = False) -> Tuple[str, Dict[str, Any]]:
    n = len(text)
    if n < 2:
        meta = {'start_index': 0, 'end_index': n-1, 'execution_time_ms': 0.0, 'algorithm_used': 'manacher', 'steps': [] if trace else None}
        return text, meta
    import time
    start_time = time.time()
    def transform(s: str) -> str:
        return '^#' + '#'.join(s) + '#$'
    T = transform(text)
    m = len(T)
    P = [0] * m
    C = 0
    R = 0
    steps: List[Dict[str, Any]] = []
    for i in range(1, m-1):
        mirror = 2*C - i
        if i < R:
            P[i] = min(R - i, P[mirror])
        if trace:
            steps.append({'event': 'scan', 'i': i, 'C': C, 'R': R, 'P_i': P[i]})
        # Attempt to expand palindrome centered at i
        while T[i + 1 + P[i]] == T[i - 1 - P[i]]:
            P[i] += 1
            if trace:
                steps.append({'event': 'expand', 'i': i, 'C': C, 'R': R, 'P_i': P[i]})
        if i + P[i] > R:
            C = i
            R = i + P[i]
    max_len = max(P)
    center_index = P.index(max_len)
    start = (center_index - max_len) // 2
    end = start + max_len - 1
    exec_time = (time.time() - start_time) * 1000
    meta = {'start_index': start, 'end_index': end, 'execution_time_ms': exec_time, 'algorithm_used': 'manacher'}
    if trace:
        meta['steps'] = steps
    return text[start:start+max_len], meta

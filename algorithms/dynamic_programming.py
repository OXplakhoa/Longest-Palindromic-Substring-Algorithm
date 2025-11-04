# Dynamic Programming Algorithm for Longest Palindromic Substring
from typing import Tuple, Dict, Any, List

def longest_palindrome(text: str, trace: bool = False) -> Tuple[str, Dict[str, Any]]:
    n = len(text)
    if n < 2:
        meta = {'start_index': 0, 'end_index': n-1, 'execution_time_ms': 0.0, 'algorithm_used': 'dp', 'steps': [] if trace else None}
        return text, meta
    import time
    start_time = time.time()
    dp = [[False]*n for _ in range(n)]
    max_len = 1
    start = 0
    steps: List[Dict[str, Any]] = []
    for i in range(n):
        dp[i][i] = True
        if trace:
            steps.append({'event': 'dp-fill', 'i': i, 'j': i, 'value': True})
    for i in range(n-1):
        if text[i] == text[i+1]:
            dp[i][i+1] = True
            start = i
            max_len = 2
            if trace:
                steps.append({'event': 'dp-fill', 'i': i, 'j': i+1, 'value': True})
    for length in range(3, n+1):
        for i in range(n-length+1):
            j = i + length - 1
            if text[i] == text[j] and dp[i+1][j-1]:
                dp[i][j] = True
                start = i
                max_len = length
                if trace:
                    steps.append({'event': 'dp-fill', 'i': i, 'j': j, 'value': True})
            elif trace:
                steps.append({'event': 'dp-fill', 'i': i, 'j': j, 'value': False})
    end = start + max_len - 1
    exec_time = (time.time() - start_time) * 1000
    meta = {'start_index': start, 'end_index': end, 'execution_time_ms': exec_time, 'algorithm_used': 'dp'}
    if trace:
        meta['steps'] = steps
    return text[start:start+max_len], meta

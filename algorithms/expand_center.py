# Expand Around Centers Algorithm for Longest Palindromic Substring
from typing import Tuple, Dict, Any, List

def longest_palindrome(text: str, trace: bool = False) -> Tuple[str, Dict[str, Any]]:
    n = len(text)
    if n < 2:
        meta = {'start_index': 0, 'end_index': n-1, 'execution_time_ms': 0.0, 'algorithm_used': 'expand', 'steps': [] if trace else None}
        return text, meta
    import time
    start_time = time.time()
    start = 0
    max_len = 0
    steps: List[Dict[str, Any]] = []
    def expand(left: int, right: int) -> int:
        while left >= 0 and right < n and text[left] == text[right]:
            if trace:
                steps.append({'event': 'expand', 'left': left, 'right': right, 'match': True})
            left -= 1
            right += 1
        if trace and left >= 0 and right < n:
            steps.append({'event': 'expand', 'left': left, 'right': right, 'match': False})
        return right - left - 1
    for i in range(n):
        len1 = expand(i, i)
        len2 = expand(i, i+1)
        length = max(len1, len2)
        if length > max_len:
            max_len = length
            start = i - (length - 1) // 2
        if trace:
            steps.append({'event': 'center', 'i': i, 'left': i, 'right': i})
    end = start + max_len - 1
    exec_time = (time.time() - start_time) * 1000
    meta = {'start_index': start, 'end_index': end, 'execution_time_ms': exec_time, 'algorithm_used': 'expand'}
    if trace:
        meta['steps'] = steps
    return text[start:start+max_len], meta

# Brute Force Algorithm for Longest Palindromic Substring
from typing import Tuple, Dict, Any, List

def longest_palindrome(text: str, trace: bool = False) -> Tuple[str, Dict[str, Any]]:
    n = len(text)
    if n < 2:
        meta = {'start_index': 0, 'end_index': n-1, 'execution_time_ms': 0.0, 'algorithm_used': 'brute', 'steps': [] if trace else None}
        return text, meta
    import time
    start_time = time.time()
    max_len = 0
    start = 0
    steps: List[Dict[str, Any]] = []
    last_print = time.time()
    for i in range(n):
        # Print progress every 1 second for long strings
        if n > 100 and (time.time() - last_print) > 1:
            print(f"Brute-force progress: i={i}/{n} ({i*100//n}%) elapsed={int(time.time()-start_time)}s")
            last_print = time.time()
        for j in range(i, n):
            l, r = i, j
            is_pal = True
            while l < r:
                if text[l] != text[r]:
                    is_pal = False
                    if trace:
                        steps.append({'event': 'mismatch', 'i': i, 'j': j, 'left': l, 'right': r})
                    break
                if trace:
                    steps.append({'event': 'match', 'i': i, 'j': j, 'left': l, 'right': r})
                l += 1
                r -= 1
            if is_pal and (j - i + 1) > max_len:
                max_len = j - i + 1
                start = i
    end = start + max_len - 1
    exec_time = (time.time() - start_time) * 1000
    meta = {'start_index': start, 'end_index': end, 'execution_time_ms': exec_time, 'algorithm_used': 'brute'}
    if trace:
        meta['steps'] = steps
    return text[start:start+max_len], meta

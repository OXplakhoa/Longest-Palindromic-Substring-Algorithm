from typing import Generator, Dict, Any, List

def trace_brute_force(s: str) -> Generator[Dict[str, Any], None, None]:
    """
    Generator is a literable object meaning we can loop through it and it take the snapshot of the yields
    Here it is used to contain:
    - Dict[str, Any]: Dictonary type with str could be "type", "description",... and Any could be int, list, ...
    - None: Here is the SendType of Generator (None here means we don't send anything back to the function)
    - None: Here is the ReturnType of Generator (None here means we don't return anything)
    """
    n = len(s)
    yield {"type": "init", "description": "Starting Brute Force Algorithm"}
    
    max_len = 0
    start_idx = 0
    
    for i in range(n):
        for j in range(i, n):
            # Highlight the substring being checked
            yield {"type": "select", "indices": [i, j], "description": f"Checking substring s[{i}:{j+1}]"}
            
            # Check if palindrome
            low, high = i, j
            is_palindrome = True
            while low < high:
                # Highlight comparison
                yield {"type": "compare", "indices": [low, high], "description": f"Comparing s[{low}] and s[{high}]"}
                
                if s[low] != s[high]:
                    yield {"type": "mismatch", "indices": [low, high], "description": "Mismatch found"}
                    is_palindrome = False
                    break
                
                yield {"type": "match", "indices": [low, high], "description": "Match found"}
                low += 1
                high -= 1
            
            if is_palindrome:
                curr_len = j - i + 1
                if curr_len > max_len:
                    max_len = curr_len
                    start_idx = i
                    yield {"type": "update_max", "start": i, "end": j, "length": max_len, "description": f"New max length: {max_len}"}
                else:
                     yield {"type": "found", "indices": [i, j], "description": "Palindrome found, but not longer than max"}

def trace_expand_center(s: str) -> Generator[Dict[str, Any], None, None]:
    n = len(s)
    yield {"type": "init", "description": "Starting Expand Around Center Algorithm"}
    
    start_idx = 0
    max_len = 0
    
    for i in range(n):
        # Odd length
        yield {"type": "center", "index": i, "description": f"Expanding around center {i}"}
        l, r = i, i
        while l >= 0 and r < n:
            yield {"type": "compare", "indices": [l, r], "description": f"Comparing s[{l}] and s[{r}]"}
            if s[l] == s[r]:
                yield {"type": "match", "indices": [l, r], "description": "Match"}
                if r - l + 1 > max_len:
                    max_len = r - l + 1
                    start_idx = l
                    yield {"type": "update_max", "start": l, "end": r, "length": max_len, "description": f"New max length: {max_len}"}
                l -= 1
                r += 1
            else:
                yield {"type": "mismatch", "indices": [l, r], "description": "Mismatch"}
                break
        
        # Even length
        l, r = i, i + 1
        if r < n:
            yield {"type": "center", "indices": [l, r], "description": f"Expanding around center {i}, {i+1}"}
            while l >= 0 and r < n:
                yield {"type": "compare", "indices": [l, r], "description": f"Comparing s[{l}] and s[{r}]"}
                if s[l] == s[r]:
                    yield {"type": "match", "indices": [l, r], "description": "Match"}
                    if r - l + 1 > max_len:
                        max_len = r - l + 1
                        start_idx = l
                        yield {"type": "update_max", "start": l, "end": r, "length": max_len, "description": f"New max length: {max_len}"}
                    l -= 1
                    r += 1
                else:
                    yield {"type": "mismatch", "indices": [l, r], "description": "Mismatch"}
                    break

def trace_dynamic_programming(s: str) -> Generator[Dict[str, Any], None, None]:
    n = len(s)
    yield {"type": "init", "description": "Starting Dynamic Programming Algorithm"}
    
    dp = [[False] * n for _ in range(n)]
    max_len = 1
    start_idx = 0
    
    # Length 1
    for i in range(n):
        dp[i][i] = True
        yield {"type": "dp_update", "row": i, "col": i, "value": True, "description": f"Base case: s[{i}] is palindrome"}
    
    # Length 2
    for i in range(n - 1):
        yield {"type": "compare", "indices": [i, i+1], "description": f"Checking s[{i}] == s[{i+1}]"}
        if s[i] == s[i+1]:
            dp[i][i+1] = True
            yield {"type": "match", "indices": [i, i+1], "description": "Match"}
            yield {"type": "dp_update", "row": i, "col": i+1, "value": True, "description": "Set dp table"}
            if max_len < 2:
                max_len = 2
                start_idx = i
                yield {"type": "update_max", "start": i, "end": i+1, "length": 2, "description": "New max length: 2"}
        else:
            yield {"type": "mismatch", "indices": [i, i+1], "description": "Mismatch"}
            yield {"type": "dp_update", "row": i, "col": i+1, "value": False, "description": "Set dp table"}

    # Length 3+
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            yield {"type": "select", "indices": [i, j], "description": f"Checking substring s[{i}:{j+1}]"}
            
            yield {"type": "compare", "indices": [i, j], "description": f"Checking s[{i}] == s[{j}]"}
            if s[i] == s[j]:
                yield {"type": "match", "indices": [i, j], "description": "Ends match"}
                if dp[i+1][j-1]:
                    dp[i][j] = True
                    yield {"type": "dp_check", "row": i+1, "col": j-1, "value": True, "description": "Inner substring is palindrome"}
                    yield {"type": "dp_update", "row": i, "col": j, "value": True, "description": "Set dp table"}
                    
                    if length > max_len:
                        max_len = length
                        start_idx = i
                        yield {"type": "update_max", "start": i, "end": j, "length": max_len, "description": f"New max length: {max_len}"}
                else:
                    yield {"type": "dp_check", "row": i+1, "col": j-1, "value": False, "description": "Inner substring is NOT palindrome"}
                    yield {"type": "dp_update", "row": i, "col": j, "value": False, "description": "Set dp table"}
            else:
                yield {"type": "mismatch", "indices": [i, j], "description": "Ends mismatch"}
                yield {"type": "dp_update", "row": i, "col": j, "value": False, "description": "Set dp table"}

def trace_manacher(s: str) -> Generator[Dict[str, Any], None, None]:
    yield {"type": "init", "description": "Starting Manacher's Algorithm"}
    
    T = '#'.join('^{}$'.format(s))
    n = len(T)
    P = [0] * n
    C = 0
    R = 0
    
    yield {"type": "transform", "string": T, "description": "Transformed string"}
    
    for i in range(1, n - 1):
        yield {"type": "select_center", "index": i, "description": f"Processing center {i} ('{T[i]}')"}
        
        mirror = 2 * C - i
        
        if i < R:
            P[i] = min(R - i, P[mirror])
            yield {"type": "mirror", "index": i, "mirror_index": mirror, "value": P[i], "description": f"Initialized P[{i}] from mirror"}
        
        # Attempt to expand palindrome centered at i
        while T[i + 1 + P[i]] == T[i - 1 - P[i]]:
            yield {"type": "compare", "indices": [i + 1 + P[i], i - 1 - P[i]], "description": f"Comparing {T[i + 1 + P[i]]} and {T[i - 1 - P[i]]}"}
            yield {"type": "match", "indices": [i + 1 + P[i], i - 1 - P[i]], "description": "Match"}
            P[i] += 1
        
        # Show mismatch if not boundary
        # (omitted for brevity, but could add)
        
        # Update center and right boundary if needed
        if i + P[i] > R:
            C = i
            R = i + P[i]
            yield {"type": "update_center", "center": C, "right": R, "description": f"Updated Center to {C}, Right to {R}"}
    
    max_len = max(P)
    center_index = P.index(max_len)
    start = (center_index - max_len) // 2
    yield {"type": "update_max", "start": start, "end": start + max_len - 1, "length": max_len, "description": f"Final max length: {max_len}"}

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
    yield {"type": "init", "description": "Bắt đầu Thuật toán Vét cạn", "line": 1}
    
    # Handle empty string
    if n == 0:
        yield {"type": "result", "description": "Chuỗi rỗng - chuỗi đối xứng dài nhất là chuỗi rỗng", "line": 7, "start": 0, "end": 0, "length": 0}
        return
    
    max_len = 0
    start_idx = 0
    
    for i in range(n):
        yield {"type": "loop_i", "description": f"Vòng lặp ngoài i={i}", "line": 2}
        for j in range(i, n):
            # Highlight the substring being checked
            yield {"type": "select", "indices": [i, j], "description": f"Kiểm tra chuỗi con s[{i}:{j+1}]", "line": 3}
            
            # Check if palindrome
            low, high = i, j
            is_palindrome = True
            yield {"type": "check", "description": "Kiểm tra có phải chuỗi đối xứng...", "line": 4}
            while low < high:
                # Highlight comparison
                yield {"type": "compare", "indices": [low, high], "description": f"So sánh s[{low}] và s[{high}]", "line": 4}
                
                if s[low] != s[high]:
                    yield {"type": "mismatch", "indices": [low, high], "description": "Tìm thấy không khớp", "line": 4}
                    is_palindrome = False
                    break
                
                yield {"type": "match", "indices": [low, high], "description": "Tìm thấy khớp", "line": 4}
                low += 1
                high -= 1
            
            if is_palindrome:
                curr_len = j - i + 1
                if curr_len > max_len:
                    max_len = curr_len
                    start_idx = i
                    yield {"type": "update_max", "start": i, "end": j, "length": max_len, "description": f"Độ dài tối đa mới: {max_len}", "line": 6}
                else:
                     yield {"type": "found", "indices": [i, j], "description": "Tìm thấy chuỗi đối xứng, nhưng không dài hơn tối đa", "line": 5}

def trace_expand_center(s: str) -> Generator[Dict[str, Any], None, None]:
    n = len(s)
    yield {"type": "init", "description": "Bắt đầu Thuật toán Mở rộng quanh Tâm", "line": 1}
    
    # Handle empty string
    if n == 0:
        yield {"type": "result", "description": "Chuỗi rỗng - chuỗi đối xứng dài nhất là chuỗi rỗng", "line": 10, "start": 0, "end": 0, "length": 0}
        return
    
    start_idx = 0
    max_len = 0
    
    for i in range(n):
        # Odd length
        yield {"type": "center", "index": i, "description": f"Mở rộng quanh tâm {i}", "line": 3}
        l, r = i, i
        while l >= 0 and r < n:
            yield {"type": "compare", "indices": [l, r], "description": f"So sánh s[{l}] và s[{r}]", "line": 6}
            if s[l] == s[r]:
                yield {"type": "match", "indices": [l, r], "description": "Khớp", "line": 6}
                if r - l + 1 > max_len:
                    max_len = r - l + 1
                    start_idx = l
                    yield {"type": "update_max", "start": l, "end": r, "length": max_len, "description": f"Độ dài tối đa mới: {max_len}", "line": 8}
                l -= 1
                r += 1
                yield {"type": "expand", "indices": [l, r], "description": "Mở rộng ra ngoài", "line": 9}
            else:
                yield {"type": "mismatch", "indices": [l, r], "description": "Không khớp", "line": 6}
                break
        
        # Even length
        l, r = i, i + 1
        if r < n:
            yield {"type": "center", "indices": [l, r], "description": f"Mở rộng quanh tâm {i}, {i+1}", "line": 4}
            while l >= 0 and r < n:
                yield {"type": "compare", "indices": [l, r], "description": f"So sánh s[{l}] và s[{r}]", "line": 6}
                if s[l] == s[r]:
                    yield {"type": "match", "indices": [l, r], "description": "Khớp", "line": 6}
                    if r - l + 1 > max_len:
                        max_len = r - l + 1
                        start_idx = l
                        yield {"type": "update_max", "start": l, "end": r, "length": max_len, "description": f"Độ dài tối đa mới: {max_len}", "line": 8}
                    l -= 1
                    r += 1
                    yield {"type": "expand", "indices": [l, r], "description": "Mở rộng ra ngoài", "line": 9}
                else:
                    yield {"type": "mismatch", "indices": [l, r], "description": "Không khớp", "line": 6}
                    break

def trace_dynamic_programming(s: str) -> Generator[Dict[str, Any], None, None]:
    n = len(s)
    yield {"type": "init", "description": "Bắt đầu Thuật toán Quy hoạch Động", "line": 1}
    
    # Handle empty string
    if n == 0:
        yield {"type": "result", "description": "Chuỗi rỗng - chuỗi đối xứng dài nhất là chuỗi rỗng", "line": 9, "start": 0, "end": 0, "length": 0}
        return
    
    dp = [[False] * n for _ in range(n)]
    max_len = 1
    start_idx = 0
    
    # Length 1
    for i in range(n):
        dp[i][i] = True
        yield {"type": "dp_update", "row": i, "col": i, "value": True, "description": f"Trường hợp cơ bản: s[{i}] là chuỗi đối xứng", "line": 2}
    
    # Length 2
    for i in range(n - 1):
        yield {"type": "compare", "indices": [i, i+1], "description": f"Kiểm tra s[{i}] == s[{i+1}]", "line": 6}
        if s[i] == s[i+1]:
            dp[i][i+1] = True
            yield {"type": "match", "indices": [i, i+1], "description": "Khớp", "line": 6}
            yield {"type": "dp_update", "row": i, "col": i+1, "value": True, "description": "Đặt bảng dp", "line": 7}
            if max_len < 2:
                max_len = 2
                start_idx = i
                yield {"type": "update_max", "start": i, "end": i+1, "length": 2, "description": "Độ dài tối đa mới: 2", "line": 8}
        else:
            yield {"type": "mismatch", "indices": [i, i+1], "description": "Không khớp", "line": 6}
            yield {"type": "dp_update", "row": i, "col": i+1, "value": False, "description": "Đặt bảng dp", "line": 7}

    # Length 3+
    for length in range(3, n + 1):
        yield {"type": "loop_len", "description": f"Kiểm tra độ dài {length}", "line": 3}
        for i in range(n - length + 1):
            j = i + length - 1
            yield {"type": "select", "indices": [i, j], "description": f"Kiểm tra chuỗi con s[{i}:{j+1}]", "line": 4}
            
            yield {"type": "compare", "indices": [i, j], "description": f"Kiểm tra s[{i}] == s[{j}]", "line": 6}
            if s[i] == s[j]:
                yield {"type": "match", "indices": [i, j], "description": "Hai đầu khớp", "line": 6}
                if dp[i+1][j-1]:
                    dp[i][j] = True
                    yield {"type": "dp_check", "row": i+1, "col": j-1, "value": True, "description": "Chuỗi con bên trong là chuỗi đối xứng", "line": 6}
                    yield {"type": "dp_update", "row": i, "col": j, "value": True, "description": "Đặt bảng dp", "line": 7}
                    
                    if length > max_len:
                        max_len = length
                        start_idx = i
                        yield {"type": "update_max", "start": i, "end": j, "length": max_len, "description": f"Độ dài tối đa mới: {max_len}", "line": 8}
                else:
                    yield {"type": "dp_check", "row": i+1, "col": j-1, "value": False, "description": "Chuỗi con bên trong KHÔNG phải chuỗi đối xứng", "line": 6}
                    yield {"type": "dp_update", "row": i, "col": j, "value": False, "description": "Đặt bảng dp", "line": 7}
            else:
                yield {"type": "mismatch", "indices": [i, j], "description": "Hai đầu không khớp", "line": 6}
                yield {"type": "dp_update", "row": i, "col": j, "value": False, "description": "Đặt bảng dp", "line": 7}

def trace_manacher(s: str) -> Generator[Dict[str, Any], None, None]:
    yield {"type": "init", "description": "Bắt đầu Thuật toán Manacher", "line": 1}
    
    # Handle empty string
    if len(s) == 0:
        yield {"type": "result", "description": "Chuỗi rỗng - chuỗi đối xứng dài nhất là chuỗi rỗng", "line": 8, "start": 0, "end": 0, "length": 0}
        return
    
    T = '#'.join('^{}$'.format(s))
    n = len(T)
    P = [0] * n
    C = 0
    R = 0
    
    yield {"type": "transform", "string": T, "description": "Chuỗi đã chuyển đổi", "line": 1}
    yield {"type": "init_vars", "description": "Đã khởi tạo P, C, R", "line": 2}
    
    for i in range(1, n - 1):
        yield {"type": "select_center", "index": i, "description": f"Xử lý tâm {i} ('{T[i]}')", "line": 3}
        
        mirror = 2 * C - i
        yield {"type": "calc_mirror", "index": i, "mirror_index": mirror, "description": f"Chỉ số đối xứng = {mirror}", "line": 4}
        
        if i < R:
            P[i] = min(R - i, P[mirror])
            yield {"type": "mirror", "index": i, "mirror_index": mirror, "value": P[i], "description": f"Khởi tạo P[{i}] từ đối xứng", "line": 5}
        
        # Attempt to expand palindrome centered at i
        while T[i + 1 + P[i]] == T[i - 1 - P[i]]:
            yield {"type": "compare", "indices": [i + 1 + P[i], i - 1 - P[i]], "description": f"So sánh {T[i + 1 + P[i]]} và {T[i - 1 - P[i]]}", "line": 6}
            yield {"type": "match", "indices": [i + 1 + P[i], i - 1 - P[i]], "description": "Khớp", "line": 6}
            P[i] += 1
        
        # Show mismatch if not boundary
        # (omitted for brevity, but could add)
        
        # Update center and right boundary if needed
        if i + P[i] > R:
            C = i
            R = i + P[i]
            yield {"type": "update_center", "center": C, "right": R, "description": f"Cập nhật Tâm thành {C}, Phải thành {R}", "line": 7}
    
    max_len = max(P)
    center_index = P.index(max_len)
    # Convert back to original string indices
    start = (center_index - max_len) // 2
    end = start + max_len - 1
    yield {"type": "update_max", "start": start, "end": end, "length": max_len, "description": f"Độ dài tối đa cuối cùng: {max_len}"}

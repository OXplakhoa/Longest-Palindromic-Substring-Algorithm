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
    yield {"type": "init", "description": "Bắt đầu Thuật toán Vét cạn", "line": [1,2]}
    
    # Handle empty string
    if n == 0:
        yield {"type": "result", "description": "Chuỗi rỗng - chuỗi đối xứng dài nhất là chuỗi rỗng", "line": [3], "start": 0, "end": 0, "length": 0}
        return
    
    max_len = 0
    start_idx = 0
    
    for i in range(n):
        yield {"type": "loop_i", "description": f"Vòng lặp ngoài i={i}", "line": [4]}
        for j in range(i, n):
            yield {"type": "loop_j", "description": f"Vòng lặp trong j={j}", "line": [5]}
            # Highlight the substring being checked
            yield {"type": "select", "indices": [i, j], "description": f"Kiểm tra chuỗi con s[{i}:{j+1}]", "line": [6]}
            
            # Check if palindrome
            low, high = i, j
            is_palindrome = True
            yield {"type": "check", "description": f"Khởi tạo con trỏ low={i} và high={j}", "line": [7]}
            while low < high:
                yield {"type": "loop_low_high", "description": f"Vòng lặp trong low={low} và high={high}", "line": [8]}
                # Highlight comparison
                yield {"type": "compare", "indices": [low, high], "description": f"So sánh s[{low}] và s[{high}]", "line": [9]}
                
                if s[low] != s[high]:
                    yield {"type": "mismatch", "indices": [low, high], "description": "Không khóp, thoát vòng lặp", "line": [10]}
                    is_palindrome = False
                    break
                
                yield {"type": "match", "indices": [low, high], "description": "Khớp và dịch chuyển 2 con trỏ", "line": [11]}
                low += 1
                high -= 1
            
            if is_palindrome:
                curr_len = j - i + 1
                if curr_len > max_len:
                    max_len = curr_len
                    start_idx = i
                    yield {"type": "update_max", "start": i, "end": j, "length": max_len, "description": f"Độ dài tối đa mới: {max_len}", "line": [13]}
                else:
                    yield {"type": "found", "indices": [i, j], "description": "Tìm thấy chuỗi đối xứng, nhưng không dài hơn tối đa", "line": [12]}

def trace_expand_center(s: str) -> Generator[Dict[str, Any], None, None]:
    n = len(s)
    yield {"type": "init", "description": "Bắt đầu Thuật toán Mở rộng quanh Tâm", "line": [1,2,3]}
    start, maxLen = 0, 0
    if n == 0:
        yield {"type": "result", "description": "Chuỗi rỗng - chuỗi đối xứng dài nhất là chuỗi rỗng", "line": [4], "start": 0, "end": 0, "length": 0}
        return
    for i in range(n):
        yield {"type": "loop_i", "description": f"Vòng lặp ngoài i={i}", "line": [5]}
        for j in range(2):
            yield {"type": "loop_j", "description": f"Vòng lặp trong j={j}", "line": [6]}
            low, high = i, i + j
            yield {"type": "check", "description": f"Khởi tạo con trỏ low={low} và high={high}", "line": [7]}
            yield {"type": "loop_condition", "description": f"Kiểm tra điều kiện while: low={low}>=0 và high={high}<{n}", "line": [8]}
            while low >= 0 and high < n:
                yield {"type": "compare", "indices": [low, high], "description": f"So sánh s[{low}] và s[{high}]", "line": [9]}
                if s[low] != s[high]:
                    yield {"type": "mismatch", "indices": [low, high], "description": "Không khớp, thoát vòng lặp", "line": [10]}
                    break
                currLen = high - low + 1
                if currLen > maxLen:
                    start = low
                    maxLen = currLen
                    yield {"type": "update_max", "start": low, "end": high, "length": maxLen, "description": f"Độ dài tối đa mới: {maxLen}", "line": [11]}
                else:
                    yield {"type": "found", "indices": [low, high], "description": "Tìm thấy chuỗi đối xứng, nhưng không dài hơn tối đa", "line": [11]}
                yield {"type": "match", "indices": [low, high], "description": "Khớp, mở rộng sang 2 bên", "line": [12]}
                low -= 1
                high += 1
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

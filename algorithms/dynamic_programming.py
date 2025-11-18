# Dynamic Programming Algorithm for Longest Palindromic Substring
def longest_palindrome(s, trace = False):
    n = len(s)
    if n == 0:
        return ("", {"steps": []}) if trace else ""
    # Bảng để lưu trữ thông tin về chuỗi con đối xứng, ban đầu tất cả là False với kích thước n x n
    # dp[i][j] = True nếu s[i..j] là chuỗi đối xứng
    dp = [[False] * n for _ in range(n)]
    
    # dp[i][j] nếu chuỗi con từ [i tới j] là chuỗi đối xứng hoặc không
    start = 0
    maxLen = 1

    steps = []  # trace events

    def record(i, j, value):
        if trace:
            steps.append({"event": "dp-fill", "i": i, "j": j, "value": bool(value)})
            # print a lightweight visual of dp to console
            print_dp()

    def print_dp():
        # print header
        header = "   " + " ".join(f"{k}" for k in range(n))
        print(header)
        for r in range(n):
            row = f"{r}: " + " ".join("1" if dp[r][c] else "0" for c in range(n))
            print(row)
        print("-" * max(10, n*2))

    # Tất cả chuỗi con dài 1 ký tự đều là chuỗi đối xứng
    for i in range(n):
        dp[i][i] = True
        record(i, i, True)
    
    # Kiểm tra chuỗi con dài 2 ký tự
    for i in range(n - 1):
        val = (s[i] == s[i + 1])
        dp[i][i + 1] = val
        record(i, i + 1, val)
        if val and maxLen == 1:
            start = i
            maxLen = 2
                
    # Kiểm tra chuỗi con dài từ 3 tới n
    for length in range(3, n+1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            # Nếu s[i] == s[j] thì kiểm tra tiếp cho chuôi [i+1..j-1]
            val = (s[i] == s[j] and dp[i + 1][j - 1])
            dp[i][j] = val
            record(i, j, val)
            if val and length > maxLen:
                start = i
                maxLen = length
                    
    result = s[start:start + maxLen]
    return (result, {"steps": steps}) if trace else result

# Ví dụ sử dụng
if __name__ == "__main__":
    input_str = "日本語本日"
    # run with trace to both collect step events and print dp table as it fills
    result, meta = longest_palindrome(input_str, trace=True)
    print(f"Chuỗi con đối xứng dài nhất trong '{input_str}' là: '{result}'")
    print(f"Events collected: {len(meta['steps'])}")
    
# Visualize varibles
s = "agbaba"
n = len(s)
for length in range(3, n+1):
    for i in range(n - length + 1):
        j = i + length - 1
        print(f"length: {length}, i: {i}, j: {j}")
print(s[2:5])
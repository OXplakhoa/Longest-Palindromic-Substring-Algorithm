# Dynamic Programming Algorithm for Longest Palindromic Substring
def longest_palindrome(s, trace = False):
    n = len(s)
    # Bảng để lưu trữ thông tin về chuỗi con đối xứng, ban đầu tất cả là False với kích thước n x n
    # dp[i][j] = True nếu s[i..j] là chuỗi đối xứng
    dp = [[False] * n for _ in range(n)]
    
    # dp[i][j] nếu chuỗi con từ [i tới j] là chuỗi đối xứng hoặc không
    start = 0
    maxLen = 1
    
    # Tất cả chuỗi con dài 1 ký tự đều là chuỗi đối xứng
    for i in range(n):
        dp[i][i] = True
    
    # Kiểm tra chuỗi con dài 2 ký tự
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
            if maxLen == 1:
                start = i
                maxLen = 2
                
    # Kiểm tra chuỗi con dài từ 3 tới n
    for length in range(3, n+1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            # Nếu s[i] == s[j] thì kiểm tra tiếp cho chuôi [i+1..j-1]
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
                if length > maxLen:
                    start = i
                    maxLen = length
                    
    return s[start:start + maxLen]

# Ví dụ sử dụng
if __name__ == "__main__":
    input_str = "racecar"
    result = longest_palindrome(input_str)
    print(f"Chuỗi con đối xứng dài nhất trong '{input_str}' là: '{result}'") 
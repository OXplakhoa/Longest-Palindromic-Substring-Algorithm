# Expand Around Centers Algorithm for Longest Palindromic Substring
def longest_palindrome(s):
    n = len(s)
    
    start, maxLen = 0, 1 #maxLen = 1 vì tất cả chuỗi con dài 1 ký tự đều là chuỗi đối xứng
    
    for i in range(n):
        
        # Loop này chạy 2 lần cho cả chẵn và lẻ
        # j = 0 cho chuỗi lẻ và j = 1 cho chuỗi chẵn
        for j in range(2): # Handle chuỗi 2 ký tự
            low, high = i, i + j
            
            # Mở rộng từ tâm ra 2 bên trong giới hạn
            while low >= 0 and high < n and s[low] == s[high]:
                currLen = high - low + 1
                if currLen > maxLen:
                    start = low
                    maxLen = currLen
                low -= 1
                high += 1
                
    return s[start:start + maxLen]

# Test
if __name__ == "__main__":
    input_str = "日本語日本"
    result = longest_palindrome(input_str)
    print(f"Chuỗi con đối xứng dài nhất trong '{input_str}' là: '{result}'")
# Brute Force Algorithm for Longest Palindromic Substring

# Hàm kiểm tra nếu chuỗi con s[low..high] là chuỗi đối xứng
def check_palindrome(s, low, high):
    while low < high:
        if s[low] != s[high]:
            return False
        low += 1
        high -= 1
    return True

# Hàm tìm chuỗi con đối xứng dài nhất trong chuỗi s
def longest_palindrome(s, trace = False):
    
    n = len(s)
    if n < 1:
        return "", {}

    # Tất cả chuỗi con dài 1 ký tự đều là chuỗi đối xứng
    maxLen = 1
    start = 0
    
    # Lặp qua tất cả các cặp chỉ số (i, j)
    for i in range(n):
        for j in range(i, n):
            
            # Kiểm tra nếu chuỗi con s[i..j] là chuỗi đối xứng
            # Và kiểm tra nếu độ dài của nó lớn hơn maxLen hiện tại
            if check_palindrome(s, i, j) and (j - i + 1) > maxLen:
                start = i
                maxLen = j - i + 1
                
    return s[start:start + maxLen], {}

# Ví dụ sử dụng
if __name__ == "__main__":
    input_str = "abba"
    result = longest_palindrome(input_str)
    print(f"Chuỗi con đối xứng dài nhất trong '{input_str}' là: '{result[0]}'") 
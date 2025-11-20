# Manacher's Algorithm for Longest Palindromic Substring
def longest_palindrome(s):
    def transform(s):
        return '#'.join('^{}$'.format(s))
    T = transform(s) # Transform
    m = len(T) # Length of transformed string
    P = [0]*m # Palindromic radius array
    C = 0 # Center 
    R = 0 # Right boundary
    for i in range(1, m-1): # Skip ^ and $
        mirror = 2*C - i
        if i < R:
            P[i] = min(R - i, P[mirror])
        
        # Attempt to expand palindrome centered at i
        while T[i + 1 + P[i]] == T[i - 1 - P[i]]: 
            P[i] += 1
        
        # Update center and right boundary if needed
        if i + P[i] > R:
            C = i
            R = i + P[i]

    max_len = max(P)
    center_index = P.index(max_len)
    start = (center_index - max_len) // 2

    return s[start:start+max_len]   

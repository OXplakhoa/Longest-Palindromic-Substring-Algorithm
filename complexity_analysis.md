# Complexity Analysis of Longest Palindromic Substring Algorithms

This document provides a theoretical analysis of the time and space complexity for the implemented algorithms.

## 1. Brute Force
- **Time Complexity**: $O(N^3)$
    - There are $N(N+1)/2$ substrings (which is $O(N^2)$).
    - Checking if a substring is a palindrome takes $O(N)$.
    - Total: $O(N^2) \times O(N) = O(N^3)$.
- **Space Complexity**: $O(1)$
    - We only store a few variables (`maxLen`, `start`) and do not use any auxiliary data structures proportional to the input size (excluding the result string).

## 2. Dynamic Programming
- **Time Complexity**: $O(N^2)$
    - We fill a table of size $N \times N$.
    - Each cell `dp[i][j]` is computed in $O(1)$ time using previously computed values.
- **Space Complexity**: $O(N^2)$
    - We use a 2D array of size $N \times N$ to store the palindrome status of substrings.

## 3. Expand Around Center
- **Time Complexity**: $O(N^2)$
    - There are $2N - 1$ centers (N single-character centers and N-1 two-character centers).
    - Expanding from each center takes at most $O(N)$ time.
    - Total: $O(N) \times O(N) = O(N^2)$.
- **Space Complexity**: $O(1)$
    - Similar to Brute Force, we only use a few variables.

## 4. Manacher's Algorithm
- **Time Complexity**: $O(N)$
    - This algorithm uses the property of palindromes to avoid unnecessary re-computations.
    - The center `C` and right boundary `R` only move to the right.
    - The inner while loop runs at most $N$ times in total across all iterations.
- **Space Complexity**: $O(N)$
    - We use a transformed string `T` of length $2N + 3$.
    - We use an array `P` of length $2N + 3$ to store the radius of palindromes.

## Summary Table

| Algorithm | Time Complexity | Space Complexity | Best For |
| :--- | :--- | :--- | :--- |
| **Brute Force** | $O(N^3)$ | $O(1)$ | Very small strings, testing correctness |
| **Dynamic Programming** | $O(N^2)$ | $O(N^2)$ | Small to medium strings, understanding DP |
| **Expand Around Center** | $O(N^2)$ | $O(1)$ | Medium strings, space-constrained environments |
| **Manacher's Algorithm** | $O(N)$ | $O(N)$ | Large strings, optimal performance |

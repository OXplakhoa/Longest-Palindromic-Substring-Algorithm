# Final Project: Longest Palindromic Substring Algorithm

## Project Overview
This project implements and analyzes various algorithms for finding the longest palindromic substring in a given string, with a web-based demonstration interface.

---

## 1. Requirements Analysis

### Functional Requirements
- Accept string input from users (text of varying lengths)
- Find and return the longest palindromic substring
- Handle edge cases: empty strings, single characters, all identical characters
- Display the result with the palindrome highlighted
- Show algorithm execution time and complexity metrics
- Allow comparison between different algorithmic approaches

### Non-Functional Requirements
- Response time: < 1 second for strings up to 10,000 characters
- Accuracy: 100% correctness in finding the longest palindrome
- User-friendly web interface
- Support for multiple languages/character sets (Unicode)
- Responsive design for mobile and desktop

### Input Constraints
- Minimum length: 0 characters
- Maximum length: 10,000 characters (for performance demonstration)
- Character set: Any Unicode characters

---

## 2. Database Design

### Database Choice: **SQLite** (for development) / **PostgreSQL** (for production)

**Rationale:**
- Store test cases and benchmark results
- Track algorithm performance metrics
- Maintain user query history (optional)
- Lightweight for development, scalable for production

### Database Schema

```sql
-- Test Cases Table
CREATE TABLE test_cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    input_string TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Algorithm Results Table
CREATE TABLE algorithm_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_case_id INTEGER,
    algorithm_name VARCHAR(50) NOT NULL,
    execution_time_ms FLOAT NOT NULL,
    result TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id)
);

-- Performance Metrics Table
CREATE TABLE performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    algorithm_name VARCHAR(50) NOT NULL,
    input_length INTEGER NOT NULL,
    avg_time_ms FLOAT NOT NULL,
    memory_usage_mb FLOAT,
    date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Optional: Visualization traces for step-by-step playback
CREATE TABLE visualization_traces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id VARCHAR(64) NOT NULL,
    algorithm_name VARCHAR(50) NOT NULL,
    step_index INTEGER NOT NULL,
    event_type VARCHAR(50) NOT NULL,       -- e.g., 'center', 'expand', 'match', 'mismatch', 'dp-fill'
    payload JSON,                          -- algorithm-specific data (indices, values)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Text diff sessions (real-world application)
CREATE TABLE diff_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text_a TEXT NOT NULL,
    text_b TEXT NOT NULL,
    operations JSON NOT NULL,              -- diff ops list (keep/insert/delete/replace)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Algorithm Design

### 3.1 Algorithm Approaches

We will implement and compare **FOUR** approaches:

#### A. Brute Force (Baseline)
#### B. Dynamic Programming (Optimal)
#### C. Expand Around Centers (Efficient)
#### D. Manacher's Algorithm (Linear time)

---

### 3.2 Pseudocode

#### **Approach A: Brute Force**
```
FUNCTION longestPalindrome_BruteForce(s):
    IF length(s) < 2 THEN
        RETURN s
    END IF
    
    maxLen = 0
    start = 0
    n = length(s)
    
    FOR i = 0 TO n-1 DO
        FOR j = i TO n-1 DO
            IF isPalindrome(s, i, j) AND (j - i + 1) > maxLen THEN
                maxLen = j - i + 1
                start = i
            END IF
        END FOR
    END FOR
    
    RETURN substring(s, start, start + maxLen)
END FUNCTION

FUNCTION isPalindrome(s, left, right):
    WHILE left < right DO
        IF s[left] != s[right] THEN
            RETURN false
        END IF
        left = left + 1
        right = right - 1
    END WHILE
    RETURN true
END FUNCTION
```

**Time Complexity:** O(n³)
**Space Complexity:** O(1)

---

#### **Approach B: Dynamic Programming**
```
FUNCTION longestPalindrome_DP(s):
    n = length(s)
    IF n < 2 THEN
        RETURN s
    END IF
    
    // Create DP table: dp[i][j] = true if s[i..j] is palindrome
    dp = 2D array of size n x n, initialized to false
    maxLen = 1
    start = 0
    
    // Base case: single characters
    FOR i = 0 TO n-1 DO
        dp[i][i] = true
    END FOR
    
    // Check for length 2
    FOR i = 0 TO n-2 DO
        IF s[i] == s[i+1] THEN
            dp[i][i+1] = true
            start = i
            maxLen = 2
        END IF
    END FOR
    
    // Check for lengths greater than 2
    FOR len = 3 TO n DO
        FOR i = 0 TO n-len DO
            j = i + len - 1
            
            IF s[i] == s[j] AND dp[i+1][j-1] THEN
                dp[i][j] = true
                start = i
                maxLen = len
            END IF
        END FOR
    END FOR
    
    RETURN substring(s, start, start + maxLen)
END FUNCTION
```

**Time Complexity:** O(n²)
**Space Complexity:** O(n²)

---

#### **Approach C: Expand Around Centers**
```
FUNCTION longestPalindrome_ExpandCenter(s):
    IF length(s) < 2 THEN
        RETURN s
    END IF
    
    start = 0
    maxLen = 0
    
    FOR i = 0 TO length(s)-1 DO
        // Check odd-length palindromes (single center)
        len1 = expandAroundCenter(s, i, i)
        
        // Check even-length palindromes (two centers)
        len2 = expandAroundCenter(s, i, i+1)
        
        len = MAX(len1, len2)
        
        IF len > maxLen THEN
            maxLen = len
            start = i - (len - 1) / 2
        END IF
    END FOR
    
    RETURN substring(s, start, start + maxLen)
END FUNCTION

FUNCTION expandAroundCenter(s, left, right):
    WHILE left >= 0 AND right < length(s) AND s[left] == s[right] DO
        left = left - 1
        right = right + 1
    END WHILE
    
    RETURN right - left - 1
END FUNCTION
```

**Time Complexity:** O(n²)
**Space Complexity:** O(1)

---

#### **Approach D: Manacher's Algorithm**
```
// Transform s into T by inserting separators to handle even/odd uniformly
// Example: s = "abba" -> T = "^#a#b#b#a#$" (using sentinels ^ and $)

FUNCTION longestPalindrome_Manacher(s):
    n = length(s)
    IF n < 2 THEN
        RETURN s
    END IF

    T = transformWithHashes(s)      // length m = 2*n + 3, with ^ at start and $ at end
    m = length(T)
    P = array of zeros length m     // P[i] = radius of palindrome centered at i in T
    C = 0                           // current center
    R = 0                           // right boundary of current rightmost palindrome

    FOR i = 1 TO m-2 DO             // skip sentinels at 0 and m-1
        mirror = 2*C - i            // mirror position of i w.r.t center C
        IF i < R THEN
            P[i] = MIN(R - i, P[mirror])
        END IF

        // attempt to expand palindrome centered at i
        WHILE T[i + 1 + P[i]] == T[i - 1 - P[i]] DO
            P[i] = P[i] + 1
        END WHILE

        // if palindrome centered at i expands past R, adjust center based on expanded palindrome
        IF i + P[i] > R THEN
            C = i
            R = i + P[i]
        END IF
    END FOR

    // find the maximum element in P
    maxLen = 0
    centerIndex = 0
    FOR i = 1 TO m-2 DO
        IF P[i] > maxLen THEN
            maxLen = P[i]
            centerIndex = i
        END IF
    END FOR

    // map back to original string indices
    start = (centerIndex - maxLen) / 2
    RETURN substring(s, start, start + maxLen)
END FUNCTION

FUNCTION transformWithHashes(s):
    // Build string: ^#s0#s1#...#sn-1#$
    T = "^#"
    FOR each ch in s DO
        T = T + ch + "#"
    END FOR
    T = T + "$"
    RETURN T
END FUNCTION
```

**Time Complexity:** O(n)
**Space Complexity:** O(n)

---

### 3.3 Flowchart Design

```
[START]
    |
    v
[Input String s]
    |
    v
[Is length(s) < 2?] ---Yes---> [Return s]
    |                              |
    No                             v
    |                          [END]
    v
[Initialize: start=0, maxLen=0]
    |
    v
[Choose Algorithm:]
    |
    +---> [Brute Force] ---> [Nested loops + isPalindrome check]
    |
    +---> [Dynamic Programming] ---> [Build DP table bottom-up]
    |
    +---> [Expand Centers] ---> [For each center, expand outward]
    |
    +---> [Manacher's] ---> [Transform string, scan i with mirror, expand, update C/R, track P[i]]
    |
    v
[Update start and maxLen when longer palindrome found]
    |
    v
[Extract substring(s, start, start + maxLen)]
    |
    v
[Return result]
    |
    v
[END]
```

**Detailed Flowchart for Expand Around Centers:**
```
[START Expand Around Centers]
    |
    v
[For i = 0 to n-1]
    |
    v
[Expand around single center (i, i)] --> [Get length len1]
    |
    v
[Expand around double center (i, i+1)] --> [Get length len2]
    |
    v
[len = MAX(len1, len2)]
    |
    v
[Is len > maxLen?] ---Yes---> [Update maxLen and start position]
    |                              |
    No                             |
    |                              |
    v <----------------------------+
[Next i]
    |
    v
[All centers checked?] ---No---> [Continue loop]
    |
    Yes
    v
[Return substring(s, start, start + maxLen)]
    |
    v
[END]
```

**Detailed Flowchart for Manacher's Algorithm:**
```
[START Manacher]
    |
    v
[Transform s -> T with sentinels and separators]
    |
    v
[Init arrays: P[0..m-1]=0, C=0, R=0]
    |
    v
[For i = 1 to m-2]
    |
    v
[mirror = 2*C - i]
    |
    v
[If i < R: P[i] = min(R - i, P[mirror])]
    |
    v
[While T[i+1+P[i]] == T[i-1-P[i]]: P[i]++]
    |
    v
[If i + P[i] > R: set C = i, R = i + P[i]]
    |
    v
[Next i]
    |
    v
[Find i with max P[i], compute start]
    |
    v
[Return substring in s]
    |
    v
[END]
```

---

## 4. Complexity Analysis and Comparison

### 4.1 Time Complexity Comparison

| Algorithm | Best Case | Average Case | Worst Case | Space |
|-----------|-----------|--------------|------------|-------|
| Brute Force | O(n³) | O(n³) | O(n³) | O(1) |
| Dynamic Programming | O(n²) | O(n²) | O(n²) | O(n²) |
| Expand Around Centers | O(n²) | O(n²) | O(n²) | O(1) |
| Manacher's Algorithm | O(n) | O(n) | O(n) | O(n) |

### 4.2 Detailed Analysis

#### Brute Force
- **Pros:** Simple to understand and implement
- **Cons:** Extremely slow for large inputs (O(n³))
- **Use Case:** Educational purposes, very small strings (n < 20)

#### Dynamic Programming
- **Pros:** Optimal time complexity, systematic approach
- **Cons:** High space usage O(n²), not practical for very long strings
- **Use Case:** Medium-sized strings (n < 5000), when space is not critical

#### Expand Around Centers
- **Pros:** Best balance of time O(n²) and space O(1), intuitive
- **Cons:** Slightly more complex logic than brute force
- **Use Case:** **RECOMMENDED** for general-purpose use, handles large strings efficiently

#### Manacher's Algorithm
- **Pros:** Linear-time solution; deterministic performance; excellent for very long strings
- **Cons:** More complex to implement and explain; requires transformed string and auxiliary array
- **Use Case:** Handling very long inputs (n ≥ 10k) where O(n²) approaches may time out; for showcasing algorithmic optimization

### 4.3 Benchmark Plan

Test with various input types:
1. Short strings (n < 100)
2. Medium strings (100 < n < 1000)
3. Long strings (1000 < n < 10000)
4. Edge cases: all same characters, no palindromes, entire string is palindrome

---

## 5. Testing Strategy (100% Correctness)

### 5.1 Test Cases

Note on expected outputs: when multiple longest answers exist, list all acceptable results using a set for deterministic assertions.

```python
test_cases = [
    # Basic cases (ties allowed)
    ("babad", {"bab", "aba"}),
    ("cbbd", {"bb"}),

    # Edge cases
    ("", {""}),
    ("a", {"a"}),
    ("aa", {"aa"}),

    # Entire string is palindrome (odd/even)
    ("racecar", {"racecar"}),
    ("abba", {"abba"}),

    # Multiple palindromes with a unique longest
    ("abacabad", {"abacaba"}),

    # No palindrome longer than 1
    ("abcdef", {"a", "b", "c", "d", "e", "f"}),

    # All same characters (long run)
    ("aaaaaaa", {"aaaaaaa"}),

    # Long palindrome in the middle
    ("xyzabcdedcbapqr", {"abcdedcba"}),

    # Palindrome at string start/end boundaries
    ("racecarXYZ", {"racecar"}),
    ("XYZabba", {"abba"}),

    # Even-length vs odd-length tie
    ("abccbae", {"abccba"}),
    ("cabbaab", {"abba", "baab"}),

    # Whitespace and punctuation
    ("a man, a plan", {" a p a " , "ana" , " a a "}),  # depending on punctuation handling (literal match)

    # Case sensitivity (default: case-sensitive)
    ("Aa", {"A", "a"}),

    # Unicode and multi-byte characters
    ("日本語本日", {"日本語本日", "本語本"}),
    ("mañana", {"aña"}),
    ("😊abccba😊", {"😊abccba😊"}),

    # Combining characters (normalization may affect matching)
    ("e\u0301e", {"e\u0301e"}),  # "e01" is combining acute; consider NFC normalization in app

    # Special symbols
    ("a!@#@!a", {"a!@#@!a"}),

    # Stress tests
    ("a" * 5000 + "b" + "a" * 5000, {"a" * 5000}),
    ("abc" * 1000, {"a", "b", "c"})
]
```

Testing notes:
- Treat input as literal (no preprocessing) unless normalization is explicitly enabled; if using Unicode normalization, specify NFC and normalize both input and expectations.
- Assertions should accept any element from the expected set.
- For performance tests, generate random strings with fixed seeds to keep runs reproducible.

### 5.2 Validation Strategy

1. **Unit Testing:** Test each function independently
2. **Integration Testing:** Test complete algorithm flow
3. **Comparison Testing:** Verify all algorithms produce same result
4. **Performance Testing:** Measure execution time for each approach
5. **Edge Case Testing:** Ensure 100% correctness on boundary conditions

### 5.3 Correctness Verification

```python
def verify_palindrome(s, result):
    # Check if result is actually a palindrome
    if result != result[::-1]:
        return False
    
    # Check if result is a substring of s
    if result not in s:
        return False
    
    # Check if there's a longer palindrome
    # (This requires running all algorithms and comparing)
    
    return True
```

---

## 6. Web Application Design

### 6.1 Technology Stack

**Frontend:**
- HTML5, CSS3 (Tailwind CSS for styling)
- JavaScript (vanilla or React for interactivity)
- Chart.js for performance visualization

**Backend:**
- Python (Flask or FastAPI)
- SQLite/PostgreSQL for data storage

**Deployment:**
- Heroku, Vercel, or Render (free tier)
- Docker container (optional)

### 6.2 Web Interface Features

1. **Input Section:**
   - Text area for string input
   - Character counter
   - Sample inputs dropdown

2. **Algorithm Selection:**
   - Radio buttons to choose algorithm
   - "Compare All" option

3. **Results Display:**
   - Highlighted palindrome in original string
   - Execution time
   - Algorithm complexity info
   - Visual representation (colored highlighting)

4. **Performance Dashboard:**
   - Real-time comparison charts
   - Time vs. input length graph
   - Algorithm comparison table

5. **Educational Section:**
   - Pseudocode display
   - Step-by-step visualization
   - Complexity explanation

6. **Algorithm Visualizer (Step-by-step):**
   - Toggle "Trace mode" to capture steps for DP, Expand-Center, and Manacher's
   - Playback controls: play/pause, next/prev step, speed slider
   - Visual cues:
     - DP: grid cells being filled, transitions for true/false
     - Expand-Center: left/right pointers expanding per center
     - Manacher's: transformed string T, current center C, right boundary R, and P[i] bars
   - Tooltips on hover showing indices, substring ranges, and decisions

7. **Text Compare Mode (Real-world app):**
   - Two text areas (A and B)
   - Compute diff using LCS; highlight insertions/deletions/replacements
   - Option to overlay and highlight longest palindromic substrings within A and B
   - Export result as HTML or JSON

### 6.3 API Endpoints

```
POST /api/find-palindrome
    Request: { "text": "string", "algorithm": "manacher|expand|dp|brute" }
    Response: { 
        "palindrome": "result",
        "start_index": int,
        "end_index": int,
        "execution_time_ms": float,
        "algorithm_used": "string"
    }

POST /api/compare-algorithms
    Request: { "text": "string" }
    Response: {
        "results": [
            {
                "algorithm": "name",
                "palindrome": "result",
                "execution_time_ms": float
            },
            ...
        ]
    }

GET /api/test-cases
    Response: { "test_cases": [...] }

POST /api/trace-palindrome
    Request: { "text": "string", "algorithm": "manacher|expand|dp", "trace": true }
    Response: {
        "palindrome": "result",
        "steps": [
            { "step": 0, "event": "center", "i": 7, "left": 6, "right": 8 },
            { "step": 1, "event": "expand", "left": 5, "right": 9, "match": true },
            ...
        ]
    }

POST /api/diff
    Request: { "text_a": "string", "text_b": "string" }
    Response: {
        "operations": [
            { "op": "equal", "text": "..." },
            { "op": "delete", "text": "..." },
            { "op": "insert", "text": "..." }
        ],
        "lcs_length": int,
        "palindrome_a": { "value": "...", "start": int, "end": int },
        "palindrome_b": { "value": "...", "start": int, "end": int }
    }
```

---

## 7. Implementation Plan

### Phase 1: Algorithm Implementation (Week 1)
- [ ] Implement Brute Force algorithm
- [ ] Implement Dynamic Programming algorithm
- [ ] Implement Expand Around Centers algorithm
- [ ] Implement Manacher's Algorithm
- [ ] Write unit tests for all algorithms

### Phase 2: Testing & Validation (Week 2)
- [ ] Create comprehensive test suite
- [ ] Verify 100% correctness
- [ ] Benchmark performance
- [ ] Document complexity analysis

### Phase 3: Database Setup (Week 2)
- [ ] Design and create database schema
- [ ] Populate test cases
- [ ] Implement data access layer

### Phase 4: Web Application (Week 3)
- [ ] Build backend API (Flask/FastAPI)
- [ ] Create frontend interface
- [ ] Integrate algorithms with web app
- [ ] Add visualization features (DP grid, center expansion, Manacher's P-array)
- [ ] Implement Trace API and playback UI
- [ ] Add Text Compare (Diff) mode using LCS

### Phase 5: Deployment & Documentation (Week 4)
- [ ] Deploy to web hosting platform
- [ ] Write final report
- [ ] Create presentation materials
- [ ] Prepare demo

---

## 8. Expected Deliverables

1. **Source Code:**
   - Python implementation of all algorithms
   - Web application (frontend + backend)
   - Database schema and seed data
   - Unit tests and integration tests
   - Trace capture utilities for visualization
   - Text diff (LCS) module and UI

2. **Documentation:**
   - Algorithm analysis report
   - Complexity comparison charts
   - User manual for web application
   - API documentation

3. **Presentation:**
   - Flowcharts and pseudocode
   - Performance benchmarks
   - Live demo of web application
   - Correctness verification results

4. **Repository:**
   - GitHub repository with complete code
   - README with setup instructions
   - Requirements.txt for dependencies

---

## 9. Success Criteria

✅ **Requirements Analysis:** Complete functional and non-functional requirements documented
✅ **Database Design:** Appropriate database chosen with proper schema
✅ **Algorithm Design:** Pseudocode and flowcharts for all approaches
✅ **Complexity Analysis:** Detailed time/space complexity comparison
✅ **100% Correctness:** All test cases pass, verified with comprehensive testing
✅ **Web Application:** Fully functional web interface deployed and accessible
✅ **Comparison:** Clear comparison between different algorithmic approaches
✅ **Documentation:** Complete report with analysis and results
✅ **Visualizer:** Step-by-step playback for DP, Expand-Center, and Manacher's algorithms
✅ **Real-world App:** Text Compare (diff) tool works and integrates LPS highlights

---

## 10. References

- "Introduction to Algorithms" by Cormen et al. (CLRS)
- LeetCode Problem #5: Longest Palindromic Substring
- Manacher's Algorithm for linear time palindrome detection
- GeeksforGeeks: Dynamic Programming solutions
- Research papers on string algorithms and palindrome detection

---

## Notes

- Start with Expand Around Centers as the primary implementation (best balance)
- Include Manacher's Algorithm for O(n) solution and performance showcase
- Ensure web app is mobile-responsive
- Add input validation to prevent malicious inputs
- Consider caching results for repeated queries
- Implement rate limiting for API endpoints in production
- For diff feature, use LCS-based algorithm for correctness; optionally provide side-by-side view

---

## 11. Real-World Application: Text Difference (Diff) Tool

### Overview
Add a practical feature: compare two texts and highlight differences using the Longest Common Subsequence (LCS) algorithm. Augment with longest palindromic substrings in each text for additional insights (e.g., symmetric patterns that may be preserved or altered).

### LCS Pseudocode (for Diff)
```
FUNCTION diff_LCS(a, b):
    n = length(a); m = length(b)
    dp = array (n+1) x (m+1) filled with 0
    FOR i = 1 TO n DO
        FOR j = 1 TO m DO
            IF a[i-1] == b[j-1] THEN
                dp[i][j] = dp[i-1][j-1] + 1
            ELSE
                dp[i][j] = MAX(dp[i-1][j], dp[i][j-1])
            END IF
        END FOR
    END FOR

    // Backtrack to build operations
    ops = empty list
    i = n; j = m
    WHILE i > 0 OR j > 0 DO
        IF i > 0 AND j > 0 AND a[i-1] == b[j-1] THEN
            PREPEND ops with { op: "equal", text: a[i-1] }
            i = i - 1; j = j - 1
        ELSE IF j > 0 AND (i == 0 OR dp[i][j-1] >= dp[i-1][j]) THEN
            PREPEND ops with { op: "insert", text: b[j-1] }
            j = j - 1
        ELSE
            PREPEND ops with { op: "delete", text: a[i-1] }
            i = i - 1
        END IF
    END WHILE
    RETURN ops
END FUNCTION
```

### Complexity
- LCS DP: Time O(n·m), Space O(n·m) (can be optimized to O(min(n, m)) for length only)
- Suitable for typical paragraph-level comparisons; for very large texts, consider Myers' O(ND) diff algorithm.

### Integration
- New UI tab: "Compare Texts"
- Backend endpoint: `POST /api/diff`
- Overlay LPS highlights in each text using selected algorithm (default: Manacher's)

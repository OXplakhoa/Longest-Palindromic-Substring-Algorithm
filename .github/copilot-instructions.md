# Longest Palindromic Substring - AI Agent Instructions

## Project Architecture

This is an **educational visualization tool** for comparing longest palindromic substring algorithms. The codebase has a clear separation:

- **`algorithms/`** - Core algorithm implementations (Python)
- **`web_app/backend/`** - FastAPI server with trace generators
- **`web_app/frontend/`** - React + TypeScript + Vite visualization UI

### Data Flow Pattern
```
User Input → Frontend (React) → FastAPI Backend → algorithms_trace.py generators
                                                   ↓
                                     Yield step-by-step execution events
                                                   ↓
                            Frontend visualizes steps with highlighting
```

## Critical Conventions

### Algorithm Implementations
All algorithms in `algorithms/` follow this signature:
```python
def longest_palindrome(s: str, trace: bool = False) -> Union[str, Tuple[str, Dict]]:
    # Returns palindrome string, or (palindrome, metadata) if trace=True
```

**Key Pattern**: Original algorithms are simple and standalone. For web visualization, **DO NOT modify originals** - instead, create parallel `trace_*` generators in `web_app/backend/algorithms_trace.py`.

### Trace Generator Convention
Trace generators must yield dictionaries with this structure:
```python
{
    "type": str,           # 'init', 'compare', 'match', 'mismatch', 'update_max', etc.
    "description": str,    # Vietnamese description for UI (project uses Vietnamese)
    "indices": [int],      # Array of character indices being operated on
    "line": int,           # Pseudo-code line reference (optional)
    # Additional fields based on type
}
```

**Example from `trace_brute_force`**:
```python
yield {"type": "compare", "indices": [low, high], 
       "description": f"So sánh s[{low}] và s[{high}]", "line": 4}
```

### Length Limits for Visualization
Defined in `web_app/backend/main.py`:
- **Slow algorithms** (brute_force, dynamic_programming): 100 chars max
- **Fast algorithms** (expand_center, manacher): 1000 chars max

These prevent timeout on O(n³) and O(n²) space algorithms. **Enforce in `/visualize` endpoint.**

## Key Components

### Frontend Visualizer Pattern
`Visualizer.tsx` consumes step arrays and:
1. Highlights characters based on `indices` field
2. Shows current `description` 
3. References `line` number in pseudo-code panel
4. Tracks `maxPalindrome` state across steps

Color scheme uses **Tailwind** with slate backgrounds and gradient accents.

### Benchmark vs Visualize
- **`/visualize`** - Returns full trace (step array)
- **`/benchmark`** - Returns only execution times for all 4 algorithms

Benchmarks skip visualization overhead and measure raw algorithm performance.

## Development Workflows

### Running the Application
```powershell
# Backend (from project root)
cd web_app/backend
python -m uvicorn main:app --reload

# Frontend (from project root)
cd web_app/frontend
npm install      # First time only
npm run dev
```

**API runs on**: `http://localhost:8000`  
**Frontend runs on**: Vite default (usually 5173)

### Testing
```powershell
# Algorithm unit tests
cd algorithms
python test_algorithms.py

# Backend API tests
cd web_app/backend
pytest test_api.py
```

### Adding a New Algorithm
1. Create `algorithms/new_algo.py` with `longest_palindrome(s, trace=False)` signature
2. Add `trace_new_algo(s)` generator to `web_app/backend/algorithms_trace.py`
3. Import in `web_app/backend/main.py` and add to `/visualize` endpoint
4. Update `Algorithm` type in `web_app/frontend/src/types.ts`
5. Add test cases to `algorithms/test_algorithms.py`

## Project-Specific Details

### Language Mixing
- **Code**: English variable names, comments
- **UI strings**: Vietnamese (`description` fields)
- **Documentation**: Mix of English and Vietnamese

When adding descriptions, use Vietnamese for user-facing strings.

### TypeScript Types
All step event types are defined in `types.ts`. Add new event types to the union:
```typescript
export interface VisualizationStep {
    type: 'init' | 'compare' | 'your_new_type' | ...;
    // ...
}
```

### No Database Yet
Despite schema in `README.md`, database is **not implemented**. Current architecture is stateless request/response.

## Common Pitfalls

1. **Don't import original algorithms with trace=True** - Use separate trace generators
2. **Check string length limits** - Frontend will error on oversized inputs
3. **Match event types** - Frontend expects specific `type` values for styling
4. **Manacher uses transformed string** - Indices in trace refer to transformed string with `#` separators
5. **Generator exhaustion** - Convert to list in endpoint: `list(trace_func(text))`

## Useful File References

- Algorithm complexity analysis: `complexity_analysis.md`
- Test cases with Unicode/emoji: `algorithms/test_algorithms.py` lines 8-23
- Pseudo-code component: `web_app/frontend/src/components/PseudoCode.tsx`
- DP table visualization: `web_app/frontend/src/components/DPTable.tsx`

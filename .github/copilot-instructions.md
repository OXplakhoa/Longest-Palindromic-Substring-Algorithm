# Copilot Instructions for This Repo

Purpose: Enable AI agents to quickly build and extend a web app that computes the Longest Palindromic Substring (LPS), compares multiple algorithms (incl. Manacher’s), visualizes steps, and provides a real-world text diff tool.

Repository state and source of truth
- This repo is currently a design-first project. The canonical spec is in `README.md` (mirrors `idea.txt`).
- Agents should treat `README.md` as the requirements, APIs, schema, and UI contract.

Architecture (big picture)
- Algorithms: A) Brute Force, B) Dynamic Programming, C) Expand-Center, D) Manacher’s (linear).
- Web API (planned):
  - POST `/api/find-palindrome` { text, algorithm: manacher|expand|dp|brute } → { palindrome, start_index, end_index, execution_time_ms }
  - POST `/api/compare-algorithms` → array of { algorithm, palindrome, execution_time_ms }
  - POST `/api/trace-palindrome` { text, algorithm, trace:true } → { palindrome, steps:[{step,event,...}] }
  - POST `/api/diff` { text_a, text_b } → { operations:[{op,text}], lcs_length, palindrome_a, palindrome_b }
- Data layer (planned):
  - `test_cases`, `algorithm_results`, `performance_metrics`
  - Optional: `visualization_traces` (event logs for step playback), `diff_sessions` (persisted text comparisons)
- Frontend (planned):
  - Input + algorithm selection, results panel, performance dashboard (Chart.js), step-by-step visualizer, and Text Compare mode.

Conventions and patterns
- Algorithms module naming (suggested): `algorithms/{brute_force.py, dynamic_programming.py, expand_center.py, manacher.py}` each exposing `longest_palindrome(text, trace: bool=False)` returning `(result, meta)`; when `trace=True`, include `steps` matching the trace schema below.
- Trace event schema (by algorithm):
  - Expand-Center: `{event:"center"|"expand", i, left, right, match?:bool}`
  - DP: `{event:"dp-fill", i, j, value:true|false}`
  - Manacher: `{event:"scan"|"expand", i, C, R, P_i}` with transformed string handled client-side
- Persist traces only when requested; use `run_id` to correlate steps.
- Endpoints, payload keys, and DB table names should match `README.md` exactly.

Critical workflows (agents should follow)
- Backend: Prefer FastAPI (Python) with typed Pydantic models; return consistent JSON per `README.md`.
- Testing for correctness: Use the `test_cases` list in `README.md` to assert 100% correctness across all algorithms; ensure equal-length-optimality (ties allowed).
- Performance: Include `execution_time_ms` for each run; for compare endpoints, time each algorithm separately.
- Visualization: When `trace=true`, emit compact step lists; keep payload small (truncate after N steps on very long inputs and return `truncated:true`).

Integration notes and examples
- Example request: `POST /api/find-palindrome` `{ "text":"babad", "algorithm":"manacher" }` → `{ "palindrome":"bab", "start_index":0, "end_index":2, "execution_time_ms":1.7, "algorithm_used":"manacher" }`
- Example trace item (Manacher): `{ "event":"expand", "i":12, "C":12, "R":17, "P_i":5 }`
- Diff output ops follow LCS backtrack: `equal|insert|delete`; keep order stable for rendering.

Project file references
- `README.md`: requirements, APIs, schema, algorithms, test cases, visualization design, diff design
- `idea.txt`: same content as background notes

Agent priorities (do-first roadmap)
1) Implement algorithms (incl. Manacher) with a shared interface and tests from `README.md`.
2) FastAPI backend exposing the four endpoints; add timing and optional trace.
3) Minimal frontend: input form, algorithm selection, result highlight, and a basic trace player.
4) Add Text Compare (LCS) view; overlay LPS for A and B.
5) Optional: persist traces and diff sessions (schema provided).

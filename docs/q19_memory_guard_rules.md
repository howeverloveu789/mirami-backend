# Q19 Memory Guard Rules (v1)
$19 Standalone – HARD BOUNDARIES

This document defines NON-NEGOTIABLE guard rules
for Q19 ($19) memory handling.

These rules exist to protect:
- Data integrity
- Human authenticity
- Long-term moat value

Violation of these rules is considered
a system design error.

--------------------------------
SCOPE
--------------------------------

These guard rules apply ONLY to:

- Q19 ($19) standalone service
- Memory write operations
- Any code path that touches Q19 memory

--------------------------------
CORE POSITION
--------------------------------

Q19 ($19) is NOT:
- An analysis service
- A scoring service
- A recommendation engine
- A behavior interpretation layer

Q19 ($19) exists ONLY to STORE.

--------------------------------
ABSOLUTE ALLOWED ACTIONS
--------------------------------

At $19 stage, the system MAY:

- Validate required fields
- Validate allowed enum values
- Generate timestamps
- Persist memory entries
- Append new entries

--------------------------------
ABSOLUTE FORBIDDEN ACTIONS
--------------------------------

At $19 stage, the system MUST NOT:

1. Analyze user input
2. Score answers or text
3. Assign traffic lights (red/yellow/green)
4. Label personality or traits
5. Extract keywords or themes
6. Summarize or rewrite text
7. Correct grammar or typos
8. Infer intent or motivation
9. Compare with other users
10. Generate advice or feedback
11. Backfill or modify past memory
12. Derive behavior_path from raw_text

--------------------------------
MEMORY WRITE RULES
--------------------------------

- One submission = one memory entry
- Memory is append-only
- Existing memory entries are immutable
- User language is stored AS-IS
- System must not normalize content

--------------------------------
FIELD OWNERSHIP
--------------------------------

- raw_text
  → Owned entirely by the user

- context.*
  → Declared by the user, never inferred

- behavior_path.*
  → Written ONLY if explicitly provided
  → Never extracted or auto-filled

--------------------------------
VERSIONING RULES
--------------------------------

- memory_version is locked at "q19.v1"
- No retroactive edits are allowed
- Any change requires:
  - New version
  - New spec
  - New mapping
  - New guard rules

--------------------------------
ENFORCEMENT PRINCIPLE
--------------------------------

If a future feature requires:
- Interpretation
- Scoring
- Comparison
- Aggregation

Then it DOES NOT belong to Q19 ($19).

It must be implemented as a separate layer
with explicit opt-in.

--------------------------------
FINAL STATEMENT
--------------------------------

Q19 ($19) memory is a preservation layer.

Its value comes from:
- Raw human language
- Unfiltered behavior paths
- Time-based accumulation

Once interpretation enters,
this layer is permanently corrupted.

These guard rules exist to prevent that.

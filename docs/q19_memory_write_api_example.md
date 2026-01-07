# Q19 Memory Write API – Example (v1)
$19 Standalone – Append Only

This document shows the ONLY valid way
to write Q19 ($19) memory entries.

This API performs:
- Validation
- Storage
- No analysis
- No scoring
- No interpretation

--------------------------------
ENDPOINT
--------------------------------

POST /memory/q19/write

--------------------------------
PURPOSE
--------------------------------

- Persist real human behavior language
- Preserve raw user input
- Create append-only memory entries
- Serve as long-term human feedback moat

--------------------------------
REQUEST BODY (v1)
--------------------------------

{
  "context": {
    "prompt_id": "S1",
    "type": "success"
  },

  "behavior_path": {
    "situation": "I was overwhelmed at work and felt stuck",
    "action_taken": "I paused, wrote down one small task, and did it",
    "action_not_taken": "I did not ask for help from my team"
  },

  "raw_text": "Full original user input, 200–300 words.
Typos, repetition, emotional language are preserved exactly
as the user wrote them."
}

--------------------------------
FIELD RULES
--------------------------------

context.prompt_id
- Required
- Allowed values only: "S1", "F1"

context.type
- Required
- User-declared state
- Allowed values: "success", "stuck", "fail"

behavior_path
- Optional container
- Fields inside are optional
- Stored ONLY if explicitly provided
- No extraction from raw_text

raw_text
- Required
- Stored AS-IS
- No trimming, no rewriting, no summarizing
- This is the primary source of truth

--------------------------------
SYSTEM-ADDED FIELDS
--------------------------------

The system MUST add the following fields
at write time:

{
  "memory_version": "q19.v1",
  "created_at": "ISO-8601 timestamp"
}

--------------------------------
FINAL STORED MEMORY OBJECT
--------------------------------

{
  "memory_version": "q19.v1",
  "created_at": "2026-01-03T22:31:00.000Z",

  "context": {
    "prompt_id": "S1",
    "type": "success"
  },

  "behavior_path": {
    "situation": "I was overwhelmed at work and felt stuck",
    "action_taken": "I paused, wrote down one small task, and did it",
    "action_not_taken": "I did not ask for help from my team"
  },

  "raw_text": "Full original user input..."
}

--------------------------------
FORBIDDEN AT WRITE TIME
--------------------------------

The write API MUST NOT:

- Generate summaries
- Assign scores
- Assign traffic lights
- Tag behavior types
- Infer missing fields
- Modify user language
- Backfill older entries

--------------------------------
ERROR HANDLING (MINIMAL)
--------------------------------

400 Bad Request
- Missing required fields
- Invalid prompt_id
- Invalid context.type

500 Internal Error
- Storage failure only

--------------------------------
FINAL NOTE
--------------------------------

This API only writes memory.

All interpretation, comparison,
or pattern analysis belongs to
future layers ($49+).

Backward compatibility is mandatory.

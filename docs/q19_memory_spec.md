# Q19 Memory Spec (v1)
## $19 Standalone – Behavior Path Language

---

## Purpose

This document defines the **Q19 ($19) memory data structure**.

Q19 memory is designed to:
- Capture **real human behavior paths**
- Preserve **raw, unedited user language**
- Avoid judgment, scoring, or interpretation
- Serve as a long-term, append-only human feedback moat

This spec is **final for v1** and must not be altered retroactively.

---

## Core Principle (Non-Negotiable)

1. Memory stores **behavior**, not personality
2. Memory stores **what happened and what was done**
3. All user text is stored **as-is** (typos included)
4. Memory is **append-only**
5. Q19 ($19) **only stores**, never analyzes

---

## S1 / F1 Prompt Definition (Locked)

All Q19 memory entries MUST originate from one of the following prompts.
Prompt wording must not be modified.

### S1 – Success Behavior Path

**Prompt ID:** `S1`

**User-facing text (English, fixed):**

> *Think of a recent situation where things actually worked out.*  
> *What happened — and what did you **do** that made it work?*

Purpose:
- Elicit concrete actions
- Avoid personality labels
- Capture repeatable behavior paths

---

### F1 – Stuck / Failed Behavior Path

**Prompt ID:** `F1`

**User-facing text (English, fixed):**

> *Think of a recent situation where things didn’t go well or got stuck.*  
> *What happened — and what did you **do (or not do)** that led to this outcome?*

Purpose:
- Capture missing actions
- Avoid self-blame language
- Preserve real decision gaps

---

## Text Length Guideline (English)

- Suggested target: **200 words**
- Natural range: **150–300 words**
- Hard system cap: **500 words**

Word count is guidance only. Authenticity > length.

---

## Memory Entry Structure

Each Q19 submission generates **one memory entry**.

```json
{
  "memory_version": "q19.v1",
  "created_at": "ISO-8601 timestamp",

  "context": {
    "type": "success | stuck | fail",
    "prompt_id": "S1 | F1"
  },

  "behavior_path": {
    "situation": "User-described situation",
    "action_taken": "What the user actually did",
    "action_not_taken": "What the user did not do (optional)"
  },

  "raw_text": "Full original user input (unedited, typos preserved)"
}

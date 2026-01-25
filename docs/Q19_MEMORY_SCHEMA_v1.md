# Q19_MEMORY_SCHEMA_v1

**Status:** LOCKED  
**Applies to:** Q19 ($19)  
**Storage:** Local JSONL / Cloud DB (schema-agnostic)  
**Version:** v1  

---

## Purpose

This document defines the **memory schema** for the MIRAMI Q19 ($19) product.

Q19 memory records **state snapshots across time**, not identity or diagnosis.

- Stores **behavioral and response patterns only**
- Contains **no advice, diagnosis, or personality labeling**
- Used as **structured input for later interpretation layers (P / GPT)**
- Designed to support **repeated runs and longitudinal comparison**

---

## Memory Unit Definition

One Q19 memory record represents:

> **One completed Q19 run at a specific point in time.**

It does NOT represent:
- a user identity
- a personality type
- a final conclusion

Multiple records with the same `session_id` form a **time-ordered sequence**.

---

## Required Fields (v1)

The following fields MUST be present in every Q19 memory record.

| Field | Type | Description |
|---|---|---|
| id | UUID | Unique identifier for this memory record |
| test_id | TEXT | Always `"Q19"` |
| session_id | TEXT | Identifies the same user or revisit line |
| report_id | TEXT | Corresponding MIRAMI report identifier |
| state | TEXT | Q19 state result (A / B / C) |
| run_index | INTEGER | Sequential run number within the same session |
| created_at | TIMESTAMP | Server-side timestamp of this run |

---

## Optional Fields (v1)

The following fields are optional in v1 and may be stored when available.

| Field | Type | Description |
|---|---|---|
| reliability_level | TEXT | Reliability or confidence level of this Q19 run |
| analysis_snapshot | JSON / JSONB | Structured analysis output without any narrative language |
| final_report | TEXT | Full MIRAMI user-facing report generated for this run |

---

## Explicitly NOT Stored (v1)

The following data MUST NOT be stored in Q19 memory:

- Full report_context or intermediate context objects
- System, developer, or prompt instructions
- Intermediate GPT responses
- Frontend UI state or presentation data
- Raw user answer payloads

These data are excluded to ensure:
- Memory stability across versions
- Reproducibility of structural analysis
- Clear separation between memory and interpretation

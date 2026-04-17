# WRSA Foundation — System Specification
## "The R36K Legacy Challenge" — Original Concept Document
*Source: Grok-generated system blueprint, provided as supplementary context for development*

---

## Overview

This document describes the original data model, field structure, views, and automation logic conceived for the WRSA Foundation pledge tracking system. It serves as the functional specification for what the custom platform (described in the main Project Brief) must replicate and extend.

---

## Airtable Base: "The R36k Legacy Challenge"

### TABLE 1: "Pledge Chain Tracker" — Main Table

This is the core engine of the system.

#### Fields (in order)

| # | Field Name | Type | Notes |
|---|---|---|---|
| 1 | Pledger Name | Single line text | e.g. Frans Schutte |
| 2 | Organisation / Farm | Single line text | e.g. Cottondale |
| 3 | Contact Details | Phone or text | |
| 4 | Challenged By | Single line text | e.g. Sareta Schutte |
| 5 | Date Challenged | Date | |
| 6 | 7 Day Deadline | Formula | `DATEADD({Date Challenged}, 7, 'days')` |
| 7 | Status | Single select | Pending / Accepted / Completed / Declined / Reassigned |
| 8 | Pledge Amount (R) | Currency (ZAR) | |
| 9 | Amount Received (R) | Currency | |
| 10 | Proof of Payment | Attachment | |
| 11 | Date Paid | Date | |
| 12 | Next Nominee | Single line text | e.g. Kgomotso Mpai |
| 13 | Nominee Contact | Phone or text | |
| 14 | Public Recognition Post Done | Checkbox | |
| 15 | Notes | Long text | |

#### Critical Calculated Fields

**Field 16 — Days Remaining** *(drives urgency)*
```
DATETIME_DIFF({7 Day Deadline}, TODAY(), 'days')
```

**Field 17 — Urgency Status** *(visual pressure indicator)*
```
IF({Status}="Completed", "✅ Completed",
  IF({Status}="Declined", "❌ Declined",
    IF({Days Remaining}<0, "⚠️ Overdue",
      IF({Days Remaining}<=2, "🔥 Urgent",
        "⏳ Pending"))))
```

---

### TABLE 2: Leaderboard

Can be a separate table or a grouped view of the main table, sorted by Status and Pledge Amount.

---

## View Configuration

### View 1 — 🔥 Live Challenge Board *(Public-facing)*
- **Filter:** Status = Pending OR Accepted
- **Sort:** Days Remaining (ascending — most urgent first)
- **Shows:** Who is under pressure, who must act next

### View 2 — 🏆 Completed Champions
- **Filter:** Status = Completed
- **Sort:** Pledge Amount (descending)
- **Purpose:** The honour roll — creates prestige and momentum

### View 3 — ⚠️ Overdue
- **Filter:** Days Remaining < 0 AND Status ≠ Completed
- **Purpose:** The admin follow-up list

---

## Automation Logic

### Automation 1 — Deadline Reminder
- **Trigger:** 2 days before the 7-day deadline
- **Action:** Send email/notification — *"Your pledge window is closing"*

### Automation 2 — Overdue Alert
- **Trigger:** When Days Remaining < 0
- **Action:** Flag record and notify administrator

---

## Daily Operating Workflow

1. Someone is challenged → Add record immediately
2. Set Date Challenged
3. System calculates deadline automatically
4. Monitor the 🔥 Live Challenge Board
5. Follow up on ⚠️ Overdue entries
6. Celebrate on 🏆 Completed Champions

---

## Seed Data (First Entries)

| Name | Organisation | Status | Amount |
|---|---|---|---|
| Frans Schutte | Cottondale | Completed | R36,000+ |
| Kgomotso Mpai | — | Pending | — |

*Challenged by Frans Schutte. These entries demonstrate momentum from day one.*

---

## Platform Evaluation (Original Research)

The following platforms were evaluated before deciding to commission a custom build:

### 1. Airtable ✅ Recommended for interim use
- Looks professional immediately
- Brandable with WRSA Foundation identity
- Tracks pledges, deadlines, status, challengers
- Shareable publicly as a live leaderboard
- No heavy setup required
- **Build time:** 1–2 hours

### 2. Notion
- Clean, beautiful interface
- Easy to share publicly
- Good for storytelling + tracking
- **Limitation:** Less dynamic for deadline tracking and automation

### 3. Google Sheets *(backup only)*
- Fastest to start
- **Limitations:** Not inspiring, no brand presence, no momentum energy

### 4. Glide *(mobile app layer)*
- Turns Airtable into a branded mobile app
- Users can see live pledges, accept challenges, nominate the next person
- **Build time:** 1–2 days on top of Airtable
- **Relevant for Phase 3** of the custom platform

---

## Naming the System

The campaign name carries psychological weight. Options considered:

- WRSA Foundation 20 Year Challenge
- The Wildlife Pledge Chain
- The R36K Legacy Challenge ✅ *Selected*
- Pass the Baton Initiative
- The Wildlife Industry Call Up
- **The WRSA Foundation Chain** *(strongest — implies responsibility, continuity, person-to-person movement)*

---

## Strategic Design Principles

> *"This is not admin. This is social pressure + pride + legacy."*

Each record must communicate:
- Who stepped up
- Who they challenged
- Who is next

The system must make every participant feel: **"I have been called. I cannot ignore this."**

The three things this platform must do:
1. **Create visibility** — everyone can see the chain
2. **Create pressure** — deadlines are public
3. **Create prestige** — champions are celebrated

> *"You are not building a tracker. You are building a movement with visibility."*

---

*This document is supplementary context for Antigravity. Refer to the main Project Brief for full technical requirements, PayFast integration specs, and delivery phases.*

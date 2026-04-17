# WRSA Foundation — Pledge & Donation Platform
## Project Brief for Antigravity
**Version:** 1.0 | **Date:** March 2026 | **Prepared by:** WRSA Foundation

---

## 1. Background & Context

The WRSA Foundation is running a structured pledge challenge called **"The R36K Legacy Challenge"** — a chain-reaction fundraising campaign where individuals in the wildlife and agricultural industry pledge, pay, and nominate the next person to give. The campaign is gaining momentum and requires a professional digital home to manage both the internal pledge chain and public donations.

The reference model for the public-facing side is **SAAI's donation page** (saai.org/en/donate), which uses PayFast to accept once-off and recurring donations from the public. We want something similar, but purpose-built for this campaign — with the addition of a full internal management backend.

---

## 2. What We Need Built

The platform has **two distinct faces** that must work as one system:

### FACE 1 — Public Donation Portal (Front-End)
*Anyone with the link can access this. No login required.*

A clean, branded, mobile-first donation page where members of the public or industry supporters can:

- Read a short explanation of the campaign and its purpose
- Choose or enter a donation amount (suggested amounts: R500 / R1,000 / R5,000 / R36,000 / custom)
- Select once-off or recurring (monthly) donation
- Optionally leave their name, organisation, and a message of support
- Pay securely via **PayFast** (credit/debit card, Instant EFT, SnapScan, Zapper, Capitec Pay)
- Receive an automatic email receipt upon successful payment
- See a **live public leaderboard** showing total raised, number of donors, and recent contributors (with permission)

**Design direction:** Earthy, premium, wildlife aesthetic. Think conservation meets prestige agriculture. Not generic charity-website beige — this should feel like a movement.

---

### FACE 2 — Admin Backend (Internal Management Dashboard)
*Password-protected. Accessible only to designated WRSA Foundation staff.*

A full pledge and donation management system where administrators can:

**Pledge Chain Management**
- Add new pledge entries manually (name, organisation, contact, who challenged them, date challenged, amount pledged, status, next nominee)
- Track 7-day deadline per pledge (auto-calculated from challenge date)
- Update pledge status: Pending / Accepted / Completed / Declined / Reassigned
- Upload proof of payment against each pledge record
- View urgency indicators per pledge (days remaining, overdue flags)

**Donation Management**
- View all PayFast donations in one dashboard (synced via PayFast webhook/ITN)
- See donor name, amount, payment method, date, and receipt status
- Distinguish between pledge payments and general public donations
- Export donation data to CSV / Excel

**Leaderboard Views**
- 🔥 Live Challenge Board — active pledges sorted by urgency (soonest deadline first)
- 🏆 Champions — completed pledges ranked by amount (the honour roll)
- ⚠️ Follow-Up — overdue pledges, ready for admin action
- 💰 Donor Wall — public donations, ranked by amount

**Reporting**
- Total pledged vs total received
- Total public donations received
- Campaign total (pledges + donations combined)
- Number of active, completed, overdue, and declined pledges

**Automation (Nice to Have)**
- Email reminder to pledger 2 days before their 7-day deadline
- Email alert to admin when a pledge goes overdue
- Auto-send receipt to donor after PayFast payment confirmation

---

## 3. Technical Requirements

| Item | Requirement |
|---|---|
| Payment Gateway | PayFast (South Africa) — once-off and recurring donations |
| Currency | ZAR (South African Rand) |
| PayFast ITN | Yes — webhook to sync payments to the backend automatically |
| Email receipts | Automated on successful payment |
| Authentication | Admin login (email + password, minimum). Consider 2FA. |
| Mobile responsive | Both faces must work perfectly on mobile |
| Hosting | Developer to advise — must be reliable, South African hosting preferred |
| Data storage | Database backend (developer to recommend stack) |
| Domain | To be confirmed by WRSA Foundation |
| Branding | WRSA Foundation logo, colours, and identity to be supplied |

---

## 4. PayFast Integration Notes

PayFast is South Africa's leading payment gateway with no setup or monthly fees — only per-transaction fees. It supports:
- Credit and debit cards
- Instant EFT
- SnapScan, Zapper, Capitec Pay, Mobicred
- Recurring/subscription billing
- PCI-DSS Level 1 compliant

The developer will need access to a WRSA Foundation PayFast merchant account (Merchant ID, Merchant Key, Passphrase). WRSA Foundation must register at payfast.io as a non-profit if they have not already done so.

PayFast uses an **Instant Transaction Notification (ITN)** webhook to notify the platform of successful payments — this is how the admin dashboard will auto-update when a donation comes in.

---

## 5. Content to Be Supplied by WRSA Foundation

The following must be provided before development begins:

- [ ] WRSA Foundation logo (high-res, preferably SVG or PNG with transparent background)
- [ ] Brand colours and any existing style guide
- [ ] Campaign description / copy for the public donation page (2–3 paragraphs)
- [ ] PayFast merchant account credentials
- [ ] List of existing pledgers to load as seed data
- [ ] Designated admin email addresses
- [ ] Preferred domain name

---

## 6. Suggested Delivery Phases

**Phase 1 — Core (Priority)**
Public donation page with PayFast + Admin backend with pledge tracker + donation sync

**Phase 2 — Automation**
Email reminders, overdue alerts, automated receipts

**Phase 3 — Polish**
Public leaderboard on the donation page, social sharing, mobile app consideration (e.g. via Glide)

---

## 7. Reference

- **SAAI Donation Page:** saai.org/en/donate (PayFast + PayPal model, public-facing)
- **PayFast for Non-Profits:** payfast.io
- **Existing prototype:** A working HTML prototype of the admin tracker has been built and can be handed to the developer as a design and functional reference

---

## 8. Questions for Antigravity

1. What is your recommended tech stack for this (WordPress + plugin vs custom build)?
2. Can you handle the PayFast ITN webhook integration?
3. What is your estimated timeline for Phase 1?
4. What is your estimated cost for Phase 1 and Phase 2 separately?
5. Do you have experience with South African NPO/charity platforms?
6. Will you provide hosting, or do we arrange separately?

---

*This brief was prepared to give Antigravity full context to scope and quote accurately. The WRSA Foundation prototype and Grok-generated system spec are available as supplementary documents on request.*

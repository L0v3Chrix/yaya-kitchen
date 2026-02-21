# YaYa's Kitchen V1 Build — Orchestration Plan
**Created:** 2026-02-21 10:14 CST
**Orchestrator:** Daniel
**Standard:** Definition of Done (7-11 iterations, verified, over-satisfying)

---

## Mission

Ship a production-ready order system today that:
- Accepts real customer orders
- Notifies YaYa instantly
- Tracks orders in Google Sheet
- Validates delivery zones
- Captures subscription interest
- Works flawlessly on mobile

**Success Metric:** YaYa can receive and process a real order tonight.

---

## Parallel Tracks

### Track A: Frontend (Form Updates)
**Assignee:** Builder Agent
**Deliverables:**
1. Delivery week picker (next 4 Fridays)
2. ZIP code field with validation (8 in-zone, others +$10)
3. Delivery instructions textarea
4. Gift message field (conditional on gift basket)
5. Subscription interest checkbox
6. Contact preference selector (Text/Email/Both)
7. Running order summary display
8. Mobile-responsive polish

### Track B: Backend (Sheet + Script)
**Assignee:** Builder Agent (or parallel sub-agent)
**Deliverables:**
1. Google Sheet with 3 tabs (Orders, Customers, Capacity)
2. Apps Script webhook (doPost handler)
3. Capacity check logic (reject if >= 15)
4. Email notification to YaYa
5. Customer confirmation (email)
6. Row formatting and auto-timestamp

### Track C: Integration & QA
**Assignee:** Daniel (orchestrating)
**Deliverables:**
1. Connect form to deployed script
2. End-to-end test (3+ test orders)
3. Mobile responsive verification (iPhone, Android)
4. Error state testing
5. Edge case coverage
6. Production deploy and verify

---

## Definition of Done Checkpoints

### Per-Track Gates

**Gate 1: Expansion**
- [ ] All user scenarios considered (new customer, returning, gift, subscription)
- [ ] Edge cases identified (capacity full, invalid zip, missing fields)
- [ ] What would a customer obsessed with easy ordering want?

**Gate 2: Research**
- [ ] Reviewed existing OrderForm.tsx patterns
- [ ] Checked similar food ordering forms for UX patterns
- [ ] Validated ZIP code list accuracy

**Gate 3: Iteration**
- [ ] Frontend: 3+ revisions on form layout
- [ ] Backend: 2+ approaches to script structure
- [ ] Not shipping first draft

**Gate 4: Verification**
- [ ] Form submits successfully (3+ tests)
- [ ] Sheet receives data correctly formatted
- [ ] Email arrives with correct content
- [ ] ZIP validation works (test in-zone and out-of-zone)
- [ ] Capacity limit enforced
- [ ] Mobile rendering verified

**Gate 5: Over-Satisfaction**
- [ ] Form feels warm and on-brand (not generic)
- [ ] Confirmation message delights
- [ ] YaYa's notification email is scannable and actionable
- [ ] Would Chrix show this to another client as example work?

---

## Timeline

| Time | Track A (Frontend) | Track B (Backend) | Track C (Integration) |
|------|--------------------|--------------------|----------------------|
| 10:15-11:00 | Form field updates | Sheet schema + Script draft | Monitor, unblock |
| 11:00-11:30 | Polish + mobile | Script deploy + test | Begin integration |
| 11:30-12:00 | Revision based on testing | Fix issues | End-to-end QA |
| 12:00-12:30 | Final polish | Final fixes | Production deploy |

**Target Completion:** 12:30 CST (2 hours)

---

## Communication Protocol

Agents report via sessions_send with tags:
- `[STATUS]` — Progress update
- `[BLOCKED]` — Need help
- `[COMPLETE]` — Track finished
- `[QUESTION]` — Need clarification

Daniel monitors and unblocks in real-time.

---

## Handoff Spec

### Frontend → Integration
- Updated `OrderForm.tsx` committed to branch
- All new fields functional
- Validation working locally
- Ready for script URL injection

### Backend → Integration
- Google Sheet created with correct schema
- Apps Script deployed as web app
- Deployment URL provided
- Test POST successful

### Integration → Production
- Form connected to live script
- 3+ successful test orders
- Mobile verified
- Vercel env var set
- Pushed to main → auto-deploy

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Form changes break existing layout | Test mobile throughout |
| Script deployment issues | Have backup manual sheet entry |
| Email notification fails | Test with multiple recipients |
| Capacity logic edge cases | Test at 0, 14, 15, 16 |

---

## Rollback Plan

If critical issues at deploy:
1. Revert to previous commit (simple form)
2. YaYa takes orders via text/email temporarily
3. Fix and redeploy

---

*Orchestration by Daniel | Standard: Definition of Done*

# Dixon Case Manager - demo progress

Sales demo for Chris Dixon: custom CRM/CMS that reads as "advanced Podio overlaid
on Google Drive" for a PI firm. Front end only; every button works visually and
mutates in-memory data (js/data.js + js/enrich.js generators). Nothing persists.
Run: launch.json entry `dixon-crm` (python http.server, port 8742).

Peyton: leave notes for the loop under "Notes from Peyton" below. They get top priority.

## Notes from Peyton

(none yet)

## Done

### Iteration 2 (2026-08-07) - the big interactivity + coverage pass
- Document viewer (the Drive overlay ask): click any file anywhere and it opens
  a paper-styled rendering (letterhead, meta, body generated per folder type)
  with an AI Review rail: summary + severity flags (LegalOn pattern), Open in
  Drive / Download buttons. Opening a doc clears its NEW badge.
- Every button does something: New Case modal actually creates a case (folders,
  checklist, retainer doc) and navigates to it; Generate Document picks from a
  forms library and files a merged draft to the right Drive folder; AI Demand
  Draft assembles a demand from file data; Request Records sends follow-ups;
  Log Activity / Add Note save real notes; checklist items toggle; the chevron
  stage bar advances the case one stage on click; automations toggle; bell shows
  notifications; leads drag between columns + Convert to Case.
- Contacts: filter, Add / Edit (modal form), Delete with undo toast, Export CSV
  (real file download).
- New views: Settlements (firm-wide pending demands/offers with gap math +
  settled-this-year with net-to-client), Calendar (Aug-Oct 2026 month grid,
  color-coded event kinds, today highlighted, prev/next), Reports (CSS bar
  charts: cases by stage, pipeline value by type, lead sources, settlements),
  Automations (5 integration chips + 7 WHEN/THEN recipe cards with switches).
- Case page: added Emails tab (Outlook-matched thread with "attachment filed to
  <folder>" badges) and Expenses tab (ledger + QuickBooks note). 18 cases now.
- Data: enrich.js deterministically fills every case with a baseline paper trail
  (intake questionnaire, HIPAA auth, LOR, records requests, itemized bills,
  petitions), 4+ emails, and an expense ledger; hand-written emails for Reed.
- Brand: real logo cropped to a "D" mark (assets/logo-mark.png) that swaps in
  when the sidebar collapses at 1024px; wordmark never spills.
- Polish: view fade-in transition, pipeline right-edge scroll fade, humanized
  lead timestamps ("Yesterday, 9:41 PM"), modal/toast system.
- Bugs fixed this round: modal persisted across route changes (now closed on
  navigation); calendar grid columns blown out by long event chips (min-width:0);
  logo mark cropped from center by sips (redone with PIL from left edge);
  brand-mark width overridden by base rule (specificity fix); automation
  switches had no click handler.
- Verified: dashboard, case overview/emails/documents, doc viewer, automations,
  calendar, contacts (+ add modal), settlements, reports; desktop and 1000px;
  zero console errors.

### Iteration 1 (2026-08-07)
- Scaffold, shell, dashboard, cases table, tabbed case page with chevron stage
  path, per-case Drive folder tree with NEW badges + AI summaries, global
  documents feed, leads board, contacts, global search. 12 seed cases.

## Research digest (from 3 product-research reports, keep for design decisions)
- Podio: apps/items/fields mental model; Drive integration is a link-picker
  only (our wedge); weak reporting (second wedge); Progress "stability" roadmap.
- Neos: tab canon, custom tabs, checklist-driven automation, $99-189/user/mo.
- CasePeer: medical records tracking + firm settlement dashboard, $79-149.
- Litify: Path chevron, matter plans, $150-250+ and 6mo implementations.
- Clio: cleanest UI benchmark; auto Drive folder per matter but doc automation
  can't write into Drive (we show generated docs filing straight to Drive).
- Pitch math: 10 users on Neos-class = ~$12-23k/yr forever.

## Next candidates (ranked)
1. Case page "Parties" data (defendant, defense counsel, witnesses) either as a
   tab or an overview card; wire contacts to cases ("3 active cases" per contact).
2. Reports: referral-source ROI card + month-over-month settled bar; make
   Export PDF produce a real print stylesheet (window.print).
3. Global quick actions: keyboard shortcut (/) to focus search; command-K
   palette would demo well.
4. Drive two-way story: "Upload to folder" button in case Documents that fakes
   a drop zone and files the doc with AI summary.
5. Mobile pass below 820px (topbar wrap, case tabs scroll, table density).

## Known rough edges
- Settlements "next step" column pulls the first open checklist item (fine, but
  could be smarter).
- Reports stat cards (case age, conversion) are hand-set numbers.
- Calendar events don't include auto-generated checklist deadlines.

## Hard rules (do not violate)
- Dixon brand only: orange #F46624 / #FF6D00, ink #1A1F23, cream #FFF2EC,
  Sentient headings, General Sans body, real logo, no vendor badges.
- No em dashes in visible copy. No emoji; one inline SVG icon set.
- Realistic St. Louis PI seed data, never lorem ipsum.
- Never regress a working feature. Verify in browser before ending an iteration.

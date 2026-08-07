# Dixon Case Manager - demo progress

Sales demo for Chris Dixon: custom CRM/CMS that reads as "advanced Podio overlaid
on Google Drive" for a PI firm. Front end only; every button works visually and
mutates in-memory data (js/data.js + js/enrich.js generators). Nothing persists.
Run: launch.json entry `dixon-crm` (python http.server, port 8742).

Peyton: leave notes for the loop under "Notes from Peyton" below. They get top priority.

## Notes from Peyton

(none yet)

## Done

### Iteration 3 (2026-08-07) - Clio parity + hosting
- Hosted: public GitHub repo peyton-marcotte/dixon-cm-8leknmpp, GitHub Pages at
  https://peyton-marcotte.github.io/dixon-cm-8leknmpp/ (noindex meta set; deploy
  by pushing to main). Local preview still port 8742.
- Stage moves are reversible: click any stage in the chevron bar (back or
  forward), every move gets an Undo in the toast.
- Settlement Calculator on the Negotiation tab: type or slide a gross number,
  live waterfall (fee 33.3 percent or 25 percent WC, expenses, liens after 35
  percent reduction, net to client) with an IOLTA trust note. Research says this
  is the highest demo-impact PI feature; Clio sells it in a paid PI add-on.
- SOL countdown chips on case Details + a firm-wide Statute Watch card on the
  dashboard (research's number 2 fear-button feature).
- Two-way client texting: Comms tab (renamed from Emails) with an SMS thread on
  the featured case, working composer that logs to the file (research number 3).
- Related Contacts card on case Overview (adjuster, defense counsel, providers,
  paralegal, linked from CONTACTS).
- Court details (venue, judge, case no, division) on litigation cases c5, c13.
- New Case toast now includes "Conflict check passed".
- Logo mark re-cropped without the divider bar (pixel-run analysis, cols 0-47).
- Fresh research (4th report) on PI daily needs, digest below.

### Clio-parity answer (for Peyton)
Have: matter dashboard w/ financials, tabbed matter page, docs w/ Drive sync
(deeper than Clio's), tasks, comms (email + SMS), calendar, contacts w/ related,
reports, intake pipeline, custom fields, activity feed, settlement calculator,
medical records tracker (Clio charges extra for these last two via PI add-on).
Deliberately absent (contingency firms ignore them): hourly time tracking,
invoicing/billing, payment plans. Not built yet: client portal (Case Status
style stage tracker for clients), court-rules deadline chains, trust ledger UI,
lien negotiation history, referral fee tracking, document versioning.

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

## Next candidates (ranked, informed by PI research report 4)
1. Client portal mock: a "View as client" page per case, package-tracker stage
   bar + messages + upload (Case Status pattern). Cuts "any update?" calls,
   big demo moment for Chris.
2. Lien negotiation ledger: per-lien history (original, offers, final reduced)
   feeding the settlement calculator automatically.
3. Litify-style saved settlement scenarios: save 2-3 calculator states and
   compare side by side.
4. Drive two-way: "Upload to folder" drop zone in case Documents; document
   versioning row states.
5. Reports: referral-source ROI + print stylesheet for Export PDF.
6. Command-K palette / keyboard shortcuts; mobile pass below 820px.

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

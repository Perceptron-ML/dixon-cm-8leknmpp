/* Deterministic enrichment: fills every case with baseline documents, emails,
   expenses, and openable document contents so the file system feels lived-in. */

(function () {
  const { CASES } = window.DB;

  const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const pick = (s, arr) => arr[hash(s) % arr.length];

  function addDays(iso, n) {
    const d = new Date(iso + "T12:00:00");
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  CASES.forEach(c => {
    const has = name => c.docs.some(d => d.name === name);
    const add = (folder, name, offset, ai) => {
      if (!has(name)) c.docs.push({ folder, name, date: addDays(c.opened, offset), isNew: false, ai });
    };

    /* baseline paper trail every real file would have */
    add("01 Intake & Retainer", "Client intake questionnaire.pdf", 0,
      "Full intake: incident narrative, injuries, insurance, employment, and prior claims history.");
    add("01 Intake & Retainer", "HIPAA authorization - signed.pdf", 1,
      "Signed release authorizing records requests to all treating providers.");
    add("04 Insurance", `Letter of representation - ${c.insurer.split(" (")[0]}.pdf`, 2,
      "Notice of representation with preservation demand and request for policy limits disclosure.");
    c.medicals.forEach((m, i) => {
      add("02 Medical Records", `Records request - ${m.provider}.pdf`, 7 + i * 2,
        "HIPAA-compliant request for complete chart, imaging, and itemized billing.");
      if (m.status !== "Requested") {
        add("03 Bills & Liens", `Itemized bill - ${m.provider}.pdf`, 21 + i * 3,
          `Itemized charges of $${m.billed.toLocaleString("en-US")}${m.lien ? `, asserted lien of $${m.lien.toLocaleString("en-US")}` : ""}.`);
      }
    });
    if (c.stage === "Litigation") {
      add("07 Pleadings", "Petition for damages - filed.pdf", 120,
        "Petition pleading negligence with prayer for damages. File-stamped copy.");
    }

    /* emails */
    if (!c.emails) {
      const insurer = c.insurer.split(" (")[0];
      c.emails = [
        { from: c.paralegal, subject: `Letter of representation - ${insurer}`, date: addDays(c.opened, 2), filed: "04 Insurance",
          body: `Letter of representation sent to ${insurer} on claim ${c.claimNo}. Requested policy limits disclosure and confirmed all future contact through the firm.` },
        { from: `${c.adjuster === "Unassigned" ? insurer + " Claims" : c.adjuster + " (" + insurer + ")"}`, subject: `Claim ${c.claimNo} acknowledged`, date: addDays(c.opened, 6), filed: "04 Insurance",
          body: `Acknowledging receipt of your representation letter regarding ${c.client}. The claim has been assigned and liability investigation is underway.` },
        { from: c.paralegal, subject: `Records follow-up - ${c.medicals[0] ? c.medicals[0].provider : "providers"}`, date: addDays(c.opened, 24), filed: "02 Medical Records",
          body: "Followed up on the outstanding records request. Facility confirms processing, expected within two weeks." },
        { from: c.client, subject: "Checking in", date: addDays(c.opened, 33), filed: null,
          body: pick(c.id, [
            "Just checking in on where things stand with my case. Also, I have a follow-up appointment next week I wanted you to know about.",
            "Wanted to see if there is any news. My treatment is going well and I kept all the receipts like you asked.",
            "Is there anything you need from me right now? Happy to drop off paperwork whenever."
          ]) }
      ];
    }

    /* policy and client-preference details */
    if (!c.policy) {
      c.policy = {
        liability: pick(c.id + "pol", ["$25,000 / $50,000", "$50,000 / $100,000", "$100,000 / $300,000", "$250,000 / $500,000", "$1,000,000 CSL"]),
        um: pick(c.id + "um", ["$25,000", "$50,000", "$100,000", "None on file"])
      };
    }
    if (!c.pref) c.pref = pick(c.id + "pref", ["Text", "Call", "Email"]);
    if (!c.language) c.language = (c.client === "Maria Alvarez" || c.client === "Gloria Sandoval") ? "Spanish" : "English";

    /* referral source (deterministic) */
    if (!c.source) {
      const r = hash(c.id + "src") % 10;
      c.source = r < 5 ? "Website chat" : r < 8 ? "Past client referral" : "Google Ads";
    }

    /* lien ledger defaults */
    if (!c.lienLedger) {
      c.lienLedger = c.medicals.filter(m => m.lien > 0).map(m => ({
        holder: m.provider, original: m.lien, current: m.lien,
        status: "Asserted", note: "Lien letter on file", date: addDays(c.opened, 45)
      }));
    }

    /* expenses */
    if (!c.expenses) {
      c.expenses = [];
      const fee = name => 35 + (hash(c.id + name) % 11) * 5;
      c.medicals.forEach(m => {
        if (m.status !== "Requested") c.expenses.push({ date: addDays(c.opened, 30), desc: `Medical records fee - ${m.provider}`, amount: fee(m.provider) });
      });
      if (["Car Accident", "Truck Accident", "Motorcycle Accident", "Pedestrian Accident", "Bicycle Accident", "Rideshare Accident"].includes(c.type)) {
        c.expenses.push({ date: addDays(c.opened, 10), desc: "Certified crash report", amount: 14 });
      }
      if (c.stage === "Litigation" || c.docs.some(d => d.folder === "07 Pleadings")) {
        c.expenses.push({ date: addDays(c.opened, 120), desc: "Circuit court filing fee", amount: 186 });
        c.expenses.push({ date: addDays(c.opened, 150), desc: "Service of process", amount: 55 });
      }
      if (c.negotiation.length) c.expenses.push({ date: c.negotiation[0].date, desc: "Demand package assembly and postage", amount: 48 });
    }
  });

  /* openable document contents for the viewer */
  window.docContent = function (c, d) {
    const insurer = c.insurer.split(" (")[0];
    const fmt = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const base = {
      meta: [`Re: ${c.client} | Claim ${c.claimNo} | Our file ${c.num}`, `Date of loss: ${fmt(c.incident)}`],
      paragraphs: [], flags: []
    };

    if (d.folder === "04 Insurance") {
      base.letterhead = insurer.toUpperCase();
      base.sub = "Claims Department";
      base.paragraphs = [
        `Dear Counsel,`,
        `This letter concerns the above-referenced claim arising out of the incident of ${fmt(c.incident)}. ${d.ai}`,
        `Our evaluation remains subject to the documentation previously requested. Please direct all further correspondence to the undersigned adjuster of record${c.adjuster !== "Unassigned" ? `, ${c.adjuster}` : ""}.`,
        `This correspondence is not an admission of liability and all rights and defenses are expressly reserved.`,
        `Sincerely,`, `${c.adjuster !== "Unassigned" ? c.adjuster : "Claims Department"}\n${insurer}`
      ];
      base.flags = [
        { sev: "high", text: "Response deadline detected. A task was created and added to the case checklist." },
        { sev: "med", text: "Reservation of rights language present. Standard, no coverage denial asserted." }
      ];
    } else if (d.folder === "02 Medical Records") {
      base.letterhead = (d.name.split(" - ")[1] || d.name.replace(".pdf", "")).replace(".pdf", "").toUpperCase();
      base.sub = "Medical Records Department";
      base.paragraphs = [
        `Patient: ${c.client}    DOB on file    Encounter range: ${fmt(c.incident)} to present`,
        `Clinical summary: ${d.ai}`,
        `History: Patient presented following the incident of ${fmt(c.incident)}. ${c.facts}`,
        `Assessment and plan: Continue current treatment plan with follow-up as scheduled. Records certified complete as of the date of production.`
      ];
      base.flags = [
        { sev: "high", text: "Findings support causation. Language extracted for the demand narrative." },
        { sev: "low", text: "Charges cross-checked against the itemized bill in 03 Bills and Liens." }
      ];
    } else if (d.folder === "06 Demand") {
      base.letterhead = "THE DIXON INJURY FIRM";
      base.sub = "Trial Lawyers | St. Louis, Missouri";
      base.paragraphs = [
        `Dear ${c.adjuster !== "Unassigned" ? "Ms./Mr. " + c.adjuster.split(" ").slice(-1)[0] : "Claims Department"},`,
        `This firm represents ${c.client} for injuries sustained on ${fmt(c.incident)}. ${c.facts}`,
        d.ai,
        `Enclosed please find the complete medical records, itemized billing, and supporting documentation. This demand remains open for thirty (30) days from the date of this letter.`,
        `Very truly yours,`, `Christopher Dixon\nThe Dixon Injury Firm`
      ];
      base.flags = [
        { sev: "med", text: "30-day response window. Follow-up task scheduled automatically." },
        { sev: "low", text: "All exhibits verified present in the Drive folder before sending." }
      ];
    } else {
      base.letterhead = d.name.replace(/\.(pdf|docx)$/, "").toUpperCase();
      base.sub = c.num;
      base.paragraphs = [
        d.ai,
        `Matter background: ${c.facts}`,
        `This document was filed to ${d.folder} in the case Drive folder and indexed for firm-wide search. Key dates and obligations, if any, were extracted and added to the case checklist automatically.`
      ];
      base.flags = [{ sev: "low", text: "Indexed and summarized on filing. No action required." }];
    }
    return base;
  };
})();

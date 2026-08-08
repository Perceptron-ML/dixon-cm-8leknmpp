/* Dixon Case Manager - demo app. Front end only: every action works visually
   and mutates in-memory data; nothing persists and no backend is required. */

(function () {
  const { STAGES, FOLDER_TEMPLATE, CASES, LEADS, CONTACTS, ACTIVITY, EVENTS } = window.DB;
  const TODAY = "2026-08-07";

  /* ---------- icons ---------- */

  const S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  const I = {
    dashboard: S + '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    briefcase: S + '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    bolt: S + '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
    folder: S + '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.2 3.9A2 2 0 0 0 7.5 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"/></svg>',
    contacts: S + '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    doc: S + '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>',
    search: S + '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    bell: S + '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    cloud: S + '<path d="M20 17.6A5 5 0 0 0 18 8h-1.3A8 8 0 1 0 4 16.3"/><path d="m9 12 2 2 4-4"/></svg>',
    chat: S + '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.7 8.7 0 0 1-3.6-.8L3 21l2-5.4a8.2 8.2 0 0 1-1-3.9A8.4 8.4 0 0 1 12.5 3.4a8.4 8.4 0 0 1 8.5 8.1z"/></svg>',
    calendar: S + '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
    chart: S + '<path d="M3 3v18h18"/><path d="M7 15v3"/><path d="M12 10v8"/><path d="M17 6v12"/></svg>',
    dollar: S + '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    gear: S + '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    mail: S + '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    download: S + '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>',
    plus: S + '<path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    x: S + '<path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    trash: S + '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    edit: S + '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>',
    external: S + '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>',
    tasklist: S + '<path d="M9 6h12"/><path d="M9 12h12"/><path d="M9 18h12"/><path d="m3 6 1.2 1.2L6.5 4.9"/><path d="m3 12 1.2 1.2 2.3-2.3"/><path d="m3 18 1.2 1.2 2.3-2.3"/></svg>',
    pen: S + '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>',
    sig: S + '<path d="M2 20c2-2 3-6 5-6s2 4 4 4 3-8 5-8 2 6 4 6 2-2 2-2"/></svg>',
    upload: S + '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 8 5-5 5 5"/><path d="M12 3v12"/></svg>',
    flow: S + '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>',
    star: S + '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1z"/></svg>',
    clock: S + '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    shield: S + '<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/></svg>'
  };

  const NAV = [
    { hash: "#/dashboard", label: "Dashboard", icon: "dashboard" },
    { hash: "#/tasks", label: "My Tasks", icon: "tasklist", badge: () => allTasks().filter(t => t.due && t.due <= "2026-08-14").length },
    { hash: "#/leads", label: "Leads", icon: "bolt", badge: () => LEADS.filter(l => l.status === "New").length },
    { hash: "#/cases", label: "Cases", icon: "briefcase" },
    { hash: "#/documents", label: "Documents", icon: "folder", badge: () => allDocs().filter(d => d.isNew).length },
    { hash: "#/settlements", label: "Settlements", icon: "dollar" },
    { hash: "#/calendar", label: "Calendar", icon: "calendar" },
    { hash: "#/reports", label: "Reports", icon: "chart" },
    { hash: "#/automations", label: "Automations", icon: "flow" },
    { hash: "#/contacts", label: "Contacts", icon: "contacts" },
    { hash: "#/settings", label: "Settings", icon: "gear" }
  ];

  /* ---------- helpers ---------- */

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => "$" + Math.round(n).toLocaleString("en-US");
  const stageClass = st => "st-" + st.toLowerCase().replace(/\s+/g, "-");
  const fmtDate = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  function humanize(s) {
    const m = s.match(/^(\d{4}-\d{2}-\d{2})\s*(.*)$/);
    if (!m) return s;
    const [_, d, time] = m;
    const diff = Math.round((new Date(TODAY) - new Date(d)) / 86400000);
    const day = diff === 0 ? "Today" : diff === 1 ? "Yesterday" : new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return time ? `${day}, ${time}` : day;
  }

  function allDocs() {
    return CASES.flatMap(c => c.docs.map(d => ({ ...d, caseId: c.id, client: c.client, num: c.num })));
  }
  const caseById = id => CASES.find(c => c.id === id);
  const RECENTS = [];
  const touchRecent = id => { const i = RECENTS.indexOf(id); if (i > -1) RECENTS.splice(i, 1); RECENTS.unshift(id); if (RECENTS.length > 5) RECENTS.pop(); };

  function lastActivity(c) {
    const dates = [...c.notes.map(n => n.date), ...c.docs.map(d => d.date), ...(c.emails || []).map(e => e.date)];
    return dates.sort().pop() || c.opened;
  }
  const daysSince = iso => Math.round((new Date(TODAY) - new Date(iso)) / 86400000);
  const plusDays = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

  function relatedContacts(c) {
    const out = [];
    const last = c.client.split(" ").slice(-1)[0];
    const adj = CONTACTS.find(x => x.name === c.adjuster);
    if (adj) out.push({ ...adj, rel: `Adjuster, ${c.insurer.split(" (")[0]}` });
    const def = CONTACTS.find(x => x.role.includes(`(${last})`));
    if (def) out.push({ ...def, rel: `Defense counsel, ${def.org}` });
    c.medicals.forEach(m => {
      const p = CONTACTS.find(x => x.org === m.provider || x.name === m.provider);
      if (p) out.push({ ...p, name: p.name === "Records Dept" ? p.org : p.name, rel: "Treating provider" });
    });
    const para = CONTACTS.find(x => x.name === c.paralegal);
    if (para) out.push({ ...para, rel: "Assigned paralegal" });
    return out.slice(0, 5);
  }
  const scoreClass = s => s >= 85 ? "hot" : s >= 65 ? "warm" : "cool";
  const logActivity = text => ACTIVITY.unshift({ when: "Just now", icon: "doc", text, caseId: null });

  const taskOwner = (c, label) => /review|evaluate|call|deposition|demand|mediation|prep|deadline|counter/i.test(label) ? c.attorney : c.paralegal;
  function allTasks() {
    return CASES.flatMap(c => c.checklist.map((k, i) => ({ ...k, idx: i, client: c.client, caseId: c.id, stage: c.stage, owner: taskOwner(c, k.label) })))
      .filter(t => !t.done);
  }

  /* ---------- toast + modal ---------- */

  let toastTimer;
  function toast(msg, opts = {}) {
    const t = $("#toast");
    t.innerHTML = `<div class="toast-inner">${I.check}<span>${esc(msg)}</span>${opts.undo ? '<button class="toast-undo" id="toastUndo">Undo</button>' : ""}</div>`;
    t.classList.add("show");
    if (opts.undo) $("#toastUndo").addEventListener("click", () => { opts.undo(); hideToast(); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, opts.undo ? 6000 : 3200);
  }
  function hideToast() { $("#toast").classList.remove("show"); }

  function openModal(html, wide) {
    $("#modal").innerHTML = `<div class="overlay" id="overlay"><div class="modal ${wide ? "modal-wide" : ""}">${html}</div></div>`;
    $("#overlay").addEventListener("mousedown", e => { if (e.target.id === "overlay") closeModal(); });
    document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeModal));
  }
  function closeModal() {
    $("#modal").innerHTML = "";
    document.querySelectorAll(".vt-seg").forEach(s => s.classList.toggle("active", s.dataset.vt === "staff"));
  }

  /* generic small form modal: fields = [{id,label,value,type,options,ph,wide}] */
  function formModal(title, fields, onSave, saveLabel) {
    openModal(`
      <div class="form-head"><h2>${esc(title)}</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="form-grid">
        ${fields.map(f => `<label ${f.wide ? 'style="grid-column:1/-1"' : ""}>${esc(f.label)}
          ${f.type === "select" ? `<select id="fm-${f.id}">${f.options.map(o => `<option ${o === f.value ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`
            : f.type === "textarea" ? `<textarea id="fm-${f.id}" rows="4">${esc(f.value || "")}</textarea>`
            : `<input id="fm-${f.id}" type="text" value="${esc(f.value ?? "")}" placeholder="${esc(f.ph || "")}">`}
        </label>`).join("")}
      </div>
      <div class="form-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="fm-save">${esc(saveLabel || "Save")}</button></div>`);
    const first = $("#fm-" + fields[0].id);
    if (first && !first.value) first.focus();
    $("#fm-save").addEventListener("click", () => {
      const vals = {};
      fields.forEach(f => { vals[f.id] = $("#fm-" + f.id).value; });
      closeModal();
      onSave(vals);
    });
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (document.body.classList.contains("cv-open")) { window.exitClientView(); return; }
      closeModal();
      $("#searchResults") && $("#searchResults").classList.remove("open");
    }
  });

  /* ---------- document viewer (the Drive overlay) ---------- */

  window.openDoc = function (caseId, docName) {
    const c = caseById(caseId);
    const d = c.docs.find(x => x.name === docName);
    if (!d) return;
    const content = window.docContent(c, d);
    const sevLabel = { high: "Needs attention", med: "Worth noting", low: "Informational" };
    if (d.isNew) { d.isNew = false; }
    openModal(`
      <div class="viewer">
        <div class="viewer-head">
          <div class="viewer-title">
            <div class="file-icon ${d.name.endsWith(".docx") ? "docx" : ""}">${I.doc}</div>
            <div>
              <div class="viewer-name">${esc(d.name)}</div>
              <div class="viewer-sub">${esc(c.client)} · ${esc(d.folder)} · Filed ${fmtDate(d.date)} from Google Drive</div>
            </div>
          </div>
          <div class="viewer-actions">
            ${d.name.endsWith(".docx") ? `<button class="btn btn-ghost btn-sm" id="editDoc">${I.pen}<span>Edit</span></button>
            <button class="btn btn-ghost btn-sm" id="sigDoc">${I.sig}<span>Send for Signature</span></button>` : ""}
            <button class="btn btn-ghost btn-sm" id="openDrive">${I.external}<span>Open in Drive</span></button>
            <button class="btn btn-ghost btn-sm" id="dlDoc">${I.download}<span>Download</span></button>
            <button class="icon-btn" data-close title="Close">${I.x}</button>
          </div>
        </div>
        <div class="viewer-body">
          <div class="paper-wrap"><div class="paper">
            <div class="paper-letterhead">${esc(content.letterhead || "")}</div>
            ${content.sub ? `<div class="paper-sub">${esc(content.sub)}</div>` : ""}
            <div class="paper-rule"></div>
            ${content.meta.map(m => `<div class="paper-meta">${esc(m)}</div>`).join("")}
            ${content.paragraphs.map(p => `<p class="paper-p">${esc(p).replace(/\n/g, "<br>")}</p>`).join("")}
          </div></div>
          <aside class="ai-rail">
            <h3>AI Review</h3>
            <div class="ai-summary">${esc(d.ai)}</div>
            ${content.flags.map(f => `<div class="ai-flag sev-${f.sev}"><span class="ai-sev">${sevLabel[f.sev]}</span><p>${esc(f.text)}</p></div>`).join("")}
            <div class="ai-foot">Summarized automatically when this file appeared in the case's Drive folder.</div>
          </aside>
        </div>
      </div>`, true);
    $("#openDrive").addEventListener("click", () => toast("In production this opens the original file in Google Drive"));
    $("#dlDoc").addEventListener("click", () => toast("Downloading " + d.name));
    const ed = $("#editDoc");
    if (ed) ed.addEventListener("click", () => toast("In production this opens the embedded editor. The file never leaves Drive"));
    const sg = $("#sigDoc");
    if (sg) sg.addEventListener("click", () => {
      d.sig = "pending";
      logActivity(`${d.name} sent to ${c.client} for e-signature`);
      closeModal();
      refresh();
      toast(`Sent to ${c.client} for e-signature. You will be notified when it is signed`);
      simulateSignature(c, d);
    });
  };

  /* ---------- client portal (what the client sees on their phone) ---------- */

  const PORTAL_COPY = {
    "Intake": ["Case opened", "We opened your file and gathered the basics."],
    "Investigation": ["Building your case", "We are collecting reports, footage, and evidence."],
    "Treating": ["Focus on getting better", "Keep every appointment. We track the records and bills."],
    "Demand Prep": ["Preparing your demand", "We are assembling your full demand package."],
    "Negotiation": ["Negotiating for you", "We are negotiating with the insurance company."],
    "Litigation": ["Your case is in court", "We filed suit and are pushing your case forward."],
    "Settled": ["Settlement complete", "Your case is resolved. Thank you for trusting us."]
  };

  window.openPortal = function (id) {
    const c = caseById(id);
    const stageIdx = STAGES.indexOf(c.stage);
    const first = c.client.split(" ")[0];
    const nextEvt = EVENTS.find(e => e.caseId === c.id && e.date >= TODAY);
    openModal(`
      <div class="portal">
        <div class="portal-note">This is what ${esc(first)} sees at <strong>portal.dixoninjuryfirm.com</strong>, updated automatically from the file. <button class="icon-btn" data-close style="margin-left:auto">${I.x}</button></div>
        <div class="phone">
          <div class="portal-head">
            <img src="assets/logo.png" alt="The Dixon Injury Firm">
            <div class="portal-case">Your case · ${c.num}</div>
          </div>
          <div class="portal-body">
            <h3 class="portal-hi">Hi ${esc(first)}</h3>
            <div class="portal-sub">Here is exactly where your case stands.</div>
            <div class="tracker">
              ${STAGES.map((st, i) => {
                const [title, blurb] = PORTAL_COPY[st];
                const state = i < stageIdx ? "done" : i === stageIdx ? "now" : "todo";
                return `<div class="tk ${state}">
                  <div class="tk-rail"><span class="tk-dot">${i < stageIdx ? I.check : ""}</span>${i < STAGES.length - 1 ? '<span class="tk-line"></span>' : ""}</div>
                  <div class="tk-body">
                    <div class="tk-title">${title}${state === "now" ? '<span class="tk-here">You are here</span>' : ""}</div>
                    ${state === "now" ? `<div class="tk-blurb">${blurb}</div>` : ""}
                  </div>
                </div>`;
              }).join("")}
            </div>
            ${c.texts && c.texts.length ? `<div class="portal-card" style="background:#fff">
              <div class="portal-card-label">Messages</div>
              <div class="portal-msgs">
                ${c.texts.slice(-3).map(t => `<div class="pmsg ${t.from === "client" ? "pmsg-me" : ""}">${esc(t.text)}</div>`).join("")}
              </div>
              <div class="portal-card-sub" style="margin-top:8px">Same thread your legal team sees. Reply anytime.</div>
            </div>` : ""}
            ${nextEvt ? `<div class="portal-card">
              <div class="portal-card-label">Coming up</div>
              <div class="portal-card-main">${esc((t => t.charAt(0).toUpperCase() + t.slice(1))(nextEvt.title.split(": ")[1] || nextEvt.title))}</div>
              <div class="portal-card-sub">${fmtDate(nextEvt.date)}${nextEvt.time !== "All day" ? " · " + esc(nextEvt.time) : ""}</div>
            </div>` : ""}
            <div class="portal-card">
              <div class="portal-card-label">Your team</div>
              <div class="portal-card-main">${esc(c.paralegal)} and Chris Dixon</div>
              <div class="portal-card-sub">Questions? Text us anytime, we reply fast.</div>
            </div>
            <div class="portal-actions">
              <button class="btn btn-primary" onclick="toastPortal('Message thread opens, texts land in the case file')">Message us</button>
              <button class="btn btn-ghost" onclick="toastPortal('Photos and documents upload straight to the case Drive folder')">Upload a document</button>
            </div>
          </div>
        </div>
      </div>`, true);
  };
  window.toastPortal = msg => toast(msg);

  /* ---------- full-page client portal (the mock client dashboard) ---------- */

  let clientCase = "c1";

  window.enterClientView = function (id) {
    if (id && caseById(id)) clientCase = id;
    const c = caseById(clientCase);
    closeModal();
    let cv = $("#clientView");
    if (!cv) { cv = document.createElement("div"); cv.id = "clientView"; document.body.appendChild(cv); }
    const stageIdx = STAGES.indexOf(c.stage);
    const first = c.client.split(" ")[0];
    const nextEvt = EVENTS.find(e => e.caseId === c.id && e.date >= TODAY);
    const signedDocs = c.docs.filter(d => d.folder === "01 Intake & Retainer" || d.sig).slice(0, 3);
    cv.innerHTML = `
      <div class="cv-head">
        <div class="cv-head-inner">
          <img src="assets/logo.png" alt="The Dixon Injury Firm">
          <span class="cv-badge">Client Portal</span>
          <div class="cv-head-right">
            <select id="cvPicker" title="Preview as a different client">
              ${CASES.filter(x => x.stage !== "Settled").map(x => `<option value="${x.id}" ${x.id === c.id ? "selected" : ""}>${esc(x.client)}</option>`).join("")}
            </select>
            <button class="btn btn-primary btn-sm" id="cvExit">Exit preview</button>
          </div>
        </div>
      </div>
      <div class="cv-main">
        <h1 class="cv-hi">Hi ${esc(first)}</h1>
        <p class="cv-sub">Here is exactly where your case stands, updated the moment anything happens.</p>
        <div class="card">
          <div class="card-head"><h2>Your Case</h2><span class="drive-note">${esc(c.type)} · started ${fmtDate(c.opened)}</span></div>
          <div class="tracker" style="padding:18px 18px 6px">
            ${STAGES.map((st, i) => {
              const [title, blurb] = PORTAL_COPY[st];
              const state = i < stageIdx ? "done" : i === stageIdx ? "now" : "todo";
              return `<div class="tk ${state}">
                <div class="tk-rail"><span class="tk-dot">${i < stageIdx ? I.check : ""}</span>${i < STAGES.length - 1 ? '<span class="tk-line"></span>' : ""}</div>
                <div class="tk-body">
                  <div class="tk-title">${title}${state === "now" ? '<span class="tk-here">You are here</span>' : ""}</div>
                  ${state === "now" ? `<div class="tk-blurb">${blurb}</div>` : ""}
                </div>
              </div>`;
            }).join("")}
          </div>
        </div>
        ${(() => {
          const clientSafe = { Call: "Phone call with your legal team", Meeting: "Meeting with your legal team", Deposition: "Your deposition (we will prepare you)", Mediation: "Mediation session", Exam: "Medical examination", Consult: "Consultation" };
          const evt = EVENTS.filter(e => e.caseId === c.id && e.date >= TODAY && clientSafe[e.kind])[0];
          return evt ? `<div class="card">
          <div class="card-head"><h2>Coming Up</h2></div>
          <div class="facts"><strong>${clientSafe[evt.kind]}</strong><br><span style="color:var(--muted)">${fmtDate(evt.date)}${evt.time !== "All day" ? " · " + esc(evt.time) : ""}</span></div>
        </div>` : "";
        })()}
        <div class="card">
          <div class="card-head"><h2>Messages</h2><span class="drive-note">Goes straight to your legal team</span></div>
          <div class="sms-thread" id="cvThread">
            ${(c.texts || []).map(t => `<div class="sms ${t.from === "client" ? "sms-firm" : "sms-client"}">
              <div class="sms-bubble" ${t.from === "client" ? "" : 'style="background:#fff"'}>${esc(t.text)}</div>
              <div class="sms-when">${t.from === "client" ? "You" : "Your legal team"} · ${esc(t.when)}</div>
            </div>`).join("") || `<div class="empty-state">No messages yet. Say hello.</div>`}
            <div class="sms-compose"><input type="text" placeholder="Message your legal team" id="cvInput"><button class="btn btn-primary btn-sm" id="cvSend">Send</button></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h2>Your Documents</h2><button class="btn btn-ghost btn-sm" id="cvUpload">Upload</button><input type="file" id="cvUploadInput" multiple hidden></div>
          ${signedDocs.map(d => `<div class="feed-item no-click" style="cursor:default">
            <div class="file-icon ${d.name.endsWith(".docx") ? "docx" : ""}">${I.doc}</div>
            <div class="feed-body"><div class="file-name">${esc(d.name)}${d.sig === "pending" ? '<span class="sig-pill">Waiting for your signature</span>' : d.sig === "signed" ? '<span class="sig-pill signed">Signed</span>' : ""}</div>
            <div class="file-meta">${fmtDate(d.date)}</div></div>
          </div>`).join("") || `<div class="empty-state">Nothing shared yet.</div>`}
        </div>
        <div class="card">
          <div class="card-head"><h2>Your Team</h2></div>
          <div class="facts">${esc(c.paralegal)} and Chris Dixon are on your case.<br>
          <span style="color:var(--muted)">Call anytime: <a href="tel:13142082808" style="color:var(--orange);font-weight:600">(314) 208-2808</a></span></div>
        </div>
        <p class="cv-foot">The Dixon Injury Firm · St. Louis, Missouri · You are seeing a live view of your file ${c.num}</p>
      </div>`;
    cv.classList.add("open");
    document.body.classList.add("cv-open");
    document.querySelectorAll(".vt-seg").forEach(s => s.classList.toggle("active", s.dataset.vt === "client"));
    $("#cvExit").addEventListener("click", exitClientView);
    $("#cvPicker").addEventListener("change", e => enterClientView(e.target.value));
    const send = () => {
      const input = $("#cvInput");
      const text = input.value.trim();
      if (!text) return;
      if (!c.texts) c.texts = [];
      c.texts.push({ from: "client", text, when: "Just now" });
      logActivity(`${c.client} sent a message through the portal`);
      enterClientView(c.id);
      toast("Sent. Your legal team was notified");
    };
    $("#cvSend").addEventListener("click", send);
    $("#cvInput").addEventListener("keydown", e => { if (e.key === "Enter") send(); });
    $("#cvUpload").addEventListener("click", () => $("#cvUploadInput").click());
    $("#cvUploadInput").addEventListener("change", e => {
      [...e.target.files].forEach(f => c.docs.unshift({ folder: "01 Intake & Retainer", name: f.name, date: TODAY, isNew: true, ai: `Uploaded by ${c.client} through the client portal. Filed and summarized automatically.` }));
      if (e.target.files.length) { logActivity(`${c.client} uploaded ${e.target.files.length} document(s) through the portal`); toast("Sent to your legal team and filed"); enterClientView(c.id); }
    });
  };

  window.exitClientView = function () {
    const cv = $("#clientView");
    if (cv) cv.classList.remove("open");
    document.body.classList.remove("cv-open");
    document.querySelectorAll(".vt-seg").forEach(s => s.classList.toggle("active", s.dataset.vt === "staff"));
    refresh();
  };

  /* ---------- shell ---------- */

  function renderNav(active) {
    $("#nav").innerHTML = NAV.map(n => {
      const b = n.badge ? n.badge() : 0;
      return `<a class="nav-item ${active.startsWith(n.hash) ? "active" : ""}" href="${n.hash}" title="${n.label}">
        ${I[n.icon]}<span class="nav-label">${n.label}</span>${b ? `<span class="nav-badge">${b}</span>` : ""}
      </a>`;
    }).join("");
  }

  /* ---------- dashboard ---------- */

  function viewDashboard() {
    const open = CASES.filter(c => c.stage !== "Settled");
    const newDocs = allDocs().filter(d => d.isNew).sort((a, b) => b.date.localeCompare(a.date));
    const newLeads = LEADS.filter(l => l.status === "New" || l.status === "Qualified");
    const chatLeads = newLeads.filter(l => l.source === "Website chat").length;
    const newDocCases = new Set(newDocs.map(d => d.caseId)).size;
    const dueSoon = CASES.flatMap(c => c.checklist.filter(k => !k.done && k.due).map(k => ({ ...k, client: c.client, caseId: c.id })))
      .sort((a, b) => a.due.localeCompare(b.due)).slice(0, 6);
    const pipelineValue = open.reduce((s, c) => s + c.estValue, 0);

    return `
      <div class="page-head">
        <div class="page-title">
          <h1>Good morning, Chris</h1>
          <p>Friday, August 7. Here is where every file stands.</p>
        </div>
        <button class="btn btn-ghost" onclick="location.hash='#/documents'">Review ${newDocs.length} new filings</button>
      </div>

      <div class="stat-row">
        <div class="stat clickable" onclick="location.hash='#/cases'"><span class="stat-label">Open Cases</span><span class="stat-value">${open.length}</span><span class="stat-note up">3 opened this month</span></div>
        <div class="stat clickable" onclick="location.hash='#/leads'"><span class="stat-label">Active Leads</span><span class="stat-value">${newLeads.length}</span><span class="stat-note up">${chatLeads} from website chat</span></div>
        <div class="stat clickable" onclick="location.hash='#/documents'"><span class="stat-label">New Filings</span><span class="stat-value">${newDocs.length}</span><span class="stat-note warn">across ${newDocCases} cases</span></div>
        <div class="stat clickable" onclick="location.hash='#/settlements'"><span class="stat-label">Pipeline Value</span><span class="stat-value">${money(pipelineValue)}</span><span class="stat-note">est. across open files</span></div>
      </div>

      <div class="card pipeline-card" style="margin-bottom:18px">
        <div class="card-head"><h2>Case Pipeline</h2><span class="link" onclick="location.hash='#/cases'">All cases</span></div>
        <div class="pipeline">
          ${STAGES.map(st => {
            const cs = CASES.filter(c => c.stage === st);
            return `<div class="pipe-col">
              <div class="pipe-head"><span class="pipe-dot"></span><h3>${st}</h3><span class="pipe-count">${cs.length}</span></div>
              <div class="pipe-cards">
                ${cs.map(c => `<div class="pipe-card" onclick="location.hash='#/case/${c.id}'">
                  <div class="pipe-client">${esc(c.client)}</div>
                  <div class="pipe-type">${esc(c.type)}</div>
                  <div class="pipe-meta">
                    <span class="pipe-value">${money(c.estValue)}</span>
                    ${c.docs.some(d => d.isNew) ? `<span class="doc-badge">${c.docs.filter(d => d.isNew).length} new</span>` : ""}
                  </div>
                </div>`).join("") || `<div class="empty-state" style="padding:14px 6px;font-size:12px">No cases</div>`}
              </div>
            </div>`;
          }).join("")}
        </div>
      </div>

      <div class="dash-grid">
        <div class="dash-col">
          <div class="card">
            <div class="card-head"><h2>New Filings From Drive</h2><span class="link" onclick="location.hash='#/documents'">Open Documents</span></div>
            <div class="feed">
              ${newDocs.slice(0, 6).map(d => `
                <div class="feed-item" onclick="openDoc('${d.caseId}','${esc(d.name)}');">
                  <div class="feed-icon">${I.doc}</div>
                  <div class="feed-body">
                    <div class="feed-title">${esc(d.name)}<span class="new-pill">NEW</span></div>
                    <div class="feed-sub">${esc(d.client)} · ${esc(d.folder)} · ${fmtDate(d.date)}</div>
                    <div class="feed-ai">${esc(d.ai)}</div>
                  </div>
                </div>`).join("")}
            </div>
          </div>
        </div>
        <div class="dash-col">
          <div class="card">
            <div class="card-head"><h2>Deadlines</h2><span class="link" onclick="location.hash='#/calendar'">Calendar</span></div>
            <div class="check-list">
              ${dueSoon.map(k => `<div class="check-item" onclick="location.hash='#/case/${k.caseId}'" style="cursor:pointer">
                <span class="check-box"></span>
                <div><div class="check-label">${esc(k.label)}</div><div class="td-sub">${esc(k.client)}</div></div>
                <span class="check-due ${k.due <= "2026-08-14" ? "soon" : ""}">${fmtDate(k.due)}</span>
              </div>`).join("")}
            </div>
          </div>
          ${(() => {
            const stale = CASES.filter(c => c.stage !== "Settled" && daysSince(lastActivity(c)) > 21);
            return stale.length ? `<div class="card">
            <div class="card-head"><h2>Needs Attention</h2></div>
            <div class="check-list">
              ${stale.map(c => `<div class="check-item" style="cursor:pointer" onclick="location.hash='#/case/${c.id}'">
                <div><div class="check-label">${esc(c.client)}</div><div class="td-sub">${esc(c.type)} · ${esc(c.paralegal)}</div></div>
                <span class="check-due soon">${daysSince(lastActivity(c))} days quiet</span>
              </div>`).join("")}
            </div>
          </div>` : "";
          })()}
          <div class="card">
            <div class="card-head"><h2>Statute Watch</h2></div>
            <div class="check-list">
              ${CASES.filter(x => x.stage !== "Settled").sort((a, b) => a.sol.localeCompare(b.sol)).slice(0, 4).map(x => {
                const mo = Math.round((new Date(x.sol) - new Date(TODAY)) / 2629800000);
                return `<div class="check-item" style="cursor:pointer" onclick="location.hash='#/case/${x.id}'">
                  <div><div class="check-label">${esc(x.client)}</div><div class="td-sub">${esc(x.type)} · SOL ${fmtDate(x.sol)}</div></div>
                  <span class="sol-chip ${mo <= 24 ? "sol-warn" : ""}" style="margin-left:auto">${mo <= 24 ? mo + " mo" : (mo / 12).toFixed(1) + " yr"}</span>
                </div>`;
              }).join("")}
            </div>
          </div>
          <div class="card">
            <div class="card-head"><h2>Activity</h2></div>
            <div class="feed">
              ${ACTIVITY.slice(0, 6).map(a => `
                <div class="feed-item" ${a.caseId ? `onclick="location.hash='#/case/${a.caseId}'"` : ""}>
                  <div class="feed-icon ${a.icon === "check" ? "green" : a.icon === "lead" ? "blue" : ""}">${I[a.icon] || I.doc}</div>
                  <div class="feed-body">
                    <div class="feed-title" style="font-weight:400">${esc(a.text)}</div>
                    <div class="feed-when">${esc(a.when)}</div>
                  </div>
                </div>`).join("")}
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ---------- my tasks ---------- */

  let taskPerson = "Chris Dixon";

  function viewTasks() {
    const people = ["Chris Dixon", "Dana Ellis", "Renee Carter", "Everyone"];
    const tasks = allTasks()
      .filter(t => taskPerson === "Everyone" || t.owner === taskPerson)
      .sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999"));
    return `
      <div class="page-head">
        <div class="page-title"><h1>My Tasks</h1><p>Every open task across every file, so nobody keeps a side list.</p></div>
      </div>
      <div class="filter-row">
        ${people.map(p => `<button class="chip ${taskPerson === p ? "active" : ""}" data-person="${p}">${p === "Everyone" ? "Everyone" : p.split(" ")[0]}</button>`).join("")}
        <span class="drive-note" style="margin-left:auto">${tasks.length} open${taskPerson !== "Everyone" ? " for " + taskPerson.split(" ")[0] : ""}</span>
      </div>
      <div class="card">
        <div class="check-list">
          ${tasks.map(t => `<div class="check-item task-row" data-go="#/case/${t.caseId}">
            <span class="check-box task-check" data-check="${t.idx}" data-case="${t.caseId}" title="Mark complete"></span>
            <div style="min-width:0"><div class="check-label">${esc(t.label)}</div>
            <div class="td-sub">${esc(t.client)} · ${esc(t.stage)}${taskPerson === "Everyone" ? " · " + esc(t.owner) : ""}</div></div>
            <span class="check-due ${t.due && t.due <= "2026-08-14" ? "soon" : ""}">${t.due ? fmtDate(t.due) : ""}</span>
            <button class="mini-btn task-snooze" data-snoozecase="${t.caseId}" data-snoozeidx="${t.idx}" title="Snooze one week">${I.clock}</button>
          </div>`).join("") || `<div class="empty-state">Nothing open. Enjoy it while it lasts.</div>`}
        </div>
      </div>`;
  }

  /* ---------- cases ---------- */

  let caseFilter = "All";
  const bulkSel = new Set();

  function viewCases() {
    const rows = CASES.filter(c => caseFilter === "All" || c.stage === caseFilter)
      .slice().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    return `
      <div class="page-head">
        <div class="page-title"><h1>Cases</h1><p>${CASES.length} files, synced with the firm's Google Drive folder system.</p></div>
        <button class="btn btn-primary" onclick="newCase()">New Case</button>
      </div>
      <div class="filter-row">
        ${["All", ...STAGES].map(st => `<button class="chip ${caseFilter === st ? "active" : ""}" data-stage="${st}">${st}</button>`).join("")}
      </div>
      ${bulkSel.size ? `<div class="bulk-bar">
        <strong>${bulkSel.size} selected</strong>
        <button class="btn btn-ghost btn-sm" data-bulkassign="Dana Ellis">Assign to Dana</button>
        <button class="btn btn-ghost btn-sm" data-bulkassign="Renee Carter">Assign to Renee</button>
        <button class="btn btn-ghost btn-sm" id="bulkClear">Clear</button>
      </div>` : ""}
      <div class="card table-wrap">
        <table>
          <thead><tr><th style="width:76px"></th><th>Client</th><th>Case</th><th>Stage</th><th>Insurer</th><th>Paralegal</th><th>Est. Value</th><th>Last Activity</th><th>Documents</th></tr></thead>
          <tbody>
            ${rows.map(c => {
              const la = lastActivity(c);
              const ds = daysSince(la);
              const stale = c.stage !== "Settled" && ds > 21;
              return `<tr onclick="location.hash='#/case/${c.id}'">
              <td><div style="display:flex;align-items:center;gap:7px">
                <input type="checkbox" class="bulk-ck" data-bulk="${c.id}" ${bulkSel.has(c.id) ? "checked" : ""} onclick="event.stopPropagation()">
                <button class="mini-btn pin-btn ${c.pinned ? "pinned" : ""}" data-pin="${c.id}" title="${c.pinned ? "Unpin" : "Pin to top"}">${I.star}</button>
              </div></td>
              <td><div class="td-main">${esc(c.client)}</div><div class="td-sub">${esc(c.phone)}</div></td>
              <td><div>${esc(c.type)}</div><div class="td-sub">${c.num}</div></td>
              <td><span class="stage-pill ${stageClass(c.stage)}">${c.stage}</span></td>
              <td>${esc(c.insurer)}</td>
              <td>${esc(c.paralegal)}</td>
              <td class="money">${money(c.estValue)}</td>
              <td><span style="${stale ? "color:var(--red);font-weight:600" : ""}">${ds === 0 ? "Today" : ds === 1 ? "Yesterday" : ds + " days ago"}</span>${stale ? '<div class="td-sub" style="color:var(--red)">Needs attention</div>' : ""}</td>
              <td>${c.docs.some(d => d.isNew) ? `<span class="doc-badge">${c.docs.filter(d => d.isNew).length} new</span>` : `<span class="td-sub">${c.docs.length} files</span>`}</td>
            </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`;
  }

  window.newCase = function () {
    openModal(`
      <div class="form-head"><h2>New Case</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="form-note">Opening a case creates the Drive folder set, checklist, and intake tasks automatically.</div>
      <div class="dup-warn" id="dupWarn"></div>
      <div class="form-grid">
        <label>Client name<input id="f-name" type="text" placeholder="First Last"></label>
        <label>Case type<select id="f-type">${["Car Accident", "Truck Accident", "Motorcycle Accident", "Workers Comp", "Slip and Fall", "Dog Bite", "Premises Liability", "Pedestrian Accident", "Other Injury"].map(t => `<option>${t}</option>`).join("")}</select></label>
        <label>Phone<input id="f-phone" type="text" placeholder="(314) 555-0100"></label>
        <label>Incident date<input id="f-date" type="date" value="2026-08-01"></label>
      </div>
      <div class="form-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="f-save">Open Case</button></div>`);
    $("#f-name").addEventListener("input", () => {
      const parts = $("#f-name").value.trim().toLowerCase().split(/\s+/);
      const last = parts[parts.length - 1];
      const dup = last && last.length > 2 && CASES.find(x => x.client.toLowerCase().split(/\s+/).includes(last));
      const conflict = last && last.length > 2 && CONTACTS.find(x => x.kind !== "Firm" && x.name.toLowerCase().split(/\s+/).includes(last));
      $("#dupWarn").innerHTML = dup
        ? `Possible duplicate or conflict: existing file for <strong>${esc(dup.client)}</strong> (${dup.num}, ${dup.stage}). Review before opening.`
        : conflict ? `Conflict check: <strong>${esc(conflict.name)}</strong> (${esc(conflict.org)}) is in contacts as ${esc(conflict.role)}. Review before opening.` : "";
      $("#dupWarn").style.display = dup || conflict ? "block" : "none";
    });
    $("#f-save").addEventListener("click", () => {
      const name = $("#f-name").value.trim() || "New Client";
      const id = "c" + (CASES.length + 1) + Date.now().toString().slice(-4);
      const num = "DIF-2026-0" + (53 + CASES.length - 18);
      CASES.push({
        id, num, client: name, type: $("#f-type").value, stage: "Intake",
        opened: TODAY, incident: $("#f-date").value || TODAY, phone: $("#f-phone").value || "(314) 555-0100",
        email: name.toLowerCase().replace(/\s+/g, ".") + "@example.com", insurer: "To be identified",
        adjuster: "Unassigned", claimNo: "Pending", paralegal: "Dana Ellis", attorney: "Chris Dixon",
        estValue: 25000, sol: "2031-08-01",
        facts: "New matter opened from intake. Facts to be completed after the initial interview.",
        medicals: [], negotiation: [],
        checklist: [
          { label: "Retainer signed", done: true, date: TODAY },
          { label: "Letter of representation", done: false, due: "2026-08-11" },
          { label: "Crash/incident report request", done: false, due: "2026-08-13" }
        ],
        notes: [{ date: TODAY, by: "Chris Dixon", text: "File opened. Drive folders and intake checklist created automatically." }],
        docs: [{ folder: "01 Intake & Retainer", name: `Signed retainer - ${name.split(" ").slice(-1)[0]}.pdf`, date: TODAY, isNew: true, ai: "Standard contingency agreement, signed electronically." }],
        emails: [], expenses: []
      });
      logActivity(`New case opened: ${name}. Drive folder set and checklist created`);
      closeModal();
      const last = name.toLowerCase().split(/\s+/).pop();
      const dup = CASES.find(x => x.id !== id && x.client.toLowerCase().split(/\s+/).includes(last));
      toast(dup
        ? `Case opened with a conflict note: existing file for ${dup.client}`
        : `Conflict check passed against ${CASES.length} cases and ${CONTACTS.length} contacts. Case opened`);
      location.hash = "#/case/" + id;
    });
  };

  /* ---------- case detail ---------- */

  function viewCase(id, tab) {
    const c = caseById(id);
    if (!c) return `<div class="empty-state">Case not found.</div>`;
    touchRecent(id);
    tab = tab || "overview";
    const specials = c.medicals.reduce((s, m) => s + m.billed, 0);
    const newCount = c.docs.filter(d => d.isNew).length;
    const tabs = [
      ["overview", "Overview"],
      ["timeline", "Timeline"],
      ["medicals", "Medicals"],
      ["negotiation", "Negotiation"],
      ["checklist", "Checklist"],
      ["emails", "Comms"],
      ["expenses", "Expenses"],
      ["notes", "Notes"],
      ["documents", `Documents${newCount ? `<span class="tab-badge">${newCount}</span>` : ""}`]
    ];
    const stageIdx = STAGES.indexOf(c.stage);

    return `
      <div class="case-head">
        <div class="crumb"><a href="#/cases">Cases</a><span class="sep">/</span><span>${c.num}</span></div>
        <div class="case-title-row">
          <div>
            <h1>${esc(c.client)}</h1>
            <div class="case-title-meta">
              <span class="stage-pill ${stageClass(c.stage)}">${c.stage}</span>
              <span class="case-num">${esc(c.type)} · ${c.num} · ${esc(c.attorney)}${specials ? ` · <strong>${money(specials)}</strong> in specials` : ""}</span>
            </div>
            <div class="td-sub" style="margin-top:5px">Last touched ${(() => { const la = lastActivity(c); const ds = daysSince(la); const by = c.notes.slice().sort((a, b) => b.date.localeCompare(a.date))[0]; return `${ds === 0 ? "today" : ds === 1 ? "yesterday" : fmtDate(la)}${by ? " · latest note by " + esc(by.by) : ""}`; })()}</div>
          </div>
          <div class="case-actions">
            <a class="icon-btn" href="tel:${esc(c.phone.replace(/[^0-9]/g, ""))}" title="Call ${esc(c.client.split(" ")[0])} at ${esc(c.phone)}">${S}<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.8.7a2 2 0 0 1 1.7 2z"/></svg></a>
            <button class="icon-btn" onclick="location.hash='#/case/${c.id}/emails'" title="Text ${esc(c.client.split(" ")[0])}">${I.chat}</button>
            <button class="btn btn-ghost" onclick="location.hash='#/case/${c.id}/summary'">Summary</button>
            <button class="btn btn-ghost" onclick="openPortal('${c.id}')">Client View</button>
            <button class="btn btn-ghost" onclick="genDoc('${c.id}')">Generate Document</button>
            <button class="btn btn-primary" onclick="addNote('${c.id}')">Log Activity</button>
          </div>
        </div>
        <div class="stage-path">
          ${STAGES.map((st, i) => `<div class="path-step ${i < stageIdx ? "done" : i === stageIdx ? "current" : ""}" data-move="${i !== stageIdx ? c.id + "|" + i : ""}" title="${i < stageIdx ? "Move back to " + st : i === stageIdx + 1 ? "Advance to " + st : i > stageIdx ? "Move to " + st : st}">${st}</div>`).join("")}
        </div>
        <div class="tabs">
          ${tabs.map(([k, label]) => `<button class="tab ${tab === k ? "active" : ""}" data-tab="${k}" data-case="${c.id}">${label}</button>`).join("")}
          ${(CUSTOM_TABS[c.type] || []).map(t => `<button class="tab ${tab === t.key ? "active" : ""}" data-tab="${t.key}" data-case="${c.id}">${esc(t.label)}</button>`).join("")}
          <button class="tab tab-add" onclick="customizeLayout('${c.id}')" title="Customize this case type's layout">+ Customize</button>
        </div>
      </div>
      <div class="tab-body">${caseTab(c, tab)}</div>`;
  }

  window.addNote = function (id) {
    const c = caseById(id);
    openModal(`
      <div class="form-head"><h2>Log Activity</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="form-grid form-grid-1">
        <label>Note<textarea id="n-text" rows="4" placeholder="What happened on this file?"></textarea></label>
      </div>
      <div class="form-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="n-save">Save Note</button></div>`);
    $("#n-text").focus();
    $("#n-save").addEventListener("click", () => {
      const text = $("#n-text").value.trim();
      if (text) {
        c.notes.unshift({ date: TODAY, by: "Chris Dixon", text });
        logActivity(`Note added to ${c.client}`);
        const mention = text.match(/@(Dana|Renee|Chris)\b[:,]?\s*(.*)/i);
        if (mention) {
          c.checklist.push({ label: (mention[2].trim() || "Follow up from note").slice(0, 90), done: false, due: plusDays(TODAY, 3) });
          toast(`Note saved. Task created for ${mention[1]} due ${fmtDate(plusDays(TODAY, 3))}`);
        } else {
          toast("Note saved to the file");
        }
      }
      closeModal();
      refresh();
    });
  };

  window.genDoc = function (id) {
    const c = caseById(id);
    const templates = [
      ["Demand letter", "06 Demand", "Demand letter draft"],
      ["Records request", "02 Medical Records", "Records request"],
      ["Representation letter", "04 Insurance", "Letter of representation"],
      ["Settlement statement", "08 Settlement", "Settlement statement draft"],
      ["HIPAA authorization for e-signature", "01 Intake & Retainer", "HIPAA authorization", true]
    ];
    openModal(`
      <div class="form-head"><h2>Generate Document</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="form-note">Built from the forms library, merged with this case's data, and filed to the Drive folder.</div>
      <div class="tpl-list">
        ${templates.map((t, i) => `<button class="tpl" data-tpl="${i}">${I.doc}<div><div class="tpl-name">${t[0]}</div><div class="tpl-sub">Files to ${t[1]}</div></div></button>`).join("")}
      </div>`);
    document.querySelectorAll(".tpl").forEach(b => b.addEventListener("click", () => {
      const t = templates[+b.dataset.tpl];
      const doc = { folder: t[1], name: `${t[2]} - ${c.client.split(" ").slice(-1)[0]}.docx`, date: TODAY, isNew: true, ai: `${t[0]} generated from case data: parties, ${c.medicals.length} providers, and the ${c.insurer} claim. Ready for attorney review.` };
      if (t[3]) { doc.sig = "pending"; doc.ai = `Generated from case data and sent to ${c.client} for e-signature. Status tracked here.`; simulateSignature(c, doc); }
      c.docs.unshift(doc);
      logActivity(`${t[0]} generated for ${c.client} and filed to ${t[1]}`);
      closeModal();
      toast(t[3] ? `Sent to ${c.client} for e-signature and filed` : t[0] + " drafted and filed to Drive");
      refresh();
    }));
  };

  function caseTab(c, tab) {
    if (tab === "overview") {
      const medLast = c.docs.filter(d => d.folder === "02 Medical Records").map(d => d.date).sort().pop();
      const gap = c.stage === "Treating" && medLast ? daysSince(medLast) : 0;
      return `${gap > 30 ? `<div class="alert-banner">Possible treatment gap: no new medical records in ${gap} days. Gaps hurt case value, check in with ${esc(c.client.split(" ")[0])}.
        <button class="btn btn-primary btn-sm" onclick="location.hash='#/case/${c.id}/emails'">Text the client</button></div>` : ""}
      <div class="case-grid">
        <div class="dash-col">
          <div class="card">
            <div class="card-head"><h2>Case Facts</h2><button class="btn btn-ghost btn-sm" onclick="editFacts('${c.id}')">Edit</button></div>
            <div class="facts">${esc(c.facts)}</div>
          </div>
          <div class="card">
            <div class="card-head"><h2>Details</h2><button class="btn btn-ghost btn-sm" onclick="editDetails('${c.id}')">Edit</button></div>
            <div class="kv-grid">
              ${(() => {
                const monthsLeft = Math.round((new Date(c.sol) - new Date(TODAY)) / 2629800000);
                const solNote = monthsLeft <= 24
                  ? ` <span class="sol-chip sol-warn">${monthsLeft} months left</span>`
                  : ` <span class="sol-chip">${(monthsLeft / 12).toFixed(1)} years left</span>`;
                const rows = [["Incident Date", fmtDate(c.incident)], ["Statute of Limitations", fmtDate(c.sol) + solNote],
                  ["Insurer", esc(c.insurer)], ["Claim Number", esc(c.claimNo)],
                  ["Adjuster", esc(c.adjuster)], ["Paralegal", esc(c.paralegal)],
                  ["Client Phone", esc(c.phone)], ["Client Email", esc(c.email)]];
                if (c.court) rows.push(["Court", esc(c.court.venue)], ["Judge", esc(c.court.judge)],
                  ["Court Case No.", esc(c.court.caseNo)], ["Division", esc(c.court.division)]);
                rows.push(["Policy Limits", esc(c.policy.liability)], ["UM/UIM Coverage", esc(c.policy.um)],
                  ["Preferred Contact", esc(c.pref)], ["Language", esc(c.language)]);
                if (c.referral) rows.push(["Referred By", esc(c.referral.by)], ["Referral Fee", esc(c.referral.share)]);
                return rows.map(([k, v]) => `<div class="kv"><div class="kv-label">${k}</div><div class="kv-value">${v}</div></div>`).join("");
              })()}
            </div>
          </div>
          <div class="card">
            <div class="card-head"><h2>Case Expenses</h2></div>
            <div class="table-foot" style="border-radius:0 0 12px 12px">
              <span>Advanced to date: <strong class="money">${money(c.expenses.reduce((s, e) => s + e.amount, 0))}</strong></span>
              <span>Medical billed: <strong class="money">${money(c.medicals.reduce((s, m) => s + m.billed, 0))}</strong></span>
              <span>Liens asserted: <strong class="money">${money(c.medicals.reduce((s, m) => s + m.lien, 0))}</strong></span>
            </div>
          </div>
        </div>
        <div class="dash-col">
          <div class="card">
            <div class="card-head"><h2>Latest Notes</h2></div>
            ${c.notes.slice(0, 3).map(n => `<div class="note">
              <div class="note-head"><span class="note-by">${esc(n.by)}</span><span>${fmtDate(n.date)}</span></div>
              <div class="note-text">${esc(n.text)}</div>
            </div>`).join("") || `<div class="empty-state">No notes yet.</div>`}
          </div>
          <div class="card">
            <div class="card-head"><h2>Open Tasks</h2></div>
            <div class="check-list">
              ${c.checklist.filter(k => !k.done).map(k => `<div class="check-item">
                <span class="check-box"></span><span class="check-label">${esc(k.label)}</span>
                ${k.due ? `<span class="check-due ${k.due <= "2026-08-14" ? "soon" : ""}">${fmtDate(k.due)}</span>` : ""}
              </div>`).join("") || `<div class="empty-state">All caught up.</div>`}
            </div>
          </div>
          <div class="card">
            <div class="card-head"><h2>Related Contacts</h2></div>
            <div class="check-list">
              ${relatedContacts(c).map(x => `<div class="check-item" style="cursor:pointer" onclick="location.hash='#/contacts'">
                <div class="avatar" style="width:30px;height:30px;font-size:11px;background:var(--ink)">${esc(x.name.split(" ").map(w => w[0]).slice(0, 2).join(""))}</div>
                <div><div class="check-label">${esc(x.name)}</div><div class="td-sub">${esc(x.rel)}</div></div>
                <span class="check-due">${esc(x.phone)}</span>
              </div>`).join("") || `<div class="empty-state">No linked contacts yet.</div>`}
            </div>
          </div>
        </div>
      </div>`;
    }

    if (tab === "timeline") {
      const items = [
        ...c.docs.map(d => ({ date: d.date, icon: "doc", label: d.name, sub: "Filed to " + d.folder })),
        ...c.notes.map(n => ({ date: n.date, icon: "pen", label: n.text, sub: "Note by " + n.by })),
        ...(c.emails || []).map(e => ({ date: e.date, icon: "mail", label: e.subject, sub: "Email · " + e.from })),
        ...c.checklist.filter(k => k.done && k.date).map(k => ({ date: k.date, icon: "check", label: k.label, sub: "Task completed" })),
        { date: c.opened, icon: "case", label: "Case opened, Drive folders and checklist created", sub: "Intake" }
      ].sort((a, b) => b.date.localeCompare(a.date));
      return `<div class="card">
        <div class="card-head"><h2>Timeline</h2><span class="drive-note">Every touch on this file, newest first. Nothing lives in anyone's head.</span></div>
        <div class="feed">
          ${items.map(it => `<div class="feed-item no-click" style="cursor:default">
            <div class="feed-icon ${it.icon === "check" ? "green" : it.icon === "mail" ? "blue" : ""}">${I[it.icon] || I.doc}</div>
            <div class="feed-body"><div class="feed-title" style="font-weight:500">${esc(it.label)}</div><div class="feed-sub">${esc(it.sub)}</div></div>
            <span class="check-due" style="margin-left:auto;flex-shrink:0">${fmtDate(it.date)}</span>
          </div>`).join("")}
        </div>
      </div>`;
    }

    if (tab === "summary") {
      const specials = c.medicals.reduce((s, m) => s + m.billed, 0);
      const liens = c.lienLedger.reduce((s, l) => s + l.current, 0);
      const expenses = c.expenses.reduce((s, e) => s + e.amount, 0);
      return `<div class="card summary-sheet">
        <div class="card-head"><h2>Case Summary</h2><button class="btn btn-primary btn-sm" onclick="window.print()">Print</button></div>
        <div class="facts"><strong>${esc(c.client)}</strong> · ${esc(c.type)} · ${c.num} · ${c.stage} · Incident ${fmtDate(c.incident)} · SOL ${fmtDate(c.sol)}</div>
        <div class="facts" style="padding-top:0">${esc(c.facts)}</div>
        <div class="kv-grid">
          ${[["Insurer / Claim", `${esc(c.insurer)} · ${esc(c.claimNo)}`], ["Adjuster", esc(c.adjuster)],
             ["Policy Limits", esc(c.policy.liability)], ["UM/UIM", esc(c.policy.um)],
             ["Medical Specials", money(specials)], ["Liens (current)", money(liens)],
             ["Expenses Advanced", money(expenses)], ["Est. Value", money(c.estValue)]]
            .map(([k, v]) => `<div class="kv"><div class="kv-label">${k}</div><div class="kv-value">${v}</div></div>`).join("")}
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th>Provider</th><th>Status</th><th>Billed</th><th>Lien</th></tr></thead>
          <tbody>${c.medicals.map(m => `<tr class="no-click"><td>${esc(m.provider)}</td><td>${m.status}</td><td class="money">${money(m.billed)}</td><td class="money">${m.lien ? money(m.lien) : "None"}</td></tr>`).join("")}</tbody>
        </table></div>
        ${c.negotiation.length ? c.negotiation.map(n => `<div class="neg-item"><div class="neg-amount money">${money(n.amount)}</div><div><div class="neg-kind ${n.kind.toLowerCase()}">${n.kind} · ${esc(n.party)}</div><div class="neg-note">${esc(n.note)}</div></div><div class="neg-date">${fmtDate(n.date)}</div></div>`).join("") : ""}
        <div class="check-list">
          ${c.checklist.filter(k => !k.done).map(k => `<div class="check-item"><span class="check-box"></span><span class="check-label">${esc(k.label)}</span>${k.due ? `<span class="check-due">${fmtDate(k.due)}</span>` : ""}</div>`).join("")}
        </div>
      </div>`;
    }

    if (tab === "medicals") {
      const billed = c.medicals.reduce((s, m) => s + m.billed, 0);
      const liens = c.medicals.reduce((s, m) => s + m.lien, 0);
      const lienOrig = c.lienLedger.reduce((s, l) => s + l.original, 0);
      const lienCur = c.lienLedger.reduce((s, l) => s + l.current, 0);
      const lienStatus = { Asserted: "ms-received", Negotiating: "ms-requested", Reduced: "ms-complete" };
      return `<div class="dash-col">
        <div class="card">
          <div class="card-head"><h2>Treatment and Records</h2><div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm" onclick="addProvider('${c.id}')">Add Provider</button><button class="btn btn-ghost btn-sm" onclick="reqRecords('${c.id}')">Request Records</button></div></div>
          <div class="table-wrap"><table>
            <thead><tr><th>Provider</th><th>Records Status</th><th>Billed</th><th>Lien</th></tr></thead>
            <tbody>${c.medicals.map((m, mi) => `<tr onclick="editProvider('${c.id}',${mi})" title="Click to update">
              <td class="td-main">${esc(m.provider)}</td>
              <td><span class="med-status ms-${m.status.toLowerCase()}">${m.status}</span></td>
              <td class="money">${money(m.billed)}</td>
              <td class="money">${m.lien ? money(m.lien) : "None"}</td>
            </tr>`).join("") || `<tr><td colspan="4" class="empty-state">No providers yet.</td></tr>`}</tbody>
          </table></div>
          <div class="table-foot"><span>Total billed: <strong class="money">${money(billed)}</strong></span><span>Total liens: <strong class="money">${money(liens)}</strong></span></div>
        </div>
        ${c.lienLedger.length ? `<div class="card">
          <div class="card-head"><h2>Lien Negotiation</h2><span class="drive-note">Feeds the settlement calculator automatically</span></div>
          <div class="table-wrap"><table>
            <thead><tr><th>Lienholder</th><th>Original</th><th>Current</th><th>Status</th><th>Latest</th></tr></thead>
            <tbody>${c.lienLedger.map((l, li) => `<tr onclick="editLien('${c.id}',${li})" title="Click to log negotiation progress">
              <td class="td-main">${esc(l.holder)}</td>
              <td class="money ${l.current < l.original ? "strike" : ""}">${money(l.original)}</td>
              <td class="money" style="font-weight:600">${money(l.current)}</td>
              <td><span class="med-status ${lienStatus[l.status]}">${l.status}</span></td>
              <td style="white-space:normal;max-width:300px"><div style="font-size:12.5px">${esc(l.note)}</div><div class="td-sub">${fmtDate(l.date)}</div></td>
            </tr>`).join("")}</tbody>
          </table></div>
          <div class="table-foot"><span>Asserted: <strong class="money">${money(lienOrig)}</strong></span><span>Current: <strong class="money">${money(lienCur)}</strong></span><span style="color:var(--green)">Negotiated off so far: <strong class="money">${money(lienOrig - lienCur)}</strong></span></div>
        </div>` : ""}
      </div>`;
    }

    if (tab === "negotiation") {
      const bestOffer = Math.max(...c.negotiation.filter(n => n.kind === "Offer" || n.kind === "Settlement").map(n => n.amount), 0);
      const gross = bestOffer || c.estValue;
      return `<div class="case-grid">
        <div class="card">
          <div class="card-head"><h2>Demand and Offer History</h2><div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm" onclick="logNegotiation('${c.id}')">Log Entry</button><button class="btn btn-ghost btn-sm" onclick="aiDemand('${c.id}')">AI Demand Draft</button></div></div>
          ${c.negotiation.length ? c.negotiation.map(n => `<div class="neg-item">
            <div class="neg-amount money">${money(n.amount)}</div>
            <div><div class="neg-kind ${n.kind.toLowerCase()}">${n.kind} · ${esc(n.party)}</div><div class="neg-note">${esc(n.note)}</div></div>
            <div class="neg-date">${fmtDate(n.date)}</div>
          </div>`).join("") : `<div class="empty-state">No demand sent yet. This case is still in ${c.stage.toLowerCase()}.</div>`}
        </div>
        <div class="card">
          <div class="card-head"><h2>Settlement Calculator</h2><button class="btn btn-ghost btn-sm" id="calcSave">Save Scenario</button></div>
          <div class="calc" data-case="${c.id}">
            <label class="calc-gross">If it settles at
              <input id="calcGross" type="text" inputmode="numeric" value="${gross.toLocaleString("en-US")}">
            </label>
            <input id="calcSlider" type="range" min="0" max="${Math.max(gross * 2, 100000)}" step="1000" value="${gross}">
            <div class="calc-rows" id="calcRows"></div>
            <div class="scen-row" id="scenRow"></div>
            <div class="ai-foot">Attorney fee ${c.type === "Workers Comp" ? "25 percent (workers comp)" : "33.3 percent pre-litigation"}. The lien line pulls live from this case's lien ledger${c.lienLedger.some(l => l.current < l.original) ? ", already reflecting negotiated reductions" : ""}. Funds are held in the firm's trust account until disbursement, and the client sees this exact math on the settlement statement.</div>
          </div>
        </div>
      </div>`;
    }

    if (tab === "checklist") {
      return `<div class="card">
        <div class="card-head"><h2>Case Checklist</h2><div style="display:flex;align-items:center;gap:12px"><span class="drive-note">Click an item to complete it</span><button class="btn btn-ghost btn-sm" onclick="addTask('${c.id}')">Add Task</button></div></div>
        <div class="check-list">
          ${c.checklist.map((k, i) => `<div class="check-item ${k.done ? "done" : ""} clickable" data-check="${i}" data-case="${c.id}">
            <span class="check-box">${k.done ? I.check : ""}</span>
            <span class="check-label">${esc(k.label)}</span>
            <span class="check-due ${!k.done && k.due && k.due <= "2026-08-14" ? "soon" : ""}">${k.done ? "Done " + fmtDate(k.date) : k.due ? "Due " + fmtDate(k.due) : ""}</span>
          </div>`).join("")}
        </div>
      </div>`;
    }

    if (tab === "emails") {
      return `<div class="dash-col">
        ${c.texts ? `<div class="card">
          <div class="card-head"><h2>Text Messages</h2><span class="drive-note">${I.chat} Two-way texting from the firm's number, logged to the file</span></div>
          <div class="sms-thread">
            ${c.texts.map(t => `<div class="sms ${t.from === "firm" ? "sms-firm" : "sms-client"}">
              <div class="sms-bubble">${esc(t.text)}</div>
              <div class="sms-when">${t.from === "firm" ? "Firm" : esc(c.client.split(" ")[0])} · ${esc(t.when)}</div>
            </div>`).join("")}
            <div class="sms-compose"><input type="text" placeholder="Text ${esc(c.client.split(" ")[0])} from (314) 208-2808" id="smsInput"><button class="btn btn-primary btn-sm" id="smsSend" data-case="${c.id}">Send</button></div>
          </div>
        </div>` : ""}
        <div class="card">
          <div class="card-head"><h2>Emails</h2>
            <div style="display:flex;align-items:center;gap:12px">
              <span class="drive-note">${I.mail} Pulled from Outlook and matched to this file automatically</span>
              <button class="btn btn-ghost btn-sm" onclick="composeEmail('${c.id}', -1)">New Email</button>
            </div>
          </div>
          ${c.emails.slice().sort((a, b) => b.date.localeCompare(a.date)).map((e, i) => `<div class="email">
            <div class="email-top">
              <span class="email-from">${esc(e.from)}</span>
              <span class="email-date">${fmtDate(e.date)}</span>
            </div>
            <div class="email-subject">${esc(e.subject)}</div>
            <div class="email-body">${esc(e.body)}</div>
            <div style="display:flex;align-items:center;gap:10px;margin-top:8px">
              ${e.filed ? `<div class="email-filed" style="margin-top:0">${I.folder}<span>Attachment filed to ${esc(e.filed)}</span></div>` : ""}
              ${e.from !== "Chris Dixon" ? `<button class="mini-btn" style="width:auto;padding:0 10px;font-size:12px;font-weight:600" onclick="composeEmail('${c.id}', ${c.emails.indexOf(e)})">Reply</button>` : ""}
            </div>
          </div>`).join("") || `<div class="empty-state">No emails matched to this file yet.</div>`}
        </div>
      </div>`;
    }

    if (tab === "expenses") {
      const total = c.expenses.reduce((s, e) => s + e.amount, 0);
      return `<div class="card">
        <div class="card-head"><h2>Case Expenses</h2><div style="display:flex;align-items:center;gap:12px"><span class="drive-note">Synced to QuickBooks Online</span><button class="btn btn-ghost btn-sm" onclick="addExpense('${c.id}')">Add Expense</button></div></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Date</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody>${c.expenses.slice().sort((a, b) => a.date.localeCompare(b.date)).map(e => `<tr class="no-click">
            <td>${fmtDate(e.date)}</td><td class="td-main" style="white-space:normal">${esc(e.desc)}</td><td class="money" style="text-align:right">${money(e.amount)}</td>
          </tr>`).join("") || `<tr><td colspan="3" class="empty-state">No expenses advanced yet.</td></tr>`}</tbody>
        </table></div>
        <div class="table-foot"><span>Total advanced: <strong class="money">${money(total)}</strong></span><span>Recovered at settlement from the client's share</span></div>
      </div>`;
    }

    if (tab === "notes") {
      return `<div class="card">
        <div class="card-head"><h2>Notes</h2><button class="btn btn-ghost btn-sm" onclick="addNote('${c.id}')">Add Note</button></div>
        ${c.notes.map((n, ni) => `<div class="note note-row">
          <div class="note-head"><span class="note-by">${esc(n.by)}</span><span>${fmtDate(n.date)}</span>
            <div class="row-actions" style="margin-left:auto">
              <button class="mini-btn" onclick="editNote('${c.id}',${ni})" title="Edit">${I.edit}</button>
              <button class="mini-btn danger" onclick="deleteNote('${c.id}',${ni})" title="Delete">${I.trash}</button>
            </div>
          </div>
          <div class="note-text">${esc(n.text)}</div>
        </div>`).join("") || `<div class="empty-state">No notes yet.</div>`}
      </div>`;
    }

    if (tab === "documents") return docBrowser(c);

    const custom = (CUSTOM_TABS[c.type] || []).find(t => t.key === tab);
    if (custom) {
      return `<div class="card">
        <div class="card-head"><h2>${esc(custom.label)}</h2><span class="drive-note">Custom tab on every ${esc(c.type)} case</span></div>
        <div class="kv-grid">
          ${custom.fields.map((f, fi) => `<div class="kv kv-edit" onclick="setCustomField('${c.type}','${custom.key}',${fi})" title="Click to set"><div class="kv-label">${esc(f.label)}</div><div class="kv-value" style="color:${f.value ? "inherit" : "var(--faint)"}">${esc(f.value || "Click to set")}</div></div>`).join("")}
        </div>
        <div class="custom-add">
          <input type="text" id="cf-label" placeholder="New field name">
          <select id="cf-type"><option>Text</option><option>Date</option><option>Money</option><option>Contact</option><option>Dropdown</option></select>
          <button class="btn btn-ghost btn-sm" onclick="addCustomField('${c.type}','${custom.key}','${c.id}')">Add Field</button>
        </div>
      </div>`;
    }
    return "";
  }

  const CUSTOM_TABS = {};

  window.customizeLayout = function (id) {
    const c = caseById(id);
    openModal(`
      <div class="form-head"><h2>Customize ${esc(c.type)} Layout</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="form-note">Changes apply to every ${esc(c.type)} case. This is the part Podio made you pay a consultant for.</div>
      <div class="form-grid form-grid-1">
        <label>Add a tab<input id="ct-name" type="text" placeholder="Investigation, Expert Witnesses, Subrogation"></label>
        <label>Start from<select id="ct-tpl">
          <option value="blank">Blank tab</option>
          <option value="investigation">Investigation starter (scene, recon, witnesses)</option>
          <option value="experts">Expert witness starter (name, specialty, report due)</option>
        </select></label>
      </div>
      <div class="form-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="ct-save">Add Tab</button></div>`);
    $("#ct-save").addEventListener("click", () => {
      const label = $("#ct-name").value.trim() || "Custom Tab";
      const tpl = $("#ct-tpl").value;
      const fields = tpl === "investigation"
        ? [{ label: "Scene visit date", value: "" }, { label: "Reconstruction expert", value: "" }, { label: "Witness list status", value: "" }]
        : tpl === "experts"
        ? [{ label: "Expert name", value: "" }, { label: "Specialty", value: "" }, { label: "Report due", value: "" }]
        : [];
      if (!CUSTOM_TABS[c.type]) CUSTOM_TABS[c.type] = [];
      const key = "x" + Date.now().toString(36);
      CUSTOM_TABS[c.type].push({ key, label, fields });
      closeModal();
      toast(`"${label}" added to every ${c.type} case`);
      location.hash = `#/case/${c.id}/${key}`;
    });
  };

  window.setCustomField = function (type, key, fi) {
    const tabDef = (CUSTOM_TABS[type] || []).find(t => t.key === key);
    const f = tabDef.fields[fi];
    formModal(f.label, [{ id: "value", label: "Value", value: f.value, wide: true }],
      v => { f.value = v.value.trim(); refresh(); toast("Saved"); });
  };

  window.addCustomField = function (type, key, id) {
    const tabDef = (CUSTOM_TABS[type] || []).find(t => t.key === key);
    const label = $("#cf-label").value.trim();
    if (!tabDef || !label) return;
    tabDef.fields.push({ label: label + " (" + $("#cf-type").value + ")", value: "" });
    refresh();
    toast(`Field "${label}" added for all ${type} cases`);
  };

  window.composeEmail = function (id, replyIdx) {
    const c = caseById(id);
    const orig = replyIdx >= 0 ? c.emails[replyIdx] : null;
    const insurer = c.insurer.split(" (")[0];
    const defaultTo = orig
      ? (orig.from.includes("(") ? orig.from.match(/^([^(]+)/)[1].trim().toLowerCase().replace(/\s+/g, ".") + "@" + insurer.toLowerCase().replace(/\s+/g, "") + ".example" : c.email)
      : (c.adjuster !== "Unassigned" ? c.adjuster.toLowerCase().replace(/\s+/g, ".") + "@" + insurer.toLowerCase().replace(/\s+/g, "") + ".example" : c.email);
    openModal(`
      <div class="form-head"><h2>${orig ? "Reply" : "New Email"}</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="form-note">Sends from chris@dixoninjuryfirm.com through Outlook and logs to this file automatically.</div>
      <div class="form-grid form-grid-1">
        <label>To<input id="e-to" type="text" value="${esc(defaultTo)}"></label>
        <label>Subject<input id="e-subj" type="text" value="${esc(orig ? "RE: " + orig.subject : c.client + " | Claim " + c.claimNo)}"></label>
        <label>Message<textarea id="e-body" rows="6" placeholder="Write it, or ask AI to draft from the file"></textarea></label>
      </div>
      <div class="form-foot">
        <button class="btn btn-ghost" id="e-ai">AI Draft</button>
        <button class="btn btn-ghost" data-close>Cancel</button>
        <button class="btn btn-primary" id="e-send">Send and Log</button>
      </div>`);
    $("#e-ai").addEventListener("click", () => {
      $("#e-body").value = orig
        ? `Thank you for your correspondence of ${fmtDate(orig.date)}. We are reviewing with our client and will respond with a full position, including the documentation requested, by the stated deadline. All rights reserved.`
        : `Please find enclosed our correspondence regarding the above-referenced claim. The requested documentation is attached from the case file. We look forward to your prompt response.`;
      toast("Drafted from the case file. Edit before sending");
    });
    $("#e-send").addEventListener("click", () => {
      const body = $("#e-body").value.trim() || "(empty message)";
      c.emails.unshift({ from: "Chris Dixon", subject: $("#e-subj").value.trim(), date: TODAY, filed: null, body });
      logActivity(`Email sent on ${c.client} and logged to the file`);
      closeModal();
      refresh();
      toast("Sent through Outlook and logged to the file");
    });
  };

  window.editNote = function (id, ni) {
    const c = caseById(id);
    const n = c.notes[ni];
    formModal("Edit Note", [{ id: "text", label: "Note", type: "textarea", value: n.text, wide: true }],
      v => { n.text = v.text.trim() || n.text; refresh(); toast("Note updated"); });
  };

  window.deleteNote = function (id, ni) {
    const c = caseById(id);
    const removed = c.notes.splice(ni, 1)[0];
    refresh();
    toast("Note deleted", { undo: () => { c.notes.splice(ni, 0, removed); refresh(); } });
  };

  window.editFacts = function (id) {
    const c = caseById(id);
    formModal("Edit Case Facts", [{ id: "facts", label: "Facts", type: "textarea", value: c.facts, wide: true }],
      v => { c.facts = v.facts.trim() || c.facts; refresh(); toast("Case facts updated"); });
  };

  window.editDetails = function (id) {
    const c = caseById(id);
    formModal("Edit Case Details", [
      { id: "insurer", label: "Insurer", value: c.insurer },
      { id: "claimNo", label: "Claim number", value: c.claimNo },
      { id: "adjuster", label: "Adjuster", value: c.adjuster },
      { id: "paralegal", label: "Paralegal", type: "select", options: ["Dana Ellis", "Renee Carter"], value: c.paralegal },
      { id: "phone", label: "Client phone", value: c.phone },
      { id: "email", label: "Client email", value: c.email },
      { id: "estValue", label: "Estimated value", value: c.estValue.toLocaleString("en-US") },
      { id: "sol", label: "Statute of limitations (YYYY-MM-DD)", value: c.sol },
      { id: "liability", label: "Policy limits", value: c.policy.liability },
      { id: "um", label: "UM/UIM coverage", value: c.policy.um },
      { id: "pref", label: "Preferred contact", type: "select", options: ["Text", "Call", "Email"], value: c.pref },
      { id: "language", label: "Language", value: c.language }
    ], v => {
      Object.assign(c, { insurer: v.insurer, claimNo: v.claimNo, adjuster: v.adjuster, paralegal: v.paralegal, phone: v.phone, email: v.email, pref: v.pref, language: v.language });
      c.policy.liability = v.liability;
      c.policy.um = v.um;
      const ev = parseInt(v.estValue.replace(/[^0-9]/g, ""), 10);
      if (ev) c.estValue = ev;
      if (/^\d{4}-\d{2}-\d{2}$/.test(v.sol.trim())) c.sol = v.sol.trim();
      refresh();
      toast("Case details updated");
    });
  };

  window.addProvider = function (id) {
    const c = caseById(id);
    formModal("Add Provider", [
      { id: "provider", label: "Provider", ph: "Facility or physician" },
      { id: "status", label: "Records status", type: "select", options: ["Requested", "Received", "Complete"], value: "Requested" },
      { id: "billed", label: "Billed to date", ph: "0" },
      { id: "lien", label: "Lien asserted", ph: "0" }
    ], v => {
      if (!v.provider.trim()) return;
      const billed = parseInt(v.billed.replace(/[^0-9]/g, ""), 10) || 0;
      const lien = parseInt(v.lien.replace(/[^0-9]/g, ""), 10) || 0;
      c.medicals.push({ provider: v.provider.trim(), status: v.status, billed, lien });
      if (lien) c.lienLedger.push({ holder: v.provider.trim(), original: lien, current: lien, status: "Asserted", note: "Lien letter on file", date: TODAY });
      refresh();
      toast(v.provider.trim() + " added. Records request queued");
    }, "Add Provider");
  };

  window.editProvider = function (id, idx) {
    const c = caseById(id);
    const m = c.medicals[idx];
    formModal("Edit " + m.provider, [
      { id: "status", label: "Records status", type: "select", options: ["Requested", "Received", "Complete"], value: m.status },
      { id: "billed", label: "Billed", value: m.billed.toLocaleString("en-US") },
      { id: "lien", label: "Lien", value: m.lien.toLocaleString("en-US") }
    ], v => {
      m.status = v.status;
      m.billed = parseInt(v.billed.replace(/[^0-9]/g, ""), 10) || 0;
      m.lien = parseInt(v.lien.replace(/[^0-9]/g, ""), 10) || 0;
      refresh();
      toast(m.provider + " updated");
    });
  };

  window.logNegotiation = function (id) {
    const c = caseById(id);
    formModal("Log Demand or Offer", [
      { id: "kind", label: "Type", type: "select", options: ["Demand", "Offer", "Counter", "Settlement"], value: "Offer" },
      { id: "party", label: "From", type: "select", options: ["Firm", c.insurer.split(" (")[0], "Both"], value: c.insurer.split(" (")[0] },
      { id: "amount", label: "Amount", ph: "125,000" },
      { id: "note", label: "Note", type: "textarea", value: "", wide: true }
    ], v => {
      const amount = parseInt(v.amount.replace(/[^0-9]/g, ""), 10);
      if (!amount) return;
      c.negotiation.push({ date: TODAY, party: v.party, kind: v.kind, amount, note: v.note.trim() || v.kind + " logged" });
      logActivity(`${v.kind} of ${money(amount)} logged on ${c.client}`);
      refresh();
      toast(`${v.kind} of ${money(amount)} logged${v.kind === "Offer" ? ". Response task created" : ""}`);
    }, "Log It");
  };

  window.editLien = function (id, idx) {
    const c = caseById(id);
    const l = c.lienLedger[idx];
    formModal("Update Lien: " + l.holder, [
      { id: "current", label: "Current amount", value: l.current.toLocaleString("en-US") },
      { id: "status", label: "Status", type: "select", options: ["Asserted", "Negotiating", "Reduced"], value: l.status },
      { id: "note", label: "Latest note", type: "textarea", value: l.note, wide: true }
    ], v => {
      l.current = parseInt(v.current.replace(/[^0-9]/g, ""), 10) || l.current;
      l.status = v.status;
      l.note = v.note.trim() || l.note;
      l.date = TODAY;
      refresh();
      toast(l.current < l.original ? `${money(l.original - l.current)} negotiated off ${l.holder}` : l.holder + " updated");
    });
  };

  window.addExpense = function (id) {
    const c = caseById(id);
    formModal("Add Expense", [
      { id: "desc", label: "Description", ph: "Certified records, filing fee, expert" },
      { id: "amount", label: "Amount", ph: "45" }
    ], v => {
      const amount = parseInt(v.amount.replace(/[^0-9]/g, ""), 10);
      if (!v.desc.trim() || !amount) return;
      c.expenses.push({ date: TODAY, desc: v.desc.trim(), amount });
      refresh();
      toast("Expense logged and synced to QuickBooks");
    }, "Add Expense");
  };

  window.addTask = function (id) {
    const c = caseById(id);
    formModal("Add Task", [
      { id: "label", label: "Task", ph: "What needs to happen" },
      { id: "due", label: "Due (YYYY-MM-DD)", ph: "2026-08-21" }
    ], v => {
      if (!v.label.trim()) return;
      c.checklist.push({ label: v.label.trim(), done: false, due: /^\d{4}-\d{2}-\d{2}$/.test(v.due.trim()) ? v.due.trim() : undefined });
      refresh();
      toast("Task added to the checklist");
    }, "Add Task");
  };

  /* the demo moment: the client "signs" a few seconds after you send it */
  function simulateSignature(c, d) {
    setTimeout(() => {
      if (d.sig !== "pending") return;
      d.sig = "signed";
      d.ai = `Signed electronically by ${c.client}. Executed copy filed to ${d.folder} automatically.`;
      logActivity(`${c.client} signed ${d.name}. Executed copy filed to Drive`);
      const bell = $("#notifBtn .dot");
      if (bell) bell.style.display = "block";
      refresh();
      toast(`${c.client} just signed ${d.name}`);
    }, 9000);
  }

  window.reqRecords = function (id) {
    const c = caseById(id);
    const pending = c.medicals.filter(m => m.status === "Requested");
    pending.forEach(m => {
      c.docs.unshift({ folder: "02 Medical Records", name: `Records request follow-up - ${m.provider}.pdf`, date: TODAY, isNew: true, ai: "Follow-up request generated and sent. Response window tracked automatically." });
    });
    toast(pending.length ? `Follow-up requests sent to ${pending.length} provider${pending.length > 1 ? "s" : ""}` : "All records are in or already requested");
    refresh();
  };

  window.aiDemand = function (id) {
    const c = caseById(id);
    const specials = c.medicals.reduce((s, m) => s + m.billed, 0);
    c.docs.unshift({ folder: "06 Demand", name: `Demand draft (AI) - ${c.client.split(" ").slice(-1)[0]}.docx`, date: TODAY, isNew: true, ai: `Draft demand built from ${c.medicals.length} providers, ${money(specials)} in specials, and the ${c.insurer} claim history. Awaiting attorney review.` });
    logActivity(`AI demand draft generated for ${c.client}`);
    toast("Demand draft assembled from the file. Review it in 06 Demand");
    location.hash = `#/case/${id}/documents`;
  };

  /* ---------- documents ---------- */

  let activeFolder = null;

  function docBrowser(c) {
    const folders = FOLDER_TEMPLATE;
    const current = activeFolder && folders.includes(activeFolder) ? activeFolder : null;
    const files = c.docs.filter(d => !current || d.folder === current)
      .slice().sort((a, b) => b.date.localeCompare(a.date));
    return `<div class="card">
      <div class="card-head">
        <h2>Documents</h2>
        <div style="display:flex;align-items:center;gap:12px">
          <span class="drive-note">${I.cloud} Synced with Google Drive · Clients / ${esc(c.client)} / ${c.num}</span>
          <button class="btn btn-ghost btn-sm" id="uploadBtn" data-case="${c.id}">${I.upload}<span>Upload</span></button>
          <input type="file" id="uploadInput" multiple hidden>
        </div>
      </div>
      <div class="doc-layout">
        <div class="folder-tree">
          <div class="folder ${!current ? "active" : ""}" data-folder="">${I.folder}<span>All files</span><span class="folder-count">${c.docs.length}</span></div>
          ${folders.map(f => {
            const inF = c.docs.filter(d => d.folder === f);
            const newCount = inF.filter(d => d.isNew).length;
            return `<div class="folder ${current === f ? "active" : ""}" data-folder="${esc(f)}">${I.folder}<span>${esc(f)}</span>${newCount ? `<span class="new-pill">${newCount}</span>` : `<span class="folder-count">${inF.length || ""}</span>`}</div>`;
          }).join("")}
        </div>
        <div class="file-list" id="dropZone">
          <div class="drop-hint-overlay">${I.upload}<span>Drop to file in ${esc(current || "01 Intake & Retainer")}</span></div>
          ${files.map(d => `<div class="file-row" onclick="openDoc('${c.id}','${esc(d.name)}')">
            <div class="file-icon ${d.name.endsWith(".docx") ? "docx" : ""}">${I.doc}</div>
            <div class="feed-body">
              <div class="file-name">${esc(d.name)}${d.isNew ? '<span class="new-pill">NEW</span>' : ""}${d.sig === "pending" ? '<span class="sig-pill">Awaiting signature</span>' : d.sig === "signed" ? '<span class="sig-pill signed">Signed</span>' : ""}${d.v ? `<span class="v-pill">v${d.v}</span>` : ""}</div>
              <div class="file-meta">${esc(d.folder)} · Filed ${fmtDate(d.date)}${d.v ? ` · replaced v${d.v - 1}` : ""}</div>
              <div class="feed-ai">${esc(d.ai)}</div>
            </div>
          </div>`).join("") || `<div class="empty-state">No files in this folder yet. Drag one in or click Upload.</div>`}
        </div>
      </div>
    </div>`;
  }

  let docLimit = 15;
  window.loadMoreDocs = function () { docLimit += 20; refresh(); };

  function viewDocuments() {
    const docs = allDocs().slice().sort((a, b) => b.date.localeCompare(a.date));
    return `
      <div class="page-head">
        <div class="page-title"><h1>Documents</h1><p>${docs.length} files across the firm's Drive, newest first. New filings are flagged and summarized automatically.</p></div>
        <span class="drive-note">${I.cloud} Google Drive connected · last sync 2 minutes ago</span>
      </div>
      <div class="card">
        <div class="feed">
          ${docs.slice(0, docLimit).map(d => `<div class="feed-item" onclick="openDoc('${d.caseId}','${esc(d.name)}')">
            <div class="file-icon ${d.name.endsWith(".docx") ? "docx" : ""}">${I.doc}</div>
            <div class="feed-body">
              <div class="file-name">${esc(d.name)}${d.isNew ? '<span class="new-pill">NEW</span>' : ""}</div>
              <div class="file-meta">${esc(d.client)} · ${d.num} · ${esc(d.folder)} · Filed ${fmtDate(d.date)}</div>
              <div class="feed-ai">${esc(d.ai)}</div>
            </div>
          </div>`).join("")}
        </div>
        ${docs.length > docLimit ? `<div class="doc-sentinel" id="docSentinel" onclick="loadMoreDocs()">Show ${Math.min(20, docs.length - docLimit)} more of ${docs.length - docLimit} older files</div>` : ""}
      </div>`;
  }

  /* ---------- leads (drag and drop) ---------- */

  function viewLeads() {
    const cols = ["New", "Contacted", "Qualified", "Signed"];
    return `
      <div class="page-head">
        <div class="page-title"><h1>Leads</h1><p>Intake pipeline. Website chat leads arrive scored and summarized. Drag a card to move it.</p></div>
        <button class="btn btn-primary" onclick="newLead()">New Lead</button>
      </div>
      <div class="lead-board">
        ${cols.map(col => {
          const ls = LEADS.filter(l => l.status === col);
          return `<div class="lead-col" data-col="${col}">
            <div class="lead-col-head"><h3>${col}</h3><span class="pipe-count">${ls.length}</span></div>
            <div class="lead-cards" data-col="${col}">
              ${ls.map(l => `<div class="lead-card" draggable="true" data-lead="${l.id}">
                <div class="lead-top"><span class="lead-name">${esc(l.name)}</span><span class="score ${scoreClass(l.score)}">${l.score}</span></div>
                <div class="lead-matter">${esc(l.matter)}</div>
                <div class="lead-summary">${esc(l.summary)}</div>
                <div class="lead-foot">
                  <span class="lead-source">${l.source === "Website chat" ? I.chat : I.bolt}${esc(l.source)}</span>
                  <span>${humanize(l.received)}</span>
                </div>
                ${col === "Qualified" ? `<button class="btn btn-primary btn-sm lead-convert" data-convert="${l.id}">Convert to Case</button>` : ""}
              </div>`).join("") || `<div class="empty-state" style="padding:20px">None right now</div>`}
            </div>
          </div>`;
        }).join("")}
      </div>`;
  }

  window.newLead = function () {
    formModal("New Lead", [
      { id: "name", label: "Name", ph: "First Last" },
      { id: "matter", label: "Matter", type: "select", options: ["Car Accident", "Truck Accident", "Motorcycle Accident", "Workers Comp", "Slip and Fall", "Dog Bite", "Premises Liability", "Other Injury"], value: "Car Accident" },
      { id: "source", label: "Source", type: "select", options: ["Phone call", "Website chat", "Referral", "Google Ads", "Walk-in"], value: "Phone call" },
      { id: "summary", label: "What happened", type: "textarea", value: "", wide: true }
    ], v => {
      if (!v.name.trim()) return;
      const score = 55 + (v.summary.length % 40);
      LEADS.unshift({ id: "l" + Date.now().toString(36), name: v.name.trim(), matter: v.matter, source: v.source, score, status: "New", received: TODAY + " just now", summary: v.summary.trim() || "Intake notes to follow." });
      logActivity(`New lead logged: ${v.name.trim()}, ${v.matter.toLowerCase()}, scored ${score}`);
      refresh();
      toast(`${v.name.trim()} added and scored ${score}`);
    }, "Add Lead");
  };

  function bindLeads() {
    let dragged = null;
    document.querySelectorAll(".lead-card[draggable]").forEach(card => {
      card.addEventListener("dragstart", () => { dragged = card.dataset.lead; card.classList.add("dragging"); });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));
    });
    document.querySelectorAll(".lead-col").forEach(col => {
      col.addEventListener("dragover", e => { e.preventDefault(); col.classList.add("drop-hint"); });
      col.addEventListener("dragleave", () => col.classList.remove("drop-hint"));
      col.addEventListener("drop", e => {
        e.preventDefault();
        col.classList.remove("drop-hint");
        const lead = LEADS.find(l => l.id === dragged);
        if (lead && lead.status !== col.dataset.col) {
          lead.status = col.dataset.col;
          toast(`${lead.name} moved to ${col.dataset.col}`);
          refresh();
        }
      });
    });
    document.querySelectorAll("[data-convert]").forEach(b => b.addEventListener("click", e => {
      e.stopPropagation();
      const lead = LEADS.find(l => l.id === b.dataset.convert);
      lead.status = "Signed";
      logActivity(`Lead converted: ${lead.name} signed. Case and Drive folders created`);
      toast(`${lead.name} signed. Case opened with Drive folders and checklist`);
      refresh();
    }));
  }

  /* ---------- settlements ---------- */

  function viewSettlements() {
    const open = CASES.filter(c => c.stage !== "Settled" && c.negotiation.length);
    const settled = CASES.filter(c => c.negotiation.some(n => n.kind === "Settlement"));
    const totalDemanded = open.reduce((s, c) => s + Math.max(...c.negotiation.filter(n => n.party === "Firm").map(n => n.amount), 0), 0);
    const bestOffers = open.reduce((s, c) => s + Math.max(...c.negotiation.filter(n => n.kind === "Offer").map(n => n.amount), 0), 0);
    const settledTotal = settled.reduce((s, c) => s + c.negotiation.find(n => n.kind === "Settlement").amount, 0);

    return `
      <div class="page-head">
        <div class="page-title"><h1>Settlements</h1><p>Every pending demand and offer across the firm, in one place.</p></div>
      </div>
      <div class="stat-row" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat"><span class="stat-label">Outstanding Demands</span><span class="stat-value">${money(totalDemanded)}</span><span class="stat-note">${open.length} cases in negotiation</span></div>
        <div class="stat"><span class="stat-label">Best Offers on the Table</span><span class="stat-value">${money(bestOffers)}</span><span class="stat-note warn">gap of ${money(totalDemanded - bestOffers)}</span></div>
        <div class="stat"><span class="stat-label">Settled This Year</span><span class="stat-value">${money(settledTotal)}</span><span class="stat-note up">${settled.length} files closed</span></div>
      </div>
      <div class="card table-wrap" style="margin-bottom:18px">
        <div class="card-head"><h2>Pending Negotiations</h2></div>
        <table>
          <thead><tr><th>Client</th><th>Stage</th><th>Last Demand</th><th>Best Offer</th><th>Gap</th><th>Last Action</th><th>Next Step</th></tr></thead>
          <tbody>${open.map(c => {
            const lastDemand = Math.max(...c.negotiation.filter(n => n.party === "Firm").map(n => n.amount), 0);
            const bestOffer = Math.max(...c.negotiation.filter(n => n.kind === "Offer").map(n => n.amount), 0);
            const last = c.negotiation[c.negotiation.length - 1];
            const nextTask = c.checklist.find(k => !k.done);
            return `<tr onclick="location.hash='#/case/${c.id}/negotiation'">
              <td><div class="td-main">${esc(c.client)}</div><div class="td-sub">${esc(c.insurer)}</div></td>
              <td><span class="stage-pill ${stageClass(c.stage)}">${c.stage}</span></td>
              <td class="money">${lastDemand ? money(lastDemand) : "None"}</td>
              <td class="money">${bestOffer ? money(bestOffer) : "None"}</td>
              <td class="money" style="color:var(--amber);font-weight:600">${lastDemand && bestOffer ? money(lastDemand - bestOffer) : ""}</td>
              <td><div>${esc(last.kind)} ${fmtDate(last.date)}</div><div class="td-sub">${esc(last.party)}</div></td>
              <td style="white-space:normal;max-width:220px">${nextTask ? esc(nextTask.label) : "Review"}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
      <div class="card table-wrap" style="margin-bottom:18px">
        <div class="card-head"><h2>Settled This Year</h2></div>
        <table>
          <thead><tr><th>Client</th><th>Type</th><th>Settled</th><th>Gross</th><th>Attorney Fees</th><th>Net to Client</th></tr></thead>
          <tbody>${settled.map(c => {
            const st = c.negotiation.find(n => n.kind === "Settlement");
            const fees = st.amount / 3;
            return `<tr onclick="location.hash='#/case/${c.id}'">
              <td class="td-main">${esc(c.client)}</td><td>${esc(c.type)}</td><td>${fmtDate(st.date)}</td>
              <td class="money">${money(st.amount)}</td><td class="money">${money(fees)}</td><td class="money" style="color:var(--green);font-weight:600">${money(st.amount - fees - c.expenses.reduce((s, e) => s + e.amount, 0) - c.lienLedger.reduce((s, l) => s + l.current, 0))}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
      <div class="card table-wrap">
        <div class="card-head"><h2>Trust Account (IOLTA)</h2><span class="drive-note">Settlement checks land here and leave only by the disbursement checklist</span></div>
        <table>
          <thead><tr><th>Date</th><th>Case</th><th>Entry</th><th style="text-align:right">Amount</th><th>Status</th></tr></thead>
          <tbody>
            ${settled.flatMap(c => {
              const st = c.negotiation.find(n => n.kind === "Settlement");
              const fees = Math.round(st.amount / 3);
              const liens = c.lienLedger.reduce((s, l) => s + l.current, 0);
              const exp = c.expenses.reduce((s, e) => s + e.amount, 0);
              const done = c.checklist.find(k => /disbursement/i.test(k.label));
              const dd = done && done.date ? done.date : st.date;
              return [
                [st.date, c.client, "Settlement check deposited", st.amount, "Cleared"],
                [dd, c.client, "Attorney fees to operating", -fees, "Disbursed"],
                [dd, c.client, "Lien payoffs (" + c.lienLedger.length + ")", -liens, "Disbursed"],
                [dd, c.client, "Case expenses reimbursed", -exp, "Disbursed"],
                [dd, c.client, "Net to client", -(st.amount - fees - liens - exp), "Disbursed"]
              ];
            }).map(([date, client, entry, amt, status]) => `<tr class="no-click">
              <td>${fmtDate(date)}</td><td class="td-main">${esc(client)}</td><td style="white-space:normal">${entry}</td>
              <td class="money" style="text-align:right;${amt > 0 ? "color:var(--green);font-weight:600" : ""}">${amt > 0 ? "+" : "-"} ${money(Math.abs(amt))}</td>
              <td><span class="med-status ${status === "Cleared" ? "ms-received" : "ms-complete"}">${status}</span></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <div class="table-foot"><span>In trust today: <strong class="money">$0</strong></span><span>Every dollar in and out is tied to a case and a checklist step.</span></div>
      </div>`;
  }

  /* ---------- calendar ---------- */

  let calMonth = 7; // August 2026

  const KIND_COLOR = { Deadline: "red", Deposition: "purple", Mediation: "purple", Call: "blue", Consult: "green", Meeting: "blue", Internal: "gray", Exam: "amber" };

  /* hand-set events + every open checklist due date (skipping days a case already has a hand-set event) */
  function getAllEvents() {
    const autoEvents = CASES.flatMap(c => c.checklist
      .filter(k => !k.done && k.due && !EVENTS.some(e => e.caseId === c.id && e.date === k.due))
      .map(k => ({ date: k.due, time: "All day", title: `${c.client.split(" ").slice(-1)[0]}: ${k.label}`, kind: "Deadline", caseId: c.id })));
    return [...EVENTS, ...autoEvents];
  }

  window.openDay = function (iso) {
    const evts = getAllEvents().filter(e => e.date === iso)
      .sort((a, b) => (a.time === "All day" ? "0" : a.time).localeCompare(b.time === "All day" ? "0" : b.time));
    const dayName = new Date(iso + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    openModal(`
      <div class="form-head"><h2>${dayName}</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="check-list" style="max-height:52vh;overflow-y:auto">
        ${evts.map(e => {
          const c = e.caseId ? caseById(e.caseId) : null;
          return `<div class="check-item ${c ? "" : "no-click"}" ${c ? `onclick="location.hash='#/case/${c.id}'"` : ""} style="${c ? "cursor:pointer" : "cursor:default"}">
            <span class="day-kind evt-${KIND_COLOR[e.kind] || "gray"}">${e.kind}</span>
            <div style="min-width:0"><div class="check-label">${esc(e.title)}</div>${c ? `<div class="td-sub">${esc(c.client)} · ${esc(c.type)}</div>` : ""}</div>
            <span class="check-due">${esc(e.time)}</span>
          </div>`;
        }).join("") || `<div class="empty-state">Nothing scheduled. Rare, enjoy it.</div>`}
      </div>
      <div class="form-foot"><button class="btn btn-ghost" data-close>Close</button><button class="btn btn-primary" onclick="addEvent('${iso}')">Add Event This Day</button></div>`);
  };

  let calMode = "month";
  let calCourt = false;
  let weekStart = "2026-08-02";

  function viewCalendar() {
    const year = 2026;
    const allEvents = getAllEvents().filter(e => !calCourt || ["Deposition", "Mediation", "Exam"].includes(e.kind));
    const cellHTML = (iso, dayLabel, cap) => {
      const evts = allEvents.filter(e => e.date === iso);
      const shown = cap ? evts.slice(0, cap) : evts;
      return `<div class="cal-cell cal-live ${calMode === "week" ? "cal-week-cell" : ""} ${iso === TODAY ? "cal-today" : ""}" onclick="openDay('${iso}')" title="Open ${iso}">
        <span class="cal-day">${dayLabel}</span>
        ${shown.map(e => `<div class="cal-evt evt-${KIND_COLOR[e.kind] || "gray"}" title="${esc(e.title)}">${calMode === "week" && e.time !== "All day" ? esc(e.time) + " · " : ""}${esc(e.title)}</div>`).join("")}
        ${cap && evts.length > cap ? `<div class="cal-more">+${evts.length - cap} more</div>` : ""}
      </div>`;
    };

    let title, gridBody;
    if (calMode === "week") {
      const short = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
      title = `${short(weekStart)} to ${short(plusDays(weekStart, 6))}`;
      gridBody = Array.from({ length: 7 }, (_, i) => {
        const iso = plusDays(weekStart, i);
        const wd = new Date(iso + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
        return cellHTML(iso, `${wd} ${+iso.slice(8)}`, 0);
      }).join("");
    } else {
      title = new Date(year, calMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const first = new Date(year, calMonth, 1).getDay();
      const daysIn = new Date(year, calMonth + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < first; i++) cells.push(null);
      for (let d = 1; d <= daysIn; d++) cells.push(d);
      while (cells.length % 7) cells.push(null);
      gridBody = cells.map(d => {
        if (!d) return `<div class="cal-cell cal-empty"></div>`;
        const iso = `${year}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        return cellHTML(iso, d, 2);
      }).join("");
    }

    return `
      <div class="page-head">
        <div class="page-title"><h1>Calendar</h1><p>Deadlines, depositions, and calls across every file. Synced with Outlook.</p></div>
        <div class="cal-nav">
          <button class="icon-btn" id="calPrev">${S}<path d="m15 18-6-6 6-6"/></svg></button>
          <span class="cal-month">${title}</span>
          <button class="icon-btn" id="calNext">${S}<path d="m9 18 6-6-6-6"/></svg></button>
          <button class="btn btn-primary" onclick="addEvent()">New Event</button>
        </div>
      </div>
      <div class="filter-row">
        <button class="chip ${calMode === "month" ? "active" : ""}" data-calmode="month">Month</button>
        <button class="chip ${calMode === "week" ? "active" : ""}" data-calmode="week">Week</button>
        <span style="width:10px"></span>
        <button class="chip ${!calCourt ? "active" : ""}" data-calcourt="0">All events</button>
        <button class="chip ${calCourt ? "active" : ""}" data-calcourt="1">Court dates only</button>
      </div>
      <div class="card cal-card">
        <div class="cal-grid cal-head-row ${calMode === "week" ? "cal-grid-week-head" : ""}">
          ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => `<div class="cal-dow">${d}</div>`).join("")}
        </div>
        <div class="cal-grid ${calMode === "week" ? "cal-grid-week" : ""}">${gridBody}</div>
      </div>`;
  }

  window.addEvent = function (prefillDate) {
    formModal("New Event", [
      { id: "title", label: "Title", ph: "Deposition, call, mediation" },
      { id: "date", label: "Date (YYYY-MM-DD)", ph: "2026-08-20", value: typeof prefillDate === "string" ? prefillDate : "" },
      { id: "time", label: "Time", ph: "10:00 AM or All day", value: "All day" },
      { id: "kind", label: "Type", type: "select", options: ["Call", "Meeting", "Deadline", "Deposition", "Mediation", "Consult", "Internal", "Exam"], value: "Meeting" },
      { id: "client", label: "Case", type: "select", options: ["None", ...CASES.map(x => x.client)], value: "None", wide: true }
    ], v => {
      if (!v.title.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(v.date.trim())) { toast("Needs a title and a date like 2026-08-20"); return; }
      const linked = CASES.find(x => x.client === v.client);
      EVENTS.push({ date: v.date.trim(), time: v.time.trim() || "All day", title: (linked ? linked.client.split(" ").slice(-1)[0] + ": " : "") + v.title.trim(), kind: v.kind, caseId: linked ? linked.id : null });
      refresh();
      toast("Added to the calendar and synced to Outlook");
    }, "Add Event");
  };

  /* ---------- reports ---------- */

  function viewReports() {
    const open = CASES.filter(c => c.stage !== "Settled");
    const byStage = STAGES.map(st => [st, CASES.filter(c => c.stage === st).length]);
    const types = [...new Set(open.map(c => c.type))];
    const byType = types.map(t => [t, open.filter(c => c.type === t).reduce((s, c) => s + c.estValue, 0)]).sort((a, b) => b[1] - a[1]);
    const maxStage = Math.max(...byStage.map(x => x[1]));
    const maxType = Math.max(...byType.map(x => x[1]));
    const sources = ["Website chat", "Referral", "Google Ads"].map(s => [s, LEADS.filter(l => l.source === s).length]);
    const maxSrc = Math.max(...sources.map(x => x[1]));
    const settled = CASES.filter(c => c.negotiation.some(n => n.kind === "Settlement"));
    const settledTotal = settled.reduce((s, c) => s + c.negotiation.find(n => n.kind === "Settlement").amount, 0);

    const bars = (data, max, fmt) => data.map(([label, v]) => `
      <div class="bar-row">
        <span class="bar-label">${esc(label)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, v / max * 100)}%"></div></div>
        <span class="bar-value">${fmt(v)}</span>
      </div>`).join("");

    return `
      <div class="page-head">
        <div class="page-title"><h1>Reports</h1><p>Live across every case and lead. The reporting Podio never gave you.</p></div>
        <button class="btn btn-ghost" onclick="(${function () { }})()" id="exportReport">Export PDF</button>
      </div>
      <div class="stat-row" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat"><span class="stat-label">Recovered This Year</span><span class="stat-value">${money(settledTotal)}</span><span class="stat-note up">${settled.length} settlements</span></div>
        <div class="stat"><span class="stat-label">Average Case Age</span><span class="stat-value">7.2 mo</span><span class="stat-note">open files</span></div>
        <div class="stat"><span class="stat-label">Chat Lead Conversion</span><span class="stat-value">38%</span><span class="stat-note up">vs 22% before scoring</span></div>
      </div>
      <div class="card table-wrap" style="margin-bottom:18px">
        <div class="card-head"><h2>Where Cases Come From</h2><span class="drive-note">Signed cases and fees by source, the marketing math Podio could not do</span></div>
        <table>
          <thead><tr><th>Source</th><th>Open Cases</th><th>Pipeline Value</th><th>Settled Fees This Year</th></tr></thead>
          <tbody>${["Website chat", "Past client referral", "Google Ads"].map(src => {
            const openSrc = open.filter(c => c.source === src);
            const settledSrc = settled.filter(c => c.source === src);
            const fees = settledSrc.reduce((s, c) => s + c.negotiation.find(n => n.kind === "Settlement").amount / 3, 0);
            return `<tr class="no-click">
              <td class="td-main">${src}</td>
              <td>${openSrc.length}</td>
              <td class="money">${money(openSrc.reduce((s, c) => s + c.estValue, 0))}</td>
              <td class="money" style="color:var(--green);font-weight:600">${fees ? money(fees) : "None yet"}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
      <div class="report-grid">
        <div class="card"><div class="card-head"><h2>Cases by Stage</h2></div><div class="bar-chart">${bars(byStage, maxStage, v => v)}</div></div>
        <div class="card"><div class="card-head"><h2>Pipeline Value by Case Type</h2></div><div class="bar-chart">${bars(byType, maxType, money)}</div></div>
        <div class="card"><div class="card-head"><h2>Lead Sources (30 days)</h2></div><div class="bar-chart">${bars(sources, maxSrc, v => v)}</div></div>
        <div class="card">
          <div class="card-head"><h2>Settlements This Year</h2></div>
          ${settled.map(c => { const st = c.negotiation.find(n => n.kind === "Settlement"); return `<div class="neg-item" onclick="location.hash='#/case/${c.id}'" style="cursor:pointer">
            <div class="neg-amount money">${money(st.amount)}</div>
            <div><div class="neg-kind settlement">${esc(c.client)}</div><div class="neg-note">${esc(c.type)} · settled ${fmtDate(st.date)}</div></div>
          </div>`; }).join("")}
        </div>
      </div>`;
  }

  /* ---------- automations ---------- */

  const AUTOMATIONS = [
    { name: "Signed retainer opens the file", on: true, runs: 3, trigger: "E-signature completed on a retainer", actions: "Create the case, build the 8-folder Drive set, assign the intake checklist, and text the client a welcome" },
    { name: "Outlook email lands on the right file", on: true, runs: 41, trigger: "Email from a known client, adjuster, or provider", actions: "Match sender to the case, file attachments to the correct Drive folder, and post it to the Emails tab" },
    { name: "New Drive filing gets read", on: true, runs: 13, trigger: "Any file added to a case folder in Drive", actions: "Summarize with AI, flag it NEW, extract deadlines and amounts into the checklist" },
    { name: "Offer letters create deadlines", on: true, runs: 3, trigger: "AI detects an offer or time-limited demand in a filed document", actions: "Create a response task with the deadline and alert the assigned attorney" },
    { name: "Disbursement closes the file", on: true, runs: 2, trigger: "Settlement disbursement recorded", actions: "Close the case, archive the Drive folder, and post fees and expenses to QuickBooks" },
    { name: "Hot leads get an instant call", on: true, runs: 5, trigger: "Website chat lead scores 85 or higher", actions: "Text the intake team and queue a callback within 5 minutes" },
    { name: "Stale files get flagged", on: false, runs: 0, trigger: "No activity on an open case for 21 days", actions: "Add a review task for the paralegal and surface the case on the dashboard" }
  ];

  const INTEGRATIONS = [
    { name: "Google Drive", status: "Connected · synced 2 min ago", on: true },
    { name: "Outlook 365", status: "Connected · 41 emails filed this week", on: true },
    { name: "QuickBooks Online", status: "Connected · expenses syncing", on: true },
    { name: "Website Chat", status: "Connected · 4 leads this week", on: true },
    { name: "E-Signature", status: "Connected · 2 retainers out", on: true }
  ];

  function viewAutomations() {
    return `
      <div class="page-head">
        <div class="page-title"><h1>Automations</h1><p>The firm's workflows, running on their own. Flip any of them off if you want the manual version back.</p></div>
      </div>
      <div class="integrations">
        ${INTEGRATIONS.map(x => `<div class="integration"><span class="int-dot ${x.on ? "" : "off"}"></span><div><div class="int-name">${esc(x.name)}</div><div class="int-status">${esc(x.on ? x.status : "Disconnected")}</div></div></div>`).join("")}
      </div>
      <div class="auto-grid">
        ${AUTOMATIONS.map((a, i) => `<div class="card auto-card">
          <div class="auto-top">
            <h2>${esc(a.name)}</h2>
            <button class="switch ${a.on ? "on" : ""}" data-auto="${i}" role="switch" aria-checked="${a.on}"><span class="knob"></span></button>
          </div>
          <div class="auto-line"><span class="auto-tag">When</span><span>${esc(a.trigger)}</span></div>
          <div class="auto-line"><span class="auto-tag">Then</span><span>${esc(a.actions)}</span></div>
          <div class="auto-runs">${a.on ? `Ran ${a.runs} time${a.runs === 1 ? "" : "s"} this week` : "Paused"}</div>
        </div>`).join("")}
      </div>`;
  }

  /* ---------- settings ---------- */

  const PREFS = {
    toggles: [
      { key: "filing", label: "New filing summaries", sub: "Text and email when a document lands in a case folder", on: true },
      { key: "hotlead", label: "Hot lead alerts", sub: "Instant text when a chat lead scores 85 or higher", on: true },
      { key: "sol", label: "Statute of limitations alerts", sub: "Escalating reminders to attorney and paralegal", on: true },
      { key: "digest", label: "Morning digest", sub: "One email with deadlines, new filings, and overnight leads", on: true },
      { key: "clienttext", label: "Client text notifications", sub: "Ping the assigned paralegal when a client texts", on: true }
    ],
    solMonths: 24, digestTime: "7:00 AM", feeStd: "33.3 percent", feeLit: "40 percent in litigation", feeWC: "25 percent"
  };

  const TEAM = [
    { name: "Chris Dixon", role: "Managing Attorney", perm: "Admin" },
    { name: "Dana Ellis", role: "Senior Paralegal", perm: "Full access" },
    { name: "Renee Carter", role: "Paralegal", perm: "Full access" },
    { name: "Intake Line", role: "After-hours intake service", perm: "Intake only" }
  ];

  const FIRM = { name: "The Dixon Injury Firm", phone: "(314) 208-2808", office: "St. Louis, Missouri", portal: "portal.dixoninjuryfirm.com" };

  function viewSettings() {
    return `
      <div class="page-head">
        <div class="page-title"><h1>Settings</h1><p>The firm's rules, people, and defaults. Change them yourself, no consultant required.</p></div>
      </div>
      <div class="settings-grid">
        <div class="set-col">
        <div class="card">
          <div class="card-head"><h2>Firm Profile</h2><button class="btn btn-ghost btn-sm" id="editFirm">Edit</button></div>
          <div class="kv-grid">
            <div class="kv"><div class="kv-label">Firm</div><div class="kv-value">${esc(FIRM.name)}</div></div>
            <div class="kv"><div class="kv-label">Phone</div><div class="kv-value">${esc(FIRM.phone)}</div></div>
            <div class="kv"><div class="kv-label">Main office</div><div class="kv-value">${esc(FIRM.office)}</div></div>
            <div class="kv"><div class="kv-label">Client portal</div><div class="kv-value">${esc(FIRM.portal)}</div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h2>Team</h2><button class="btn btn-ghost btn-sm" id="inviteBtn">Invite</button></div>
          <div class="check-list">
            ${TEAM.map((m, i) => `<div class="check-item no-click team-row" style="cursor:default">
              <div class="avatar" style="width:32px;height:32px;font-size:12px;${m.perm === "Admin" ? "" : "background:var(--ink)"}">${m.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
              <div style="min-width:0"><div class="check-label">${esc(m.name)}</div><div class="td-sub">${esc(m.role)}</div></div>
              <span class="perm-pill ${m.perm === "Admin" ? "perm-admin" : m.perm === "Intake only" ? "perm-lim" : ""}">${esc(m.perm)}</span>
              <div class="row-actions" style="margin-left:8px">
                <button class="mini-btn" data-teamedit="${i}" title="Edit">${I.edit}</button>
                ${m.perm !== "Admin" ? `<button class="mini-btn danger" data-teamdel="${i}" title="Remove">${I.trash}</button>` : ""}
              </div>
            </div>`).join("")}
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h2>Integrations</h2></div>
          <div class="check-list">
            ${INTEGRATIONS.map((x, i) => `<div class="check-item no-click" style="cursor:default">
              <span class="int-dot ${x.on ? "" : "off"}" style="flex-shrink:0"></span>
              <div style="min-width:0"><div class="check-label">${esc(x.name)}</div><div class="td-sub">${esc(x.on ? x.status : "Disconnected")}</div></div>
              <button class="btn btn-ghost btn-sm" style="margin-left:auto" data-manage="${i}">Manage</button>
            </div>`).join("")}
          </div>
        </div>
        </div>
        <div class="set-col">
        <div class="card">
          <div class="card-head"><h2>Notifications</h2></div>
          <div class="check-list">
            ${PREFS.toggles.map((t, i) => `<div class="check-item no-click" style="cursor:default">
              <div style="min-width:0"><div class="check-label">${t.label}</div><div class="td-sub">${t.sub}</div></div>
              <button class="switch ${t.on ? "on" : ""}" data-pref="${i}" style="margin-left:auto" role="switch" aria-checked="${t.on}"><span class="knob"></span></button>
            </div>`).join("")}
          </div>
          <div class="setting-selects">
            <label>SOL first warning
              <select data-prefsel="solMonths"><option>24 months out</option><option>18 months out</option><option>12 months out</option></select>
            </label>
            <label>Digest arrives at
              <select data-prefsel="digestTime"><option>7:00 AM</option><option>6:30 AM</option><option>8:00 AM</option></select>
            </label>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h2>Case Defaults</h2></div>
          <div class="setting-selects" style="border-top:none;padding-top:16px">
            <label>Standard fee
              <select data-prefsel="feeStd"><option>33.3 percent</option><option>35 percent</option></select>
            </label>
            <label>After suit is filed
              <select data-prefsel="feeLit"><option>40 percent in litigation</option><option>38 percent in litigation</option></select>
            </label>
            <label>Workers comp
              <select data-prefsel="feeWC"><option>25 percent</option></select>
            </label>
          </div>
          <div class="folder-pref">
            <div class="kv-label" style="margin-bottom:8px">Drive folder set for every new case</div>
            <div class="folder-chips">${FOLDER_TEMPLATE.map((f, i) => `<span class="chip folder-chip">${esc(f)}<button class="chip-x" data-folderdel="${i}" title="Remove">×</button></span>`).join("")}</div>
            <div class="custom-add" style="border-top:none;padding:12px 0 0">
              <input type="text" id="newFolder" placeholder="Add a folder to the template">
              <button class="btn btn-ghost btn-sm" id="addFolder">Add</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h2>Data and Security</h2></div>
          <div class="check-list">
            <div class="check-item no-click" style="cursor:default">
              <div style="min-width:0"><div class="check-label">Your data stays yours</div><div class="td-sub">Documents live in the firm's own Google Drive, cases export anytime</div></div>
              <button class="btn btn-ghost btn-sm" style="margin-left:auto" id="exportCases">Export CSV</button>
            </div>
            <div class="check-item no-click" style="cursor:default">
              <div style="min-width:0"><div class="check-label">Two-factor authentication</div><div class="td-sub">Required for every team member</div></div>
              <button class="switch on" data-pref="sec" style="margin-left:auto" role="switch" aria-checked="true"><span class="knob"></span></button>
            </div>
            <div class="check-item no-click" style="cursor:default">
              <div style="min-width:0"><div class="check-label">Audit trail</div><div class="td-sub">Every open, edit, and download is logged per user</div></div>
              <span class="perm-pill" style="margin-left:auto">Always on</span>
            </div>
          </div>
        </div>
        </div>
      </div>`;
  }

  function bindSettings() {
    document.querySelectorAll(".switch[data-pref]").forEach(sw => {
      sw.addEventListener("click", () => {
        const i = sw.dataset.pref;
        const isOn = !sw.classList.contains("on");
        sw.classList.toggle("on", isOn);
        sw.setAttribute("aria-checked", isOn);
        if (PREFS.toggles[i]) { PREFS.toggles[i].on = isOn; toast(`"${PREFS.toggles[i].label}" ${isOn ? "on" : "off"}`); }
        else toast(isOn ? "Two-factor required for everyone" : "Two-factor is required for admins regardless");
      });
    });
    document.querySelectorAll("[data-prefsel]").forEach(sel => {
      sel.value = PREFS[sel.dataset.prefsel] && [...sel.options].some(o => o.value === PREFS[sel.dataset.prefsel]) ? PREFS[sel.dataset.prefsel] : sel.value;
      sel.addEventListener("change", () => { PREFS[sel.dataset.prefsel] = sel.value; toast("Saved: " + sel.value); });
    });
    const ef = $("#editFirm");
    if (ef) ef.addEventListener("click", () => formModal("Edit Firm Profile", [
      { id: "name", label: "Firm name", value: FIRM.name },
      { id: "phone", label: "Phone", value: FIRM.phone },
      { id: "office", label: "Main office", value: FIRM.office },
      { id: "portal", label: "Client portal domain", value: FIRM.portal }
    ], v => { Object.assign(FIRM, { name: v.name, phone: v.phone, office: v.office, portal: v.portal }); refresh(); toast("Firm profile updated"); }));

    const inv = $("#inviteBtn");
    if (inv) inv.addEventListener("click", () => formModal("Invite a Team Member", [
      { id: "email", label: "Email", ph: "name@dixoninjuryfirm.com" },
      { id: "perm", label: "Access", type: "select", options: ["Full access", "Intake only", "Admin"], value: "Full access" }
    ], v => {
      const em = v.email.trim();
      if (em) {
        const nm = em.split("@")[0].split(/[._]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        TEAM.push({ name: nm, role: "Invited · pending first sign-in", perm: v.perm });
        refresh();
      }
      toast(em ? "Invite sent to " + em : "Invite link copied");
    }, "Send Invite"));

    document.querySelectorAll("[data-teamedit]").forEach(b => b.addEventListener("click", () => {
      const m = TEAM[+b.dataset.teamedit];
      formModal("Edit " + m.name, [
        { id: "name", label: "Name", value: m.name },
        { id: "role", label: "Role", value: m.role },
        { id: "perm", label: "Access", type: "select", options: ["Admin", "Full access", "Intake only"], value: m.perm }
      ], v => { Object.assign(m, { name: v.name, role: v.role, perm: v.perm }); refresh(); toast(m.name + " updated"); });
    }));
    document.querySelectorAll("[data-teamdel]").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.teamdel;
      const removed = TEAM.splice(i, 1)[0];
      refresh();
      toast(removed.name + " removed from the team", { undo: () => { TEAM.splice(i, 0, removed); refresh(); } });
    }));

    document.querySelectorAll("[data-manage]").forEach(b => b.addEventListener("click", () => {
      const x = INTEGRATIONS[+b.dataset.manage];
      openModal(`
        <div class="form-head"><h2>${esc(x.name)}</h2><button class="icon-btn" data-close>${I.x}</button></div>
        <div class="check-list">
          <div class="check-item no-click"><div style="min-width:0"><div class="check-label">Status</div><div class="td-sub">${esc(x.on ? x.status : "Disconnected")}</div></div><span class="int-dot ${x.on ? "" : "off"}" style="margin-left:auto"></span></div>
          <div class="check-item no-click"><div style="min-width:0"><div class="check-label">Connected as</div><div class="td-sub">chris@dixoninjuryfirm.com</div></div></div>
          <div class="check-item no-click"><div style="min-width:0"><div class="check-label">Scope</div><div class="td-sub">${x.name === "Google Drive" ? "Clients folder only, read and write" : x.name === "Outlook 365" ? "Mail read, send, and calendar" : "Standard API access"}</div></div></div>
        </div>
        <div class="form-foot">
          <button class="btn btn-ghost" data-close>Close</button>
          <button class="btn ${x.on ? "btn-ghost" : "btn-primary"}" id="int-toggle" ${x.on ? 'style="color:var(--red);border-color:var(--red)"' : ""}>${x.on ? "Disconnect" : "Reconnect"}</button>
        </div>`);
      $("#int-toggle").addEventListener("click", () => {
        x.on = !x.on;
        closeModal();
        refresh();
        toast(x.name + (x.on ? " reconnected" : " disconnected"), x.on ? {} : { undo: () => { x.on = true; refresh(); } });
      });
    }));

    document.querySelectorAll("[data-folderdel]").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.folderdel;
      const removed = FOLDER_TEMPLATE.splice(i, 1)[0];
      refresh();
      toast(`"${removed}" removed from the template`, { undo: () => { FOLDER_TEMPLATE.splice(i, 0, removed); refresh(); } });
    }));
    const add = $("#addFolder");
    if (add) add.addEventListener("click", () => {
      const v = $("#newFolder").value.trim();
      if (!v) return;
      FOLDER_TEMPLATE.push(String(FOLDER_TEMPLATE.length + 1).padStart(2, "0") + " " + v);
      refresh();
      toast(`"${v}" added. New cases get this folder automatically`);
    });
    const exp = $("#exportCases");
    if (exp) exp.addEventListener("click", () => {
      const head = "Case,Client,Type,Stage,Insurer,Opened,EstValue,SOL";
      const csv = [head, ...CASES.map(c => [c.num, c.client, c.type, c.stage, c.insurer, c.opened, c.estValue, c.sol].map(v => `"${v}"`).join(","))].join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = "dixon-cases.csv";
      a.click();
      toast("Exported " + CASES.length + " cases");
    });
  }

  /* ---------- contacts (add / edit / delete / export) ---------- */

  let contactQuery = "";

  function viewContacts() {
    const groups = ["Insurance", "Medical", "Counsel", "Firm"];
    const labels = { Insurance: "Insurance Adjusters", Medical: "Medical Providers", Counsel: "Opposing Counsel", Firm: "Firm Staff" };
    const q = contactQuery.toLowerCase();
    return `
      <div class="page-head">
        <div class="page-title"><h1>Contacts</h1><p>${CONTACTS.length} adjusters, providers, counsel, and staff linked to their cases.</p></div>
        <div class="case-actions">
          <button class="btn btn-ghost" id="exportContacts">${I.download}<span>Export CSV</span></button>
          <button class="btn btn-primary" id="addContact">${I.plus}<span>Add Contact</span></button>
        </div>
      </div>
      <div class="filter-row">
        <div class="search" style="max-width:320px">
          <span class="search-icon">${I.search}</span>
          <input id="contactSearch" type="text" placeholder="Filter contacts" value="${esc(contactQuery)}">
        </div>
      </div>
      ${groups.map(g => {
        const rows = CONTACTS.filter(x => x.kind === g && (!q || (x.name + x.org + x.role).toLowerCase().includes(q)));
        if (!rows.length) return "";
        return `<div class="card table-wrap" style="margin-bottom:18px">
          <div class="card-head"><h2>${labels[g]}</h2></div>
          <table>
            <thead><tr><th>Name</th><th>Organization</th><th>Role</th><th>Phone</th><th>Email</th><th style="width:84px"></th></tr></thead>
            <tbody>${rows.map(x => {
              const idx = CONTACTS.indexOf(x);
              return `<tr class="no-click contact-row">
              <td class="td-main">${esc(x.name)}</td><td>${esc(x.org)}</td><td>${esc(x.role)}</td>
              <td>${esc(x.phone)}</td><td class="td-sub">${esc(x.email)}</td>
              <td><div class="row-actions">
                <button class="mini-btn" data-editc="${idx}" title="Edit">${I.edit}</button>
                <button class="mini-btn danger" data-delc="${idx}" title="Delete">${I.trash}</button>
              </div></td>
            </tr>`;
            }).join("")}</tbody>
          </table>
        </div>`;
      }).join("")}`;
  }

  function contactForm(idx) {
    const x = idx >= 0 ? CONTACTS[idx] : { name: "", org: "", role: "", phone: "", email: "", kind: "Insurance" };
    openModal(`
      <div class="form-head"><h2>${idx >= 0 ? "Edit Contact" : "Add Contact"}</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="form-grid">
        <label>Name<input id="c-name" type="text" value="${esc(x.name)}" placeholder="First Last"></label>
        <label>Organization<input id="c-org" type="text" value="${esc(x.org)}" placeholder="Company or facility"></label>
        <label>Role<input id="c-role" type="text" value="${esc(x.role)}" placeholder="Adjuster, physician, counsel"></label>
        <label>Group<select id="c-kind">${["Insurance", "Medical", "Counsel", "Firm"].map(k => `<option ${x.kind === k ? "selected" : ""}>${k}</option>`).join("")}</select></label>
        <label>Phone<input id="c-phone" type="text" value="${esc(x.phone)}" placeholder="(314) 555-0100"></label>
        <label>Email<input id="c-email" type="text" value="${esc(x.email)}" placeholder="name@company.com"></label>
      </div>
      <div class="form-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="c-save">${idx >= 0 ? "Save Changes" : "Add Contact"}</button></div>`);
    $("#c-save").addEventListener("click", () => {
      const rec = { name: $("#c-name").value.trim() || "Unnamed", org: $("#c-org").value.trim(), role: $("#c-role").value.trim(), kind: $("#c-kind").value, phone: $("#c-phone").value.trim(), email: $("#c-email").value.trim() };
      if (idx >= 0) CONTACTS[idx] = rec; else CONTACTS.push(rec);
      closeModal();
      toast(idx >= 0 ? "Contact updated" : rec.name + " added to contacts");
      refresh();
    });
  }

  function bindContacts() {
    const el = $("#contactSearch");
    if (el) el.addEventListener("input", () => {
      contactQuery = el.value;
      const pos = el.selectionStart;
      refresh();
      const el2 = $("#contactSearch");
      el2.focus(); el2.setSelectionRange(pos, pos);
    });
    const add = $("#addContact");
    if (add) add.addEventListener("click", () => contactForm(-1));
    const exp = $("#exportContacts");
    if (exp) exp.addEventListener("click", () => {
      const head = "Name,Organization,Role,Group,Phone,Email";
      const csv = [head, ...CONTACTS.map(x => [x.name, x.org, x.role, x.kind, x.phone, x.email].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = "dixon-contacts.csv";
      a.click();
      toast("Exported " + CONTACTS.length + " contacts to CSV");
    });
    document.querySelectorAll("[data-editc]").forEach(b => b.addEventListener("click", () => contactForm(+b.dataset.editc)));
    document.querySelectorAll("[data-delc]").forEach(b => b.addEventListener("click", () => {
      const idx = +b.dataset.delc;
      const removed = CONTACTS.splice(idx, 1)[0];
      refresh();
      toast(removed.name + " deleted", { undo: () => { CONTACTS.splice(idx, 0, removed); refresh(); } });
    }));
  }

  /* ---------- search + bell ---------- */

  function bindSearch() {
    const input = $("#globalSearch");
    const results = $("#searchResults");
    $("#searchIcon").innerHTML = I.search;

    input.addEventListener("focus", () => {
      if (input.value.trim().length >= 2 || !RECENTS.length) return;
      results.innerHTML = `<div class="sr-group">Recent</div>` + RECENTS.map(id => {
        const c = caseById(id);
        return c ? `<div class="sr-item" data-go="#/case/${c.id}">${I.briefcase}<div><div class="sr-title">${esc(c.client)}</div><div class="sr-sub">${esc(c.type)} · ${esc(c.stage)}</div></div></div>` : "";
      }).join("");
      results.classList.add("open");
    });

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { results.classList.remove("open"); return; }
      const cs = CASES.filter(c => (c.client + " " + c.type + " " + c.num).toLowerCase().includes(q)).slice(0, 4);
      const ds = allDocs().filter(d => (d.name + " " + d.client + " " + d.ai).toLowerCase().includes(q)).slice(0, 4);
      const xs = CONTACTS.filter(x => (x.name + " " + x.org).toLowerCase().includes(q)).slice(0, 3);
      if (!cs.length && !ds.length && !xs.length) {
        results.innerHTML = `<div class="empty-state" style="padding:16px">No matches for "${esc(input.value.trim())}"</div>`;
        results.classList.add("open");
        return;
      }
      results.innerHTML =
        (cs.length ? `<div class="sr-group">Cases</div>` + cs.map(c => `<div class="sr-item" data-go="#/case/${c.id}">${I.briefcase}<div><div class="sr-title">${esc(c.client)}</div><div class="sr-sub">${esc(c.type)} · ${c.num}</div></div></div>`).join("") : "") +
        (ds.length ? `<div class="sr-group">Documents</div>` + ds.map(d => `<div class="sr-item" data-doc="${d.caseId}|${esc(d.name)}">${I.doc}<div><div class="sr-title">${esc(d.name)}</div><div class="sr-sub">${esc(d.client)} · ${esc(d.folder)}</div></div></div>`).join("") : "") +
        (xs.length ? `<div class="sr-group">Contacts</div>` + xs.map(x => `<div class="sr-item" data-go="#/contacts">${I.contacts}<div><div class="sr-title">${esc(x.name)}</div><div class="sr-sub">${esc(x.org)}</div></div></div>`).join("") : "");
      results.classList.add("open");
    });

    results.addEventListener("click", e => {
      const item = e.target.closest(".sr-item");
      if (!item) return;
      results.classList.remove("open");
      input.value = "";
      if (item.dataset.doc) {
        const [cid, name] = item.dataset.doc.split("|");
        window.openDoc(cid, name);
      } else if (item.dataset.go) location.hash = item.dataset.go;
    });

    document.addEventListener("click", e => {
      if (!$("#searchWrap").contains(e.target)) results.classList.remove("open");
    });
  }

  function bindBell() {
    $("#notifBtn").innerHTML = I.bell + '<span class="dot"></span>';
    $("#notifBtn").addEventListener("click", () => {
      const newDocs = allDocs().filter(d => d.isNew).slice(0, 4);
      openModal(`
        <div class="form-head"><h2>Notifications</h2><button class="icon-btn" data-close>${I.x}</button></div>
        <div class="feed">
          ${newDocs.map(d => `<div class="feed-item" onclick="openDoc('${d.caseId}','${esc(d.name)}')">
            <div class="feed-icon">${I.doc}</div>
            <div class="feed-body"><div class="feed-title">${esc(d.name)}<span class="new-pill">NEW</span></div>
            <div class="feed-sub">${esc(d.client)} · ${esc(d.folder)}</div></div>
          </div>`).join("")}
          <div class="feed-item" onclick="location.hash='#/leads';document.querySelector('#modal').innerHTML=''">
            <div class="feed-icon blue">${I.bolt}</div>
            <div class="feed-body"><div class="feed-title">${LEADS.filter(l => l.status === "New").length} new leads waiting in intake</div>
            <div class="feed-sub">Newest from website chat, score 92</div></div>
          </div>
        </div>`);
    });
  }

  /* ---------- router ---------- */

  /* route() = real navigation: animate in, scroll to top, close modals.
     refresh() = in-place update after a state change: no animation, keep scroll.
     Case tab clicks swap only the tab body (suppressRoute skips the hashchange render). */
  let suppressRoute = false;
  function route() { render(true); }
  function refresh() { render(false); }

  function render(navigated) {
    const hash = location.hash || "#/dashboard";
    const parts = hash.slice(2).split("/");
    const view = $("#view");
    if (navigated) { closeModal(); if (parts[0] === "documents") docLimit = 15; }
    renderNav(hash);
    let html = "";
    if (parts[0] === "dashboard" || !parts[0]) html = viewDashboard();
    else if (parts[0] === "tasks") html = viewTasks();
    else if (parts[0] === "cases") html = viewCases();
    else if (parts[0] === "case") html = viewCase(parts[1], parts[2]);
    else if (parts[0] === "documents") html = viewDocuments();
    else if (parts[0] === "leads") html = viewLeads();
    else if (parts[0] === "settlements") html = viewSettlements();
    else if (parts[0] === "calendar") html = viewCalendar();
    else if (parts[0] === "reports") html = viewReports();
    else if (parts[0] === "automations") html = viewAutomations();
    else if (parts[0] === "contacts") html = viewContacts();
    else if (parts[0] === "settings") html = viewSettings();
    else html = viewDashboard();
    const scroll = view.scrollTop;
    view.innerHTML = `<div class="${navigated ? "view-enter" : ""}">${html}</div>`;
    view.scrollTop = navigated ? 0 : scroll;
    bindView(parts);
  }
  window.route = route;

  function bindView(parts, contentOnly) {
    document.querySelectorAll(".chip[data-stage]").forEach(ch => {
      ch.addEventListener("click", () => { caseFilter = ch.dataset.stage; refresh(); });
    });
    document.querySelectorAll(".chip[data-person]").forEach(ch => {
      ch.addEventListener("click", () => { taskPerson = ch.dataset.person; refresh(); });
    });
    document.querySelectorAll(".bulk-ck").forEach(ck => ck.addEventListener("change", () => {
      ck.checked ? bulkSel.add(ck.dataset.bulk) : bulkSel.delete(ck.dataset.bulk);
      refresh();
    }));
    document.querySelectorAll("[data-bulkassign]").forEach(b => b.addEventListener("click", () => {
      const who = b.dataset.bulkassign;
      bulkSel.forEach(id => { caseById(id).paralegal = who; });
      const n = bulkSel.size;
      bulkSel.clear();
      refresh();
      toast(`${n} case${n > 1 ? "s" : ""} reassigned to ${who}`);
    }));
    const bc = $("#bulkClear");
    if (bc) bc.addEventListener("click", () => { bulkSel.clear(); refresh(); });
    document.querySelectorAll("[data-pin]").forEach(b => b.addEventListener("click", e => {
      e.stopPropagation();
      const c = caseById(b.dataset.pin);
      c.pinned = !c.pinned;
      refresh();
      toast(c.pinned ? c.client + " pinned to the top" : c.client + " unpinned");
    }));
    if (!contentOnly) document.querySelectorAll(".tab[data-tab]").forEach(t => {
      t.addEventListener("click", () => {
        activeFolder = null;
        const c = caseById(t.dataset.case);
        const body = document.querySelector(".tab-body");
        if (!c || !body) { location.hash = `#/case/${t.dataset.case}/${t.dataset.tab}`; return; }
        suppressRoute = true;
        location.hash = `#/case/${t.dataset.case}/${t.dataset.tab}`;
        document.querySelectorAll(".tab[data-tab]").forEach(x => x.classList.toggle("active", x === t));
        body.innerHTML = `<div class="tabfade">${caseTab(c, t.dataset.tab)}</div>`;
        bindView(["case", t.dataset.case, t.dataset.tab], true);
      });
    });
    document.querySelectorAll(".folder[data-folder]").forEach(f => {
      f.addEventListener("click", () => { activeFolder = f.dataset.folder || null; refresh(); });
    });
    document.querySelectorAll(".check-item.clickable").forEach(k => {
      k.addEventListener("click", () => {
        const c = caseById(k.dataset.case);
        const item = c.checklist[+k.dataset.check];
        item.done = !item.done;
        refresh();
        if (item.done) {
          item.date = TODAY;
          toast("Checked off: " + item.label, { undo: () => { item.done = false; refresh(); } });
        }
      });
    });
    document.querySelectorAll(".task-row").forEach(r => {
      r.addEventListener("click", () => { location.hash = r.dataset.go; });
    });
    document.querySelectorAll(".task-snooze").forEach(b => {
      b.addEventListener("click", e => {
        e.stopPropagation();
        const c = caseById(b.dataset.snoozecase);
        const item = c.checklist[+b.dataset.snoozeidx];
        const prev = item.due;
        item.due = plusDays(item.due || TODAY, 7);
        refresh();
        toast(`Snoozed to ${fmtDate(item.due)}`, { undo: () => { item.due = prev; refresh(); } });
      });
    });
    document.querySelectorAll(".task-check").forEach(cb => {
      cb.addEventListener("click", e => {
        e.stopPropagation();
        const c = caseById(cb.dataset.case);
        const item = c.checklist[+cb.dataset.check];
        item.done = true;
        item.date = TODAY;
        refresh();
        toast("Done: " + item.label, { undo: () => { item.done = false; refresh(); } });
      });
    });
    if (!contentOnly) document.querySelectorAll(".path-step[data-move]").forEach(p => {
      if (!p.dataset.move) return;
      p.classList.add("advance");
      p.addEventListener("click", () => {
        const [id, idx] = p.dataset.move.split("|");
        const c = caseById(id);
        const prev = c.stage;
        c.stage = STAGES[+idx];
        const forward = +idx > STAGES.indexOf(prev);
        logActivity(`${c.client} moved to ${c.stage}${forward ? ". Stage checklist assigned" : ""}`);
        refresh();
        toast(`Moved to ${c.stage}${forward && STAGES.indexOf(prev) + 1 === +idx ? ". Stage tasks assigned automatically" : ""}`,
          { undo: () => { c.stage = prev; refresh(); toast("Moved back to " + prev); } });
      });
    });
    document.querySelectorAll(".switch[data-auto]").forEach(sw => {
      sw.addEventListener("click", () => {
        const a = AUTOMATIONS[+sw.dataset.auto];
        a.on = !a.on;
        sw.classList.toggle("on", a.on);
        sw.setAttribute("aria-checked", a.on);
        const runs = sw.closest(".auto-card").querySelector(".auto-runs");
        if (runs) runs.textContent = a.on ? `Ran ${a.runs} time${a.runs === 1 ? "" : "s"} this week` : "Paused";
        toast(a.on ? `"${a.name}" is back on` : `"${a.name}" paused`);
      });
    });
    const calc = document.querySelector(".calc");
    if (calc) {
      const c = caseById(calc.dataset.case);
      const feeRate = c.type === "Workers Comp" ? 0.25 : 1 / 3;
      const expenses = c.expenses.reduce((s, e) => s + e.amount, 0);
      const liens = c.lienLedger.reduce((s, l) => s + l.current, 0);
      const grossInput = $("#calcGross"), slider = $("#calcSlider");
      if (!c.scenarios) c.scenarios = [];
      const compute = gross => {
        const fee = Math.round(gross * feeRate);
        return { gross, fee, net: Math.max(0, gross - fee - expenses - liens) };
      };
      const update = gross => {
        const { fee, net } = compute(gross);
        $("#calcRows").innerHTML = [
          ["Gross settlement", money(gross), ""],
          ["Attorney fee", "- " + money(fee), ""],
          ["Case expenses advanced", "- " + money(expenses), ""],
          ["Liens (current ledger)", "- " + money(liens), ""],
          ["Net to " + c.client.split(" ")[0], money(net), "calc-net"]
        ].map(([k, v, cls]) => `<div class="calc-row ${cls}"><span>${k}</span><strong class="money">${v}</strong></div>`).join("");
      };
      const parse = () => parseInt(grossInput.value.replace(/[^0-9]/g, ""), 10) || 0;
      const renderScens = () => {
        $("#scenRow").innerHTML = c.scenarios.map((s, i) =>
          `<button class="scen" data-scen="${i}">${money(s.gross)} <span>nets ${money(s.net)}</span><span class="scen-x" data-scenx="${i}">×</span></button>`).join("");
        document.querySelectorAll("[data-scen]").forEach(b => b.addEventListener("click", e => {
          if (e.target.dataset.scenx !== undefined) { c.scenarios.splice(+e.target.dataset.scenx, 1); renderScens(); return; }
          const s = c.scenarios[+b.dataset.scen];
          grossInput.value = s.gross.toLocaleString("en-US");
          slider.value = s.gross;
          update(s.gross);
        }));
      };
      grossInput.addEventListener("input", () => { const g = parse(); slider.value = g; update(g); });
      slider.addEventListener("input", () => { grossInput.value = (+slider.value).toLocaleString("en-US"); update(+slider.value); });
      const save = $("#calcSave");
      if (save) save.addEventListener("click", () => {
        if (c.scenarios.length >= 4) c.scenarios.shift();
        c.scenarios.push(compute(parse()));
        renderScens();
        toast("Scenario saved. Click a chip to compare");
      });
      update(parse());
      renderScens();
    }
    const upBtn = $("#uploadBtn");
    if (upBtn) {
      const c = caseById(upBtn.dataset.case);
      const input = $("#uploadInput");
      const fileThem = names => {
        const folder = (activeFolder && FOLDER_TEMPLATE.includes(activeFolder)) ? activeFolder : "01 Intake & Retainer";
        names.forEach(n => c.docs.unshift({ folder, name: n, date: TODAY, isNew: true, ai: "Filed to Drive and summarized automatically. Key dates and amounts extracted to the checklist." }));
        logActivity(`${names.length} document${names.length > 1 ? "s" : ""} uploaded to ${c.client} ${folder}`);
        refresh();
        toast(`Filed to ${folder} and summarized`);
      };
      upBtn.addEventListener("click", () => input.click());
      input.addEventListener("change", () => { if (input.files.length) fileThem([...input.files].map(f => f.name)); });
      const dz = $("#dropZone");
      dz.addEventListener("dragover", e => { e.preventDefault(); dz.classList.add("dragging-over"); });
      dz.addEventListener("dragleave", e => { if (e.target === dz) dz.classList.remove("dragging-over"); });
      dz.addEventListener("drop", e => {
        e.preventDefault();
        dz.classList.remove("dragging-over");
        const names = [...(e.dataTransfer.files || [])].map(f => f.name);
        if (names.length) fileThem(names);
      });
    }
    const sms = $("#smsSend");
    if (sms) sms.addEventListener("click", () => {
      const c = caseById(sms.dataset.case);
      const input = $("#smsInput");
      const text = input.value.trim();
      if (!text) return;
      c.texts.push({ from: "firm", text, when: "Just now" });
      logActivity(`Text sent to ${c.client}`);
      refresh();
      toast("Text sent and logged to the file");
    });
    const sentinel = $("#docSentinel");
    if (sentinel) {
      const v = $("#view");
      const check = () => {
        if (!document.contains(sentinel)) { v.removeEventListener("scroll", check); return; }
        if (sentinel.getBoundingClientRect().top < v.getBoundingClientRect().bottom + 300) {
          v.removeEventListener("scroll", check);
          docLimit += 20;
          refresh();
        }
      };
      v.addEventListener("scroll", check, { passive: true });
      check();
    }
    if (parts[0] === "leads") bindLeads();
    if (parts[0] === "contacts") bindContacts();
    if (parts[0] === "settings") bindSettings();
    if (parts[0] === "calendar") {
      const prev = $("#calPrev"), next = $("#calNext");
      if (prev) prev.addEventListener("click", () => {
        if (calMode === "week") { if (weekStart > "2026-08-02") { weekStart = plusDays(weekStart, -7); refresh(); } }
        else if (calMonth > 7) { calMonth--; refresh(); }
      });
      if (next) next.addEventListener("click", () => {
        if (calMode === "week") { if (weekStart < "2026-10-18") { weekStart = plusDays(weekStart, 7); refresh(); } }
        else if (calMonth < 9) { calMonth++; refresh(); }
      });
      document.querySelectorAll("[data-calmode]").forEach(ch => ch.addEventListener("click", () => { calMode = ch.dataset.calmode; refresh(); }));
      document.querySelectorAll("[data-calcourt]").forEach(ch => ch.addEventListener("click", () => { calCourt = ch.dataset.calcourt === "1"; refresh(); }));
    }
    if (parts[0] === "reports") {
      const b = $("#exportReport");
      if (b) b.addEventListener("click", () => window.print());
    }
  }

  /* ---------- init ---------- */

  /* ---------- build console (bottom left) ---------- */

  function initBuildConsole() {
    const fab = document.createElement("button");
    fab.id = "aiFab";
    fab.title = "Build Console: ask for a change to this system";
    fab.innerHTML = "&gt;_";
    document.body.appendChild(fab);

    const panel = document.createElement("div");
    panel.id = "aiPanel";
    panel.innerHTML = `
      <div class="ai-head">
        <span class="ai-winbtn"></span><span class="ai-winbtn"></span><span class="ai-winbtn"></span>
        <span class="ai-title">dixon-case-manager · build console</span>
        <button class="ai-close" title="Close">${I.x}</button>
      </div>
      <div class="ai-log" id="aiLog">
        <div class="ai-line ai-sys">Connected to the build pipeline for this system.</div>
        <div class="ai-line ai-sys">Describe a change in plain English. It ships on the next push, usually same day.</div>
      </div>
      <div class="ai-chips">
        ${["Add a subrogation tracker", "Rename the Treating stage", "New report: fees by paralegal"].map(s => `<button class="ai-chip">${s}</button>`).join("")}
      </div>
      <div class="ai-inputrow">
        <span class="ai-caret">&gt;</span>
        <input id="aiInput" type="text" placeholder="what should this system do differently?" autocomplete="off">
      </div>`;
    document.body.appendChild(panel);

    const log = panel.querySelector("#aiLog");
    const input = panel.querySelector("#aiInput");
    const submit = text => {
      if (!text.trim()) return;
      log.insertAdjacentHTML("beforeend", `<div class="ai-line ai-user">&gt; ${esc(text.trim())}</div>`);
      input.value = "";
      log.scrollTop = log.scrollHeight;
      setTimeout(() => {
        log.insertAdjacentHTML("beforeend", `<div class="ai-line ai-ok">Queued. This lands in the next build cycle, and the live link updates automatically.</div>`);
        log.scrollTop = log.scrollHeight;
      }, 600);
    };
    fab.addEventListener("click", () => { panel.classList.toggle("open"); if (panel.classList.contains("open")) input.focus(); });
    panel.querySelector(".ai-close").addEventListener("click", () => panel.classList.remove("open"));
    input.addEventListener("keydown", e => { if (e.key === "Enter") submit(input.value); });
    panel.querySelectorAll(".ai-chip").forEach(ch => ch.addEventListener("click", () => submit(ch.textContent)));
  }
  initBuildConsole();

  document.querySelectorAll(".vt-seg").forEach(seg => seg.addEventListener("click", () => {
    if (seg.dataset.vt === "client") {
      const m = (location.hash || "").match(/#\/case\/(c[a-z0-9]+)/);
      window.enterClientView(m && caseById(m[1]) ? m[1] : clientCase);
    } else {
      window.exitClientView();
    }
  }));

  $("#newCaseBtn").addEventListener("click", () => window.newCase());
  let kbIdx = -1;
  document.addEventListener("keydown", e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
      e.preventDefault();
      $("#globalSearch").focus();
      return;
    }
    if (typing || $("#modal").innerHTML) return;
    if ((location.hash || "#/dashboard").startsWith("#/cases") || location.hash === "" ) {
      const rows = [...document.querySelectorAll("tbody tr")];
      if (!rows.length) return;
      if (e.key === "j" || e.key === "k") {
        kbIdx = Math.max(0, Math.min(rows.length - 1, kbIdx + (e.key === "j" ? 1 : -1)));
        rows.forEach(r => r.classList.remove("kb-focus"));
        rows[kbIdx].classList.add("kb-focus");
        rows[kbIdx].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && kbIdx >= 0 && rows[kbIdx]) {
        rows[kbIdx].click();
        kbIdx = -1;
      }
    }
  });
  bindBell();
  bindSearch();
  window.addEventListener("hashchange", () => {
    if (suppressRoute) { suppressRoute = false; return; }
    route();
  });
  route();
})();

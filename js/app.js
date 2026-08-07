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
    external: S + '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>'
  };

  const NAV = [
    { hash: "#/dashboard", label: "Dashboard", icon: "dashboard" },
    { hash: "#/leads", label: "Leads", icon: "bolt", badge: () => LEADS.filter(l => l.status === "New").length },
    { hash: "#/cases", label: "Cases", icon: "briefcase" },
    { hash: "#/documents", label: "Documents", icon: "folder", badge: () => allDocs().filter(d => d.isNew).length },
    { hash: "#/settlements", label: "Settlements", icon: "dollar" },
    { hash: "#/calendar", label: "Calendar", icon: "calendar" },
    { hash: "#/reports", label: "Reports", icon: "chart" },
    { hash: "#/automations", label: "Automations", icon: "gear" },
    { hash: "#/contacts", label: "Contacts", icon: "contacts" }
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
  const scoreClass = s => s >= 85 ? "hot" : s >= 65 ? "warm" : "cool";
  const logActivity = text => ACTIVITY.unshift({ when: "Just now", icon: "doc", text, caseId: null });

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
  function closeModal() { $("#modal").innerHTML = ""; }
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); $("#searchResults") && $("#searchResults").classList.remove("open"); } });

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
        <div class="stat"><span class="stat-label">Open Cases</span><span class="stat-value">${open.length}</span><span class="stat-note up">3 opened this month</span></div>
        <div class="stat"><span class="stat-label">Active Leads</span><span class="stat-value">${newLeads.length}</span><span class="stat-note up">${chatLeads} from website chat</span></div>
        <div class="stat"><span class="stat-label">New Documents Filed</span><span class="stat-value">${newDocs.length}</span><span class="stat-note warn">across ${newDocCases} cases</span></div>
        <div class="stat"><span class="stat-label">Pipeline Value</span><span class="stat-value">${money(pipelineValue)}</span><span class="stat-note">est. across open files</span></div>
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

  /* ---------- cases ---------- */

  let caseFilter = "All";

  function viewCases() {
    const rows = CASES.filter(c => caseFilter === "All" || c.stage === caseFilter);
    return `
      <div class="page-head">
        <div class="page-title"><h1>Cases</h1><p>${CASES.length} files, synced with the firm's Google Drive folder system.</p></div>
        <button class="btn btn-primary" onclick="newCase()">New Case</button>
      </div>
      <div class="filter-row">
        ${["All", ...STAGES].map(st => `<button class="chip ${caseFilter === st ? "active" : ""}" data-stage="${st}">${st}</button>`).join("")}
      </div>
      <div class="card table-wrap">
        <table>
          <thead><tr><th>Client</th><th>Case</th><th>Stage</th><th>Insurer</th><th>Paralegal</th><th>Est. Value</th><th>Opened</th><th>Documents</th></tr></thead>
          <tbody>
            ${rows.map(c => `<tr onclick="location.hash='#/case/${c.id}'">
              <td><div class="td-main">${esc(c.client)}</div><div class="td-sub">${esc(c.phone)}</div></td>
              <td><div>${esc(c.type)}</div><div class="td-sub">${c.num}</div></td>
              <td><span class="stage-pill ${stageClass(c.stage)}">${c.stage}</span></td>
              <td>${esc(c.insurer)}</td>
              <td>${esc(c.paralegal)}</td>
              <td class="money">${money(c.estValue)}</td>
              <td>${fmtDate(c.opened)}</td>
              <td>${c.docs.some(d => d.isNew) ? `<span class="doc-badge">${c.docs.filter(d => d.isNew).length} new</span>` : `<span class="td-sub">${c.docs.length} files</span>`}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
  }

  window.newCase = function () {
    openModal(`
      <div class="form-head"><h2>New Case</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="form-note">Opening a case creates the Drive folder set, checklist, and intake tasks automatically.</div>
      <div class="form-grid">
        <label>Client name<input id="f-name" type="text" placeholder="First Last"></label>
        <label>Case type<select id="f-type">${["Car Accident", "Truck Accident", "Motorcycle Accident", "Workers Comp", "Slip and Fall", "Dog Bite", "Premises Liability", "Pedestrian Accident", "Other Injury"].map(t => `<option>${t}</option>`).join("")}</select></label>
        <label>Phone<input id="f-phone" type="text" placeholder="(314) 555-0100"></label>
        <label>Incident date<input id="f-date" type="date" value="2026-08-01"></label>
      </div>
      <div class="form-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="f-save">Open Case</button></div>`);
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
      toast("Case opened. Drive folders and checklist created");
      location.hash = "#/case/" + id;
    });
  };

  /* ---------- case detail ---------- */

  function viewCase(id, tab) {
    const c = caseById(id);
    if (!c) return `<div class="empty-state">Case not found.</div>`;
    tab = tab || "overview";
    const newCount = c.docs.filter(d => d.isNew).length;
    const tabs = [
      ["overview", "Overview"],
      ["medicals", "Medicals"],
      ["negotiation", "Negotiation"],
      ["checklist", "Checklist"],
      ["emails", "Emails"],
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
              <span class="case-num">${esc(c.type)} · ${c.num} · ${esc(c.attorney)}</span>
            </div>
          </div>
          <div class="case-actions">
            <button class="btn btn-ghost" onclick="genDoc('${c.id}')">Generate Document</button>
            <button class="btn btn-primary" onclick="addNote('${c.id}')">Log Activity</button>
          </div>
        </div>
        <div class="stage-path">
          ${STAGES.map((st, i) => `<div class="path-step ${i < stageIdx ? "done" : i === stageIdx ? "current" : ""}" data-move="${i !== stageIdx ? c.id + "|" + i : ""}" title="${i < stageIdx ? "Move back to " + st : i === stageIdx + 1 ? "Advance to " + st : i > stageIdx ? "Move to " + st : st}">${st}</div>`).join("")}
        </div>
        <div class="tabs">
          ${tabs.map(([k, label]) => `<button class="tab ${tab === k ? "active" : ""}" data-tab="${k}" data-case="${c.id}">${label}</button>`).join("")}
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
        toast("Note saved to the file");
      }
      closeModal();
      route();
    });
  };

  window.genDoc = function (id) {
    const c = caseById(id);
    const templates = [
      ["Demand letter", "06 Demand", "Demand letter draft"],
      ["Records request", "02 Medical Records", "Records request"],
      ["Representation letter", "04 Insurance", "Letter of representation"],
      ["Settlement statement", "08 Settlement", "Settlement statement draft"]
    ];
    openModal(`
      <div class="form-head"><h2>Generate Document</h2><button class="icon-btn" data-close>${I.x}</button></div>
      <div class="form-note">Built from the forms library, merged with this case's data, and filed to the Drive folder.</div>
      <div class="tpl-list">
        ${templates.map((t, i) => `<button class="tpl" data-tpl="${i}">${I.doc}<div><div class="tpl-name">${t[0]}</div><div class="tpl-sub">Files to ${t[1]}</div></div></button>`).join("")}
      </div>`);
    document.querySelectorAll(".tpl").forEach(b => b.addEventListener("click", () => {
      const t = templates[+b.dataset.tpl];
      c.docs.unshift({ folder: t[1], name: `${t[2]} - ${c.client.split(" ").slice(-1)[0]}.docx`, date: TODAY, isNew: true, ai: `${t[0]} generated from case data: parties, ${c.medicals.length} providers, and the ${c.insurer} claim. Ready for attorney review.` });
      logActivity(`${t[0]} generated for ${c.client} and filed to ${t[1]}`);
      closeModal();
      toast(t[0] + " drafted and filed to Drive");
      route();
    }));
  };

  function caseTab(c, tab) {
    if (tab === "overview") {
      return `<div class="case-grid">
        <div class="dash-col">
          <div class="card">
            <div class="card-head"><h2>Case Facts</h2></div>
            <div class="facts">${esc(c.facts)}</div>
          </div>
          <div class="card">
            <div class="card-head"><h2>Details</h2></div>
            <div class="kv-grid">
              ${[["Incident Date", fmtDate(c.incident)], ["Statute of Limitations", fmtDate(c.sol)],
                 ["Insurer", c.insurer], ["Claim Number", c.claimNo],
                 ["Adjuster", c.adjuster], ["Paralegal", c.paralegal],
                 ["Client Phone", c.phone], ["Client Email", c.email]]
                .map(([k, v]) => `<div class="kv"><div class="kv-label">${k}</div><div class="kv-value">${esc(v)}</div></div>`).join("")}
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
        </div>
      </div>`;
    }

    if (tab === "medicals") {
      const billed = c.medicals.reduce((s, m) => s + m.billed, 0);
      const liens = c.medicals.reduce((s, m) => s + m.lien, 0);
      return `<div class="card">
        <div class="card-head"><h2>Treatment and Records</h2><button class="btn btn-ghost btn-sm" onclick="reqRecords('${c.id}')">Request Records</button></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Provider</th><th>Records Status</th><th>Billed</th><th>Lien</th></tr></thead>
          <tbody>${c.medicals.map(m => `<tr>
            <td class="td-main">${esc(m.provider)}</td>
            <td><span class="med-status ms-${m.status.toLowerCase()}">${m.status}</span></td>
            <td class="money">${money(m.billed)}</td>
            <td class="money">${m.lien ? money(m.lien) : "None"}</td>
          </tr>`).join("") || `<tr><td colspan="4" class="empty-state">No providers yet.</td></tr>`}</tbody>
        </table></div>
        <div class="table-foot"><span>Total billed: <strong class="money">${money(billed)}</strong></span><span>Total liens: <strong class="money">${money(liens)}</strong></span></div>
      </div>`;
    }

    if (tab === "negotiation") {
      return `<div class="card">
        <div class="card-head"><h2>Demand and Offer History</h2><button class="btn btn-ghost btn-sm" onclick="aiDemand('${c.id}')">AI Demand Draft</button></div>
        ${c.negotiation.length ? c.negotiation.map(n => `<div class="neg-item">
          <div class="neg-amount money">${money(n.amount)}</div>
          <div><div class="neg-kind ${n.kind.toLowerCase()}">${n.kind} · ${esc(n.party)}</div><div class="neg-note">${esc(n.note)}</div></div>
          <div class="neg-date">${fmtDate(n.date)}</div>
        </div>`).join("") : `<div class="empty-state">No demand sent yet. This case is still in ${c.stage.toLowerCase()}.</div>`}
      </div>`;
    }

    if (tab === "checklist") {
      return `<div class="card">
        <div class="card-head"><h2>Case Checklist</h2><span class="drive-note">Click an item to complete it</span></div>
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
      return `<div class="card">
        <div class="card-head"><h2>Emails</h2><span class="drive-note">${I.mail} Pulled from Outlook and matched to this file automatically</span></div>
        ${c.emails.slice().sort((a, b) => b.date.localeCompare(a.date)).map(e => `<div class="email">
          <div class="email-top">
            <span class="email-from">${esc(e.from)}</span>
            <span class="email-date">${fmtDate(e.date)}</span>
          </div>
          <div class="email-subject">${esc(e.subject)}</div>
          <div class="email-body">${esc(e.body)}</div>
          ${e.filed ? `<div class="email-filed">${I.folder}<span>Attachment filed to ${esc(e.filed)}</span></div>` : ""}
        </div>`).join("") || `<div class="empty-state">No emails matched to this file yet.</div>`}
      </div>`;
    }

    if (tab === "expenses") {
      const total = c.expenses.reduce((s, e) => s + e.amount, 0);
      return `<div class="card">
        <div class="card-head"><h2>Case Expenses</h2><span class="drive-note">Synced to QuickBooks Online</span></div>
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
        ${c.notes.map(n => `<div class="note">
          <div class="note-head"><span class="note-by">${esc(n.by)}</span><span>${fmtDate(n.date)}</span></div>
          <div class="note-text">${esc(n.text)}</div>
        </div>`).join("") || `<div class="empty-state">No notes yet.</div>`}
      </div>`;
    }

    if (tab === "documents") return docBrowser(c);
    return "";
  }

  window.reqRecords = function (id) {
    const c = caseById(id);
    const pending = c.medicals.filter(m => m.status === "Requested");
    pending.forEach(m => {
      c.docs.unshift({ folder: "02 Medical Records", name: `Records request follow-up - ${m.provider}.pdf`, date: TODAY, isNew: true, ai: "Follow-up request generated and sent. Response window tracked automatically." });
    });
    toast(pending.length ? `Follow-up requests sent to ${pending.length} provider${pending.length > 1 ? "s" : ""}` : "All records are in or already requested");
    route();
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
        <span class="drive-note">${I.cloud} Synced with Google Drive · Clients / ${esc(c.client)} / ${c.num}</span>
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
        <div class="file-list">
          ${files.map(d => `<div class="file-row" onclick="openDoc('${c.id}','${esc(d.name)}')">
            <div class="file-icon ${d.name.endsWith(".docx") ? "docx" : ""}">${I.doc}</div>
            <div class="feed-body">
              <div class="file-name">${esc(d.name)}${d.isNew ? '<span class="new-pill">NEW</span>' : ""}</div>
              <div class="file-meta">${esc(d.folder)} · Filed ${fmtDate(d.date)}</div>
              <div class="feed-ai">${esc(d.ai)}</div>
            </div>
          </div>`).join("") || `<div class="empty-state">No files in this folder yet.</div>`}
        </div>
      </div>
    </div>`;
  }

  function viewDocuments() {
    const docs = allDocs().slice().sort((a, b) => b.date.localeCompare(a.date));
    return `
      <div class="page-head">
        <div class="page-title"><h1>Documents</h1><p>${docs.length} files across the firm's Drive, newest first. New filings are flagged and summarized automatically.</p></div>
        <span class="drive-note">${I.cloud} Google Drive connected · last sync 2 minutes ago</span>
      </div>
      <div class="card">
        <div class="feed">
          ${docs.slice(0, 40).map(d => `<div class="feed-item" onclick="openDoc('${d.caseId}','${esc(d.name)}')">
            <div class="file-icon ${d.name.endsWith(".docx") ? "docx" : ""}">${I.doc}</div>
            <div class="feed-body">
              <div class="file-name">${esc(d.name)}${d.isNew ? '<span class="new-pill">NEW</span>' : ""}</div>
              <div class="file-meta">${esc(d.client)} · ${d.num} · ${esc(d.folder)} · Filed ${fmtDate(d.date)}</div>
              <div class="feed-ai">${esc(d.ai)}</div>
            </div>
          </div>`).join("")}
        </div>
      </div>`;
  }

  /* ---------- leads (drag and drop) ---------- */

  function viewLeads() {
    const cols = ["New", "Contacted", "Qualified", "Signed"];
    return `
      <div class="page-head">
        <div class="page-title"><h1>Leads</h1><p>Intake pipeline. Website chat leads arrive scored and summarized. Drag a card to move it.</p></div>
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
          route();
        }
      });
    });
    document.querySelectorAll("[data-convert]").forEach(b => b.addEventListener("click", e => {
      e.stopPropagation();
      const lead = LEADS.find(l => l.id === b.dataset.convert);
      lead.status = "Signed";
      logActivity(`Lead converted: ${lead.name} signed. Case and Drive folders created`);
      toast(`${lead.name} signed. Case opened with Drive folders and checklist`);
      route();
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
      <div class="card table-wrap">
        <div class="card-head"><h2>Settled This Year</h2></div>
        <table>
          <thead><tr><th>Client</th><th>Type</th><th>Settled</th><th>Gross</th><th>Attorney Fees</th><th>Net to Client</th></tr></thead>
          <tbody>${settled.map(c => {
            const st = c.negotiation.find(n => n.kind === "Settlement");
            const fees = st.amount / 3;
            return `<tr onclick="location.hash='#/case/${c.id}'">
              <td class="td-main">${esc(c.client)}</td><td>${esc(c.type)}</td><td>${fmtDate(st.date)}</td>
              <td class="money">${money(st.amount)}</td><td class="money">${money(fees)}</td><td class="money" style="color:var(--green);font-weight:600">${money(st.amount - fees - c.expenses.reduce((s, e) => s + e.amount, 0) - c.medicals.reduce((s, m) => s + m.lien * 0.65, 0))}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>`;
  }

  /* ---------- calendar ---------- */

  let calMonth = 7; // August 2026

  function viewCalendar() {
    const year = 2026;
    const monthName = new Date(year, calMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const first = new Date(year, calMonth, 1).getDay();
    const daysIn = new Date(year, calMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= daysIn; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    const kindColor = { Deadline: "red", Deposition: "purple", Mediation: "purple", Call: "blue", Consult: "green", Meeting: "blue", Internal: "gray", Exam: "amber" };

    return `
      <div class="page-head">
        <div class="page-title"><h1>Calendar</h1><p>Deadlines, depositions, and calls across every file. Synced with Outlook.</p></div>
        <div class="cal-nav">
          <button class="icon-btn" id="calPrev" ${calMonth <= 7 ? "disabled" : ""}>${S}<path d="m15 18-6-6 6-6"/></svg></button>
          <span class="cal-month">${monthName}</span>
          <button class="icon-btn" id="calNext" ${calMonth >= 9 ? "disabled" : ""}>${S}<path d="m9 18 6-6-6-6"/></svg></button>
        </div>
      </div>
      <div class="card cal-card">
        <div class="cal-grid cal-head-row">
          ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => `<div class="cal-dow">${d}</div>`).join("")}
        </div>
        <div class="cal-grid">
          ${cells.map(d => {
            if (!d) return `<div class="cal-cell cal-empty"></div>`;
            const iso = `${year}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const evts = EVENTS.filter(e => e.date === iso);
            return `<div class="cal-cell ${iso === TODAY ? "cal-today" : ""}">
              <span class="cal-day">${d}</span>
              ${evts.map(e => `<div class="cal-evt evt-${kindColor[e.kind] || "gray"}" ${e.caseId ? `onclick="location.hash='#/case/${e.caseId}'"` : ""} title="${esc(e.title)}">${esc(e.title)}</div>`).join("")}
            </div>`;
          }).join("")}
        </div>
      </div>`;
  }

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
    { name: "Google Drive", status: "Connected · synced 2 min ago" },
    { name: "Outlook 365", status: "Connected · 41 emails filed this week" },
    { name: "QuickBooks Online", status: "Connected · expenses syncing" },
    { name: "Website Chat", status: "Connected · 4 leads this week" },
    { name: "E-Signature", status: "Connected · 2 retainers out" }
  ];

  function viewAutomations() {
    return `
      <div class="page-head">
        <div class="page-title"><h1>Automations</h1><p>The firm's workflows, running on their own. Flip any of them off if you want the manual version back.</p></div>
      </div>
      <div class="integrations">
        ${INTEGRATIONS.map(x => `<div class="integration"><span class="int-dot"></span><div><div class="int-name">${esc(x.name)}</div><div class="int-status">${esc(x.status)}</div></div></div>`).join("")}
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
      route();
    });
  }

  function bindContacts() {
    const el = $("#contactSearch");
    if (el) el.addEventListener("input", () => {
      contactQuery = el.value;
      const pos = el.selectionStart;
      route();
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
      route();
      toast(removed.name + " deleted", { undo: () => { CONTACTS.splice(idx, 0, removed); route(); } });
    }));
  }

  /* ---------- search + bell ---------- */

  function bindSearch() {
    const input = $("#globalSearch");
    const results = $("#searchResults");
    $("#searchIcon").innerHTML = I.search;

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

  function route() {
    const hash = location.hash || "#/dashboard";
    const parts = hash.slice(2).split("/");
    const view = $("#view");
    closeModal();
    renderNav(hash);
    let html = "";
    if (parts[0] === "dashboard" || !parts[0]) html = viewDashboard();
    else if (parts[0] === "cases") html = viewCases();
    else if (parts[0] === "case") html = viewCase(parts[1], parts[2]);
    else if (parts[0] === "documents") html = viewDocuments();
    else if (parts[0] === "leads") html = viewLeads();
    else if (parts[0] === "settlements") html = viewSettlements();
    else if (parts[0] === "calendar") html = viewCalendar();
    else if (parts[0] === "reports") html = viewReports();
    else if (parts[0] === "automations") html = viewAutomations();
    else if (parts[0] === "contacts") html = viewContacts();
    else html = viewDashboard();
    view.innerHTML = `<div class="view-enter">${html}</div>`;
    view.scrollTop = 0;
    bindView(parts);
  }
  window.route = route;

  function bindView(parts) {
    document.querySelectorAll(".chip[data-stage]").forEach(ch => {
      ch.addEventListener("click", () => { caseFilter = ch.dataset.stage; route(); });
    });
    document.querySelectorAll(".tab[data-tab]").forEach(t => {
      t.addEventListener("click", () => {
        activeFolder = null;
        location.hash = `#/case/${t.dataset.case}/${t.dataset.tab}`;
      });
    });
    document.querySelectorAll(".folder[data-folder]").forEach(f => {
      f.addEventListener("click", () => { activeFolder = f.dataset.folder || null; route(); });
    });
    document.querySelectorAll(".check-item.clickable").forEach(k => {
      k.addEventListener("click", () => {
        const c = caseById(k.dataset.case);
        const item = c.checklist[+k.dataset.check];
        item.done = !item.done;
        if (item.done) { item.date = TODAY; toast("Checked off: " + item.label); }
        route();
      });
    });
    document.querySelectorAll(".path-step[data-move]").forEach(p => {
      if (!p.dataset.move) return;
      p.classList.add("advance");
      p.addEventListener("click", () => {
        const [id, idx] = p.dataset.move.split("|");
        const c = caseById(id);
        const prev = c.stage;
        c.stage = STAGES[+idx];
        const forward = +idx > STAGES.indexOf(prev);
        logActivity(`${c.client} moved to ${c.stage}${forward ? ". Stage checklist assigned" : ""}`);
        route();
        toast(`Moved to ${c.stage}${forward && STAGES.indexOf(prev) + 1 === +idx ? ". Stage tasks assigned automatically" : ""}`,
          { undo: () => { c.stage = prev; route(); toast("Moved back to " + prev); } });
      });
    });
    document.querySelectorAll(".switch[data-auto]").forEach(sw => {
      sw.addEventListener("click", () => {
        const a = AUTOMATIONS[+sw.dataset.auto];
        a.on = !a.on;
        toast(a.on ? `"${a.name}" is back on` : `"${a.name}" paused`);
        route();
      });
    });
    if (parts[0] === "leads") bindLeads();
    if (parts[0] === "contacts") bindContacts();
    if (parts[0] === "calendar") {
      const prev = $("#calPrev"), next = $("#calNext");
      if (prev) prev.addEventListener("click", () => { if (calMonth > 7) { calMonth--; route(); } });
      if (next) next.addEventListener("click", () => { if (calMonth < 9) { calMonth++; route(); } });
    }
    if (parts[0] === "reports") {
      const b = $("#exportReport");
      if (b) b.addEventListener("click", () => toast("In production this exports the report pack as a PDF"));
    }
  }

  /* ---------- init ---------- */

  $("#newCaseBtn").addEventListener("click", () => window.newCase());
  bindBell();
  bindSearch();
  window.addEventListener("hashchange", route);
  route();
})();

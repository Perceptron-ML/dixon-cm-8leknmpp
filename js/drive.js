/* Google Drive live connector.
   Read-only OAuth straight from the static site (Google Identity Services),
   so the demo can render a firm's real Drive folders with no backend.
   Everything degrades silently to the seeded demo data when not connected. */

(function () {
  const SCOPE = "https://www.googleapis.com/auth/drive";
  const LS_CLIENT = "dixon.driveClientId";
  const LS_MAP = "dixon.driveMap";
  const FIELDS = "files(id,name,mimeType,modifiedTime,size,webViewLink)";

  const LS_TOK = "dixon.driveSession";
  const state = { token: null, expiresAt: 0, connected: false, email: null };

  function saveSession() {
    try {
      localStorage.setItem(LS_TOK, JSON.stringify({
        token: state.token, expiresAt: state.expiresAt, email: state.email
      }));
    } catch (e) {}
  }
  function clearSession() { try { localStorage.removeItem(LS_TOK); } catch (e) {} }
  function restoreSession() {
    try {
      const raw = localStorage.getItem(LS_TOK);
      if (!raw) return false;
      const v = JSON.parse(raw);
      /* keep a minute of headroom so we never use a token mid-expiry */
      if (!v.token || !v.expiresAt || Date.now() > v.expiresAt - 60000) { clearSession(); return false; }
      state.token = v.token; state.expiresAt = v.expiresAt; state.email = v.email; state.connected = true;
      return true;
    } catch (e) { return false; }
  }

  const ls = {
    get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  const clientId = () => (ls.get(LS_CLIENT, "") || window.DRIVE_CLIENT_ID || "").trim();
  const setClientId = id => ls.set(LS_CLIENT, (id || "").trim());

  function mappings() { try { return JSON.parse(ls.get(LS_MAP, "{}")); } catch (e) { return {}; } }
  function setMapping(caseId, folder) {
    const m = mappings();
    if (folder) m[caseId] = folder; else delete m[caseId];
    ls.set(LS_MAP, JSON.stringify(m));
  }

  const gisReady = () => !!(window.google && google.accounts && google.accounts.oauth2);
  const isLive = () => state.connected && Date.now() < state.expiresAt;

  const rootId = () => (window.DRIVE_ROOT_ID || "").trim();

  function connect(interactive) {
    return new Promise((resolve, reject) => {
      const id = clientId();
      if (!id) return reject(new Error("no-client-id"));
      if (!gisReady()) return reject(new Error("gis-not-loaded"));
      let settled = false;
      const client = google.accounts.oauth2.initTokenClient({
        client_id: id,
        scope: SCOPE,
        prompt: interactive === false ? "none" : "consent",
        callback: resp => {
          settled = true;
          if (resp.error) return reject(new Error(resp.error));
          state.token = resp.access_token;
          state.expiresAt = Date.now() + (Number(resp.expires_in) || 3600) * 1000;
          state.connected = true;
          saveSession();
          whoAmI().then(() => { saveSession(); resolve(state); }).catch(() => resolve(state));
        },
        error_callback: err => { settled = true; reject(new Error((err && err.type) || "popup-blocked")); }
      });
      client.requestAccessToken();
      setTimeout(() => { if (!settled) reject(new Error("timeout")); }, 120000);
    });
  }

  function disconnect() {
    if (state.token && gisReady()) { try { google.accounts.oauth2.revoke(state.token, () => {}); } catch (e) {} }
    state.token = null; state.connected = false; state.expiresAt = 0; state.email = null;
    clearSession();
  }

  async function api(path, params, base) {
    if (!isLive()) throw new Error("not-connected");
    const url = new URL((base || "https://www.googleapis.com/drive/v3/") + path);
    Object.entries(params || {}).forEach(([k, v]) => url.searchParams.set(k, v));
    const r = await fetch(url.toString(), { headers: { Authorization: "Bearer " + state.token } });
    if (r.status === 401) { state.connected = false; clearSession(); throw new Error("expired"); }
    if (!r.ok) throw new Error("drive-" + r.status);
    return r.json();
  }

  async function whoAmI() {
    const r = await api("about", { fields: "user(emailAddress,displayName)" });
    state.email = r.user ? r.user.emailAddress : null;
    return state.email;
  }

  const norm = f => ({
    id: f.id,
    name: f.name,
    isFolder: f.mimeType === "application/vnd.google-apps.folder",
    mimeType: f.mimeType,
    modified: (f.modifiedTime || "").slice(0, 10),
    size: f.size ? Number(f.size) : 0,
    link: f.webViewLink || ""
  });

  /* Shared drives (Chris's "test drive" lands here), plus anything shared directly. */
  async function listRoots() {
    const out = [];
    try {
      const d = await api("drives", { pageSize: 100, fields: "drives(id,name)" });
      (d.drives || []).forEach(x => out.push({ id: x.id, name: x.name, isFolder: true, shared: true, driveRoot: true }));
    } catch (e) {}
    try {
      const s = await api("files", {
        q: "sharedWithMe and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: FIELDS, pageSize: 100, orderBy: "name",
        supportsAllDrives: "true", includeItemsFromAllDrives: "true"
      });
      (s.files || []).forEach(f => out.push(Object.assign(norm(f), { shared: true })));
    } catch (e) {}
    out.push({ id: "root", name: "My Drive", isFolder: true, myDrive: true });
    return out;
  }

  async function listChildren(folderId) {
    const r = await api("files", {
      q: `'${folderId}' in parents and trashed=false`,
      fields: FIELDS, pageSize: 200, orderBy: "folder,name",
      supportsAllDrives: "true", includeItemsFromAllDrives: "true"
    });
    return (r.files || []).map(norm);
  }

  /* real multipart upload straight into the firm's Drive folder */
  async function uploadFile(folderId, file) {
    if (!isLive()) throw new Error("not-connected");
    const meta = { name: file.name, parents: [folderId] };
    const boundary = "dixon" + Math.random().toString(36).slice(2);
    const body = new Blob([
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`,
      JSON.stringify(meta),
      `\r\n--${boundary}\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`,
      file,
      `\r\n--${boundary}--`
    ]);
    const r = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink,modifiedTime",
      { method: "POST", headers: { Authorization: "Bearer " + state.token, "Content-Type": "multipart/related; boundary=" + boundary }, body });
    if (!r.ok) throw new Error("upload-" + r.status);
    return norm(await r.json());
  }

  async function createFolder(parentId, name) {
    if (!isLive()) throw new Error("not-connected");
    const r = await fetch("https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&fields=id,name,mimeType", {
      method: "POST",
      headers: { Authorization: "Bearer " + state.token, "Content-Type": "application/json" },
      body: JSON.stringify({ name, parents: [parentId], mimeType: "application/vnd.google-apps.folder" })
    });
    if (!r.ok) throw new Error("mkdir-" + r.status);
    return norm(await r.json());
  }

  window.Drive = {
    connect, disconnect, listRoots, listChildren, whoAmI, uploadFile, createFolder, rootId, restoreSession,
    mappings, setMapping, clientId, setClientId,
    isLive, gisReady, state
  };
})();

/**
 * Article editor — publishes straight to GitHub.
 *
 * There's no server behind this site (it's static files on GitHub Pages), so
 * "publish" here means: commit the updated js/data.js (and any uploaded cover
 * photo / PDF) directly to the repo's main branch using GitHub's REST API,
 * authenticated with a personal access token you provide once. GitHub Pages
 * automatically rebuilds after that commit, so the change appears on the live
 * site within a minute or two — no folder picker, no git commands.
 *
 * The token is stored only in this browser's localStorage (or just in memory
 * for the current tab, if you choose not to remember it) — it is never sent
 * anywhere except api.github.com.
 */

const REPO_OWNER = "abhilashabhi29";
const REPO_NAME = "website";
const REPO_BRANCH = "main";
const API = "https://api.github.com";
const TOKEN_STORAGE_KEY = "shantilata_site_gh_token";

let sessionToken = null; // used when "remember" is unchecked
let currentWorks = [];
let editingId = null;

function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionToken;
}

function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionToken = null;
}

function slugify(title) {
  const base = String(title || "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
  return base || String(Date.now());
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function jsStringLiteral(value) {
  return (
    '"' +
    String(value ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\r\n/g, "\n")
      .replace(/\n/g, "\\n") +
    '"'
  );
}

function serializeEntry(w) {
  const lines = [
    `    id: ${jsStringLiteral(w.id)},`,
    `    category: ${jsStringLiteral(w.category)},`,
    `    title: ${jsStringLiteral(w.title)},`,
    `    year: ${jsStringLiteral(w.year)},`,
    `    publisher: ${jsStringLiteral(w.publisher)},`,
    `    shortDesc: ${jsStringLiteral(w.shortDesc)},`,
    `    longDesc: ${jsStringLiteral(w.longDesc)},`,
    `    coverTone: ${Number(w.coverTone) || 1},`,
    `    featured: ${w.featured ? "true" : "false"},`,
    `    linkLabel: ${jsStringLiteral(w.linkLabel || "[READ ARTICLE]")},`,
    `    linkUrl: ${jsStringLiteral(w.linkUrl || "#")},`,
    `    pdfFile: ${jsStringLiteral(w.pdfFile || "")},`,
    `    coverImage: ${jsStringLiteral(w.coverImage || "")}`
  ];
  return "  {\n" + lines.join("\n") + "\n  }";
}

/** Regenerates the WORKS array body, grouped back into BOOKS / MAGAZINE /
 *  ARTICLES sections with their original comment headers. */
function serializeWorks(list) {
  const order = ["books", "magazine", "articles"];
  const labels = { books: "BOOKS", magazine: "MAGAZINE", articles: "ARTICLES" };
  const groups = order
    .map((cat) => ({ cat, items: list.filter((w) => w.category === cat) }))
    .filter((g) => g.items.length > 0);

  let out = "const WORKS = [\n";
  groups.forEach((g, gi) => {
    out += `  // ---------------- ${labels[g.cat]} ----------------\n`;
    out += g.items.map(serializeEntry).join(",\n\n");
    out += gi < groups.length - 1 ? ",\n\n" : "\n";
  });
  out += "];\n";
  return out;
}

function parseDataJs(text) {
  const worksStart = text.indexOf("const WORKS");
  const catStart = text.indexOf("const CATEGORY_LABELS");
  if (worksStart === -1 || catStart === -1) {
    throw new Error(
      "Couldn't find the WORKS/CATEGORY_LABELS markers in data.js — has the file structure changed unexpectedly?"
    );
  }
  const header = text.slice(0, worksStart);
  const footer = text.slice(catStart);
  const works = new Function(text + "\nreturn WORKS;")();
  return { header, footer, works };
}

// ---------------------------------------------------------------------
// Base64 helpers (chunked to safely handle large PDFs)
// ---------------------------------------------------------------------
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function utf8ToBase64(str) {
  return arrayBufferToBase64(new TextEncoder().encode(str).buffer);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

// ---------------------------------------------------------------------
// GitHub API
// ---------------------------------------------------------------------
async function ghFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).message || "";
    } catch (_) {
      /* ignore */
    }
    throw new Error(`GitHub API error ${res.status}${detail ? ": " + detail : ""}`);
  }
  return res.json();
}

async function verifyTokenAndAccess() {
  const user = await ghFetch("/user");
  const repo = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}`);
  if (repo.permissions && !repo.permissions.push) {
    throw new Error(
      `This token doesn't have write access to ${REPO_OWNER}/${REPO_NAME}. Use a classic token with the "repo" scope.`
    );
  }
  return user.login;
}

async function fetchDataJsText() {
  const data = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/js/data.js?ref=${REPO_BRANCH}`);
  return base64ToUtf8(data.content);
}

/** Creates ONE commit on main containing all given files. files: [{path, base64Content}] */
async function commitFiles(files, message) {
  const refData = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${REPO_BRANCH}`);
  const latestCommitSha = refData.object.sha;

  const commitData = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${latestCommitSha}`);
  const baseTreeSha = commitData.tree.sha;

  const treeEntries = [];
  for (const f of files) {
    const blob = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: f.base64Content, encoding: "base64" })
    });
    treeEntries.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
  }

  const tree = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries })
  });

  const newCommit = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, tree: tree.sha, parents: [latestCommitSha] })
  });

  await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${REPO_BRANCH}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sha: newCommit.sha })
  });

  return newCommit.sha;
}

// ---------------------------------------------------------------------
// Page wiring
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const tokenPanel = document.getElementById("token-panel");
  const editorPanel = document.getElementById("editor-panel");
  const tokenInput = document.getElementById("token-input");
  const rememberCheckbox = document.getElementById("remember-token");
  const connectBtn = document.getElementById("save-token-btn");
  const tokenStatus = document.getElementById("token-status");
  const connectedAs = document.getElementById("connected-as");
  const forgetBtn = document.getElementById("forget-token-btn");

  const articleSelect = document.getElementById("article-select");
  const form = document.getElementById("article-form");
  const deleteBtn = document.getElementById("delete-btn");
  const saveStatus = document.getElementById("save-status");
  const coverCurrent = document.getElementById("cover-current");
  const pdfCurrent = document.getElementById("pdf-current");

  async function tryEnterEditor() {
    if (!getToken()) return;
    tokenStatus.textContent = "Checking token…";
    tokenStatus.className = "admin-status";
    try {
      const login = await verifyTokenAndAccess();
      connectedAs.textContent = login;
      tokenPanel.hidden = true;
      editorPanel.hidden = false;
      await refreshWorksList();
    } catch (err) {
      tokenStatus.textContent = "Error: " + err.message;
      tokenStatus.className = "admin-status admin-status-error";
      clearToken();
    }
  }

  connectBtn.addEventListener("click", async () => {
    const token = tokenInput.value.trim();
    if (!token) {
      tokenStatus.textContent = "Paste a token first.";
      tokenStatus.className = "admin-status admin-status-error";
      return;
    }
    if (rememberCheckbox.checked) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      sessionToken = token;
    }
    await tryEnterEditor();
  });

  forgetBtn.addEventListener("click", () => {
    clearToken();
    tokenInput.value = "";
    editorPanel.hidden = true;
    tokenPanel.hidden = false;
    tokenStatus.textContent = "Token forgotten.";
    tokenStatus.className = "admin-status";
  });

  function resetForm() {
    form.reset();
    const defaultTone = document.querySelector('input[name="coverTone"][value="1"]');
    if (defaultTone) defaultTone.checked = true;
    coverCurrent.textContent = "";
    pdfCurrent.textContent = "";
    deleteBtn.hidden = true;
    saveStatus.textContent = "";
    saveStatus.className = "admin-status";
  }

  async function refreshWorksList(selectId) {
    const text = await fetchDataJsText();
    const { works } = parseDataJs(text);
    currentWorks = works;
    const articles = works.filter((w) => w.category === "articles");
    articleSelect.innerHTML =
      '<option value="">— New Article —</option>' +
      articles.map((a) => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.title)}</option>`).join("");
    articleSelect.value = selectId || "";
  }

  articleSelect.addEventListener("change", () => {
    const id = articleSelect.value;
    editingId = id || null;
    if (!id) {
      resetForm();
      return;
    }
    const w = currentWorks.find((x) => x.id === id);
    if (!w) return;
    document.getElementById("f-title").value = w.title || "";
    document.getElementById("f-year").value = w.year && w.year !== "[YEAR]" ? w.year : "";
    document.getElementById("f-publisher").value =
      w.publisher && w.publisher !== "[PUBLICATION / WEBSITE NAME]" ? w.publisher : "";
    document.getElementById("f-shortdesc").value = w.shortDesc || "";
    document.getElementById("f-longdesc").value = w.longDesc || "";
    document.getElementById("f-featured").checked = !!w.featured;
    document.getElementById("f-linkurl").value = w.linkUrl && w.linkUrl !== "#" ? w.linkUrl : "";
    const toneInput = document.querySelector(`input[name="coverTone"][value="${Number(w.coverTone) || 1}"]`);
    if (toneInput) toneInput.checked = true;
    coverCurrent.textContent = w.coverImage ? `Current file: ${w.coverImage}` : "No cover photo yet.";
    pdfCurrent.textContent = w.pdfFile ? `Current file: ${w.pdfFile}` : "No PDF yet.";
    document.getElementById("f-cover").value = "";
    document.getElementById("f-pdf").value = "";
    deleteBtn.hidden = false;
    saveStatus.textContent = "";
    saveStatus.className = "admin-status";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    saveStatus.textContent = "Publishing…";
    saveStatus.className = "admin-status";
    try {
      const title = document.getElementById("f-title").value.trim();
      if (!title) throw new Error("Title is required.");

      let id = editingId;
      const isNew = !id;
      if (isNew) {
        const base = "article-" + slugify(title);
        id = base;
        let n = 2;
        while (currentWorks.some((w) => w.id === id)) {
          id = `${base}-${n++}`;
        }
      }

      const existing = editingId ? currentWorks.find((w) => w.id === editingId) : null;
      const coverFileInput = document.getElementById("f-cover").files[0];
      const pdfFileInput = document.getElementById("f-pdf").files[0];

      const filesToCommit = [];
      let coverImagePath = existing?.coverImage || "";
      if (coverFileInput) {
        saveStatus.textContent = "Uploading cover photo…";
        const ext = (coverFileInput.name.split(".").pop() || "jpg").toLowerCase();
        coverImagePath = `covers/${id}.${ext}`;
        const b64 = arrayBufferToBase64(await coverFileInput.arrayBuffer());
        filesToCommit.push({ path: coverImagePath, base64Content: b64 });
      }

      let pdfPath = existing?.pdfFile || "";
      if (pdfFileInput) {
        saveStatus.textContent = "Uploading PDF…";
        pdfPath = `pdfs/${id}.pdf`;
        const b64 = arrayBufferToBase64(await pdfFileInput.arrayBuffer());
        filesToCommit.push({ path: pdfPath, base64Content: b64 });
      }

      const coverTone = Number(document.querySelector('input[name="coverTone"]:checked')?.value || 1);
      const linkUrlValue = document.getElementById("f-linkurl").value.trim();

      const entry = {
        id,
        category: "articles",
        title,
        year: document.getElementById("f-year").value.trim() || "[YEAR]",
        publisher: document.getElementById("f-publisher").value.trim() || "[PUBLICATION / WEBSITE NAME]",
        shortDesc: document.getElementById("f-shortdesc").value.trim(),
        longDesc: document.getElementById("f-longdesc").value.trim(),
        coverTone,
        featured: document.getElementById("f-featured").checked,
        linkLabel: "[READ ARTICLE]",
        linkUrl: linkUrlValue || "#",
        pdfFile: pdfPath,
        coverImage: coverImagePath
      };

      saveStatus.textContent = "Fetching latest article list…";
      const text = await fetchDataJsText();
      const { header, footer, works } = parseDataJs(text);
      const updated = isNew ? works.concat([entry]) : works.map((w) => (w.id === editingId ? entry : w));
      const newDataJsText = header + serializeWorks(updated) + "\n" + footer;
      filesToCommit.push({ path: "js/data.js", base64Content: utf8ToBase64(newDataJsText) });

      saveStatus.textContent = "Publishing to GitHub…";
      await commitFiles(filesToCommit, `${isNew ? "Add" : "Update"} article: ${title}`);

      editingId = id;
      const liveUrl = `https://${REPO_OWNER}.github.io/${REPO_NAME}/work.html?id=${encodeURIComponent(id)}`;
      saveStatus.innerHTML =
        `Published! GitHub Pages usually takes a minute or two to rebuild — then it'll be live at ` +
        `<a href="${liveUrl}" target="_blank" rel="noopener">${liveUrl}</a>`;
      saveStatus.className = "admin-status admin-status-ok";

      await refreshWorksList(id);
      deleteBtn.hidden = false;
    } catch (err) {
      saveStatus.textContent = "Error: " + err.message;
      saveStatus.className = "admin-status admin-status-error";
    } finally {
      submitBtn.disabled = false;
    }
  });

  deleteBtn.addEventListener("click", async () => {
    if (!editingId) return;
    const ok = confirm(
      "Delete this article from the live site?\n\nAny cover photo or PDF file will stay in the covers/pdfs folders on GitHub — only the listing entry is removed."
    );
    if (!ok) return;
    deleteBtn.disabled = true;
    saveStatus.textContent = "Deleting…";
    saveStatus.className = "admin-status";
    try {
      const text = await fetchDataJsText();
      const { header, footer, works } = parseDataJs(text);
      const updated = works.filter((w) => w.id !== editingId);
      const newDataJsText = header + serializeWorks(updated) + "\n" + footer;
      await commitFiles(
        [{ path: "js/data.js", base64Content: utf8ToBase64(newDataJsText) }],
        `Remove article: ${editingId}`
      );
      saveStatus.textContent = "Deleted and published. It may take a minute or two to disappear from the live site.";
      saveStatus.className = "admin-status admin-status-ok";
      editingId = null;
      resetForm();
      await refreshWorksList();
    } catch (err) {
      saveStatus.textContent = "Error: " + err.message;
      saveStatus.className = "admin-status admin-status-error";
    } finally {
      deleteBtn.disabled = false;
    }
  });

  tryEnterEditor();
});

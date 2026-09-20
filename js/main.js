/**
 * Shared behaviour across all pages: nav toggle, cover-placeholder icons,
 * homepage "featured works", category grid + search/filter, and the
 * single-work detail page.
 */

// ---------------------------------------------------------------------
// Icons (generic, non-denominational line art — no copyrighted marks)
// ---------------------------------------------------------------------
const ICONS = {
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5c2.2-1 5-1 7 0v13c-2-1-4.8-1-7 0v-13Z"/><path d="M18.5 5.5c-2.2-1-4.5-1-6.5 0v13c2-1 4.3-1 6.5 0v-13Z"/></svg>',
  magazine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3.5" width="16" height="17" rx="1.5"/><path d="M7.5 8h9M7.5 12h9M7.5 16h5"/></svg>',
  article: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h9l3 3v14H6v-17Z"/><path d="M15 3.5v3h3"/><path d="M8.5 12h7M8.5 15h7M8.5 9h3"/></svg>',
  lotus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-3.5-1.4-6-4.4-6-8 3 .3 5 1.8 6 4 1-2.2 3-3.7 6-4 0 3.6-2.5 6.6-6 8Z"/><path d="M12 17c-2.6-1.6-4-4-4-7 2.4.4 3.8 1.7 4 3.5.2-1.8 1.6-3.1 4-3.5 0 3-1.4 5.4-4 7Z"/><path d="M12 12.5c-1.3-1.6-1.7-3.4-1.2-5.6 1.6.7 2.4 1.9 2.4 3.4 0-1.5.8-2.7 2.4-3.4.5 2.2.1 4-1.2 5.6"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-3 0-5.2-2.2-5.2-5 0-2.2 1.4-3.6 2.3-5.2.6-1.1.9-2.1.9-3.3 0-1 .5-1.5 1-1.5.6 0 1 .7 1 1.7 0 1.3.6 2 1.4 2.9 1.4 1.6 3.8 3.5 3.8 6.4 0 2.5-2.2 4-5.2 4Z"/><path d="M12 21c-1.5 0-2.6-1-2.6-2.4 0-1.5 1.3-2.3 2.6-3.6 1.3 1.3 2.6 2.1 2.6 3.6 0 1.4-1.1 2.4-2.6 2.4Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.6-3.6"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="m7.5 11 4.5 4.5L16.5 11"/><path d="M5 19.5h14"/></svg>',
  empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.6-3.6"/><path d="M8.5 11h5"/></svg>'
};

const CATEGORY_ICON = {
  books: ICONS.book,
  magazine: ICONS.magazine,
  articles: ICONS.article
};

function coverPlaceholderHTML(work, { tag = true } = {}) {
  const tagHTML = tag
    ? `<span class="work-type-tag">${CATEGORY_LABELS[work.category]}</span>`
    : "";

  if (work.coverImage) {
    return `
      <div class="cover-image">
        ${tagHTML}
        <img src="${work.coverImage}" alt="${work.title} — cover" loading="lazy" />
      </div>
    `;
  }

  const icon = CATEGORY_ICON[work.category] || ICONS.book;
  return `
    <div class="cover-placeholder cover-tone-${work.coverTone}">
      ${tagHTML}
      ${icon}
      <span class="placeholder-label">[COVER_IMAGE]</span>
    </div>
  `;
}

// ---------------------------------------------------------------------
// Navigation (mobile toggle + active link highlighting)
// ---------------------------------------------------------------------
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  const current = document.body.dataset.page;
  if (current) {
    document.querySelectorAll(`.nav-links a[data-page="${current}"]`).forEach((a) =>
      a.classList.add("active")
    );
  }
}

// ---------------------------------------------------------------------
// Homepage: featured works
// ---------------------------------------------------------------------
function renderFeatured() {
  const container = document.getElementById("featured-grid");
  if (!container) return;

  const featured = WORKS.filter((w) => w.featured).slice(0, 6);
  container.innerHTML = featured.map(workCardHTML).join("");
}

function workCardHTML(work) {
  return `
    <article class="work-card">
      <a href="work.html?id=${encodeURIComponent(work.id)}" aria-label="View ${work.title}">
        ${coverPlaceholderHTML(work)}
      </a>
      <div class="work-card-body">
        <div class="work-card-meta">
          <span>${CATEGORY_LABELS[work.category]}</span>
          <span class="year">${work.year}</span>
        </div>
        <h3>${work.title}</h3>
        <p class="work-card-desc">${work.shortDesc}</p>
        <a class="work-card-link" href="work.html?id=${encodeURIComponent(work.id)}">Read more</a>
      </div>
    </article>
  `;
}

// ---------------------------------------------------------------------
// Category listing pages: render + search/filter
// ---------------------------------------------------------------------
function initCategoryPage(category) {
  const grid = document.getElementById("category-grid");
  if (!grid) return;

  const items = WORKS.filter((w) => w.category === category);
  const searchInput = document.getElementById("search-input");
  const yearSelect = document.getElementById("year-filter");
  const resultsCount = document.getElementById("results-count");

  // Populate year filter options
  if (yearSelect) {
    const years = Array.from(new Set(items.map((w) => w.year))).sort();
    years.forEach((year) => {
      const opt = document.createElement("option");
      opt.value = year;
      opt.textContent = year;
      yearSelect.appendChild(opt);
    });
  }

  function applyFilters() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const year = yearSelect?.value || "";

    const filtered = items.filter((w) => {
      const matchesQuery =
        !query ||
        w.title.toLowerCase().includes(query) ||
        w.shortDesc.toLowerCase().includes(query);
      const matchesYear = !year || w.year === year;
      return matchesQuery && matchesYear;
    });

    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "entry" : "entries"}`;
    }

    grid.innerHTML = filtered.length
      ? filtered.map(workCardHTML).join("")
      : `<div class="empty-state">${ICONS.empty}<p>No entries match your search. Try a different keyword or year.</p></div>`;
  }

  searchInput?.addEventListener("input", applyFilters);
  yearSelect?.addEventListener("change", applyFilters);

  applyFilters();
}

// ---------------------------------------------------------------------
// Detail page
// ---------------------------------------------------------------------
function initDetailPage() {
  const root = document.getElementById("detail-root");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const work = WORKS.find((w) => w.id === id);

  if (!work) {
    root.innerHTML = `
      <div class="empty-state">
        ${ICONS.empty}
        <p>This work could not be found. It may have been moved or removed.</p>
        <a class="btn btn-outline" href="index.html" style="margin-top:1.2rem;">Return home</a>
      </div>
    `;
    document.title = "Work not found — SHANTILATA PRADHAN";
    return;
  }

  document.title = `${work.title} — SHANTILATA PRADHAN`;

  const paragraphs = work.longDesc
    .split("\n\n")
    .map((p) => `<p>${p}</p>`)
    .join("");

  root.innerHTML = `
    <nav class="breadcrumb">
      <a href="index.html">Home</a>
      <span class="sep">/</span>
      <a href="${work.category}.html">${CATEGORY_LABELS[work.category]}</a>
      <span class="sep">/</span>
      <span>${work.title}</span>
    </nav>

    <div class="detail-layout">
      ${
        work.coverImage
          ? `<div class="detail-cover cover-image"><img src="${work.coverImage}" alt="${work.title} — cover" /></div>`
          : `<div class="detail-cover cover-placeholder cover-tone-${work.coverTone}">
              ${CATEGORY_ICON[work.category]}
              <span class="placeholder-label">[COVER_IMAGE]</span>
            </div>`
      }

      <div class="detail-main">
        <div class="detail-meta-row">
          <span class="pill">${CATEGORY_LABELS[work.category]}</span>
          <span class="pill">${work.year}</span>
        </div>
        <div class="detail-title">
          <h1>${work.title}</h1>
        </div>

        <dl class="detail-facts">
          <div>
            <dt>Publication Year</dt>
            <dd>${work.year}</dd>
          </div>
          <div>
            <dt>Publisher</dt>
            <dd>${work.publisher}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>${CATEGORY_LABELS[work.category]}</dd>
          </div>
        </dl>

        <div class="detail-body">
          ${paragraphs}
        </div>

        <p class="mt-lg"><a class="btn-ghost" href="${work.category}.html">Back to ${CATEGORY_LABELS[work.category]}</a></p>
      </div>
    </div>

    <section class="pdf-reader-section" id="pdf-reader-section">
      ${work.pdfFile ? pdfReaderHTML(work) : externalLinkHTML(work)}
    </section>
  `;

  if (work.pdfFile && window.location.protocol !== "file:") {
    fetch(work.pdfFile, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) showPdfMissing(work);
      })
      .catch(() => showPdfMissing(work));
  }
}

function showPdfMissing(work) {
  const section = document.getElementById("pdf-reader-section");
  if (!section) return;
  section.innerHTML = `
    <div class="download-box">
      <div class="label">
        ${ICONS.download}
        <span>This PDF hasn't been uploaded yet. Add it at <code>${work.pdfFile}</code> in the project folder and it will appear here automatically.</span>
      </div>
    </div>
  `;
}

function pdfReaderHTML(work) {
  return `
    <div class="pdf-reader">
      <div class="pdf-reader-toolbar">
        <span class="pdf-reader-title">${ICONS.book} Read the Full Text</span>
        <a class="btn btn-outline" href="${work.pdfFile}" target="_blank" rel="noopener">Open in New Tab</a>
      </div>
      <div class="pdf-frame-wrap">
        <iframe src="${work.pdfFile}" title="${work.title} — full text PDF" loading="lazy"></iframe>
      </div>
      <p class="pdf-fallback-note">
        If the reader above appears blank, the file <code>${work.pdfFile}</code> may not have been uploaded yet, or
        your browser may block inline PDFs — use "Open in New Tab" instead.
      </p>
    </div>
  `;
}

function externalLinkHTML(work) {
  const hasRealLink = work.linkUrl && work.linkUrl !== "#";
  return `
    <div class="download-box">
      <div class="label">
        ${ICONS.download}
        <span>${
          hasRealLink
            ? "Full text available via external link."
            : "Full text / PDF not yet added. Place a PDF in the <code>pdfs</code> folder and set its <code>pdfFile</code> path in <code>js/data.js</code>."
        }</span>
      </div>
      <a class="btn btn-primary" href="${work.linkUrl}"${hasRealLink ? ' target="_blank" rel="noopener"' : ""}>${work.linkLabel}</a>
    </div>
  `;
}

// ---------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  renderFeatured();
  initDetailPage();

  const category = document.body.dataset.category;
  if (category) initCategoryPage(category);
});

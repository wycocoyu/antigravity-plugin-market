const state = {
  data: null,
  category: "all",
  query: "",
  sort: "featured",
  lang: "zh",
};

const I18N = {
  zh: {
    siteTitle: "Antigravity Store",
    submitPlugin: "+ 投稿插件",
    heroPill: "专为 Antigravity 桌面端与 CLI 收录",
    heroTitle: "发现并安装好用的反重力插件",
    heroDesc:
      "收录社区高频使用的上下文看板、暖色皮肤、中文汉化、ACP 协议桥接与效率侧边栏插件，附带真实 GitHub Star 与一键安装指令。",
    spotlightTitle: "站长精选 · Editors' Spotlight",
    spotlightSub: "装机必看核心插件",
    sortFeatured: "精选优先",
    sortStars: "Star 最高",
    sortName: "名称 A-Z",
    copyShort: "复制",
    copyCmd: "复制安装命令",
    viewRepo: "GitHub 仓库",
    copied: "已复制安装命令",
    searchPlaceholder: "搜索插件、皮肤、汉化、ACP、上下文...",
    resultsText: (n) => `${n} 个插件`,
    emptyText: "没有匹配的插件，试试换个关键词或分类。",
    footerNote: (date) => `数据核验：${date} · Antigravity 社区精选目录`,
    installTitle: "安装命令",
    mechanismLabel: "实现机制",
    authorLabel: "作者",
    statsHtml: (total, cats, totalStars) =>
      `<span><strong>${total}</strong> 插件</span><span><strong>${cats}</strong> 分类</span><span><strong>${totalStars}</strong> 总 Stars</span>`,
  },
  en: {
    siteTitle: "Antigravity Store",
    submitPlugin: "+ Submit",
    heroPill: "Curated for Antigravity Desktop & CLI",
    heroTitle: "Discover Essential Antigravity Plugins",
    heroDesc:
      "Community-curated context dashboards, custom themes, localization packs, ACP bridges & sidebar tools with real GitHub stars and one-click install commands.",
    spotlightTitle: "Editors' Spotlight",
    spotlightSub: "Essential picks for your setup",
    sortFeatured: "Featured First",
    sortStars: "Most Stars",
    sortName: "Name A-Z",
    copyShort: "Copy",
    copyCmd: "Copy Install Command",
    viewRepo: "Open on GitHub",
    copied: "Install command copied",
    searchPlaceholder: "Search plugins, themes, i18n, ACP, context...",
    resultsText: (n) => `${n} plugins`,
    emptyText: "No matching plugins found.",
    footerNote: (date) => `Last verified: ${date} · Curated Antigravity Directory`,
    installTitle: "Install Command",
    mechanismLabel: "Mechanism",
    authorLabel: "Author",
    statsHtml: (total, cats, totalStars) =>
      `<span><strong>${total}</strong> plugins</span><span><strong>${cats}</strong> categories</span><span><strong>${totalStars}</strong> total stars</span>`,
  },
};

const CATEGORY_VISUALS = {
  context: {
    bg: "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(59,130,246,0.14))",
    color: "#38bdf8",
    svg: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
  },
  theme: {
    bg: "linear-gradient(135deg, rgba(251,146,60,0.22), rgba(244,63,94,0.14))",
    color: "#fb923c",
    svg: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  },
  i18n: {
    bg: "linear-gradient(135deg, rgba(244,63,94,0.22), rgba(236,72,153,0.14))",
    color: "#fb7185",
    svg: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
  },
  acp: {
    bg: "linear-gradient(135deg, rgba(168,85,247,0.22), rgba(99,102,241,0.14))",
    color: "#c084fc",
    svg: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>`,
  },
  workflow: {
    bg: "linear-gradient(135deg, rgba(52,211,153,0.22), rgba(16,185,129,0.14))",
    color: "#34d399",
    svg: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>`,
  },
};

const SPOTLIGHT_IDS = [
  "agy-project-sidebar",
  "agy-context-dashboard",
  "antigravity-panel",
  "chuanban-antigravity-theme-patch",
];

const formatStars = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.hidden = true;
  }, 1600);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(I18N[state.lang].copied);
  } catch {
    showToast(text);
  }
}

function badgeClass(badge) {
  if (!badge) return "";
  if (badge.includes("站长") || badge.includes("Staff")) return "badge-staff";
  if (badge.includes("风险") || badge.includes("ToS")) return "badge-warn";
  return "badge-default";
}

function renderI18n() {
  const t = I18N[state.lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (typeof t[key] === "string") el.textContent = t[key];
  });
  document.getElementById("searchInput").placeholder = t.searchPlaceholder;
  document.getElementById("langToggle").textContent = state.lang === "zh" ? "EN" : "中";
  if (state.data) {
    document.getElementById("footerNote").textContent = t.footerNote(state.data.updatedAt);
  }
}

function renderStats() {
  const t = I18N[state.lang];
  const total = state.data.plugins.length;
  const cats = state.data.categories.length - 1;
  const sumStars = state.data.plugins.reduce((acc, p) => acc + p.stars, 0);
  document.getElementById("heroStats").innerHTML = t.statsHtml(total, cats, formatStars(sumStars));
}

function renderSpotlight() {
  const container = document.getElementById("spotlightGrid");
  const picks = SPOTLIGHT_IDS.map((id) => state.data.plugins.find((p) => p.id === id)).filter(Boolean);
  container.innerHTML = picks
    .map((p) => {
      const vis = CATEGORY_VISUALS[p.category] || CATEGORY_VISUALS.workflow;
      const badge = state.lang === "zh" ? p.badge : p.badgeEn;
      const summary = state.lang === "zh" ? p.summary : p.summaryEn;
      return `
        <article class="spot-card" data-id="${p.id}">
          <div class="card-head">
            <div class="card-icon" style="background:${vis.bg};color:${vis.color}">${vis.svg}</div>
            <div class="card-title-wrap">
              <h3 class="card-title" title="${p.name}">${p.name}</h3>
              <div class="card-repo">${p.repo}</div>
            </div>
          </div>
          <p class="card-desc">${summary}</p>
          <div class="card-foot">
            <div class="card-badges">
              ${badge ? `<span class="badge ${badgeClass(badge)}">${badge}</span>` : ""}
              <span class="star-pill">★ ${formatStars(p.stars)}</span>
            </div>
            <button class="mini-btn" type="button" data-copy="${p.id}">${I18N[state.lang].copyShort}</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCategories() {
  const bar = document.getElementById("categoryBar");
  const counts = { all: state.data.plugins.length };
  for (const p of state.data.plugins) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  }
  bar.innerHTML = state.data.categories
    .map((cat) => {
      const label = state.lang === "zh" ? cat.label : cat.labelEn;
      const active = state.category === cat.id ? "active" : "";
      return `<button class="cat-pill ${active}" type="button" data-cat="${cat.id}">
        <span>${label}</span>
        <span class="cat-count">${counts[cat.id] || 0}</span>
      </button>`;
    })
    .join("");
}

function getFilteredPlugins() {
  const q = state.query.trim().toLowerCase();
  const list = state.data.plugins.filter((p) => {
    if (state.category !== "all" && p.category !== state.category) return false;
    if (!q) return true;
    const hay = [p.name, p.repo, p.author, p.mechanism, p.summary, p.summaryEn, ...(p.tags || [])]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });

  list.sort((a, b) => {
    if (state.sort === "featured") {
      const aStaff = a.badge === "站长精选" || a.badgeEn === "Staff Pick";
      const bStaff = b.badge === "站长精选" || b.badgeEn === "Staff Pick";
      if (aStaff !== bStaff) return aStaff ? -1 : 1;
      if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
      return b.stars - a.stars;
    }
    if (state.sort === "stars") return b.stars - a.stars;
    return a.name.localeCompare(b.name);
  });
  return list;
}

function renderGrid() {
  const t = I18N[state.lang];
  const list = getFilteredPlugins();
  document.getElementById("resultCount").textContent = t.resultsText(list.length);
  const grid = document.getElementById("pluginGrid");

  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--text-muted)">${t.emptyText}</p>`;
    return;
  }

  grid.innerHTML = list
    .map((p) => {
      const vis = CATEGORY_VISUALS[p.category] || CATEGORY_VISUALS.workflow;
      const badge = state.lang === "zh" ? p.badge : p.badgeEn;
      const summary = state.lang === "zh" ? p.summary : p.summaryEn;
      return `
        <article class="card" data-id="${p.id}">
          <div class="card-head">
            <div class="card-icon" style="background:${vis.bg};color:${vis.color}">${vis.svg}</div>
            <div class="card-title-wrap">
              <h3 class="card-title" title="${p.name}">${p.name}</h3>
              <div class="card-repo">${p.repo}</div>
            </div>
            <span class="star-pill">★ ${formatStars(p.stars)}</span>
          </div>
          <p class="card-desc">${summary}</p>
          <div class="card-foot">
            <div class="card-badges">
              ${badge ? `<span class="badge ${badgeClass(badge)}">${badge}</span>` : ""}
              <span class="mech-tag">${p.mechanism}</span>
            </div>
            <div class="mini-actions">
              <button class="mini-btn" type="button" data-copy="${p.id}">${t.copyShort}</button>
              <a class="mini-btn" href="${p.url}" target="_blank" rel="noopener noreferrer" data-external="1">↗</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function openModal(id) {
  const p = state.data.plugins.find((item) => item.id === id);
  if (!p) return;
  const t = I18N[state.lang];
  const vis = CATEGORY_VISUALS[p.category] || CATEGORY_VISUALS.workflow;
  const summary = state.lang === "zh" ? p.summary : p.summaryEn;
  document.getElementById("modalBody").innerHTML = `
    <div class="card-head" style="margin-bottom:14px">
      <div class="card-icon" style="background:${vis.bg};color:${vis.color}">${vis.svg}</div>
      <div>
        <h2 id="modalTitle" style="margin:0;font-size:18px">${p.name}</h2>
        <div class="card-repo">★ ${p.stars.toLocaleString()} · ${t.authorLabel}: ${p.author} · ${t.mechanismLabel}: ${p.mechanism}</div>
      </div>
    </div>
    <p style="margin:0 0 14px;color:var(--text-muted);font-size:14px">${summary}</p>
    <strong style="font-size:12.5px;color:var(--text-muted)">${t.installTitle}</strong>
    <pre class="code-box"><code>${p.install}</code></pre>
    <div class="modal-actions">
      <button class="modal-btn modal-btn-primary" type="button" id="modalCopyBtn">${t.copyCmd}</button>
      <a class="modal-btn" href="${p.url}" target="_blank" rel="noopener noreferrer">${t.viewRepo} ↗</a>
    </div>
  `;
  document.getElementById("modalCopyBtn").onclick = () => copyText(p.install);
  document.getElementById("modalBackdrop").hidden = false;
}

function renderAll() {
  renderI18n();
  renderStats();
  renderSpotlight();
  renderCategories();
  renderGrid();
}

async function init() {
  const res = await fetch("./data/plugins.json");
  state.data = await res.json();
  renderAll();

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderGrid();
  });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.getElementById("searchInput").focus();
    } else if (e.key === "Escape") {
      document.getElementById("modalBackdrop").hidden = true;
    }
  });

  document.getElementById("sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderGrid();
  });

  document.getElementById("categoryBar").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.getAttribute("data-cat");
    renderCategories();
    renderGrid();
  });

  const handleCardContainerClick = (e) => {
    const copyBtn = e.target.closest("[data-copy]");
    if (copyBtn) {
      e.stopPropagation();
      const p = state.data.plugins.find((x) => x.id === copyBtn.getAttribute("data-copy"));
      if (p) copyText(p.install);
      return;
    }
    if (e.target.closest("[data-external]")) return;
    const card = e.target.closest("[data-id]");
    if (card) openModal(card.getAttribute("data-id"));
  };

  document.getElementById("pluginGrid").addEventListener("click", handleCardContainerClick);
  document.getElementById("spotlightGrid").addEventListener("click", handleCardContainerClick);

  document.getElementById("langToggle").addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    renderAll();
  });

  document.getElementById("themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    document.getElementById("themeToggle").textContent = next === "dark" ? "☀️" : "🌙";
  });

  document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("modalBackdrop").hidden = true;
  });

  document.getElementById("modalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "modalBackdrop") {
      document.getElementById("modalBackdrop").hidden = true;
    }
  });
}

init();

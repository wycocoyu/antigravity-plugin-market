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
    siteSub: "反重力第三方精选插件市场",
    submitPlugin: "+ 投稿插件",
    heroPill: "专为 Antigravity 桌面端与 CLI 收录",
    heroTitle: "一站发现好用的反重力插件",
    heroDesc:
      "收录社区高频使用的上下文监控、暖色皮肤、中文汉化、ACP 协议桥接与效率增强插件，全部附带真实 Star 数与一键安装指令。",
    sortLabel: "排序：",
    sortFeatured: "站长精选优先",
    sortStars: "Star 数最高",
    sortName: "名称 A-Z",
    copyCmd: "复制安装命令",
    viewRepo: "查看仓库",
    copied: "已复制安装命令",
    searchPlaceholder: "搜索插件、皮肤、汉化、ACP、上下文...",
    pluginsCount: "个插件",
    categoriesCount: "个分类",
    resultsText: (n) => `共找到 ${n} 个精选插件`,
    emptyText: "没有匹配的插件，试试换个关键词或分类。",
    footerNote: (date) => `数据最后核验：${date} · 由社区与站长共同维护`,
    installTitle: "安装命令",
    mechanismLabel: "实现机制",
    authorLabel: "作者",
  },
  en: {
    siteTitle: "Antigravity Store",
    siteSub: "Curated Antigravity Plugin Market",
    submitPlugin: "+ Submit Plugin",
    heroPill: "Curated for Antigravity Desktop & CLI",
    heroTitle: "Discover Essential Antigravity Plugins",
    heroDesc:
      "Community-curated context dashboards, custom themes, localization packs, ACP bridges & sidebar tools with real GitHub stars and one-click install commands.",
    sortLabel: "Sort:",
    sortFeatured: "Staff Picks First",
    sortStars: "Most Stars",
    sortName: "Name A-Z",
    copyCmd: "Copy Install",
    viewRepo: "GitHub",
    copied: "Install command copied",
    searchPlaceholder: "Search plugins, themes, i18n, ACP, context...",
    pluginsCount: "Plugins",
    categoriesCount: "Categories",
    resultsText: (n) => `${n} curated plugins`,
    emptyText: "No matching plugins found. Try another keyword or category.",
    footerNote: (date) => `Last verified: ${date} · Curated for the Antigravity community`,
    installTitle: "Install Command",
    mechanismLabel: "Mechanism",
    authorLabel: "Author",
  },
};

const CATEGORY_COLORS = {
  context: "linear-gradient(135deg, #1a73e8, #4285f4)",
  theme: "linear-gradient(135deg, #e37400, #fbbc04)",
  i18n: "linear-gradient(135deg, #d93025, #f28b82)",
  acp: "linear-gradient(135deg, #9334e6, #c58af9)",
  workflow: "linear-gradient(135deg, #137333, #34a853)",
};

const formatStars = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.hidden = true;
  }, 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(I18N[state.lang].copied);
  } catch {
    showToast(text);
  }
}

function getFilteredPlugins() {
  if (!state.data) return [];
  const q = state.query.trim().toLowerCase();
  const list = state.data.plugins.filter((p) => {
    if (state.category !== "all" && p.category !== state.category) return false;
    if (!q) return true;
    const hay = [
      p.name,
      p.repo,
      p.author,
      p.mechanism,
      p.summary,
      p.summaryEn,
      ...(p.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });

  list.sort((a, b) => {
    if (state.sort === "featured") {
      if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
      return b.stars - a.stars;
    }
    if (state.sort === "stars") return b.stars - a.stars;
    return a.name.localeCompare(b.name);
  });
  return list;
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
  document.getElementById("heroStats").innerHTML = `
    <div class="stat-box"><span class="stat-num">${total}</span><span class="stat-label">${t.pluginsCount}</span></div>
    <div class="stat-box"><span class="stat-num">${cats}</span><span class="stat-label">${t.categoriesCount}</span></div>
  `;
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

function badgeClass(badge) {
  if (!badge) return "";
  if (badge.includes("站长") || badge.includes("Staff")) return "badge-staff";
  if (badge.includes("风险") || badge.includes("ToS")) return "badge-warn";
  return "badge-default";
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
      const badge = state.lang === "zh" ? p.badge : p.badgeEn;
      const summary = state.lang === "zh" ? p.summary : p.summaryEn;
      const iconBg = CATEGORY_COLORS[p.category] || CATEGORY_COLORS.workflow;
      const initial = p.name.trim()[0].toUpperCase();
      return `
        <article class="card" data-id="${p.id}">
          <div class="card-head">
            <div class="card-icon" style="background:${iconBg}">${initial}</div>
            <div class="card-title-wrap">
              <h2 class="card-title" title="${p.name}">${p.name}</h2>
              <div class="card-meta">
                <span>★ ${formatStars(p.stars)}</span>
                <span>·</span>
                <span>${p.mechanism}</span>
              </div>
            </div>
            ${badge ? `<span class="badge ${badgeClass(badge)}">${badge}</span>` : ""}
          </div>
          <p class="card-desc">${summary}</p>
          <div class="card-tags">
            ${(p.tags || []).slice(0, 3).map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" type="button" data-copy="${p.id}">${t.copyCmd}</button>
            <a class="btn" href="${p.url}" target="_blank" rel="noopener noreferrer" data-external="1">${t.viewRepo}</a>
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
  const summary = state.lang === "zh" ? p.summary : p.summaryEn;
  const body = document.getElementById("modalBody");
  body.innerHTML = `
    <h2 id="modalTitle" style="margin:0 0 6px">${p.name}</h2>
    <div class="card-meta" style="margin-bottom:14px">
      <span>★ ${p.stars.toLocaleString()}</span>
      <span>·</span>
      <span>${t.authorLabel}: ${p.author}</span>
      <span>·</span>
      <span>${t.mechanismLabel}: ${p.mechanism}</span>
    </div>
    <p style="margin:0 0 14px;color:var(--text-muted)">${summary}</p>
    <strong style="font-size:13px">${t.installTitle}</strong>
    <pre class="code-box"><code>${p.install}</code></pre>
    <div class="card-actions">
      <button class="btn btn-primary" type="button" id="modalCopyBtn">${t.copyCmd}</button>
      <a class="btn" href="${p.url}" target="_blank" rel="noopener noreferrer">${t.viewRepo} (${p.repo})</a>
    </div>
  `;
  document.getElementById("modalCopyBtn").onclick = () => copyText(p.install);
  document.getElementById("modalBackdrop").hidden = false;
}

function renderAll() {
  renderI18n();
  renderStats();
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

  document.getElementById("pluginGrid").addEventListener("click", (e) => {
    const copyBtn = e.target.closest("[data-copy]");
    if (copyBtn) {
      e.stopPropagation();
      const p = state.data.plugins.find((x) => x.id === copyBtn.getAttribute("data-copy"));
      if (p) copyText(p.install);
      return;
    }
    if (e.target.closest("[data-external]")) return;
    const card = e.target.closest(".card");
    if (card) openModal(card.getAttribute("data-id"));
  });

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

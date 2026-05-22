(() => {
  const DEFAULT_DATA = {
    siteTitle: "虎子的小鹿社",
    hero: {
      kicker: "此刻悄然而生的 tokimeki",
      title: "鹿出来了",
      motto: "热爱是一切的理由和答案",
      logoSrc: "assets/deer-pipe-logo.png"
    },
    categories: [
      {
        id: "gacha",
        icon: "🧸",
        name: "扭蛋机",
        defaultOpen: true,
        projects: [
          { title: "拉拉人不灭 — LoveLive! 角色扭蛋", subtitle: "μ's / Aqours / 虹咲 / Liella! 全角色", href: "/lovelive-gacha/", status: "online", tags: ["LoveLive", "角色", "扭蛋"] },
          { title: "虹咲学园偶像祭", subtitle: "虹咲学园同好会", href: "/nijigasaki/", status: "online", tags: ["虹咲", "同好会", "偶像"] },
          { title: "GACHA CARD STUDIO V2", subtitle: "在线扭蛋卡牌制作工具", href: "/gacha-card-studio-v2/", status: "online", tags: ["卡牌", "编辑器", "工具"] }
        ]
      },
      {
        id: "travel",
        icon: "🌏",
        name: "工具",
        defaultOpen: false,
        projects: [
          { title: "星空旅游战略地图", subtitle: "LLer 专属出行规划工具", href: "/travel-map/", status: "online", tags: ["地图", "旅行", "路线"] }
        ]
      }
    ]
  };

  const ids = {
    shell: "appShell",
    nav: "projectNav",
    search: "projectSearch",
    collapse: "sidebarCollapse",
    railExpand: "railExpand",
    mobileMenu: "mobileMenu",
    mobileClose: "mobileClose",
    mobileOverlay: "mobileOverlay",
    heroKicker: "heroKicker",
    heroTitle: "heroTitle",
    heroLogo: "heroLogo",
    bottomMotto: "bottomMotto"
  };

  const state = {
    data: DEFAULT_DATA,
    query: "",
    openCategories: new Set(),
    activeHref: ""
  };

  const $ = (id) => document.getElementById(id);
  const text = (value) => String(value ?? "");
  const normalize = (value) => text(value).trim().toLowerCase();

  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function usableCategories(data) {
    return (data.categories || [])
      .map((category) => ({ ...category, projects: Array.isArray(category.projects) ? category.projects : [] }))
      .filter((category) => category.projects.length > 0);
  }

  async function loadData() {
    try {
      const response = await fetch("assets/projects.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`projects.json ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.categories)) throw new Error("projects.json 缺少 categories 数组");
      return data;
    } catch (error) {
      console.warn("projects.json 读取失败，使用内置项目数据：", error);
      return DEFAULT_DATA;
    }
  }

  function hydrateHero(data) {
    const hero = data.hero || DEFAULT_DATA.hero;
    const title = hero.title || DEFAULT_DATA.hero.title;
    const siteTitle = data.siteTitle || DEFAULT_DATA.siteTitle;
    document.title = `${siteTitle}｜${title}`;
    $(ids.heroKicker).textContent = hero.kicker || DEFAULT_DATA.hero.kicker;
    $(ids.heroTitle).textContent = title;
    $(ids.bottomMotto).textContent = hero.motto || DEFAULT_DATA.hero.motto;
    if (hero.logoSrc) $(ids.heroLogo).src = hero.logoSrc;
  }

  function projectMatches(project, category, query) {
    if (!query) return true;
    const haystack = [project.title, project.subtitle, project.href, category.name, ...(project.tags || [])]
      .map(normalize)
      .join(" ");
    return haystack.includes(query);
  }

  function setActiveHref(href) {
    state.activeHref = href || "";
    document.querySelectorAll(".project-link").forEach((link) => {
      link.dataset.active = link.getAttribute("href") === state.activeHref ? "true" : "false";
    });
  }

  function closeMobileNav() {
    const shell = $(ids.shell);
    shell.dataset.mobileNav = "closed";
    $(ids.mobileOverlay).hidden = true;
  }

  function openMobileNav() {
    const shell = $(ids.shell);
    shell.dataset.mobileNav = "open";
    $(ids.mobileOverlay).hidden = false;
  }

  function expandDesktopSidebar() {
    const shell = $(ids.shell);
    shell.dataset.sidebar = "expanded";
    localStorage.setItem("tokimeki-sidebar", "expanded");
    $(ids.collapse)?.setAttribute("aria-expanded", "true");
  }

  function toggleCategory(categoryId) {
    const shell = $(ids.shell);
    const isMobile = window.matchMedia("(max-width: 860px)").matches;
    if (shell.dataset.sidebar === "collapsed" && !isMobile) {
      expandDesktopSidebar();
      state.openCategories.add(categoryId);
      renderNav();
      return;
    }
    if (state.openCategories.has(categoryId)) state.openCategories.delete(categoryId);
    else state.openCategories.add(categoryId);
    renderNav();
  }

  function renderNav() {
    const nav = $(ids.nav);
    const query = normalize(state.query);
    const categories = usableCategories(state.data);
    nav.innerHTML = "";

    let matchCount = 0;
    categories.forEach((category) => {
      const categoryNameMatches = normalize(category.name).includes(query);
      const projects = category.projects.filter((project) => projectMatches(project, category, query));
      if (query && !categoryNameMatches && projects.length === 0) return;

      const isOpen = query ? true : state.openCategories.has(category.id);
      const section = el("section", "category");
      section.dataset.open = isOpen ? "true" : "false";

      const toggle = el("button", "category-toggle");
      toggle.type = "button";
      toggle.title = category.name;
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.addEventListener("click", () => toggleCategory(category.id));

      toggle.append(el("span", "category-icon", category.icon || "•"));
      const meta = el("span", "category-meta");
      meta.append(el("span", "category-name", category.name));
      meta.append(el("span", "category-count", `${category.projects.length} 个项目`));
      toggle.append(meta);
      toggle.append(el("span", "category-chevron", "›"));
      section.append(toggle);

      const list = el("div", "project-list");
      list.hidden = !isOpen;
      projects.forEach((project) => {
        matchCount += 1;
        const link = el("a", "project-link");
        link.href = project.href || "#";
        link.dataset.active = link.href === state.activeHref ? "true" : "false";
        link.addEventListener("mouseenter", () => setActiveHref(project.href));
        link.addEventListener("focus", () => setActiveHref(project.href));
        link.addEventListener("click", () => closeMobileNav());

        const row = el("div", "project-title-row");
        row.append(el("span", "project-title", project.title || "未命名项目"));
        if ((project.status || "online") === "online") {
          const dot = el("span", "status-dot");
          dot.setAttribute("aria-label", "在线");
          row.append(dot);
        }
        link.append(row);
        link.append(el("div", "project-subtitle", project.subtitle || ""));
        list.append(link);
      });
      section.append(list);
      nav.append(section);
    });

    if (categories.length === 0) nav.append(el("div", "nav-empty", "还没有项目。请在 assets/projects.json 里添加分类和链接。"));
    else if (query && matchCount === 0) nav.append(el("div", "nav-no-result", "没有找到匹配项目。"));
  }

  function initCategoryState() {
    usableCategories(state.data).forEach((category, index) => {
      if (category.defaultOpen || index === 0) state.openCategories.add(category.id);
    });
  }

  function initSidebarState() {
    const shell = $(ids.shell);
    const saved = localStorage.getItem("tokimeki-sidebar");
    shell.dataset.sidebar = saved === "collapsed" ? "collapsed" : "expanded";
    $(ids.collapse)?.setAttribute("aria-expanded", String(shell.dataset.sidebar !== "collapsed"));
  }

  function bindEvents() {
    const shell = $(ids.shell);
    const collapse = $(ids.collapse);
    const railExpand = $(ids.railExpand);
    const search = $(ids.search);

    collapse?.addEventListener("click", () => {
      const next = shell.dataset.sidebar === "collapsed" ? "expanded" : "collapsed";
      shell.dataset.sidebar = next;
      collapse.setAttribute("aria-expanded", String(next !== "collapsed"));
      localStorage.setItem("tokimeki-sidebar", next);
    });
    railExpand?.addEventListener("click", expandDesktopSidebar);
    search?.addEventListener("input", (event) => {
      state.query = event.target.value;
      renderNav();
    });

    $(ids.mobileMenu)?.addEventListener("click", openMobileNav);
    $(ids.mobileClose)?.addEventListener("click", closeMobileNav);
    $(ids.mobileOverlay)?.addEventListener("click", closeMobileNav);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileNav();
        search?.blur();
        setActiveHref("");
      }
    });
    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 860px)").matches) closeMobileNav();
    });
  }

  async function init() {
    initSidebarState();
    state.data = await loadData();
    hydrateHero(state.data);
    initCategoryState();
    bindEvents();
    renderNav();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();

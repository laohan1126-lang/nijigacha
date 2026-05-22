(() => {
  const DEFAULT_DATA = {
    version: 1,
    siteTitle: "虎子的小鹿社",
    hero: {
      kicker: "此刻悄然而生的 tokimeki",
      title: "鹿出来了",
      subtitle: "热爱是一切的理由和答案",
      logoSrc: "assets/logo-placeholder.svg",
      mascotSrc: "assets/mascot-placeholder.svg",
    },
    categories: [
      {
        id: "gacha",
        icon: "🎰",
        name: "扭蛋机",
        description: "角色、卡牌、抽取、收藏相关项目",
        defaultOpen: true,
        projects: [
          {
            title: "拉拉人不灭 — LoveLive! 角色扭蛋",
            subtitle: "μ's / Aqours / 虹咲 / Liella! 全角色",
            href: "/lovelive-gacha/",
            status: "online",
            tags: ["LoveLive", "角色", "扭蛋"],
          },
          {
            title: "虹咲学园偶像祭",
            subtitle: "虹咲学园同好会",
            href: "/nijigasaki/",
            status: "online",
            tags: ["虹咲", "同好会", "偶像"],
          },
          {
            title: "GACHA CARD STUDIO V2",
            subtitle: "在线扭蛋卡牌制作工具（独立站）",
            href: "/gacha-card-studio-v2/",
            status: "online",
            tags: ["卡牌", "编辑器", "工具"],
          },
        ],
      },
      {
        id: "travel",
        icon: "🌏",
        name: "旅行与地图",
        description: "路线规划、地图、旅行策略工具",
        defaultOpen: true,
        projects: [
          {
            title: "星空旅游战略地图",
            subtitle: "LLer 专属出行规划工具",
            href: "/travel-map/",
            status: "online",
            tags: ["地图", "旅行", "路线"],
          },
        ],
      },
    ],
  };

  const selectors = {
    shell: "pageShell",
    sidebar: "sidebar",
    nav: "projectNav",
    search: "projectSearch",
    collapse: "collapseButton",
    mobileMenu: "mobileMenuButton",
    mobileOverlay: "mobileOverlay",
    heroLogo: "heroLogo",
    mascot: "mascotImage",
    heroActions: "heroActions",
    previewGrid: "previewGrid",
    activeProjectLink: "activeProjectLink",
    launchHint: "launchHint",
    createButton: "createButton",
  };

  const state = {
    data: DEFAULT_DATA,
    activeHref: "",
    query: "",
    openCategories: new Set(),
  };

  const $ = (id) => document.getElementById(id);

  function safeText(value) {
    return String(value ?? "");
  }

  function normalize(value) {
    return safeText(value).trim().toLowerCase();
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }


  function setProjectListVisibility(list, isOpen) {
    list.hidden = !isOpen;
    list.dataset.open = isOpen ? "true" : "false";
    list.setAttribute("aria-hidden", String(!isOpen));
    // Do not rely on the hidden attribute alone: project-list has display:grid in CSS.
    // Inline display guarantees the visual state follows section.dataset.open.
    list.style.display = isOpen ? "grid" : "none";
  }

  function openMatchingCategoriesForSearch(query) {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return;

    state.data.categories.forEach((category) => {
      const categoryMatches = [category.name, category.description].map(normalize).join(" ").includes(normalizedQuery);
      const projectMatchesQuery = (category.projects || []).some((project) =>
        projectMatches({ ...project, category }, normalizedQuery)
      );
      if (categoryMatches || projectMatchesQuery) {
        state.openCategories.add(category.id);
      }
    });
  }

  async function loadData() {
    try {
      const response = await fetch("assets/projects.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`projects.json ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.categories)) throw new Error("projects.json 缺少 categories");
      return data;
    } catch (error) {
      console.warn("使用内置项目数据：", error);
      return DEFAULT_DATA;
    }
  }

  function hydrateHero(data) {
    document.title = `${data.siteTitle || "虎子的小鹿社"}｜${data.hero?.title || "鹿出来了"}`;

    const kicker = document.querySelector(".hero-kicker");
    const title = document.getElementById("heroTitle");
    const subtitle = document.querySelector(".hero-subtitle");
    if (kicker) kicker.textContent = data.hero?.kicker || "此刻悄然而生的 tokimeki";
    if (title) title.textContent = data.hero?.title || "鹿出来了";
    if (subtitle) subtitle.textContent = data.hero?.subtitle || "热爱是一切的理由和答案";
    if ($(selectors.heroLogo) && data.hero?.logoSrc) $(selectors.heroLogo).src = data.hero.logoSrc;
    if ($(selectors.mascot) && data.hero?.mascotSrc) $(selectors.mascot).src = data.hero.mascotSrc;
  }

  function getAllProjects(data = state.data) {
    return data.categories.flatMap((category) =>
      (category.projects || []).map((project) => ({ ...project, category }))
    );
  }

  function projectMatches(project, query) {
    if (!query) return true;
    const haystack = [
      project.title,
      project.subtitle,
      project.href,
      project.category?.name,
      project.category?.description,
      ...(project.tags || []),
    ]
      .map(normalize)
      .join(" ");
    return haystack.includes(query);
  }

  function setActiveProject(project) {
    state.activeHref = project?.href || "";
    document.querySelectorAll(".project-link").forEach((link) => {
      link.dataset.active = link.getAttribute("href") === state.activeHref ? "true" : "false";
    });

    const launchHint = $(selectors.launchHint);
    const launchLink = $(selectors.activeProjectLink);
    const actions = $(selectors.heroActions);

    if (project) {
      launchHint.textContent = `${project.category.icon || "•"} ${project.title} — ${project.subtitle || "准备出发"}`;
      launchLink.href = project.href || "#";
      launchLink.hidden = false;
      actions.innerHTML = "";
      (project.tags || []).slice(0, 5).forEach((tag) => actions.append(createElement("span", "tag-pill", tag)));
    } else {
      launchHint.textContent = "选择左侧分类，或搜索项目后直接进入。";
      launchLink.hidden = true;
      renderHeroActions();
    }
  }

  function toggleCategory(categoryId) {
    if (state.openCategories.has(categoryId)) {
      state.openCategories.delete(categoryId);
    } else {
      state.openCategories.add(categoryId);
    }
    renderNav();
  }

  function renderNav() {
    const nav = $(selectors.nav);
    nav.innerHTML = "";
    const query = normalize(state.query);
    let renderedProjects = 0;

    state.data.categories.forEach((category) => {
      const matchingProjects = (category.projects || []).filter((project) =>
        projectMatches({ ...project, category }, query)
      );
      const shouldShowCategory = !query || matchingProjects.length > 0 || normalize(category.name).includes(query);
      if (!shouldShowCategory) return;

      const isOpen = state.openCategories.has(category.id);
      const categoryElement = createElement("section", "category");
      categoryElement.dataset.open = isOpen ? "true" : "false";

      const button = createElement("button", "category-button");
      button.type = "button";
      button.setAttribute("aria-expanded", String(isOpen));
      button.title = `${category.name}：${category.description || ""}`;
      button.addEventListener("click", () => toggleCategory(category.id));

      button.append(createElement("span", "category-icon", category.icon || "•"));
      const meta = createElement("span", "category-meta");
      meta.append(createElement("span", "category-name", category.name));
      meta.append(createElement("span", "category-desc", category.description || ""));
      button.append(meta);
      button.append(createElement("span", "category-chevron", "›"));
      categoryElement.append(button);

      const list = createElement("div", "project-list");
      setProjectListVisibility(list, isOpen);

      if (matchingProjects.length === 0) {
        list.append(createElement("div", "empty-note", "这个分类已经预留，后续往 projects.json 填项目即可。"));
      } else {
        matchingProjects.forEach((project) => {
          renderedProjects += 1;
          const link = createElement("a", "project-link");
          link.href = project.href || "#";
          link.dataset.active = project.href === state.activeHref ? "true" : "false";
          link.addEventListener("mouseenter", () => setActiveProject({ ...project, category }));
          link.addEventListener("focus", () => setActiveProject({ ...project, category }));

          const title = createElement("div", "project-title");
          title.append(createElement("span", "", project.title));
          if ((project.status || "online") === "online") {
            const dot = createElement("span", "status-dot");
            dot.setAttribute("aria-label", "在线");
            title.append(dot);
          }
          link.append(title);
          link.append(createElement("div", "project-subtitle", project.subtitle || ""));
          list.append(link);
        });
      }

      categoryElement.append(list);
      nav.append(categoryElement);
    });

    if (query && renderedProjects === 0) {
      nav.append(createElement("div", "no-result", "没有找到匹配项目。可以在 assets/projects.json 新增分类或入口。"));
    }
  }

  function renderHeroActions() {
    const actions = $(selectors.heroActions);
    if (!actions) return;
    actions.innerHTML = "";
    state.data.categories.slice(0, 4).forEach((category) => {
      const pill = createElement("button", "tag-pill", `${category.icon || "•"} ${category.name}`);
      pill.type = "button";
      pill.addEventListener("click", () => {
        state.openCategories.add(category.id);
        renderNav();
        const firstProject = (category.projects || [])[0];
        if (firstProject) setActiveProject({ ...firstProject, category });
      });
      actions.append(pill);
    });
  }

  function renderPreview() {
    const grid = $(selectors.previewGrid);
    if (!grid) return;
    grid.innerHTML = "";
    const projects = getAllProjects().slice(0, 6);
    projects.forEach((project) => {
      const card = createElement("a", "preview-card");
      card.href = project.href || "#";
      card.addEventListener("mouseenter", () => setActiveProject(project));
      card.addEventListener("focus", () => setActiveProject(project));
      const content = createElement("div");
      content.append(createElement("h3", "", project.title));
      content.append(createElement("p", "", project.subtitle || ""));
      const meta = createElement("div", "preview-card-meta");
      [project.category?.name, ...(project.tags || [])].filter(Boolean).slice(0, 4).forEach((tag) => {
        meta.append(createElement("span", "", tag));
      });
      card.append(content, meta);
      grid.append(card);
    });
  }

  function initSidebarState() {
    const shell = $(selectors.shell);
    const saved = localStorage.getItem("tokimeki-sidebar");
    shell.dataset.sidebar = saved === "collapsed" ? "collapsed" : "expanded";
    const collapseButton = $(selectors.collapse);
    if (collapseButton) {
      collapseButton.setAttribute("aria-expanded", String(shell.dataset.sidebar !== "collapsed"));
    }
  }

  function bindEvents() {
    const shell = $(selectors.shell);
    const collapseButton = $(selectors.collapse);
    const search = $(selectors.search);
    const mobileMenu = $(selectors.mobileMenu);
    const mobileOverlay = $(selectors.mobileOverlay);
    const createButton = $(selectors.createButton);

    collapseButton?.addEventListener("click", () => {
      const next = shell.dataset.sidebar === "collapsed" ? "expanded" : "collapsed";
      shell.dataset.sidebar = next;
      collapseButton.setAttribute("aria-expanded", String(next !== "collapsed"));
      localStorage.setItem("tokimeki-sidebar", next);
    });

    search?.addEventListener("input", (event) => {
      state.query = event.target.value;
      openMatchingCategoriesForSearch(state.query);
      renderNav();
    });

    mobileMenu?.addEventListener("click", () => {
      shell.dataset.mobileNav = "open";
      if (mobileOverlay) mobileOverlay.hidden = false;
    });

    mobileOverlay?.addEventListener("click", () => {
      shell.dataset.mobileNav = "closed";
      mobileOverlay.hidden = true;
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        shell.dataset.mobileNav = "closed";
        if (mobileOverlay) mobileOverlay.hidden = true;
        search?.blur();
        setActiveProject(null);
      }
    });

    createButton?.addEventListener("click", () => {
      const target = $(selectors.search);
      target?.focus();
      setActiveProject(null);
    });
  }

  async function init() {
    initSidebarState();
    state.data = await loadData();
    state.data.categories.forEach((category) => {
      if (category.defaultOpen) state.openCategories.add(category.id);
    });
    hydrateHero(state.data);
    bindEvents();
    renderHeroActions();
    renderNav();
    renderPreview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

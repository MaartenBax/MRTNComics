(() => {
  "use strict";

  const data = window.ECHOING_HORIZON_DEVLOGS;
  if (!data || !Array.isArray(data.posts)) return;

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const formatDate = (value) => {
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en", { day: "2-digit", month: "long", year: "numeric" }).format(date);
  };

  const published = [...data.posts]
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const articleUrl = (slug) => `devlog.html?post=${encodeURIComponent(slug)}`;

  const estimateReadingTime = (post) => {
    const text = post.sections.flatMap((section) => section.blocks || []).map((block) => {
      if (block.text) return block.text;
      if (Array.isArray(block.items)) return block.items.join(" ");
      return "";
    }).join(" ");
    return Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 210));
  };

  const updateMeta = (selector, attribute, value) => {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attribute, value);
  };

  const renderOverview = () => {
    const root = document.querySelector("#devlog-overview");
    if (!root) return;

    document.title = data.settings.overviewTitle;

    const cards = published.map((post, index) => `
      <article class="devlog-card">
        ${index === 0 ? `<figure class="devlog-card-media"><img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.coverAlt)}" loading="eager" /></figure>` : ""}
        <div class="devlog-card-copy">
          <div class="devlog-card-meta">
            <span>Devlog ${escapeHtml(post.number)}</span>
            <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
            <span>${escapeHtml(post.build)}</span>
          </div>
          <h2>${escapeHtml(post.title)}</h2>
          <p>${escapeHtml(post.excerpt)}</p>
          <a class="devlog-card-link" href="${articleUrl(post.slug)}" aria-label="Read ${escapeHtml(post.title)}">Read devlog</a>
        </div>
      </article>
    `).join("");

    root.innerHTML = `
      <section class="devlog-hero" id="top">
        <div class="devlog-hero-inner">
          <p class="eh-overline">Echoing Horizon</p>
          <h1>Development log.</h1>
          <p>Notes, experiments and progress from the ongoing development of Echoing Horizon.</p>
        </div>
      </section>
      <section class="devlog-list-section" aria-label="Published development logs">
        <div class="devlog-card-grid">${cards}</div>
      </section>
    `;
  };

  const renderBlock = (block) => {
    switch (block.type) {
      case "paragraph":
        return `<p class="devlog-block devlog-paragraph">${escapeHtml(block.text)}</p>`;
      case "heading":
        return `<h3 class="devlog-block devlog-heading-small">${escapeHtml(block.text)}</h3>`;
      case "image":
        return `<figure class="devlog-block devlog-figure${block.width === "wide" ? " devlog-figure--wide" : ""}">
          <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" loading="lazy" />
          ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}
        </figure>`;
      case "video":
        if (block.src) {
          return `<figure class="devlog-block devlog-video devlog-video--wide">
            <video controls playsinline ${block.poster ? `poster="${escapeHtml(block.poster)}"` : ""}><source src="${escapeHtml(block.src)}" type="video/mp4" /></video>
            ${block.caption ? `<figcaption class="devlog-video-caption">${escapeHtml(block.caption)}</figcaption>` : ""}
          </figure>`;
        }
        return `<figure class="devlog-block devlog-video devlog-video--wide">
          <div class="devlog-video-placeholder">${block.poster ? `<img src="${escapeHtml(block.poster)}" alt="" loading="lazy" />` : ""}<span>Video placeholder</span></div>
          ${block.caption ? `<figcaption class="devlog-video-caption">${escapeHtml(block.caption)}</figcaption>` : ""}
        </figure>`;
      case "gallery":
        return `<div class="devlog-block devlog-gallery">${(block.images || []).map((image) => `<figure><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />${image.caption ? `<figcaption>${escapeHtml(image.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`;
      case "quote":
        return `<blockquote class="devlog-block devlog-quote">${escapeHtml(block.text)}</blockquote>`;
      case "list": {
        const tag = block.ordered ? "ol" : "ul";
        return `<${tag} class="devlog-block devlog-list">${(block.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
      }
      case "callout":
        return `<aside class="devlog-block devlog-callout"><p class="devlog-callout-label">${escapeHtml(block.label || "Note")}</p><h3>${escapeHtml(block.title || "")}</h3><p>${escapeHtml(block.text || "")}</p></aside>`;
      case "comparison":
        return `<figure class="devlog-block devlog-comparison">
          <figure><p class="devlog-comparison-label">${escapeHtml(block.before.label || "Before")}</p><img src="${escapeHtml(block.before.image)}" alt="${escapeHtml(block.before.alt)}" loading="lazy" /></figure>
          <figure><p class="devlog-comparison-label">${escapeHtml(block.after.label || "After")}</p><img src="${escapeHtml(block.after.image)}" alt="${escapeHtml(block.after.alt)}" loading="lazy" /></figure>
          ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}
        </figure>`;
      case "divider":
        return `<hr class="devlog-block" />`;
      default:
        return "";
    }
  };

  const renderArticle = () => {
    const root = document.querySelector("#devlog-article");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("post") || published[0]?.slug;
    const postIndex = published.findIndex((post) => post.slug === slug);
    const post = published[postIndex];

    if (!post) {
      root.innerHTML = `<section class="devlog-empty"><h1>Devlog not found.</h1><p>The requested development update does not exist.</p><a class="eh-button eh-button--primary" href="./">Back to devlogs <span>↗</span></a></section>`;
      return;
    }

    const readingTime = estimateReadingTime(post);
    const canonical = `${data.settings.siteUrl}devlog.html?post=${encodeURIComponent(post.slug)}`;
    document.title = `${post.title} | Echoing Horizon Devlog`;
    updateMeta('meta[name="description"]', "content", post.seoDescription || post.excerpt);
    updateMeta('meta[property="og:title"]', "content", `${post.title} | Echoing Horizon Devlog`);
    updateMeta('meta[property="og:description"]', "content", post.seoDescription || post.excerpt);
    updateMeta('meta[property="og:image"]', "content", post.cover);
    updateMeta('meta[property="article:published_time"]', "content", post.date);
    updateMeta('link[rel="canonical"]', "href", canonical);

    const navSections = post.sections.filter((section) => section.showInNavigation !== false);
    const toc = navSections.map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.navLabel || section.title)}</a>`).join("");
    const mobileOptions = navSections.map((section) => `<option value="#${escapeHtml(section.id)}">${escapeHtml(section.navLabel || section.title)}</option>`).join("");
    const articleSections = post.sections.map((section) => `<section class="devlog-section" id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.title)}</h2>${(section.blocks || []).map(renderBlock).join("")}</section>`).join("");
    const tags = (post.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");

    const previous = published[postIndex + 1];
    const next = published[postIndex - 1];
    const navCards = [
      previous ? `<a href="${articleUrl(previous.slug)}"><span>Previous devlog</span><strong>${escapeHtml(previous.title)}</strong></a>` : "",
      next ? `<a href="${articleUrl(next.slug)}"><span>Next devlog</span><strong>${escapeHtml(next.title)}</strong></a>` : ""
    ].filter(Boolean).join("");

    root.innerHTML = `
      <article id="top">
        <header class="devlog-article-head">
          <div class="devlog-article-head-inner">
            <a class="devlog-back" href="./">← Back to development log</a>
            <div class="devlog-article-meta">
              <span>Devlog ${escapeHtml(post.number)}</span>
              <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
              <span>${readingTime} min read</span>
              <span>${escapeHtml(post.build)}</span>
            </div>
            <h1>${escapeHtml(post.title)}</h1>
            <p class="devlog-article-intro">${escapeHtml(post.excerpt)}</p>
            <div class="devlog-tags">${tags}</div>
            <figure class="devlog-cover"><img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.coverAlt)}" fetchpriority="high" /></figure>
          </div>
        </header>

        <div class="devlog-article-layout${navSections.length ? "" : " devlog-article-layout--no-toc"}">
          ${navSections.length > 0 ? `<aside class="devlog-toc"><p class="devlog-toc-label">In this devlog</p><nav aria-label="Article sections">${toc}</nav></aside>` : ""}
          <div class="devlog-article-body">
            ${navSections.length > 0 ? `<div class="devlog-mobile-jump"><label for="devlog-jump">Jump to section</label><select id="devlog-jump"><option value="">Choose a section</option>${mobileOptions}</select></div>` : ""}
            ${articleSections}
          </div>
        </div>

        ${navCards ? `<nav class="devlog-post-nav" aria-label="More development logs"><div class="devlog-post-nav-inner">${navCards}</div></nav>` : ""}
      </article>
    `;

    const select = root.querySelector("#devlog-jump");
    if (select) {
      select.addEventListener("change", () => {
        if (select.value) document.querySelector(select.value)?.scrollIntoView({ behavior: "smooth" });
      });
    }

    const links = [...root.querySelectorAll(".devlog-toc a")];
    const observedSections = navSections.map((section) => document.getElementById(section.id)).filter(Boolean);
    if (links.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
      }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] });
      observedSections.forEach((section) => observer.observe(section));
    }
  };

  renderOverview();
  renderArticle();
})();

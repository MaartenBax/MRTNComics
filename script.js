const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

(function renderAboutPage() {
  "use strict";

  const data = window.ABOUT_PAGE_DATA;
  if (!data || !document.body.classList.contains("about-body")) return;

  const interaction = {
    openLabel: "Explore",
    closeLabel: "Close",
    oneOpenAtATime: true,
    updateUrlHash: true,
    ...(data.interaction || {})
  };

  const setText = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element && typeof value === "string") element.textContent = value;
  };

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  };

  const safeHref = (href, fallback = "#") => {
    return typeof href === "string" && href.trim() ? href.trim() : fallback;
  };

  const makeImage = ({ src, alt = "", className = "", fit = "cover" } = {}) => {
    const image = createElement("img", className);
    image.src = safeHref(src, "");
    image.alt = alt;
    image.loading = "lazy";
    image.decoding = "async";
    image.dataset.fit = fit;
    image.addEventListener("error", () => {
      image.closest(".about-chapter-visual, .about-expanded-image, .about-expanded-gallery-item")?.classList.add("is-missing");
    });
    return image;
  };

  const applyMeta = () => {
    if (!data.meta) return;
    if (data.meta.title) document.title = data.meta.title;

    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');

    if (description && data.meta.description) description.content = data.meta.description;
    if (ogTitle && data.meta.title) ogTitle.content = data.meta.title;
    if (ogDescription && data.meta.description) ogDescription.content = data.meta.description;
  };

  const renderHero = () => {
    if (!data.hero) return;
    setText("[data-about-hero-eyebrow]", data.hero.eyebrow);
    setText("[data-about-hero-title]", data.hero.title);
    setText("[data-about-hero-intro]", data.hero.intro);

    const heroImage = document.querySelector("[data-about-hero-image]");
    if (heroImage && data.hero.image) {
      heroImage.src = data.hero.image;
      heroImage.addEventListener("error", () => heroImage.closest(".about-hero-visual")?.classList.add("is-missing"));
    }
  };

  const createProjectSymbol = (mark) => {
    const symbol = createElement("span", `about-project-symbol about-project-symbol--${mark || "default"}`);
    symbol.setAttribute("aria-hidden", "true");

    if (mark === "eh") symbol.appendChild(document.createElement("i"));
    if (mark === "mrtn") symbol.textContent = "M";

    return symbol;
  };

  const renderCollapsedVisual = (visual = {}) => {
    const wrapper = createElement("span", "about-chapter-visual");

    switch (visual.type) {
      case "brand": {
        wrapper.classList.add("about-brand-visual");
        wrapper.append(
          makeImage({ src: visual.image, alt: visual.imageAlt || "", fit: "contain" }),
          createElement("span", "about-image-fallback", visual.imageAlt || "R3DMYST")
        );
        break;
      }

      case "projects": {
        wrapper.classList.add("about-projects-visual");
        const projects = Array.isArray(visual.projects) ? visual.projects : [];
        projects.forEach((project) => {
          const item = createElement("span", "about-project-mark");
          item.append(createProjectSymbol(project.mark), createElement("span", "about-project-mark-title", project.title || "Project"));
          wrapper.append(item);
        });
        break;
      }

      case "contact": {
        wrapper.classList.add("about-contact-visual");
        wrapper.append(makeImage({ src: visual.image, alt: visual.imageAlt || "" }));
        const label = createElement("span", "button button-secondary about-contact-button", visual.buttonLabel || "Open contact");
        wrapper.append(label);
        break;
      }

      case "image":
      default: {
        wrapper.classList.add("about-image-visual");
        wrapper.append(
          makeImage({ src: visual.image, alt: visual.imageAlt || "" }),
          createElement("span", "about-image-fallback", visual.imageAlt || "Image")
        );
      }
    }

    return wrapper;
  };

  const getBlockSpanClass = (span) => {
    const allowed = new Set(["full", "wide", "half", "third"]);
    return allowed.has(span) ? `about-expanded-block--${span}` : "about-expanded-block--wide";
  };

  const renderHeadingBlock = (block) => {
    const wrapper = createElement("section", "about-expanded-heading");
    if (block.eyebrow) wrapper.append(createElement("p", "about-expanded-eyebrow", block.eyebrow));
    wrapper.append(createElement("h3", "", block.text || "Heading"));
    return wrapper;
  };

  const renderParagraphBlock = (block) => {
    const wrapper = createElement("div", "about-expanded-copy");
    const paragraphs = Array.isArray(block.paragraphs) ? block.paragraphs : [block.text];
    paragraphs.filter((paragraph) => typeof paragraph === "string" && paragraph.trim()).forEach((paragraph) => {
      wrapper.append(createElement("p", "", paragraph));
    });
    return wrapper;
  };

  const renderImageBlock = (block) => {
    const figure = createElement("figure", "about-expanded-image");
    figure.append(makeImage({ src: block.src, alt: block.alt || "", fit: block.fit || "cover" }));
    if (block.caption) figure.append(createElement("figcaption", "", block.caption));
    return figure;
  };

  const renderGalleryBlock = (block) => {
    const gallery = createElement("div", "about-expanded-gallery");
    const images = Array.isArray(block.images) ? block.images : [];
    images.forEach((item) => {
      const figure = createElement("figure", "about-expanded-gallery-item");
      figure.append(makeImage({ src: item.src, alt: item.alt || "", fit: item.fit || "cover" }));
      if (item.caption) figure.append(createElement("figcaption", "", item.caption));
      gallery.append(figure);
    });
    return gallery;
  };

  const renderQuoteBlock = (block) => {
    const quote = createElement("blockquote", "about-expanded-quote");
    quote.append(createElement("p", "", block.text || ""));
    if (block.attribution) quote.append(createElement("cite", "", block.attribution));
    return quote;
  };

  const renderListBlock = (block) => {
    const wrapper = createElement("section", "about-expanded-list");
    if (block.title) wrapper.append(createElement("h4", "", block.title));
    const list = createElement(block.ordered ? "ol" : "ul");
    (Array.isArray(block.items) ? block.items : []).forEach((item) => list.append(createElement("li", "", item)));
    wrapper.append(list);
    return wrapper;
  };

  const renderButtonsBlock = (block) => {
    const wrapper = createElement("div", "about-expanded-buttons");
    (Array.isArray(block.items) ? block.items : []).forEach((item, index) => {
      const link = createElement("a", `button ${index === 0 ? "button-primary" : "button-secondary"}`, item.label || "Open");
      link.href = safeHref(item.href);
      if (item.newTab) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }
      wrapper.append(link);
    });
    return wrapper;
  };

  const renderProjectsBlock = (block) => {
    const grid = createElement("div", "about-expanded-projects");
    (Array.isArray(block.items) ? block.items : []).forEach((item) => {
      const card = createElement("a", "about-expanded-project");
      card.href = safeHref(item.href);
      card.append(
        createElement("span", "about-expanded-project-number", item.number || ""),
        createElement("h4", "", item.title || "Project"),
        createElement("p", "", item.description || ""),
        createElement("span", "about-expanded-project-link", `${item.linkLabel || "Explore"} →`)
      );
      grid.append(card);
    });
    return grid;
  };

  const renderSocialsBlock = (block) => {
    const wrapper = createElement("section", "about-expanded-socials");
    if (block.eyebrow) wrapper.append(createElement("p", "about-expanded-eyebrow", block.eyebrow));
    if (block.title) wrapper.append(createElement("h3", "", block.title));
    const links = createElement("div", "about-social-links");
    (Array.isArray(block.links) ? block.links : []).forEach((item) => {
      const link = createElement("a", "about-social-link");
      link.href = safeHref(item.href);
      if (item.newTab) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }
      link.append(createElement("span", "", item.label || "Link"), createElement("span", "", "↗"));
      links.append(link);
    });
    wrapper.append(links);
    return wrapper;
  };

  const renderContactFormBlock = (block, sectionId) => {
    const wrapper = createElement("section", "about-expanded-form-wrap");
    if (block.eyebrow) wrapper.append(createElement("p", "about-expanded-eyebrow", block.eyebrow));
    if (block.title) wrapper.append(createElement("h3", "", block.title));

    const form = createElement("form", "about-contact-form");
    form.action = typeof block.action === "string" ? block.action : "";
    form.method = block.method || "POST";
    form.dataset.successMessage = block.successMessage || "Thanks — your message has been sent.";
    form.dataset.unconfiguredMessage = block.unconfiguredMessage || "Add a form endpoint to enable sending.";

    (Array.isArray(block.fields) ? block.fields : []).forEach((field, index) => {
      const fieldWrapper = createElement("label", `about-form-field ${field.type === "textarea" ? "about-form-field--message" : ""}`);
      const fieldId = `${sectionId}-${field.name || `field-${index}`}`;
      const labelText = createElement("span", "", field.label || field.name || "Field");
      let input;

      if (field.type === "textarea") {
        input = document.createElement("textarea");
        input.rows = Number(field.rows) || 5;
      } else {
        input = document.createElement("input");
        input.type = field.type || "text";
      }

      input.id = fieldId;
      input.name = field.name || `field-${index}`;
      input.required = Boolean(field.required);
      if (field.autocomplete) input.autocomplete = field.autocomplete;
      if (field.placeholder) input.placeholder = field.placeholder;

      fieldWrapper.htmlFor = fieldId;
      fieldWrapper.append(labelText, input);
      form.append(fieldWrapper);
    });

    const submit = createElement("button", "button button-primary about-form-submit", block.submitLabel || "Send message");
    submit.type = "submit";
    const status = createElement("p", "about-form-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.append(submit, status);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const endpoint = form.getAttribute("action")?.trim();

      if (!endpoint) {
        status.textContent = form.dataset.unconfiguredMessage;
        return;
      }

      submit.disabled = true;
      status.textContent = "Sending…";

      try {
        const response = await fetch(endpoint, {
          method: form.method,
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error(`Form request failed with ${response.status}`);
        form.reset();
        status.textContent = form.dataset.successMessage;
      } catch (error) {
        console.error(error);
        status.textContent = "Something went wrong. Please try again or use one of the direct contact links.";
      } finally {
        submit.disabled = false;
      }
    });

    wrapper.append(form);
    return wrapper;
  };

  const renderBlock = (block, sectionId) => {
    if (!block || typeof block !== "object") return null;

    const outer = createElement("div", `about-expanded-block ${getBlockSpanClass(block.span)}`);
    let content;

    switch (block.type) {
      case "heading": content = renderHeadingBlock(block); break;
      case "paragraph": content = renderParagraphBlock(block); break;
      case "image": content = renderImageBlock(block); break;
      case "gallery": content = renderGalleryBlock(block); break;
      case "quote": content = renderQuoteBlock(block); break;
      case "list": content = renderListBlock(block); break;
      case "buttons": content = renderButtonsBlock(block); break;
      case "projects": content = renderProjectsBlock(block); break;
      case "socials": content = renderSocialsBlock(block); break;
      case "contactForm": content = renderContactFormBlock(block, sectionId); break;
      case "divider": content = createElement("hr", "about-expanded-divider"); break;
      default: content = renderParagraphBlock({ text: `Unsupported block type: ${block.type || "unknown"}` });
    }

    outer.append(content);
    return outer;
  };

  const renderSection = (section) => {
    const article = createElement("article", "about-chapter");
    article.dataset.sectionId = section.id;
    article.id = section.id;

    const toggleId = `about-toggle-${section.id}`;
    const panelId = `about-panel-${section.id}`;

    const toggle = createElement("button", "about-chapter-toggle");
    toggle.type = "button";
    toggle.id = toggleId;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", panelId);

    const number = createElement("span", "about-chapter-number");
    number.setAttribute("aria-hidden", "true");
    number.append(createElement("span", "", section.number || ""), document.createElement("i"));

    const copy = createElement("span", "about-chapter-copy");
    copy.append(
      createElement("span", "about-chapter-label", section.label || ""),
      createElement("span", "about-chapter-title", section.title || ""),
      createElement("span", "about-chapter-text", section.text || "")
    );

    const visual = renderCollapsedVisual(section.visual || {});
    const action = createElement("span", "about-chapter-action");
    action.append(
      createElement("span", "about-chapter-action-label", interaction.openLabel),
      createElement("span", "about-chapter-action-icon", "+")
    );
    visual.append(action);

    toggle.append(number, copy, visual);

    const expanded = createElement("div", "about-chapter-expanded");
    expanded.id = panelId;
    expanded.setAttribute("role", "region");
    expanded.setAttribute("aria-labelledby", toggleId);
    expanded.setAttribute("aria-hidden", "true");
    expanded.setAttribute("inert", "");
    if (section.expanded?.ariaLabel) expanded.setAttribute("aria-label", section.expanded.ariaLabel);

    const expandedInner = createElement("div", "about-chapter-expanded-inner");
    const blocks = Array.isArray(section.expanded?.blocks) ? section.expanded.blocks : [];
    blocks.forEach((block) => {
      const rendered = renderBlock(block, section.id);
      if (rendered) expandedInner.append(rendered);
    });
    expanded.append(expandedInner);

    article.append(toggle, expanded);
    return article;
  };

  const renderSections = () => {
    const mount = document.querySelector("[data-about-sections]");
    if (!mount || !Array.isArray(data.sections)) return;
    mount.replaceChildren(...data.sections.map(renderSection));
  };

  const renderApproach = () => {
    if (!data.approach) return;
    const approach = document.querySelector(".about-approach");
    if (!approach) return;

    setText(".about-approach-index span", data.approach.number, approach);
    setText("[data-approach-label]", data.approach.label, approach);

    const title = approach.querySelector("[data-approach-title]");
    if (title && Array.isArray(data.approach.titleLines)) {
      title.replaceChildren();
      data.approach.titleLines.forEach((line, index) => {
        title.append(document.createTextNode(line));
        if (index < data.approach.titleLines.length - 1) title.append(document.createElement("br"));
      });
      title.append(createElement("span", "", "."));
    }

    const principles = approach.querySelector("[data-approach-principles]");
    if (principles && Array.isArray(data.approach.principles)) {
      principles.replaceChildren(...data.approach.principles.map((principle) => createElement("p", "", principle)));
    }
  };

  const getSectionFromHash = () => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) return null;
    return document.querySelector(`.about-chapter[data-section-id="${CSS.escape(id)}"]`);
  };

  const isMobileAccordion = () => window.matchMedia("(max-width: 620px)").matches;

  const getCssPixelValue = (element, property, fallback = 0) => {
    const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(property));
    return Number.isFinite(value) ? value : fallback;
  };

  const sizeExpandedSection = (article) => {
    if (!article?.classList.contains("is-expanded")) return;

    if (isMobileAccordion()) {
      article.style.height = "auto";
      return;
    }

    const inner = article.querySelector(".about-chapter-expanded-inner");
    const rowHeight = getCssPixelValue(document.body, "--about-row-height", 340);
    const minimumHeight = getCssPixelValue(document.body, "--about-expanded-min-height", 1200);
    const contentHeight = inner ? inner.scrollHeight : 0;
    const targetHeight = Math.max(minimumHeight, rowHeight + contentHeight);

    article.style.height = `${Math.ceil(targetHeight)}px`;
  };

  const setSectionState = (article, open, options = {}) => {
    if (!article) return;
    const toggle = article.querySelector(".about-chapter-toggle");
    const panel = article.querySelector(".about-chapter-expanded");
    const label = article.querySelector(".about-chapter-action-label");
    const icon = article.querySelector(".about-chapter-action-icon");
    if (!toggle || !panel) return;

    if (!isMobileAccordion()) {
      const currentHeight = article.getBoundingClientRect().height;
      article.style.height = `${Math.ceil(currentHeight)}px`;
    }

    article.classList.toggle("is-expanded", open);
    toggle.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));

    if (open) panel.removeAttribute("inert");
    else panel.setAttribute("inert", "");

    if (label) label.textContent = open ? interaction.closeLabel : interaction.openLabel;
    if (icon) icon.textContent = open ? "−" : "+";

    if (isMobileAccordion()) {
      article.style.height = "auto";
    } else if (open) {
      requestAnimationFrame(() => sizeExpandedSection(article));
    } else {
      const rowHeight = getCssPixelValue(document.body, "--about-row-height", 340);
      requestAnimationFrame(() => {
        article.style.height = `${Math.ceil(rowHeight)}px`;
      });
    }

    if (options.updateHash && interaction.updateUrlHash) {
      const id = article.dataset.sectionId;
      if (open && id) history.replaceState(null, "", `#${encodeURIComponent(id)}`);
      else if (window.location.hash === `#${encodeURIComponent(id)}` || decodeURIComponent(window.location.hash.slice(1)) === id) {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
    }
  };

  const closeOtherSections = (current) => {
    if (!interaction.oneOpenAtATime) return;
    document.querySelectorAll(".about-chapter.is-expanded").forEach((article) => {
      if (article !== current) setSectionState(article, false);
    });
  };

  const setupAccordion = () => {
    document.querySelectorAll(".about-chapter").forEach((article) => {
      const toggle = article.querySelector(".about-chapter-toggle");
      if (!toggle) return;

      toggle.addEventListener("click", () => {
        const willOpen = !article.classList.contains("is-expanded");
        if (willOpen) closeOtherSections(article);
        setSectionState(article, willOpen, { updateHash: true });
      });
    });

    const initial = getSectionFromHash();
    if (initial) {
      setSectionState(initial, true);
      requestAnimationFrame(() => initial.scrollIntoView({ block: "start" }));
    }

    window.addEventListener("hashchange", () => {
      const target = getSectionFromHash();
      if (!target) return;
      closeOtherSections(target);
      setSectionState(target, true);
    });

    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        document.querySelectorAll(".about-chapter").forEach((article) => {
          if (article.classList.contains("is-expanded")) sizeExpandedSection(article);
          else if (isMobileAccordion()) article.style.height = "auto";
          else {
            const rowHeight = getCssPixelValue(document.body, "--about-row-height", 340);
            article.style.height = `${Math.ceil(rowHeight)}px`;
          }
        });
      });
    });
  };

  applyMeta();
  renderHero();
  renderSections();
  renderApproach();
  setupAccordion();
})();

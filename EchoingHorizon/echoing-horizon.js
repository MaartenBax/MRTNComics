(() => {
  "use strict";

  const data = window.ECHOING_HORIZON_DATA;
  const root = document.querySelector("#eh-content");

  if (!data || !root) {
    console.error("Echoing Horizon data or content root is missing.");
    return;
  }

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const safeUrl = (value = "") => {
    const url = String(value).trim();
    if (!url || /^javascript:/i.test(url)) return "#";
    return url;
  };

  const cta = (item, variant = "primary") => {
    if (!item) return "";
    const url = safeUrl(item.url);
    const disabled = url === "#";
    return `
      <a class="eh-button eh-button--${variant}${disabled ? " is-placeholder" : ""}"
         href="${escapeHtml(url)}"
         ${disabled ? 'aria-disabled="true" data-placeholder-link' : ""}>
        <span>${escapeHtml(item.label)}</span>
        <span aria-hidden="true">${variant === "primary" ? "↗" : "▶"}</span>
      </a>`;
  };

  const formatDate = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  };

  const features = data.features
    .map(
      (feature) => `
        <article class="eh-feature-card">
          <span class="eh-feature-number">${escapeHtml(feature.number)}</span>
          <h3>${escapeHtml(feature.title)}</h3>
          <p>${escapeHtml(feature.text)}</p>
        </article>`
    )
    .join("");

  const showcase = data.showcase
    .map(
      (item) => `
        <article class="eh-showcase-row eh-showcase-row--${escapeHtml(item.alignment)}">
          <figure class="eh-showcase-media">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt)}" loading="lazy" />
          </figure>
          <div class="eh-showcase-copy">
            <p class="eh-overline">${escapeHtml(item.label)}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </div>
        </article>`
    )
    .join("");

  const screenshots = data.screenshots.items
    .map(
      (image, index) => `
        <button class="eh-shot${index === 0 ? " eh-shot--wide" : ""}" type="button" data-gallery-index="${index}" aria-label="Open screenshot ${index + 1}">
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />
          <span aria-hidden="true">View</span>
        </button>`
    )
    .join("");

  const posts = data.devlogs.posts
    .map(
      (post) => `
        <article class="eh-devlog-card">
          <div class="eh-devlog-meta">
            <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
            <span>${escapeHtml(post.category)}</span>
          </div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.excerpt)}</p>
          <a href="${escapeHtml(safeUrl(post.url))}" ${safeUrl(post.url) === "#" ? 'aria-disabled="true" data-placeholder-link' : ""}>
            Read update <span aria-hidden="true">↗</span>
          </a>
        </article>`
    )
    .join("");

  const projectDetails = Object.entries(data.project)
    .map(
      ([key, value]) => `
        <div>
          <dt>${escapeHtml(key)}</dt>
          <dd>${escapeHtml(value)}</dd>
        </div>`
    )
    .join("");

  const socials = data.socials
    .map(
      (social) => `
        <a href="${escapeHtml(safeUrl(social.url))}" ${safeUrl(social.url) === "#" ? 'aria-disabled="true" data-placeholder-link' : ""}>
          ${escapeHtml(social.label)} <span aria-hidden="true">↗</span>
        </a>`
    )
    .join("");

  root.innerHTML = `
    <section class="eh-hero" id="top" aria-labelledby="eh-hero-title">
      <img class="eh-hero-image" src="${escapeHtml(data.hero.background)}" alt="" fetchpriority="high" />
      <div class="eh-hero-overlay"></div>
      <div class="eh-hero-inner">
        <p class="eh-overline">${escapeHtml(data.hero.eyebrow)}</p>
        <h1 id="eh-hero-title" class="eh-visually-hidden">Echoing Horizon</h1>
        <img class="eh-hero-logo" src="${escapeHtml(data.hero.logo)}" alt="Echoing Horizon" />
        <p class="eh-hero-description">${escapeHtml(data.hero.description)}</p>
        <div class="eh-hero-actions">
          ${cta(data.hero.primaryCta, "primary")}
          ${cta(data.hero.secondaryCta, "secondary")}
        </div>
        <p class="eh-platform">${escapeHtml(data.hero.platform)}</p>
      </div>
      <a class="eh-scroll-cue" href="#about" aria-label="Scroll to game overview">
        <span>Discover</span><span aria-hidden="true">↓</span>
      </a>
    </section>

    <section class="eh-section eh-story" id="about">
      <div class="eh-story-copy">
        <p class="eh-overline">${escapeHtml(data.synopsis.label)}</p>
        <h2>${escapeHtml(data.synopsis.title)}</h2>
        <p>${escapeHtml(data.synopsis.text)}</p>
      </div>
      <figure class="eh-story-media">
        <img src="${escapeHtml(data.synopsis.image)}" alt="${escapeHtml(data.synopsis.imageAlt)}" loading="lazy" />
      </figure>
    </section>

    <section class="eh-section eh-features" id="philosophy" aria-labelledby="features-title">
      <div class="eh-section-header">
        <p class="eh-overline">How it plays</p>
        <h2 id="features-title">Designed around curiosity.</h2>
      </div>
      <div class="eh-feature-grid">${features}</div>
    </section>

    <section class="eh-showcase" aria-label="Gameplay highlights">
      ${showcase}
    </section>

    <section class="eh-section eh-screenshots" id="gallery" aria-labelledby="screenshots-title">
      <div class="eh-section-header eh-section-header--split">
        <div>
          <p class="eh-overline">${escapeHtml(data.screenshots.label)}</p>
          <h2 id="screenshots-title">${escapeHtml(data.screenshots.title)}</h2>
        </div>
        <p>Selected work-in-progress images. Click any image to view it larger.</p>
      </div>
      <div class="eh-screenshot-grid">${screenshots}</div>
    </section>

    <section class="eh-section eh-trailer" id="trailer" aria-labelledby="trailer-title">
      <div class="eh-trailer-copy">
        <p class="eh-overline">${escapeHtml(data.trailer.label)}</p>
        <h2 id="trailer-title">${escapeHtml(data.trailer.title)}</h2>
        <p>${escapeHtml(data.trailer.text)}</p>
      </div>
      <button class="eh-trailer-poster" type="button" ${data.trailer.videoUrl ? "data-open-trailer" : 'aria-disabled="true"'}>
        <img src="${escapeHtml(data.trailer.poster)}" alt="Echoing Horizon trailer poster" loading="lazy" />
        <span class="eh-play-button" aria-hidden="true">▶</span>
        <span class="eh-trailer-status">${data.trailer.videoUrl ? "Play trailer" : "Trailer coming soon"}</span>
      </button>
    </section>

    <section class="eh-section eh-development" id="development" aria-labelledby="devlogs-title">
      <div class="eh-section-header eh-section-header--split">
        <div>
          <p class="eh-overline">${escapeHtml(data.devlogs.label)}</p>
          <h2 id="devlogs-title">${escapeHtml(data.devlogs.title)}</h2>
        </div>
        <p>${escapeHtml(data.devlogs.intro)}</p>
      </div>
      <div class="eh-devlog-grid">${posts}</div>
      <dl class="eh-project-details">${projectDetails}</dl>
    </section>

    <section class="eh-wishlist" id="wishlist" aria-labelledby="wishlist-title">
      <div class="eh-wishlist-backdrop" aria-hidden="true"></div>
      <div class="eh-wishlist-inner">
        <p class="eh-overline">${escapeHtml(data.wishlist.label)}</p>
        <h2 id="wishlist-title">${escapeHtml(data.wishlist.title)}</h2>
        <p>${escapeHtml(data.wishlist.text)}</p>
        <div class="eh-hero-actions">
          ${cta(data.wishlist.primaryCta, "primary")}
          ${cta(data.wishlist.secondaryCta, "secondary")}
        </div>
        <div class="eh-socials" aria-label="Echoing Horizon social links">${socials}</div>
      </div>
    </section>

    <dialog class="eh-lightbox" aria-label="Screenshot viewer">
      <button class="eh-lightbox-close" type="button" aria-label="Close screenshot viewer">×</button>
      <button class="eh-lightbox-nav eh-lightbox-prev" type="button" aria-label="Previous screenshot">←</button>
      <figure>
        <img src="" alt="" />
        <figcaption></figcaption>
      </figure>
      <button class="eh-lightbox-nav eh-lightbox-next" type="button" aria-label="Next screenshot">→</button>
    </dialog>

    <dialog class="eh-trailer-dialog" aria-label="Echoing Horizon trailer">
      <button class="eh-lightbox-close" type="button" aria-label="Close trailer">×</button>
      <video controls playsinline></video>
    </dialog>
  `;

  const placeholderLinks = root.querySelectorAll("[data-placeholder-link]");
  placeholderLinks.forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
    link.title = "Add the final URL in data/echoing-horizon-data.js";
  });

  const lightbox = root.querySelector(".eh-lightbox");
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("figcaption");
  let activeIndex = 0;

  const showScreenshot = (index) => {
    const images = data.screenshots.items;
    activeIndex = (index + images.length) % images.length;
    const image = images[activeIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt;
  };

  root.querySelectorAll("[data-gallery-index]").forEach((button) => {
    button.addEventListener("click", () => {
      showScreenshot(Number(button.dataset.galleryIndex));
      lightbox.showModal();
    });
  });

  lightbox.querySelector(".eh-lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".eh-lightbox-prev").addEventListener("click", () => showScreenshot(activeIndex - 1));
  lightbox.querySelector(".eh-lightbox-next").addEventListener("click", () => showScreenshot(activeIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  const trailerButton = root.querySelector("[data-open-trailer]");
  if (trailerButton && data.trailer.videoUrl) {
    const trailerDialog = root.querySelector(".eh-trailer-dialog");
    const video = trailerDialog.querySelector("video");
    trailerButton.addEventListener("click", () => {
      video.src = data.trailer.videoUrl;
      trailerDialog.showModal();
      video.play().catch(() => {});
    });
    trailerDialog.querySelector(".eh-lightbox-close").addEventListener("click", () => trailerDialog.close());
    trailerDialog.addEventListener("close", () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) return;
    if (event.key === "ArrowLeft") showScreenshot(activeIndex - 1);
    if (event.key === "ArrowRight") showScreenshot(activeIndex + 1);
  });
})();

(() => {
  "use strict";

  if (!Array.isArray(window.VISUALS) && typeof VISUALS === "undefined") {
    console.error("Visuals data could not be loaded.");
    return;
  }

  const items = Array.isArray(window.VISUALS) ? window.VISUALS : VISUALS;

  const grid = document.querySelector(".visual-grid");
  const filtersContainer = document.getElementById("filters");
  const workCount = document.getElementById("workCount");

  const lightbox = document.getElementById("lightbox");
  const closeButton = document.getElementById("lightboxClose");
  const previousButton = document.getElementById("lightboxPrev");
  const nextButton = document.getElementById("lightboxNext");
  const lightboxImage = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxType = document.getElementById("lightboxType");
  const lightboxYear = document.getElementById("lightboxYear");
  const lightboxTools = document.getElementById("lightboxTools");
  const lightboxCounter = document.getElementById("lightboxCounter");

  let activeFilter = "all";
  let activeIndex = 0;
  let lastFocusedCard = null;

  const categoryLabels = {
    "3d": "3D",
    design: "Design",
    motion: "Motion",
  };

  function getFilteredItems() {
    return activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);
  }

  function updateWorkCount() {
    const count = getFilteredItems().length;
    workCount.textContent = `${count} selected ${count === 1 ? "work" : "works"}`;
  }

  function buildFilters() {
    const categories = [...new Set(items.map((item) => item.category).filter(Boolean))];

    filtersContainer.innerHTML = "";

    const allButton = createFilterButton("all", "All");
    allButton.classList.add("active");
    filtersContainer.appendChild(allButton);

    categories.forEach((category) => {
      const label = categoryLabels[category] || category;
      filtersContainer.appendChild(createFilterButton(category, label));
    });
  }

  function createFilterButton(filter, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.dataset.filter = filter;
    button.textContent = label;

    button.addEventListener("click", () => {
      activeFilter = filter;

      document.querySelectorAll(".filter-button").forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      renderGallery();
    });

    return button;
  }

  function renderGallery() {
    grid.innerHTML = "";

    const visibleItems = getFilteredItems();

    visibleItems.forEach((item, index) => {
      grid.appendChild(createCard(item, index));
    });

    updateWorkCount();
  }

  function createCard(item, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "visual-card";

    if (item.size === "wide") {
      button.classList.add("visual-card--wide");
    } else if (item.size === "tall") {
      button.classList.add("visual-card--tall");
    }

    button.setAttribute("aria-label", `Open ${item.title}`);

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.alt || item.title;
    image.loading = "lazy";

    const caption = document.createElement("span");
    const title = document.createElement("strong");
    const type = document.createElement("small");

    title.textContent = item.title;
    type.textContent = item.type;

    caption.append(title, type);
    button.append(image, caption);

    button.addEventListener("click", () => {
      lastFocusedCard = button;
      openLightbox(index);
    });

    return button;
  }

  function showItem(index) {
    const visibleItems = getFilteredItems();
    if (!visibleItems.length) return;

    activeIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[activeIndex];

    lightboxImage.src = item.image;
    lightboxImage.alt = item.alt || item.title;
    lightboxTitle.textContent = item.title;
    lightboxType.textContent = item.type;
    lightboxYear.textContent = item.year;
    lightboxTools.textContent = Array.isArray(item.tools)
      ? item.tools.join(" · ")
      : String(item.tools || "");
    lightboxCounter.textContent = `${activeIndex + 1} / ${visibleItems.length}`;
  }

  function openLightbox(index) {
    showItem(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (lastFocusedCard) {
      lastFocusedCard.focus();
    }
  }

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showItem(activeIndex - 1));
  nextButton.addEventListener("click", () => showItem(activeIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showItem(activeIndex - 1);
    if (event.key === "ArrowRight") showItem(activeIndex + 1);
  });

  buildFilters();
  renderGallery();
})();

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

  const player = document.getElementById("videoPlayer");
  const video = document.getElementById("lightboxVideo");
  const centerButton = document.getElementById("videoCenterButton");
  const playButton = document.getElementById("videoPlay");
  const muteButton = document.getElementById("videoMute");
  const fullscreenButton = document.getElementById("videoFullscreen");
  const timeline = document.getElementById("videoTimeline");
  const timeLabel = document.getElementById("videoTime");

  let activeFilter = "all";
  let activeIndex = 0;
  let lastFocusedCard = null;
  let controlsTimer = null;
  let isScrubbing = false;

  const categoryLabels = { "3d": "3D", design: "Design", motion: "Motion" };

  const isVideoItem = (item) => item.media === "video" || Boolean(item.video);
  const getThumbnail = (item) => item.poster || item.image;

  function getFilteredItems() {
    return activeFilter === "all" ? items : items.filter((item) => item.category === activeFilter);
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
    categories.forEach((category) => filtersContainer.appendChild(createFilterButton(category, categoryLabels[category] || category)));
  }

  function createFilterButton(filter, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.dataset.filter = filter;
    button.textContent = label;
    button.addEventListener("click", () => {
      activeFilter = filter;
      document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
      renderGallery();
    });
    return button;
  }

  function renderGallery() {
    grid.innerHTML = "";
    getFilteredItems().forEach((item, index) => grid.appendChild(createCard(item, index)));
    updateWorkCount();
  }

  function createCard(item, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "visual-card";
    if (item.size === "wide") button.classList.add("visual-card--wide");
    if (item.size === "tall") button.classList.add("visual-card--tall");
    if (isVideoItem(item)) button.classList.add("visual-card--video");
    button.setAttribute("aria-label", `Open ${item.title}`);

    const image = document.createElement("img");
    image.src = getThumbnail(item);
    image.alt = item.alt || item.title;
    image.loading = "lazy";

    const caption = document.createElement("span");
    const title = document.createElement("strong");
    const type = document.createElement("small");
    title.textContent = item.title;
    type.textContent = item.type;
    caption.append(title, type);
    button.append(image, caption);

    if (isVideoItem(item)) {
      const playMark = document.createElement("span");
      playMark.className = "visual-card-play";
      playMark.setAttribute("aria-hidden", "true");
      playMark.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6L18 12L9 18Z"/></svg>';
      button.appendChild(playMark);
    }

    button.addEventListener("click", () => {
      lastFocusedCard = button;
      openLightbox(index);
    });
    return button;
  }

  function showItem(index) {
    const visibleItems = getFilteredItems();
    if (!visibleItems.length) return;
    stopVideo();

    activeIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[activeIndex];
    const videoItem = isVideoItem(item);

    lightboxImage.hidden = videoItem;
    player.hidden = !videoItem;

    if (videoItem) {
      video.src = item.video;
      video.poster = item.poster || item.image || "";
      video.setAttribute("aria-label", item.alt || item.title);
      player.classList.remove("is-playing", "is-ended", "controls-hidden");
      resetPlayerUI();
    } else {
      lightboxImage.src = item.image;
      lightboxImage.alt = item.alt || item.title;
    }

    lightboxTitle.textContent = item.title;
    lightboxType.textContent = item.type;
    lightboxYear.textContent = item.year;
    lightboxTools.textContent = Array.isArray(item.tools) ? item.tools.join(" · ") : String(item.tools || "");
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
    stopVideo();
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    if (lastFocusedCard) lastFocusedCard.focus();
  }

  function stopVideo() {
    clearTimeout(controlsTimer);
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function resetPlayerUI() {
    timeline.value = 0;
    timeline.style.setProperty("--progress", "0%");
    timeLabel.textContent = "00:00 / 00:00";
    updatePlayerState();
  }

  function updatePlayerState() {
    const playing = !video.paused && !video.ended;
    player.classList.toggle("is-playing", playing);
    player.classList.toggle("is-ended", video.ended);
    player.classList.toggle("is-muted", video.muted);
    playButton.setAttribute("aria-label", playing ? "Pause video" : "Play video");
    centerButton.setAttribute("aria-label", video.ended ? "Replay video" : playing ? "Pause video" : "Play video");
    muteButton.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
  }

  function updateTimeline() {
    if (!isScrubbing && Number.isFinite(video.duration) && video.duration > 0) {
      const progress = video.currentTime / video.duration;
      timeline.value = Math.round(progress * 1000);
      timeline.style.setProperty("--progress", `${progress * 100}%`);
    }
    timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  }

  function togglePlayback() {
    if (video.ended) video.currentTime = 0;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  function showControls() {
    clearTimeout(controlsTimer);
    player.classList.remove("controls-hidden");
    if (!video.paused && !video.ended) controlsTimer = setTimeout(() => player.classList.add("controls-hidden"), 2200);
  }

  function seekBy(seconds) {
    if (!Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), video.duration);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await player.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      console.warn("Fullscreen is unavailable.", error);
    }
  }

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showItem(activeIndex - 1));
  nextButton.addEventListener("click", () => showItem(activeIndex + 1));

lightbox.addEventListener("click", (event) => {
  // Ignore clicks on UI controls
  if (event.target.closest(".lightbox-close")) return;
  if (event.target.closest(".lightbox-prev")) return;
  if (event.target.closest(".lightbox-next")) return;

  // Ignore clicks on the metadata panel
  if (event.target.closest(".lightbox-meta")) return;

  // Ignore clicks on the image
  if (!lightboxImage.hidden && lightboxImage.contains(event.target)) return;

  // Ignore clicks on the video player
  if (!player.hidden && player.contains(event.target)) return;

  // Everything else is backdrop
  closeLightbox();
});

  [playButton, centerButton].forEach((button) => button.addEventListener("click", togglePlayback));
  video.addEventListener("click", togglePlayback);
  video.addEventListener("play", () => { updatePlayerState(); showControls(); });
  video.addEventListener("pause", () => { updatePlayerState(); showControls(); });
  video.addEventListener("ended", () => { updatePlayerState(); showControls(); });
  video.addEventListener("loadedmetadata", updateTimeline);
  video.addEventListener("timeupdate", updateTimeline);
  video.addEventListener("volumechange", updatePlayerState);

  muteButton.addEventListener("click", () => { video.muted = !video.muted; showControls(); });
  fullscreenButton.addEventListener("click", toggleFullscreen);
  player.addEventListener("mousemove", showControls);
  player.addEventListener("mouseenter", showControls);
  player.addEventListener("touchstart", showControls, { passive: true });
  player.addEventListener("mouseleave", () => { if (!video.paused && !video.ended) player.classList.add("controls-hidden"); });

  timeline.addEventListener("pointerdown", () => { isScrubbing = true; showControls(); });
  timeline.addEventListener("input", () => {
    const progress = Number(timeline.value) / 1000;
    timeline.style.setProperty("--progress", `${progress * 100}%`);
    timeLabel.textContent = `${formatTime(progress * video.duration)} / ${formatTime(video.duration)}`;
  });
  timeline.addEventListener("change", () => {
    if (Number.isFinite(video.duration)) video.currentTime = (Number(timeline.value) / 1000) * video.duration;
    isScrubbing = false;
    showControls();
  });
  window.addEventListener("pointerup", () => { isScrubbing = false; });

  document.addEventListener("fullscreenchange", () => {
    player.classList.toggle("is-fullscreen", document.fullscreenElement === player);
    fullscreenButton.setAttribute("aria-label", document.fullscreenElement === player ? "Exit fullscreen" : "Enter fullscreen");
    showControls();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    const videoVisible = !player.hidden;

    if (event.key === "Escape" && !document.fullscreenElement) closeLightbox();
    if (event.key === "ArrowLeft") { event.preventDefault(); videoVisible ? seekBy(-5) : showItem(activeIndex - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); videoVisible ? seekBy(5) : showItem(activeIndex + 1); }

    if (videoVisible && (event.code === "Space" || event.key.toLowerCase() === "k")) { event.preventDefault(); togglePlayback(); }
    if (videoVisible && event.key.toLowerCase() === "m") { video.muted = !video.muted; showControls(); }
    if (videoVisible && event.key.toLowerCase() === "f") toggleFullscreen();
  });

  buildFilters();
  renderGallery();
})();

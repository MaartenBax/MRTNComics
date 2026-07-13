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
  const lightboxMedia = document.getElementById("lightboxMedia");
  const thumbnails = document.getElementById("lightboxThumbnails");
  const closeButton = document.getElementById("lightboxClose");
  const previousButton = document.getElementById("lightboxPrev");
  const nextButton = document.getElementById("lightboxNext");
  const lightboxImage = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxType = document.getElementById("lightboxType");
  const lightboxYear = document.getElementById("lightboxYear");
  const lightboxDescription = document.getElementById("lightboxDescription");
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
  let activeProjectIndex = 0;
  let activeMediaIndex = 0;
  let activeProject = null;
  let lastFocusedCard = null;
  let controlsTimer = null;
  let thumbnailsTimer = null;
  let isScrubbing = false;
  let thumbnailsHovered = false;

  const categoryLabels = {
    "3d": "3D",
    design: "Design",
    motion: "Motion",
  };

  function validateProject(project) {
    return Boolean(
      project &&
      project.title &&
      project.category &&
      project.label &&
      project.cover &&
      Array.isArray(project.media) &&
      project.media.length
    );
  }

  function validateMedia(mediaItem) {
    return Boolean(
      mediaItem &&
      (mediaItem.kind === "image" || mediaItem.kind === "video") &&
      mediaItem.src
    );
  }

  function getFilteredItems() {
    return activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);
  }

  function getProjectMedia(project) {
    return project.media.filter(validateMedia);
  }

  function projectContainsVideo(project) {
    return getProjectMedia(project).some((mediaItem) => mediaItem.kind === "video");
  }

  function updateWorkCount() {
    const count = getFilteredItems().length;
    workCount.textContent = `${count} selected ${count === 1 ? "work" : "works"}`;
  }

  function buildFilters() {
    const categories = [
      ...new Set(items.map((item) => item.category).filter(Boolean)),
    ];

    filtersContainer.innerHTML = "";

    const allButton = createFilterButton("all", "All");
    allButton.classList.add("active");
    filtersContainer.appendChild(allButton);

    categories.forEach((category) => {
      filtersContainer.appendChild(
        createFilterButton(category, categoryLabels[category] || category)
      );
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

    getFilteredItems().forEach((project, index) => {
      if (!validateProject(project)) {
        console.warn("Skipping invalid Visuals project:", project);
        return;
      }

      grid.appendChild(createCard(project, index));
    });

    updateWorkCount();
  }

  function createCard(project, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "visual-card";

    if (project.size === "wide") button.classList.add("visual-card--wide");
    if (project.size === "tall") button.classList.add("visual-card--tall");

    const projectMedia = getProjectMedia(project);
    const singleVideo =
      projectMedia.length === 1 && projectMedia[0].kind === "video";

    if (singleVideo) {
      button.classList.add("visual-card--video");
    }

    button.setAttribute("aria-label", `Open ${project.title}`);

    const image = document.createElement("img");
    image.src = project.cover;
    image.alt = project.alt || project.title;
    image.loading = "lazy";

    const caption = document.createElement("span");
    const title = document.createElement("strong");
    const label = document.createElement("small");

    title.textContent = project.title;
    label.textContent = project.label;
    caption.append(title, label);
    button.append(image, caption);

    if (singleVideo) {
      const playMark = document.createElement("span");
      playMark.className = "visual-card-play";
      playMark.setAttribute("aria-hidden", "true");
      playMark.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M9 6L18 12L9 18Z"/></svg>';
      button.appendChild(playMark);
    }

    button.addEventListener("click", () => {
      lastFocusedCard = button;
      openLightbox(index);
    });

    return button;
  }

  function getResolvedMetadata(project, mediaItem) {
    return {
      title: mediaItem.title ?? project.title,
      label: mediaItem.label ?? project.label,
      year: mediaItem.year ?? project.year ?? "",
      tools: mediaItem.tools ?? project.tools ?? [],
      description: mediaItem.description ?? project.description ?? "",
      alt: mediaItem.alt ?? project.alt ?? project.title,
    };
  }

  function showProject(index) {
    const visibleProjects = getFilteredItems();
    if (!visibleProjects.length) return;

    stopVideo();
    clearTimeout(thumbnailsTimer);

    activeProjectIndex =
      (index + visibleProjects.length) % visibleProjects.length;
    activeMediaIndex = 0;
    activeProject = visibleProjects[activeProjectIndex];

    if (!validateProject(activeProject)) {
      console.error("Invalid project data:", activeProject);
      return;
    }

    lightboxCounter.textContent =
      `${activeProjectIndex + 1} / ${visibleProjects.length}`;

    buildThumbnailStrip();
    showMedia(0);
    preloadProjectMedia();
  }

  function showMedia(index) {
    if (!activeProject) return;

    const mediaItems = getProjectMedia(activeProject);
    if (!mediaItems.length) return;

    stopVideo();

    activeMediaIndex =
      (index + mediaItems.length) % mediaItems.length;

    const mediaItem = mediaItems[activeMediaIndex];
    const metadata = getResolvedMetadata(activeProject, mediaItem);
    const isVideo = mediaItem.kind === "video";

    lightboxTitle.textContent = metadata.title;
    lightboxType.textContent = metadata.label;
    lightboxYear.textContent = metadata.year;
    lightboxDescription.textContent = metadata.description;
    lightboxTools.textContent = Array.isArray(metadata.tools)
      ? metadata.tools.join(" · ")
      : String(metadata.tools || "");

    const descriptionBlock =
      lightboxDescription.closest(".lightbox-description-block");

    if (descriptionBlock) {
      descriptionBlock.hidden = !metadata.description;
    } else {
      lightboxDescription.hidden = !metadata.description;
    }

    lightboxImage.hidden = isVideo;
    player.hidden = !isVideo;

    if (isVideo) {
      video.src = mediaItem.src;
      video.poster = mediaItem.poster || mediaItem.thumbnail || activeProject.cover;
      video.setAttribute("aria-label", metadata.alt);
      player.classList.remove("is-playing", "is-ended", "controls-hidden");
      resetPlayerUI();
    } else {
      lightboxImage.src = mediaItem.src;
      lightboxImage.alt = metadata.alt;
    }

    updateThumbnailState();
    showThumbnails();
  }

  function buildThumbnailStrip() {
    thumbnails.innerHTML = "";

    const mediaItems = getProjectMedia(activeProject);

    if (mediaItems.length <= 1) {
      thumbnails.hidden = true;
      return;
    }

    thumbnails.hidden = false;

    mediaItems.forEach((mediaItem, index) => {
      const metadata = getResolvedMetadata(activeProject, mediaItem);
      const button = document.createElement("button");

      button.type = "button";
      button.className = "lightbox-thumbnail";
      button.setAttribute(
        "aria-label",
        `Show ${metadata.title}, item ${index + 1} of ${mediaItems.length}`
      );

      const preview = document.createElement("img");
      preview.src =
        mediaItem.thumbnail ||
        mediaItem.poster ||
        mediaItem.src ||
        activeProject.cover;
      preview.alt = "";
      preview.loading = "eager";
      button.appendChild(preview);

      if (mediaItem.kind === "video") {
        const playIcon = document.createElement("span");
        playIcon.className = "lightbox-thumbnail-play";
        playIcon.setAttribute("aria-hidden", "true");
        playIcon.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M9 6L18 12L9 18Z"/></svg>';
        button.appendChild(playIcon);
      }

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        showMedia(index);
      });

      thumbnails.appendChild(button);
    });

    updateThumbnailState();
  }

  function updateThumbnailState() {
    thumbnails.querySelectorAll(".lightbox-thumbnail").forEach((button, index) => {
      const active = index === activeMediaIndex;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function preloadProjectMedia() {
    getProjectMedia(activeProject).forEach((mediaItem, index) => {
      if (index === activeMediaIndex) return;

      if (mediaItem.kind === "image") {
        const image = new Image();
        image.src = mediaItem.src;
      }

      if (mediaItem.thumbnail) {
        const thumbnail = new Image();
        thumbnail.src = mediaItem.thumbnail;
      }

      if (mediaItem.poster) {
        const poster = new Image();
        poster.src = mediaItem.poster;
      }
    });
  }

  function openLightbox(index) {
    showProject(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    stopVideo();
    clearTimeout(thumbnailsTimer);
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (lastFocusedCard) {
      lastFocusedCard.focus();
    }
  }

  function stopVideo() {
    clearTimeout(controlsTimer);
    video.pause();
    video.removeAttribute("src");
    video.removeAttribute("poster");
    video.load();
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

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
    centerButton.setAttribute(
      "aria-label",
      video.ended ? "Replay video" : playing ? "Pause video" : "Play video"
    );
    muteButton.setAttribute(
      "aria-label",
      video.muted ? "Unmute video" : "Mute video"
    );
  }

  function updateTimeline() {
    if (!isScrubbing && Number.isFinite(video.duration) && video.duration > 0) {
      const progress = video.currentTime / video.duration;
      timeline.value = Math.round(progress * 1000);
      timeline.style.setProperty("--progress", `${progress * 100}%`);
    }

    timeLabel.textContent =
      `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  }

  function togglePlayback() {
    if (video.ended) video.currentTime = 0;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function showControls() {
    clearTimeout(controlsTimer);
    player.classList.remove("controls-hidden");

    if (!video.paused && !video.ended) {
      controlsTimer = setTimeout(() => {
        player.classList.add("controls-hidden");
      }, 2200);
    }
  }

  function showThumbnails() {
    if (thumbnails.hidden) return;

    clearTimeout(thumbnailsTimer);
    thumbnails.classList.remove("is-hidden");

    if (!thumbnailsHovered) {
      thumbnailsTimer = setTimeout(() => {
        if (!thumbnailsHovered) {
          thumbnails.classList.add("is-hidden");
        }
      }, 2200);
    }
  }

  function seekBy(seconds) {
    if (!Number.isFinite(video.duration)) return;

    video.currentTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      video.duration
    );
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await player.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn("Fullscreen is unavailable.", error);
    }
  }

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => {
    showProject(activeProjectIndex - 1);
  });
  nextButton.addEventListener("click", () => {
    showProject(activeProjectIndex + 1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target.closest(".lightbox-close")) return;
    if (event.target.closest(".lightbox-prev")) return;
    if (event.target.closest(".lightbox-next")) return;
    if (event.target.closest(".lightbox-meta")) return;
    if (event.target.closest(".lightbox-thumbnails")) return;
    if (!lightboxImage.hidden && lightboxImage.contains(event.target)) return;
    if (!player.hidden && player.contains(event.target)) return;

    closeLightbox();
  });

  [playButton, centerButton].forEach((button) => {
    button.addEventListener("click", togglePlayback);
  });

  video.addEventListener("click", togglePlayback);
  video.addEventListener("play", () => {
    updatePlayerState();
    showControls();
  });
  video.addEventListener("pause", () => {
    updatePlayerState();
    showControls();
  });
  video.addEventListener("ended", () => {
    updatePlayerState();
    showControls();
  });
  video.addEventListener("loadedmetadata", updateTimeline);
  video.addEventListener("timeupdate", updateTimeline);
  video.addEventListener("volumechange", updatePlayerState);

  muteButton.addEventListener("click", () => {
    video.muted = !video.muted;
    showControls();
  });

  fullscreenButton.addEventListener("click", toggleFullscreen);

  player.addEventListener("mousemove", showControls);
  player.addEventListener("mouseenter", showControls);
  player.addEventListener("touchstart", showControls, { passive: true });
  player.addEventListener("mouseleave", () => {
    if (!video.paused && !video.ended) {
      player.classList.add("controls-hidden");
    }
  });

  lightboxMedia.addEventListener("mousemove", showThumbnails);
  lightboxMedia.addEventListener("touchstart", showThumbnails, {
    passive: true,
  });

  thumbnails.addEventListener("mouseenter", () => {
    thumbnailsHovered = true;
    clearTimeout(thumbnailsTimer);
    thumbnails.classList.remove("is-hidden");
  });

  thumbnails.addEventListener("mouseleave", () => {
    thumbnailsHovered = false;
    showThumbnails();
  });

  timeline.addEventListener("pointerdown", () => {
    isScrubbing = true;
    showControls();
  });

  timeline.addEventListener("input", () => {
    const progress = Number(timeline.value) / 1000;
    timeline.style.setProperty("--progress", `${progress * 100}%`);
    timeLabel.textContent =
      `${formatTime(progress * video.duration)} / ${formatTime(video.duration)}`;
  });

  timeline.addEventListener("change", () => {
    if (Number.isFinite(video.duration)) {
      video.currentTime =
        (Number(timeline.value) / 1000) * video.duration;
    }

    isScrubbing = false;
    showControls();
  });

  window.addEventListener("pointerup", () => {
    isScrubbing = false;
  });

  document.addEventListener("fullscreenchange", () => {
    player.classList.toggle(
      "is-fullscreen",
      document.fullscreenElement === player
    );

    fullscreenButton.setAttribute(
      "aria-label",
      document.fullscreenElement === player
        ? "Exit fullscreen"
        : "Enter fullscreen"
    );

    showControls();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    const videoVisible = !player.hidden;

    if (event.key === "Escape" && !document.fullscreenElement) {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      videoVisible
        ? seekBy(-5)
        : showProject(activeProjectIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      videoVisible
        ? seekBy(5)
        : showProject(activeProjectIndex + 1);
    }

    if (
      videoVisible &&
      (event.code === "Space" || event.key.toLowerCase() === "k")
    ) {
      event.preventDefault();
      togglePlayback();
    }

    if (videoVisible && event.key.toLowerCase() === "m") {
      video.muted = !video.muted;
      showControls();
    }

    if (videoVisible && event.key.toLowerCase() === "f") {
      toggleFullscreen();
    }
  });

  buildFilters();
  renderGallery();
})();

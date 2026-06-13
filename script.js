let series = [];
let comics = [];
let currentComic = null;
let currentComicIndex = 0;
let currentSpread = 0;
let currentSpreads = [];
let pendingComicIndex = 0;
let currentSeriesId = null;
let currentSort = "new";
let previousView = "home";

const views = {
  home: document.getElementById("homeView"),
  series: document.getElementById("seriesView"),
  seriesDetail: document.getElementById("seriesDetailView"),
  continue: document.getElementById("continueView"),
  reader: document.getElementById("readerView")
};

const heroFeature = document.getElementById("heroFeature");
const recentGrid = document.getElementById("recentGrid");
const homeContinueRow = document.getElementById("homeContinueRow");
const seriesGrid = document.getElementById("seriesGrid");
const seriesDetailHero = document.getElementById("seriesDetailHero");
const seriesIssueTitle = document.getElementById("seriesIssueTitle");
const seriesIssueGrid = document.getElementById("seriesIssueGrid");
const continueGrid = document.getElementById("continueGrid");
const issueSortSelect = document.getElementById("issueSortSelect");
const bookSpread = document.getElementById("bookSpread");
const comicTitle = document.getElementById("comicTitle");
const issueLabel = document.getElementById("issueLabel");
const pageCounter = document.getElementById("pageCounter");
const pageSlider = document.getElementById("pageSlider");
const searchInput = document.getElementById("searchInput");
const resumeDialog = document.getElementById("resumeDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogText = document.getElementById("dialogText");

function loadComics() {
  try {
    series = Array.isArray(SERIES_DATA) ? SERIES_DATA : [];
    comics = Array.isArray(COMICS_DATA) ? COMICS_DATA : [];
    renderEverything();
    showHome();
  } catch (error) {
    document.body.innerHTML = `
      <main>
        <div class="empty-state">
          <strong>Could not load your comics.</strong><br>
          Make sure <code>data/comics.js</code> exists and contains <code>SERIES_DATA</code> and <code>COMICS_DATA</code>.
        </div>
      </main>
    `;
    console.error(error);
  }
}

function renderEverything() {
  renderHero();
  renderRecentGrid();
  renderContinueRows();
  renderSeriesGrid();
}

function showView(name) {
  Object.values(views).forEach(view => view.classList.remove("active"));
  views[name].classList.add("active");
  document.body.classList.toggle("reading", name === "reader");

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.view === name);
  });
}

function showHome() {
  previousView = "home";
  showView("home");
}

function showSeries() {
  previousView = "series";
  renderSeriesGrid();
  showView("series");
}

function showContinue() {
  previousView = "continue";
  renderContinueRows();
  showView("continue");
}

function showSeriesDetail(seriesId) {
  currentSeriesId = seriesId;
  previousView = "seriesDetail";
  renderSeriesDetail();
  showView("seriesDetail");
}

function getSeriesById(seriesId) {
  return series.find(item => item.id === seriesId);
}

function getIssuesForSeries(seriesId) {
  const issues = comics.filter(comic => comic.series === seriesId);
  return issues.sort((a, b) => {
    const aNum = Number(a.issueNumber || 0);
    const bNum = Number(b.issueNumber || 0);
    return currentSort === "old" ? aNum - bNum : bNum - aNum;
  });
}

function coverMarkup(comic, className = "cover-art") {
  if (comic.cover) {
    return `<div class="${className}"><img src="${comic.cover}" alt="${comic.title || comic.issue} cover"></div>`;
  }

  return `<div class="${className}">${comic.coverText || "M"}</div>`;
}

function renderHero() {
  if (!comics.length) {
    heroFeature.innerHTML = "";
    return;
  }

  const featuredIndex = Math.max(0, comics.findIndex(comic => comic.featured));
  const comic = comics[featuredIndex] || comics[0];
  const seriesInfo = getSeriesById(comic.series);

  heroFeature.innerHTML = `
    <div class="hero-copy">
      <p class="eyebrow">Featured Issue</p>
      <h1>${seriesInfo?.title || comic.title}</h1>
      <p>${comic.description || seriesInfo?.description || "A clean digital comic reader for your own issues."}</p>
      <div class="hero-actions">
        <button class="primary-btn" onclick="requestOpenComic(${featuredIndex})">Read now</button>
        <button class="secondary-btn" onclick="showSeriesDetail('${comic.series}')">View series</button>
      </div>
    </div>
    <div class="hero-cover">
      ${coverMarkup(comic, "cover-art big")}
    </div>
  `;
}

function renderRecentGrid() {
  const sorted = [...comics].sort((a, b) => Number(b.issueNumber || 0) - Number(a.issueNumber || 0));
  recentGrid.innerHTML = sorted.slice(0, 12).map(comic => comicCard(comic, comics.indexOf(comic))).join("");
}

function renderSeriesGrid() {
  const query = searchInput.value.trim().toLowerCase();

  const visibleSeries = series.filter(item => {
    const searchable = `${item.title} ${item.description || ""}`.toLowerCase();
    return searchable.includes(query);
  });

  seriesGrid.innerHTML = visibleSeries.length
    ? visibleSeries.map(item => {
        const issueCount = comics.filter(comic => comic.series === item.id).length;
        return `
          <article class="series-card" onclick="showSeriesDetail('${item.id}')">
            <img src="${item.banner}" alt="${item.title} banner">
            <div class="series-card-content">
              <p class="eyebrow">Series</p>
              <h2>${item.title}</h2>
              <p>${issueCount} ${issueCount === 1 ? "Issue" : "Issues"}</p>
            </div>
          </article>
        `;
      }).join("")
    : `<div class="empty-state">No series found.</div>`;
}

function renderSeriesDetail() {
  const item = getSeriesById(currentSeriesId);
  if (!item) return;

  const issues = getIssuesForSeries(item.id);

  seriesDetailHero.innerHTML = `
    <img src="${item.banner}" alt="${item.title} banner">
    <div class="series-detail-copy">
      <p class="eyebrow">Series</p>
      <h1>${item.title}</h1>
      <p>${item.description || ""}</p>
    </div>
  `;

  seriesIssueTitle.textContent = `${issues.length} ${issues.length === 1 ? "Issue" : "Issues"}`;
  seriesIssueGrid.innerHTML = issues.length
    ? issues.map(comic => comicCard(comic, comics.indexOf(comic))).join("")
    : `<div class="empty-state">No issues in this series yet.</div>`;
}

function comicCard(comic, index) {
  const spreadCount = buildSpreads(comic).length || 1;
  const lastSpread = Number(localStorage.getItem(progressKey(index)) || 0);
  const percent = Math.round((lastSpread / Math.max(spreadCount - 1, 1)) * 100);
  const seriesInfo = getSeriesById(comic.series);

  return `
    <article class="comic-card" onclick="requestOpenComic(${index})">
      ${coverMarkup(comic)}
      <div class="card-body">
        <h3>${comic.issue || comic.title}</h3>
        <p>${seriesInfo?.title || comic.title || ""}</p>
        <div class="meta-row">
          <span>${comic.category || seriesInfo?.title || "Comic"}</span>
          <span>${spreadCount} views</span>
        </div>
        ${lastSpread > 0 ? `<div class="progress-track" style="--progress:${percent}%"><span></span></div>` : ""}
      </div>
    </article>
  `;
}

function renderContinueRows() {
  const items = comics
    .map((comic, index) => ({
      comic,
      index,
      spread: Number(localStorage.getItem(progressKey(index)) || 0),
      spreadCount: buildSpreads(comic).length || 1
    }))
    .filter(item => item.spread > 0);

  const html = items.length
    ? items.map(item => continueCard(item)).join("")
    : `<div class="empty-state">Start reading an issue and it will appear here.</div>`;

  homeContinueRow.innerHTML = html;
  continueGrid.innerHTML = html;
}

function continueCard(item) {
  const percent = Math.round((item.spread / Math.max(item.spreadCount - 1, 1)) * 100);
  const seriesInfo = getSeriesById(item.comic.series);

  return `
    <article class="continue-card" onclick="openComic(${item.index}, false)">
      ${coverMarkup(item.comic, "mini-cover")}
      <div>
        <h3>${seriesInfo?.title || item.comic.title}</h3>
        <p>${item.comic.issue || ""} • ${percent}% read</p>
        <div class="progress-track" style="--progress:${percent}%"><span></span></div>
      </div>
    </article>
  `;
}

function buildSpreads(comic) {
  const spreads = [];

  if (comic.cover) {
    spreads.push({ type: "cover", label: "Front Cover", images: [comic.cover] });
  }

  const interiorPages = comic.pages || [];

  for (let i = 0; i < interiorPages.length; i += 2) {
    spreads.push({
      type: "spread",
      label: interiorPages[i + 1] ? `Pages ${i + 1}-${i + 2}` : `Page ${i + 1}`,
      images: interiorPages[i + 1] ? [interiorPages[i], interiorPages[i + 1]] : [interiorPages[i]]
    });
  }

  if (comic.backCover) {
    spreads.push({ type: "back-cover", label: "Back Cover", images: [comic.backCover] });
  }

  return spreads;
}

function requestOpenComic(index, forceStart = false) {
  const savedSpread = Number(localStorage.getItem(progressKey(index)) || 0);
  const spreadCount = buildSpreads(comics[index]).length;

  if (!forceStart && savedSpread > 0 && savedSpread < spreadCount - 1) {
    pendingComicIndex = index;
    dialogTitle.textContent = `${getSeriesById(comics[index].series)?.title || comics[index].title} — ${comics[index].issue}`;
    dialogText.textContent = `You stopped at view ${savedSpread + 1} of ${spreadCount}.`;
    resumeDialog.classList.add("active");
    resumeDialog.setAttribute("aria-hidden", "false");
    return;
  }

  openComic(index, forceStart);
}

function openComic(index, startFromCover = false) {
  currentComicIndex = index;
  currentComic = comics[index];
  currentSpreads = buildSpreads(currentComic);
  currentSpread = startFromCover ? 0 : Number(localStorage.getItem(progressKey(index)) || 0);

  if (currentSpread >= currentSpreads.length) {
    currentSpread = 0;
  }

  const seriesInfo = getSeriesById(currentComic.series);

  comicTitle.textContent = `${seriesInfo?.title || currentComic.title} — ${currentComic.issue || ""}`;
  issueLabel.textContent = currentComic.issue || "Comic";
  pageSlider.max = currentSpreads.length;
  showView("reader");
  updateSpread("next");
}

function closeReader() {
  showView(previousView || "home");
  renderEverything();
  if (currentSeriesId && previousView === "seriesDetail") renderSeriesDetail();
}

function updateSpread(direction = "next") {
  if (!currentComic || !currentSpreads.length) return;

  const spread = currentSpreads[currentSpread];

  bookSpread.classList.remove("single", "double", "turn-next", "turn-prev");
  void bookSpread.offsetWidth;

  bookSpread.classList.add(spread.images.length === 1 ? "single" : "double");
  bookSpread.classList.add(direction === "prev" ? "turn-prev" : "turn-next");

  bookSpread.innerHTML = spread.images.map((src, index) => {
    const side = spread.images.length === 2 ? (index === 0 ? "left" : "right") : "single";
    return `<img class="book-page ${side}" src="${src}" alt="${currentComic.issue} ${spread.label}">`;
  }).join("");

  pageCounter.textContent = `${spread.label} • ${currentSpread + 1} / ${currentSpreads.length}`;
  pageSlider.value = currentSpread + 1;
  localStorage.setItem(progressKey(currentComicIndex), currentSpread);
}

function nextPage() {
  if (!currentComic || currentSpread >= currentSpreads.length - 1) return;
  currentSpread += 1;
  updateSpread("next");
}

function prevPage() {
  if (!currentComic || currentSpread <= 0) return;
  currentSpread -= 1;
  updateSpread("prev");
}

function restartComic() {
  if (!currentComic) return;
  currentSpread = 0;
  updateSpread("prev");
}

function progressKey(index) {
  const comic = comics[index];
  const stableId = comic.id || `${comic.series}-${comic.issue || index}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `mrt-comic-progress-${stableId}`;
}

function toggleFullscreen() {
  const target = document.documentElement;
  if (!document.fullscreenElement) {
    target.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

document.getElementById("backBtn").addEventListener("click", closeReader);
document.getElementById("nextBtn").addEventListener("click", nextPage);
document.getElementById("prevBtn").addEventListener("click", prevPage);
document.getElementById("nextBtnBottom").addEventListener("click", nextPage);
document.getElementById("prevBtnBottom").addEventListener("click", prevPage);
document.getElementById("restartBtn").addEventListener("click", restartComic);
document.getElementById("fullscreenBtn").addEventListener("click", toggleFullscreen);

document.getElementById("continueBtn").addEventListener("click", () => {
  resumeDialog.classList.remove("active");
  resumeDialog.setAttribute("aria-hidden", "true");
  openComic(pendingComicIndex, false);
});

document.getElementById("startOverBtn").addEventListener("click", () => {
  resumeDialog.classList.remove("active");
  resumeDialog.setAttribute("aria-hidden", "true");
  openComic(pendingComicIndex, true);
});

resumeDialog.addEventListener("click", event => {
  if (event.target === resumeDialog) {
    resumeDialog.classList.remove("active");
    resumeDialog.setAttribute("aria-hidden", "true");
  }
});

pageSlider.addEventListener("input", () => {
  const nextSpread = Number(pageSlider.value) - 1;
  const direction = nextSpread > currentSpread ? "next" : "prev";
  currentSpread = nextSpread;
  updateSpread(direction);
});

searchInput.addEventListener("input", () => {
  renderSeriesGrid();
  renderRecentGrid();
  renderSeriesDetail();
});

issueSortSelect.addEventListener("change", () => {
  currentSort = issueSortSelect.value;
  renderSeriesDetail();
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    if (link.dataset.view === "home") showHome();
    if (link.dataset.view === "series") showSeries();
    if (link.dataset.view === "continue") showContinue();
  });
});

document.getElementById("pageStage").addEventListener("click", event => {
  if (!currentComic) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  if (x < rect.width / 2) prevPage();
  else nextPage();
});

document.addEventListener("keydown", event => {
  if (!views.reader.classList.contains("active")) return;
  if (event.key === "ArrowRight") nextPage();
  if (event.key === "ArrowLeft") prevPage();
  if (event.key === "Escape") closeReader();
});

loadComics();

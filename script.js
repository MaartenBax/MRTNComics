let series = [];
let comics = [];
let currentComic = null;
let currentComicIndex = 0;
let currentSpread = 0;
let currentSpreads = [];
let pendingComicIndex = 0;
let currentSeriesId = null;
let currentSort = "old";
let previousView = "home";

const views = {
  home: document.getElementById("homeView"),
  series: document.getElementById("seriesView"),
  seriesDetail: document.getElementById("seriesDetailView"),
  favorites: document.getElementById("favoritesView"),
  reader: document.getElementById("readerView")
};

const homeHero = document.getElementById("homeHero");
const latestIssuesRow = document.getElementById("latestIssuesRow");
const homeContinuePanel = document.getElementById("homeContinuePanel");
const seriesGrid = document.getElementById("seriesGrid");
const seriesDetailHero = document.getElementById("seriesDetailHero");
const seriesIssueTitle = document.getElementById("seriesIssueTitle");
const seriesIssueGrid = document.getElementById("seriesIssueGrid");
const seriesContinueBlock = document.getElementById("seriesContinueBlock");
const favoritesGrid = document.getElementById("favoritesGrid");
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
  series = Array.isArray(SERIES_DATA) ? SERIES_DATA : [];
  comics = Array.isArray(COMICS_DATA) ? COMICS_DATA : [];
  renderEverything();
  showHome();
}

function renderEverything() {
  renderHomeHero();
  renderLatestIssues();
  renderContinuePanels();
  renderSeriesGrid();
  renderFavorites();
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
  renderEverything();
  showView("home");
}

function showSeries() {
  previousView = "series";
  renderSeriesGrid();
  showView("series");
}

function showFavorites() {
  previousView = "favorites";
  renderFavorites();
  showView("favorites");
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


function isMobileReader() {
  return window.matchMedia("(max-width: 720px)").matches;
}

function renderHomeHero() {
  const featuredIndex = Math.max(0, comics.findIndex(comic => comic.featured));
  const comic = comics[featuredIndex] || comics[0];
  const seriesInfo = getSeriesById(comic.series);

  homeHero.style.setProperty("--hero-image", `url("${seriesInfo?.hero || seriesInfo?.banner || comic.cover}")`);

  homeHero.innerHTML = `
  <div class="hero-copy">

    ${
      seriesInfo?.logo
        ? `<img src="${seriesInfo.logo}" alt="${seriesInfo.title}" class="hero-series-logo">`
        : `<h1>${seriesInfo?.title || comic.title}</h1>`
    }

    <div class="hero-red-line"></div>

    <p>${seriesInfo?.description || comic.description || ""}</p>
      <div class="hero-buttons">
        <button class="primary-btn" onclick="requestOpenComic(${featuredIndex})">Read Issue 001 <span>→</span></button>
        <button class="outline-btn" onclick="showSeriesDetail('${comic.series}')">View Series</button>
      </div>
    </div>
  `;
}

function renderLatestIssues() {
  const query = searchInput.value.trim().toLowerCase();
  const sorted = [...comics].sort((a, b) => Number(b.issueNumber || 0) - Number(a.issueNumber || 0));
  const filtered = sorted.filter(comic => matchesSearch(comic, query));
  latestIssuesRow.innerHTML = filtered.slice(0, 3).map(comic => issueCard(comic, comics.indexOf(comic))).join("");
}

function renderContinuePanels() {
  const items = comics
    .map((comic, index) => ({
      comic,
      index,
      spread: Number(localStorage.getItem(progressKey(index)) || 0),
      spreadCount: buildSpreads(comic).length || 1
    }))
    .filter(item => item.spread > 0);

  if (!items.length) {
    const first = comics[0];
    homeContinuePanel.innerHTML = `
      <div class="empty-state">No reading progress yet. Start Issue 001 when you're ready.</div>
    `;
  } else {
    homeContinuePanel.innerHTML = continueFeature(items[0]);
  }

  if (currentSeriesId) {
    const seriesItems = items.filter(item => item.comic.series === currentSeriesId);
    seriesContinueBlock.innerHTML = seriesItems.length
      ? `<div class="home-panel" style="width:100%; margin:0 0 2rem; grid-template-columns:1fr;"><div>${continueFeature(seriesItems[0])}</div></div>`
      : "";
  }
}

function continueFeature(item) {
  const percent = Math.round((item.spread / Math.max(item.spreadCount - 1, 1)) * 100);
  const seriesInfo = getSeriesById(item.comic.series);

  return `
    <div class="continue-feature">
      <img src="${item.comic.cover}" alt="${item.comic.issue} cover" class="continue-cover">
      <div class="continue-info">
        <h3>${seriesInfo?.title || item.comic.title} ${item.comic.issue || ""}</h3>
        <p>View ${item.spread + 1} of ${item.spreadCount} • ${percent}% read</p>
        <div class="progress-track" style="--progress:${percent}%"><span></span></div>
        <button class="outline-btn" onclick="openComic(${item.index}, false)">Continue Reading <span>→</span></button>
      </div>
    </div>
  `;
}

function renderSeriesGrid() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleSeries = series.filter(item => `${item.title} ${item.description || ""}`.toLowerCase().includes(query));

  seriesGrid.innerHTML = visibleSeries.length
    ? visibleSeries.map(item => {
        const issueCount = comics.filter(comic => comic.series === item.id).length;
        const disabled = issueCount === 0 || item.id === "coming-soon" || item.title.toLowerCase() === "coming soon";
        return `
          <article class="series-card ${disabled ? 'disabled' : ''}" ${disabled ? '' : `onclick="showSeriesDetail('${item.id}')"`}>
            <img src="${item.banner}" alt="${item.title} banner">
            <div class="series-card-content">
              ${
				  item.logo
					? `<img src="${item.logo}" alt="${item.title}" class="series-card-logo">`
					: `<h2>${item.title}</h2>`
				}
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
      ${
		item.logo
		? `<img src="${item.logo}" alt="${item.title}" class="series-detail-logo">`
		: `<h1>${item.title}</h1>`
		}
      <p>${item.description || ""}</p>
    </div>
  `;

  seriesIssueTitle.textContent = `${issues.length} ${issues.length === 1 ? "Issue" : "Issues"}`;
  renderContinuePanels();
  seriesIssueGrid.innerHTML = issues.length
    ? issues.map(comic => issueCard(comic, comics.indexOf(comic))).join("")
    : `<div class="empty-state">No issues in this series yet.</div>`;
}

function renderFavorites() {
  const favorites = comics
    .map((comic, index) => ({ comic, index }))
    .filter(item => isFavorite(item.index));

  favoritesGrid.innerHTML = favorites.length
    ? favorites.map(item => issueCard(item.comic, item.index)).join("")
    : `<div class="empty-state">No favorites yet. Heart an issue to add it to this shelf.</div>`;
}

function issueCard(comic, index) {
  const seriesInfo = getSeriesById(comic.series);
  const favorite = isFavorite(index);

return `
  <article class="issue-card">
    <img class="issue-cover" src="${comic.cover}" alt="${comic.issue} cover">
    <div class="issue-info">
      <h3>${comic.issue || comic.title}</h3>
      <p class="series-name">${seriesInfo?.title || comic.title}</p>
      <p class="desc">${comic.description || "The next chapter."}</p>

      <div class="card-actions">
        ${
          comic.available === false
            ? `<button class="small-btn disabled-btn" disabled>Coming Soon</button>`
            : `<button class="small-btn" onclick="requestOpenComic(${index})">Read Now <span>→</span></button>`
        }

        <button class="heart-btn ${favorite ? "active" : ""}" onclick="toggleFavorite(${index})">
          ${favorite ? "♥" : "♡"}
        </button>
      </div>
    </div>
  </article>
`;
}

function matchesSearch(comic, query) {
  if (!query) return true;
  const seriesInfo = getSeriesById(comic.series);
  const searchable = `${seriesInfo?.title || ""} ${comic.title || ""} ${comic.issue || ""} ${comic.description || ""}`.toLowerCase();
  return searchable.includes(query);
}

function isFavorite(index) {
  return localStorage.getItem(favoriteKey(index)) === "true";
}

function toggleFavorite(index) {
  localStorage.setItem(favoriteKey(index), String(!isFavorite(index)));
  renderEverything();
  if (currentSeriesId) renderSeriesDetail();
}

function favoriteKey(index) {
  const comic = comics[index];
  return `mrt-comic-favorite-${comic.id || index}`;
}

function buildSpreads(comic) {
  const spreads = [];

  if (comic.cover) spreads.push({ label: "Front Cover", images: [comic.cover] });

  const interiorPages = comic.pages || [];

  if (isMobileReader()) {
    interiorPages.forEach((page, index) => {
      spreads.push({
        label: `Page ${index + 1}`,
        images: [page]
      });
    });
  } else {
    for (let i = 0; i < interiorPages.length; i += 2) {
      spreads.push({
        label: interiorPages[i + 1] ? `Pages ${i + 1}-${i + 2}` : `Page ${i + 1}`,
        images: interiorPages[i + 1] ? [interiorPages[i], interiorPages[i + 1]] : [interiorPages[i]]
      });
    }
  }

  if (comic.backCover) spreads.push({ label: "Back Cover", images: [comic.backCover] });
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

  if (currentSpread >= currentSpreads.length) currentSpread = 0;

  const seriesInfo = getSeriesById(currentComic.series);
  comicTitle.textContent = `${seriesInfo?.title || currentComic.title} — ${currentComic.issue || ""}`;
  issueLabel.textContent = currentComic.issue || "Comic";
  pageSlider.max = currentSpreads.length;
  showView("reader");
  updateSpread();
}

function closeReader() {
  showView(previousView || "home");
  renderEverything();
  if (currentSeriesId && previousView === "seriesDetail") renderSeriesDetail();
}

function updateSpread() {
  if (!currentComic || !currentSpreads.length) return;

  const spread = currentSpreads[currentSpread];
  bookSpread.classList.remove("single", "double");
  bookSpread.classList.add(spread.images.length === 1 ? "single" : "double");

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
  updateSpread();
}

function prevPage() {
  if (!currentComic || currentSpread <= 0) return;
  currentSpread -= 1;
  updateSpread();
}

function restartComic() {
  if (!currentComic) return;
  currentSpread = 0;
  updateSpread();
}

function progressKey(index) {
  const comic = comics[index];
  return `mrt-comic-progress-${comic.id || index}`;
}

function toggleFullscreen() {
  const target = document.documentElement;
  if (!document.fullscreenElement) target.requestFullscreen?.();
  else document.exitFullscreen?.();
}

document.getElementById("startFirstIssueBtn").addEventListener("click", () => requestOpenComic(0, true));
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
  currentSpread = Number(pageSlider.value) - 1;
  updateSpread();
});

searchInput.addEventListener("input", () => {
  renderEverything();
  if (currentSeriesId) renderSeriesDetail();
});

issueSortSelect.addEventListener("change", () => {
  currentSort = issueSortSelect.value;
  renderSeriesDetail();
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    if (link.dataset.view === "home") showHome();
    if (link.dataset.view === "series") showSeries();
    if (link.dataset.view === "favorites") showFavorites();
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


window.addEventListener("resize", () => {
  if (!currentComic || !views.reader.classList.contains("active")) return;

  const oldSpread = currentSpread;
  currentSpreads = buildSpreads(currentComic);

  if (oldSpread >= currentSpreads.length) {
    currentSpread = currentSpreads.length - 1;
  }

  pageSlider.max = currentSpreads.length;
  updateSpread();
});

loadComics();

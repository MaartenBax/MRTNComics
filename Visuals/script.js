const filterButtons = [...document.querySelectorAll(".filter-button")];
const cards = [...document.querySelectorAll(".visual-card")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    cards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

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

let activeIndex = 0;

function visibleCards() {
  return cards.filter((card) => !card.hidden);
}

function showCard(index) {
  const currentCards = visibleCards();
  if (!currentCards.length) return;

  activeIndex = (index + currentCards.length) % currentCards.length;
  const card = currentCards[activeIndex];

  lightboxImage.src = card.dataset.image;
  lightboxImage.alt = card.dataset.title;
  lightboxTitle.textContent = card.dataset.title;
  lightboxType.textContent = card.dataset.type;
  lightboxYear.textContent = card.dataset.year;
  lightboxTools.textContent = card.dataset.tools;
  lightboxCounter.textContent = `${activeIndex + 1} / ${currentCards.length}`;
}

function openLightbox(card) {
  const currentCards = visibleCards();
  activeIndex = currentCards.indexOf(card);
  showCard(activeIndex);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

cards.forEach((card) => card.addEventListener("click", () => openLightbox(card)));
closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => showCard(activeIndex - 1));
nextButton.addEventListener("click", () => showCard(activeIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showCard(activeIndex - 1);
  if (event.key === "ArrowRight") showCard(activeIndex + 1);
});

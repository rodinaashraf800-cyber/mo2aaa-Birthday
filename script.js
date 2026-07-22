const PASSWORD = "17.11.2023";
const YOUTUBE_VIDEO_ID = "Kbfin_XCBtc";
const MUSIC_START_SECONDS = 83; // 1:23

const screens = [...document.querySelectorAll(".screen")];
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const passwordMessage = document.getElementById("password-message");
const envelopeButton = document.getElementById("envelope-button");
const seeGiftsButton = document.getElementById("see-gifts");

function showScreen(id) {
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const entered = passwordInput.value.trim();

  if (entered === PASSWORD) {
    passwordMessage.textContent = "Correct ♡";

    // Start the song from 1:23 on this direct user action.
    // It will continue playing while moving through all website screens.
    birthdayAudio.currentTime = MUSIC_START_SECONDS;
    birthdayAudio.loop = true;
    birthdayAudio.play().then(() => {
      isMusicPlaying = true;
      recordButton.classList.add("playing");
      recordButton.classList.remove("ready-to-play");
      musicToggleText.textContent = "Our song is playing ♡";
      musicStatus.textContent = "Playing from 1:23 ♪";
    }).catch(() => {
      // Some browsers may still block sound; the record remains a manual fallback.
      musicStatus.textContent = "Tap the record to start the song ♪";
    });

    setTimeout(() => showScreen("mail-screen"), 450);
    return;
  }

  passwordMessage.textContent = "That date is not right. Try again ♡";
  passwordInput.classList.remove("shake");
  void passwordInput.offsetWidth;
  passwordInput.classList.add("shake");
});

// Automatically formats the password as DD.MM.YYYY.
passwordInput.addEventListener("input", () => {
  const digits = passwordInput.value.replace(/\D/g, "").slice(0, 8);
  const groups = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  passwordInput.value = groups.join(".");
});

envelopeButton.addEventListener("click", () => {
  const envelope = envelopeButton.querySelector(".envelope");
  if (envelope.classList.contains("open")) return;

  envelope.classList.add("open");
  setTimeout(() => showScreen("letter-screen"), 1200);
});

seeGiftsButton.addEventListener("click", () => showScreen("gifts-screen"));

// Floating hearts in the background.
const heartLayer = document.querySelector(".floating-hearts");
setInterval(() => {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.45 ? "♡" : "♥";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 20}px`;
  heart.style.animationDuration = `${7 + Math.random() * 7}s`;
  heartLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
}, 900);

// Modal behavior.
const modals = [...document.querySelectorAll(".modal")];
const giftCards = [...document.querySelectorAll(".gift-card")];

giftCards.forEach((card) => {
  card.addEventListener("click", () => {
    const modal = document.getElementById(card.dataset.modal);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (modal.id === "memories-modal") {
      startMusic();
      startSlideshow();
    }
  });
});

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (modal.id === "memories-modal") {
    stopSlideshow();
    // Keep the song playing across the whole website.
  }
}

document.querySelectorAll(".close-modal").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.closest(".modal")));
});

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal.open");
    if (openModal) closeModal(openModal);
  }
});

// Photo gallery.
const photos = [
  { src: "photo-1.jpeg", caption: "A moment worth keeping forever ♡" },
  { src: "photo-2.jpeg", caption: "Every ordinary day feels special with you." },
  { src: "photo-3.jpeg", caption: "My favorite place is right beside you." },
  { src: "photo-4.jpeg", caption: "One of the many reasons I smile." },
  { src: "photo-5.jpeg", caption: "Us, in our own little world." },
  { src: "photo-6.jpeg", caption: "Another memory I never want to forget." },
  { src: "photo-7.jpeg", caption: "You make every chapter more beautiful." },
  { src: "photo-8.jpeg", caption: "More memories, more laughter, more love." }
];

let photoIndex = 0;
let slideshowTimer = null;
const mainPhoto = document.getElementById("main-photo");
const photoCaption = document.getElementById("photo-caption");
const photoDots = document.getElementById("photo-dots");

function createDots() {
  photos.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "photo-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show photo ${index + 1}`);
    dot.addEventListener("click", () => showPhoto(index));
    photoDots.appendChild(dot);
  });
}

function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  mainPhoto.style.opacity = "0";
  mainPhoto.style.transform = "scale(.985)";

  setTimeout(() => {
    mainPhoto.src = photos[photoIndex].src;
    photoCaption.textContent = photos[photoIndex].caption;
    mainPhoto.style.opacity = "1";
    mainPhoto.style.transform = "scale(1)";
  }, 180);

  [...photoDots.children].forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === photoIndex));
}

mainPhoto.style.transition = "opacity .35s ease, transform .35s ease";
document.getElementById("prev-photo").addEventListener("click", () => showPhoto(photoIndex - 1));
document.getElementById("next-photo").addEventListener("click", () => showPhoto(photoIndex + 1));

function startSlideshow() {
  stopSlideshow();
  slideshowTimer = setInterval(() => showPhoto(photoIndex + 1), 4300);
}
function stopSlideshow() {
  if (slideshowTimer) clearInterval(slideshowTimer);
  slideshowTimer = null;
}

createDots();
showPhoto(0);

// Local music player.
const birthdayAudio = document.getElementById("birthday-audio");
birthdayAudio.loop = true;
const recordButton = document.getElementById("record-button");
const musicToggleText = document.getElementById("music-toggle-text");
const musicStatus = document.getElementById("music-status");

let isMusicPlaying = false;

function startMusic() {
  if (birthdayAudio.paused) {
    recordButton.classList.add("ready-to-play");
    musicStatus.textContent = "Tap the record to continue the song ♪";
  } else {
    recordButton.classList.add("playing");
    recordButton.classList.remove("ready-to-play");
    musicToggleText.textContent = "Our song is playing ♡";
    musicStatus.textContent = "Playing continuously from 1:23 ♪";
  }
}

function pauseMusic() {
  birthdayAudio.pause();
  birthdayAudio.currentTime = MUSIC_START_SECONDS;
  isMusicPlaying = false;
  recordButton.classList.remove("playing");
  recordButton.classList.add("ready-to-play");
  musicToggleText.textContent = "Tap the record to play our song";
  musicStatus.textContent = "Music paused.";
}

recordButton.addEventListener("click", async () => {
  try {
    if (!isMusicPlaying) {
      birthdayAudio.currentTime = MUSIC_START_SECONDS;
      await birthdayAudio.play();
      isMusicPlaying = true;
      recordButton.classList.remove("ready-to-play");
      recordButton.classList.add("playing");
      musicToggleText.textContent = "Our song is playing ♡";
      musicStatus.textContent = "Playing from 1:23 ♪";
    } else {
      pauseMusic();
    }
  } catch (error) {
    musicStatus.textContent = "Add the file assets/song.mp3, then tap again.";
  }
});

birthdayAudio.addEventListener("ended", () => {
  birthdayAudio.currentTime = MUSIC_START_SECONDS;
  birthdayAudio.play().catch(() => {});
});

// Birthday confetti.
document.getElementById("blow-candles").addEventListener("click", (event) => {
  event.currentTarget.textContent = "Your wish is on its way ♡";
  const colors = ["#b86b6b", "#e0a5a0", "#f2c9a5", "#ffffff", "#8e5d55"];

  for (let i = 0; i < 85; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * .8}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3600);
  }
});


// Open Memories when the record on the message page is clicked.
document.querySelectorAll(".message-record-button").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.getElementById(button.dataset.modal);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    startMusic();
    startSlideshow();
  });
});

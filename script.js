// ==========================
// MÚSICA Y CONTROL DE INICIO (PORTAL)
// ==========================

const music = document.getElementById("bg-music");
const portalInit = document.getElementById("portal-init");
const skipBtn = document.getElementById("skip");
const intro = document.getElementById("intro");
const portal = document.getElementById("portal");

const pages = document.querySelectorAll(".page");

let heartInterval = null;
let currentScene = 0;

// ==========================
// LIBRO / HISTORIA
// ==========================

function showScene(index) {

  if (index > 0) {
    pages[index - 1].classList.add("flipped");
  }

  pages.forEach((p, i) => {
    p.style.zIndex = i < index ? i : pages.length - i;
  });
}

function openInvitation() {

  console.log("Iniciando experiencia...");

  // Música
  music.currentTime = 0;
  music.volume = 1.0;
  music.play().catch(e => console.log("Audio bloqueado:", e));

  // Ocultar pantalla inicial
  portalInit.style.opacity = "0";
  portalInit.style.pointerEvents = "none";

  setTimeout(() => {
    portalInit.style.display = "none";
    intro.classList.remove("hidden");
    beginIntro();
  }, 800);
}

function beginIntro() {

  currentScene = 0;

  pages.forEach((p, i) => {
    p.classList.remove("flipped");
    p.style.setProperty("--index", i);
  });

  showScene(0);

  const introInterval = setInterval(() => {

    currentScene++;

    if (currentScene < pages.length) {
      showScene(currentScene);
    } else {
      clearInterval(introInterval);
      setTimeout(endIntro, 1500);
    }

  }, 5000);

  skipBtn.onclick = () => {
    clearInterval(introInterval);
    endIntro();
  };
}

// ==========================
// FINAL INTRO
// ==========================

function endIntro() {

  console.log("Revelando invitación final...");

  intro.style.opacity = "0";

  setTimeout(() => {

    intro.style.display = "none";
    portal.classList.add("opened");

    const content = document.getElementById("content");
    content.classList.remove("hidden");

    // Animaciones cascada
    const revealedItems = document.querySelectorAll(".reveal");

    revealedItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("active");
      }, index * 150);
    });

    // ✅ CORAZONES CONTROLADOS (ANTES CONGELABA)
    if (!heartInterval) {
      heartInterval = setInterval(createHeart, 1500);
    }

    startColibri();

    // Limpieza portal
    setTimeout(() => {

      portal.style.display = "none";
      document.body.style.overflow = "auto";

      setTimeout(() => {
        window.scrollTo({
          top: content.offsetTop + 100,
          behavior: "smooth"
        });
      }, 1000);

    }, 2500);

  }, 800);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================
// CORAZONES OPTIMIZADOS
// ==========================

function createHeart() {

  const heart = document.createElement("div");
  heart.className = "heart";

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = (Math.random() * 2 + 4) + "s";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7000);
}

// ==========================
// SCROLL ANIMATIONS
// ==========================

const observer = new IntersectionObserver((entries, obs) => {

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      obs.unobserve(entry.target);
    }
  });

}, {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
});

document.querySelectorAll(".reveal")
  .forEach(el => observer.observe(el));


// ==========================
// COLIBRÍ OPTIMIZADO (GPU)
// ==========================

const colibri = document.querySelector(".colibri");

function getRandomPosition() {

  const padding = 60;

  return {
    x: Math.random() * (window.innerWidth - padding * 2) + padding,
    y: Math.random() * (window.innerHeight - padding * 2) + padding
  };
}

function fly() {

  if (!colibri) return;

  const { x, y } = getRandomPosition();

  // GPU acceleration
  colibri.style.willChange = "transform";

  colibri.style.transform =
    `translate(${x}px, ${y}px) scaleX(${Math.random() > 0.5 ? 1 : -1})`;

  const duration = Math.random() * 3 + 4;

  colibri.style.transition = `transform ${duration}s ease-in-out`;

  setTimeout(fly, duration * 1000 + 1500);
}

function startColibri() {

  if (!colibri) return;

  colibri.style.display = "block";
  colibri.style.transform = "translate(-100px, 50vh)";

  setTimeout(fly, 1000);
}
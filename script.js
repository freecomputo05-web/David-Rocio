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
    intro.classList.add("active");
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

    // Forzar scroll arriba para evitar saltos
    window.scrollTo(0, 0);

    // ✅ EXPLOSIÓN DE CORAZONES ROJOS (Justo al abrir)
    for (let i = 0; i < 40; i++) {
      setTimeout(createHeart, i * 80);
    }

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


    // Limpieza portal
    setTimeout(() => {
      portal.style.display = "none";
      document.body.style.overflow = "auto";

      // Iniciar el scroll cinematográfico después de abrir
      setTimeout(startCinematicScroll, 1000);
    }, 2500);

  }, 800);

  // Removido auto-scroll al inicio
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



// ==========================
// CINEMATIC AUTO-SCROLL
// ==========================

let scrollPos = 0;
let isAutoScrolling = false;
let isPaused = false;
let pauseTimeout = null;

function startCinematicScroll() {
  if (isAutoScrolling) return;
  isAutoScrolling = true;
  scrollPos = window.scrollY;

  function scrollStep() {
    if (!isAutoScrolling) return;

    if (!isPaused) {
      scrollPos += 0.2; // Velocidad aún más lenta
      window.scrollTo(0, scrollPos);

      // Detener si llega al final
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        isAutoScrolling = false;
        return;
      }
    }
    requestAnimationFrame(scrollStep);
  }
  requestAnimationFrame(scrollStep);
}

function handleInteraction() {
  if (!isAutoScrolling) return;

  isPaused = true;
  if (pauseTimeout) clearTimeout(pauseTimeout);

  pauseTimeout = setTimeout(() => {
    isPaused = false;
    scrollPos = window.scrollY; // Ajustar a la posición actual antes de reanudar
  }, 4000);
}

// Escuchar clics en botones para pausar
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.tagName === "A" || e.target.closest("a")) {
    handleInteraction();
  }
});

// Detener totalmente si el usuario hace scroll manual fuerte (opcional)
window.addEventListener("wheel", handleInteraction, { passive: true });
window.addEventListener("touchstart", handleInteraction, { passive: true });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

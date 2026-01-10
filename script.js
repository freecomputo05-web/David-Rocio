// ==========================
// MÚSICA Y CONTROL DE INICIO (PORTAL)
// ==========================

const music = document.getElementById("bg-music");
const portalInit = document.getElementById("portal-init");
const scenes = document.querySelectorAll(".scene");
const storyText = document.getElementById("story-text");
const skipBtn = document.getElementById("skip");
const intro = document.getElementById("intro");
const portal = document.getElementById("portal");

const pages = document.querySelectorAll(".page");

function showScene(index) {
  // 1. Si no es la primera, flipeamos la anterior
  if (index > 0) {
    pages[index - 1].classList.add("flipped");
  }

  // 2. Actualizamos el texto
  const currentSceneEl = pages[index].querySelector(".scene");
  if (currentSceneEl) {
    storyText.textContent = currentSceneEl.dataset.text;
  }

  // 3. Ajuste de Z-Index
  pages.forEach((p, i) => {
    if (i < index) {
      p.style.zIndex = i;
    } else {
      p.style.zIndex = pages.length - i;
    }
  });
}

function openInvitation() {
  console.log("Iniciando experiencia...");

  // 1. Reproducir Música
  music.currentTime = 0;
  music.volume = 1.0;
  music.play().catch(e => console.log("Error de audio:", e));

  // 2. Ocultar Contenido Inicial (Corazón/Botón)
  portalInit.style.opacity = "0";
  portalInit.style.pointerEvents = "none";

  // 3. Mostrar Historia (Intro)
  setTimeout(() => {
    portalInit.style.display = "none";
    intro.classList.remove("hidden");
    beginIntro();
  }, 800);
}

function beginIntro() {
  currentScene = 0;

  // Reset book states
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

  // Skip logic
  skipBtn.onclick = () => {
    clearInterval(introInterval);
    endIntro();
  };
}

function endIntro() {
  console.log("Revelando invitación final...");

  // Ocultar historia suavemente
  intro.style.opacity = "0";

  setTimeout(() => {
    intro.style.display = "none";

    // 4. ABRIR LAS PUERTAS
    portal.classList.add("opened");

    // 5. MOSTRAR CONTENIDO CARTA
    const content = document.getElementById("content");
    content.classList.remove("hidden");

    // Animaciones de texto en cascada
    const revealedItems = document.querySelectorAll(".reveal");
    revealedItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("active");
      }, index * 150);
    });

    // Iniciar colibrí y corazones
    startColibri();
    if (typeof startHearts === 'undefined') {
      setInterval(createHeart, 500);
    }

    // Limpieza portal
    setTimeout(() => {
      portal.style.display = "none";
      document.body.style.overflow = "auto";
    }, 2500);

  }, 800);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================
// CORAZONES FLOTANTES
// ==========================
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 3 + 5 + "s";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}

// ==========================
// SCROLL ANIMATIONS
// ==========================
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ==========================
// HUMMINGBIRD FLIGHT LOGIC
// ==========================
const colibri = document.querySelector(".colibri");

function getRandomPosition() {
  const padding = 50;
  const x = Math.random() * (window.innerWidth - padding * 2) + padding;
  const y = Math.random() * (window.innerHeight - padding * 2) + padding;
  return { x, y };
}

function fly() {
  const { x, y } = getRandomPosition();
  const currentX = parseFloat(colibri.style.left) || 0;
  colibri.style.transform = x > currentX ? "scaleX(1)" : "scaleX(-1)";
  colibri.style.left = `${x}px`;
  colibri.style.top = `${y}px`;
  const duration = Math.random() * 3 + 4;
  colibri.style.transition = `all ${duration}s ease-in-out`;
  setTimeout(fly, duration * 1000 + Math.random() * 2000 + 1000);
}

function startColibri() {
  if (!colibri) return;
  colibri.style.display = "block";
  colibri.style.left = "-100px";
  colibri.style.top = "50%";
  setTimeout(fly, 1000);
}

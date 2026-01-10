// ==========================
// INTRO HISTORIA
// ==========================

const scenes = document.querySelectorAll(".scene");
const storyText = document.getElementById("story-text");
const skipBtn = document.getElementById("skip");
const intro = document.getElementById("intro");
const portal = document.getElementById("portal");

let currentScene = 0;

function showScene(index) {
  scenes.forEach(s => s.classList.remove("active"));
  scenes[index].classList.add("active");
  storyText.textContent = scenes[index].dataset.text;
}

showScene(0);

const introInterval = setInterval(() => {
  currentScene++;
  if (currentScene < scenes.length) {
    showScene(currentScene);
  } else {
    endIntro();
  }
}, 4000);

function endIntro() {
  clearInterval(introInterval);
  intro.style.display = "none";
  portal.style.display = "flex";
}

skipBtn.addEventListener("click", endIntro);

// ==========================
// MÚSICA
// ==========================

const overlay = document.getElementById("start-overlay");
const music = document.getElementById("bg-music");

overlay.addEventListener("click", () => {
  music.currentTime = 0;
  music.volume = 1.0;
  music.play().then(() => {
    overlay.remove();
  });
}, { once: true });

// ==========================
// ABRIR INVITACIÓN (A PRUEBA DE BALAS)
// ==========================
function openInvitation() {
  console.log("Abriendo invitación");

  // Ocultar portal
  portal.style.display = "none";

  // MOSTRAR CONTENIDO PRINCIPAL
  const content = document.getElementById("content");
  content.classList.remove("hidden");

  // Iniciar colibrí viajero
  startColibri();

  // Seleccionar invitación
  const invitation = document.querySelector(".invitation");

  // Forzar render
  invitation.offsetHeight;

  // Activar animaciones
  invitation.classList.add("animate");

  // Animaciones en cascada
  const items = invitation.querySelectorAll(
    ".letter-opening, .letter-text, .event, .letter-closing, .quote"
  );

  items.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.25}s`;
  });

  // Habilitar scroll
  document.body.style.overflow = "auto";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================
// CORAZONES FLOTANTES
// ==========================
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");

  // Posición horizontal aleatoria
  heart.style.left = Math.random() * 100 + "vw";

  // Duración aleatoria para variedad
  heart.style.animationDuration = Math.random() * 3 + 5 + "s"; // 5s a 8s

  document.body.appendChild(heart);

  // Limpieza
  setTimeout(() => {
    heart.remove();
  }, 8000);
}

// Crear corazones cada cierto tiempo
setInterval(createHeart, 800);

const colibri = document.querySelector(".colibri");

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

function getRandomPosition() {
  const padding = 50;
  const x = Math.random() * (window.innerWidth - padding * 2) + padding;
  const y = Math.random() * (window.innerHeight - padding * 2) + padding;
  return { x, y };
}

function fly() {
  const { x, y } = getRandomPosition();

  const currentX = parseFloat(colibri.style.left) || 0;

  // Determine direction to face
  if (x > currentX) {
    colibri.style.transform = "scaleX(1)"; // Face right
  } else {
    colibri.style.transform = "scaleX(-1)"; // Face left
  }

  colibri.style.left = `${x}px`;
  colibri.style.top = `${y}px`;

  // Randomize speed and pause duration
  const duration = Math.random() * 3 + 4; // 4s to 7s
  colibri.style.transition = `all ${duration}s ease-in-out`;

  const pause = Math.random() * 2000 + 1000; // 1s to 3s pause
  setTimeout(fly, duration * 1000 + pause);
}

// Start flight logic
function startColibri() {
  if (!colibri) return;
  colibri.style.display = "block";

  // Posición inicial
  colibri.style.left = "-100px";
  colibri.style.top = "50%";

  setTimeout(fly, 1000);
}

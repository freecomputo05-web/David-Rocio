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
  console.log("Abriendo invitación...");

  const portal = document.getElementById("portal");
  const content = document.getElementById("content");

  // Agregar clase para animar apertura de puertas
  portal.classList.add("opened");

  // Pequeño delay antes de mostrar el fondo para que se vea el inicio de la apertura
  setTimeout(() => {
    content.classList.remove("hidden");

    // Revelar elementos en cascada (para que aparezcan suavemente)
    const revealedItems = document.querySelectorAll(".reveal");
    revealedItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("active");
      }, index * 200);
    });
  }, 600);

  // Iniciar elementos románticos (Colibrí y Corazones)
  startColibri();
  setInterval(createHeart, 500);

  // Eliminar el portal del DOM después de que termine la animación (2.5s)
  setTimeout(() => {
    portal.style.display = "none";
    document.body.style.overflow = "auto";
  }, 2500);

  // Asegurar que estamos al principio de la página
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

// Corazones se inician al abrir invitación

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

const INICIO = new Date("2025-10-07T15:30:00");

// ===== MÚSICA =====
const audio = document.getElementById("audio");
const botonMusica = document.getElementById("botonMusica");
let musicaIniciada = false;

function iniciarMusica() {
  if (musicaIniciada) return;
  musicaIniciada = true;
  audio.volume = 0.8;
  const intento = audio.play();
  if (intento !== undefined) {
    intento.catch(() => { musicaIniciada = false; });
  }
}

window.addEventListener("load", () => {
  iniciarMusica();
  botonMusica.classList.add("sonando");
});
["pointerdown", "touchstart", "keydown"].forEach((ev) => {
  document.addEventListener(ev, iniciarMusica, { once: true });
});

botonMusica.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {});
    botonMusica.classList.add("sonando");
  } else {
    audio.pause();
    botonMusica.classList.remove("sonando");
  }
});

// ===== INTRO: corazón líquido que se llena =====
const intro = document.getElementById("intro");
const introMsg = document.getElementById("introMsg");
const contCorazon = document.getElementById("contCorazon");
const cubierta = document.getElementById("cubierta");

const HEART_TOP = 6;
const HEART_BOTTOM = 92;
const HRANGE = HEART_BOTTOM - HEART_TOP;
let progreso = 0;
let animando = false;
const PASO = 20;

document.body.style.overflow = "hidden";

function setLiquido(p) {
  const dy = HEART_BOTTOM - (p / 100) * HRANGE;
  const amp = 3;
  cubierta.setAttribute("d",
    "M0 0 L100 0 L100 " + dy +
    " Q 88 " + (dy - amp) + " 76 " + dy +
    " T 52 " + dy + " T 28 " + dy + " T 4 " + dy + " T 0 " + dy +
    " L0 0 Z");
}

function animarLiquido(de, a, dur) {
  const tiempo = dur || 520;
  return new Promise((res) => {
    const t0 = performance.now();
    (function paso(t) {
      const p = Math.min(1, (t - t0) / tiempo);
      const e = 1 - Math.pow(1 - p, 3);
      setLiquido(de + (a - de) * e);
      if (p < 1) requestAnimationFrame(paso);
      else res();
    })(t0);
  });
}

function corazonesMini(cantidad) {
  const n = cantidad || 7;
  for (let i = 0; i < n; i++) {
    const c = document.createElement("span");
    c.className = "mini-c";
    c.textContent = "\u2665";
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 90;
    c.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    c.style.setProperty("--dy", Math.sin(ang) * dist + "px");
    contCorazon.appendChild(c);
    setTimeout(() => c.remove(), 950);
  }
}

async function llenarIntro() {
  if (animando) return;
  iniciarMusica();
  animando = true;
  const desde = progreso;
  progreso = Math.min(100, progreso + PASO);
  await animarLiquido(desde, progreso);
  corazonesMini();
  animando = false;
  if (progreso === 100) {
    introMsg.textContent = "\u00A1Abrimos tu regalo!";
    corazonesMini(12);
    intro.classList.add("oculta");
    document.body.style.overflow = "";
    setTimeout(() => intro.remove(), 1100);
  }
}

setLiquido(0);

intro.addEventListener("click", llenarIntro);
intro.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    llenarIntro();
  }
});

function actualizarContador() {
  const ahora = new Date();
  let diff = Math.max(0, ahora - INICIO);

  const dias = Math.floor(diff / 86400000); diff %= 86400000;
  const horas = Math.floor(diff / 3600000); diff %= 3600000;
  const minutos = Math.floor(diff / 60000); diff %= 60000;
  const segundos = Math.floor(diff / 1000);

  document.getElementById("dias").textContent = dias;
  document.getElementById("horas").textContent = horas;
  document.getElementById("minutos").textContent = minutos;
  document.getElementById("segundos").textContent = segundos;
}

actualizarContador();
setInterval(actualizarContador, 1000);

// Sobre / carta
const sobre = document.getElementById("sobre");
const carta = document.getElementById("carta");

function alternarCarta() {
  sobre.classList.toggle("abierto");
  carta.classList.toggle("abierta");
}

sobre.addEventListener("click", alternarCarta);
sobre.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    alternarCarta();
  }
});

// Pétalos cayendo
const contenedor = document.getElementById("petalos");
for (let i = 0; i < 18; i++) {
  const petalo = document.createElement("span");
  petalo.className = "petalo";
  petalo.textContent = Math.random() > 0.5 ? "\u{1F338}" : "\u2764\uFE0F";
  petalo.style.left = Math.random() * 100 + "vw";
  petalo.style.animationDuration = 6 + Math.random() * 8 + "s";
  petalo.style.animationDelay = Math.random() * 10 + "s";
  petalo.style.fontSize = 14 + Math.random() * 14 + "px";
  contenedor.appendChild(petalo);
}

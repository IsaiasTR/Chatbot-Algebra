/* ===============================
   VARIABLES
================================ */

const chatContainer = document.querySelector(".chat-container");
const input = document.querySelector(".chat-input input");
const button = document.querySelector(".chat-input button");

const BOT_NAME = "Isaias-Bot";
const TIEMPO_ESCRIBIENDO = 1200; // ms (ajustable)

/* ===============================
   SONIDO ARTIFICIAL SUAVE
================================ */

let audioContext;

function playTypingSound() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = "sine";
  osc.frequency.value = 750; // tono suave
  gain.gain.value = 0.04;    // volumen bajo

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + 0.07);
}

/* ===============================
   FUNCIONES DE MENSAJES
================================ */

function agregarMensaje(texto, clase) {
  const div = document.createElement("div");
  div.classList.add("mensaje", clase);
  div.innerHTML = texto;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function mostrarEscribiendo() {
  const div = document.createElement("div");
  div.classList.add("mensaje", "bot", "escribiendo");
  div.id = "typing-indicator";

  div.innerHTML = `<strong>${BOT_NAME}</strong> está escribiendo<span class="dots"></span>`;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // sonido leve repetido
  playTypingSound();
  setTimeout(playTypingSound, 300);
  setTimeout(playTypingSound, 600);
}

function eliminarEscribiendo() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

/* ===============================
   RESPUESTA DEL BOT (DEMO)
================================ */

function respuestaBot(mensajeUsuario) {
  // Acá después podés conectar tus JSON, IA, etc.
  return `Recibí tu mensaje: <strong>${mensajeUsuario}</strong>`;
}

/* ===============================
   EVENTOS
================================ */

function enviarMensaje() {
  const texto = input.value.trim();
  if (texto === "") return;

  agregarMensaje(texto, "usuario");
  input.value = "";

  mostrarEscribiendo();

  setTimeout(() => {
    eliminarEscribiendo();
    const respuesta = respuestaBot(texto);
    agregarMensaje(`<strong>${BOT_NAME}</strong><br>${respuesta}`, "bot");
  }, TIEMPO_ESCRIBIENDO);
}

button.addEventListener("click", enviarMensaje);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    enviarMensaje();
  }
});

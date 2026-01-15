let ejercicios = [];

/* ===============================
   CARGA DE MÚLTIPLES JSON
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const archivos = [
    "guia1.json",
    "guia2.json"
  ];

  Promise.all(
    archivos.map(a => fetch(a).then(r => r.json()))
  )
    .then(data => {
      ejercicios = data.flat();

      mensajeBot(
        "Hola 👋 Soy Isaias-Bot, el asistente virtual de <strong>Álgebra</strong>.<br>" +
        "Cátedra: <strong>Vázquez Magnani</strong>.<br><br>" +
        "Podés buscar de la siguiente forma (ej: <em>resolución ejercicio 3 guía 1</em>)"
      );
    })
    .catch(() => {
      mensajeBot("❌ Error al cargar los ejercicios.");
    });
});

/* ===============================
   MENSAJES
================================ */

function mensajeUsuario(texto) {
  const chat = document.getElementById("chat-container");
  const div = document.createElement("div");
  div.className = "mensaje usuario";
  div.textContent = texto;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function mensajeBot(html) {
  const chat = document.getElementById("chat-container");
  const div = document.createElement("div");
  div.className = "mensaje bot";
  div.innerHTML = html;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function mensajeBotEscribiendo() {
  const chat = document.getElementById("chat-container");
  const div = document.createElement("div");
  div.className = "mensaje bot escribiendo";
  div.id = "bot-escribiendo";
  div.textContent = "Isaias-Bot está escribiendo...";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function borrarEscribiendo() {
  const escribiendo = document.getElementById("bot-escribiendo");
  if (escribiendo) escribiendo.remove();
}

/* ===============================
   BÚSQUEDA
================================ */

function buscar() {
  const input = document.getElementById("inputPregunta");
  const textoOriginal = input.value.trim();
  const texto = textoOriginal.toLowerCase();

  if (!texto) return;

  mensajeUsuario(textoOriginal);
  input.value = "";

  mensajeBotEscribiendo();

  setTimeout(() => {

    borrarEscribiendo();

    let respuesta = "";

    const pedirResolucion =
      texto.includes("resolucion") || texto.includes("resolución");

    const numeroMatch = texto.match(/\d+/);
    const numeroEjercicio = numeroMatch ? parseInt(numeroMatch[0]) : null;

    const guiaMatch = texto.match(/guia\s*(\d+)/);
    const numeroGuia = guiaMatch ? guiaMatch[1] : null;

    let coincidencias = 0;

    ejercicios.forEach(bloque => {
      bloque.ejercicios.forEach(ej => {
        if (pedirResolucion && numeroEjercicio === ej.numero && ej.resolucion) {
          coincidencias++;
        }
      });
    });

    if (pedirResolucion && !numeroGuia && coincidencias > 1) {
      mensajeBot(
        "Ese ejercicio aparece en más de una guía.<br><br>" +
        "Indicá la guía. Ejemplo:<br>" +
        "<em>resolución ejercicio 3 guía 1</em>"
      );
      return;
    }

    ejercicios.forEach(bloque => {

      if (
        numeroGuia &&
        !bloque.archivo.toLowerCase().includes(`guia ${numeroGuia}`)
      ) return;

      bloque.ejercicios.forEach(ej => {

        const contenido =
          bloque.titulo + " " +
          ej.enunciado + " " +
          (ej.expresiones ? ej.expresiones.join(" ") : "");

        if (
          pedirResolucion &&
          numeroEjercicio === ej.numero &&
          ej.resolucion
        ) {
          respuesta += `<strong>${bloque.titulo}</strong> (pág. ${bloque.pagina})<br>`;
          respuesta += `<strong>Ejercicio ${ej.numero}:</strong><br>`;
          respuesta += `<strong>${ej.enunciado}</strong><br><br>`;

          if (ej.expresiones) {
            ej.expresiones.forEach(e => {
              respuesta += `$$${e}$$`;
            });
            respuesta += "<br>";
          }

          respuesta += "<strong>Resolución:</strong><ul>";
          ej.resolucion.forEach(r => {
            respuesta += `<li>${r}</li>`;
          });
          respuesta += "</ul><br>";
        }

        if (!pedirResolucion && contenido.toLowerCase().includes(texto)) {
          respuesta += `<strong>${bloque.titulo}</strong><br>`;
          respuesta += `<strong>Ejercicio ${ej.numero}</strong><br>`;
          respuesta += `${ej.enunciado}<br><br>`;
        }
      });
    });

    if (respuesta === "") {
      mensajeBot("No encontré resultados para esa consulta.");
    } else {
      mensajeBot(respuesta);
    }

  }, 900); // ⏱️ delay de escritura (ms)
}

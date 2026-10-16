const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbyA4IZvuKuU4_9KS2URNj_DYQJQImsK0A_fe0sFIDC2fo1_-77fkSw50_eOVw8q-7IY/exec";

// 1. Sedes participantes (sin jurado)
const SEDES = [
  {
    id: "ent_1",
    nombre: "Altos Mirandinos",
    imagenUrl: "./imagenes/Altos Mirandinos.jpg",
  },
  { id: "ent_2", nombre: "Amazonas", imagenUrl: "./imagenes/Amazonas.jpeg" },
  { id: "ent_3", nombre: "Anzoátegui", imagenUrl: "./imagenes/Anzoategui.jpeg" },
  { id: "ent_4", nombre: "Apure", imagenUrl: "./imagenes/Apure.png" },
  { id: "ent_5", nombre: "Aragua", imagenUrl: "./imagenes/Aragua.jpg" },
  { id: "ent_6", nombre: "Barinas", imagenUrl: "./imagenes/Barinas.jpg" },
  { id: "ent_7", nombre: "Baruta", imagenUrl: "./imagenes/Baruta.png" },
  { id: "ent_8", nombre: "Bolívar", imagenUrl: "./imagenes/Bolívar.png" },
  { id: "ent_9", nombre: "Carabobo", imagenUrl: "./imagenes/Carabobo.png" },
  { id: "ent_10", nombre: "Cojedes", imagenUrl: "./imagenes/Cojedes.png" },
  {
    id: "ent_11",
    nombre: "Delta Amacuro",
    imagenUrl: "./imagenes/Delta Amacuro.png",
  },
  {
    id: "ent_12",
    nombre: "Eje Barlovento",
    imagenUrl: "./imagenes/Barlovento.png",
  },
  {
    id: "ent_13",
    nombre: "Eje Guarenas - Guatire",
    imagenUrl: "./imagenes/Guarenas.png",
  },
  { id: "ent_14", nombre: "Falcón", imagenUrl: "./imagenes/Falcón.jpeg" },
  {
    id: "ent_15",
    nombre: "La California",
    imagenUrl: "./imagenes/La California.jpg",
  },
  { id: "ent_16", nombre: "Lara", imagenUrl: "./imagenes/Lara.png" },
  { id: "ent_17", nombre: "Libertador", imagenUrl: "./imagenes/Libertador.png" },
  { id: "ent_18", nombre: "Mérida", imagenUrl: "./imagenes/Merida.jpeg" },
  { id: "ent_19", nombre: "Monagas", imagenUrl: "./imagenes/Monagas.png" },
  {
    id: "ent_20",
    nombre: "Nueva Esparta",
    imagenUrl: "./imagenes/Nueva Esparta.png",
  },
  { id: "ent_21", nombre: "Portuguesa", imagenUrl: "./imagenes/Portuguesa.png" },
  { id: "ent_22", nombre: "Sucre", imagenUrl: "./imagenes/Sucre.jpeg" },
  { id: "ent_23", nombre: "Táchira", imagenUrl: "./imagenes/Tachira.jpg" },
  { id: "ent_24", nombre: "Trujillo", imagenUrl: "./imagenes/Trujillo.png" },
  {
    id: "ent_25",
    nombre: "Valles el Tuy",
    imagenUrl: "./imagenes/Valles del Tuy.png",
  },
  { id: "ent_26", nombre: "Yaracuy", imagenUrl: "./imagenes/Yaracuy.png" },
  { id: "ent_27", nombre: "Zulia", imagenUrl: "./imagenes/Zulia.png" },
  {
    id: "ent_28",
    nombre: "Sede Nacional",
    imagenUrl: "./imagenes/Dirección General.png",
  },
];

// 2. Las 4 Categorías solicitadas
const CATEGORIAS = [
  {
    clave: "logoRedes",
    nombre: "Logo de Redes Sociales",
    descripcion:
      "Selecciona la mejor propuesta de diseño y adaptación gráfica para el Logo de Redes Sociales.",
  },
  {
    clave: "agendaInstitucional",
    nombre: "Agenda Institucional",
    descripcion:
      "Selecciona el mejor diseño y presentación visual para la Agenda Institucional.",
  },
  {
    clave: "trofeoParamedicos",
    nombre: "Trofeo para el curso de Paramédicos de Combate",
    descripcion:
      "Selecciona la propuesta más destacada y representativa para el Trofeo del curso.",
  },
  {
    clave: "vasoTermico",
    nombre: "Vaso térmico",
    descripcion:
      "Selecciona el diseño más original y funcional presentado para el Vaso térmico.",
  },
];

let votanteActualId = null;
let votanteActualNombre = null;
let pasoActual = 0; // 0 a 3: Categorías, 4: Revisión
const votosSeleccionados = {}; // { logoRedes: { id, nombre, imagenUrl }, ... }

// Referencias DOM
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownMenu = document.getElementById("dropdown-menu");
const dropdownTexto = document.getElementById("dropdown-texto");
const badgeEstado = document.getElementById("badge-estado");
const wizardContainer = document.getElementById("wizard-container");
const panelVotacion = document.getElementById("panel-votacion");
const panelRevision = document.getElementById("panel-revision");
const catTitulo = document.getElementById("cat-titulo");
const catDescripcion = document.getElementById("cat-descripcion");
const gridObras = document.getElementById("grid-obras");
const btnCatPrev = document.getElementById("btn-cat-prev");
const btnCatNext = document.getElementById("btn-cat-next");
const revisionGrid = document.getElementById("revision-grid");
const btnConfirmarFinal = document.getElementById("btn-confirmar-final");
const mensajeEstado = document.getElementById("mensaje-estado");

const modal = document.getElementById("lightbox-modal");
const modalImg = document.getElementById("lightbox-img");
const modalCaption = document.getElementById("lightbox-caption");
const modalClose = document.getElementById("lightbox-close");

// Poblar el menú desplegable
SEDES.forEach((sede) => {
  const li = document.createElement("li");
  li.className = "dropdown-item";
  li.dataset.value = sede.id;
  li.dataset.nombre = sede.nombre;
  li.textContent = sede.nombre;
  dropdownMenu.appendChild(li);
});

dropdownBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
  dropdownBtn.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove("show");
    dropdownBtn.classList.remove("active");
  }
});

dropdownMenu.addEventListener("click", (e) => {
  const item = e.target.closest(".dropdown-item");
  if (!item) return;

  const id = item.dataset.value;
  const nombre = item.dataset.nombre;

  dropdownMenu.classList.remove("show");
  dropdownBtn.classList.remove("active");

  if (
    confirm(
      `¿Confirmas que representas a "${nombre}"?\nUna vez confirmado no podrás modificar tu sede.`,
    )
  ) {
    localStorage.setItem("votante_bloqueado_linea_4cat", id);
    fijarIdentidad(id, nombre);
  }
});

// Control de bloqueo previo
const votanteGuardado = localStorage.getItem("votante_bloqueado_linea_4cat");
const votoCompletado = localStorage.getItem("voto_realizado_linea_4cat");

if (votoCompletado) {
  dropdownBtn.disabled = true;
  wizardContainer.style.display = "block";
  panelVotacion.style.display = "none";
  panelRevision.style.display = "block";
  panelRevision.innerHTML =
    "<h1 style='color: #16a34a;'>¡Muchas gracias por tu Voto!</h1><h3>Ya has emitido tus votos desde este dispositivo.</h3><p style='color:#16a34a;font-weight:bold;'>✓ Registro completado.</p>";
} else if (votanteGuardado) {
  const sede = SEDES.find((s) => s.id === votanteGuardado);
  if (sede) fijarIdentidad(sede.id, sede.nombre);
}

function fijarIdentidad(id, nombre) {
  votanteActualId = id;
  votanteActualNombre = nombre;
  dropdownTexto.textContent = nombre;
  dropdownBtn.disabled = true;
  dropdownBtn.classList.remove("active");
  dropdownMenu.classList.remove("show");
  badgeEstado.textContent = `🔒 Sede identificada: ${nombre}`;

  wizardContainer.style.display = "block";
  irACategoria(0);
}

function actualizarStepper() {
  for (let i = 0; i < 5; i++) {
    const stepEl = document.getElementById(`step-nav-${i}`);
    stepEl.classList.remove("active", "completed");
    if (i < pasoActual) {
      stepEl.classList.add("completed");
    } else if (i === pasoActual) {
      stepEl.classList.add("active");
    }
  }
}

function irACategoria(indice) {
  pasoActual = indice;
  actualizarStepper();

  if (pasoActual < 4) {
    panelVotacion.style.display = "block";
    panelRevision.style.display = "none";

    const cat = CATEGORIAS[pasoActual];
    catTitulo.textContent = `Categoría ${pasoActual + 1}: ${cat.nombre}`;
    catDescripcion.textContent = cat.descripcion;

    btnCatPrev.style.display = pasoActual > 0 ? "inline-block" : "none";
    btnCatNext.textContent =
      pasoActual === 3 ? "Ir a Revisión Final →" : "Siguiente categoría →";

    renderizarObrasCategoria(cat.clave);
  } else {
    mostrarPantallaRevision();
  }
}

// Renderizar propuestas excluyendo la propia sede
function renderizarObrasCategoria(claveCat) {
  gridObras.innerHTML = "";

  // Se excluyen las imágenes de la propia sede seleccionada
  const disponibles = SEDES.filter((s) => s.id !== votanteActualId);
  const seleccionPrevia = votosSeleccionados[claveCat];

  btnCatNext.disabled = !seleccionPrevia;

  disponibles.forEach((item) => {
    const esSeleccionada = seleccionPrevia && seleccionPrevia.id === item.id;
    const card = document.createElement("div");
    card.className = `card-obra ${esSeleccionada ? "selected" : ""}`;
    card.id = `card-${item.id}`;
    card.innerHTML = `
          <div class="img-wrapper" title="Haz clic para ampliar">
            <img src="${item.imagenUrl}" alt="Propuesta de ${item.nombre}" loading="lazy">
            <span class="zoom-hint">🔍 Ampliar</span>
          </div>
          <h3>${item.nombre}</h3>
          <button type="button" class="btn-select">${esSeleccionada ? "✓ Seleccionada" : "Elegir esta propuesta"}</button>
        `;

    const wrapper = card.querySelector(".img-wrapper");
    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirModal(item.imagenUrl, item.nombre, CATEGORIAS[pasoActual].nombre);
    });

    const btnVotar = card.querySelector(".btn-select");
    btnVotar.addEventListener("click", () => {
      seleccionarParaCategoria(claveCat, item);
    });

    gridObras.appendChild(card);
  });
}

function seleccionarParaCategoria(claveCat, obra) {
  votosSeleccionados[claveCat] = obra;

  document.querySelectorAll(".card-obra").forEach((c) => {
    c.classList.remove("selected");
    c.querySelector(".btn-select").textContent = "Elegir esta propuesta";
  });

  const card = document.getElementById(`card-${obra.id}`);
  if (card) {
    card.classList.add("selected");
    card.querySelector(".btn-select").textContent = "✓ Seleccionada";
  }

  btnCatNext.disabled = false;
}

btnCatNext.addEventListener("click", () => {
  if (pasoActual < 4) {
    irACategoria(pasoActual + 1);
    window.scrollTo({
      top: wizardContainer.offsetTop - 20,
      behavior: "smooth",
    });
  }
});

btnCatPrev.addEventListener("click", () => {
  if (pasoActual > 0) {
    irACategoria(pasoActual - 1);
    window.scrollTo({
      top: wizardContainer.offsetTop - 20,
      behavior: "smooth",
    });
  }
});

// Pantalla de Revisión Final
function mostrarPantallaRevision() {
  panelVotacion.style.display = "none";
  panelRevision.style.display = "block";
  actualizarStepper();

  revisionGrid.innerHTML = "";

  CATEGORIAS.forEach((cat, idx) => {
    const eleccion = votosSeleccionados[cat.clave];
    const card = document.createElement("div");
    card.className = "revision-card";
    card.innerHTML = `
          <h4>${cat.nombre}</h4>
          <img src="${eleccion.imagenUrl}" alt="${eleccion.nombre}">
          <p>${eleccion.nombre}</p>
          <button type="button" class="btn-cambiar">Modificar</button>
        `;

    card.querySelector(".btn-cambiar").addEventListener("click", () => {
      irACategoria(idx);
    });

    revisionGrid.appendChild(card);
  });
}

// Envío del voto final
btnConfirmarFinal.addEventListener("click", async () => {
  if (Object.keys(votosSeleccionados).length < 4) {
    alert("Debes completar la selección en las 4 categorías antes de enviar.");
    return;
  }

  btnConfirmarFinal.disabled = true;
  mensajeEstado.textContent = "Registrando tus votos...";
  mensajeEstado.style.color = "#475569";

  const payload = {
    tipo: "linea",
    votante: votanteActualNombre,
    votos: {
      logoRedes: votosSeleccionados["logoRedes"].nombre,
      agendaInstitucional: votosSeleccionados["agendaInstitucional"].nombre,
      trofeoParamedicos: votosSeleccionados["trofeoParamedicos"].nombre,
      vasoTermico: votosSeleccionados["vasoTermico"].nombre,
    },
  };

  try {
    await fetch(URL_APPS_SCRIPT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    localStorage.setItem("voto_realizado_linea_4cat", "true");
    panelRevision.innerHTML = `
          <h1 style="color: #16a34a;">¡Muchas gracias por tu voto!</h1>
          <h2 style="color: #16a34a;">¡Votación Completada con Éxito!</h2>
          <p>Tus elecciones en las 4 categorías han sido registradas por <strong>${votanteActualNombre}</strong>.</p>
        `;
  } catch (err) {
    mensajeEstado.textContent =
      "Error al enviar los datos. Intenta nuevamente.";
    mensajeEstado.style.color = "#dc2626";
    btnConfirmarFinal.disabled = false;
  }
});

// Lightbox Modal
function abrirModal(src, nombre, categoria) {
  modalImg.src = src;
  modalCaption.textContent = `${nombre} — [${categoria}]`;
  modal.classList.add("active");
}

function cerrarModal() {
  modal.classList.remove("active");
  modalImg.src = "";
}

modalClose.addEventListener("click", cerrarModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) cerrarModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) cerrarModal();
});

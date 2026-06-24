const ruleta = document.getElementById('ruleta');
const botonGirar = document.getElementById('botonGirar');
const preguntaContainer = document.getElementById("pregunta-container");
let vidas = parseInt(localStorage.getItem("vidas")) || 3;
let aciertos = parseInt(localStorage.getItem("aciertos")) || 0;

function guardarInfo() {
    localStorage.setItem("vidas", vidas);
    localStorage.setItem("aciertos", aciertos);
}
window.addEventListener("load", () => {
    actualizarMarcador();
});




const categorias = [
    "GTA IV",
    "TEAM Fortress 2",
    "LEFT 4 DEAD 2",
    "MAFIA III",
    "EXTRA API",
];

const mapaCategorias = {
    "GTA IV": "gta4",
    "TEAM Fortress 2": "tf2",
    "LEFT 4 DEAD 2": "l4d2",
    "MAFIA III": "mafia3"
};

const ImgCategorias = {
    "GTA IV": "img/gta IV banner.jfif",
    "TEAM Fortress 2": "img/TF banner.jpg",
    "LEFT 4 DEAD 2": "img/l4d2 banner.jpg",
    "MAFIA III": "img/mafiaIII banner.jpeg",
    "EXTRA API": "img/pregunta banner.jfif"
}

const URL_API =
    "https://opentdb.com/api.php?amount=1&category=15&type=multiple";

let gradosTotales = 0;
let preguntas = {};
let respuestaCorrecta = "";

function actualizarMarcador() {
    const vidasVisual = document.getElementById('vidasVisual');
    const aciertosVisual = document.getElementById('aciertosVisual');

    if (vidasVisual) {
        vidasVisual.textContent = "❤️".repeat(vidas) || " ¡Sin vidas!";
    }
    if (aciertosVisual) {
        aciertosVisual.textContent = aciertos;
    }
}

async function obtenerPreguntaAPI() {
    const respuesta = await fetch(URL_API);
    const datos = await respuesta.json();
    console.log(datos);

    const preguntaAPI = datos.results[0];

    const opciones = [
        ...preguntaAPI.incorrect_answers,
        preguntaAPI.correct_answer
    ];

    opciones.sort(() => Math.random() - 0.5);

    return {
        pregunta: preguntaAPI.question,
        opciones: opciones,
        correcta: preguntaAPI.correct_answer
    };
}

function mostrarPregunta(pregunta, categoria) {
    respuestaCorrecta = pregunta.correcta;

    preguntaContainer.innerHTML = `
        <img class="imagenJuego" src="${ImgCategorias[categoria]}" alt="${categoria}">
        <h2>${pregunta.pregunta}</h2>
        <div class="opciones-container">
            ${pregunta.opciones.map(op => `<button class="opcioness">${op}</button>`).join('')}
        </div>
    `;
    preguntaContainer.classList.remove("oculto");

    // Seleccionamos los nuevos botones creados
    const botones = document.querySelectorAll(".opcioness");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const respuestaUsuario = boton.textContent.trim();
            const esCorrecta = respuestaUsuario === respuestaCorrecta.trim();

            // Bloqueamos botones para que no sigan haciendo clic
            botones.forEach(b => b.disabled = true);

            if (esCorrecta) {
                // SUMAR ACIERTOS
                aciertos++;
                guardarInfo();
                boton.style.backgroundColor = "green";
                boton.style.color = "white";
                actualizarMarcador();
            } else {
                // RESTAR VIDAS
                vidas--;
                guardarInfo();

                boton.style.backgroundColor = "red";
                boton.style.color = "white";
                actualizarMarcador();

                // Opcional: mostrar cuál era la correcta
                botones.forEach(b => {
                    if (b.textContent.trim() === respuestaCorrecta.trim()) {
                        b.style.backgroundColor = "green";
                    }
                });
            }
            
            if (vidas === 0) {
                botonGirar.disabled = true;
                preguntaContainer.innerHTML = "";
                mostrarPantaFinal();
            }

        });
    });
}

function mostrarPantaFinal() {
    console.log("PANTALLA FINAL");

    const pantallaFinal = document.getElementById("PantaFinal");
    const spanPuntos = document.getElementById("ultimaPuntuacion");

    spanPuntos.textContent = aciertos;

    pantallaFinal.style.display = "flex";
    pantallaFinal.classList.remove("oculto");

    botonGirar.disabled = true;
}








function obtenerPreguntaAleatoria(categoria) {

    const listaPreguntas = preguntas[categoria];

    const indiceAleatorio =
        Math.floor(Math.random() * listaPreguntas.length);

    return listaPreguntas[indiceAleatorio];
}

fetch("data.json")
    .then(respuesta => respuesta.json())
    .then(datos => {
        preguntas = datos;
        console.log("Preguntas cargadas");
    });

botonGirar.addEventListener('click', () => {
    botonGirar.disabled = true;
    preguntaContainer.classList.add("oculto");
    setTimeout(() => {
        preguntaContainer.innerHTML = "";
    }, 500);

    const giroAleatorio =
        Math.floor(Math.random() * 3000) + 3000;

    gradosTotales += giroAleatorio;

    ruleta.style.transform =
        `rotate(${gradosTotales}deg)`;
});


ruleta.addEventListener('transitionend', () => {
    botonGirar.disabled = false;

    const gradosFinales = gradosTotales % 360;

    const gradosPorSector = 360 / categorias.length;

    const indice =
        Math.floor(
            (((360 - gradosFinales) + 83) % 360)
            / gradosPorSector
        );

    const categoria = categorias[indice];
    console.log("Categoria detectada:", categoria);
    console.log("Clave JSON:", mapaCategorias[categoria]);




    if (categoria !== "EXTRA API") {
        const pregunta =
            obtenerPreguntaAleatoria(
                mapaCategorias[categoria]
            );

        mostrarPregunta(pregunta, categoria);
    } else {
        obtenerPreguntaAPI()
            .then(pregunta => {
                mostrarPregunta(pregunta, categoria);
            })
            .catch(error => {
                console.error(error);
                alert("Error al cargar la pregunta");
            });
    }
});


function reiniciarJuego() {
    localStorage.removeItem("vidas");
    localStorage.removeItem("aciertos");

    vidas = 3;
    aciertos = 0;

    // Ocultar el cartel
    document.getElementById("PantaFinal").classList.add("oculto");
    location.reload();
}




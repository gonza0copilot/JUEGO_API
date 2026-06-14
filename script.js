const ruleta = document.getElementById('ruleta');
const botonGirar = document.getElementById('botonGirar');
const preguntaContainer = document.getElementById("pregunta-container");
let vidas = 3;
let aciertos = 0;

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
    "GTA IV":"img/gta IV banner.jfif",
    "TEAM Fortress 2":"img/TF banner.jpg",
    "LEFT 4 DEAD 2":"img/l4d2 banner.jpg",
    "MAFIA III":"img/mafiaIII banner.jpeg",
    "EXTRA API":"img/pregunta banner.jfif"
}

const URL_API =
    "https://opentdb.com/api.php?amount=1&category=15&type=multiple";

let gradosTotales = 0;
let preguntas = {};
let respuestaCorrecta = "";

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
    <img class="imagenJuego"
             src="${ImgCategorias[categoria]}"
             alt="${categoria}">
        <h2>${pregunta.pregunta}</h2>

        <button class="opcioness">${pregunta.opciones[0]}</button>
        <button class="opcioness">${pregunta.opciones[1]}</button>
        <button class="opcioness">${pregunta.opciones[2]}</button>
        <button class="opcioness">${pregunta.opciones[3]}</button>
    `;
      preguntaContainer.classList.remove("oculto");

    const botones = document.querySelectorAll(".opcioness");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            botones.forEach(b => {
                b.disabled = true;

                if (b.textContent.trim() === respuestaCorrecta.trim()) {
                    b.style.backgroundColor = "green";
                    b.style.color = "white";
                    aciertos++;
                    document.getElementById("aciertos-visual").textContent = aciertos;
                }
            });

            if (boton.textContent.trim() !== respuestaCorrecta.trim()) {
                boton.style.backgroundColor = "red";
                boton.style.color = "white";
                vidas--;
                document.getElementById("vidas-visual").textContent = vidas;
            }
        });
    });
}
//cambiar sistema vidas
if (vidas === 0) {
    alert("¡Has perdido! Reiniciando juego...");
    vidas = 3;
                aciertos = 0;
                document.getElementById("vidas-visual").textContent = vidas;
                document.getElementById("aciertos-visual").textContent = aciertos;
                if (respuestaCorrecta !== "") {
            document.getElementById("vida-visual").textContent = vidas;
        }
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




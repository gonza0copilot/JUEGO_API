const ruleta = document.getElementById('ruleta');
const botonGirar = document.getElementById('botonGirar');
const preguntaContainer = document.getElementById("pregunta-container");
let gradosTotales = 0;
let preguntas = {};
let respuestaCorrecta = "";

fetch("data.json")
    .then(respuesta => respuesta.json())
    .then(datos => {
        preguntas = datos;
        console.log("Preguntas cargadas");
    });

function obtenerPreguntaAleatoria(categoria) {

    const listaPreguntas = preguntas[categoria];

    const indiceAleatorio =
        Math.floor(Math.random() * listaPreguntas.length);

    return listaPreguntas[indiceAleatorio];
}



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

botonGirar.addEventListener('click', () => {



    const giroAleatorio =
        Math.floor(Math.random() * 3000) + 3000;

    gradosTotales += giroAleatorio;

    ruleta.style.transform =
        `rotate(${gradosTotales}deg)`;


});






ruleta.addEventListener('transitionend', () => {

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

    console.log("Categoría:", categoria);
    alert("Salió: " + categoria);




    if (categoria !== "EXTRA API") {

        const pregunta =
            obtenerPreguntaAleatoria(
                mapaCategorias[categoria]
            );

        console.log(pregunta);

        preguntaContainer.innerHTML = `
    <h2>${pregunta.pregunta}</h2>

    <button class="opcioness">${pregunta.opciones[0]}</button>
    <button class="opcioness">${pregunta.opciones[1]}</button>
    <button class="opcioness">${pregunta.opciones[2]}</button>
    <button class="opcioness">${pregunta.opciones[3]}</button>
`;



    } else {

        alert("Pregunta desde Open Trivia DB");

    }







});





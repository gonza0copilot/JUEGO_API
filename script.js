const ruleta = document.getElementById('ruleta');
const botonGirar = document.getElementById('botonGirar');



let gradosTotales = 0;



const categorias = [
    "GTA IV",
    "TF2",
    "L4D2",
    "MAFIA III",
    "API",
];

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
            (((360 - gradosFinales)+83) % 360)
            / gradosPorSector
        );

    const categoria = categorias[indice];

    console.log("Categoría:", categoria);
    alert("Salió: " + categoria);

});


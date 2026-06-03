const ruleta = document.getElementById('ruleta');
const botonGirar = document.getElementById('botonGirar');

let gradosTotales = 0;

botonGirar.addEventListener('click', () => {
    // Generamos un giro aleatorio entre 3000 y 6000 grados
    const giroAleatorio = Math.floor(Math.random() * 3000) + 3000;
    gradosTotales += giroAleatorio;

    // Aplicamos la rotación
    ruleta.style.transform = `rotate(${gradosTotales}deg)`;
});
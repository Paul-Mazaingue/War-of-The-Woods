/**
 * Mise à jour de la position de la caméra
 * @param {*} helicoptere l'hélicoptère sur lequel la caméra doit se centrer
 */
function updateCamera(helicoptere) {
    const gameContainer = document.getElementById('game-container');

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // On ne veut pas que la caméra sorte de la carte
    const cameraX = Math.min(
        Math.max(helicoptere.x - windowWidth / 2, 0),
        mapWidth - windowWidth
    );
    const cameraY = Math.min(
        Math.max(helicoptere.y - windowHeight / 2, 0),
        mapHeight - windowHeight
    );

    gameContainer.style.transform = `translate(${-cameraX}px, ${-cameraY}px)`;
}
// Met à jour la camera
function updateCamera() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const cameraX = Math.min(
        Math.max(x - windowWidth / 2, 0),
        mapWidth - windowWidth
    );
    const cameraY = Math.min(
        Math.max(y - windowHeight / 2, 0),
        mapHeight - windowHeight
    );

    gameContainer.style.transform = `translate(${-cameraX}px, ${-cameraY}px)`;
}
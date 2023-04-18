// Met à jour la position de l'hélicoptère
function updatePosition() {
    helico.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    gameContainer.style.transform = `translate(${-x + (window.innerWidth / 2) - (parseFloat(helico.style.width) / 2)}px, ${-y + (window.innerHeight / 2) - (parseFloat(helico.style.height) / 2)}px)`;
}



// Atterrissage de l'hélicoptère
async function landHelico() {
    const landingSpeed = 2;
    for (let i = 0; i < 10; i++) {
        helico.style.width = parseFloat(helico.style.width) - landingSpeed + 'px';
        helico.style.height = parseFloat(helico.style.height) - landingSpeed + 'px';
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Vérifie si l'hélicoptère est dans la zone d'atterrisage
    const redSquare = document.getElementById('red-square');
    const redSquareBounds = redSquare.getBoundingClientRect();
    const helicoBounds = helico.getBoundingClientRect();

    
    // x + taille de l'hélico/2
    // 1200,1300 : emplacement x,y du carré
    if (x+(zoneWidth/2) >= zonex && 
        x+(zoneWidth/2) <= zonex+zoneWidth &&
        y+(zoneHeight/2) >= zoney &&
        y+(zoneHeight/2)<= zoney+zoneHeight) {
        showZone(true);
        console.log("L'hélicoptère a atterri dans le carré rouge.");
    }
}

// Décollage de l'hélicoptère
async function takeOffHelico() {
    const takeOffSpeed = 2;
    for (let i = 0; i < 10; i++) {
        helico.style.width = parseFloat(helico.style.width) + takeOffSpeed + 'px';
        helico.style.height = parseFloat(helico.style.height) + takeOffSpeed + 'px';
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

// Déplacement de l'hélicoptère
function moveHelico() {
    
    let dx = 0;
    let dy = 0;
    if (!isLanded && canControl) {
        // Gestion des touches
        if (keyState['ArrowUp'] || keyState['w']) {
            dy -= speed;
        }
        if (keyState['ArrowDown'] || keyState['s']) {
            dy += speed;
        }
        if (keyState['ArrowLeft'] || keyState['a']) {
            dx -= speed;
        }
        if (keyState['ArrowRight'] || keyState['d']) {
            dx += speed;
        }
        if (dx !== 0 && dy !== 0) {
            dx *= Math.sqrt(0.5);
            dy *= Math.sqrt(0.5);
        }

        // Emet des particules si l'hélicoptère se déplace
        if (dx !== 0 || dy !== 0) {
            emitParticle(x, y, -dx * 0.5, -dy * 0.5);
        }

        // Vérifie si les nouvelles coordonnées sont à l'intérieur des limites de la carte
        const newX = x + dx;
        const newY = y + dy;

        if (newX >= 200 && newX + parseFloat(helico.style.width) <= 6000 - 200) {
            x = newX;
        }
        if (newY >= 200 && newY + parseFloat(helico.style.height) <= 3357 - 200) {
            y = newY;
        }

        // met à jour la rotation de l'hélicoptère
        if (dx !== 0 || dy !== 0) {
            const targetRotation = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
            const delta = (targetRotation - rotation + 540) % 360 - 180;
            rotation += delta * 0.1;
        }
    }
    showZone();

    // met à jour la position de l'hélicoptère
    updatePosition();
    // met à jour la caméra
    updateCamera();
    // demande au navigateur d'appeler moveHelico dès que possible
    requestAnimationFrame(moveHelico);
}
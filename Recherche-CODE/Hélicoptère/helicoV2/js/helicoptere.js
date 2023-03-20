function updatePosition() {
    helico.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    gameContainer.style.transform = `translate(${-x + (window.innerWidth / 2) - (parseFloat(helico.style.width) / 2)}px, ${-y + (window.innerHeight / 2) - (parseFloat(helico.style.height) / 2)}px)`;
}

async function landHelico() {
    const landingSpeed = 2;
    for (let i = 0; i < 10; i++) {
        helico.style.width = parseFloat(helico.style.width) - landingSpeed + 'px';
        helico.style.height = parseFloat(helico.style.height) - landingSpeed + 'px';
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function takeOffHelico() {
    const takeOffSpeed = 2;
    for (let i = 0; i < 10; i++) {
        helico.style.width = parseFloat(helico.style.width) + takeOffSpeed + 'px';
        helico.style.height = parseFloat(helico.style.height) + takeOffSpeed + 'px';
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

document.addEventListener('keydown', async event => {
    if (event.key === ' ' && !isLanded && !isAnimating) {
        isLanded = true;
        canControl = false;
        isAnimating = true;
        // Faire atterrir l'hélico
        await landHelico();
        helico.src = "helico-static.png";
        canControl = true;
        isAnimating = false;
    } else if (event.key === ' ' && isLanded && canControl && !isAnimating) {
        isLanded = false;
        // Faire décoller l'hélico
        canControl = false;
        isAnimating = true;
        helico.src = "helico.gif";
        await takeOffHelico();
        canControl = true;
        isAnimating = false;
    }
});

const keyState = {};
document.addEventListener('keydown', event => {
    keyState[event.key] = true;
});
document.addEventListener('keyup', event => {
    keyState[event.key] = false;
});

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function moveHelico() {
    const speed = 10;
    let dx = 0;
    let dy = 0;
    if (!isLanded && canControl) {
        if (keyState['ArrowUp'] || keyState['z']) {
            dy -= speed;
        }
        if (keyState['ArrowDown'] || keyState['s']) {
            dy += speed;
        }
        if (keyState['ArrowLeft'] || keyState['q']) {
            dx -= speed;
        }
        if (keyState['ArrowRight'] || keyState['d']) {
            dx += speed;
        }
        if (dx !== 0 && dy !== 0) {
            dx *= Math.sqrt(0.5);
            dy *= Math.sqrt(0.5);
        }

        //Emit wind particles if the helicopter is moving
        /*if (dx !== 0 || dy !== 0) {
            emitParticle(x, y, -dx * 0.5, -dy * 0.5);
        }*/

        // Vérifie si les nouvelles coordonnées sont à l'intérieur des limites de la carte
        const newX = x + dx;
        const newY = y + dy;

        if (newX >= 200 && newX + parseFloat(helico.style.width) <= 6000 - 200) {
            x = newX;
        }
        if (newY >= 200 && newY + parseFloat(helico.style.height) <= 3357 - 200) {
            y = newY;
        }

        if (dx !== 0 || dy !== 0) {
            const targetRotation = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
            const delta = (targetRotation - rotation + 540) % 360 - 180;
            rotation += delta * 0.1;
        }
    }
    updatePosition();
    updateCamera();
    requestAnimationFrame(moveHelico);
}
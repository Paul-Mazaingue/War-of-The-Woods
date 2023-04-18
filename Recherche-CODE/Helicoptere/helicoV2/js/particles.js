// Créer un élément div avec la classe "particle"
function createParticle(x, y, angle) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.width = wind_widht;
    particle.style.height = wind_height;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.transform = `rotate(${angle}deg)`;
    helicoContainer.appendChild(particle);
    return particle;
}

// Animer les particules
function animateParticle(particle, dx, dy) {
    const duration = 1000;
    const start = performance.now();

    // Animation des particules
    function update() {
        const now = performance.now();
        const progress = Math.min(1, (now - start) / duration);

        const x = parseFloat(particle.style.left) + dx * progress;
        const y = parseFloat(particle.style.top) + dy * progress;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            helicoContainer.removeChild(particle);
        }
    }

    requestAnimationFrame(update);
}

// Générer les particules
function emitParticle(x, y, dx, dy) {
    if (dx === 0 && dy === 0) {
        return;
    }
    const angle = Math.random() * 2 * Math.PI;
    const distance = 20 + Math.random() * 30;
    const particleX = x + 50 + Math.cos(angle) * distance;
    const particleY = y + 50 + Math.sin(angle) * distance;
    const particleAngle = (Math.atan2(dy, dx) * 180 / Math.PI) - 90;
    const particle = createParticle(particleX, particleY, particleAngle);
    animateParticle(particle, dx, dy);
}
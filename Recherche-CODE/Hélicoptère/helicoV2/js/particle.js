class Particle {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    create() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = '2px';
        particle.style.height = '5px';
        particle.style.left = `${this.x}px`;
        particle.style.top = `${this.y}px`;
        particle.style.transform = `rotate(${this.angle}deg)`;
        helicoContainer.appendChild(particle);
        return particle;
    }

    animate(dx, dy) {
        const duration = 1000;
        const start = performance.now();

        function update() {
            const now = performance.now();
            const progress = Math.min(1, (now - start) / duration);

            const x = parseFloat(this.x) + dx * progress;
            const y = parseFloat(this.y) + dy * progress;
            this.x = `${x}px`;
            this.y = `${y}px`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                helicoContainer.removeChild(particle);
            }
        }

        requestAnimationFrame(update);
    }

    emit(x, y, dx, dy) {
        if (dx === 0 && dy === 0) {
            return;
        }
        const angle = Math.random() * 2 * Math.PI;
        const distance = 20 + Math.random() * 30;
        const particleX = x + 50 + Math.cos(angle) * distance;
        const particleY = y + 50 + Math.sin(angle) * distance;
        const particleAngle = (Math.atan2(dy, dx) * 180 / Math.PI) - 90;
        const particle = this.create(particleX, particleY, particleAngle);
        this.animate(particle, dx, dy);
    }
}
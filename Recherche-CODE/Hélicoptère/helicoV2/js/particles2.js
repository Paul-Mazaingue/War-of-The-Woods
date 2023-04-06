class Particle {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;

        this.helicoContainer = document.getElementById('helico-container');
    }

    createParticle(x, y, angle) {
        this.particle = document.createElement('div');
        this.particle.classList.add('particle');
        this.particle.style.width = wind_widht;
        this.particle.style.height = wind_height;
        this.particle.style.left = `${x}px`;
        this.particle.style.top = `${y}px`;
        this.particle.style.transform = `rotate(${angle}deg)`;
        this.helicoContainer.appendChild(this.particle);
    }

    animateParticle() {
        const duration = 1000;
        let particle = this.particle;
        let dx = this.dx;
        let dy = this.dy;
        let helicoContainer = this.helicoContainer;
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
    emitParticle() {
        if (this.dx === 0 && this.dy === 0) {
            return;
        }
        const angle = Math.random() * 2 * Math.PI;
        const distance = 20 + Math.random() * 30;
        const particleX = this.x + 50 + Math.cos(angle) * distance;
        const particleY = this.y + 50 + Math.sin(angle) * distance;
        const particleAngle = (Math.atan2(this.dy, this.dx) * 180 / Math.PI) - 90;
        this.createParticle(particleX, particleY, particleAngle);
        this.animateParticle();
    }
}

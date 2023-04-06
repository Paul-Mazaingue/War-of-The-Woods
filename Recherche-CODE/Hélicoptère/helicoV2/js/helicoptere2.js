class Helicoptere {
    constructor() {
        this.x = 1200;
        this.y = 900;
        this.rotation = 0;
        this.speed = 10;
        this.isLanded = false;
        this.canControl = true;
        this.isAnimating = false;
        this.helico = document.getElementById('helico');
        this.gameContainer = document.getElementById('game-container');
        this.keyState = {};
        this.zoneWidth = 100;
        this.zoneHeight = 100;
        this.zonex = 1200;
        this.zoney = 1300;
    }

    // Met à jour la position de l'hélicoptère
    updatePosition() {
        this.helico.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
        this.gameContainer.style.transform = `translate(${-this.x + (window.innerWidth / 2) - (parseFloat(this.helico.style.width) / 2)}px, ${-this.y + (window.innerHeight / 2) - (parseFloat(this.helico.style.height) / 2)}px)`;
    }

    // Atterrissage de l'hélicoptère
    async landHelico() {
        const landingSpeed = 2;
        for (let i = 0; i < 10; i++) {
            this.helico.style.width = parseFloat(this.helico.style.width) - landingSpeed + 'px';
            this.helico.style.height = parseFloat(this.helico.style.height) - landingSpeed + 'px';
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Vérifie si l'hélicoptère est dans la zone d'atterrisage
        if (this.x+(this.zoneWidth/2) >= this.zonex && 
            this.x+(this.zoneWidth/2) <= this.zonex+this.zoneWidth &&
            this.y+(this.zoneHeight/2) >= this.zoney &&
            this.y+(this.zoneHeight/2)<= this.zoney+this.zoneHeight) {
            showZone(true);
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            console.log("L'hélicoptère a atterri dans le carré rouge.");
        }
    }

    // Décollage de l'hélicoptère
    async takeOffHelico() {
        const takeOffSpeed = 2;
        for (let i = 0; i < 10; i++) {
            this.helico.style.width = parseFloat(this.helico.style.width) + takeOffSpeed + 'px';
            this.helico.style.height = parseFloat(this.helico.style.height) + takeOffSpeed + 'px';
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        showZone(false);
    }

    // Déplacement de l'hélicoptère
    moveHelico() {
            let dx = 0;
            let dy = 0;
            
            if (!this.isLanded && this.canControl) {
                // Gestion des touches
                if (this.keyState['ArrowUp'] || this.keyState['w']) {
                    dy -= this.speed;
                }
                if (this.keyState['ArrowDown'] || this.keyState['s']) {
                    dy += this.speed;
                }
                if (this.keyState['ArrowLeft'] || this.keyState['a']) {
                    dx -= this.speed;
                }
                if (this.keyState['ArrowRight'] || this.keyState['d']) {
                    dx += this.speed;
                }
                if (dx !== 0 && dy !== 0) {
                    dx /= Math.sqrt(2);
                    dy /= Math.sqrt(2);
                }

                // Emet des particules si l'hélicoptère se déplace
                if (dx !== 0 || dy !== 0) {
                    emitParticle(this.x, this.y, -dx * 0.5, -dy * 0.5);
                }

                // Vérifie si les nouvelles coordonnées sont à l'intérieur des limites de la carte
                const newX = this.x + dx;
                const newY = this.y + dy;

                if (newX >= 200 && newX + parseFloat(helico.style.width) <= 6000 - 200) {
                    this.x = newX;
                }
                if (newY >= 200 && newY + parseFloat(helico.style.height) <= 3357 - 200) {
                    this.y = newY;
                }

                // met à jour la rotation de l'hélicoptère
                if (dx !== 0 || dy !== 0) {
                    const targetRotation = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
                    const delta = (targetRotation - this.rotation + 540) % 360 - 180;
                    this.rotation += delta * 0.1;
                }
                showZone();
                // met à jour la position de l'hélicoptère
                this.updatePosition();
                // met à jour la caméra
                updateCamera();
                // demande au navigateur d'appeler moveHelico dès que possible
                requestAnimationFrame(this.moveHelico.bind(this));
                
            }
        }

} 
class Helicoptere {
    constructor(x,y,speed,zones,img,width,height) {

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;

        this.createHelico(img, width, height);

        this.rotation = 0;
        this.isLanded = false;
        this.canControl = true;
        this.isAnimating = false;

        this.gameContainer = document.getElementById('game-container');
        this.keyState = {};
        this.zones = zones;
    }

    createHelico(img, width, height) {
        // Obtenez l'élément avec l'id "helico-container"
        var helicoContainer = document.getElementById("helico-container");

        // Créez un nouvel élément div pour l'hélicoptère
        let helico = document.createElement("div");

        // Ajoutez la classe "helico" à l'élément div de l'hélicoptère
        helico.classList.add("helico");

        // Ajoutez l'élément img à l'élément div de l'hélicoptère
        this.helico = document.createElement("img");
        this.helico.id = "helico";
        this.helico.src = img;
        this.helico.style.width = width + "px";
        this.helico.style.height = height + "px";
        helico.appendChild(this.helico);

        // Ajoutez l'élément div de l'hélicoptère à l'élément "helico-container"
        helicoContainer.appendChild(helico);
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


        this.zones.forEach(zone => {
            if(zone.helicoInZone(this)) {
                window.location.href = zone.url;
            }
        });

    }

    // Décollage de l'hélicoptère
    async takeOffHelico() {
        const takeOffSpeed = 2;
        for (let i = 0; i < 10; i++) {
            this.helico.style.width = parseFloat(this.helico.style.width) + takeOffSpeed + 'px';
            this.helico.style.height = parseFloat(this.helico.style.height) + takeOffSpeed + 'px';
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    // Déplacement de l'hélicoptère
    moveHelico() {
            let dx = 0;
            let dy = 0;
            
            if (!this.isLanded && this.canControl) {
                // Gestion des touches
                if (this.keyState['ArrowUp'] || this.keyState['z']) {
                    dy -= this.speed;
                }
                if (this.keyState['ArrowDown'] || this.keyState['s']) {
                    dy += this.speed;
                }
                if (this.keyState['ArrowLeft'] || this.keyState['q']) {
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
                
                this.zones.forEach(zone => {
                    zone.showInformation(this);
                });
                // met à jour la position de l'hélicoptère
                this.updatePosition();
                // met à jour la caméra
                updateCamera();


                // demande au navigateur d'appeler moveHelico dès que possible
                requestAnimationFrame(this.moveHelico.bind(this));
                
            }
        }

} 
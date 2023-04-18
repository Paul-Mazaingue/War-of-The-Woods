class Helicoptere {
    /**
     * Constructeur de l'hélicoptère
     * @param {*} x Position x de l'hélicoptère
     * @param {*} y Position y de l'hélicoptère
     * @param {*} speed Vitesse de l'hélicoptère
     * @param {*} zones Liste des zones dans lequel l'hélicoptère peut atterrir, elles sont représentées par des objets Zone
     * @param {*} img image de l'hélicoptère en mouvement
     * @param {*} static_img image de l'hélicoptère à l'arrêt
     * @param {*} width largeur de l'hélicoptère
     * @param {*} height hauteur de l'hélicoptère
     */
    constructor(x,y,speed,zones,img,static_img,width,height) {

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.img = img;
        this.static_img = static_img;
        this.zones = zones;

        // Création de l'hélicoptère en html
        this.createHelico(img, width, height);

        this.rotation = 0;
        this.isLanded = false;
        this.canControl = true;
        this.isAnimating = false;

        this.gameContainer = document.getElementById('game-container');
        this.keyState = {};
    }

    /**
     * Création de l'hélicoptère en html
     * @param {*} img image de l'hélicoptère
     * @param {*} width largeur de l'hélicoptère
     * @param {*} height hatueur de l'hélicoptère
     */
    createHelico(img, width, height) {
        // Obtenez l'élément avec l'id "helico-container"
        let helicoContainer = document.getElementById("helico-container");

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

    /**
     * Met à jour la position de l'hélicoptère
     */
    updatePosition() {
        this.helico.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
        this.gameContainer.style.transform = `translate(${-this.x + (window.innerWidth / 2) - (parseFloat(this.helico.style.width) / 2)}px, ${-this.y + (window.innerHeight / 2) - (parseFloat(this.helico.style.height) / 2)}px)`;
    }

    /** 
     * Atterissage de l'hélicoptère
    */
    async landHelico() {
        const landingSpeed = 2;
        // Diminue la taille de l'hélicoptère
        for (let i = 0; i < 10; i++) {
            this.helico.style.width = parseFloat(this.helico.style.width) - landingSpeed + 'px';
            this.helico.style.height = parseFloat(this.helico.style.height) - landingSpeed + 'px';
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Vérifie si l'hélicoptère est dans une zone
        this.zones.forEach(zone => {
            if(zone.helicoInZone(this)) {

                // Transition entre les pages : La page devient noir
                let overlayDiv = document.createElement('div');
                overlayDiv.classList.add('overlay');
                document.body.appendChild(overlayDiv);

                setTimeout(function() {
                    // Redirige vers la page de la zone
                    window.location.href = zone.url;
                }, 1000);

                
                
            }
        });

    }

    /**
     * Décollage de l'hélicoptère
     */
    async takeOffHelico() {
        const takeOffSpeed = 2;
        // Augmente la taille de l'hélicoptère
        for (let i = 0; i < 10; i++) {
            this.helico.style.width = parseFloat(this.helico.style.width) + takeOffSpeed + 'px';
            this.helico.style.height = parseFloat(this.helico.style.height) + takeOffSpeed + 'px';
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    /** 
     * Déplacement de l'hélicoptère
    */
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
                    
                    new Particle(this.x, this.y, -dx * 0.5, -dy * 0.5,1000).emitParticle();
                }

                // Vérifie si les nouvelles coordonnées sont à l'intérieur des limites de la carte
                const newX = this.x + dx;
                const newY = this.y + dy;

                if (newX >= 200 && newX + parseFloat(this.helico.style.width) <= 6000 - 200) {
                    this.x = newX;
                }
                if (newY >= 200 && newY + parseFloat(this.helico.style.height) <= 3357 - 200) {
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
                updateCamera(this);


                // demande au navigateur d'appeler moveHelico dès que possible
                requestAnimationFrame(this.moveHelico.bind(this));
                
            }
        }
} 
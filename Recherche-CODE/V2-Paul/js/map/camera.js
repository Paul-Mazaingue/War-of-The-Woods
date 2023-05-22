class Camera {
    constructor(startX, startY, square_size, n, speed, mouseBorderThreshold) {
        this.cameraX = startX;
        this.cameraY = startY;
        this.square_size = square_size;
        this.n = n;
        this.speed = speed;
        this.mouseBorderThreshold = mouseBorderThreshold;
        this.dx = 0;
        this.dy = 0;
        this.gridContainer = document.getElementById("grid-container");
        this.playerVision = document.getElementById('playerVision');
        this.keysPressed = {
            ArrowRight: false,
            ArrowLeft: false,
            ArrowUp: false,
            ArrowDown: false
        };

        document.addEventListener("keydown", (event) => {
            this.keysPressed[event.code] = true;
            if (this.keysPressed.ArrowRight) {
                this.dx = this.speed;
            }
            if (this.keysPressed.ArrowLeft) {
                this.dx = -this.speed;
            }
            if (this.keysPressed.ArrowDown) {
                this.dy = this.speed;
            }
            if (this.keysPressed.ArrowUp) {
                this.dy = -this.speed;
            }
        });

        document.addEventListener("keyup", (event) => {
            this.keysPressed[event.code] = false;
            if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
                this.dx = this.keysPressed.ArrowRight ? this.speed : (this.keysPressed.ArrowLeft ? -this.speed : 0);
            }
            if (event.code === "ArrowDown" || event.code === "ArrowUp") {
                this.dy = this.keysPressed.ArrowDown ? this.speed : (this.keysPressed.ArrowUp ? -this.speed : 0);
            }
        });

        // document.addEventListener("mousemove", (event) => {
        //     if (event.clientX > window.innerWidth - this.mouseBorderThreshold) {
        //         this.dx = this.speed;
        //     } else if (event.clientX < this.mouseBorderThreshold) {
        //         this.dx = -this.speed;
        //     } else {
        //         this.dx = 0;
        //     }

        //     if (event.clientY > window.innerHeight - this.mouseBorderThreshold) {
        //         this.dy = this.speed;
        //     } else if (event.clientY < this.mouseBorderThreshold) {
        //         this.dy = -this.speed;
        //     } else {
        //         this.dy = 0;
        //     }
        // });

        this.setCameraPosition(startX, startY);
    }

    getMatrixCoordinates() {
        let topLeftX = Math.floor(this.cameraX / this.square_size);
        let topLeftY = Math.floor(this.cameraY / this.square_size);
        let bottomRightX = Math.floor((this.cameraX + window.innerWidth) / this.square_size);
        let bottomRightY = Math.floor((this.cameraY + window.innerHeight) / this.square_size);

        return {
            topLeft: { x: topLeftX, y: topLeftY },
            bottomRight: { x: bottomRightX, y: bottomRightY }
        };
    }

    setCameraPosition(pointX, pointY) {
        this.cameraX = pointX * this.square_size - window.innerWidth / 2;
        this.cameraY = pointY * this.square_size - window.innerHeight / 2;
        // Make sure the camera doesn't go out of the grid bounds
        if(this.cameraX < 0) {
            this.cameraX = 0;
        } else if(this.cameraX > this.n * this.square_size - window.innerWidth) {
            this.cameraX = this.n * this.square_size - window.innerWidth;
        }
        if(this.cameraY < 0) {
            this.cameraY = 0;
        } else if(this.cameraY > this.n * this.square_size - window.innerHeight) {
            this.cameraY = this.n * this.square_size - window.innerHeight;
        }
    }

    updateCam() {
        this.cameraX += this.dx;
        this.cameraY += this.dy;

        if(this.cameraX < 0) {
            this.cameraX = 0;
        } else if(this.cameraX > this.n * this.square_size - window.innerWidth) {
            this.cameraX = this.n * this.square_size - window.innerWidth;
        }
        if(this.cameraY < 0) {
            this.cameraY = 0;
        } else if(this.cameraY > this.n * this.square_size - window.innerHeight) {
            this.cameraY = this.n * this.square_size - window.innerHeight;
        }

        this.gridContainer.style.transform = `translate(${-this.cameraX}px, ${-this.cameraY}px)`;
        this.drawPlayerVision();
    }

    drawPlayerVision() {
        let coord = this.getMatrixCoordinates();
        this.playerVision.style.left = coord.topLeft.x + 'px';
        this.playerVision.style.top = coord.topLeft.y +4 + 'px';
        this.playerVision.style.width = coord.bottomRight.x - coord.topLeft.x + 'px';
        this.playerVision.style.height = coord.bottomRight.y - coord.topLeft.y + 'px';
    }

    
}
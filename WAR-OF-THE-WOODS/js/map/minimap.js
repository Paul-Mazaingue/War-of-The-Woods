class Minimap {
    constructor(matrix, matrixSize, minimapSize) {
        this.matrix = matrix;
        this.matrixSize = matrixSize;
        this.minimapSize = minimapSize;
        this.minimap = document.getElementById('minimap');
        this.minimapContainer = document.getElementById('minimap-container');
    }

    // Dessine la minimap
    drawMinimap(){
        let ctx = this.minimap.getContext('2d');
        let pixelSize = this.minimapSize / this.matrixSize;

        // On dessine l'eau, la terre et les arbres
        for(let i= 0; i< this.matrixSize; i++){
            for(let j= 0; j< this.matrixSize; j++){
                let x = i / this.matrixSize * this.minimapSize;
                let y = j / this.matrixSize * this.minimapSize;
                

                switch (this.matrix[j][i]) {
                    case -1:
                        ctx.fillStyle = "blue";
                        break;
                    case 1:
                        ctx.fillStyle = 'green';
                        break;
                    default:
                    ctx.fillStyle = '#4A2C0B';
                        break;
                }

                ctx.fillRect(x, y, pixelSize, pixelSize);
            }
        }

        // on dessine les batiments allié et les totems
        for(let i= 0; i< this.matrixSize; i++){
            for(let j= 0; j< this.matrixSize; j++){
                let x = i / this.matrixSize * this.minimapSize;
                let y = j / this.matrixSize * this.minimapSize;
                
                if(this.matrix[j][i] == 101 && this.matrix[j-1][i] == 101 && this.matrix[j][i-1] == 101 && this.matrix[j+1][i] == 101 && this.matrix[j][i+1] == 101){
                    let circleRadius = 5 * pixelSize;
                    ctx.beginPath();
                    ctx.arc(x + pixelSize / 2, y + pixelSize / 2, circleRadius, 0, 2 * Math.PI, false);
                    ctx.fillStyle = '#8b0000';
                    ctx.fill();
                }

                if((this.matrix[j][i] >= 500 && this.matrix[j][i] < 600) && (this.matrix[j+1][i] >= 500 && this.matrix[j+1][i] < 600) && (this.matrix[j][i+1] >= 500 && this.matrix[j][i+1] < 600) && (this.matrix[j-1][i] >= 500 && this.matrix[j-1][i] < 600) && (this.matrix[j][i-1] >= 500 && this.matrix[j][i-1] < 600)){
                    let squareSize = 5 * pixelSize;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(x, y, squareSize, squareSize);
                }
            }
        }
    }

    // Lorsque l'on clique sur la minimap on exécute la fonction callback
    setClickCallback(callback) {
        this.minimapContainer.addEventListener('click', (event) => {
            let rect = this.minimap.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;

            // Convert minimap pixel coordinates to matrix coordinates
            let matrixX = Math.floor(x / this.minimapSize * this.matrixSize);
            let matrixY = Math.floor(y / this.minimapSize * this.matrixSize);

            callback(matrixX, matrixY);
        });
    }
}
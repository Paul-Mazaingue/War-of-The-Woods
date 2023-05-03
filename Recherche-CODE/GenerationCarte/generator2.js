

class MapGenerator {
    constructor(width, height, indicators) {
        this.width = width;
        this.height = height;
        this.indicators = indicators;
        this.unitsElementsMatrix = Array(height).fill(null).map(() => Array(width).fill(-1));
        this.lifeDeadZonesMatrix = Array(height).fill(null).map(() => Array(width).fill(-1));
      }
  
    generate() {
        this.playZone();
        /*
        this.placeTrees();faire les perlin noise
        this.placeMines(); 
        this.defineSpawnPoints();
        this.findnPaths();
        this.placeOutposts();
        this.placeTotems();
        this.spawnEnemies();
        this.fillLifeMatrix();*/
    }
    
    playZone() {
        const now = Date.now();

        let x = this.width / 2;
        let y = this.height / 2;



        const points = [];
        const distMin = Math.round(Math.round(this.width/2) * 0.3);
        const distMax = Math.round(Math.round(this.width/2) * 0.7);
        // Il faudra modifier le * 0.5 par l'indicateur influant sur la taille de la zone de jeu 
        const bonusIndicator = Math.round(Math.round(this.width/2) * 0.25) * 0;


        const position = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1]];

        position.forEach(pos => {
            let dist = Math.round(Math.random() * (distMax - distMin) + distMin + bonusIndicator);
            points.push([pos[0] * (dist) + x, pos[1] * (dist) + y]);
        });


        this.linkPoints(points);
        this.fillEarth();
        console.log(points);

        console.log("temps d'éxécution playZone : " + (Date.now() - now) + "ms");
        
    }

    linkPoints(points) {

        for(let i = 0; i < points.length; i++) {
            let pointsStart = points[i];
            let pointsEnd;
            if(i == points.length - 1) {
                pointsEnd = points[0];
            } else {
                pointsEnd = points[i + 1];
            }

            let x = pointsStart[0];
            let y = pointsStart[1];

            const addX = pointsEnd[0] - pointsStart[0] > 0 ? 1 : -1;
            const addY = pointsEnd[1] - pointsStart[1] > 0 ? 1 : -1;

            const distX = Math.abs(pointsEnd[0] - pointsStart[0]);
            const distY = Math.abs(pointsEnd[1] - pointsStart[1]);

            const ratio = distX / (distX + distY);


            

            while(x != pointsEnd[0] || y != pointsEnd[1]) {
                if ( x != pointsEnd[0] && y != pointsEnd[1]) {
                    if(Math.random() > ratio) {
                        y += addY;
                        
                    } else {
                        x += addX;
                    }
                }
                else if (x != pointsEnd[0]) {
                    x += addX;
                }
                else if (y != pointsEnd[1]) {
                    y += addY;
                }

                this.unitsElementsMatrix[y][x] = 0;
            }

        }
            
    }

    fillEarth() {
        for(let y = 0; y < this.height; y++) {
            let fill = false;
            for(let x = 0; x < this.width-1; x++) {
                //console.log(fill)
                if(fill) {
                    this.unitsElementsMatrix[y][x] = 0;
                }
                if(this.unitsElementsMatrix[y][x+1] == 0 && this.unitsElementsMatrix[y][x+2] == -1) {
                    fill = !fill;
                    x += 2;
                    if(fill) {  
                        this.unitsElementsMatrix[y][x] = 0;
                    }
                }
                
            }
        }
    }


    placeMines() {
        // Logic for placing trees
    }

    placeTrees() {
      // Logic for placing trees
    }
  
    defineSpawnPoints() {
      // Logic for defining spawn points
    }
  
    findPaths() {
      // Logic for finding paths
    }
  
    placeOutposts() {
      // Logic for placing outposts
    }
  
    placeTotems() {
      // Logic for placing totems
    }
  
    spawnEnemies() {
      // Logic for spawning enemies
    }
  
    fillLifeMatrix() {
      // Logic for filling life matrix
    }

    drawMap() {
        const now = Date.now();
        // Create a canvas element and set its size
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext("2d");

        // Iterate through the matrix and set the color of each pixel
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const value = this.unitsElementsMatrix[x][y];

                // Set color based on the value (0 for black)
                switch (value) { 
                    case -1:
                        ctx.fillStyle = "blue";
                        break;
                    case 0:
                        ctx.fillStyle = "brown";
                        break;
                    case 1:
                        ctx.fillStyle = "black";
                        break;
                }
                //ctx.fillStyle = value === -1 ? "blue" : "brown";

                // Draw the pixel
                ctx.fillRect(x, y, 1, 1);
            }
        }

        // Append the canvas to the DOM
        const mapContainer = document.getElementById("map");
        mapContainer.innerHTML = ""; // Clear any existing content
        mapContainer.appendChild(canvas);
        console.log("temps d'éxécution dessins : " + (Date.now() - now) + "ms");
    }

    check() {
        let count = 0;
        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                if(this.unitsElementsMatrix[i][j] == 0) {
                    count++;
                }
            }
        }
        return count;
        
    }

  }
  
// Initialize the map generator with the given parameters
const mapGenerator = new MapGenerator(1000, 1000, [1, 2, 3, 4, 5]);
  
// Generate the map
mapGenerator.generate();
mapGenerator.drawMap();
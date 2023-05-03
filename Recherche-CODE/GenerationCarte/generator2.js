

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
        //for(let i = 0; i < ; i++) {
        

        console.log("temps d'éxécution playZone : " + (Date.now() - now) + "ms");
        
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
                ctx.fillStyle = value === -1 ? "blue" : "brown";

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
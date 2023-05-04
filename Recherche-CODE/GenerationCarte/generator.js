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
        
        this.placeTrees();
        /*this.placeMines(); 
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



        this.points = [];
        const distMin = Math.round(Math.round(this.width/2) * 0.3);
        const distMax = Math.round(Math.round(this.width/2) * 0.7);
        // Il faudra modifier le * 0.5 par l'indicateur influant sur la taille de la zone de jeu 
        const bonusIndicator = Math.round(Math.round(this.width/2) * 0.25) * 1;


        const position = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1]];

        position.forEach(pos => {
            let dist = Math.round(Math.random() * (distMax - distMin) + distMin + bonusIndicator);
            this.points.push([pos[0] * (dist) + x, pos[1] * (dist) + y]);
        });


        this.linkPoints();
        this.fillEarth();

        console.log("temps d'éxécution playZone : " + (Date.now() - now) + "ms");
        
    }

    linkPoints() {

        for(let i = 0; i < this.points.length; i++) {
            let pointsStart = this.points[i];
            let pointsEnd;
            if(i == this.points.length - 1) {
                pointsEnd = this.points[0];
            } else {
                pointsEnd = this.points[i + 1];
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
        const up = (this.points[0][1] >= this.points[1][1]) && (this.points[0][1] >= this.points[7][1]);
        const down = (this.points[4][1] <= this.points[5][1]) && (this.points[4][1] <= this.points[3][1]);
        for(let y = 0; y < this.height; y++) {
            let count = 0;
            let fill = false;
            let check = this.lineCheck(y);
            for(let x = 0; x < this.width-1; x++) {
                // Si on est dans la bordure de la map on rempli
                if(fill) {
                    this.unitsElementsMatrix[y][x] = 0;
                }

                // Si la case suivant est un zéro et que la case encore après est -1
                if(this.unitsElementsMatrix[y][x+1] == 0 && this.unitsElementsMatrix[y][x+2] == -1) {
                    count++;

                    // On passe à la prochaine case -1
                    x += 2;
                    
                    
                    

                    // si on n'est pas en train de remplir et qu'il y a un zéro dans la suite de la ligne on remplie
                    if(!fill && this.unitsElementsMatrix[y].slice(x).includes(0)) {
                        
                        fill = true;
                        
                        

                    }

                    if((up && y <= this.points[0][1] & this.points[1][1] >= this.points[7][1] && check == 3 && count == 2) || (up && y <= this.points[0][1] & this.points[1][1] <= this.points[7][1] && check == 3 && count == 1)) {
                        fill = false;
                    }

                    if((down && y >= this.points[4][1] && this.points[5][1] <= this.points[3][1] && check == 3 && count == 1) || (down && y >= this.points[4][1] && this.points[5][1] >= this.points[3][1] && check == 3 && count == 2)) {
                        fill = false;
                    }

                    // ou si la case suivante est un zéro on arrête de remplir
                    if( this.unitsElementsMatrix[y][x+1] == 0 ) {
                        fill = false;
                    }

                    // Si on est en train de remplir et qu'il y a un zéro dans la suite de la ligne on arrête de remplir
                    if(!this.unitsElementsMatrix[y].slice(x+1).includes(0) && fill )   {
                        fill = false;
                    }

                    if(count == 2 && check == 4) { 
                        fill = false;
                    }

                    if(y == this.points[0][1] && !this.unitsElementsMatrix[y].slice(x+1).includes(0) ) { 
                        fill = false;
                    }

                    

                    
                    

                    // On rempli la case 
                    if(fill) {  
                        this.unitsElementsMatrix[y][x] = 0;
                    }
                }
                
            }
        }

        const testNumber1 = [1,2,3,4];
        const testNumber2 = [1,2,3];
        
        

        for(let y = 4; y < this.height-4; y++) {
            for(let x = 3; x < this.width-3; x++) { 
                testNumber1.forEach(number => {
                    if((this.unitsElementsMatrix[y-number][x] == 0 && this.unitsElementsMatrix[y+number][x] == 0) && this.unitsElementsMatrix[y][x] == -1) {
                        this.unitsElementsMatrix[y][x] = 0;
                    }
                });
            }
        }

        for(let y = 3; y < this.height-3; y++) {
            for(let x = 3; x < this.width-3; x++) { 
                testNumber2.forEach(number => {
                    if((this.unitsElementsMatrix[y-number][x] == -1 && this.unitsElementsMatrix[y+number][x] == -1) && this.unitsElementsMatrix[y][x] == 0) {
                        this.unitsElementsMatrix[y][x] = -1;
                    }
                });
            }
        }

    }


    lineCheck(y) { 
        let count = 0;
        for(let x = 0; x < this.width-1; x++) { 
            if(this.unitsElementsMatrix[y][x+1] == 0 && this.unitsElementsMatrix[y][x+2] == -1) {
                count++;
                x += 2;
            }
        }
        return count;
    }

    placeTrees() {
        const now = Date.now();
        const simplex = new SimplexNoise();
        
        // Les paramètre utilisent les indicateurs pour choisir les paramètres
        const param = [[0.6,0.003], [0.4,0.004], [0.25,0.0055], [0.1,0.007]]

        const treeThreshold = param[2][0]; // Adjust this value to change the tree density (lower value results in denser clusters)
        const scale = param[2][1]; // Adjust this value to change the size of the tree clusters (smaller value results in larger clusters)
      
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const nx = x * scale;
            const ny = y * scale;
      
            const simplexValue = simplex.noise2D(nx, ny);
      
            if (simplexValue > treeThreshold && this.unitsElementsMatrix[y][x] === 0) {
              this.unitsElementsMatrix[y][x] = 1; // Set the value to 1 to represent a tree
            }
          }
        }
        console.log("temps d'éxécution placeTrees : " + (Date.now() - now) + "ms");
      }
      
      

    placeMines() {
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
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const value = this.unitsElementsMatrix[y][x];

                // Set color based on the value (0 for black)
                switch (value) { 
                    case -1:
                        ctx.fillStyle = "blue";
                        break;
                    case 0:
                        ctx.fillStyle = "black";
                        break;
                    case 1:
                        ctx.fillStyle = "green";
                        break;
                }

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
let mapGenerator = new MapGenerator(1000, 1000, [1, 2, 3, 4, 5]);
  
// Generate the map
mapGenerator.generate();
mapGenerator.drawMap();

/*let test = setInterval(function() { 
    // Initialize the map generator with the given parameters
    let mapGenerator = new MapGenerator(1000, 1000, [1, 2, 3, 4, 5]);
    
    // Generate the map
    mapGenerator.generate();
    mapGenerator.drawMap();
}, 1000);*/



// Ajoutez un écouteur d'événement clavier sur la fenêtre
window.addEventListener('keydown', function(event) {

    // Vérifiez si la touche pressée est la barre d'espace
    if (event.code === 'Space') {
        clearInterval(test);
        //mapGenerator.fillEarth();
        //mapGenerator.drawMap();
      
    }
  });
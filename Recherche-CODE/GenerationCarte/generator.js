class MapGenerator {
    constructor(width, height, indicators) {
        this.width = width;
        this.height = height;
        this.indicators = indicators;
        this.unitsElementsMatrix = Array(height).fill(null).map(() => Array(width).fill(-1));          
        this.lifeDeadZonesMatrix = Array(height).fill(null).map(() => Array(width).fill(-1));
      }
  
    generate() {
        let total = Date.now();

        let now = Date.now();
        this.playZone();
        console.log("temps d'éxécution playZone : " + (Date.now() - now) + "ms");

        now = Date.now();
        this.placeTrees();
        console.log("temps d'éxécution placeTrees : " + (Date.now() - now) + "ms");

        now = Date.now();
        this.placeMines(); 
        console.log("temps d'éxécution placeMines : " + (Date.now() - now) + "ms");
        
        now = Date.now();
        this.defineSpawnPoints();
        console.log("temps d'éxécution defineSpawnPoints : " + (Date.now() - now) + "ms");
        
        now = Date.now();
        this.placeTotems();
        console.log("temps d'éxécution placeTotems : " + (Date.now() - now) + "ms");

        now = Date.now();
        this.totemCheck();
        console.log("temps d'éxécution totemCheck : " + (Date.now() - now) + "ms");

        console.log("temps d'éxécution total : " + (Date.now() - total) + "ms");
       /* 
        this.spawnEnemies();
        this.fillLifeMatrix();
        */
    }
    
    playZone() {
        

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
        const up = (this.points[0][1] > this.points[1][1]) && (this.points[0][1] > this.points[7][1]);
        const down = (this.points[4][1] < this.points[5][1]) && (this.points[4][1] < this.points[3][1]);
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
                    
                    fill = false;

                    if((count == 1 || count == 3) && check == 4) { 
                        fill = true;
                    }

                    if(count == 1 && check == 2) {
                        fill = true;
                        if(up) {
                            if(this.points[1][1] <= this.points[7][1]) {
                                const diff = this.points[0][1] - this.points[7][1]-1;
                                if (y <= this.points[7][1]+diff && y >= this.points[7][1]) {
                                    fill = false;
                                }
                            }
                            else {
                                const diff = this.points[7][1] - this.points[7][1]-1;
                                if (y <= this.points[1][1]+diff && y >= this.points[1][1]) {
                                    fill = false;
                                }
                            }
                        }
                        if(down) {
                            if(this.points[5][1] <= this.points[3][1]) {
                                const diff = this.points[3][1] - this.points[5][1]-1;
                                if (y <= this.points[3][1]+diff && y >= this.points[3][1]) {
                                    fill = false;
                                }
                            }
                            else {
                                const diff = this.points[3][1] - this.points[5][1]-1;
                                if (y <= this.points[5][1]+diff && y >= this.points[5][1]) {
                                    fill = false;
                                }
                            }
                        }
                    }

                    if(check == 3) {
                        const diffUp = this.points[2][1] > this.points[6][1] ? this.points[6][1] - this.points[0][1]-1 : this.points[2][1] - this.points[0][1]-1;
                        if(up && y <= this.points[0][1]+diffUp) {
                            if(this.points[1][1] <= this.points[7][1]) {
                                if(count == 2) {
                                    fill = true;
                                }
                            }
                            else {
                                if(count == 1) {
                                    fill = true;
                                }
                            }
                            if((y <= this.points[0][1]+10 && y >= this.points[0][1]-10) && (count == 1 || count == 2)) {
                                fill = true;
                            }

                            

                        }

                        const diffdown = this.points[2][1] > this.points[6][1] ? this.points[4][1] - this.points[2][1]-1 : this.points[4][1] - this.points[6][1]-1;
                        if(down && y >= this.points[4][1]-diffUp) {
                            if(this.points[5][1] <= this.points[3][1]) {
                                if(count == 2) {
                                    fill = true;
                                }
                            }
                            else {
                                if(count == 1) {
                                    fill = true;
                                }
                            }
                            if((y >= this.points[4][1]-10 && y <= this.points[4][1]+10) && (count == 1 || count == 2)) {
                                fill = true;
                            }

                            

                        }
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
        const simplex = new SimplexNoise();
        
        // Les paramètre utilisent les indicateurs pour choisir les paramètres
        const param = [[0.6,0.003], [0.4,0.004], [0.25,0.0055], [0.1,0.007]]

        const treeThreshold = param[3][0]; // Adjust this value to change the tree density (lower value results in denser clusters)
        const scale = param[3][1]; // Adjust this value to change the size of the tree clusters (smaller value results in larger clusters)
      
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
        
      }
      
      

    placeMines() {
        const simplex = new SimplexNoise();
        
        // Les paramètre utilisent les indicateurs pour choisir les paramètres
        const param = [[0.93,0.005], [0.88,0.005], [0.83,0.005], [0.78,0.005]]

        const treeThreshold = param[3][0]; // Adjust this value to change the tree density (lower value results in denser clusters)
        const scale = param[3][1]; // Adjust this value to change the size of the tree clusters (smaller value results in larger clusters)
      
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const nx = x * scale;
            const ny = y * scale;
      
            const simplexValue = simplex.noise2D(nx, ny);
      
            if (simplexValue > treeThreshold && this.unitsElementsMatrix[y][x] === 0) {
              this.unitsElementsMatrix[y][x] = 2; // Set the value to 1 to represent a tree
            }
          }
        }
    }

    
  
    defineSpawnPoints() {
      let pointsdist = [this.dist(this.points[0], this.points[4]), this.dist(this.points[1], this.points[5]), this.dist(this.points[2], this.points[6]), this.dist(this.points[3], this.points[7])];
      let maxDistance = Math.max(...pointsdist); 
      let indexMaxDistance = pointsdist.indexOf(maxDistance); 
        
      let position;
      switch (indexMaxDistance) {
        case 0:
            this.spawnPoints = [this.points[0], this.points[4]];
            position = [[0,1] , [0,-1]];
            break;
        case 1:
            this.spawnPoints = [this.points[1], this.points[5]];
            position = [[-1,1] , [1,-1]];
            break;
        case 2:
            this.spawnPoints = [this.points[2], this.points[6]];
            position = [[-1,0] , [1,0]];
            break;
        case 3:
            this.spawnPoints = [this.points[3], this.points[7]];
            position = [[-1,-1] , [1,1]];
            break;
      }

      let values = [3,4];
      values = this.shuffleArray(values);
      let distance = maxDistance*0.1;
      for( let i = 0; i < 2; i++) { 
        this.spawnPoints[i][0] += Math.round(position[i][0]*distance);
        this.spawnPoints[i][1] += Math.round(position[i][1]*distance);

        let radius = Math.round(this.width*0.015);
        

        this.fillAround(this.unitsElementsMatrix,this.spawnPoints[i][0], this.spawnPoints[i][1], radius , values[i]);
      }
      
      let radius2 = Math.round(this.width*0.010);
      this.path = this.makePaths(this.spawnPoints[0], this.spawnPoints[1], radius2);
      
      this.placeOutposts();

      

    }

    fillAround(matrice,x,y,radius, value) {
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                
                if(![3,4,5,6].includes(this.unitsElementsMatrix[y+i][x+j])) {
                    matrice[y+i][x+j] = value;
                }
                
                
            }
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    dist(pointA, pointB) {
        return  Math.sqrt(Math.pow(pointA[0]-pointB[0],2)+Math.pow(pointA[1]-pointB[1],2));
    }
  
    makePaths(startPoint, endPoint, radius) {

        let path = [];

        let x = startPoint[0];
        let y = startPoint[1];

        const addX = endPoint[0] - startPoint[0] > 0 ? 1 : -1;
        const addY = endPoint[1] - startPoint[1] > 0 ? 1 : -1;

        const distX = Math.abs(endPoint[0] - startPoint[0]);
        const distY = Math.abs(endPoint[1] - startPoint[1]);

        const ratio = distX / (distX + distY);


        while(x != endPoint[0] || y != endPoint[1]) {
            path.push([x,y]);
            if ( x != endPoint[0] && y != endPoint[1]) {
                if(Math.random() > ratio) {
                    y += addY;
                    
                } else {
                    x += addX;
                }
            }
            else if (x != endPoint[0]) {
                x += addX;
            }
            else if (y != endPoint[1]) {
                y += addY;
            }

            
            this.fillAround(this.unitsElementsMatrix,x,y,radius, 0);
            
        }

        return path;
    }
  
    placeOutposts() {
        let radius = Math.round(this.width*0.015);
        this.fillAround(this.unitsElementsMatrix,this.path[Math.round(this.path.length/2)][0], this.path[Math.round(this.path.length/2)][1], radius , 5);
    }
  
    placeTotems() {

        let radius = Math.round(this.width*0.1);

        let matriceTotems = Array(this.height).fill(null).map(() => Array(this.width).fill(-1));
        for(let y = 0; y<matriceTotems.length;y++) {
            for(let x = 0; x<matriceTotems[y].length;x++) {
                if(this.unitsElementsMatrix[y][x] == 0) {
                    matriceTotems[y][x] = 0;
                }
            }
        }

        this.totems = [];

        let totalEarth = this.check(this.unitsElementsMatrix, 0);
        while(this.check(matriceTotems, 0) > (totalEarth*0.05)) {
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);
            if(matriceTotems[y][x] == 0) {
                this.totems.push([x,y]);
                this.fillAroundCircle(matriceTotems,x,y,radius, -1);
                this.fillAroundCircle(this.unitsElementsMatrix,x,y,3, 6);
            }
        }


    }

    totemCheck() {
        const basePos = this.unitsElementsMatrix[this.spawnPoints[0][1]][this.spawnPoints[0][0]] === 4 ? this.spawnPoints[0] : this.spawnPoints[1];
        
        let validTotems = [];
        let invalidTotems = [];
        
        for (const totem of this.totems) {
            if (this.hasPath(this.unitsElementsMatrix, basePos[0], basePos[1], totem[0], totem[1],1)) {
                validTotems.push(totem);
            }
            else {
                invalidTotems.push(totem);
            }
        }
        
        let tempTotem;

        if(validTotems.length == 0) { 
            tempTotem = this.getClosestPoint(basePos, invalidTotems);
            invalidTotems.splice(invalidTotems.indexOf(tempTotem), 1);
            validTotems.push(tempTotem);
        }

        
        let radius = Math.round(this.width*0.005);


        let tempTotem2;
        while( invalidTotems.length > 0) {
            tempTotem = invalidTotems[0];
            tempTotem2 = this.getClosestPoint(tempTotem, validTotems);
            invalidTotems.shift();
            validTotems.push(tempTotem);
            this.makePaths(tempTotem, tempTotem2, 3);
        }

        

        console.log(validTotems, invalidTotems)
    }

    getClosestPoint(point, points) {
        let minDistance = Infinity;
        let closestPoint = null;
    
        points.forEach(candidate => {
            const distance = Math.sqrt(Math.pow(candidate[0] - point[0], 2) + Math.pow(candidate[1] - point[1], 2));
            
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = candidate;
            }
        });
    
        return closestPoint;
    }
    

    hasPath(matrix, startX, startY, endX, endY) {
        const visited = new Array(matrix.length).fill(false).map(() => new Array(matrix[0].length).fill(false));
        const queue = [[startX, startY]];
      
        while (queue.length > 0) {
          const [x, y] = queue.shift();
          if (x === endX && y === endY) {
            return true;
          }
          if (visited[y][x]) {
            continue;
          }
          visited[y][x] = true;
      
          if (matrix[y][x] !== -1 && matrix[y][x] !== 1 && matrix[y][x] !== 2) {
            if (x > 0 && !visited[y][x - 1]) {
              queue.push([x - 1, y]);
            }
            if (x < matrix[0].length - 1 && !visited[y][x + 1]) {
              queue.push([x + 1, y]);
            }
            if (y > 0 && !visited[y - 1][x]) {
              queue.push([x, y - 1]);
            }
            if (y < matrix.length - 1 && !visited[y + 1][x]) {
              queue.push([x, y + 1]);
            }
          }
        }
        return false;
      }
      
        
      

    fillAroundCircle(matrice,x,y,radius, value) {
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                if (y+i >= 0 && y+i < this.height && x+j >= 0 && x+j < this.width && i*i+j*j <= radius*radius) {
                    if(![3,4,5,6].includes(this.unitsElementsMatrix[y+i][x+j])) {
                        matrice[y+i][x+j] = value;
                    }
                }
            }
        }
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
                    case 2:
                        ctx.fillStyle = "yellow";
                        break;
                    case 3:
                        ctx.fillStyle = "red";
                        break;
                    case 4:
                        ctx.fillStyle = "white";
                        break;
                    case 5:
                        ctx.fillStyle = "orange";
                        break;
                    case 6:
                        ctx.fillStyle = "grey";
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

    check(matrice,value) {
        let count = 0;
        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                if(matrice[i][j] == value) {
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

/* 
let count = 0;
let test = setInterval(function() { 
    count++;
    
        // Initialize the map generator with the given parameters
        let mapGenerator1 = new MapGenerator(1000, 1000, [1, 2, 3, 4, 5]);
        
        // Generate the map
        mapGenerator1.generate();
        mapGenerator1.drawMap();
    

    console.log("nombre de tours : " + count);

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
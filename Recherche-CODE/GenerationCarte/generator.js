class MapGenerator {
    constructor(width, height, indicators) {
        this.width = width;
        this.height = height;
        this.indicators = indicators;
        this.unitsElementsMatrix = Array(height).fill(null).map(() => Array(width).fill(0));
        this.lifeDeadZonesMatrix = Array(height).fill(null).map(() => Array(width).fill(0));
      }
  
      generate() {
        this.initializeMatrices();
        this.generateLifeZones();
        this.generateMap();
      }
      
  
    initializeMatrices() {
      for (let i = 0; i < this.height; i++) {
        this.lifeZoneMatrix[i] = new Array(this.width).fill(0);
        this.unitsElementsMatrix[i] = new Array(this.width).fill(0);
      }
    }
  
    generateLifeZones() {
        const deadZonePercentage = this.indicators.CO2 / 1000; // Assuming CO2 is given in kilotonnes
        const totalCells = this.width * this.height;
        const deadZoneCells = Math.floor(totalCells * deadZonePercentage);
      
        // Randomly assign dead zones
        let assignedDeadZones = 0;
        while (assignedDeadZones < deadZoneCells) {
          const x = Math.floor(Math.random() * this.width);
          const y = Math.floor(Math.random() * this.height);
      
          if (this.lifeDeadZonesMatrix[y][x] === 0) {
            this.lifeDeadZonesMatrix[y][x] = -1; // -1 represents a dead zone
            assignedDeadZones++;
          }
        }
      
        // Assign life zones
        for (let i = 0; i < this.height; i++) {
          for (let j = 0; j < this.width; j++) {
            if (this.lifeDeadZonesMatrix[i][j] === 0) {
              this.lifeDeadZonesMatrix[i][j] = 1; // 1 represents a life zone
            }
          }
        }
    }
    
      
  
    generateUnitsAndElements() {
      // Fill the unitsElementsMatrix with the appropriate values based on the given indicators.
      this.placeTrees();
      this.defineBaseSpawnsAndDefaultMines();
      this.generatePaths();
      this.placeOutpostsAndTotems();
      this.placeSolitaryEnemies();
    }
  
    placeTrees() {
        const treePercentage = this.indicators.SurfaceForestiere;
        const totalCells = this.width * this.height;
        const treeCells = Math.floor(totalCells * treePercentage / 100);
      
        const directions = [
          [-1, 0], // left
          [1, 0], // right
          [0, -1], // up
          [0, 1], // down
        ];
      
        let placedTrees = 0;
        while (placedTrees < treeCells) {
          const x = Math.floor(Math.random() * this.width);
          const y = Math.floor(Math.random() * this.height);
      
          // Check if the current cell is empty
          if (this.unitsElementsMatrix[y][x] === 0) {
            let blockedPaths = 0;
      
            // Check if placing a tree here would block all neighboring paths
            for (const [dx, dy] of directions) {
              const newX = x + dx;
              const newY = y + dy;
      
              if (
                newX >= 0 &&
                newY >= 0 &&
                newX < this.width &&
                newY < this.height &&
                this.unitsElementsMatrix[newY][newX] === 1 // Assuming 1 represents a tree
              ) {
                blockedPaths++;
              }
            }
      
            // Place a tree if at least one path is still open
            if (blockedPaths < directions.length) {
              this.unitsElementsMatrix[y][x] = 1; // 1 represents a tree
              placedTrees++;
            }
          }
        }
      }
      
  
      defineBaseSpawnsAndDefaultMines() {
        const baseDistanceFromBorder = 50;
        const mineDistanceFromBase = 20;
      
        // Place allied base
        const alliedBaseX = baseDistanceFromBorder;
        const alliedBaseY = baseDistanceFromBorder;
        this.unitsElementsMatrix[alliedBaseY][alliedBaseX] = 2; // Assuming 2 represents an allied base
      
        // Place allied default mine
        const alliedMineX = alliedBaseX + mineDistanceFromBase;
        const alliedMineY = alliedBaseY;
        this.unitsElementsMatrix[alliedMineY][alliedMineX] = 3; // Assuming 3 represents an allied mine
      
        // Place enemy base
        const enemyBaseX = this.width - baseDistanceFromBorder - 1;
        const enemyBaseY = this.height - baseDistanceFromBorder - 1;
        this.unitsElementsMatrix[enemyBaseY][enemyBaseX] = 4; // Assuming 4 represents an enemy base
      
        // Place enemy default mine
        const enemyMineX = enemyBaseX - mineDistanceFromBase;
        const enemyMineY = enemyBaseY;
        this.unitsElementsMatrix[enemyMineY][enemyMineX] = 5; // Assuming 5 represents an enemy mine
      }
      
  
      generatePaths() {
        const [alliedBaseX, alliedBaseY] = this.findBaseCoordinates(2); // Assuming 2 represents an allied base
        const [enemyBaseX, enemyBaseY] = this.findBaseCoordinates(4); // Assuming 4 represents an enemy base
      
        const path = this.findPath(alliedBaseX, alliedBaseY, enemyBaseX, enemyBaseY);
      
        for (const [x, y] of path) {
          this.unitsElementsMatrix[y][x] = 6; // Assuming 6 represents a path
        }
      }
      
      findBaseCoordinates(baseType) {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            if (this.unitsElementsMatrix[y][x] === baseType) {
                return [x, y];

            }
          }
        }
      
        // If the base is not found, return null.
        return null;
      }
      
      findPath(startX, startY, goalX, goalY) {
        const openSet = [{ x: startX, y: startY, g: 0, h: this.heuristic(startX, startY, goalX, goalY), parent: null }];
        const closedSet = [];
      
        while (openSet.length > 0) {
          openSet.sort((a, b) => a.g + a.h - (b.g + b.h));
          const current = openSet.shift();
      
          if (current.x === goalX && current.y === goalY) {
            const path = [];
            let node = current;
            while (node) {
              path.push([node.x, node.y]);
              node = node.parent;
            }
            return path.reverse();
          }
      
          closedSet.push(current);
      
          const neighbors = this.getNeighbors(current.x, current.y);
          for (const neighbor of neighbors) {
            if (closedSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
              continue;
            }
      
            const tentativeG = current.g + 1;
            const existingOpenNode = openSet.find(node => node.x === neighbor.x && node.y === neighbor.y);
      
            if (!existingOpenNode || tentativeG < existingOpenNode.g) {
              if (!existingOpenNode) {
                openSet.push(neighbor);
              }
              neighbor.parent = current;
              neighbor.g = tentativeG;
              neighbor.h = this.heuristic(neighbor.x, neighbor.y, goalX, goalY);
            }
          }
        }
      
        return []; // No path found
      }
      
      heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
      }
      
      getNeighbors(x, y) {
        const directions = [
          [-1, 0], // left
          [1, 0], // right
          [0, -1], // up
          [0, 1], // down
        ];
      
        const neighbors = [];
        for (const [dx, dy] of directions) {
          const newX = x + dx;
          const newY = y + dy;
      
          if (
            newX >= 0 &&
            newY >= 0 &&
            newX < this.width &&
            newY < this.height &&
            this.unitsElementsMatrix[newY][newX] !== 1 // Assuming 1 represents a tree
            ) {
              neighbors.push({ x: newX, y: newY });
            }
          }
        
          return neighbors;
        }
        
  
        placeOutpostsAndTotems() {
            const path = this.getPathCoordinates();
            const totalOutposts = path.length;
            const totemRadius = Math.ceil(Math.sqrt(this.width * this.height / totalOutposts));
          
            for (let i = 0; i < totalOutposts; i++) {
              const [outpostX, outpostY] = path[i];
              this.unitsElementsMatrix[outpostY][outpostX] = 7; // Assuming 7 represents an outpost
          
              const totem = {
                x: outpostX,
                y: outpostY,
                radius: totemRadius,
              };
          
              this.placeTotem(totem);
            }
          }
          
          getPathCoordinates() {
            const pathCoordinates = [];
            for (let y = 0; y < this.height; y++) {
              for (let x = 0; x < this.width; x++) {
                if (this.unitsElementsMatrix[y][x] === 6) { // Assuming 6 represents a path
                  pathCoordinates.push([x, y]);
                }
              }
            }
            return pathCoordinates;
          }
          
          placeTotem(totem) {
            for (let y = Math.max(0, totem.y - totem.radius); y <= Math.min(this.height - 1, totem.y + totem.radius); y++) {
              for (let x = Math.max(0, totem.x - totem.radius); x <= Math.min(this.width - 1, totem.x + totem.radius); x++) {
                if (Math.sqrt(Math.pow(x - totem.x, 2) + Math.pow(y - totem.y, 2)) <= totem.radius) {
                  this.unitsElementsMatrix[y][x] = 8; // Assuming 8 represents a totem
                }
              }
            }
          }
          
  
          placeSolitaryEnemies() {
            const numberOfEnemies = this.indicators.Population; // Assuming Population determines the number of solitary enemies
          
            const safeDistanceFromBases = 50;
            const safeDistanceFromTreesAndOutposts = 5;
          
            let placedEnemies = 0;
          
            while (placedEnemies < numberOfEnemies) {
              const x = Math.floor(Math.random() * this.width);
              const y = Math.floor(Math.random() * this.height);
          
              // Check if the current cell is empty
              if (this.unitsElementsMatrix[y][x] === 0) {
                // Check distance from player's base, enemy base, trees, and outposts
                let isSafe = true;
          
                for (let dy = -safeDistanceFromTreesAndOutposts; dy <= safeDistanceFromTreesAndOutposts; dy++) {
                  for (let dx = -safeDistanceFromTreesAndOutposts; dx <= safeDistanceFromTreesAndOutposts; dx++) {
                    const newX = x + dx;
                    const newY = y + dy;
          
                    if (
                      newX >= 0 &&
                      newY >= 0 &&
                      newX < this.width &&
                      newY < this.height &&
                      (this.unitsElementsMatrix[newY][newX] === 1 || // Assuming 1 represents a tree
                      this.unitsElementsMatrix[newY][newX] === 2 || // Assuming 2 represents the player's base
                      this.unitsElementsMatrix[newY][newX] === 4 || // Assuming 4 represents the enemy base
                      this.unitsElementsMatrix[newY][newX] === 7)   // Assuming 7 represents an outpost
                    ) {
                      isSafe = false;
                      break;
                    }
                  }
          
                  if (!isSafe) {
                    break;
                  }
                }
          
                if (isSafe) {
                  this.unitsElementsMatrix[y][x] = 9; // Assuming 9 represents a solitary enemy
                  placedEnemies++;
                }
              }
            }
          }
          

          generateMap() {
            this.defineBaseSpawnsAndDefaultMines(); // Move this line before generateLifeZones()
            this.generateLifeZones();
            this.placeTrees();
            this.generatePaths();
            this.placeOutpostsAndTotems();
            this.placeSolitaryEnemies();
          }
          

          printMatrix(matrix) {
            console.log(matrix.map(row => row.join(" ")).join("\n"));
          }
        
          printMap() {
            console.log("Units/Elements Matrix:");
            this.printMatrix(this.unitsElementsMatrix);
            console.log("\nLife/Dead Zones Matrix:");
            this.printMatrix(this.lifeDeadZonesMatrix);
          }
  
    // Additional helper methods can be added as needed to complete the generation.
  }
  

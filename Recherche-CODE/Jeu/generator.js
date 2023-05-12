/**
 * Classe permettant de générer la carte de jeu
 */
class MapGenerator {

    /** Constructeur de la classe MapGenerator
     * 
     * @param {*} width  Largeur de la carte
     * @param {*} height  Hauteur de la carte
     * @param {*} indicators  Tableau d'indicateurs
     */
    constructor(width, height, indicators, etenduIndicator) {
        this.width = width;
        this.height = height;
        this.unitsElementsMatrix = Array(height).fill(null).map(() => Array(width).fill(-1));          
        this.lifeDeadZonesMatrix = Array(height).fill(null).map(() => Array(width).fill(-1));

        this.radiusSpawn = 6;
        this.radiusSpawnPath =  Math.round(this.width*0.010);
        this.radiusOutpost = Math.round(this.width*0.015);
        this.radiusTotem = Math.round(this.width*0.2);
        this.radiusTotemPath = Math.round(this.width*0.006);
        this.radiusLifeSpawn = Math.round(this.width*0.05);

        // Vérifie si les indicateurs sont dans les bornes
        this.checkIndicators(indicators, etenduIndicator);

        this.paramSize = (indicators["Territoire"] - etenduIndicator["Territoire"]["min"])/(etenduIndicator["Territoire"]["max"] - etenduIndicator["Territoire"]["min"]); // Valeur entre 0 et 1
        this.paramDeathZone = (indicators["CO2"] - etenduIndicator["CO2"]["min"])/(etenduIndicator["CO2"]["max"] - etenduIndicator["CO2"]["min"]); // Valeur entre 0 et 1
        this.paramMine = 1-(indicators["TotalReserves"] - etenduIndicator["TotalReserves"]["min"])/(etenduIndicator["TotalReserves"]["max"] - etenduIndicator["TotalReserves"]["min"]); // Valeur entre 0 et 1
        this.paramEnnemi = 1-(indicators["PopulationUrbaine"] - etenduIndicator["PopulationUrbaine"]["min"])/(etenduIndicator["PopulationUrbaine"]["max"] - etenduIndicator["PopulationUrbaine"]["min"]); // Valeur entre 0 et 1
        
        let gap = (etenduIndicator["SurfaceForestiere"]["max"] - etenduIndicator["SurfaceForestiere"]["min"])/3;
        this.paramTree = Math.round((indicators["SurfaceForestiere"] - etenduIndicator["SurfaceForestiere"]["min"])/gap); // choix entre 0 et 3
      }

    /** Verifie si les indicateurs sont dans les bornes
     * Si ce n'est pas le cas, on les remet dans les bornes
     * 
     * @param {*} indicators Liste des indicateurs à vérifier
     * @param {*} etenduIndicator Liste des bornes des indicateurs
     */
    checkIndicators(indicators, etenduIndicator) {
        for(let indicator in indicators) {
            if(indicators[indicator] > etenduIndicator[indicator]["max"]) {
                indicators[indicator] = etenduIndicator[indicator]["max"];
            }
            else if(indicators[indicator] < etenduIndicator[indicator]["min"]) {
                indicators[indicator] = etenduIndicator[indicator]["min"];
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

  
    /**
     * Méthode principale permettant de générer la carte
     */
    generate() {
        let total = Date.now();

        let now = Date.now();
        this.playZone();
        console.log("temps d'éxécution playZone : " + (Date.now() - now) + "ms");

        now = Date.now();
        this.placeTrees();
        console.log("temps d'éxécution placeTrees : " + (Date.now() - now) + "ms");
        
        now = Date.now();
        this.defineSpawnPoints();
        console.log("temps d'éxécution defineSpawnPoints : " + (Date.now() - now) + "ms");
        
        now = Date.now();
        this.placeElement(6, 2,this.radiusTotem, 0.05);
        console.log("temps d'éxécution placeElement Totem : " + (Date.now() - now) + "ms");
        
        now = Date.now();
        this.placeElement(2, 2,50 + Math.round(this.paramMine*50), 0.05);
        console.log("temps d'éxécution placeElement mine : " + (Date.now() - now) + "ms");

        now = Date.now();
        this.placeElement(7, 3,30 + Math.round(this.paramEnnemi*30), 0.1);
        console.log("temps d'éxécution placeElement ennemie : " + (Date.now() - now) + "ms");

        now = Date.now();
        this.elementCheck([6,2,7]);
        console.log("temps d'éxécution elementCheck : " + (Date.now() - now) + "ms");

        now = Date.now();
        this.fillLifeMatrix();
        console.log("temps d'éxécution fillLifeMatrix : " + (Date.now() - now) + "ms");
        

        console.log("temps d'éxécution total : " + (Date.now() - total) + "ms");
    }
    
    /**
     * Création de la l'îles sur laquelle les joueurs vont jouer
     */
    playZone() {
        

        let x = this.width / 2;
        let y = this.height / 2;



        this.points = [];
        const distMin = Math.round(Math.round(this.width/2) * 0.3);
        const distMax = Math.round(Math.round(this.width/2) * 0.7);
        const bonusIndicator = Math.round(Math.round(this.width/2) * 0.25) * this.paramSize;


        const position = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1]];

        position.forEach(pos => {
            let dist = Math.round(Math.random() * (distMax - distMin) + distMin + bonusIndicator);
            this.points.push([pos[0] * (dist) + x, pos[1] * (dist) + y]);
        });


        this.linkPoints();
        this.fillEarth();
    }
    
    /**
     * Méthode permettant de relier les points entre eux
     * Utilisée dans la méthode playZone
     */
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

    /**
     * Méthode permettant de remplir de terre l'intérieur de la bordure
     * Utilisée dans la méthode playZone
     */
    fillEarth() {
        // Vérification de cas spéciaux
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

                    // cas spécial où il y a 4 pack de 0
                    if((count == 1 || count == 3) && check == 4) { 
                        fill = true;
                    }

                    // cas spécial où il y a 2 pack de 0
                    if(count == 1 && check == 2) {
                        fill = true;
                        if(up) {
                            if(this.points[1][1] <= this.points[7][1]) {
                                const diff = this.points[0][1] - this.points[7][1];
                                if (y <= this.points[7][1]+diff && y >= this.points[7][1]) {
                                    fill = false;
                                }
                            }
                            else {
                                const diff = this.points[0][1] - this.points[1][1];
                                if (y <= this.points[1][1]+diff && y >= this.points[1][1]) {
                                    fill = false;
                                }
                            }
                        }
                        if(down) {
                            /*
                            if(y <= this.points[4][1]) {
                                fill = true;
                            }*/
                            
                            if(this.points[5][1] <= this.points[3][1]) {
                                const diff = this.points[5][1] - this.points[4][1];
                                if (y >= this.points[5][1]-diff && y <= this.points[5][1]) {
                                    fill = false;
                                }
                            }
                            else {
                                const diff = this.points[3][1] - this.points[4][1];
                                if (y >= this.points[3][1]-diff && y <= this.points[3][1]) {
                                    fill = false;
                                }
                            }
                            
                        }
                    }

                    // cas spécial où il y a 3 pack de 0
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
                            const diffUp2 = Math.round((this.points[1][1] > this.points[7][1] ? this.points[0][1] - this.points[1][1] : this.points[0][1] - this.points[7][1])/2);
                            if((y <= this.points[0][1]+diffUp && y >= this.points[0][1]-diffUp2) && (count == 1 || count == 2)) {
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
                            const diffdown2 = Math.round((this.points[3][1] > this.points[5][1] ? this.points[5][1] - this.points[4][1] : this.points[3][1] - this.points[4][1])/2);
                            if((y >= this.points[4][1]-diffdown && y <= this.points[4][1]+diffdown2) && (count == 1 || count == 2)) {
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

        // Permet de retirer certaines erreurs de remplissage
        
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

    /**
     * Permet de compter le nombre de pack de 0 dans une ligne
     * Utilisée dans la méthode fillEarth
     * 
     * @param {*} y Ligne y à vérifier
     * @returns Nombre de pack de 0
     */
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

    /**
     * Permet de placer les arbres sur la carte
     * Utilise Perlin noise pour placer les arbres
     */
    placeTrees() {
        const simplex = new SimplexNoise();
        
        // Les paramètre utilisent les indicateurs pour choisir les paramètres
        const param = [[0.4,0.01], [0.3,0.015], [0.2,0.02], [0.05,0.03]]

        const treeThreshold = param[this.paramTree][0]; // Ajustez cette valeur pour changer la densité des arbres (plus la valeur est petite, plus il y a d'arbres)
        const scale = param[this.paramTree][1]; // Ajustez cette valeur pour changer la taille des arbres (plus la valeur est petite, plus les arbres sont grands)
      
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const nx = x * scale;
            const ny = y * scale;
      
            const simplexValue = simplex.noise2D(nx, ny);
      
            if (simplexValue > treeThreshold && this.unitsElementsMatrix[y][x] === 0) {
              this.unitsElementsMatrix[y][x] = 1; // 1 = arbre
            }
          }
        }
        
      }
    
    /**
     * Permet de placer les points d'apparition du joueur et de l'ennemi
     * Place égalemnet l'avant poste ennemi
     * Les points d'apparition sont placés aux extrémités de la carte en fonction de la plus grande distance entre les points de la carte
     */
    defineSpawnPoints() {
        // On récupère la distance entre les points de la carte et on récupère la plus grande distance
      let pointsdist = [this.dist(this.points[0], this.points[4]), this.dist(this.points[1], this.points[5]), this.dist(this.points[2], this.points[6]), this.dist(this.points[3], this.points[7])];
      let maxDistance = Math.max(...pointsdist); 
      let indexMaxDistance = pointsdist.indexOf(maxDistance); 
        
      let position;
      // En fonction des cas on récupère la position des points d'apparition par rapport au centre de la carte
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

      // 3 et 4 sont les valeurs des points d'apparition (3 = joueur, 4 = ennemi)
      let values = [3,4];
      values = this.shuffleArray(values);

      let distance = maxDistance*0.1;

      // On place les points d'apparition
      for( let i = 0; i < 2; i++) { 
        this.spawnPoints[i][0] += Math.round(position[i][0]*distance);
        this.spawnPoints[i][1] += Math.round(position[i][1]*distance);

        // On remplit autour des points d'apparition pour définir la zone d'apparition
        this.fillAround(this.unitsElementsMatrix,this.spawnPoints[i][0], this.spawnPoints[i][1], this.radiusSpawn , values[i]);
      }
      
      // Pour être sur qu'un chemin existe entre les deux points d'apparition on fait un chemin entre les deux points
      this.path = this.makePaths(this.spawnPoints[0], this.spawnPoints[1], this.radiusSpawnPath);
      
      // On place l'avant poste 
      this.placeOutposts();
    }

    /**Méthode permettant de remplir autour d'un point de la matrice
     * Elle ne remplace pas les valeurs -1,3,4,5 et 6 
     * 
     * @param {*} matrice Matrice que nous allons modifier
     * @param {*} x coordonnée x du point
     * @param {*} y coordonnée y du point
     * @param {*} radius rayon de remplissage
     * @param {*} value  valeur que nous allons mettre dans la matrice
     */
    fillAround(matrice,x,y,radius, value) {
        radius = x-radius < 0 ? x-1 : radius;
        radius = y-radius < 0 ? y-1 : radius;
        radius = x+radius >= matrice[0].length ? matrice[0].length-x-1 : radius;
        radius = y+radius >= matrice.length ? matrice.length-y-1 : radius; 
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                if(![-1,3,4,5,6,7,2].includes(this.unitsElementsMatrix[y+i][x+j])) {
                    matrice[y+i][x+j] = value;
                }
                
                
            }
        }
    }

    /** Permet de mélanger un tableau
     * 
     * @param {*} array Le tableau que nous allons mélanger
     * @returns le tableau mélangé
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /** Permet de calculer la distance entre deux points
     * 
     * @param {*} pointA Objet contenant les coordonnées du point A
     * @param {*} pointB Objet contenant les coordonnées du point B
     * @returns Distance entre les deux points
     */
    dist(pointA, pointB) {
        return  Math.sqrt(Math.pow(pointA[0]-pointB[0],2)+Math.pow(pointA[1]-pointB[1],2));
    }
    
    /** Fais un chemin entre deux points
     * 
     * @param {*} startPoint Objet contenant les coordonnées du point de départ
     * @param {*} endPoint Objet contenant les coordonnées du point d'arrivée
     * @param {*} radius Epaissseur du chemin
     * @returns Chemin entre les deux points
     */
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
  
    /**
     * Place l'avant poste ennemi au milieu du chemin
     */
    placeOutposts() {
        this.outpost = [this.path[Math.round(this.path.length/2)][0], this.path[Math.round(this.path.length/2)][1]];
        this.fillAround(this.unitsElementsMatrix,this.path[Math.round(this.path.length/2)][0], this.path[Math.round(this.path.length/2)][1], this.radiusOutpost , 5);
    }
  
    /** Place les totems sur la carte
     * 
     */
    placeElement(value, size, radius, remainingLand) {
        // Matrice temporaires contenant les emplacement possible pour les totems
        let matriceTemp = Array(this.height).fill(null).map(() => Array(this.width).fill(-1));
        for(let y = 0; y<matriceTemp.length;y++) {
            for(let x = 0; x<matriceTemp[y].length;x++) {
                if(this.unitsElementsMatrix[y][x] == 0) {
                    matriceTemp[y][x] = 0;
                }
            }
        }

        // On empèche les éléments d'apparaitre à côté des points de spawn et de l'avant poste
        this.fillAroundCircle(matriceTemp, this.spawnPoints[0][0], this.spawnPoints[0][1], Math.round(radius/2), -1);
        this.fillAroundCircle(matriceTemp, this.spawnPoints[1][0], this.spawnPoints[1][1], Math.round(radius/2), -1);
        this.fillAroundCircle(matriceTemp, this.outpost[0], this.outpost[1], Math.round(radius/2), -1);

        switch(value) {
            case 6:
                this.totems = [];
                break;
            case 7:
                this.ennemies = [];
                break
            case 2:
                this.mines = [];
                break;
        }

        let totalEarth = this.check(this.unitsElementsMatrix, 0);
        while(this.check(matriceTemp, 0) > totalEarth * remainingLand) {
            // on prend un point au hasard
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);
            // si le point est libre
            if(matriceTemp[y][x] == 0) {
                if(this.checkAround(matriceTemp, x, y, 0, size)) {
                    switch(value) {
                        case 6:
                            this.totems.push([x,y]);
                            break;
                        case 7:
                            this.ennemies.push([x,y]);
                            break
                        case 2:
                            this.mines.push([x,y]);
                            break;
                    }

                    this.fillAround(matriceTemp,x,y,radius, -1);
                    this.fillAround(this.unitsElementsMatrix,x,y,size, value);
             }
            }
        }
    }

    checkAround(matrice, x, y, value, radius) {
        for(let i = -radius; i<=radius; i++) {
            for(let j = -radius; j<=radius; j++) {
                if(x+i >= 0 && x+i < matrice[0].length && y+j >= 0 && y+j < matrice.length) {
                    if(matrice[y+j][x+i] != value) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Vérifie si les totems sont accessible depuis la base du joueur
     * Si ce n'est pas le cas, on trouve le totem valide le plus proche du totem non valide et on fait un chemin entre les deux
     */
    elementCheck(list) {
        // On récupère la position de la base du joueur
        const basePos = this.unitsElementsMatrix[this.spawnPoints[0][1]][this.spawnPoints[0][0]] === 4 ? this.spawnPoints[0] : this.spawnPoints[1];
        
        for(let value in list) {
            value = list[value];
            let elementList;
            switch(value) {
                case 6:
                    elementList = this.totems;
                    break;
                case 7:
                    elementList = this.ennemies;
                    break
                case 2:
                    elementList = this.mines;
                    break;
            }
            

            let validElements = [];
            let invalidElements = [];
            
            // On récupère les totems valides et invalides
            for (const elt of elementList) {
                if (this.hasPath(this.unitsElementsMatrix, basePos[0], basePos[1], elt[0], elt[1])) {
                    validElements.push(elt);
                }
                else {
                    invalidElements.push(elt);
                }
            }
            
            let tempElement;

            // Si il n'y a pas de totem valide, on prend le totem le plus proche de la base et on fait un chemin entre les deux
            if(validElements.length == 0) { 
                tempElement = this.getClosestPoint(basePos, invalidElements);
                invalidElements.splice(invalidElements.indexOf(tempElement), 1);
                validElements.push(tempElement);
            }

            // Tant qu'il y a des totems invalides, on prend le totem valide le plus proche du totem invalide et on fait un chemin entre les deux
            let tempElement2;
            while( invalidElements.length > 0) {
                tempElement = invalidElements[0];
                tempElement2 = this.getClosestPoint(tempElement, validElements);
                invalidElements.shift();
                validElements.push(tempElement);
                this.makePaths(tempElement, tempElement2, this.radiusTotemPath);
            }
        }
    }

    /** Renvoie le point le plus proche du point donné en paramètre
     * 
     * @param {*} point Objet contenant les coordonnées du point
     * @param {*} points Liste des points à tester
     * @returns Le point le plus proche du point donné en paramètre
     */
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
    
    /** Vérifie si un chemin exitent entre deux points
     * 
     * @param {*} matrix Matrice contenant les points à tester
     * @param {*} startX Coordonnée X du point de départ
     * @param {*} startY Coordonnée Y du point de départ
     * @param {*} endX Coordonnée X du point d'arrivée
     * @param {*} endY Coordonnée Y du point d'arrivée
     * @returns True si un chemin existe, false sinon
     */
    hasPath(matrix, startX, startY, endX, endY) {
        // On crée une matrice de visite
        const visited = new Array(matrix.length).fill(false).map(() => new Array(matrix[0].length).fill(false));
        const queue = [[startX, startY]];
      
        // On parcours la matrice
        while (queue.length > 0) {
          // On récupère le premier élément de la file
          const [x, y] = queue.shift();
          // Si on est arrivé au point d'arrivée, on renvoie true
          if (x === endX && y === endY) {
            return true;
          }
          // Si on a déjà visité le point, on passe au suivant
          if (visited[y][x]) {
            continue;
          }
          // On marque le point comme visité
          visited[y][x] = true;
          
          // Si le point n'est pas un obstacle, on ajoute les points adjacents à la file
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
      
        
      
    /** Méthode permettant de remplir sous forme de cercle autour d'un point de la matrice
     * Elle ne remplace pas les valeurs -1,3,4,5 et 6 
     * 
     * @param {*} matrice matrice à modifier
     * @param {*} x Coordonnée X du point
     * @param {*} y Coordonnée Y du point
     * @param {*} radius Rayon du cercle
     * @param {*} value Valeur à mettre dans la matrice
     */
    fillAroundCircle(matrice,x,y,radius, value) {
        radius = x-radius < 0 ? x-1 : radius;
        radius = y-radius < 0 ? y-1 : radius;
        radius = x+radius >= matrice[0].length ? matrice[0].length-x-1 : radius;
        radius = y+radius >= matrice.length ? matrice.length-y-1 : radius;
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                if (y+i >= 0 && y+i < this.height && x+j >= 0 && x+j < this.width && i*i+j*j <= radius*radius) {
                    if(![-1,3,4,5,6,7,2].includes(this.unitsElementsMatrix[y+i][x+j])) {
                        matrice[y+i][x+j] = value;
                    }
                }
            }
        }
    }
  
    /**
     * Rempli la matrice de vie en fonction de la matrice des unités
     * Au début, la matrice de vie est remplie de zone morte (-1) sauf autour de la base (1)
     */
    fillLifeMatrix() {
        const basePos = this.unitsElementsMatrix[this.spawnPoints[0][1]][this.spawnPoints[0][0]] === 4 ? this.spawnPoints[0] : this.spawnPoints[1];

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.unitsElementsMatrix[y][x] == -1) {
                    this.lifeDeadZonesMatrix[y][x] = -1;
                }
                else if (this.unitsElementsMatrix[y][x] == 4) {
                    this.lifeDeadZonesMatrix[y][x] = 1;
                }
                else {
                    this.lifeDeadZonesMatrix[y][x] = 0;
                }
            }
        }

        this.fillAroundCircle(this.lifeDeadZonesMatrix, basePos[0], basePos[1], Math.round(this.radiusLifeSpawn + (this.paramDeathZone * this.radiusLifeSpawn)), 1);
    }

    

    /** Permet de compter le nombre de case d'une certaine valeur dans une matrice
     * |Non utilisée dans le code|
     * 
     * @param {*} matrice Matrice à analyser
     * @param {*} value Valeur à compter
     * @returns Nombre de case de la valeur dans la matrice
     */
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

    

    /** Permet de récupérer les information générées
     * 
     * @returns Retourne les informations de la carte
     */
    exportMap() {
        const map = {
            "width": this.width,
            "height": this.height,
            "unitsElementsMatrix": this.unitsElementsMatrix,
            "lifeDeadZonesMatrix": this.lifeDeadZonesMatrix,
            "spawnPoints": this.spawnPoints,
            "totems": this.totems,
            "outpost": this.outpost
        }

        return map;
    }

  }
  
  

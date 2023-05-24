function distance(x1, y1, x2, y2) { //distance entre 2 points (x1,y1) et (x2,y2)
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
  }
  
  function checkResources(goldCost, manaCost){ //fonction qui vérifie si le joueur a une certaine quantité de ressources
    if(goldCost<=gold && manaCost<=mana){
      return true;
    }
    return false;
  }
  
  function modifyGold(goldAmount){ //fonction qui ajoute un certain montant de resources au joueur ou lui en retire si la quantité est négative
    gold+=goldAmount;
    document.getElementById("gold").innerText="Or: "+gold;
  }
  
  function modifyMana(manaAmount){ //fonction qui ajoute un certain montant de resources au joueur ou lui en retire si la quantité est négative
    mana+=manaAmount;
    document.getElementById("mana").innerText="Mana: "+mana;
  }
  
  function changeButton(n,image = "./img/wood_bg.jpg", fonction = null){
    let button = document.getElementById("button"+n);
    button.onclick=fonction;
    button.style.backgroundImage="url("+image+")";
  }
  
  function resetButtons(){
    for(let i = 1; i<=9; i++){
      changeButton(i);
    }
  }

  // Fonction qui affiche les coordonnées de la case cliquée
function getCoords(x = event.clientX, y = event.clientY) {
    return [Math.floor((x+camera.cameraX-gridLeft)/square_size), Math.floor((y+camera.cameraY-gridTop)/square_size)];
  }
  
  // Fonction qui sera exécutée lorsque l'utilisateur clique n'importe où sur la page
  function onPageClick(event) {
    event.preventDefault();
    let destination_x = getCoords()[0];
    let destination_y = getCoords()[1];
    if(selectedUnits.length>=1){
      selectedUnits.forEach(selectedUnit => {
        goTo(selectedUnit,destination_x,destination_y);
        selectedUnit.isOrderedToTarget=false;
        selectedUnit.target=false;
        selectedUnit.isOrderedToCollectMana=false;
        selectedUnit.isOrderedToCollectGold=false;
      });
  
      if(matrice_unites[destination_y] && matrice_unites[destination_y][destination_x] && matrice_unites[destination_y][destination_x]==1){ //si la cible est un arbre
        selectedUnits.forEach(selectedUnit => { //pour toutes les unités de la sélection
          if(selectedUnit.canCollectMana){ //si l'unité peut récolter du mana
            selectedUnit.isOrderedToCollectMana=true; //on ordonne à l'unité de récolter du mana
          }
        });
      }
      else if(matrice_unites[destination_y] && matrice_unites[destination_y][destination_x] && matrice_unites[destination_y][destination_x][0]==1){ //si la cible est une unité
        let targetMine = false;
        if(liste_unites[matrice_unites[destination_y][destination_x][1]].constructor.name=="UniteMine"){ //si la cible est une mine
          targetMine=true; //on retient que la cible est une mine
        }
        selectedUnits.forEach(selectedUnit => {
          selectedUnit.target=liste_unites[matrice_unites[destination_y][destination_x][1]];
          selectedUnit.isOrderedToTarget=true; //on ordonne à l'unité de prendre la cible du joueur
          if(selectedUnit.canCollectGold){ //si l'unité peut récolter de l'or
            selectedUnit.isOrderedToCollectGold=targetMine; //on ordonne à l'unité de récolter de l'or
          }
        });
      }
    }
    if(matrice_cases[destination_y][destination_x]==1){
      let x = destination_x*square_size;
      let y = destination_y*square_size;
    }
  }

  function dijkstra(matrix, startX, startY, endX, endY, unit, unit_matrix) {
    let tmpstart = startX;
    startX = startY;
    startY = tmpstart;
    let tmpend = endX;
    endX = endY;
    endY = tmpend;
    let targetedUnit = false;
    let maxIterations = 8000; //protection contre un nombre trop grand d'itérations
    let iterations = 0; //compteur d'itérations
    if(unit_matrix[endX][endY] && typeof(unit_matrix[endX][endY])=="object"){
      targetedUnit = unit_matrix[endX][endY];
    }
    // Définir les nœuds de départ et d'arrivée
    var startNode = {x: startX, y: startY, cost: 0};
    var endNode = {x: endX, y: endY};
  
    // Initialiser la liste des nœuds visités et non visités
    var visitedNodes = [];
    var unvisitedNodes = [{x: startX, y: startY, cost: 0}];
  
    // Tant qu'il y a des nœuds non visités
    while (unvisitedNodes.length > 0) {
      iterations++;
      if(iterations>=maxIterations){ //si le programme tourne pendant trop longtemps on l'arrête
        return [];
      }
      // Trouver le nœud avec le coût le plus faible
      var currentNode = unvisitedNodes.reduce((min, node) => (node.cost < min.cost ? node : min));
  
      // S'il s'agit du nœud d'arrivée, retourner le chemin
      if (currentNode.x === endX && currentNode.y === endY) {
        var path = [endNode];
        var parent = currentNode.parent;
        while (parent) {
          path.push(parent);
          parent = parent.parent;
        }
        path.reverse();
        return path;
      }
  
      // Supprimer le nœud de la liste des non visités et l'ajouter à la liste des visités
      unvisitedNodes = unvisitedNodes.filter(node => !(node.x === currentNode.x && node.y === currentNode.y));
      visitedNodes.push(currentNode);
  
      // Vérifier les nœuds voisins
      var neighbors = getNeighbors(matrix, currentNode.x, currentNode.y, unit, unit_matrix,targetedUnit);
      neighbors.forEach(neighbor => {
        // Vérifier si le nœud voisin a déjà été visité
        if (visitedNodes.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
          return;
        }
  
        // Vérifier si le nœud voisin contient une valeur de 1 ou 2 dans la matrice
        if (matrix[neighbor.x] && matrix[neighbor.x][neighbor.y] && matrix[neighbor.x][neighbor.y] !== 1 && matrix[neighbor.x][neighbor.y] !== 2) {
          return;
        }
  
        // Calculer le coût pour atteindre le nœud voisin
        var cost = currentNode.cost + 1;
  
        // Vérifier si le nœud voisin est déjà dans la liste des non visités
        var existingNode = unvisitedNodes.find(node => node.x === neighbor.x && node.y === neighbor.y);
        if (existingNode) {
          // Si le nouveau coût est inférieur, mettre à jour le coût et le parent du nœud
          if (cost < existingNode.cost) {
            existingNode.cost = cost;
            existingNode.parent = currentNode;
          }
        } else {
          // Ajouter le nœud à la liste des non visités avec le coût et le parent
          unvisitedNodes.push({x: neighbor.x, y: neighbor.y, cost: cost, parent: currentNode});
        }
      });
    }
  
    // Si aucun chemin n'a été trouvé, retourner null
    return null;
  }
  
  
  function dijkstra2(matrix, startX, startY, endX, endY, unit, unit_matrix,isDestination = false,keepDestinations = false){
    if(startX==endX && startY==endY){
      return [];
    }
    let dx = endX - startX;
    let dy = endY - startY;
    let partSize = 10;
    let nbDijkstra = Math.max(Math.abs(dx/partSize),Math.abs(dy/partSize),1); //en combien de fois on fait le chemin
    let nbDijkstraX = Math.round(dx/nbDijkstra);
    let nbDijkstraY = Math.round(dy/nbDijkstra);
    let path = [];
    let endX2;
    let endY2;
    let nbDijkstra2 = Math.ceil(nbDijkstra);
    if(isDestination==false){
      if(keepDestinations==false){
        unit.destinations=[];
      }
      for(let i = 1; i<=nbDijkstra2; i++){
        if(i>=nbDijkstra2){
          endX2 = endX;
          endY2 = endY;
        }
        else{
          endX2 = startX+i*nbDijkstraX;
          endY2 = startY+i*nbDijkstraY;
        }
        //détection du point le plus proche si le point d'arrivée n'est pas accessible
        if(checkHitbox(matrix,endY2,endX2,unit,unit_matrix,false,false)!=1){ //si le point d'arrivée est bloqué
          //on recherche un point disponible proche
          let j = 1;
          let x;
          let y;
          let emptyCell = false;
          while(emptyCell == false && i<partSize*20){
            y = endY2 - j;
            while(emptyCell==false && y<=endY2+j){ //on parcourt les côtés sans parcourir les coins
              x = endX2 - j;
              if(y==endY2-j||y==endY2+j){
                x++;
              }
              while(emptyCell==false && x<=endX2+j){
                if(checkHitbox(matrix,y,x,unit,unit_matrix,false,false)==1){
                  emptyCell = true; //si la case parcourue est vide
                }
                else{
                  x++;
                  if(y>endY2-j && y<endY2+j){
                    if(x>endX2-j && x<endX2+j){ //on ne parcourt pas les cases déjà parcourues
                      x=endX2+j;
                    }
                  }
                  else if(x==endX-j || x==endX+j){
                    x++; //on ne compte pas les coins
                  }
                }
              }
              y++;
            }
            if(emptyCell){
              dijkstra2(matrix,endX2,endY2,x,y-1,unit,unit_matrix,isDestination,true);
              endX2 = x;
              endY2 = y-1;
            }
            else{
              y=endY2-j;
              while(emptyCell==false && y<=endY2+j){ //on parcourt les coins
                x=endX2-j;
                while(emptyCell==false && x<=endX2+j){
                  if(checkHitbox(matrix,y,x,unit,unit_matrix,false,false)==1){
                    emptyCell = true; //si la case parcourue est vide
                  }
                  else{
                    x+=2*j;
                  }
                }
                y+=2*j;
              }
              if(emptyCell){
                dijkstra2(matrix,endX2,endY2,x,y-2*j,unit,unit_matrix,isDestination,true);
                endX2 = x;
                endY2 = y-2*j;
              }
              j++;
            }
          }
        }
          else{
          unit.destinations.push([endX2,endY2,unit.isOrderedToMove]); //on ajoute la destination pour qu'elle soit calculée plus tard au moment où l'unité en aura besoin et on précise si c'est un ordre du jouer ou non
        }
      }
      if(keepDestinations==false && unit.destinations[0]){ //s'il y a une destination, on la calcule puis on la supprime
        path = dijkstra(matrix, startX, startY, unit.destinations[0][0], unit.destinations[0][1], unit, unit_matrix);
        unit.destinations.shift();
      }
    }
    else{
      path = dijkstra(matrix, startX, startY, endX, endY, unit, unit_matrix);
    }
    return path;
  }
  
  
  function checkHitbox(matrix, x, y, unit, unit_matrix,countMovingUnits = false, targetedUnit = false, countUnits = false){ //renvoie 1 s'il n'y a pas d'obstacle, sinon -1 ou -2 si on compte les unités en déplacement
    for(let xi = Math.floor(x-unit.hitbox.radius); xi<=x+unit.hitbox.radius; xi++){ // on parcourt les cases de la hitbox autour de l'unité
      for(let yi = Math.floor(y-unit.hitbox.radius); yi<=y+unit.hitbox.radius; yi++){
        if(unit.hitbox.type=="square" || (unit.hitbox.type=="circle" && distance(x,y,xi,yi)<=unit.hitbox.radius)){
          if(matrix[xi]==undefined || matrix[xi][yi]==undefined || matrix[xi][yi] === -1 || unit_matrix[xi][yi] === 1 || (typeof(unit_matrix[xi][yi])=="object" && (targetedUnit==false || unit_matrix[xi][yi]==0 || unit_matrix[xi][yi][0]!=targetedUnit[0] || unit_matrix[xi][yi][1]!=targetedUnit[1]) && (unit_matrix[xi][yi] !== 0 && (unit_matrix[xi][yi][0] !== 1 || (unit_matrix[xi][yi][1] !== unit.index() && (!liste_unites[unit_matrix[xi][yi][1]] || liste_unites[unit_matrix[xi][yi][1]].isMoving===false || countMovingUnits===true)))))){ // si la case n'est pas naviguable
          //if(matrix[xi]==undefined || matrix[xi][yi]==undefined || matrix[xi][yi] === 0 || (unit_matrix[xi][yi] !== null && unit_matrix[xi][yi][0] !== 1) || (countUnits && unit_matrix[xi][yi] !== null && (targetedUnit==false || (unit_matrix[xi][yi][0]!=targetedUnit[0] || unit_matrix[xi][yi][1]!=targetedUnit[1])) && (liste_unites[unit_matrix[xi][yi][1]].isMoving===false || countMovingUnits===true))){ // si la case n'est pas naviguable
            if(countMovingUnits===true && matrix[xi] && matrix[xi][yi] && matrix[xi][yi] !== -1 && unit_matrix[xi][yi] !== 0 && unit_matrix[xi][yi][0] === 1 && unit_matrix[xi][yi][1] !== unit.index() && liste_unites[unit_matrix[xi][yi][1]] && liste_unites[unit_matrix[xi][yi][1]].isMoving===true){ // si on compte les unités en mouvement on renvoie -2
              return -2;
            }
            return -1;
          }
        }
      }
    }
    return 1;
  }
  
  function getNeighbors(matrix, x, y, unit, unit_matrix, targetedUnit) {
    var neighbors = [];
    let west = false;
    let east = false;
    let north = false;
    let south = false;
    if (checkHitbox(matrix,x-1,y,unit, unit_matrix,false,targetedUnit)===1) {
      west = true;
      neighbors.push({x: x-1, y: y});
    }
    if (checkHitbox(matrix,x+1,y,unit, unit_matrix,false,targetedUnit)===1) {
      east = true;
      neighbors.push({x: x+1, y: y});
    }
    if (checkHitbox(matrix,x,y-1,unit, unit_matrix,false,targetedUnit)===1) {
      north = true;
      neighbors.push({x: x, y: y-1});
    }
    if (checkHitbox(matrix,x,y+1,unit, unit_matrix,false,targetedUnit)===1) {
      south = true;
      neighbors.push({x: x, y: y+1});
    }
    
    if (checkHitbox(matrix,x-1,y-1,unit, unit_matrix,false,targetedUnit)===1) {
      if (west || north) {
        neighbors.push({x: x-1, y: y-1});
      }
    }
    if (checkHitbox(matrix,x+1,y-1,unit, unit_matrix,false,targetedUnit)===1) {
      if (east || north) {
        neighbors.push({x: x+1, y: y-1});
      }
    }
    if (checkHitbox(matrix,x-1,y+1,unit, unit_matrix,false,targetedUnit)===1) {
      if (west || south) {
        neighbors.push({x: x-1, y: y+1});
      }
    }
    if (checkHitbox(matrix,x+1,y+1,unit, unit_matrix,false,targetedUnit)===1) {
      if (east || south) {
        neighbors.push({x: x+1, y: y+1});
      }
    }
    return neighbors;
  }
  
  function movementAnimationUnit(unit,destination_x,destination_y,movement_duration){
    unit.imageDiv.style.animation = 'move.imageDiv 1s forwards';
    unit.imageDiv.animate([
        { transform: 'translate('+(unit.x*unit.square_size-unit.square_size*(unit.hitbox["radius"]))+'px,'+(unit.y*unit.square_size-unit.square_size*(unit.hitbox["radius"]))+'px)' },
        { transform: 'translate('+(destination_x*unit.square_size-unit.square_size*(unit.hitbox["radius"]))+'px,'+(destination_y*unit.square_size-unit.square_size*(unit.hitbox["radius"]))+'px)' }
      ], {
        duration: movement_duration,
        fill: "forwards"
      })
    unit.imageDiv.style.animation = 'none';
  }
  
  function moveUnit(unit,destination_x,destination_y,movement_duration){
    if(checkHitbox(matrice_cases,destination_y,destination_x,unit,matrice_unites,true,true,true)===1){
      unit.unsetMatriceUnites();
      unit.isMoving = true;
      movementAnimationUnit(unit,destination_x,destination_y,movement_duration);
      const xD = destination_x - unit.x;
      const yD = unit.y - destination_y;

      let tmp = unit.imagesrc.split(".");
      let name = tmp[1];
      name = name.slice(0, -1);
      const extension = tmp[2];
      

      if (xD === 0 && yD === 1) {
        unit.imagesrc = `.${name}1.${extension}`;
        console.log("up");
      } else if (xD === 1 && yD === 1) {
        unit.imagesrc = `.${name}2.${extension}`;
        console.log("upright");
        //unit.changeImage("./img/hdv.png");
      } else if (xD === 1 && yD === 0) {
        unit.imagesrc = `.${name}3.${extension}`;
        console.log("right");
      } else if (xD === 1 && yD === -1) {
        unit.imagesrc = `.${name}4.${extension}`;
        console.log("downright");
      } else if (xD === 0 && yD === -1) {
        unit.imagesrc = `.${name}5.${extension}`;
        console.log("down");
      } else if (xD === -1 && yD === -1) {
        unit.imagesrc = `.${name}6.${extension}`;
        console.log("downleft");
      } else if (xD === -1 && yD === 0) {
        unit.imagesrc = `.${name}7.${extension}`;
        console.log("left");
      } else if (xD === -1 && yD === 1) {
        unit.imagesrc = `.${name}8.${extension}`;
        console.log("upleft");
      }
      console.log(unit.imagesrc);


      unit.x=destination_x;
      unit.y=destination_y;
      unit.setMatriceUnites();
      if(unit.isOrderedToMove){
        unit.aggroCenter = [unit.x,unit.y];
      }
      return 1;
    }
    else if(checkHitbox(matrice_cases,destination_y,destination_x,unit,matrice_unites,true,true,true)===-2){
      unit.isMoving = false;
      unit.pathindex -= 1;
      return -2;
  
    }
    else{
      unit.isMoving=false;
      goTo(unit,unit.path[unit.path.length - 1]["y"],unit.path[unit.path.length - 1]["x"],unit.isOrderedToMove);
      return -1;
    }
  }
  
  
  
  function goTo(unit,x,y, isOrderedToMove = true, isDestination = false){
    if(unit.calculatingDijkstra==false){
      unit.calculatingDijkstra=true;
      let path = dijkstra2(matrice_cases,unit.x,unit.y,x,y,unit,matrice_unites,isDestination,false);
      unit.calculatingDijkstra=false;
      if(path){
        unit.path = path;
        unit.isOrderedToMove = isOrderedToMove;
        if(unit.isOrderedToMove && !unit.isOrderedToTarget){
          unit.target=false;
        }
      }
      else{
        unit.path=[];
      }
    }
  }
  
  function unitLoop(unit){
    if(unit.speed>0){
      moveLoop(unit);
    }
    if(unit.damage>0 || unit.speed>0){
      targetLoop(unit);
    }
    if(unit.damage>0){
      attackLoop(unit);
    }
  }
  
  function moveLoop(unit){
    let moveUnitResult;
    let path = unit.path;
    let lastMove = 0;
    let moveInterval = setInterval(function(){
      if (!paused) {
      if(!unit.health){
        clearInterval(moveInterval);
      }
      else{
        unit.setMatriceUnites();
        if(unit.path.length==0 && unit.isMoving==false && unit.destinations.length>=1){ // si l'unité ne bouge plus et qu'elle a une destination à atteindre on calcule le chemin jusqu'à celle-ci
          goTo(unit,unit.destinations[0][0],unit.destinations[0][1],unit.destinations[2],true);
          unit.destinations.shift();
        }
        if(path!=unit.path){
          unit.pathindex=1;
          path = unit.path;
        }
        if(Date.now()-lastMove>=unit.speedDelay()){ // Délai de déplacement en fonction de la vitesse
          lastMove = Date.now();
          if (unit.path && unit.path.length>0){
            // unit.isMoving = true;
            if(unit.path[unit.pathindex]){
              moveUnitResult = moveUnit(unit,unit.path[unit.pathindex]["y"],unit.path[unit.pathindex]["x"],unit.speedDelay());
            }
            if(moveUnitResult!=-1){
              unit.pathindex++;
              if(unit.pathindex>=unit.path.length){
                unit.path=[];
                unit.isMoving = false;
                if(!unit.isOrderedToTarget){
                  unit.isOrderedToMove=false;
                }
                // unit.isOrderedToTarget=false;
              }
            }
            else{
              unit.pathindex=1;
              path = unit.path;
            }
          }
          else{
            unit.isMoving = false;
            unit.isOrderedToMove=false;
            // unit.isOrderedToTarget=false;
          }
        }
        
        if(!unit.isOrderedToMove && !unit.isOrderedToTarget && unit.target){ //si l'unité n'a pas reçu d'ordre de déplacement et qu'elle a une cible
          if(!unit.target || !unit.target.health || distance(unit.target.x,unit.target.y,unit.aggroCenter[0],unit.aggroCenter[1])>unit.aggroRange){ //si l'unité ciblée sort de son cercle d'aggro initial
            // console.log("back")
            unit.target=false; //l'unité perd sa cible
            goTo(unit,unit.aggroCenter[0],unit.aggroCenter[1],false); //l'unité retourne à son centre d'aggro
          }
          else if(!unit.isOrderedToTarget && distance(unit.x,unit.y,unit.target.x,unit.target.y)<unit.attackRange){ //si la cible de l'unité est dans sa portée d'attaque
            //console.log("stop",distance(unit.x,unit.y,unit.target.x,unit.target.y),unit.attackRange)
            unit.path=[]; //l'unité arrête de se déplacer
          }
        }
        if(unit.canCollectMana){
          unit.collectMana();
        }
        if(unit.canCollectGold){
          unit.collectGold();
          unit.backToTownHall();
        }
      }
    }
    },10);
  }
  
  function findTargetInAggroRange(unit){ // renvoie l'unité la plus proche de l'unité spécifiée ou False s'il n'y en a pas
    // if(distance(unit.x,unit.y,unit.aggroCenter[0],unit.aggroCenter[1])>unit.aggroRange){
    //   console.log("loin")
    //   return false
    // }
    if(unit.collectingMana){ //si l'unité collecte du mana alors elle n'attaque pas d'elle même
      return false;
    }
    let xmin = Math.max(0,unit.x-unit.aggroRange);
    let xmax = Math.min(gridSquareWidth-1,unit.x+unit.aggroRange);
    let ymin = Math.max(0,unit.y-unit.aggroRange);
    let ymax = Math.min(gridSquareHeight-1,unit.y+unit.aggroRange);
    let dist;
    let minDistance = unit.aggroRange*2;
    let closestUnit = false;
    for(let xi = xmin; xi<=xmax; xi++){ // on parcourt les cases dans le carré de côté aggroRange centré sur l'unité
      for(let yi = ymin; yi<=ymax; yi++){
        //s'il y a une unité sur la case parcourue et qu'il ne s'agit pas de l'unité spécifiée et qu'elles sont de factions opposées
        if(matrice_unites[yi][xi] && matrice_unites[yi][xi][0]==1 && matrice_unites[yi][xi][1]!=unit.index() && liste_unites[matrice_unites[yi][xi][1]].owner!=unit.owner && liste_unites[matrice_unites[yi][xi][1]].health>0 && liste_unites[matrice_unites[yi][xi][1]].constructor.name!="UniteMine"){
          dist = distance(unit.x,unit.y,xi,yi);
          if(dist<=minDistance){ //si l'unité est dans le rayon d'aggro
            minDistance = dist;
            closestUnit = liste_unites[matrice_unites[yi][xi][1]];
          }
        }
      }
    }
    return closestUnit;
  }
  
  function attackLoop(unit){
    let lastAttack = 0;
    let canAttack = true;
    let xmin;
    let xmax;
    let ymin;
    let ymax;
    let attackInterval = setInterval(function(){
      if (!paused) {
      if(!unit.health){
        clearInterval(attackInterval);
      }
      if(canAttack){ // Délai de déplacement en fonction de la vitesse
        if(unit.isMoving==false){ // on vérifie que l'unité n'a pas reçu d'ordre de déplacement car il est prioritaire par rapport au combat
          if(unit.target && unit.target.owner!=unit.owner){
            xmin = Math.max(0,unit.x-unit.aggroRange);
            xmax = Math.min(gridSquareWidth-1,unit.x+unit.aggroRange);
            ymin = Math.max(0,unit.y-unit.aggroRange);
            ymax = Math.min(gridSquareHeight-1,unit.y+unit.aggroRange);
            for(let yi = ymin; yi<ymax; yi++){ //on parcourt le carré ayant pour côté le rayon d'attaque de l'unité
              for(let xi = xmin; xi<xmax; xi++){
                if(matrice_unites[yi][xi] && matrice_unites[yi][xi][1]==liste_unites.indexOf(unit.target)){ //si l'unité parcourue est l'unité ciblée
                  if(Math.abs(xi-unit.x)<=unit.attackRange && Math.abs(yi-unit.y)<=unit.attackRange){
                    unit.attack(unit.target);
                    canAttack = false;
                    lastAttack = Date.now();
                    xi = xmax;
                    yi = ymax;
                  }
                }
              }
            }
          }
        }
      }
      else if(Date.now()-lastAttack>=unit.attackSpeed*1000){
        canAttack = true;
      }
      }
    },10);
  }
  
  function targetLoop(unit){
    let targetX = null;
    let targetY = null;
    let targetInterval = setInterval(function(){
      if (!paused) {
      if(!unit.health){
        clearInterval(targetInterval);
      }
      if(unit.isOrderedToMove==false){ // on vérifie que l'unité n'a pas reçu d'ordre de déplacement car il est prioritaire par rapport au combat
        if(unit.target && unit.target.health){ //si l'unité a une cible et qu'elle est hors de portée d'attaque
          if((unit.isOrderedToTarget && distance(unit.x,unit.y,unit.target.x,unit.target.y)>unit.hitbox["radius"]+unit.target.hitbox["radius"]+1) || ((Math.abs(unit.x-unit.target.x)>unit.attackRange || Math.abs(unit.y-unit.target.y)>unit.attackRange) && distance(unit.x,unit.y,unit.aggroCenter[0],unit.aggroCenter[1])<=unit.aggroRange)){
            if((targetX!=unit.target.x || targetY!=unit.target.y)){ //si la cible a bougé et qu'elle est hors de portée
              targetX = unit.target.x;
              targetY = unit.target.y;
              goTo(unit,unit.target.x,unit.target.y,false);
            }
          }
          else{
            unit.path = [];
          }
        }
        else{
          targetX = null;
          targetY = null;
          unit.isOrderedToTarget=false;
          unit.target = findTargetInAggroRange(unit);
        }
      }
    }
    },10);
  }
  
  
  function drawGrid(gridWidth, gridHeight, squareSize) {
    const gridContainer = document.getElementById("grid-container");
  
    // Effacer le contenu précédent de l'élément gridContainer
    gridContainer.innerHTML = "";
  
    // Définir les propriétés CSS pour l'élément gridContainer
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, ${squareSize}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, ${squareSize}px)`;
  
    // Dessiner les carrés dans l'élément gridContainer
    for (let i = 0; i < gridWidth * gridHeight; i++) {
      const square = document.createElement("div");
      square.classList.add("grid-square");
      if(matrice_cases[Math.floor(i/gridWidth)][i%gridWidth]!=0){
          square.style.backgroundColor="green";
      }
      gridContainer.appendChild(square);
    }
  }

  function tierHdv(){
    let level = -1;
    liste_hdv.forEach(hdv => {
      if(hdv.level>level){
        level = hdv.level;
      }
    });
    return level;
  }
  
  let gridContainer,gridSquareWidth,gridSquareHeight, gridLeft, gridTop, square_size, liste_unites, selectedUnits, liste_hdv, goldCollection, manaCollection, liste_totems;

  let upgradesAtelier = [0, 0, 1, 1];

  let levelEnnemi = 0;
  let upgradesAtelierEnnemi = [0, 0, 1, 1];

  let listeHdvEnnemi = [];
  let listeTourEnnemi = [];


  function upgradeUnits(owner){ //actualise les améliorations des unités
    liste_unites.forEach(unit => {
      if(unit!=null && unit.owner==owner && unit.speed>0){
        unit.checkUpgrades();
      }
    });
  }

  function upgradeEnemy(n){ //amélioration des bâtiments ennemis, n le numéro du jour en commençant par 0
    while(levelEnnemi<n){
      levelEnnemi++;
      switch(levelEnnemi){
        case 1:
          console.log("Amélioration 1 de l'hôtel de ville ennemi");
          listeHdvEnnemi.forEach(hdv => {
            hdv.upgrade();
          });
          upgradesAtelierEnnemi = [1, 1, 1, 1];
          break;
        case 2:
          console.log("Amélioration 1 des tours ennemies");
          listeTourEnnemi.forEach(tour => {
            tour.upgrade(0);
          });
          upgradesAtelierEnnemi = [2, 1, 2, 1];
          break;
        case 3:
          console.log("Amélioration 2 des tours ennemies");
          listeTourEnnemi.forEach(tour => {
            tour.upgrade(1);
          });
          upgradesAtelierEnnemi = [2, 2, 2, 1];
          break;
        case 4:
          console.log("Amélioration 2 de l'hôtel de ville ennemi");
          listeHdvEnnemi.forEach(hdv => {
            hdv.upgrade();
          });
          upgradesAtelierEnnemi = [2, 2, 2, 2];
          break;
        case 5:
          console.log("Amélioration 3 des tours ennemies");
          listeTourEnnemi.forEach(tour => {
            tour.upgrade(2);
          });
          upgradesAtelierEnnemi = [3, 2, 3, 2];
          break;
        case 6:
          upgradesAtelierEnnemi = [3, 3, 3, 2];
          break;
        case 7:
          upgradesAtelierEnnemi = [3, 3, 3, 3];
          break;
      }
      listeHdvEnnemi[0].spawnRandEnemy();
    }
  }

  function assautsEnnemis(n){ // lance des assauts de puissance n (le numéro de la journée en commençant par 0) sur les hôtels de villes et les totems du joueur
    let i = 0;
    let duree = 0;
    if(liste_hdv[i]){
      console.log("hdv",i)
      duree = assautEnnemi(liste_hdv[i].x,liste_hdv[i].y,n);
      let townHallAssaultInterval = setInterval(function(){
        i++;
        console.log("hdv",i)
        if(liste_hdv[i]){
          assautEnnemi(liste_hdv[i].x,liste_hdv[i].y,n);
        }
        else{
          clearInterval(townHallAssaultInterval);
        }
      },duree);
    }
    setTimeout(() => {
      let listeTotemsJoueur = [];
      liste_totems.forEach(totem => {
        if(totem.owner=="player"){
          listeTotemsJoueur.push(totem);
        }
      });
      let i = 0;
      if(listeTotemsJoueur[i]){
        console.log("totem",i)
        duree = assautEnnemi(listeTotemsJoueur[i].x,listeTotemsJoueur[i].y,n);
        let totemAssaultInterval = setInterval(function(){
          i++;
          console.log("totem",i)
          if(listeTotemsJoueur[i]){
            assautEnnemi(listeTotemsJoueur[i].x,listeTotemsJoueur[i].y,n);
          }
          else{
            clearInterval(totemAssaultInterval);
          }
        },duree);
      }
    }, duree*liste_hdv.length);
  }

  function assautEnnemi(x,y,n){
    let nbEnnemis = Math.min(11,6+n); //nombre d'ennemis de l'assaut
    let spawnInterval = 1500;
    let duree = nbEnnemis*spawnInterval; //temps total de spawn des ennemis
    let unit;
    let i = 0;
    let assaultInterval = setInterval(function(){
      if(i<nbEnnemis){
        unit = listeHdvEnnemi[0].spawnRandEnemy();
        goTo(unit,x,y,false);
        i++;
      }
      else{
        clearInterval(assaultInterval);
      }
    },spawnInterval);
    return duree;
  }

  let gameStarted = false;
  
  function spawnUnit(matrix, liste_unitesParam,gridContainerParam,square_sizeParam,gridLeftParam,gridTopParam,goldMine,liste_hdvParam,liste_totemsParam,gridSquareWidthParam,gridSquareHeightParam,selectedUnitsParam, goldCollectionParam, manaCollectionParam) {
    gridContainer = gridContainerParam;
    liste_unites = liste_unitesParam;
    liste_hdv = liste_hdvParam;
    liste_totems = liste_totemsParam;
    gridSquareWidth = gridSquareWidthParam;
    gridSquareHeight = gridSquareHeightParam;
    gridLeft = gridLeftParam;
    gridTop = gridTopParam;
    square_size = square_sizeParam;
    selectedUnits = selectedUnitsParam;
    goldCollection = goldCollectionParam;
    manaCollection = manaCollectionParam;
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[0].length; x++) {
            if([100,101,200,201,210,211,220,221,300,301,302,303,400,401,500].includes(matrix[y][x])) {
  
                switch(matrix[y][x]) {
                    case 100: // mine
                        if(matrix[y+1][x] != 100 && matrix[y][x+1] != 100) { // si on est dans le coin en bas à droite
                            new UniteMine(x-1,y-1,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv,goldMine);
                        }
                        break;
                    case 101: // totem
                        if(matrix[y+1][x] != 101 && matrix[y][x+1] != 101) { // si on est dans le coin en bas à droite
                          new UniteTotem(x-1,y-1,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv,liste_totems);
                        }
                        break;
                    case 200: // ennemie0 cac
                        new UniteEnnemi0(x,y,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        break;
                    case 201: // ennemie1 cac
                        new UniteEnnemi1(x,y,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        break;
                    case 210: // ennemie10 distance
                        new UniteEnnemi10(x,y,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        break;
                    case 211: // ennemie11 distance
                        new UniteEnnemi11(x,y,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        break;
                    case 220: // ennemie20 tank
                        new UniteEnnemi20(x,y,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        break;
                    case 221: // ennemie21 tank
                        new UniteEnnemi21(x,y,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        break;
                    case 300: // tower
                        if(matrix[y+1][x] != 300 && matrix[y][x+1] != 300) { // si on est dans le coin en bas à droite
                          listeTourEnnemi.push(new UniteTourEnnemie(x-1,y-1,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv));
                        }
                        break;
                    case 301: // ennemieBase
                        if(matrix[y+1][x] != 301 && matrix[y][x+1] != 301) { // si on est dans le coin en bas à droite
                          listeHdvEnnemi.push(new UniteBaseEnnemie(x-1,y-1,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv));
                        }
                        break;
                    case 302: // ennemieBarrak
                        if(matrix[y+1][x] != 302 && matrix[y][x+1] != 302) { // si on est dans le coin en bas à droite
                          new UniteCaserneEnnemie(x-1,y-1,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        }
                        break;
                    case 303: // ennemieUpgrade
                        if(matrix[y+1][x] != 303 && matrix[y][x+1] != 303) { // si on est dans le coin en bas à droite
                          new UniteAtelierEnnemi(x-1,y-1,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        }
                        break;
                    case 400: // peasant
                        new UniteOuvrier(x,y,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        break;
                    case 401: // soldier
                        new UniteSoldat(x,y,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        break;
                    case 500: // playerBase
                        if(matrix[y+1][x] != 500 && matrix[y][x+1] != 500) { // si on est dans le coin en bas à droite
                          new UniteHotelDeVille(x-1,y-1,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
                        }
                        break;
                }
                
            }
        }
    }
    gameStarted = true;
  }
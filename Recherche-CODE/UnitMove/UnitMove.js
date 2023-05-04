/*const matrice_cases = [ 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1]
]

const matrice_unites = [ //le premier élément indique le type d'entité dont il s'agit (1 pour une unité), le deuxième correspond à la position de l'entité dans sa liste
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]
]*/

let matrice_cases = [[]];
let n = 10;
for(let i = 0;i<n;i++){
  matrice_cases[0].push(1);
}
for(let i = 0;i<n;i++){
  matrice_cases.push(matrice_cases[0].slice());
}

let matrice_unites = [[]];
for(let i = 0;i<n;i++){
  matrice_unites[0].push(null);
}
for(let i = 0;i<n;i++){
  matrice_unites.push(matrice_unites[0].slice());
}

const liste_unites = [];


const gridContainer = document.getElementById("grid-container");
const gridStyle = window.getComputedStyle(gridContainer);
const gridWidth = parseInt(gridStyle.width);
const gridHeight = parseInt(gridStyle.height);
const square_size = 15;
const gridLeft = parseInt(gridStyle.left);
const gridTop = parseInt(gridStyle.top);
let gridSquareWidth = matrice_cases[0].length;
let gridSquareHeight = matrice_cases.length;
let selectedUnits = [];


document.body.style.userSelect = `none`; // empêche la selection des éléments

function distance(x1, y1, x2, y2) { //distance entre 2 points (x1,y1) et (x2,y2)
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

class Unite{

    setMatriceUnites(){
      for(let xi = Math.floor(this.x-this.hitbox.radius); xi<=this.x+this.hitbox.radius; xi++){
        for(let yi = Math.floor(this.y-this.hitbox.radius); yi<=this.y+this.hitbox.radius; yi++){
          if(this.hitbox.type=="square"){
            matrice_unites[yi][xi] = [1, this.index()];
          }
          else if(this.hitbox.type=="circle" && distance(this.x,this.y,xi,yi)<=this.hitbox.radius){
            matrice_unites[yi][xi] = [1, this.index()];
          }
        }
      }
    }

    unsetMatriceUnites(){
      for(let xi = Math.floor(this.x-this.hitbox.radius); xi<=this.x+this.hitbox.radius; xi++){
        for(let yi = Math.floor(this.y-this.hitbox.radius); yi<=this.y+this.hitbox.radius; yi++){
          if(this.hitbox.type=="square"){
            matrice_unites[yi][xi] = null;
          }
          else if(this.hitbox.type=="circle" && distance(this.x,this.y,xi,yi)<=this.hitbox.radius){
            matrice_unites[yi][xi] = null;
          }
        }
      }
    }

    constructor (x = null,y = null,hitbox = {"radius":0, "type":"square"}, imagesrc = "", speed = 250, health=100, attackType = "melee", damage=1, attackSpeed=1, aggroRange=5, attackRange=1,owner="enemy"){
        //coordonnées x et y
        //hitbox avec radius le rayon (nombre entier ou non) et type (square ou circle pour la forme de la hitbox)
        //imagesrc le fichier de l'image
        //speed la vitesse de déplacement
        this.x = x;
        this.y = y;

        this.owner = owner;
        this.hitbox = hitbox;
        this.health = health;
        this.attackType = attackType;
        this.damage = damage;
        this.attackSpeed = attackSpeed;
        this.aggroRange=aggroRange;
        this.attackRange=attackRange;
        this.speed=100000/speed;

        this.path = {};
        this.pathindex = 0;
        this.isMoving = false;
        this.isOrderedToMove = false;
        this.target=false;
        liste_unites.push(this);
        this.setMatriceUnites();

        this.imagesrc = imagesrc;
        this.image = document.createElement("img");
        this.image.addEventListener('mousedown', (event) => { // on désactive le déplacement de l'image par clic gauche
          if (event.button === 0) {
            event.preventDefault();
          }
        });
        this.image.setAttribute('src', this.imagesrc);
        document.body.appendChild(this.image);
        this.imgStyle = window.getComputedStyle(this.image);
        this.imgWidth = parseInt(this.imgStyle.width);
        this.imgHeight = parseInt(this.imgStyle.height);
        this.image_position_correction_x = -0.5*this.imgWidth+0.5*square_size;
        this.image_position_correction_y = -0.5*this.imgHeight+0.5*square_size;
        this.image.style.left = `${gridLeft}px`;
        this.image.style.top = `${gridTop}px`; 
        this.image.style.animation = 'move-image 1s forwards';
        this.image.animate([
            { transform: 'translate(0,0)' },
            { transform: 'translate('+(this.x*square_size+this.image_position_correction_x)+'px,'+(this.y*square_size+this.image_position_correction_y)+'px)' }
          ], {
            duration: 0,
            fill: "forwards"
          })
        this.image.style.animation = 'none';

        unitLoop(this);
    }

    index(){
      return liste_unites.indexOf(this);
    }

    deleteUnit(){
      this.unsetMatriceUnites();
      liste_unites.splice(this.index(), 1); //supprime l'unité de la liste des unités
      this.image.remove();

      delete this.x;
      delete this.y;
      delete this.hitbox;
      delete this.health;
      delete this.attackType;
      delete this.damage;
      delete this.attackSpeed;
      delete this.aggroRange;
      delete this.attackRange;
      delete this.speed;
      delete this.path;
      delete this.pathindex;
      delete this.isMoving;
      delete this.isOrderedToMove;
      delete this.target;
      delete this.imagesrc;
      delete this.image;
      delete this.imgStyle;
      delete this.imgWidth;
      delete this.imgHeight;
      delete this.image_position_correction_x;
      delete this.image_position_correction_y;

      delete this;
    }

    takeDamage(unit){
      console.log("attack ",this,this.health,"-",unit.damage,"=",Math.max(0,this.health-unit.damage));
      this.health=Math.max(0,this.health-unit.damage);
      if(this.health==0){
        this.deleteUnit();
      }
    }
}
//const image = liste_unites[liste_objet_id[1]].image;


// Variables pour stocker la position de l'image et le mode de déplacement
let posImageX, posImageY, isMoving = false;

// Fonction qui affiche les coordonnées de la case cliquée
function getCoords(x = event.clientX, y = event.clientY) {
  return [Math.floor((x-gridLeft)/square_size), Math.floor((y-gridTop)/square_size)];
}
// Fonction qui sera exécutée lorsque l'utilisateur clique n'importe où sur la page
function onPageClick(event) {
  event.preventDefault();
  let destination_x = getCoords()[0];
  let destination_y = getCoords()[1];
  if(selectedUnits.length>=1){
    selectedUnits.forEach(selectedUnit => {
      goTo(selectedUnit,destination_x,destination_y);
    });
  }
  if(matrice_cases[destination_y][destination_x]==1){
    let x = destination_x*square_size;
    let y = destination_y*square_size;
  }
}

// Ajout d'un écouteur d'événement pour détecter le clic n'importe où sur la page
document.addEventListener('contextmenu', onPageClick);


// Créer un élément HTML pour représenter la sélection
const selection = document.createElement("div");
selection.style.position = "absolute";
selection.style.border = "2px dashed #000";
selection.style.borderColor = "lime";
document.body.appendChild(selection);
selection.style.display = "none";

// Variables pour stocker les positions de début et de fin de la sélection
let selStartX, selStartY, selEndX, selEndY;

// événement "mousedown" pour commencer la sélection
document.addEventListener("mousedown", function(event) {
  // Vérifier si le clic gauche est enfoncé
  if (event.button === 0) {
    selStartX = event.clientX;
    selStartY = event.clientY;
    if(selStartX<gridLeft){
      selStartX = gridLeft;
    }
    if(selStartY<gridTop){
      selStartY = gridTop;
    }
    if(selStartX>gridSquareWidth*square_size+gridLeft-4){
      selStartX = gridSquareWidth*square_size+gridLeft-4;
    }
    if(selStartY>gridSquareHeight*square_size+gridTop-4){
      selStartY = gridSquareHeight*square_size+gridTop-4;
    }
    selEndX = selStartX;
    selEndY = selStartY;

    // Positionner l'élément de sélection et afficher la sélection
    selection.style.left = selStartX + "px";
    selection.style.top = selStartY + "px";
    selection.style.width = "0px";
    selection.style.height = "0px";
  }
});

// événement "mousemove" pour suivre la position de la souris et mettre à jour la sélection
document.addEventListener("mousemove", function(event) {
  // on vérifie si le bouton gauche est enfoncé pour continuer la sélection
  if (event.buttons === 1) {
    selection.style.display = "block";
    selEndX = event.clientX;
    selEndY = event.clientY;
    if(selEndX<gridLeft){
      selEndX = gridLeft;
    }
    if(selEndY<gridTop){
      selEndY = gridTop;
    }
    if(selEndX>gridSquareWidth*square_size+gridLeft-4){
      selEndX = gridSquareWidth*square_size+gridLeft-4;
    }
    if(selEndY> gridSquareHeight*square_size+gridTop-4){
      selEndY = gridSquareHeight*square_size+gridTop-4;
    }
    
    // Mettre à jour la taille de la sélection
    const width = selEndX - selStartX;
    const height = selEndY - selStartY;
    selection.style.width = Math.abs(width) + "px";
    selection.style.height = Math.abs(height) + "px";
    selection.style.left = (width < 0 ? selEndX : selStartX) + "px";
    selection.style.top = (height < 0 ? selEndY : selStartY) + "px";
  }
});

// événement "mouseup" pour terminer la sélection
document.addEventListener("mouseup", function(event) {
  // Vérifier si le bouton gauche a été relâché
  if (event.button === 0) {
    // Cacher la sélection
    selection.style.display = "none";
    let selStartCoords = getCoords(selStartX, selStartY);
    let selEndCoords = getCoords(selEndX, selEndY);
    selectedUnits=[];
    let xiStart = Math.min(selStartCoords[0],selEndCoords[0]);
    let xiEnd = Math.max(selStartCoords[0],selEndCoords[0]);
    let yiStart = Math.min(selStartCoords[1],selEndCoords[1]);
    let yiEnd = Math.max(selStartCoords[1],selEndCoords[1]);
    for(let x = xiStart; x<=xiEnd; x++){
      for(let y = yiStart; y<=yiEnd; y++){
        if(matrice_unites[y][x] && matrice_unites[y][x][0] == 1 && liste_unites[matrice_unites[y][x][1]].owner=="player" && !selectedUnits.includes(liste_unites[matrice_unites[y][x][1]])){ //s'il y a une unité sur la case parcourue et qu'elle n'est pas déjà sélectionnée
          selectedUnits.push(liste_unites[matrice_unites[y][x][1]]);
        }
      }
    }
  }
});





function dijkstra(matrix, startX, startY, endX, endY, unit, unit_matrix) {
  let tmpstart = startX;
  startX = startY;
  startY = tmpstart;
  let tmpend = endX;
  endX = endY;
  endY = tmpend;
  let targetedUnit = false;
  if(unit_matrix[endX][endY]){
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
      let i = 0;
      while (i < path.length){
        if(path[i-1] && path[i]["x"]!=path[i-1]["x"] && path[i]["y"]!=path[i-1]["y"]){
          //if(matrix[path[i-1]["x"]][path[i]["y"]]){
          if (checkHitbox(matrix,path[i-1]["x"],path[i]["y"],unit,unit_matrix,false,targetedUnit)===1) {
            path.splice(i,0,{x:path[i-1]["x"], y:path[i]["y"], cost:999, parent:path[i-1]});
          }
          else{
            path.splice(i,0,{x:path[i]["x"], y:path[i-1]["y"], cost:999, parent:path[i-1]});
          }
        }
        i++;
      }
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

function checkHitbox(matrix, x, y, unit, unit_matrix,countMovingUnits = false, targetedUnit = false){ //renvoie 1 s'il n'y a pas d'obstacle, sinon -1 ou -2 si on compte les unités en déplacement
  for(let xi = Math.floor(x-unit.hitbox.radius); xi<=x+unit.hitbox.radius; xi++){ // on parcourt les cases de la hitbox autour de l'unité
    for(let yi = Math.floor(y-unit.hitbox.radius); yi<=y+unit.hitbox.radius; yi++){
      if(unit.hitbox.type=="square"){
        if(matrix[xi]==undefined || matrix[xi][yi]==undefined || matrix[xi][yi] === 0 || ((targetedUnit==false || unit_matrix[xi][yi]==null || unit_matrix[xi][yi][0]!=targetedUnit[0] || unit_matrix[xi][yi][1]!=targetedUnit[1]) && (unit_matrix[xi][yi] !== null && (unit_matrix[xi][yi][0] !== 1 || (unit_matrix[xi][yi][1] !== unit.index() && (!liste_unites[unit_matrix[xi][yi][1]] || liste_unites[unit_matrix[xi][yi][1]].isMoving===false || countMovingUnits===true)))))){ // si la case n'est pas naviguable
          if(matrix[xi] && matrix[xi][yi] && matrix[xi][yi] !== 0 && unit_matrix[xi][yi] !== null && unit_matrix[xi][yi][0] === 1 && unit_matrix[xi][yi][1] !== unit.index() && liste_unites[unit_matrix[xi][yi][1]] && liste_unites[unit_matrix[xi][yi][1]].isMoving===true && countMovingUnits===true){ // si on compte les unités en mouvement on renvoie -2
            return -2;
          }
          return -1;
        }
      }
      else if(unit.hitbox.type=="circle" && distance(x,y,xi,yi)<=unit.hitbox.radius){
        if(matrix[xi] && matrix[xi][yi] && matrix[xi][yi] === 0){
          if(matrix[xi]==undefined || matrix[xi][yi]==undefined || matrix[xi][yi] === 0 || ((targetedUnit==false || unit_matrix[xi][yi]!=targetedUnit) && (unit_matrix[xi][yi] !== null && (unit_matrix[xi][yi][0] !== 1 || (unit_matrix[xi][yi][1] !== unit.index() && (liste_unites[unit_matrix[xi][yi][1]].isMoving===false || countMovingUnits===true)))))){ // si la case n'est pas naviguable
            if(matrix[xi] && matrix[xi][yi] && matrix[xi][yi] !== 0 && unit_matrix[xi][yi] !== null && unit_matrix[xi][yi][0] === 1 && unit_matrix[xi][yi][1] !== unit.index() && liste_unites[unit_matrix[xi][yi][1]].isMoving===true && countMovingUnits===true){ // si on compte les unités en mouvement on renvoie -2
              return -2;
            }
            return -1;
          }
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
  unit.image.style.animation = 'move-image 1s forwards';
  unit.image.animate([
      { transform: 'translate('+(unit.x*square_size+unit.image_position_correction_x)+'px,'+(unit.y*square_size+unit.image_position_correction_y)+'px)' },
      { transform: 'translate('+(destination_x*square_size+unit.image_position_correction_x)+'px,'+(destination_y*square_size+unit.image_position_correction_y)+'px)' }
    ], {
      duration: movement_duration,
      fill: "forwards"
    })
  unit.image.style.animation = 'none';
}

function moveUnit(unit,destination_x,destination_y,movement_duration){
  if(checkHitbox(matrice_cases,destination_y,destination_x,unit,matrice_unites,true,true)===1){
    unit.unsetMatriceUnites();
    movementAnimationUnit(unit,destination_x,destination_y,movement_duration);
    unit.x=destination_x;
    unit.y=destination_y;
    unit.setMatriceUnites();
    return 1;
  }
  else if(checkHitbox(matrice_cases,destination_y,destination_x,unit,matrice_unites,true,true)===-2){
    unit.pathindex -= 1;
    return -2;

  }
  else{
    unit.isMoving=false;
    goTo(unit,unit.path[unit.path.length - 1]["y"],unit.path[unit.path.length - 1]["x"],unit.isOrderedToMove);
    return -1;
  }
}



function goTo(unit,x,y, isOrderedToMove = true){
  let path = dijkstra(matrice_cases,unit.x,unit.y,x,y,unit,matrice_unites);
  if(path){
    unit.path = path;
    unit.isOrderedToMove = isOrderedToMove;
    if(unit.isOrderedToMove){
      unit.target=false;
    }
  }
  else{
    unit.path={};
  }
}

function unitLoop(unit){
  moveLoop(unit);
  attackLoop(unit);
  targetLoop(unit);
}

function moveLoop(unit){
  let moveUnitResult;
  let path = unit.path;
  let moveInterval = setInterval(function(){
    if(!unit.health){
      clearInterval(moveInterval);
    }
    unit.setMatriceUnites();
    if(path!=unit.path){
      unit.pathindex=1;
      path = unit.path;
    }
    if (unit.path && unit.path.length>0){
      unit.isMoving = true;
      if(unit.path[unit.pathindex]){
        moveUnitResult = moveUnit(unit,unit.path[unit.pathindex]["y"],unit.path[unit.pathindex]["x"],unit.speed);
      }
      if(moveUnitResult!=-1){
        unit.pathindex++;
        if(unit.pathindex==unit.path.length){
          unit.path={};
          unit.isMoving = false;
          unit.isOrderedToMove=false;
        }
      }
      else{
        unit.pathindex=1;
        path = unit.path;
      }
    }
  },unit.speed);
}

function findTargetInAggroRange(unit){ // renvoie l'unité la plus proche de l'unité spécifiée ou False s'il n'y en a pas
  let xmin = Math.max(0,unit.x-unit.aggroRange);
  let xmax = Math.min(gridSquareWidth-1,unit.x+unit.aggroRange);
  let ymin = Math.max(0,unit.y-unit.aggroRange);
  let ymax = Math.min(gridSquareHeight-1,unit.y+unit.aggroRange);
  let dist;
  let minDistance = unit.aggroRange;
  let closestUnit = false;
  for(let xi = xmin; xi<=xmax; xi++){ // on parcourt les cases dans le carré de côté aggroRange centré sur l'unité
    for(let yi = ymin; yi<=ymax; yi++){
      //s'il y a une unité sur la case parcourue et qu'il ne s'agit pas de l'unité spécifiée et qu'elles sont de factions opposées
      if(matrice_unites[yi][xi] && matrice_unites[yi][xi][0]==1 && matrice_unites[yi][xi][1]!=liste_unites.indexOf(unit) && liste_unites[matrice_unites[yi][xi][1]].owner!=unit.owner){
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
  let target;
  let attackInterval = setInterval(function(){
  let xmin;
  let xmax;
  let ymin;
  let ymax;
    if(!unit.health){
      clearInterval(attackInterval);
    }
    if(unit.isOrderedToMove==false){ // on vérifie que l'unité n'a pas reçu d'ordre de déplacement car il est prioritaire par rapport au combat
      if(unit.target){
        xmin = Math.max(0,unit.x-unit.aggroRange);
        xmax = Math.min(gridSquareWidth-1,unit.x+unit.aggroRange);
        ymin = Math.max(0,unit.y-unit.aggroRange);
        ymax = Math.min(gridSquareHeight-1,unit.y+unit.aggroRange);
        for(let yi = ymin; yi<ymax; yi++){ //on parcourt le carré ayant pour côté le rayon d'attaque de l'unité
          for(let xi = xmin; xi<xmax; xi++){
            if(matrice_unites[yi][xi] && matrice_unites[yi][xi][1]==liste_unites.indexOf(unit.target)){ //si l'unité parcourue est l'unité ciblée
              if(Math.floor(distance(xi,yi,unit.x,unit.y))<=unit.attackRange){
                unit.target.takeDamage(unit);
              }
            }
          }
        }
      }
    }
  },unit.attackSpeed*1000);
}

function targetLoop(unit){
  let targetInterval = setInterval(function(){
    if(!unit.health){
      clearInterval(targetInterval);
    }
    if(unit.isOrderedToMove==false){ // on vérifie que l'unité n'a pas reçu d'ordre de déplacement car il est prioritaire par rapport au combat
      if(unit.target && unit.target.health){
        goTo(unit,unit.target.x,unit.target.y,false);
      }
      else{
        unit.target = findTargetInAggroRange(unit);
      }
    }
  },unit.speed);
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

// Appel de la fonction drawGrid avec un paramètre gridSize de 10 (par exemple)
/*const pageWidth = window.innerWidth;
const pageHeight = window.innerHeight;*/
//let gridSquareWidth = Math.floor(gridWidth/square_size);
//let gridSquareHeight = Math.floor(gridHeight/square_size);
drawGrid(gridSquareWidth, gridSquareHeight, square_size);

const xtest = 8;
const ytest = 7;

x_test = 2;
y_test = 2;
unite_test = new Unite(x_test,y_test, {"radius":1,"type":"square"}, "unit.png", 400, 150, "melee", 20, 1, 4, 2,"player");

x_testb = 3;
y_testb = 7;
unite_testb = new Unite(x_testb,y_testb, {"radius":0,"type":"square"}, "unit2.gif", 250, 80, "melee", 30, 1.5, 3, 1,"enemy");

x_testc = 6;
y_testc = 4;
unite_testc = new Unite(x_testc,y_testc, {"radius":1,"type":"square"}, "unit4.png", 400, 150, "melee", 10, 0.5, 4, 2,"enemy");
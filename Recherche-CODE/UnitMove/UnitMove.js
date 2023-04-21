const matrice_cases = [ 
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
]

const liste_unites = [];


const gridContainer = document.getElementById("grid-container");
const gridStyle = window.getComputedStyle(gridContainer);
const gridWidth = parseInt(gridStyle.width);
const gridHeight = parseInt(gridStyle.height);
const square_size = 15;
const gridLeft = parseInt(gridStyle.left);
const gridTop = parseInt(gridStyle.top);
let selectedUnits = [];

function distance(x1, y1, x2, y2) { //distance entre 2 points (x1,y1) et (x2,y2)
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

class Unite{

    setMatriceUnites(){
      for(let xi = Math.floor(this.x-this.hitbox.radius); xi<=this.x+this.hitbox.radius; xi++){
        for(let yi = Math.floor(this.y-this.hitbox.radius); yi<=this.y+this.hitbox.radius; yi++){
          if(this.hitbox.type=="square"){
            matrice_unites[yi][xi] = [1, this.index];
          }
          else if(this.hitbox.type=="circle" && distance(this.x,this.y,xi,yi)<=this.hitbox.radius){
            matrice_unites[yi][xi] = [1, this.index];
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

    constructor (x = null,y = null,hitbox = {"radius":0, "type":"square"}, imagesrc = "", speed = 250){
        //coordonnées x et y
        //hitbox avec radius le rayon (nombre entier ou non) et type (square ou circle pour la forme de la hitbox)
        //imagesrc le fichier de l'image
        //speed la vitesse de déplacement
        this.x = x;
        this.y = y;
        this.hitbox = hitbox;
        this.speed=speed;
        this.path = {};
        this.pathindex = 0;
        this.isMoving = false;
        liste_unites.push(this);
        this.index = liste_unites.indexOf(this);
        this.setMatriceUnites();
        console.log(matrice_unites);
        this.imagesrc = imagesrc;
        this.image = document.createElement("img");
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
    }
}

x_test = 2;
y_test = 3;
unite_test = new Unite(x_test,y_test, {"radius":1,"type":"square"}, "unit.png", 250);
console.log(unite_test.x, unite_test.y, unite_test.hitbox_radius);


liste_objet_id = matrice_unites[y_test][x_test];
console.log(liste_objet_id);
if (liste_objet_id[0]==1){
    console.log("liste des unités");
    console.log(liste_unites[liste_objet_id[1]]);
}




// Sélection de l'image à déplacer
const image = liste_unites[liste_objet_id[1]].image;


// Variables pour stocker la position de l'image et le mode de déplacement
let posImageX, posImageY, isMoving = false;

// Fonction qui affiche les coordonnées de la case cliquée
function getCoords() {
  console.log("grid left top",gridLeft,gridTop);
  return [Math.floor((event.clientX-gridLeft)/square_size), Math.floor((event.clientY-gridTop)/square_size)];
}
// Fonction qui sera exécutée lorsque l'utilisateur clique n'importe où sur la page
function onPageClick(event) {
  console.log("page click");
  console.log("x:",getCoords()[0],"y:",getCoords()[1]);
  let destination_x = getCoords()[0];
  let destination_y = getCoords()[1];
  if(selectedUnits.length>=1){
    console.log("goto");
    goTo(selectedUnits[0],destination_x,destination_y);
    selectedUnits=[];
  }
  else if(matrice_unites[getCoords()[1]][getCoords()[0]]){
    console.log("select");
    selectedUnits[0] = liste_unites[matrice_unites[getCoords()[1]][getCoords()[0]][1]];
  }
  console.log("log unite",selectedUnits[0]);
  if(matrice_cases[destination_y][destination_x]==1){
    let x = destination_x*square_size;
    let y = destination_y*square_size;
    console.log("x2:",x,"y2:",y);
    if (isMoving) {
      // Si le mode de déplacement est activé, on calcule la nouvelle position de l'image
      
      /*let imgStyle = window.getComputedStyle(image);
      let imgWidth = parseInt(imgStyle.width);
      let imgHeight = parseInt(imgStyle.height);
      console.log("x",x,"y",y,"w",imgWidth,"h",imgHeight);
      matrice_unites[unite_test.y][unite_test.x]=null;
      console.log(unite_test.x,destination_x,destination_x*square_size-unite_test.x*square_size);
      console.log(unite_test.y,destination_y,destination_y*square_size-unite_test.y*square_size);
      movementAnimationUnit(unite_test,destination_x,destination_y, 1000);
      unite_test.x=destination_x;
      unite_test.y=destination_y;
      matrice_unites[unite_test.y][unite_test.x]=[1,0];
      console.log(matrice_unites);*/
      isMoving = false;
    }
  }
}

// Ajout d'un écouteur d'événement pour détecter le clic n'importe où sur la page
document.addEventListener('click', onPageClick);



function dijkstra(matrix, startX, startY, endX, endY, unit, unit_matrix) {
  let tmpstart = startX;
  startX = startY;
  startY = tmpstart;
  let tmpend = endX;
  endX = endY;
  endY = tmpend;
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
          if (checkHitbox(matrix,path[i-1]["x"],path[i]["y"],unit,unit_matrix)===1) {
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
    var neighbors = getNeighbors(matrix, currentNode.x, currentNode.y, unit, unit_matrix);
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

function checkHitbox(matrix, x, y, unit, unit_matrix,countMovingUnits = false){
  for(let xi = Math.floor(x-unit.hitbox.radius); xi<=x+unit.hitbox.radius; xi++){ // on parcourt les cases de la hitbox autour de l'unité
    for(let yi = Math.floor(y-unit.hitbox.radius); yi<=y+unit.hitbox.radius; yi++){
      if(unit.hitbox.type=="square"){
      console.log("xiyi",xi,yi,x,unit.hitbox.radius,Math.floor(x-unit.hitbox.radius));
        if(matrix[xi]==undefined || matrix[xi][yi]==undefined || matrix[xi][yi] === 0 || (unit_matrix[xi][yi] !== null && (unit_matrix[xi][yi][0] !== 1 || (unit_matrix[xi][yi][1] !== unit.index && (liste_unites[unit_matrix[xi][yi][1]].isMoving===false || countMovingUnits===true))))){ // si la case n'est pas naviguable
          if(matrix[xi] && matrix[xi][yi] && matrix[xi][yi] !== 0 && unit_matrix[xi][yi] !== null && unit_matrix[xi][yi][0] === 1 && unit_matrix[xi][yi][1] !== unit.index && liste_unites[unit_matrix[xi][yi][1]].isMoving===true && countMovingUnits===true){ // si on compte les unités en mouvement on renvoie -2
            return -2;
          }
          return -1;
        }
      }
      else if(unit.hitbox.type=="circle" && distance(x,y,xi,yi)<=unit.hitbox.radius){
        if(matrix[xi] && matrix[xi][yi] && matrix[xi][yi] === 0){
          if(matrix[xi]==undefined || matrix[xi][yi]==undefined || matrix[xi][yi] === 0 || (unit_matrix[xi][yi] !== null && unit_matrix[xi][yi] !== [1, unit.index])){
            if(matrix[xi] && matrix[xi][yi] && matrix[xi][yi] !== 0 && unit_matrix[xi][yi] !== null && unit_matrix[xi][yi][0] === 1 && unit_matrix[xi][yi][1] !== unit.index && liste_unites[unit_matrix[xi][yi][1]].isMoving===true && countMovingUnits===true){ // si on compte les unités en mouvement on renvoie -2
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

function getNeighbors(matrix, x, y, unit, unit_matrix) {
  var neighbors = [];
  let west = false;
  let east = false;
  let north = false;
  let south = false;
  //if (matrix[x-1] && matrix[x-1][y] && matrix[x-1][y] !== 0) {
  if (checkHitbox(matrix,x-1,y,unit, unit_matrix)===1) {
    west = true;
    neighbors.push({x: x-1, y: y});
  }
  //if (matrix[x+1] && matrix[x+1][y] && matrix[x+1][y] !== 0) {
  if (checkHitbox(matrix,x+1,y,unit, unit_matrix)===1) {
    east = true;
    neighbors.push({x: x+1, y: y});
  }
  //if (matrix[x][y-1] && matrix[x][y-1] !== 0) {
  if (checkHitbox(matrix,x,y-1,unit, unit_matrix)===1) {
    north = true;
    neighbors.push({x: x, y: y-1});
  }
  //if (matrix[x][y+1] && matrix[x][y+1] !== 0) {
  if (checkHitbox(matrix,x,y+1,unit, unit_matrix)===1) {
    south = true;
    neighbors.push({x: x, y: y+1});
  }
  
  //if (matrix[x-1] && matrix[x-1][y-1] && matrix[x-1][y-1] !== 0) {
  if (checkHitbox(matrix,x-1,y-1,unit, unit_matrix)===1) {
    //if(matrix[x-1][y] || matrix[x][y-1]){
    if (west || north) {
      neighbors.push({x: x-1, y: y-1});
    }
  }
  //if (matrix[x+1] && matrix[x+1][y-1] && matrix[x+1][y-1] !== 0) {
  if (checkHitbox(matrix,x+1,y-1,unit, unit_matrix)===1) {
    //if(matrix[x+1][y] || matrix[x][y-1]){
    if (east || north) {
      neighbors.push({x: x+1, y: y-1});
    }
  }
  //if (matrix[x-1] && matrix[x-1][y+1] && matrix[x-1][y+1] !== 0) {
  if (checkHitbox(matrix,x-1,y+1,unit, unit_matrix)===1) {
    //if(matrix[x-1][y] || matrix[x][y+1]){
    if (west || south) {
      neighbors.push({x: x-1, y: y+1});
    }
  }
  //if (matrix[x+1] && matrix[x+1][y+1] && matrix[x+1][y+1] !== 0) {
  if (checkHitbox(matrix,x+1,y+1,unit, unit_matrix)===1) {
    //if(matrix[x+1][y] || matrix[x][y+1]){
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
  if(checkHitbox(matrice_cases,destination_y,destination_x,unit,matrice_unites,true)===1){
    unit.unsetMatriceUnites();
    movementAnimationUnit(unit,destination_x,destination_y,movement_duration);
    unit.x=destination_x;
    unit.y=destination_y;
    unit.setMatriceUnites();
    //matrice_unites[unite_test.y][unite_test.x]=[1,0];
    return 1;
  }
  else if(checkHitbox(matrice_cases,destination_y,destination_x,unit,matrice_unites,true)===-2){
    console.log("tmp stop",unit.isMoving);
    console.log(matrice_unites);
    let condition = false;

    while (!condition) {
      console.log("pretimer",unit.index);
      setTimeout(() => {}, 1000); // on attend 1 seconde avant de revérifier
      console.log("posttimer",unit.index);
      if (checkHitbox(matrice_cases,destination_y,destination_x,unit,matrice_unites,true)!==-2) {
        condition = true;
      }
    }
    moveUnit(unit,destination_x,destination_y,movement_duration);
    return -2;

  }
  else{
    unit.path={};
    unit.isMoving=false;
    console.log("stop",unit.isMoving);
    return -1;
  }
}



function goTo(unit,x,y){
  console.log("Chemin entre",unit.x,";",unit.y,"et",x,";",y);
  let path = dijkstra(matrice_cases,unit.x,unit.y,x,y,unit,matrice_unites);
  if(path){
    unit.path = path;
  }
  console.log("path",unit.path);
}

function moveLoop(unit){
  let abcd;
  let path = unit.path;
  let moveInterval = setInterval(function(){
    if(path!=unit.path){
      unit.pathindex=1;
      path = unit.path;
    }
    if (unit.path.length>0){
      unit.isMoving = true;
      console.log("premove",unit.index);
      abcd = moveUnit(unit,unit.path[unit.pathindex]["y"],unit.path[unit.pathindex]["x"],unit.speed);
      console.log("postmove",unit.index);
      console.log("abcd",abcd);
      unit.pathindex++;
      if(unit.pathindex==unit.path.length){
        unit.path={};
        unit.isMoving = false;
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
console.log(gridWidth,gridHeight,square_size);
console.log(Math.floor(gridWidth/square_size), Math.floor(gridHeight/square_size), square_size);
drawGrid(Math.floor(gridWidth/square_size), Math.floor(gridHeight/square_size), square_size);

const xtest = 8;
const ytest = 7;

moveLoop(unite_test);

//goTo(unite_test,xtest,ytest);

x_testb = 1;
y_testb = 7;
unite_testb = new Unite(x_testb,y_testb, {"radius":0,"type":"square"}, "unit2.gif", 400);

moveLoop(unite_testb);
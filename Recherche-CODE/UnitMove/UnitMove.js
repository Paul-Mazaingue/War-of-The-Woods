const matrice_cases = [ 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

const matrice_unites = [ 
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, [1,0], null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]
]

const liste_unites = [];

class Unite{

    constructor (x = null,y = null,hitbox_radius = 0){
        this.x = x;
        this.y = y;
        this.hitbox_radius = hitbox_radius;
        liste_unites.push(this);
    }
}

x_test = 2;
y_test = 3;
unite_test = new Unite(x_test,y_test);
console.log(unite_test.x,unite_test.y,unite_test.hitbox_radius);


liste_objet_id = matrice_unites[y_test][x_test];
console.log(liste_objet_id);
if (liste_objet_id[0]==1){
    console.log("liste des unités");
    console.log(liste_unites[liste_objet_id[1]]);
}




// Sélection de l'image à déplacer
const image = document.querySelector('img');
image.style.left = `${x_test*50 - parseInt(window.getComputedStyle(image).width) + 50 + parseInt(window.getComputedStyle(document.getElementById("grid-container")).left)}px`;
image.style.top = `${y_test*50 - parseInt(window.getComputedStyle(image).height) + 50 + parseInt(window.getComputedStyle(document.getElementById("grid-container")).top)}px`;

// Variables pour stocker la position de l'image et le mode de déplacement
let posImageX, posImageY, isMoving = false;

// Fonction qui sera exécutée lorsque l'utilisateur clique sur l'image
function onImageClick(event) {
  console.log("img click");
  if (isMoving) {
    // Si le mode de déplacement est activé, on calcule la nouvelle position de l'image
    let x = getCoords()[0]*square_size;
    let y = getCoords()[1]*square_size;
    let imgStyle = window.getComputedStyle(image);
    let imgWidth = parseInt(imgStyle.width);
    let imgHeight = parseInt(imgStyle.height);
    let gridLeft = parseInt(gridStyle.left);
    let gridTop = parseInt(gridStyle.top);
    console.log("x",x,"y",y,"w",imgWidth,"h",imgHeight);
    image.style.left = `${x - imgWidth + square_size + gridLeft}px`;
    image.style.top = `${y - imgHeight + square_size + gridTop}px`;
    isMoving = false;
  } else {
    // Si le mode de déplacement n'est pas activé, on stocke la position de l'image
    posImageX = image.offsetLeft;
    posImageY = image.offsetTop;
    console.log("posx",posImageX,"posy",posImageY);
    isMoving = true;
  }
  // Empêcher la propagation de l'événement de la souris au-delà de l'image
  event.stopPropagation();
}

// Fonction qui affiche les coordonnées de la case cliquée
function getCoords() {
  let gridLeft = parseInt(gridStyle.left);
  let gridTop = parseInt(gridStyle.top);
  console.log("grid left top",gridLeft,gridTop);
  return [Math.floor((event.clientX-gridLeft)/square_size), Math.floor((event.clientY-gridTop)/square_size)];
}

// Fonction qui sera exécutée lorsque l'utilisateur clique n'importe où sur la page
function onPageClick(event) {
  console.log("page click");
  console.log("x:",getCoords()[0],"y:",getCoords()[1]);
  let destination_x = getCoords()[0];
  let destination_y = getCoords()[1];
  let x = destination_x*square_size;
  let y = destination_y*square_size;
  console.log("x2:",x,"y2:",y);
  if (isMoving) {
    // Si le mode de déplacement est activé, on calcule la nouvelle position de l'image
    let imgStyle = window.getComputedStyle(image);
    let imgWidth = parseInt(imgStyle.width);
    let imgHeight = parseInt(imgStyle.height);
    let gridLeft = parseInt(gridStyle.left);
    let gridTop = parseInt(gridStyle.top);
    console.log("x",x,"y",y,"w",imgWidth,"h",imgHeight);
    matrice_unites[unite_test.y][unite_test.x]=null;
    console.log(unite_test.x,destination_x,destination_x*square_size-unite_test.x*square_size);
    console.log(unite_test.y,destination_y,destination_y*square_size-unite_test.y*square_size);
    image.style.animation = 'move-image 1s forwards';
    image.animate([
        { transform: 'translate(0,0)' },
        { transform: 'translate('+(destination_x*square_size-unite_test.x*square_size)+'px,'+(destination_y*square_size-unite_test.y*square_size)+'px)' }
      ], {
        duration: 1000,
        fill: "forwards"
      })
    image.style.animation = 'none';
    const t = setTimeout(() => {
        image.style.left = `${x - imgWidth + square_size + gridLeft}px`;
        image.style.top = `${y - imgHeight + square_size + gridTop}px`;
    }, 1_000)
    unite_test.x=destination_x;
    unite_test.y=destination_y;
    matrice_unites[unite_test.y][unite_test.x]=[1,0];
    console.log(matrice_unites);
    isMoving = false;
  }
}

// Ajout d'un écouteur d'événement pour détecter le clic sur l'image
image.addEventListener('click', onImageClick);

// Ajout d'un écouteur d'événement pour détecter le clic n'importe où sur la page
document.addEventListener('click', onPageClick);




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
const gridContainer = document.getElementById("grid-container");
const gridStyle = window.getComputedStyle(gridContainer);
const gridWidth = parseInt(gridStyle.width);
const gridHeight = parseInt(gridStyle.height);
const square_size = 50;
console.log(gridWidth,gridHeight,square_size);
console.log(Math.floor(gridWidth/square_size), Math.floor(gridHeight/square_size), square_size);
drawGrid(Math.floor(gridWidth/square_size), Math.floor(gridHeight/square_size), square_size);
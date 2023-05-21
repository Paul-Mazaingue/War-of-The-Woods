let n = 250; //taille du côté de la matrice

matrice_cases = mapLoader.lifeDead;
matrice_unites = mapLoader.unitElement;

const liste_unites = [];


const gridContainer = document.getElementById("grid-container");
const gridStyle = window.getComputedStyle(gridContainer);
const gridWidth = parseInt(gridStyle.width);
const gridHeight = parseInt(gridStyle.height);
const square_size = 20;
/*const gridLeft = parseInt(gridStyle.left);
const gridTop = parseInt(gridStyle.top);*/
const gridLeft = 0;
const gridTop = 0;
let gridSquareWidth = matrice_cases[0].length;
let gridSquareHeight = matrice_cases.length;

let mana = 0; //mana du joueur
let manaCollection = 10; //mana récolté par un ouvrier

let gold = 0; //or du joueur
let goldMine = 10000; //quantité d'or dans une mine
let goldCollection = 20; //or récolté par un ouvrier

let liste_hdv = []; //liste des hôtels de ville du joueur

let liste_totems = []; //liste des totems

 let cameraX = 0;
 let cameraY = 0;

 let ouvriertest;
// function moveCam(moveX,moveY,speed){
//   cameraX+=moveX*speed;
//   cameraY+=moveY*speed;
//   if(moveX!=0 || moveY!=0){
//     if(cameraX<0){
//       cameraX=0;
//     }
//     else if(cameraX>n*square_size-window.innerWidth){
//       cameraX=n*square_size-window.innerWidth;
//     }
//     if(cameraY<0){
//       cameraY=0;
//     }
//     else if(cameraY>n*square_size-window.innerHeight){
//       cameraY=n*square_size-window.innerHeight;
//     }
//     return true;
//   }
//   return false;
// }

// function updateCam(){
//   gridContainer.style.transform = `translate(${-cameraX}px, ${-cameraY}px)`;
// }

// let movecam = [0,0];

// document.addEventListener("keydown", function(event) {
//   // Vérifier si le bouton est enfoncé
//   let cameraSpeed = 100;
//   if (event.code === "ArrowRight") {
//     moveCam(1,0,cameraSpeed);
//   }
//   else if (event.code === "ArrowLeft") {
//     moveCam(-1,0,cameraSpeed);
//   }
// });

// document.addEventListener("keydown", function(event) {
//   // Vérifier si le bouton est enfoncé
//   let cameraSpeed = 100;
//   if (event.code === "ArrowDown") {
//     moveCam(0,1,cameraSpeed);
//   }
//   else if (event.code === "ArrowUp") {
//     moveCam(0,-1,cameraSpeed);
//   }
// });


// événement "mousemove" pour suivre la position de la souris et bouger la caméra
/*document.addEventListener("mousemove", function(event) {
  let margin = 50;
  if(event.clientX<=margin){
    movecam[0]=-1;
  }
  else if(event.clientX>=window.innerWidth-margin){
    movecam[0]=1;
  }
  else{
    movecam[0]=0;
  }
  if(event.clientY<=margin){
    movecam[1]=-1;
  }
  else if(event.clientY>=window.innerHeight-margin){
    movecam[1]=1;
  }
  else{
    movecam[1]=0;
  }
});*/

// let cameraChange = [cameraX,cameraY];
// let cameraSpeed = 100;
// let camUpdateInterval = setInterval(function(){
//   if(movecam[0]!=0 || movecam[1]!=0){
//     moveCam(movecam[0],movecam[1],cameraSpeed);
//   }
//   updateCam();
// }, 10);



// let map = document.createElement("img");
// map.src = "map3.png";
// map.style.position = "absolute";
// map.style.top=`${gridTop}px`;
// map.style.left=`${gridLeft}px`;
// map.style.width = `${n*square_size}px`;
// map.style.height = `${n*square_size}px`;
document.getElementById("map").addEventListener('mousedown', (event) => { // on désactive le déplacement de l'image par clic gauche
   if (event.button === 0) {
    event.preventDefault();
   }
 });
// gridContainer.appendChild(map);



let selectedUnits = [];


document.body.style.userSelect = `none`; // empêche la selection des éléments

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

// Projectile
class Projectile{
  constructor (startX = null, startY = null, endX = null, endY = null, speed = 500, image = ["", square_size, square_size], shooter = null){
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.speed = 100000/speed;
    this.shooter=shooter;

    this.imageDiv = document.createElement("div");
    this.imageDiv.classList.add('imageDiv');

    this.imagesrc = image[0];
    gridContainer.appendChild(this.imageDiv);
    this.imageImg = document.createElement("img");
    this.imageImg.addEventListener('mousedown', (event) => { //on désactive le déplacement de l'image par clic gauche
      if (event.button === 0) {
        event.preventDefault();
      }
    });
    this.imageImg.setAttribute('src', this.imagesrc);
    this.imageImg.style.position = `relative`;
    this.imageImg.style.zIndex = "1";
    this.imgHeight = image[1];
    this.imgWidth = image[2];
    this.imageImg.height = this.imgHeight;
    this.imageImg.width = this.imgWidth;
    this.imageImg.style.top = `${square_size/2-0.5*this.imgHeight}px`;
    this.imageImg.style.left = `${square_size/2-0.5*this.imgWidth}px`;
    this.imageDiv.appendChild(this.imageImg);
    this.imageDiv.style.left = `${gridLeft}px`;
    this.imageDiv.style.top = `${gridTop}px`;
    this.imageDiv.style.animation = 'move.imageDiv 1s forwards';
    this.imageDiv.animate([
        { transform: 'translate(0,0)' },
        { transform: 'translate('+(this.startX*square_size)+'px,'+(this.startY*square_size)+'px)' }
      ], {
        duration: 0,
        fill: "forwards"
      })
    this.imageDiv.style.animation = 'none';
    
    // Calcul de l'angle de rotation
    var deltaX = (this.endX * square_size) - (this.startX * square_size);
    var deltaY = (this.endY * square_size) - (this.startY * square_size);
    var angleInDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Le projectile s'oriente vers l'emplacement ciblé
    this.imageDiv.style.transform = 'rotate(' + angleInDegrees + 'deg)';

    // Déplacement du projectile
    this.imageDiv.style.animation = 'move.imageDiv 1s forwards';
    this.imageDiv.animate([
      { transform: 'translate('+(this.startX*square_size)+'px,'+(this.startY*square_size)+'px) rotate(' + angleInDegrees + 'deg)' },
      { transform: 'translate('+(this.endX*square_size)+'px,'+(this.endY*square_size)+'px) rotate(' + angleInDegrees + 'deg)' }
    ], {
      duration: this.speed,
      fill: "forwards"
    });

    this.imageDiv.style.animation = 'none';

    // Une fois le projectile arrivé à destination
    let proj = this;
    setTimeout(function() {
      // Si le projectile atterit sur une case avec une unité de la faction adverse ou celle de la cible
      if(matrice_unites[proj.endY][proj.endX] && matrice_unites[proj.endY][proj.endX][0]==1 && liste_unites[matrice_unites[proj.endY][proj.endX][1]]!=proj.shooter && (liste_unites[matrice_unites[proj.endY][proj.endX][1]].owner!=proj.shooter.owner || liste_unites[matrice_unites[proj.endY][proj.endX][1]].owner==proj.shooter.target.owner)){
        liste_unites[matrice_unites[proj.endY][proj.endX][1]].takeDamage(proj.shooter.damage);
      }
      proj.deleteProjectile()
    }, proj.speed);
    

  }

  deleteProjectile(){
    this.imageDiv.remove();
    delete this.startX;
    delete this.startY;
    delete this.endX;
    delete this.endy;
    delete this.speed;
    delete this.shooter;
    delete this.imageDiv;
    delete this.imageImg;
    delete this.imgHeight;
    delete this.imgWidth;
    delete this;
  }

}

// Unité
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
            matrice_unites[yi][xi] = 0;
          }
          else if(this.hitbox.type=="circle" && distance(this.x,this.y,xi,yi)<=this.hitbox.radius){
            matrice_unites[yi][xi] = 0;
          }
        }
      }
    }

    constructor (x = null,y = null,hitbox = {"radius":0, "type":"square"}, image = ["",square_size,square_size], speed = 250, health=100, attackType = "melee", damage=1, attackSpeed=1, aggroRange=5, attackRange=1,owner="enemy",canCollectMana = false, projectileSpeed = 500, projectileImage = ["", square_size, square_size],canCollectGold = false){
        //coordonnées x et y
        //hitbox avec radius le rayon (nombre entier ou non) et type (square ou circle pour la forme de la hitbox)
        //imagesrc le fichier de l.imageDiv
        //speed la vitesse de déplacement
        this.x = x; //coordonnée x
        this.y = y; //coordonnée y

        this.owner = owner; //propriétaire de l'unité (player/enemy)
        this.hitbox = hitbox; //hitbox avec radius (le rayon) et le type (la forme square/circle)
        this.health = health; //pv de l'unité
        this.maxHealth = health; //pv max de l'unité
        this.attackType = attackType; //type d'attaque melee/ranged
        this.damage = damage; //dégâts de l'attaque
        this.attackSpeed = attackSpeed; //délai entre chaque attaque
        this.aggroRange=aggroRange; //rayon de détection des unités adverses
        this.attackRange=attackRange; //portée d'attaque
        this.speed=speed; //vitesse de déplacement
        this.canCollectMana = canCollectMana; //true si l'unité peut récolter du mana
        this.collectingMana = false; //true si l'unité est en train de récolter du mana
        this.canCollectGold = canCollectGold; //true si l'unité peut récolter de l'or
        this.collectingGold = false; //true si l'unité est en train de récolter de l'or
        this.carriedGold = 0; //or porté par l'unité
        this.projectileSpeed=projectileSpeed; //vitesse de déplacement du projectile
        this.projectileImage=projectileImage; //image du projectile

        this.path = {}; //chemin de l'unité
        this.pathindex = 0; //position dans le chemin
        this.isMoving = false; //true si l'unité est en mouvement, false sinon
        this.isOrderedToMove = false; //true si c'est un ordre de déplacement du joueur, false sinon
        this.isOrderedToTarget = false; //true si c'est un ordre de ciblage du joueur, false sinon
        this.isOrderedToCollectMana = false; //true si c'est un ordre de collection de mana du joueur, false sinon
        this.isOrderedToCollectGold = false; //true si c'est un ordre de collection d'or du joueur, false sinon
        this.destinations = []; //liste des destinations suivantes
        this.target=false; //cible de l'unité
        this.aggroCenter=[this.x,this.y]; //centre de la zone d'aggro au delà de laquelle l'unité revient au centre de celle-ci
        this.calculatingDijkstra = false;
        liste_unites.push(this);
        if(this.x!=null && this.y!=null){
          this.setMatriceUnites();
        }

        this.imageDiv = document.createElement("div");
        this.imageDiv.classList.add('imageDiv');

        this.imagesrc = image[0];
        gridContainer.appendChild(this.imageDiv);
        this.imageImg = document.createElement("img");
        this.imageImg.addEventListener('mousedown', (event) => { //on désactive le déplacement de l'image par clic gauche
          if (event.button === 0) {
            event.preventDefault();
          }
        });
        this.imageImg.setAttribute('src', this.imagesrc);
        this.imageImg.style.position = `relative`;
        this.imageImg.style.zIndex = "1";
        this.imgHeight = image[1];
        this.imgWidth = image[2];
        this.imageImg.height = this.imgHeight;
        this.imageImg.width = this.imgWidth;
        this.imageImg.style.top = `${square_size/2-0.5*this.imgHeight}px`;
        this.imageImg.style.left = `${square_size/2-0.5*this.imgWidth}px`;
        this.imageDiv.appendChild(this.imageImg);
        this.imageDiv.style.left = `${gridLeft}px`;
        this.imageDiv.style.top = `${gridTop}px`;
        this.updatePosition();

        this.hitboxOutline = document.createElement("div");
        this.hitboxOutline.style.width = `${(this.hitbox["radius"]*2)*square_size+square_size}px`;
        this.hitboxOutline.style.height = `${(this.hitbox["radius"]*2)*square_size+square_size}px`;
        this.hitboxOutline.style.zIndex = "-10";
        this.hitboxOutline.style.border = "1px solid lime";
        if(hitbox["type"]=="circle"){
          this.hitboxOutline.style.borderRadius = `${(this.hitbox["radius"]+1)*square_size}px`;
        }
        this.hitboxOutline.style.position = "absolute";
        this.hitboxOutline.style.display = "none";
        this.hitboxOutline.style.top = `${-0.5* (this.hitbox["radius"]*2)*square_size+square_size - 19.5}px`;
        this.hitboxOutline.style.left = `${-0.5* (this.hitbox["radius"]*2)*square_size+square_size - 21.5}px`;
        this.imageDiv.appendChild(this.hitboxOutline);
        //console.log(this.hitbox,square_size*(this.hitbox["radius"]*2+1));
        this.hpBarWidth = square_size*(this.hitbox["radius"]*2+1);
        this.hpBarHeight = 4;
        this.createHpBar();

        unitLoop(this);
    }
    
    updatePosition(){
      if(this.x!=null && this.y!=null){
        this.setMatriceUnites();
        this.imageDiv.style.animation = 'move.imageDiv 1s forwards';
        this.imageDiv.animate([
            { transform: 'translate(0,0)' },
            { transform: 'translate('+(this.x*square_size)+'px,'+(this.y*square_size)+'px)' }
          ], {
            duration: 0,
            fill: "forwards"
          })
        this.imageDiv.style.animation = 'none';
        }
    }

    createHpBar(){
      console.log()
      // Création de la div pour la barre de vie
      this.hpBar = document.createElement('div');
      this.hpBar.classList.add('hpBar');
      
      // Création de la div pour la barre de vie
      this.hpBarFill = document.createElement('div');
      this.hpBarFill.classList.add('hpBarFill');
      
      // Création de la div pour le texte
      this.hpBarText = document.createElement('div');
      this.hpBarText.classList.add('hpBarText');
      this.hpBarText.innerText = `${this.health}`;
      
      // Ajout des éléments au DOM
      this.imageDiv.appendChild(this.hpBar);
      this.hpBar.appendChild(this.hpBarFill);
      this.hpBar.appendChild(this.hpBarText);
      
      // Style CSS de la barre de vie
      this.hpBar.style.width = `${this.hpBarWidth}px`;
      this.hpBar.style.height = `${this.hpBarHeight}px`;
      this.hpBar.style.backgroundColor = `#990500`;
      this.hpBar.style.border = `1px solid black`;
      this.hpBar.style.position = `relative`;
      this.hpBar.style.margin = `${this.hpBarWidth}px`;
      this.hpBar.style.left = `${-21.5-square_size*(this.hitbox["radius"]*3)}px`;
      this.hpBar.style.top = `${-2.55*square_size*(this.hitbox["radius"]*2+1)}px`;
      this.hpBar.style.zIndex = `2`;
      
      // Style CSS de la couleur de la barre de vie
      this.hpBarFill.style.width = `${100*this.health/this.maxHealth}%`;
      this.hpBarFill.style.height = `100%`;
      this.hpBarFill.style.backgroundColor = `lime`;
      this.hpBarFill.style.position = `absolute`;
      this.hpBarFill.style.left = `0`;
      this.hpBarFill.style.top = `0`;
      
      // Style CSS du texte de la barre de vie
      this.hpBarText.style.position = `absolute`;
      this.hpBarText.style.fontSize = `${this.hpBarHeight}px`;
      this.hpBarText.style.color = `black`;
      this.hpBarText.style.top = `50%`;
      this.hpBarText.style.left = `50%`;
      this.hpBarText.style.transform = `translate(-50%, -50%)`;
    }

    index(){
      return liste_unites.indexOf(this);
    }

    speedDelay(){
      return 100000/this.speed;
    }

    deleteUnit(){
      if(this.x!=null && this.y!=null){
        this.unsetMatriceUnites();
      }
      liste_unites[this.index()]=null; //supprime l'unité de la liste des unités
      this.imageDiv.remove();

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
      delete this.isOrderedToTarget;
      delete this.target;
      delete this.imagesrc;
      delete this.imageDiv;
      delete this.imgWidth;
      delete this.imgHeight;

      delete this;
    }

    updateHpBar(){
      this.hpBarFill.style.width = `${100*this.health/this.maxHealth}%`;
      this.hpBarText.innerText = `${this.health}`;
    }

    takeDamage(damage){
      this.health=Math.max(0,this.health-damage);

      this.updateHpBar();

      if(this.health==0){
        this.deleteUnit();
      }
    }

    attack(unit){
      if(this.attackType=="melee"){
        this.target.takeDamage(this.damage);
      }
      else if(this.attackType=="ranged"){
        new Projectile(this.x,this.y,unit.x,unit.y,this.projectileSpeed,this.projectileImage, this);
      }
    }
    
    collectMana(){
      if(this.isOrderedToCollectMana && !this.isMoving && !this.collectingMana){
        let closeToTree = false;
        for(let x = this.x-1; x<=this.x+1; x++){ // on parcourt les cases autour de l'ouvrier
          for(let y = this.y-1; y<=this.y+1; y++){
            if(matrice_unites[y] && matrice_unites[y][x] && matrice_unites[y][x]==1){ // si la case est un arbre
              closeToTree = true;
            }
          }
        }
        if(closeToTree){
          let unit = this;
          console.log("collecting mana")
          this.collectingMana=true;
          let collectManaInterval = setInterval(function(){
            if(!unit.health || !unit.isOrderedToCollectMana || unit.isMoving){
              unit.collectingMana=false;
              clearInterval(collectManaInterval);
            }
            else{
              console.log("mana :",mana,"->",mana+manaCollection);
              modifyMana(manaCollection); //on ajoute le mana au joueur
            }
          },unit.attackSpeed*1000);
        }
      }
    }
    
    collectGold(){
      if(this.isOrderedToCollectGold && !this.isMoving && !this.collectingGold){
        let closeToMine = false;
        for(let x = this.x-1; x<=this.x+1; x++){ // on parcourt les cases autour de l'ouvrier
          for(let y = this.y-1; y<=this.y+1; y++){
            if(matrice_unites[y] && matrice_unites[y][x] && matrice_unites[y][x][0]==1 && liste_unites[matrice_unites[y][x][1]].constructor.name=="UniteMine"){ // si la case est une mine
              closeToMine = liste_unites[matrice_unites[y][x][1]];
            }
          }
        }
        if(closeToMine!=false){
          let unit = this;
          this.collectingGold=true;

          setTimeout(function() { //l'unité récolte l'or après un peu de temps
            if(unit.carriedGold==0){
              console.log("carried gold :",unit.carriedGold,"->",unit.carriedGold+goldCollection);
              unit.carriedGold=Math.min(goldCollection,closeToMine.health); //l'unité prend l'or
              closeToMine.takeDamage(unit.carriedGold); //l'or est déduit de la mine
            }
            unit.lastMine=closeToMine;
            unit.collectingGold=false;
            unit.isOrderedToCollectGold=false;
            let nearestTownHall = false;
            let nearestTownHallDist = gridSquareHeight+gridSquareWidth;
            let dist;
            liste_hdv.forEach(hdv => { //on cherche l'hôtel de ville le plus proche
              dist = distance(unit.x,unit.y,hdv.x,hdv.y);
              if(dist<=nearestTownHallDist){
                nearestTownHall = hdv;
                nearestTownHallDist = dist;
              }
            });
            if(nearestTownHall!=false){ //si on a trouvé un hôtel de ville
              goTo(unit,nearestTownHall.x,nearestTownHall.y,true);
            }
          }, unit.attackSpeed*1000);
        }
      }
    }

    backToTownHall(){
      if(this.carriedGold && !this.isMoving){
        let closeToTownHall = false;
        for(let x = this.x-1; x<=this.x+1; x++){ // on parcourt les cases autour de l'ouvrier
          for(let y = this.y-1; y<=this.y+1; y++){
            if(matrice_unites[y] && matrice_unites[y][x] && matrice_unites[y][x][0]==1 && liste_unites[matrice_unites[y][x][1]].constructor.name=="UniteHotelDeVille"){ // si la case est un hôtel de ville
              closeToTownHall = liste_unites[matrice_unites[y][x][1]];
            }
          }
        }
        if(closeToTownHall!=false){
          let unit = this;
          setTimeout(function() { //l'unité dépose l'or après un peu de temps
            console.log("or :",gold,"->",gold+unit.carriedGold);
            modifyGold(unit.carriedGold); //on ajoute l'or au joueur
            unit.carriedGold=0;
            if(unit.lastMine && unit.lastMine.health){
              goTo(unit,unit.lastMine.x,unit.lastMine.y,true);
              unit.isOrderedToCollectGold=true;
            }
          }, unit.attackSpeed*1000);
        }
      }
    }

    spawnUnit(unit, goldCost = 0, manaCost = 0){
      //on recherche un point disponible proche
      let j = 1;
      let x;
      let y;
      let emptyCell = false;
      while(emptyCell == false && j<gridSquareHeight){
        y = this.y - j;
        while(emptyCell==false && y<=this.y+j){ //on parcourt les côtés sans parcourir les coins
          x = this.x - j;
          if(y==this.y-j||y==this.y+j){
            x++;
          }
          while(emptyCell==false && x<=this.x+j){
            if(checkHitbox(matrice_cases,y,x,unit,matrice_unites,false,false)==1){
              emptyCell = true; //si la case parcourue est vide
            }
            else{
              x++;
              if(y>this.y-j && y<this.y+j){
                if(x>this.x-j && x<this.x+j){ //on ne parcourt pas les cases déjà parcourues
                  x=this.x+j;
                }
              }
              else if(x==this.x-j || x==this.x+j){
                x++; //on ne compte pas les coins
              }
            }
          }
          y++;
        }
        if(emptyCell){
          unit.x=x;
          unit.y=y-1;
        }
        else{
          y=this.y-j;
          while(emptyCell==false && y<=this.y+j){ //on parcourt les coins
            x=this.x-j;
            while(emptyCell==false && x<=this.x+j){
              if(checkHitbox(matrice_cases,y,x,unit,matrice_unites,false,false)==1){
                emptyCell = true; //si la case parcourue est vide
              }
              else{
                x+=2*j;
              }
            }
            y+=2*j;
          }
          if(emptyCell){
            unit.x=x;
            unit.y=y-2*j;
          }
          j++;
        }
      }
      if(emptyCell && checkResources(goldCost,manaCost)){
        modifyGold(-goldCost);
        modifyMana(-manaCost);
        unit.updatePosition();
      }
      else{
        unit.deleteUnit();
      }
    }

    build(unit,goldCost = 0,manaCost = 0){
      let opacity = 0.5;
      let rectangle = document.createElement("div");
      rectangle.style.width = `${(unit.hitbox["radius"]*2+1)*square_size}px`;
      rectangle.style.height = `${(unit.hitbox["radius"]*2+1)*square_size}px`;
      rectangle.style.zIndex = "3";
      rectangle.style.backgroundColor = `rgba(0, 255, 0, ${opacity})`;
      rectangle.style.position = "absolute";
      
      let unitImg = document.createElement("img");
      unitImg.setAttribute('src', unit.imagesrc);
      unitImg.height = unit.imgHeight;
      unitImg.width = unit.imgWidth;
      unitImg.style.opacity=opacity;
      rectangle.appendChild(unitImg);

      gridContainer.appendChild(rectangle);

      let x;
      let y;
      let check;

      let follow = function(event){
        x = Math.floor((cameraX+event.clientX)/square_size);
        y = Math.floor((cameraY+event.clientY)/square_size);
        check = true;
        let yi = Math.max(0,y-unit.hitbox["radius"]);
        let xi;
        while(check && yi<=Math.min(y+unit.hitbox["radius"])){
          xi = Math.max(0,x-unit.hitbox["radius"]);
          while(check && xi<=Math.max(x+unit.hitbox["radius"])){
            if(matrice_unites[yi][xi]!=0){
              check = false;
            }
            xi++;
          }
          yi++;
        }
        xi--;
        yi--;
        if(check){
          rectangle.style.backgroundColor = `rgba(0, 255, 0, ${opacity})`;
        }
        else{
          rectangle.style.backgroundColor = `rgba(255, 0, 0, ${opacity})`;
        }
        rectangle.style.left = `${(x-unit.hitbox["radius"])*square_size-0.5}px`;
        rectangle.style.top = `${(y-unit.hitbox["radius"])*square_size+1.5}px`;
      }

      let place = function(event){
        if (event.button === 0) { // clic gauche
          event.preventDefault();
          if(check && checkResources(goldCost,manaCost)){
            modifyGold(-goldCost);
            modifyMana(-manaCost);
            unit.x = x;
            unit.y = y;
            unit.updatePosition();
            rectangle.remove();
            document.removeEventListener("mousemove",follow);
            document.removeEventListener("mousedown",place);
            document.removeEventListener("contextmenu",cancel);
          }
        }
      }

      let cancel = function(event){
        unit.deleteUnit();
        rectangle.remove();
        document.removeEventListener("mousemove",follow);
        document.removeEventListener("mousedown",place);
        document.removeEventListener("contextmenu",cancel);
      }
      

      // on suit la position de la souris pour mettre à jour la position du rectangle
      document.addEventListener("mousemove", follow);

      // placement du bâtiment
      document.addEventListener("mousedown", place);

      // annuler la construction
      document.addEventListener("contextmenu", cancel);
    }

    setButtons(){
      resetButtons();
    }
  }

//============================================================//
//                        Unités                              //
//============================================================//


// Ouvrier
class UniteOuvrier extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/ouvrier.png",square_size,square_size], 250, 60, "melee", 10, 1.5, 5, 1, "player", true, 0, null, true);
  }

  buildCaserne(){
    let goldCost = 400;
    let manaCost = 0;
    if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
      this.build(new UniteCaserne(),goldCost,manaCost);
    }
    else{
      console.log("Pas assez de ressources");
    }
  }

  setButtons(){
    let unit = this;
    changeButton(1,"./img/iconeCaserne.jpg",function(event){unit.buildCaserne()});
  }
}

console.log(ouvriertest)
// Soldat
class UniteSoldat extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/soldat.png",square_size,square_size], 250, 100, "melee", 15, 1.2, 5, 1, "player", false, 0, null, false);
  }
}


// Totem
class UniteTotem extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":1, "type":"square"}, ["./img/totem.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false);
    this.totemRange = 50;
    this.totemHealRange = this.hitbox["radius"]+3;
    this.totemHealAmount = 1;
    this.totemHealSpeed = 100;
    this.health = 0;
    liste_totems.push(this); //on ajoute le totem à la liste des totems
    this.alive = false; //true si le totem est en vie, false sinon
    this.updateHpBar();
    this.totemLoop();
  }
    
  totemLoop(){
    let unit = this;
    let nb;
    let enemy;
    let totemLoopInterval = setInterval(function(){
      nb = 0;
      enemy=false;
      for(let y = Math.max(0,unit.y-unit.totemHealRange); y<=Math.min(gridSquareWidth,unit.y+unit.totemHealRange); y++){
        for(let x = Math.max(0,unit.x-unit.totemHealRange); x<=Math.min(gridSquareWidth,unit.x+unit.totemHealRange); x++){
          if(matrice_unites[y] && matrice_unites[y][x] && matrice_unites[y][x][0]==1 && liste_unites[matrice_unites[y][x][1]]!=unit){
            if(liste_unites[matrice_unites[y][x][1]].owner=="player" && liste_unites[matrice_unites[y][x][1]].speedDelay()>0){ //si l'unité appartient au joueur et que ce n'est pas un bâtiment
              nb++;
            }
            else{
              enemy = true;
            }
          }
        }
      }
      if(!enemy && nb>0){
        unit.healTotem(nb);
      }
    },unit.totemHealSpeed);
  }

  takeDamage(damage){
    this.health=Math.max(0,this.health-damage);
    
    this.updateHpBar();

    if(this.health==0 && this.owner=="player"){
      this.owner="enemy";
      //Conversion en terre morte
      for(let y = Math.max(0,this.y-this.totemRange); y<=Math.min(gridSquareWidth,this.y+this.totemRange); y++){
        for(let x = Math.max(0,this.x-this.totemRange); x<=Math.min(gridSquareWidth,this.x+this.totemRange); x++){
          if(matrice_cases[y] && matrice_cases[y][x] && matrice_cases[y][x]==1){
            matrice_cases[y][x]=0;
            this.alive=false;
          }
        }
      }
    }
  }

  healTotem(nb){
    this.owner="player";
    if(this.health<this.maxHealth){
      for(let n = 0; n<nb; n++){
        if(mana>=this.totemHealAmount && this.health<this.maxHealth){
          modifyMana(-this.totemHealAmount); //on retire du mana au joueur
          this.health=Math.min(this.maxHealth,this.health+this.totemHealAmount);
        }
      }
          
      this.hpBarFill.style.width = `${100*this.health/this.maxHealth}%`;
      this.hpBarText.innerText = `${this.health}`;

      if(this.health==this.maxHealth){
        //Conversion en terre vivante
        for(let y = Math.max(0,this.y-this.totemRange); y<=Math.min(gridSquareWidth,this.y+this.totemRange); y++){
          for(let x = Math.max(0,this.x-this.totemRange); x<=Math.min(gridSquareWidth,this.x+this.totemRange); x++){
            if(matrice_cases[y][x]==0){
              matrice_cases[y][x]=1;
              this.alive=true;
            }
          }
        }
        this.checkTotems();
      }
    }
  }

  checkTotems(){
    let win = true;
    liste_totems.forEach(totem => {
      if(totem.alive==false){
        win=false;
      }
    });
    if(win){
      alert("Victoire !");
    }
    return win;
  }

}


// Mage
class UniteMage extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/mage.png",square_size,square_size], 250, 50, "ranged", 25, 2, 7, 5, "player", false, 400, ["./img/projectile_magique.png", square_size/2, square_size/2], false);
  }
}


// Archer
class UniteArcher extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/archer.png",square_size,square_size], 250, 60, "ranged", 15, 1.75, 7, 5, "player", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false);
  }
}


// Caserne
class UniteCaserne extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":1, "type":"square"}, ["./img/caserne.png",square_size*3,square_size*3], 0, 800, "melee", 0, 0, 0, 0, "player", false, 0, null, false);
  }
}

// Hôtel de ville
class UniteHotelDeVille extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":1, "type":"square"}, ["./img/hdv.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "player", false, 0, null, false);
    liste_hdv.push(this);
  }

  spawnOuvrier(){
    let goldCost = 60;
    let manaCost = 0;
    if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
      this.spawnUnit(new UniteOuvrier(),goldCost,manaCost);
    }
    else{
      console.log("Pas assez de ressources");
    }
  }

  setButtons(){
    let unit = this;
    changeButton(1,"./img/iconeOuvrier.jpg",function(event){unit.spawnOuvrier()});
  }
}

// Mine d'or
class UniteMine extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":1, "type":"square"}, ["./img/mine.png",square_size*3,square_size*3], 0, goldMine, "melee", 0, 0, 0, 0, "player", false, 0, null, false);
  }
}


// Tour
class UniteTour extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":1, "type":"square"}, ["./img/tower.png",square_size*3,square_size*3], 0, 600, "ranged", 15, 1.75, 7, 7, "player", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false);
  }
}


// Ennemis


// Ennemi 0
class UniteEnnemi0 extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie0.png",square_size,square_size], 250, 100, "melee", 15, 1.2, 5, 1, "enemy", false, 0, null, false);
  }
}


// Ennemi 1
class UniteEnnemi1 extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie1.png",square_size,square_size], 250, 100, "melee", 15, 1.2, 5, 1, "enemy", false, 0, null, false);
  }
}


// Ennemi 10
class UniteEnnemi10 extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie10.png",square_size,square_size], 250, 60, "ranged", 15, 1.75, 7, 5, "enemy", false, 600, ["./img/projectile_magique.png", square_size/2, square_size/2], false);
  }
}


// Ennemi 11
class UniteEnnemi11 extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie11.png",square_size,square_size], 250, 60, "ranged", 15, 1.75, 7, 5, "enemy", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false);
  }
}


// Ennemi 20
class UniteEnnemi20 extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie20.png",square_size,square_size], 250, 150, "melee", 10, 1.2, 5, 1, "enemy", false, 0, null, false);
  }
}


// Ennemi 21
class UniteEnnemi21 extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie21.png",square_size,square_size], 250, 150, "melee", 10, 1.2, 5, 1, "enemy", false, 0, null, false);
  }
}

// Base Ennemie
class UniteBaseEnnemie extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":1, "type":"square"}, ["./img/ennemieBase.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false);
  }
}


// Caserne Ennemie
class UniteCaserneEnnemie extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":1, "type":"square"}, ["./img/ennemieBarrak.png",square_size*3,square_size*3], 0, 800, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false);
  }
}


// Tour Ennemie
class UniteTourEnnemie extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":1, "type":"square"}, ["./img/tower.png",square_size*3,square_size*3], 0, 600, "ranged", 15, 1.75, 7, 7, "enemy", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false);
  }
}

// Atelier Ennemie
class UniteAtelierEnnemi extends Unite {
  constructor(x = null, y = null) {
    super(x, y, {"radius":1, "type":"square"}, ["./img/ennemieUpgrade.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false);
  }
}



//============================================================//







// Fonction qui affiche les coordonnées de la case cliquée
function getCoords(x = event.clientX, y = event.clientY) {
  return [Math.floor((x+cameraX-gridLeft)/square_size), Math.floor((y+cameraY-gridTop)/square_size)];
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

// Ajout d'un écouteur d'événement pour détecter le clic n'importe où sur la page
document.addEventListener('contextmenu', onPageClick);


// Créer un élément HTML pour représenter la sélection
const selection = document.createElement("div");
selection.style.position = "absolute";
selection.style.border = "1px solid #000";
selection.style.borderColor = "lime";
document.body.appendChild(selection);
selection.style.display = "none";

// Variables pour stocker les positions de début et de fin de la sélection
let selStartX, selStartY, selEndX, selEndY;

// événement "mousedown" pour commencer la sélection
gridContainer.addEventListener("mousedown", function(event) {
  // Vérifier si le clic gauche est enfoncé
  if (event.button === 0) {
    if(event.clientX)
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
    if(selectedUnits.length>=1){
      selectedUnits.forEach(selectedUnit => {
        selectedUnit.hitboxOutline.style.display="none";
      });
    }
    selectedUnits=[];
    let xiStart = Math.min(selStartCoords[0],selEndCoords[0]);
    let xiEnd = Math.max(selStartCoords[0],selEndCoords[0]);
    let yiStart = Math.min(selStartCoords[1],selEndCoords[1]);
    let yiEnd = Math.max(selStartCoords[1],selEndCoords[1]);
    for(let x = xiStart; x<=xiEnd; x++){
      for(let y = yiStart; y<=yiEnd; y++){
        if(matrice_unites[y][x] && matrice_unites[y][x][0] == 1 && liste_unites[matrice_unites[y][x][1]].owner=="player" && !selectedUnits.includes(liste_unites[matrice_unites[y][x][1]])){ //s'il y a une unité sur la case parcourue et qu'elle n'est pas déjà sélectionnée
          selectedUnits.push(liste_unites[matrice_unites[y][x][1]]);
          liste_unites[matrice_unites[y][x][1]].hitboxOutline.style.display="block";
        }
      }
    }
    if(selectedUnits.length>0){
      selectedUnits[0].setButtons();
    }
    else{
      resetButtons();
    }
    selStartX, selStartY; selEndX, selEndY = undefined;
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
      { transform: 'translate('+(unit.x*square_size)+'px,'+(unit.y*square_size)+'px)' },
      { transform: 'translate('+(destination_x*square_size)+'px,'+(destination_y*square_size)+'px)' }
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
  if(unit.damage>0){
    attackLoop(unit);
    targetLoop(unit);
  }
}

function moveLoop(unit){
  let moveUnitResult;
  let path = unit.path;
  let lastMove = 0;
  let moveInterval = setInterval(function(){
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
  },10);
}

function targetLoop(unit){
  let targetX = null;
  let targetY = null;
  let targetInterval = setInterval(function(){
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



function spawnUnit(matrix) {
  for(let y = 0; y < matrix.length; y++) {
      for(let x = 0; x < matrix[0].length; x++) {
          if([100,101,200,201,210,211,220,221,300,301,302,303,400,401,500].includes(matrix[y][x])) {

              switch(matrix[y][x]) {
                  case 100: // mine
                      if(matrix[y+1][x] != 100 && matrix[y][x+1] != 100) { // si on est dans le coin en bas à droite
                          new UniteMine(x-1,y-1);
                      }
                      break;
                  case 101: // totem
                      if(matrix[y+1][x] != 101 && matrix[y][x+1] != 101) { // si on est dans le coin en bas à droite
                        new UniteTotem(x-1,y-1);
                      }
                      break;
                  case 200: // ennemie0 cac
                      new UniteEnnemi0(x,y);
                      break;
                  case 201: // ennemie1 cac
                      new UniteEnnemi1(x,y);
                      break;
                  case 210: // ennemie10 distance
                      new UniteEnnemi10(x,y);
                      break;
                  case 211: // ennemie11 distance
                      new UniteEnnemi11(x,y);
                      break;
                  case 220: // ennemie20 tank
                      new UniteEnnemi20(x,y);
                      break;
                  case 221: // ennemie21 tank
                      new UniteEnnemi21(x,y);
                      break;
                  case 300: // tower
                      if(matrix[y+1][x] != 300 && matrix[y][x+1] != 300) { // si on est dans le coin en bas à droite
                        new UniteTourEnnemie(x-1,y-1);
                      }
                      break;
                  case 301: // ennemieBase
                      if(matrix[y+1][x] != 301 && matrix[y][x+1] != 301) { // si on est dans le coin en bas à droite
                        new UniteBaseEnnemie(x-1,y-1);
                      }
                      break;
                  case 302: // ennemieBarrak
                      if(matrix[y+1][x] != 302 && matrix[y][x+1] != 302) { // si on est dans le coin en bas à droite
                        new UniteCaserneEnnemie(x-1,y-1);
                      }
                      break;
                  case 303: // ennemieUpgrade
                      if(matrix[y+1][x] != 303 && matrix[y][x+1] != 303) { // si on est dans le coin en bas à droite
                        new UniteAtelierEnnemi(x-1,y-1);
                      }
                      break;
                  case 400: // peasant
                      ouvriertest = new UniteOuvrier(x,y);
                      break;
                  case 401: // soldier
                      new UniteSoldat(x,y);
                      break;
                  case 500: // playerBase
                      if(matrix[y+1][x] != 500 && matrix[y][x+1] != 500) { // si on est dans le coin en bas à droite
                        new UniteHotelDeVille(x-1,y-1);
                      }
                      break;
              }
              
          }
      }
  }
}
spawnUnit(mapLoader.unitElement);

cameraX = (liste_hdv[0].x-20)*square_size;
cameraY = (liste_hdv[0].y-20)*square_size;
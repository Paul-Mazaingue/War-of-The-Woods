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

    constructor (x = null,y = null,hitbox = {"radius":0, "type":"square"}, image = ["",40,40], speed = 250, health=100, attackType = "melee", damage=1, attackSpeed=1, aggroRange=5, attackRange=1,owner="enemy",canCollectMana = false, projectileSpeed = 500, projectileImage = ["", 40, 40],canCollectGold = false,liste_unites,gridContainer,square_size,gridLeft,gridTop, goldCollection, manaCollection, liste_hdv){
      this.square_size = square_size;
      this.gridContainer = gridContainer;
      this.gridLeft = gridLeft;
      this.gridTop = gridTop;
      this.liste_unites = liste_unites;
      this.goldCollection = goldCollection;
      this.manaCollection = manaCollection;
      this.liste_hdv = liste_hdv;
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
        this.liste_unites.push(this);
        if(this.x!=null && this.y!=null){
          this.setMatriceUnites();
        }

        this.imageDiv = document.createElement("div");
        this.imageDiv.classList.add('imageDiv');

        this.imagesrc = image[0];
        this.gridContainer.appendChild(this.imageDiv);
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
        this.imageImg.style.top = "0";//`${this.square_size*(this.hitbox["radius"]+0.5)}}px`;
        this.imageImg.style.left = "0";//`${this.square_size*(this.hitbox["radius"]+0.5)}}px`;
        this.imageDiv.appendChild(this.imageImg);
        this.imageDiv.style.left = `${gridLeft}px`;
        this.imageDiv.style.top = `${gridTop}px`;
        this.updatePosition();

        this.hitboxOutline = document.createElement("div");
        this.hitboxOutline.style.width = `${(this.hitbox["radius"]*2)*this.square_size+this.square_size}px`;
        this.hitboxOutline.style.height = `${(this.hitbox["radius"]*2)*this.square_size+this.square_size}px`;
        this.hitboxOutline.style.zIndex = "-10";
        this.hitboxOutline.style.border = "1px solid lime";
        if(hitbox["type"]=="circle"){
          this.hitboxOutline.style.borderRadius = `${(this.hitbox["radius"]+1)*this.square_size}px`;
        }
        this.hitboxOutline.style.position = "absolute";
        this.hitboxOutline.style.display = "none";
        this.hitboxOutline.style.top = "0";//`${-0.5* (this.hitbox["radius"]*2)*this.square_size+this.square_size - 19.5}px`;
        this.hitboxOutline.style.left = "0";//`${-0.5* (this.hitbox["radius"]*2)*this.square_size+this.square_size - 21.5}px`;
        this.imageDiv.appendChild(this.hitboxOutline);
        //console.log(this.hitbox,this.square_size*(this.hitbox["radius"]*2+1));
        this.hpBarWidth = this.square_size*(this.hitbox["radius"]*2+1);
        this.hpBarHeight = 10;
        this.createHpBar();

        unitLoop(this);
    }
    
    updatePosition(){
      if(this.x!=null && this.y!=null){
        this.setMatriceUnites();
        this.imageDiv.style.animation = 'move.imageDiv 1s forwards';
        this.imageDiv.animate([
            { transform: 'translate(0,0)' },
            { transform: 'translate('+(this.x*this.square_size-this.square_size*(this.hitbox["radius"]))+'px,'+(this.y*this.square_size-this.square_size*(this.hitbox["radius"]))+'px)' }
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
      this.hpBar.style.width = `${this.hpBarWidth-4}px`;
      this.hpBar.style.height = `${this.hpBarHeight}px`;
      this.hpBar.style.backgroundColor = `#990500`;
      this.hpBar.style.border = `1px solid black`;
      this.hpBar.style.position = `relative`;
      this.hpBar.style.margin = `${this.hpBarWidth}px`;
      this.hpBar.style.left = `${2-1*this.square_size*(this.hitbox["radius"]*2+1)}px`;
      this.hpBar.style.top = `${-9-this.hpBarHeight-2*this.square_size*(this.hitbox["radius"]*2+1)}px`;
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
      this.hpBarText.style.fontWeight = `bold`;
      this.hpBarText.style.color = `black`;
      this.hpBarText.style.top = `50%`;
      this.hpBarText.style.left = `50%`;
      this.hpBarText.style.transform = `translate(-50%, -50%)`;
    }

    index(){
      return this.liste_unites.indexOf(this);
    }

    speedDelay(){
      return 100000/this.speed;
    }

    deleteUnit(){
      if(this.x!=null && this.y!=null){
        this.unsetMatriceUnites();
      }
      this.liste_unites[this.index()]=null; //supprime l'unité de la liste des unités
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

    takeDamage(damage=0){
      this.health=Math.max(0,this.health-damage);

      this.updateHpBar();

      if(this.health==0){
        this.deleteUnit();
      }
    }
  
    getHealed(heal){
      this.health=Math.min(this.maxHealth,this.health+heal);
      this.updateHpBar();
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
              console.log("mana :",mana,"->",mana+unit.manaCollection);
              modifyMana(unit.manaCollection); //on ajoute le mana au joueur
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
            if(matrice_unites[y] && matrice_unites[y][x] && matrice_unites[y][x][0]==1 && this.liste_unites[matrice_unites[y][x][1]].constructor.name=="UniteMine"){ // si la case est une mine
              closeToMine = this.liste_unites[matrice_unites[y][x][1]];
            }
          }
        }
        if(closeToMine!=false){
          let unit = this;
          this.collectingGold=true;

          setTimeout(function() { //l'unité récolte l'or après un peu de temps
            if(unit.carriedGold==0){
              console.log("carried gold :",unit.carriedGold,"->",unit.carriedGold+unit.goldCollection);
              unit.carriedGold=Math.min(unit.goldCollection,closeToMine.health); //l'unité prend l'or
              closeToMine.takeDamage(unit.carriedGold); //l'or est déduit de la mine
            }
            unit.lastMine=closeToMine;
            unit.collectingGold=false;
            unit.isOrderedToCollectGold=false;
            let nearestTownHall = false;
            let nearestTownHallDist = gridSquareHeight+gridSquareWidth;
            let dist;
            unit.liste_hdv.forEach(hdv => { //on cherche l'hôtel de ville le plus proche
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
            if(matrice_unites[y] && matrice_unites[y][x] && matrice_unites[y][x][0]==1 && this.liste_unites[matrice_unites[y][x][1]].constructor.name=="UniteHotelDeVille"){ // si la case est un hôtel de ville
              closeToTownHall = this.liste_unites[matrice_unites[y][x][1]];
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

    changeImage(image){
      this.imagesrc = image;
      this.imageImg.setAttribute('src', this.imagesrc);
    }

    build(unit,goldCost = 0,manaCost = 0){
      let builder = this;
      let opacity = 0.5;
      let rectangle = document.createElement("div");
      rectangle.style.width = `${(unit.hitbox["radius"]*2+1)*this.square_size}px`;
      rectangle.style.height = `${(unit.hitbox["radius"]*2+1)*this.square_size}px`;
      rectangle.style.zIndex = "3";
      rectangle.style.backgroundColor = `rgba(0, 255, 0, ${opacity})`;
      rectangle.style.position = "absolute";
      
      this.unitImg = document.createElement("img");
      this.unitImg.setAttribute('src', unit.imagesrc);
      this.unitImg.height = unit.imgHeight;
      this.unitImg.width = unit.imgWidth;
      this.unitImg.style.opacity=opacity;
      rectangle.appendChild(this.unitImg);

      this.gridContainer.appendChild(rectangle);

      let x;
      let y;
      let check;

      let follow = function(event){
        x = Math.floor((camera.cameraX+event.clientX)/builder.square_size);
        y = Math.floor((camera.cameraY+event.clientY)/builder.square_size);
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
        rectangle.style.left = `${(x-unit.hitbox["radius"])*builder.square_size-0.5}px`;
        rectangle.style.top = `${(y-unit.hitbox["radius"])*builder.square_size+1.5}px`;
      }

      let place = function(event){
        if (event.button === 0) { // clic gauche
          event.preventDefault();
          if(check && checkResources(goldCost,manaCost)){
            modifyGold(-goldCost);
            modifyMana(-manaCost);
            document.removeEventListener("mousemove",follow);
            document.removeEventListener("mousedown",place);
            document.removeEventListener("contextmenu",cancel);
            rectangle.style.backgroundColor="rgba(0, 0, 0, 0)";
            let xb,yb;
            let dist = distance(builder.x,builder.y,x,y)+10;
            for(let xi = x-unit.hitbox["radius"]-1; xi<=x+unit.hitbox["radius"]+1; xi++){
              for(let yi = y-unit.hitbox["radius"]-1; yi<=y+unit.hitbox["radius"]+1; yi++){
                if(Math.abs(xi-x)==unit.hitbox["radius"]+1 || Math.abs(yi-y)==unit.hitbox["radius"]+1){ //on parcourt les cases autour du bâtiment
                  if(checkHitbox(matrice_cases,yi,xi,builder,matrice_unites,true,false,true)==1){ //si la case est libre
                    if(distance(builder.x,builder.y,xi,yi)<dist){ //on prend le point le plus proche
                      dist = distance(builder.x,builder.y,xi,yi);
                      xb = xi;
                      yb = yi;
                    }
                  }
                }
              }
            }
            if(xb){
              goTo(builder,xb,yb,true);
              let moveInterval = setInterval(function(){
                if(!builder.health || (builder.destinations.length==0 && (builder.path.length==0 || builder.path[builder.path.length-1]["x"]!=yb || builder.path[builder.path.length-1]["y"]!=xb))){ //si l'ouvrier est mort, ou que sa destination finale a changé
                  clearInterval(moveInterval);
                  setTimeout(function() { //on attend la fin du mouvement
                    rectangle.remove();
                    if(builder.health && !builder.isMoving && builder.x==xb && builder.y==yb && checkHitbox(matrice_cases,y,x,unit,matrice_unites,true,false,true)==1){ //si l'ouvrier est arrivé à destination et que le bâtiment peut être placé
                      unit.x = x;
                      unit.y = y;
                      unit.updatePosition();
                      unit.health=1;
                      unit.updateHpBar();
        
                      let buildInterval = setInterval(function(){
                        if(!unit.health || builder.isMoving || unit.health==unit.maxHealth){
                          clearInterval(buildInterval);
                          if(unit.health==unit.maxHealth){
                            console.log("Travail terminé !")
                          }
                        }
                        else{
                          unit.health=Math.min(unit.maxHealth,unit.health+100);
                          unit.updateHpBar();
                        }
                      },50);
                    }
                  },builder.speedDelay());
                }
              },10);
            }
            else{
              rectangle.remove();
            }
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

    checkUpgrades(){
      return false;
    }
  }
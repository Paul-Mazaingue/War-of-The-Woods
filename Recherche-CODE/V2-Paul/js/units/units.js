// Ouvrier
class UniteOuvrier extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ouvrier.png",square_size,square_size], 250, 60, "melee", 10, 1.5, 7, 1, "player", true, 0, null, true,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
    buildCaserne(){
      let goldCost = 0;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.build(new UniteCaserne(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }

    buildTour(){
      let goldCost = 200;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.build(new UniteTour(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }
  
    setButtons(){
      let unit = this;
      changeButton(1,"./img/iconeCaserne.jpg",function(event){unit.buildCaserne()});
      changeButton(2,"./img/tower.png",function(event){unit.buildTour()});
    }
  }

  // Soldat
class UniteSoldat extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/soldat.png",square_size,square_size], 250, 100, "melee", 15, 1.2, 7, 1, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Totem
  class UniteTotem extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv,liste_totems) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/totem.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
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
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/mage.png",square_size,square_size], 250, 50, "ranged", 25, 2, 7, 5, "player", false, 400, ["./img/projectile_magique.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Archer
  class UniteArcher extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/archer.png",square_size,square_size], 250, 60, "ranged", 15, 1.75, 7, 5, "player", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Caserne
  class UniteCaserne extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/caserne.png",square_size*3,square_size*3], 0, 800, "melee", 0, 0, 0, 0, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  
    spawnSoldat(){
      let goldCost = 100;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.spawnUnit(new UniteSoldat(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }
  
    spawnArcher(){
      let goldCost = 0;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.spawnUnit(new UniteArcher(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }
  
    setButtons(){
      let unit = this;
      changeButton(1,"./img/soldat.png",function(event){unit.spawnSoldat()});
      changeButton(2,"./img/archer.png",function(event){unit.spawnArcher()});
    }
  }
  let hdv;
  // Hôtel de ville
  class UniteHotelDeVille extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/hdv.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.liste_hdv.push(this);
      hdv = this;
    }
  
    spawnOuvrier(){
      let goldCost = 60;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.spawnUnit(new UniteOuvrier(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
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
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv,goldMine) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/mine.png",square_size*3,square_size*3], 0, goldMine, "melee", 0, 0, 0, 0, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Tour
  class UniteTour extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/tower.png",square_size*3,square_size*3], 0, 600, "ranged", 15, 1.75, 7, 7, "player", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemis
  
  
  // Ennemi 0
  class UniteEnnemi0 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie0.png",square_size,square_size], 250, 100, "melee", 15, 1.2, 7, 1, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 1
  class UniteEnnemi1 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie1.png",square_size,square_size], 250, 100, "melee", 15, 1.2, 7, 1, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 10
  class UniteEnnemi10 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie10.png",square_size,square_size], 250, 60, "ranged", 15, 1.75, 7, 5, "enemy", false, 600, ["./img/projectile_magique.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 11
  class UniteEnnemi11 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie11.png",square_size,square_size], 250, 60, "ranged", 15, 1.75, 7, 5, "enemy", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 20
  class UniteEnnemi20 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie20.png",square_size,square_size], 250, 150, "melee", 10, 1.2, 7, 1, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 21
  class UniteEnnemi21 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie21.png",square_size,square_size], 250, 150, "melee", 10, 1.2, 7, 1, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  // Base Ennemie
  class UniteBaseEnnemie extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/ennemieBase.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Caserne Ennemie
  class UniteCaserneEnnemie extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/ennemieBarrak.png",square_size*3,square_size*3], 0, 800, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Tour Ennemie
  class UniteTourEnnemie extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/tower.png",square_size*3,square_size*3], 0, 600, "ranged", 15, 1.75, 7, 7, "enemy", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  // Atelier Ennemie
  class UniteAtelierEnnemi extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/ennemieUpgrade.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
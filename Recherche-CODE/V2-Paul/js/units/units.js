// Ouvrier
class UniteOuvrier extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ouvrier.png",square_size,square_size], 250, 50, "melee", 7, 1.5, 10, 1, "player", true, 0, null, true,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
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
      let goldCost = 0;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.build(new UniteTour(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }

    buildAtelier(){
      let goldCost = 0;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.build(new UniteAtelier(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }

    buildHdv(){
      let goldCost = 0;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.build(new UniteHotelDeVille(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }
  
    setButtons(){
      let unit = this;
      changeButton(1,"./img/iconeCaserne.jpg",function(event){unit.buildCaserne()});
      changeButton(2,"./img/tower.png",function(event){unit.buildTour()});
      changeButton(3,"./img/ennemieUpgrade.png",function(event){unit.buildAtelier()});
      changeButton(4,"./img/hdv.png",function(event){unit.buildHdv()});
    }
  }

  // Soldat
  class UniteSoldat extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/soldat.png",square_size,square_size], 250, 100, "melee", 15, 1.2, 10, 1, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.level = [0,0];
      this.checkUpgrades();
    }

    checkUpgrades(){
      //Dégâts
      let n = 0;
      let up = upgradesAtelier[n];
      while(up>this.level[0]){
        console.log("+degats",up);
        this.damage+=3;
        up--;
      }
      this.level[0] = upgradesAtelier[n];

      //Speed et PV
      n=1;
      up = upgradesAtelier[n];
      while(up>this.level[1]){
        console.log("+speed, +pv",up);
        this.speed+=20;
        let ratio = this.health/this.maxHealth;
        this.maxHealth+=10;
        this.health=Math.round(ratio*this.maxHealth);
        this.updateHpBar();
        up--;
      }
      this.level[1] = upgradesAtelier[n];
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

  
  // Soigneur
  class UniteSoigneur extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/mage.png",square_size,square_size], 250, 50, "ranged", 0, 2, 10, 8, "player", false, 400, ["./img/projectile_magique.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.healAmount = 10;
      this.healLoop();
    }
  
    healLoop(){
      let unit = this;
      let lastHeal = 0;
      let canHeal = true;
      let xmin;
      let xmax;
      let ymin;
      let ymax;
      let healInterval = setInterval(function(){
        if(!unit.health){
          clearInterval(healInterval);
        }
        if(canHeal){ // Délai de déplacement en fonction de la vitesse
          if(unit.isMoving==false){ // on vérifie que l'unité n'a pas reçu d'ordre de déplacement car il est prioritaire par rapport au soin
            if(unit.target && unit.target.health && unit.target.owner==unit.owner && unit.target.health<unit.target.maxHealth){
              xmin = Math.max(0,unit.x-unit.aggroRange);
              xmax = Math.min(gridSquareWidth-1,unit.x+unit.aggroRange);
              ymin = Math.max(0,unit.y-unit.aggroRange);
              ymax = Math.min(gridSquareHeight-1,unit.y+unit.aggroRange);
              for(let yi = ymin; yi<ymax; yi++){ //on parcourt le carré ayant pour côté le rayon d'attaque de l'unité
                for(let xi = xmin; xi<xmax; xi++){
                  if(matrice_unites[yi][xi] && matrice_unites[yi][xi][1]==liste_unites.indexOf(unit.target)){ //si l'unité parcourue est l'unité ciblée
                    if(Math.abs(xi-unit.x)<=unit.attackRange && Math.abs(yi-unit.y)<=unit.attackRange){
                      unit.heal(unit.target);
                      if(unit.target.health==unit.target.maxHealth){
                        unit.target = false;
                      }
                      canHeal = false;
                      lastHeal = Date.now();
                      xi = xmax;
                      yi = ymax;
                    }
                  }
                }
              }
            }
            else{
              unit.target = false;
              let minDistance = unit.aggroRange+1;
              let target;
              xmin = Math.max(0,unit.x-unit.aggroRange);
              xmax = Math.min(gridSquareWidth-1,unit.x+unit.aggroRange);
              ymin = Math.max(0,unit.y-unit.aggroRange);
              ymax = Math.min(gridSquareHeight-1,unit.y+unit.aggroRange);
              for(let yi = ymin; yi<ymax; yi++){ //on parcourt le carré ayant pour côté le rayon d'attaque de l'unité
                for(let xi = xmin; xi<xmax; xi++){
                  if(matrice_unites[yi][xi] && matrice_unites[yi][xi][0]==1){ //si l'unité parcourue est l'unité ciblée
                    target = liste_unites[matrice_unites[yi][xi][1]];
                    if(target!=unit && target.speed>0 && target.owner==unit.owner && target.health<target.maxHealth+1 && distance(unit.x,unit.y,target.x,target.y)<minDistance){
                      unit.target = target;
                      minDistance = distance(unit.x,unit.y,unit.target.x,unit.target.y);
                    }
                  }
                }
              }
              if(unit.target){
              unit.follow=true;
              }
            }
          }
        }
        else if(Date.now()-lastHeal>=unit.attackSpeed*1000){
          canHeal = true;
        }
      },10);
    }

    heal(unit){
      unit.getHealed(this.healAmount);
    }

  }
  
  
  // Archer
  class UniteArcher extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/archer.png",square_size,square_size], 250, 60, "ranged", 15, 1.5, 10, 8, "player", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.level = 1;
      this.checkUpgrades();
    }

    checkUpgrades(){
      let up = upgradesAtelier[2];
      while(up>this.level){
        console.log("+portee,+projspeed",up);
        this.aggroRange+=1;
        this.attackRange+=1;
        this.projectileSpeed+=165;
        up--;
      }
      this.level = upgradesAtelier[2];
    }
  }

  // Géant
  class UniteGeant extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/soldat.png",square_size*3,square_size*3], 200, 250, "melee", 25, 2, 10, 2, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.level = [0,0];
      this.checkUpgrades();
    }

    attack(unit){
      if(this.target.speed>0){
        this.target.takeDamage(this.damage);
      }
      else{
        this.target.takeDamage(Math.round(1.5*this.damage)); //si la cible est un bâtiment, alors dégâts x1.5
      }
    }

    checkUpgrades(){
      //Dégâts
      let n = 0;
      let up = upgradesAtelier[n];
      while(up>this.level[0]){
        console.log("+degats",up);
        this.damage+=5;
        up--;
      }
      this.level[0] = upgradesAtelier[n];

      //Speed et PV
      n=1;
      up = upgradesAtelier[n];
      while(up>this.level[1]){
        console.log("+speed, +pv",up);
        this.speed+=20;
        let ratio = this.health/this.maxHealth;
        this.maxHealth+=25;
        this.health=Math.round(ratio*this.maxHealth);
        this.updateHpBar();
        up--;
      }
      this.level[1] = upgradesAtelier[n];
    }
  }
  
  
  // Lanceur de glaives
  class UniteLanceur extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/archer.png",square_size,square_size], 250, 60, "ranged", 20, 2, 10, 8, "player", false, 800, ["./img/projectile_magique.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.level = 1;
      this.checkUpgrades();
    }

    attack(unit){
      new Glaive(this.x,this.y,unit.x,unit.y,this.projectileSpeed,this.projectileImage, this);
    }

    checkUpgrades(){
      let up = upgradesAtelier[2];
      while(up>this.level){
        console.log("+portee,+projspeed",up);
        this.aggroRange+=1;
        this.attackRange+=1;
        this.projectileSpeed+=135;
        up--;
      }
      this.level = upgradesAtelier[2];
    }
  }

  // Cavalier
  class UniteCavalier extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/soldat.png",square_size,square_size], 350, 120, "melee", 15, 1.5, 10, 1, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.level = [0,0];
      this.checkUpgrades();
    }

    checkUpgrades(){
      //Dégâts
      let n = 0;
      let up = upgradesAtelier[n];
      while(up>this.level[0]){
        console.log("+degats",up);
        this.damage+=3;
        up--;
      }
      this.level[0] = upgradesAtelier[n];

      //Speed et PV
      n=1;
      up = upgradesAtelier[n];
      while(up>this.level[1]){
        console.log("+speed, +pv",up);
        this.speed+=20;
        let ratio = this.health/this.maxHealth;
        this.maxHealth+=10;
        this.health=Math.round(ratio*this.maxHealth);
        this.updateHpBar();
        up--;
      }
      this.level[1] = upgradesAtelier[n];
    }
  }
  
  
  // Caserne
  class UniteCaserne extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/caserne.png",square_size*3,square_size*3], 0, 800, "melee", 0, 0, 0, 0, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  
    spawnSoldat(){
      let goldCost = 0;
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
  
    spawnSoigneur(){
      let goldCost = 0;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.spawnUnit(new UniteSoigneur(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }
  
    spawnGeant(){
      let goldCost = 0;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.spawnUnit(new UniteGeant(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }
  
    spawnLanceur(){
      let goldCost = 0;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.spawnUnit(new UniteLanceur(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }
  
    spawnCavalier(){
      let goldCost = 0;
      let manaCost = 0;
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        this.spawnUnit(new UniteCavalier(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv),goldCost,manaCost);
      }
      else{
        console.log("Pas assez de ressources");
      }
    }
  
    setButtons(){
      let unit = this;
      let levelHdv = tierHdv();
      changeButton(1,"./img/soldat.png",function(event){unit.spawnSoldat()});
      changeButton(2,"./img/archer.png",function(event){unit.spawnArcher()});
      if(levelHdv>=1){
        changeButton(3,"./img/mage.png",function(event){unit.spawnSoigneur()});
        changeButton(4,"./img/soldat.png",function(event){unit.spawnCavalier()});
      }
      if(levelHdv>=2){
        changeButton(5,"./img/soldat.png",function(event){unit.spawnGeant()});
        changeButton(6,"./img/archer.png",function(event){unit.spawnLanceur()});
      }
    }
  }

  // Hôtel de ville
  class UniteHotelDeVille extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/hdv.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.liste_hdv.push(this);
      this.level = 0;
      this.upgradeCosts = [[0, 0], [0, 0]];
    }

    upgrade(){
      let goldCost = this.upgradeCosts[this.level][0];
      let manaCost = this.upgradeCosts[this.level][1];
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        modifyGold(-goldCost);
        modifyMana(-manaCost);
        let ratio = this.health/this.maxHealth;
        this.maxHealth+=500;
        this.health=Math.round(ratio*this.maxHealth);
        this.updateHpBar();
        this.level++;
        console.log("upgrade",this.level)
        if(this.level==this.upgradeCosts.length){
          changeButton(9);
        }
      }
      else{
        console.log("Pas assez de ressources");
      }
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
      if(this.level<this.upgradeCosts.length){
        changeButton(9,"./img/hdv.png",function(event){unit.upgrade()});
      }
      else{
        changeButton(9);
      }
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
      super(x, y, {"radius":1, "type":"square"}, ["./img/tower.png",square_size*3,square_size*3], 0, 600, "ranged", 15, 1.75, 10, 10, "player", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.upgrades = [false, false, false];
      this.upgradesHdv = [1, 1, 2];
      this.upgradeCosts = [[0, 0], [0, 0], [0, 0]];
    }

    upgrade(n){
      let goldCost = this.upgradeCosts[n][0];
      let manaCost = this.upgradeCosts[n][1];
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        modifyGold(-goldCost);
        modifyMana(-manaCost);
        this.upgrades[n]=true;
        console.log("upgrade",n,this.upgrades)
        changeButton(7+n);
        switch(n){
          case 0:
            console.log("+degats");
            this.damage+=5;
            break;
          case 1:
            console.log("+attack speed",this.attackSpeed);
            this.attackSpeed-=0.3;
            break;
          case 2:
            console.log("+portee +proj speed");
            this.aggroRange+=2;
            this.attackRange+=2;
            this.projectileSpeed+=300;
            break;
        }
      }
      else{
        console.log("Pas assez de ressources");
      }
    }
  
    setButtons(){
      let unit = this;
      let levelHdv = tierHdv();
      for(let n = 0; n<3; n++){
        if(!this.upgrades[n] && levelHdv>=this.upgradesHdv[n]){
          changeButton(7+n,"./img/tower.png",function(event){unit.upgrade(n)});
        }
        else{
          changeButton(7+n);
        }
      } 
    }
  }

  // Atelier de recherche
  class UniteAtelier extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/ennemieUpgrade.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "player", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
      this.upgrades = upgradesAtelier;
      this.upgradeImages = ["./img/soldat.png","./img/soldat.png","./img/archer.png"];
      this.upgradeCosts = [[0, 0], [0, 0], [0, 0]];
    }

    upgrade(n){
      let goldCost = this.upgradeCosts[n][0];
      let manaCost = this.upgradeCosts[n][1];
      if(checkResources(goldCost,manaCost)){ //si le joueur a assez de ressources
        modifyGold(-goldCost);
        modifyMana(-manaCost);
        this.upgrades[n]++;
        console.log("upgrade",n,this.upgrades)
        this.setUpgradeButton(n);
        switch(n){
          case 0:
            console.log("+degats soldat");
            this.damage+=5;
            break;
          case 1:
            console.log("+speed +pv soldat",this.attackSpeed);
            this.attackSpeed-=0.3;
            break;
          case 2:
            console.log("+portee +proj speed archer");
            this.aggroRange+=2;
            this.attackRange+=2;
            this.projectileSpeed+=300;
            break;
        }
        upgradeUnits("player");
      }
      else{
        console.log("Pas assez de ressources");
      }
    }

    setUpgradeButton(n,levelHdv=tierHdv()){
      let unit = this;
      if(this.upgrades[n]<3 && levelHdv>=this.upgrades[n]){
        changeButton(1+n,this.upgradeImages[n],function(event){unit.upgrade(n)});
      }
      else{
        changeButton(1+n);
      }
    }
  
    setButtons(){
      let levelHdv = tierHdv();
      for(let n = 0; n<this.upgrades.length; n++){
        console.log(this.upgrades)
        this.setUpgradeButton(n,levelHdv);
      } 
    }
  }
  
  
  // Ennemis
  
  
  // Ennemi 0
  class UniteEnnemi0 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie0.png",square_size,square_size], 250, 100, "melee", 15, 1.2, 10, 1, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 1
  class UniteEnnemi1 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie1.png",square_size,square_size], 250, 100, "melee", 15, 1.2, 10, 1, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 10
  class UniteEnnemi10 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie10.png",square_size,square_size], 250, 60, "ranged", 25, 2, 10, 8, "enemy", false, 400, ["./img/projectile_magique.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 11
  class UniteEnnemi11 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie11.png",square_size,square_size], 250, 60, "ranged", 15, 1.75, 10, 8, "enemy", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 20
  class UniteEnnemi20 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie20.png",square_size,square_size], 250, 150, "melee", 10, 1.2, 10, 1, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  
  // Ennemi 21
  class UniteEnnemi21 extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":0, "type":"square"}, ["./img/ennemie21.png",square_size,square_size], 250, 150, "melee", 10, 1.2, 10, 1, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
  
  // Base Ennemie
  class UniteBaseEnnemie extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/ennemieBase.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }

    upgrade(){
      let ratio = this.health/this.maxHealth;
      this.maxHealth+=500;
      this.health=Math.round(ratio*this.maxHealth);
      this.updateHpBar();
    }

    spawnRandEnemy(){
      var rand = Math.floor(Math.random() * 6);
      let unit = false;
      switch(rand){
        case 0: // ennemie0 cac
            unit = new UniteEnnemi0(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv);
            break;
        case 1: // ennemie1 cac
            unit = new UniteEnnemi1(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv);
            break;
        case 2: // ennemie10 distance
            unit = new UniteEnnemi10(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv);
            break;
        case 3: // ennemie11 distance
            unit = new UniteEnnemi11(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv);
            break;
        case 4: // ennemie20 tank
            unit = new UniteEnnemi20(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv);
            break;
        case 5: // ennemie21 tank
            unit = new UniteEnnemi21(null,null,this.liste_unites,this.gridContainer,this.square_size,this.gridLeft,this.gridTop,this.goldCollection,this.manaCollection,this.liste_hdv);
            break;
      }
      this.spawnUnit(unit);
      return unit;
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
      super(x, y, {"radius":1, "type":"square"}, ["./img/tower.png",square_size*3,square_size*3], 0, 600, "ranged", 15, 1.75, 10, 10, "enemy", false, 600, ["./img/arrow.png", square_size/2, square_size/2], false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }

    upgrade(n){
      switch(n){
        case 0:
          console.log("+degats");
          this.damage+=5;
          break;
        case 1:
          console.log("+attack speed",this.attackSpeed);
          this.attackSpeed-=0.3;
          break;
        case 2:
          console.log("+portee +proj speed");
          this.aggroRange+=2;
          this.attackRange+=2;
          this.projectileSpeed+=300;
          break;
      }
    }
  }
  
  // Atelier Ennemie
  class UniteAtelierEnnemi extends Unite {
    constructor(x = null, y = null,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv) {
      super(x, y, {"radius":1, "type":"square"}, ["./img/ennemieUpgrade.png",square_size*3,square_size*3], 0, 1000, "melee", 0, 0, 0, 0, "enemy", false, 0, null, false,liste_unites,gridContainer,square_size,gridLeft,gridTop,goldCollection,manaCollection,liste_hdv);
    }
  }
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
      shooter.gridContainer.appendChild(this.imageDiv);
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
      this.move();
    }
      
    rotate(){
      // Calcul de l'angle de rotation
      var deltaX = (this.endX * square_size) - (this.startX * square_size);
      var deltaY = (this.endY * square_size) - (this.startY * square_size);
      return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    }
      
    move(){
      console.log("ngbrevjui")
      this.angleInDegrees = this.rotate();
      // Le projectile s'oriente vers l'emplacement ciblé
      this.imageDiv.style.transform = 'rotate(' + this.angleInDegrees + 'deg)';
    
      // Déplacement du projectile
      this.imageDiv.style.animation = 'move.imageDiv 1s forwards';
      this.imageDiv.animate([
        { transform: 'translate('+(this.startX*square_size)+'px,'+(this.startY*square_size)+'px) rotate(' + this.angleInDegrees + 'deg)' },
        { transform: 'translate('+(this.endX*square_size)+'px,'+(this.endY*square_size)+'px) rotate(' + this.angleInDegrees + 'deg)' }
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
        proj.deleteProjectile();
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


  // Glaive rebondissant
  class Glaive extends Projectile {
    constructor(startX = null, startY = null, endX = null, endY = null, speed = 500, image = ["", square_size, square_size], shooter = null){
      super(startX, startY, endX, endY, speed, image, shooter);
    }
      
    move(){
      console.log("glaive")
      let i = 0;
      let targets = [];
      let proj = this;
      let glaiveInterval = setInterval(function(){
        console.log("start",proj.startX,proj.startY,"end",proj.endX,proj.endY)
        proj.angleInDegrees = proj.rotate();
        // Le projectile s'oriente vers l'emplacement ciblé
        proj.imageDiv.style.transform = 'rotate(' + proj.angleInDegrees + 'deg)';
      
        // Déplacement du projectile
        console.log("yfezhru")
        proj.imageDiv.style.animation = 'move.imageDiv 1s forwards';
        proj.imageDiv.animate([
          { transform: 'translate('+(proj.startX*square_size)+'px,'+(proj.startY*square_size)+'px) rotate(' + proj.angleInDegrees + 'deg)' },
          { transform: 'translate('+(proj.endX*square_size)+'px,'+(proj.endY*square_size)+'px) rotate(' + proj.angleInDegrees + 'deg)' }
        ], {
          duration: proj.speed*10,
          fill: "forwards"
        });
      
        proj.imageDiv.style.animation = 'none';
      
        // Une fois le projectile arrivé à destination
        setTimeout(function() {
          // Si le projectile atterit sur une case avec une unité de la faction adverse ou celle de la cible
          if(matrice_unites[proj.endY][proj.endX] && matrice_unites[proj.endY][proj.endX][0]==1 && liste_unites[matrice_unites[proj.endY][proj.endX][1]]!=proj.shooter && (liste_unites[matrice_unites[proj.endY][proj.endX][1]].owner!=proj.shooter.owner || liste_unites[matrice_unites[proj.endY][proj.endX][1]].owner==proj.shooter.target.owner)){
            liste_unites[matrice_unites[proj.endY][proj.endX][1]].takeDamage(proj.shooter.damage);
            targets.push(liste_unites[matrice_unites[proj.endY][proj.endX][1]]); //on retient la cible
            console.log("hit")
            i++;
            if(i==2){
              console.log("no bounce")
              proj.deleteProjectile();
              clearInterval(glaiveInterval);
            }
            else{
              let endXmin = null;
              let endYmin = null;
              let dist = 100;
              let radius = 30;
              for(let xi = proj.endX-radius;xi<=proj.endX+radius;xi++){
                for(let yi = proj.endY-radius;yi<=proj.endY+radius;yi++){
                  //s'il y a une unité autre que le tireur et différente des cibles précedentes sur la case
                  if(matrice_unites[yi][xi] && matrice_unites[yi][xi][0]==1 && liste_unites[matrice_unites[yi][xi][1]]!=proj.shooter && !targets.includes(liste_unites[matrice_unites[yi][xi][1]]) && liste_unites[matrice_unites[yi][xi][1]].constructor.name!="UniteTotem"){
                    let target = liste_unites[matrice_unites[yi][xi][1]];
                    if(distance(proj.endX,proj.endY,target.x,target.y)<dist){
                      dist = distance(proj.endX,proj.endY,target.x,target.y);
                      endXmin = xi;
                      endYmin = yi;
                    }
                  }
                }
              }
              proj.startX = proj.endX;
              proj.startY = proj.endY;
              proj.endX = endXmin;
              proj.endY = endYmin;
              if(proj.endX==null){ // si on n'a pas trouvé de cible le glaive arrête de rebondir
                proj.deleteProjectile();
                clearInterval(glaiveInterval);
              }
            }
            i++;
          }
          else{
            if(proj){
              proj.deleteProjectile();
              clearInterval(glaiveInterval);
            }
          }
        }, proj.speed*10);
      }, proj.speed*10);
    }
  }
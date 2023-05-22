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
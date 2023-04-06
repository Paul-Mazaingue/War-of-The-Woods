class Zone {
    constructor(x, y, w, h, c) {
        this.zonex = 1200;
        this.zoney = 1300;
        this.zoneWidth = 100;
        this.zoneHeight = 100;
        
        this.redSquare = document.getElementById('red-square');
        this.zone0 = document.getElementById('zone-0');
        this.redSquareBounds = this.redSquare.getBoundingClientRect();
        redSquare.style.left = this.zonex + 'px';
        redSquare.style.top = this.zoney + 'px';
    }
    
    helicoInZone(helicoptere) {
        if (helicoptere.x+(this.zoneWidth/2) >= this.zonex && 
        helicoptere.x+(this.zoneWidth/2) <= this.zonex+this.zoneWidth &&
        helicoptere.y+(this.zoneHeight/2) >= this.zoney &&
        helicoptere.y+(this.zoneHeight/2)<= this.zoney+this.zoneHeight) {
            showZone(true);
            console.log("L'hélicoptère a atterri dans le carré rouge.");
        }
    }

}
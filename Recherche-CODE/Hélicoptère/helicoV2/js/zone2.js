class Zone {
    constructor(zonex, zoney, zoneWidth, zoneHeight) {
        this.zonex = 1200;
        this.zoney = 1300;
        this.zoneWidth = 100;
        this.zoneHeight = 100;
        
        this.redSquare = document.getElementById('red-square');
        this.information = document.getElementById('zone-0');
        this.redSquareBounds = this.redSquare.getBoundingClientRect();
        this.redSquare.style.left = this.zonex + 'px';
        this.redSquare.style.top = this.zoney + 'px';
    }
    
    helicoInZone(helicoptere) {
        if (helicoptere.x+(this.zoneWidth/2) >= this.zonex && 
        helicoptere.x+(this.zoneWidth/2) <= this.zonex+this.zoneWidth &&
        helicoptere.y+(this.zoneHeight/2) >= this.zoney &&
        helicoptere.y+(this.zoneHeight/2)<= this.zoney+this.zoneHeight) {
            return true;
        }
        return false;
    }

    showInformation(helicoptere) { 
        this.information.style.display = this.helicoInZone(helicoptere) ? 'block' : 'none';
    }

}
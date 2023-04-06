class Zone {
    constructor(id, zonex, zoney, zoneWidth, zoneHeight, title, description, img, url) {
        this.zonex = zonex;
        this.zoney = zoney;
        this.zoneWidth = zoneWidth;
        this.zoneHeight = zoneHeight;
        this.title = title;
        this.description = description;
        this.img = img;
        this.id = id;
        this.url = url; 
        
        this.createZone(id,title,description,img);

        this.information = document.getElementById('zone'+id+'_information');
    }

    createZone(id,title,description,img) {
        // On récupère l'élément "zone" dans lequel on va ajouter la zone
        let zones = document.getElementById("zone");

        // Créer un nouvel élément div avec la classe "zone" et l'id "zone" + id
        let newZone = document.createElement("div");
        newZone.className = "zone";
        newZone.id = "zone" + id;
        
        newZone.style.left = this.zonex + 'px';
        newZone.style.top = this.zoney + 'px';

        // Ajouter les éléments enfants nécessaires à la zone
        // Ajoute la bordure
        let border = document.createElement("div");
        border.className = "border";
        newZone.appendChild(border);

        // ajoute la zone d'information
        let zone_information = document.createElement("div");
        zone_information.id = "zone" + id + "_information";
        zone_information.className = "zone_information";
        
        // Ajoute l'image
        let image = document.createElement("img");
        image.className = "image";
        image.src = img;
        
        // Ajoute le titre
        let h2 = document.createElement("h2");
        h2.textContent = title;
        
        // Ajoute la description
        let p = document.createElement("p");
        p.textContent = description;
        
        // Ajoute les éléments enfants à la zone d'information
        zone_information.appendChild(image);
        zone_information.appendChild(h2);
        zone_information.appendChild(p);

        // Ajoute la zone d'information à la zone
        newZone.appendChild(zone_information);

        // Ajoute la zone à la page
        zones.appendChild(newZone);
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
class Load {
    constructor(unitElement, lifeDead, spawnPoints, size, totems) {
        this.unitElement = unitElement;
        this.lifeDead = lifeDead;
        this.spawnPoints = spawnPoints;
        this.size = size;
        this.totems = totems;
    }

    load() {
        const now = Date.now();
        for (let y = 0; y < this.unitElement.length; y++) {
            for (let x = 0; x < this.unitElement[0].length; x++) {
                if([2, 3, 4, 5, 6, 7].includes(this.unitElement[y][x])) {

                    switch (this.unitElement[y][x]) {
                        case 2:
                            this.checkGrid(this.unitElement, x, y, 3, 2, 100);
                            this.suppressArround(this.unitElement, x, y, 50, 2, 0);
                            break;
                        // Other cases...
                    }
                }
            }
        }
        console.log("temps d'éxécution load : " + (Date.now() - now) + "ms");
    }

    checkGrid(matrice, x, y, size, valueSearch, valueReplace) {
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                if(matrice[y + i][x + j] != valueSearch) {
                    return false;
                }
            }
        }
        
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                matrice[y + i][x + j] = valueReplace;
            }
        }
        return true;
        
    }

    suppressArround(matrice, x, y, size, valueSearch, valueReplace) {
        size = x-size < 0 ? x-1 : size;
        size = y-size < 0 ? y-1 : size;
        size = x+size >= matrice[0].length ? matrice[0].length-x-1 : size;
        size = y+size >= matrice.length ? matrice.length-y-1 : size;

        for( let i = -size; i <= size; i++) {
            for(let j = -size; j <= size; j++) {
                if(matrice[y + i][x + j] == valueSearch) {
                    matrice[y + i][x + j] = valueReplace;
                }
            }
        }
    }
}

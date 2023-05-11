class Load {
    constructor(unitElement, lifeDead, spawnPoints, size, totems) {
        this.unitElement = unitElement;
        this.lifeDead = lifeDead;
        this.spawnPoints = spawnPoints;
        this.size = size;
        this.totems = totems;
    }

    static totemConfig = [[
        [0  , 0  , 200, 0  , 0],
        [0  , 101, 101, 101, 0],
        [200, 101, 101, 101, 200],
        [0  , 101, 101, 101, 0],
        [0  , 0  , 200, 0  , 0]],

        [
        [201  , 0  , 200, 0  , 201],
        [0  , 101, 101, 101, 0],
        [200, 101, 101, 101, 200],
        [0  , 101, 101, 101, 0],
        [201  , 0  , 200, 0  , 201]],

        [
        [0  , 0  , 200  , 0  , 0],
        [0  , 101, 101, 101, 0],
        [202  , 101, 101, 101, 202],
        [0  , 101, 101, 101, 0],
        [0  , 0  , 200  , 0  , 0]]
    ];

    static EnnemieConfig = [[
        [0  , 0  , 0  , 0  , 0  , 0, 0],
        [0  , 0  , 200  , 200  , 0  , 0, 0],
        [0  , 200  , 300, 300  , 200  , 0, 0],
        [0  , 200  , 300, 300  , 200  , 0, 0],
        [0  , 0  , 200  , 200  , 0  , 0, 0],
        [0  , 0  , 0  , 0  , 0  , 0, 0],
        [0  , 0  , 0  , 0  , 0  , 0, 0]],

        [
        [300, 300, 0  , 202, 0  , 300, 300],
        [300, 300, 0  , 0  , 0  , 300, 300],
        [0  , 0  , 200, 0  , 200, 0  , 0  ],
        [202, 0  , 0  , 201, 0  , 0  , 202],
        [0  , 0  , 200, 0  , 200, 0  , 0  ],
        [300, 300, 0  , 0  , 0  , 300, 300],
        [300, 300, 0  , 202, 0  , 300, 300]],

        [
        [0  , 0  , 0  , 0  , 0  , 0  , 0],
        [0  , 200, 0  , 200, 0  , 200, 0],
        [0  , 0  , 201, 0  , 201, 0  , 0],
        [0  , 200, 0  , 202, 0  , 200, 0],
        [0  , 0  , 201, 0  , 201, 0  , 0],
        [0  , 200, 0  , 200, 0  , 200, 0],
        [0  , 0  , 0  , 0  , 0  , 0  , 0]],

        [
        [202  , 0  , 200, 0  , 200  , 0, 0],
        [0  , 0  , 201, 0  , 0  , 202, 0],
        [200  , 0  , 300, 300  , 201  , 0, 0],
        [0  , 201  , 300, 300  , 0  , 200, 0],
        [202  , 0  , 0, 201  , 0  , 0, 0],
        [0  , 200  , 0, 200  , 0  , 202, 0],
        [0  , 0  , 0, 0  , 0  , 0, 0]],
        
        [
        [0  , 0  , 0, 0  , 0  , 0, 0],
        [0  , 200  , 0, 0  , 200  , 0, 0],
        [0  , 0  , 300, 300  , 0  , 0, 0],
        [0  , 0  , 300, 300  , 0  , 0, 0],
        [0  , 200  , 0, 0  , 200  , 0, 0],
        [0  , 0  , 0, 0  , 0  , 0, 0],
        [0  , 0  , 0, 0  , 0  , 0, 0]],

        [
        [300  , 300  , 200, 0  , 0  , 0, 0],
        [300  , 300  , 0, 200  , 0  , 0, 0],
        [200  , 0  , 201, 0  , 200  , 0, 0],
        [0  , 200  , 0, 201  , 0  , 200, 0],
        [0  , 0  , 200, 0  , 201  , 0, 200],
        [0  , 0  , 0, 200  , 0  , 300, 300],
        [0  , 0  , 0, 0  , 200  , 300, 300]],
    ];

    static mineConfig = [[
        [0  , 0  , 200, 0  , 0],
        [0  , 100, 100, 100, 0],
        [200, 100, 100, 100, 200],
        [0  , 100, 100, 100, 0],
        [0  , 0  , 200, 0  , 0]],

        [
        [201  , 0  , 200, 0  , 201],
        [0  , 100, 100, 100, 0],
        [200, 100, 100, 100, 200],
        [0  , 100, 100, 100, 0],
        [201  , 0  , 200, 0  , 201]],

        [
        [0  , 0  , 200  , 0  , 0],
        [0  , 100, 100, 100, 0],
        [202  , 100, 100, 100, 202],
        [0  , 100, 100, 100, 0],
        [0  , 0  , 200  , 0  , 0]]
    ];


    
    static ennemiesCac = [200, 201];
    static ennemiesDist = [210, 211];
    static ennemiesTank = [220, 221];

    load() {
        const now = Date.now();
        for (let y = 0; y < this.unitElement.length; y++) {
            for (let x = 0; x < this.unitElement[0].length; x++) {
                if([2,6,7].includes(this.unitElement[y][x])) {

                    switch (this.unitElement[y][x]) {
                        case 2:
                            this.placeMines(x, y);
                            break; 
                        case 6:
                            this.placetotem(x, y);
                            break;
                        case 7:
                            this.placeEnnemies(x, y);
                            break;

                    }
                }
            }
        }
        console.log("temps d'éxécution load : " + (Date.now() - now) + "ms");
    }

    placetotem(x, y) {
        const config = Math.round(Math.random() * (Load.totemConfig.length - 1));
        for (let i = 0; i < Load.totemConfig[0].length; i++) {
            for (let j = 0; j < Load.totemConfig[0].length; j++) {
                let value = Load.totemConfig[config][i][j];
                if(value == 200) {
                    value = Load.ennemiesCac[Math.round(Math.random() * (Load.ennemiesCac.length - 1))];  
                }
                else if(value == 201) {
                    value = Load.ennemiesDist[Math.round(Math.random() * (Load.ennemiesDist.length - 1))];  
                }
                else if(value == 202) {
                    value = Load.ennemiesTank[Math.round(Math.random() * (Load.ennemiesTank.length - 1))];  
                }
                this.unitElement[y+i][x+j] = value;
            }
        }
    }

    placeEnnemies(x,y) {

        let config = Math.round(Math.random() * (Load.EnnemieConfig.length - 1));
        for (let i = 0; i < Load.EnnemieConfig[0].length; i++) {
            for (let j = 0; j < Load.EnnemieConfig[0].length; j++) {
                let value = Load.EnnemieConfig[config][i][j];
                if(value == 200) {
                    value = Load.ennemiesCac[Math.round(Math.random() * (Load.ennemiesCac.length - 1))];  
                }
                else if(value == 201) {
                    value = Load.ennemiesDist[Math.round(Math.random() * (Load.ennemiesDist.length - 1))];  
                }
                else if(value == 202) {
                    value = Load.ennemiesTank[Math.round(Math.random() * (Load.ennemiesTank.length - 1))];  
                }
                this.unitElement[y+i][x+j] = value;
            }
        }

    }

    placeMines(x, y) {
        const config = Math.round(Math.random() * (Load.mineConfig.length - 1));
        for (let i = 0; i < Load.mineConfig[0].length; i++) {
            for (let j = 0; j < Load.mineConfig[0].length; j++) {
                let value = Load.mineConfig[config][i][j];
                if(value == 200) {
                    value = Load.ennemiesCac[Math.round(Math.random() * (Load.ennemiesCac.length - 1))];  
                }
                else if(value == 201) {
                    value = Load.ennemiesDist[Math.round(Math.random() * (Load.ennemiesDist.length - 1))];  
                }
                else if(value == 202) {
                    value = Load.ennemiesTank[Math.round(Math.random() * (Load.ennemiesTank.length - 1))];  
                }
                this.unitElement[y+i][x+j] = value;
            }
        }


    }
}

/**
 * Permet de dessiner une matrice
 * 
 * @param {*} matrice Matrice à dessiner
 * @param {*} pixelSize Taille de chaque case en pixels
 */
function drawMap(matrice, pixelSize = 1) {

    return new Promise((resolve, reject) => {

        const now = Date.now();
        // Création d'un canvas 
        const canvas = document.createElement("canvas");
        canvas.width = matrice[0].length * pixelSize;
        canvas.height = matrice.length * pixelSize;
        canvas.id = "mapCanvas";
        const ctx = canvas.getContext("2d");

        // Images de l'arbre
        const treeImages = ['img/tree1.png', 'img/tree2.png', 'img/tree3.png'].map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        // Image de la mine
        const mineImg = new Image();
        mineImg.src = 'img/mine.png';

        const dirtImg = new Image();
        dirtImg.src = 'img/dirt.png';

        const totemImg = new Image();
        totemImg.src = 'img/totem.png';

        const ennemie0Img = new Image();
        ennemie0Img.src = 'img/ennemie0.png';

        const ennemie1Img = new Image();
        ennemie1Img.src = 'img/ennemie1.png';

        const ennemie10Img = new Image();
        ennemie10Img.src = 'img/ennemie10.png';

        const ennemie11Img = new Image();
        ennemie11Img.src = 'img/ennemie11.png';

        const ennemie20Img = new Image();
        ennemie20Img.src = 'img/ennemie20.png';

        const ennemie21Img = new Image();
        ennemie21Img.src = 'img/ennemie21.png';

        const towerImg = new Image();
        towerImg.src = 'img/tower.png';

        const peasantImg = new Image();
        peasantImg.src = 'img/peasant.png';

        const playerBaseImg = new Image();
        playerBaseImg.src = 'img/playerBase.png';

        const ennemieBaseImg = new Image();
        ennemieBaseImg.src = 'img/ennemieBase.png';

        const ennemieUpgradeImg = new Image();
        ennemieUpgradeImg.src = 'img/ennemieUpgrade.png';

        const ennemieBarrakImg = new Image();
        ennemieBarrakImg.src = 'img/ennemieBarrak.png';

        Promise.all([...treeImages, mineImg, dirtImg, totemImg, ennemie0Img, ennemie1Img, ennemie10Img, ennemie11Img, ennemie20Img, ennemie21Img, towerImg, peasantImg, playerBaseImg, ennemieBaseImg, ennemieUpgradeImg,ennemieBarrakImg].map(img => new Promise(resolve => img.onload = resolve)))
            .then(() => {
                // On colorie chaque case de la matrice en fonction de sa valeur
                for (let y = 0; y < matrice.length; y++) {
                    for (let x = 0; x < matrice[0].length; x++) {
                        const value = matrice[y][x];

                        // différent cas pour chaque valeur
                        switch (value) { 
                            case -1:
                                ctx.fillStyle = "blue";ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                                break;
                            case 0:
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                continue
                                break;
                            case 1:
                                // On dessine une image de l'arbre aléatoire
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                const treeImg = treeImages[Math.floor(Math.random() * treeImages.length)];
                                ctx.drawImage(treeImg, x * pixelSize, (y * pixelSize) - (pixelSize * 0.5), pixelSize, pixelSize * 1.5);
                                continue; // Passe à la prochaine itération
                            case 2:
                                ctx.fillStyle = "yellow";
                                break;
                            case 3:
                                ctx.fillStyle = "red";
                                break;
                            case 4:
                                ctx.fillStyle = "white";
                                break;
                            case 5:
                                ctx.fillStyle = "orange";
                                break;
                            case 6:
                                ctx.fillStyle = "grey";
                                break;
                            case 7:
                                ctx.fillStyle = "black";
                                break;
                            /*
                            case 100:
                                if(matrice[y+1][x] != 100 && matrice[y][x+1] != 100) {
                                    // On dessine l'image de la mine
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    ctx.drawImage(mineImg, (x-2) * pixelSize, (y-2) * pixelSize, pixelSize*3, pixelSize*3);
                                    continue; // Passe à la prochaine itération
                                }
                                else {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    continue;
                                }
                                break;
                            case 101:
                                if(matrice[y+1][x] != 101 && matrice[y][x+1] != 101) {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    ctx.drawImage(totemImg, (x-2) * pixelSize, (y-2) * pixelSize, pixelSize*3, pixelSize*3);
                                    continue;
                                }
                                else {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    continue;
                                }
                                break;
                            case 200:
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                ctx.drawImage(ennemie0Img, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                continue;
                            case 201:
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                ctx.drawImage(ennemie1Img, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                continue;
                            case 210:
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                ctx.drawImage(ennemie10Img, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                continue;
                            case 211:
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                ctx.drawImage(ennemie11Img, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                continue;
                            case 220:
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                ctx.drawImage(ennemie20Img, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                continue;
                            case 221:
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                ctx.drawImage(ennemie21Img, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                continue;

                            case 300:
                                if(matrice[y+1][x] != 300 && matrice[y][x+1] != 300) {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    ctx.drawImage(towerImg, (x-2) * pixelSize, (y-2) * pixelSize, pixelSize*3, pixelSize*3);
                                    continue;
                                }
                                else {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    continue;
                                }
                            case 301:
                                if(matrice[y+1][x] != 301 && matrice[y][x+1] != 301) {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    ctx.drawImage(ennemieBaseImg, (x-3) * pixelSize, (y-3) * pixelSize, pixelSize*4, pixelSize*4);
                                    continue;
                                }
                                else {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    continue;
                                }
                            case 302:
                                if(matrice[y+1][x] != 302 && matrice[y][x+1] != 302) {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    ctx.drawImage(ennemieBarrakImg, (x-2) * pixelSize, (y-2) * pixelSize, pixelSize*3, pixelSize*3);
                                    continue;
                                }
                                else {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    continue;
                                }
                            case 303:
                                if(matrice[y+1][x] != 303 && matrice[y][x+1] != 303) {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    ctx.drawImage(ennemieUpgradeImg, (x-2) * pixelSize, (y-2) * pixelSize, pixelSize*3, pixelSize*3);
                                    continue;
                                }
                                else {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    continue;
                                }
                            case 400:
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                ctx.drawImage(peasantImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                continue;
                            case 500:
                                if(matrice[y+1][x] != 500 && matrice[y][x+1] != 500) {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    ctx.drawImage(playerBaseImg, (x-3) * pixelSize, (y-3) * pixelSize, pixelSize*4, pixelSize*4);
                                    continue;
                                }
                                else {
                                    ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                    continue;
                                }*/
                            default:
                                ctx.drawImage(dirtImg, (x) * pixelSize, (y) * pixelSize, pixelSize, pixelSize);
                                
                        }
                        
                        // On dessine le pixel
                        //ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    }
                }

                            // On ajoute le canvas à la page
                            const mapContainer = document.getElementById("map");
                            mapContainer.innerHTML = "";
                            mapContainer.appendChild(canvas);
                            console.log("temps d'éxécution dessins : " + (Date.now() - now) + "ms");


                            resolve();
                        })
                        .catch(err => {
                            // En cas d'erreur lors du chargement des images, rejeter la promesse avec l'erreur
                            reject(err);
                        });
                    });
                    
        }

        function changeVolume(value){
            volume = value;
        }

        function drawMiniMap() {
            // On dessine l'eau, les arbres et la terre
            for (let i = 0; i < matrixSize; i++) {
                for (let j = 0; j < matrixSize; j++) {
                    let x = i / matrixSize * minimapSize;
                    let y = j / matrixSize * minimapSize;
                    let pixelSize = minimapSize / matrixSize;

                    switch (mapLoader.unitElement[j][i]) {
                        case -1:
                            ctx.fillStyle = "blue";
                            break;
                        case 1:
                            ctx.fillStyle = 'green';
                            break;
                        default:
                        ctx.fillStyle = '#4A2C0B';
                            break;
                    }

                    ctx.fillRect(x, y, pixelSize, pixelSize);
                }
            }

            // on dessine les totems et les batiments alliées
            for (let i = 0; i < matrixSize; i++) {
                for (let j = 0; j < matrixSize; j++) {
                    let x = i / matrixSize * minimapSize;
                    let y = j / matrixSize * minimapSize;
                    let pixelSize = minimapSize / matrixSize;

                    if(mapLoader.unitElement[j][i] == 101 && mapLoader.unitElement[j-1][i] != 101 && mapLoader.unitElement[j][i-1] != 101) {
                        let circleRadius = 5 * pixelSize; // Taille du rayon en pixels
                        ctx.beginPath();
                        ctx.arc(x + pixelSize / 2, y + pixelSize / 2, circleRadius, 0, 2 * Math.PI, false);
                        // IL faut vérifier si le totem est en vie ou pas pour changer la couleur
                        if(Math.random() < 0.5) {
                            ctx.fillStyle = 'red';
                        } else {
                            ctx.fillStyle = 'black';
                        }
                        ctx.fill();
                    }

                    if (mapLoader.unitElement[j][i] >= 500 && mapLoader.unitElement[j][i] < 600) {
                        let squareSize = 5 * pixelSize; // Taille du carré en pixels
                        ctx.fillStyle = 'white';
                        ctx.fillRect(x, y, squareSize, squareSize);
                    }

                }
            }
        }


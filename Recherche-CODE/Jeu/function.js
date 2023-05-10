/**
 * Permet de dessiner une matrice
 * 
 * @param {*} matrice Matrice à dessiner
 * @param {*} pixelSize Taille de chaque case en pixels
 */
function drawMap(matrice, pixelSize = 1) {
    const now = Date.now();
    // Création d'un canvas 
    const canvas = document.createElement("canvas");
    canvas.width = matrice[0].length * pixelSize;
    canvas.height = matrice.length * pixelSize;
    canvas.id = "mapCanvas";
    const ctx = canvas.getContext("2d");

    // Images de l'arbre
    const treeImages = ['tree1.png', 'tree2.png', 'tree3.png'].map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });

    // Image de la mine
    const mineImg = new Image();
    mineImg.src = 'mine.png';

    const dirtImg = new Image();
    dirtImg.src = 'dirt2.png';

    Promise.all([...treeImages, mineImg, dirtImg].map(img => new Promise(resolve => img.onload = resolve)))
        .then(() => {
            // On colorie chaque case de la matrice en fonction de sa valeur
            for (let y = 0; y < matrice.length; y++) {
                for (let x = 0; x < matrice[0].length; x++) {
                    const value = matrice[y][x];

                    // différent cas pour chaque valeur
                    switch (value) { 
                        case -1:
                            ctx.fillStyle = "blue";
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
                            
                    }

                    // On dessine le pixel
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }

                        // On ajoute le canvas à la page
                        const mapContainer = document.getElementById("map");
                        mapContainer.innerHTML = "";
                        mapContainer.appendChild(canvas);
                        console.log("temps d'éxécution dessins : " + (Date.now() - now) + "ms");
                    });
            }
            
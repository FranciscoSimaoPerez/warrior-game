//Variáveis Globais
//Variável de funcionamento do jogo
var started = false;    //Variável para saber se o jogo já tiver começado
var pause = false;      //Variável para saber se o jogo está em pausa
//Variáveis do tempo
var segundos = "0" + 0;
var minutos = "0" + 0;
var horas = "0" + 0;
var dias = "0" + 0;//futura implementação para os viciados que ficam dias a jogar

// Sons do jogo
var lst = new Audio("sounds/lost.mp3"); // som de perder jogo
var bossMusic = new Audio("sounds/boss-fight.mp3"); // som de luta com boss

//Objetos do jogo
var player = {
    score: 0,
    lifes: 3, // vidas do jogador
    speed: 250, //velocidade do jogador, que neste caso será de 200 pixels por segundo 
    x: 60, //posição no eixo x(horizontal) inicial do jogador
    y: 60, //posição no eixo y(vertical) inicial do jogador
};

var enemy = {
    speed: 300,
    x: 200, //posição no eixo x(horizontal) inicial do inimigo
    y: 200 //posição no eixo y(vertical) inicial do inimigo
};

//Campo de jogo
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
//canvas.style.backgroundColor = '#558B2F';
gameContainer.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "assets/game-background.png";

// Avatar do jogador
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
    playerReady = true;
};
playerImage.src = "assets/player.png";

// Avatar do inimigo
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
    enemyReady = true;
};
enemyImage.src = "assets/enemy.png";

// Imagem de pausa
var pauseReady = false;
var pauseImage = new Image();
pauseImage.onload = function () {
    pauseReady = true;
};
pauseImage.src = "assets/pause.png";

// Imagem de pausa
var startReady = false;
var startImage = new Image();
startImage.onload = function () {
    startReady = true;
};
startImage.src = "assets/start.png";

// Imagem quando perde jogo
var lostReady = false;
var lostImage = new Image();
lostImage.onload = function () {
    lostReady = true;
};
lostImage.src = "assets/lost.png";

// Input do teclado
var keysDown = {}; //teclas pressionadas

// sem tecla pressionada
addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// tecla pressionada
addEventListener("keydown", function (e) {
    if (player.lifes != 0){
    e.preventDefault();
    keysDown[e.keyCode] = true;
}
else
        return true;
    
}, false);

// reset da posição do inimigo
var reset = function () {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    //Posição do Inimigo
    enemy.x = 32 + (Math.random() * (canvas.width - 64));
    enemy.y = 32 + (Math.random() * (canvas.height - 64));
}

// reset do jogador se tentar sair do canvas e perde 1 vida
var outOfBounds = function () {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.lifes--;
    if (player.lifes > 0){ 
        var eff = new Audio("sounds/effect.mp3"); // som ao perder vida
        eff.play();
    }
    if (player.lifes == 0){
        lst.play();
        bossMusic.pause(); // para a musica do boss ao perder as vidas
        bossMusic.currentTime = 0;
    }

}

/*
keycodes das setas do teclado:
    esquerda = 37
    cima = 38
    direita = 39
    baixo = 40
*/

//Movimento do jogador
/*modifier serve basicamente para fazer com que o jogador mexa sempre à mesma
velocidade independentemente a que velocidade o script está a ser executado*/
var playerMove = function (modifier) {
    if (!pause && player.lifes > 0 && started) {
        //movimento para esquerda
        if (37 in keysDown) {
            player.x -= player.speed * modifier;
        }
        //movimento para cima
        if (38 in keysDown) {
            player.y -= player.speed * modifier;
        }
        //movimento para direita
        if (39 in keysDown) {
            player.x += player.speed * modifier;
        }
        //movimento para baixo
        if (40 in keysDown) {
            player.y += player.speed * modifier;
        }
        
        // if(player.score >=10){
        //     enemy.x = Math.random() * canvas.width - 50;
        //     enemy.y = Math.random() * canvas.height - 50;
        // }

        //colisão do jogador com os inimigos
        if (player.x <= (enemy.x + 32) &&               //colisão à direita do inimigo
            player.y <= (enemy.y + 42) &&               //colisão acima do inimigo
            player.x >= (enemy.x - 32) &&               //colisão à esquerda do inimigo
            player.y >= (enemy.y - 42)) {               //colisão abaixo do inimigo
            player.score++; 
            if(player.score >= 10){
                player.speed = player.speed * 1.05;
                bgImage.src = "assets/game-boss-background.png";
                enemyImage.src="assets/boss.png"
                bossMusic.play();
            }
            var hit = new Audio("sounds/hit.mp3"); // som ao atingir inimigo
            hit.play();                            // ganha ponto
            //console.log("Score: " + player.score);
            reset();                                    //função que dá reset ao inimigo
        }
        //Colisões de limites
        else if (player.x >= canvas.width - 32 ||       //colisão no limite direito
            player.y >= canvas.height - 42 ||           //colisão no limite inferior
            player.y <= 0 ||                            //colisão no limite superior
            player.x <= 0) {                            //colisão no limite esquerdo
            outOfBounds();
        }
    }
};

// Criação do inimigo e jogador no canvas
// Toda a vez em que o jogador se mexe é feito o render da imagem de fundo, jogador e inimigo
var render = function () {
    //Desenha o fundo do jogo
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    //Desenha o jogador
    if (playerReady) {
        ctx.drawImage(playerImage, player.x, player.y);
    }
    //Desenha o inimigo
    if (enemyReady) {
        ctx.drawImage(enemyImage, enemy.x, enemy.y);
    }
    //Desenha o overlay de pausa
    if (pause) {
        ctx.drawImage(pauseImage, 0, 0);
    }
    //Desenha o overlay de start
    if (!started) {
        ctx.drawImage(startImage, 0, 0);
    }
    //Desenha o overlay de lost
    if(player.lifes==0){
        ctx.drawImage(lostImage, 0, 0);
    }
};

// Função principal do jogo
var main = function () {
    var now = Date.now();
    var delta = now - then;
    playerMove(delta / 1000);
    render();
    then = now;
    // Request to do this again ASAP
    requestAnimationFrame(main);
    displayLifes();
    document.getElementById("score").innerHTML = player.score;
    document.getElementById("scoreSubmit").innerHTML = player.score;
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// jogo
var then;
main();
clock();
//Botão Start
function startGame() {
    if (pause) {
        togglePause();
    } else if (started == false) {
        then = Date.now();
        reset();
        started = true;
    }
}
//Botão Pausa
//Função que ativa/desativa botão pausa
function togglePause() {
    if (started) {
        if (pause) {
            if(player.score >= 10){ // caso já estivesse na luta do boss continua a musica quando sair da pausa
                bossMusic.play();
            }
            pause = false;
        } else {
            bossMusic.pause(); // para a musica do boss
            pause = true;
        }
    }
}

//Botão Restart
function restart() {
    player.speed = 200;
    bgImage.src = "assets/game-background.png";
    enemyImage.src="assets/enemy.png"
    lst.pause(); // para a musica de lost game
    lst.currentTime = 0;
    bossMusic.pause(); // para a musica do boss
    bossMusic.currentTime = 0;
    started = false;
    pause = false;
    segundos = "0" + 0;
    minutos = "0" + 0;
    horas = "0" + 0;
    dias = "0" + 0;

    //reset do jogador
    player.score = 0;
    player.lifes = 3;

}

//Funções sobre o tempo
function clock() {
    window.setInterval(function () {
        if (!pause && started && player.lifes > 0) {                   // Caso não esteja em pausa relogio conta tempo
            segundos++;
            if (segundos < 10) {
                segundos = "0" + segundos;
            }
            if (segundos == 60) {
                segundos = "0" + 0;
                minutos++;
                if (minutos < 10) {
                    minutos = "0" + minutos;
                }
                if (minutos == 60) {
                    minutos = "0" + 0;
                    horas++;
                    if (horas < 10) {
                        horas = "0" + horas;
                    }
                    if (horas == 24) {
                        horas = "0" + 0;
                        dias++;
                        horas = 0;
                    }
                }
            }
        }
        //passa o tempo para o html
        document.getElementById("timer").innerHTML = horas + ":" + minutos + ":" + segundos;
    }, 1000);
}

//Função para mostrar vidas restantes
function displayLifes() {
    var heart1 = document.getElementById("life1");
    var heart2 = document.getElementById("life2");
    var heart3 = document.getElementById("life3");
    var br = document.getElementById("breakRow");
    var lifesContainer = document.getElementById("lifes");
    if (player.lifes == 3) {         // 3 vidas
        heart1.style.display = "contents";
        heart2.style.display = "contents";
        heart3.style.display = "contents";
        br.style.display = "none";
    } else if (player.lifes == 2) { // 2 vidas
        heart1.style.display = "contents";
        heart2.style.display = "contents";
        heart3.style.display = "none";
        br.style.display = "none";
    } else if (player.lifes == 1) { // 1 vida
        heart1.style.display = "contents";
        heart2.style.display = "none";
        heart3.style.display = "none";
        br.style.display = "none";
    } else {
        heart1.style.display = "none";
        heart2.style.display = "none";
        heart3.style.display = "none";
        br.style.display = "block";
    }
}
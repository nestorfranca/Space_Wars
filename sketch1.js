let escala;

function setup() {
    createCanvas(windowHeight, windowHeight);

    // valor de referência para dimensionar os elementos de acordo com o tamanho da tela:
    escala = height/100;

    // frameRate(10);
    mundo = new Mundo();
    mundo.setup();
    // describe('Esse jogo foi feito com mts ajustes improvisados temporarios de longo prazo, longo mesmo, pode ter ctz!!!', LABEL);

}

function draw() {
    // background(100, 100, 100, 128);
    
    mundo.update();  
}


// leitura do botão ESCAPE, para ativar o pause:
function keyPressed() {
    // verifica o apetar do botão e se a flag de fim de jogo está desativada
    if (keyCode == 27 && !mundo.fimDeJogo) { // keyCode 27 => ESCAPE
        if (!mundo.pausaJogo) {
            pausar();
        } else {
            despausar();
        }
    }
}

function pausar() {
    mundo.pausaJogo = true;
    music.pause();
    // tempo em que o pause foi feito
    mundo.tempoPause = millis();
}

function despausar() {
    mundo.pausaJogo = false;
    music.play();
    // tempo em que o pause foi desfeito:        
    mundo.tempoDespause = millis();
    // Calcular a diferença de tempo de quando o jogo foi pausado e acrescenta esse valor no tempo dos efeitos 
    jogador.updateTemposEfeitos(mundo.tempoDespause - mundo.tempoPause);
}



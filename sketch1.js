let escala;
let telaAtual = 'menuInicial';

function setup() {
    canvas = createCanvas(windowHeight, windowHeight);

    // coordenadas de referência do canvas:
    canvasX = canvas.position().x;
    canvasY = canvas.position().y;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    // valor de referência para dimensionar os elementos de acordo com o tamanho da tela:
    escala = height/100;
    
    // frameRate(10);
    // somDogame.loop();

    // describe('Esse jogo foi feito com mts ajustes improvisados temporarios de longo prazo, longo mesmo, pode ter ctz!!!', LABEL);
}

function draw() {
    // background(100, 100, 100, 128);
    // instancia classe da tela atual:
    instanciaClasse(telaAtual);
    
    // define as telas visíveis:
    telas = {
        menuInicial,
        jogo
    };
    
    // atualiza elementos dentro da classe instanciada:
    telas[telaAtual].update();
}

function instanciaClasse(classe) {
    if (classe == 'jogo' && jogo === null) {
        jogo = new Jogo();
        // console.log("classe Game Criada!");
    }

    if (classe == 'menuInicial' && menuInicial === null) {
        menuInicial = new MenuInicial();
        // console.log("classe menuInicial Criada!");
    }
}

// função que "destrói" as instâncias das classes já criadas:
function destroiClasse(classe) {
    if (classe == 'menuInicial' && menuInicial !== null) {
        menuInicial = null;
    }
    else if (classe == 'jogo' && jogo !== null) {
        jogo = null;
    }
}

// leitura do botão ESCAPE, para ativar o pause:
function keyPressed() {
    // verifica se a tela 'Jogo' está instanciada:
    if (jogo !== null) {
        // verifica o apetar do botão e se a flag de fim de jogo está desativada
        if (keyCode == 27 && !jogo.fimDeJogo) { // keyCode 27 => ESCAPE
            
            if (!jogo.pausaJogo) {
                pausar();
            } else {
                despausar();
            }
        }
    }
}

function doubleClicked() {
    // console.log("oi");
    // verifica se a tela 'Jogo' está instanciada:
    if (jogo !== null) {
        // verifica o apetar do botão e se a flag de fim de jogo está desativada
        if (!jogo.fimDeJogo) {
            
            if (!jogo.pausaJogo) {
                pausar();
            } else {
                despausar();
            }
        }
    }
}

function pausar() {
    if (jogo !== null && telaAtual == 'jogo') {
        // console.log('Pausou');

        jogo.pausaJogo = true;
        // music.pause();
        // tempo em que o pause foi feito
        jogo.salvaTempoPause();
        
        pause.draw();
    }
}

function despausar() {
    if (jogo !== null && telaAtual == 'jogo') {
        // console.log('Despausou');

        jogo.pausaJogo = false;
        
        // tempo em que o pause foi desfeito:        
        jogo.salvaTempoDespause();

        // music.play();
        // Calcular a diferença de tempo de quando o jogo foi pausado:
        let intervaloPausado = jogo.tempoDespause-jogo.tempoPause;
        
        // acrescenta esse intervalo no tempo dos efeitos
        jogador.updateTemposEfeitos(intervaloPausado);
        pause.apagarBotao();

        // reativa o timer de geração de inimigos:
        jogo.updateTimerHorda();
    }
}



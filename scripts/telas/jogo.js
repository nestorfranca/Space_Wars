
class Jogo {
    constructor() {
        mundo = new Mundo();

        // devem ser instanciados depois de mundo, levam em consideração as suas dimensões:
        hud = new Hud();
        pause = new Pause(mundo.largura / 2, mundo.altura / 2);
        
        // mundo.setup();
        this.fimDeJogo = false;
        this.venceu = false;
        this.pausaJogo = false;
        this.tempoPause = 0;
        this.tempoDespause = 0;


        this.botaoReiniciar = null;
        this.botaoMenuInicial = null;

        this.setup();
    }
    
    // inicializa os elementos dinâmicos:
    setup() {
        mundo.setup();

        // music.setVolume(0.04) // Define o volume do jogo em execução(0.0 a 1.0)
        // music.loop(); // Configura a música de fundo para tocar em loop
    }
    
    // atualiza os elementos de jogo:
    update() {
        this.draw();

        if (!this.fimDeJogo && !this.pausaJogo) {
            mundo.update();
            hud.draw();
        }
        
        if(this.fimDeJogo){
            music.stop();
        }

    }
    
    // exibe as entidades do jogo:
    draw() {
        pause.draw();               

        // exibe botões de "Reiniciar" e "Menu Inicial", no Game Over:
        if (jogador.perdeu == true) {
            push();
                fill('#ff000022');
                rect(0, 0, width, height);
                imagemGameOver.resize(mundo.largura, 0);
                image(imagemGameOver, mundo.x, (height - imagemGameOver.height) / 2, imagemGameOver.width, imagemGameOver.height, 0, 0, width, height);
            pop();

            // ativa flag de fim de jogo:
            this.fimDeJogo = true;

            // placar.atualizaRecorde();

            // instancia botões do menu de Game Over:
            this.botaoReiniciar = new BotaoGerenciador({
                texto: 'Reiniciar',
                x: (mundo.largura / 2 - (15 * escala)),
                y: mundo.altura / 1.6,
                proximaTela: 'jogo'
            });
            this.botaoMenuInicial = new BotaoGerenciador({
                texto: 'Menu Inicial',
                x: (mundo.largura / 2 + (15 * escala)),
                y: mundo.altura / 1.6,
                proximaTela: 'menuInicial'
            });

            // desativa flag:
            jogador.perdeu = false;
        }

        if (this.venceu) {
            
            push();
                fill('#00ff0022');
                rect(0, 0, width, height);
                imagemYouWin.resize(mundo.largura, 0);
                image(imagemYouWin, mundo.x, (height - imagemYouWin.height) / 2, imagemYouWin.width, imagemYouWin.height, 0, 0, width, height);
            pop();
            
            // ativa flag de fim de jogo:
            this.fimDeJogo = true;

            // instancia botões do menu de Game Over:
            this.botaoReiniciar = new BotaoGerenciador({
                texto: 'Novo Jogo',
                x: (mundo.largura / 2 - (15 * escala)),
                y: mundo.altura / 1.6,
                proximaTela: 'jogo'
            });
            this.botaoMenuInicial = new BotaoGerenciador({
                texto: 'Menu Inicial',
                x: (mundo.largura / 2 + (15 * escala)),
                y: mundo.altura / 1.6,
                proximaTela: 'menuInicial'
            });

            // desativa flag:
            this.venceu = false;
        }

        if (this.fimDeJogo) {
            // music.stop();
        }

        // atualiza os parâmetros dos botões, caso estejam instanciados:
        if (this.botaoMenuInicial !== null && this.botaoReiniciar !== null) {
            this.botaoMenuInicial.update();
            this.botaoReiniciar.update();
        }
    }
    
    // ==================================================
    // Métodos de controle de tempo:
    
    // salva o tempo no momento em que o jogo é pausado:
    salvaTempoPause() {
        this.tempoPause = millis();
    }
    
    // salva o tempo no momento em que o jogo é despausado:
    salvaTempoDespause() {
        this.tempoDespause = millis();
    }
    
    // controla o timer de geração de novas hordas:
    timerHorda() {
        // let timer = 0;
        if (millis() - mundo.tempoCriado > 3500) {
            mundo.geraHorda = true;
            
            // console.log("Nova Horda Chegando!");
        }
    }
            
    // mantém a contagem do timer estável, mesmo se o jogo for pausado:
    updateTimerHorda(intervalo = 0) {
        mundo.tempoCriado += intervalo;
    }
}
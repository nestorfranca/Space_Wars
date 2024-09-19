class Inimigo extends Nave {
    constructor({ centerX, centerY, largura = 100, altura = 100, velocidade = 0.1, vidaInicial = 3, vidaMaxima = 3, dano, projetilID = 0 }) {
        super(centerX, centerY, largura, altura, velocidade, vidaInicial, vidaMaxima, projetilID);
        
        // atributos de posição do inimigo:
        this.velocidadeY = .075 * escala;
        this.tempo_inicial = millis();
        
        // ==================================================
        // atributos de vida:
        this.vidaCor = 'red';
        this.vidaPosicao = -1;

        // ==================================================
        // chance de algum inimigo  que atira:
        this.inimigoAtira = random() < 0.7 ? true : false;
        
        // ==================================================
        // atributos de escudo:
        this.temEscudo = (random() < 0.1 || !this.inimigoAtira) ? true : false;
        
        // ==================================================
        // atributos de drop:
        this.colidiuJogador = false;
        this.temDrop = random() < 0.15 ? true : true;
        
        // ==================================================
        // atributos dinâmicos:
        this.setup();
    }
    
    draw() {
        this.imagemPadrao = imagemInimigo.get();
        this.imagemDano = imagemInimigoDano.get();
        this.escudoCor = color(255, 100, 100, 50);
        
        super.draw();
    }


    // movimentação do inimigo:
    moveEixoX() {
        this.centerX += this.velocidadeX * this.direcaoX;

        // deixar o movimento horizontal do inimigo aleatório:
        if (millis() - this.tempo_inicial >= 750) {
            this.tempo_inicial = millis();
            this.direcaoX = random() < 0.5 ? -1 : 1
        }

        // colisão com a tela:
        if (this.direcaoX == -1 && this.isMinX(mundo)) {
            // console.log("esquerda");
            this.centerX = mundo.getMinX() + this.largura / 2;
        }

        if (this.direcaoX == 1 && this.isMaxX(mundo)) {
            // console.log("direita");
            this.centerX = mundo.getMaxX() - this.largura / 2;
        }
    }

    moveEixoY() {
        this.centerY += this.velocidadeY;
    }

    // ==================================================
    // Métodos de controle de status da nave:

    // aplica efeito visual de dano;
    recebeDano(dano) {
        this.duracao = 20;
        
        super.recebeDano(dano);
    }

    setupAtaque() {
        this.projetilInfo = fita.projeteis.inimigo[this.projetil];
        
        super.setupAtaque();
    }

    // inicia o disparo, gerando os projeteis:
    atira() {
        if (this.inimigoAtira) {
            super.atira();

            this.geraProjetil();
        }
    }

    // gera os projeteis:
    geraProjetil() {
        this.agora = millis() - (jogo.tempoDespause - jogo.tempoPause);
        this.intervalo = random(this.intervaloDisparo * 0.4, this.intervaloDisparo);
        this.tiroInim = true;
        
        super.geraProjetil();
    }

}
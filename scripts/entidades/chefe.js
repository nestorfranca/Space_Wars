class Chefe extends Nave {
    constructor({ centerX, centerY, largura = 100, altura = 100, velocidade = 0.1, vidaInicial = 3, vidaMaxima = 3, dano, projetilID = 0 }) {
        super(centerX, centerY, largura, altura, velocidade, vidaInicial, vidaMaxima, projetilID);
        
        // atributos de posição do inimigo:
        this.velocidadeY = .075 * escala;
        this.tempo_inicial = millis();
        this.parou = false;
        
        // ==================================================
        // atributos de vida:
        this.vidaCor = 'red';
        this.vidaPosicao = -1;
        this.alturaVida = 2.0;

        // atributos de escudo:
        this.temEscudo = random() < 0.1 ? false : false;
        
        // ==================================================
        // atributos de drop:
        this.temDrop = random() < 0.15 ? false : false;
        
        // ==================================================
        // atributos dinâmicos:
        this.setup();
    }
    
    draw() {
        this.imagemPadrao = imagemChefe.get();
        this.imagemDano = imagemChefeDano.get();
        this.escudoCor = color(255, 100, 100, 50);
        
        super.draw();
    }

    update() {
        super.update();

        if (this.parou == false) {
            this.colisao.desativa();
        } else {
            this.colisao.ativa();
        }
    }

    // movimentação do inimigo:
    moveEixoX() {
        return;
    }

    moveEixoY() {
        let novo_centerY = this.centerY + this.velocidadeY;

        this.centerY = min(novo_centerY, 20*escala);

        if (this.centerY != novo_centerY) {
            this.parou = true;
        }
    }

    // ==================================================
    // Métodos de controle de status da nave:

    // aplica efeito visual de dano;
    recebeDano(dano) {
        this.duracao = 20;
        
        super.recebeDano(dano);
    }

    setupAtaque() {
        this.projetilInfo = fita.projeteis.chefe[this.projetil];
        
        super.setupAtaque();
    }

    // inicia o disparo, gerando os projeteis:
    atira() {
        if (this.parou == true) {
            super.atira();

            this.geraProjetil();
        }
    }

    // gera os projeteis:
    geraProjetil() {
        this.agora = millis() - (jogo.tempoDespause - jogo.tempoPause);
        this.intervalo = random(this.intervaloDisparo * 0.25, this.intervaloDisparo);
        this.tiroInim = true;
        
        super.geraProjetil(random(-this.largura/2.5, this.largura/2.5));
    }

}
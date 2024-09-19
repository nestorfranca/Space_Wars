class Modulo extends Nave {
    constructor({ centerX, centerY, largura, altura, velocidade, vidaInicial, vidaMaxima, projetilID, posicao = 1 }) {
        super(centerX, centerY, largura, altura, velocidade, vidaInicial, vidaMaxima, projetilID);

        this.posicao = posicao;

        this.vidaCor = 'cyan';
        this.setup();
        // this.colisao.ativa();
    };

    draw() {
        this.imagemPadrao = imagemModulos.get();
        this.imagemDano = imagemModulos.get();

        super.draw();
    }

    // update() {
    //     super.update();
    // }

    // recebe todas as informações sobre o projetil e tipo de disparo:
    setupAtaque() {
        this.projetilInfo = fita.projeteis.modulos[0];

        super.setupAtaque();
    }

    // inicia o disparo, gerando os projeteis:
    atira() {
        super.atira();

        this.geraProjetil();
    }

    // gera os projeteis:
    geraProjetil() {
        this.agora = millis();
        this.intervalo = this.intervaloDisparo;
        this.tiroInim = false;

        super.geraProjetil();
    }

    moveEixoX() {
        this.centerX = jogador.centerX + (this.posicao*jogador.largura/1.5);
    }

    moveEixoY() {
        this.centerY = jogador.centerY;
    }
}
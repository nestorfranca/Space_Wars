//SUPER CLASS
class Nave extends Entidade {
    constructor(centerX, centerY, largura, altura, velocidade, vidaInicial, vidaMaxima, projetilID) {
        super(centerX, centerY, largura, altura, velocidade);
        this.direcaoX = 0;  
        this.direcaoY = 0;

        //=========================================
        // atributos e colisão:
        this.precisao = 0.7;
        this.duracaoDano = 0;
        this.levouDano = false;

        // ==================================================
        // atributos de vida:
        this.larguraVida = this.largura;
        this.alturaVida = 0.5;
        this.vidaPosicao = 1;
        this.vidaInicial = vidaInicial;
        this.vidaMaxima = vidaMaxima;
        this.vidaCor = 'white';

        // atributos de escudo:
        this.temEscudo= false;

        // ==================================================
        // atributos de ataque:
        this.projetil = projetilID;
        this.projeteis = [];
        this.disparando = false;   
        this.setupAtaque();
    }

    // instancia de elementos dinâmicos:
    setup() {
        super.setup();

        this.vida = new Vida({
            largura: this.larguraVida,
            altura: this.alturaVida,
            vidaPosicao: this.vidaPosicao,
            vidaInicial: this.vidaInicial,
            vidaMaxima: this.vidaMaxima,
            color: this.vidaCor,
            temEscudo: this.temEscudo,
        });
}

    setPos() {
        super.setPos();

        this.vida.setPos(this.centerX, (this.centerY + (this.vidaPosicao * this.altura / 1.8)));
        this.vida.update();
    }

    draw() {
        push();
            // alterna entre as imagens, para efeito de dano:
            if (this.levouDano && frameCount % 10 < 5) {
                this.imagem = this.imagemDano;
            } else {
                this.imagem = this.imagemPadrao;
            }

            this.imagem.resize(0, this.altura);
            super.draw();

            if (this.vida.temEscudo) {

                let escudoLargura = this.largura * 1.3;
                let escudoAltura = this.altura * 1.3;

                push();
                    fill(this.escudoCor);
                    strokeWeight(0.1);
                    stroke(200, 200, 255);
                    ellipse(this.centerX, this.centerY, escudoLargura, escudoAltura);
                pop();

                // atualiza a precisão da colisão, para as dimensões do escudo:
                this.colisao.updatePrecisao(1.1);

            } else {
                // retoma as dimensões originais:
                this.colisao.updatePrecisao(this.precisao);
            }
        pop();

        // Atualiza o estado de piscar do inimigo, ao levar dano:
        if (this.levouDano) {
            this.duracaoDano--;
            if (this.duracaoDano <= 0) {
                this.levouDano = false;
            }
        }
    }

    update() {
        this.moveEixoX();
        this.moveEixoY();
        // super.draw();
        this.setPos();
        
        this.draw();

        this.updateProjeteis();
    }

    recebeDano(dano = 1) {
        this.vida.diminui(dano);

        this.levouDano = true;
        this.duracaoDano = this.duracao;
    }

    // recebe todas as informações sobre o projetil e tipo de disparo:
    setupAtaque() {
        this.danoTiro = this.projetilInfo.dano;
        this.intervaloDisparo = this.projetilInfo.intervaloDisparo; // Intervalo entre cada tiro na rajada (em milissegundos)
        this.intervaloRajada = this.projetilInfo.intervaloRajada; // Intervalo entre cada rajada (em milissegundos)
        this.tirosPorRajada = this.projetilInfo.tiroPorRajada; 
        this.tiroVelocidade = this.projetilInfo.velocidade;
        this.autoMira = this.projetilInfo.autoMira;
        this.tirosRestantes = 0; 
        this.ultimoDisparo = 0;
        this.projetilLargura = this.projetilInfo.larguraTiro;
    }

    // atualiza as informações de projetil
    updateProjeteis() {
        this.atira();

        for (let projetil of this.projeteis) {
            projetil.update();  // projeteis
            // projetil.colisao.drawHitBox();
        }

        this.eliminaProjeteis();
    }
    
    // retorna o estado de atirando do jogador:
    estaAtirando() {
        return this.disparando;
    }

    atira() {
        if (!this.estaAtirando()) {
            this.disparando = true;
            this.tirosRestantes = this.tirosPorRajada;    // Quantidade de tiros por rajada(depois aumentar de acordo com a fase).
            this.ultimoDisparo = millis();
        }
    }

    geraProjetil(posX = 0) {
        let tiroPosicao = this.tiroInim ? 1 : -1;

        if (this.tirosRestantes > 0 && this.agora - this.ultimoDisparo >= this.intervalo) {

            let projetil = new Projetil({
                centerX: this.centerX + posX,
                centerY: this.centerY + (tiroPosicao * this.altura) / 2,
                largura: this.projetilLargura,
                velocidade: this.tiroVelocidade,
                id: this.projetil,
                dano: this.danoTiro,
                tiroInimigo: this.tiroInim
            });

            this.projeteis.push(projetil);
            this.tirosRestantes--;
            this.ultimoDisparo = this.agora;
        }
        
        if (this.tirosRestantes <= 0 && this.agora - this.ultimoDisparo >= this.intervaloRajada) {
            this.disparando = false;
        }
    }

       // apaga projeteis marcados como 'deletado':
    eliminaProjeteis() {

        for (let i = this.projeteis.length - 1; i >= 0; i--) {
            if (this.projeteis[i].deletado) {
                this.projeteis.splice(i, 1);
            }
        }
    }
}
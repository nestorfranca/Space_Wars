class Inimigo {
    constructor({ centerX, centerY, largura = 100, altura = 100, vidaInicial = 3, vidaMaxima = 3, dano, projetilID = 0 }) {
        // atributos de posição do inimigo:
        this.centerX = centerX;
        this.centerY = centerY;
        this.largura = largura * escala;
        this.altura = altura * escala;
        this.precisao = 0.7;

        this.direcaoX = 1;
        this.direcaoY = 1;
        this.tempo_inicial = millis();

        // ==================================================
        // atributos de colisão:
        this.colisao = new Colisao({
            centerX: this.centerX,
            centerY: this.centerY,
            largura: this.largura,
            altura: this.altura,
            precisao: this.precisao
        });

        this.deletado = false;

        // ==================================================
        // atributos de vida:
        this.vida = new Vida({
            largura: this.largura,
            altura: .5 + escala,
            vidaInicial: vidaInicial,
            vidaMaxima: vidaMaxima,
            dano: dano,
            color: 'red',
            temEscudo: random() < 0.15 ? true : false,
            escudoPosicao: -1,
        });

        this.duracaoDano = 0;
        this.levouDano = false;

        // ==================================================
        // atributos de drop:
        this.temDrop = random() < 0.1 ? true : false;

        // ==================================================
        // atributos de ataque:
        this.projetil = projetilID;
        this.disparando = false;   
        this.setupAtaque();

        // atributos dinâmicos:
        this.setup();
    }

    // controle de elementos dinâmicos:
    setup() {
        // recebe o centro do inimigo menos metade da largura da imagem dele
        this.x = this.centerX - this.largura / 2;   
        this.y = this.centerY - this.altura / 2;

        this.colisao.setPos(this.centerX, this.centerY);
        this.colisao.setup();

        this.vida.setPos(this.centerX, (this.centerY - this.altura / 1.6));
        this.vida.setup();

        // this.velocidadeX = parseInt(random(-10, 10));
        this.velocidadeX = .1 * escala;

        this.velocidadeY = .1 * escala;
    }

    // exibe a imagem do inimigo:
    draw() {
        let imagem = imagemInimigo;

        push();
        // alterna entre as imagens, para efeito de dano:
        if (this.levouDano && frameCount % 10 < 5) {
            imagem = imagemInimigoDano;
        } else {
            imagem = imagemInimigo;
        }

        // exibe a imagem do inimigo
        imageMode(CENTER);
        image(imagem, this.centerX, this.centerY, this.largura, this.altura);

        if (this.vida.temEscudo) {

            let escudoLargura = this.largura * 1.3;
            let escudoAltura = this.altura * 1.3;

            push();
            fill(255, 100, 100, 50);
            strokeWeight(0.3);
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

    // ==================================================
    // atualiza os elementos e atributos e exibe o inimigo:
    update() {
        this.moveEixoX();
        this.moveEixoY();

        this.setup();

        this.draw();
        this.vida.draw();

        this.updateProjeteis();
    }

    // movimentação do inimigo:
    moveEixoX() {
        this.centerX += this.velocidadeX * this.direcaoX;

        // colisão com a tela:
        if (this.direcaoX == -1 && this.isMinX(mundo)) {
            // console.log("esquerda");
            this.centerX = mundo.getMinX() + this.largura / 2;
        }

        if (this.direcaoX == 1 && this.isMaxX(mundo)) {
            // console.log("direita");
            this.centerX = mundo.getMaxX() - this.largura / 2;
        }

        // deixar o movimento horizontal do inimigo aleatório:
        if (millis() - this.tempo_inicial >= 750) {
            this.tempo_inicial = millis();
            this.direcaoX = random() < 0.5 ? -1 : 1
        }
    }

    moveEixoY() {
        this.centerY += this.velocidadeY;
    }

    // ==================================================
    // Métodos Modificadores:
    recebeDano() {
        // this.vidas.decrementa();
        this.levouDano = true;
        this.duracaoDano = 20;
    }

    // marca o inimigo para ser apagado:
    deleta() {
        this.deletado = true;
    }

    // recebe todas as informações sobre o projetil e tipo de disparo:
    setupAtaque() {
        this.projetilInfo = fita.projeteis.inimigo[this.projetil]

        this.projeteis = []; // Array para armazenar os projeteis
        this.intervaloDisparo = this.projetilInfo.intervaloDisparo; // Intervalo entre cada tiro na rajada (em milissegundos)
        this.intervaloRajada = this.projetilInfo.intervaloRajada; // Intervalo entre cada rajada (em milissegundos)
        this.tirosPorRajada = this.projetilInfo.tiroPorRajada;
        this.tiroVelocidade = this.projetilInfo.velocidade;
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

    // inicia o disparo, gerando os projeteis:
    atira() {

        if (!this.estaAtirando()) {
            this.disparando = true;
            this.tirosRestantes = this.tirosPorRajada;    // Quantidade de tiros por rajada(depois aumentar de acordo com a fase).
            this.ultimoDisparo = millis();
        }

        this.geraProjetil();
    }

    // gera os projeteis
    geraProjetil() {
        let agora = millis();
        if (this.tirosRestantes > 0 && agora - this.ultimoDisparo >= this.intervaloDisparo) {

            let projetil = new Projetil({
                centerX: this.centerX,
                centerY: this.centerY - this.altura / 2,
                velocidade: this.tiroVelocidade,
                tiroInimigo: true,
                largura: this.projetilLargura
            });

            this.projeteis.push(projetil);
            this.tirosRestantes--;
            this.ultimoDisparo = agora;

            // som do disparo do inimigo:
            // somProjetil.setVolume(0.5);
            // somProjetil.play();

        }

        if (this.tirosRestantes <= 0 && agora - this.ultimoDisparo >= this.intervaloRajada) {
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

    // ==================================================

    // Verificadores de posição:
    isMinX(objeto, offset = 0) {
        return this.getMinX() <= objeto.getMinX() + offset;
    }

    isMaxX(objeto, offset = 0) {
        return this.getMaxX() >= objeto.getMaxX() - offset;
    }

    isMinY(objeto, offset = 0) {
        return this.getMinY() <= objeto.getMinY() + offset;
    }

    isMaxY(objeto, offset = 0) {
        return this.getMaxY() >= objeto.getMaxY() - offset;
    }

    // ==================================================
    // Métodos Acessores:
    getMinX() {
        return this.x;
    }

    getMaxX() {
        return this.x + this.largura;
    }

    getMinY() {
        return this.y;
    }

    getMaxY() {
        return this.y + this.altura;
    }

    getCenterX() {
        return this.centerX;
    }

    getCenterY() {
        return this.centerY;
    }
}
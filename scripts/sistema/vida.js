class Vida {
    constructor({ largura = 0.5, altura, vidaPosicao = 1, vidaInicial, vidaMaxima, color, temEscudo = false }) {
        // atributos de posição:
        this.largura = largura;
        this.altura = altura;

        // ==================================================
        // atributos de controle
        this.barraVida = vidaInicial;
        this.maxUnidades = vidaMaxima;
        this.color = color;

        this.unidadeEscala = escala;

        // this.vidaCount = this.barraVida;
        this.vidaMaxima = this.barraVida * this.unidadeEscala;
        this.vidaPosicao = vidaPosicao; //  1 - embaixo da barra de vida;
                                            // -1 - em cima da barra de vida

        // ==================================================
        // atributos do escudo:
        this.temEscudo = temEscudo;
        this.valorMaxEscudo = 2;
        this.barraEscudo = this.valorMaxEscudo * this.unidadeEscala;

        this.setup();
    }

    // controle de atributos dinâmicos(configurações):
    setup() {
        // posição da vida:
        this.vidaX = this.centerX - (this.vidaMaxima) / 2;
        this.vidaY = this.centerY;

        // posição do escudo:
        this.escudoX = this.centerX - (this.barraEscudo) / 2;
        this.escudoY = this.centerY + this.vidaPosicao * escala;
    }

    // atualiza as informações de vida:
    update() {
        this.setup();
        this.draw();
    }

    // atualiza a posição da vida:
    setPos(x, y) {
        this.centerX = x;
        this.centerY = y;
    }

    // exibe a imagem da vida:
    draw() {
        push();
            fill(0); //desenha o retangulo de fundo preto da vida
            rect(this.vidaX, this.vidaY, this.vidaMaxima, (this.vidaPosicao*this.altura) * escala);

            noStroke();
            fill(this.color);

            // Desenha a barra de vida
            for (let i = 0; i < this.barraVida; i++) {
                rect((this.vidaX + i * this.unidadeEscala), this.vidaY, this.unidadeEscala * (0.95), (this.vidaPosicao*this.altura) * escala);
            }
        pop();
            
        // exibe o escudo, quando ativado:
        if (this.temEscudo) {
            this.drawEscudo();           
        }
    }

    // desenha a barra de vida do escudo:
    drawEscudo() {
        push();
            fill(0);
            rect(this.escudoX, this.escudoY, this.barraEscudo, (this.vidaPosicao*this.altura) * escala);

            noStroke();
            fill('lightblue');

            // Desenha a barra de resistencia do escudo
            for (let i = 0; i < this.valorMaxEscudo; i++) {
                rect((this.escudoX + i * this.unidadeEscala), this.escudoY, this.unidadeEscala * (0.95), (this.vidaPosicao*this.altura) * escala);
            }
        pop();
    }

    // aumenta os pontos de vida:
    aumenta() {
        // console.log(life);
        if (this.barraVida < this.maxUnidades) {
            this.barraVida++;
            // this.maxUnidades++;
        }
    }

    // diminui os pontos de vida/escudo:
    diminui(dano) {
        // console.log(life);
        if (this.temEscudo) {
            this.valorMaxEscudo -= dano;   // decrementa o escudo
        } else {
            this.barraVida -= dano;        // decrementa a vida
        }
        
        if (this.valorMaxEscudo <= 0) {
            this.temEscudo = false;
        }
        
        if (this.barraVida <= 0) {
            this.barraVida = 0;
        }
    }
}


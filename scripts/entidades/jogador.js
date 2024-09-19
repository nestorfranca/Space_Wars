class Jogador extends Nave {
    constructor({ centerX, centerY, largura = 54, altura = 75, velocidade = 3, vidaInicial = 5, vidaMaxima = 5, projetilID = 0 }) {
        super(centerX, centerY, largura, altura, velocidade, vidaInicial, vidaMaxima, projetilID);

        // ==================================================
        // atributoss de colisão:
        this.perdeu = false;

        // ==================================================
        // atributos de vida: 
        this.vidaCor = 'green';
        this.vidaPosicao = 1;

        // atributos de escudo:
        this.temEscudo = false;

        // atributo dos modulos de apoio
        this.moduloApoio = false;

        // ==================================================
        // armazena o id dos efeitos aplicados:
        this.efeitos = [];
        this.efeito = {
            "id": undefined,
            "tempoEfeito": undefined,
            "tempoRecebido": undefined
        };

        this.modulos = [];

        // ==================================================
        // atributos dinâmicos:
        this.setup();

    }

    // exibe a imagem do jogador:
    draw() {
        this.imagemPadrao = imagemJogador.get();
        this.imagemDano = imagemJogadorDano.get();
        this.escudoCor = color(100, 100, 255, 50);

        super.draw();

        // reativa a colisão do jogador:
        if (!this.levouDano && !this.colisao.ativado) {
            this.colisao.ativa();
        }

    }

    // ==================================================
    // métodos de controle de movimento:
    moveEixoX() {
        if ((keyIsDown(65) === true || keyIsDown(37) === true)) {  // A ou "Seta p/ Esquerda"
            this.direcaoX = -1;
            this.centerX -= this.velocidadeX;
        }
        if (keyIsDown(68) === true || keyIsDown(39) === true) {  // D ou "Seta p/ Direita"
            this.direcaoX = 1;
            this.centerX += this.velocidadeX;
        }

        for (let modulo of this.modulos) {
            if (modulo.isMinX(mundo)) {
                this.centerX = mundo.getMinX() + abs(this.centerX - modulo.getMinX());
            }
            
            if (modulo.isMaxX(mundo)) {
                this.centerX = mundo.getMaxX() - abs(this.centerX - modulo.getMaxX());
            }
        }
        
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
        if (keyIsDown(87) === true || keyIsDown(38) === true) {  // W ou "Seta p/ Cima"
            this.direcaoY = -1;
            this.centerY -= this.velocidadeY;
        }
        if (keyIsDown(83) === true || keyIsDown(40) === true) {  // S ou "Seta p/ Baixo"
            this.direcaoY = 1;
            this.centerY += this.velocidadeY;
        }

        if (this.direcaoY == -1 && this.isMinY(mundo)) {
            // console.log("cima");
            this.centerY = mundo.getMinY() + this.altura / 2;
        }
        else if (this.direcaoY == 1 && this.isMaxY(mundo)) {
            // console.log("baixo");
            this.centerY = mundo.getMaxY() - this.altura / 2;
        }
    }

    // ==================================================
    // Métodos de controle de status da nave:

    // aplica efeito de dano:
    recebeDano(dano) {
        this.duracao = 20;
        this.colisao.desativa();
        
        super.recebeDano(dano)
    }

    // aplica efeitos recebidos pelos itens:
    aplicaEfeito(item) {

        // verifica se alguma efeito que não pode acumular já foi aplicado:
        // caso verdadeiro, vai apenas reiniciar o tempo:
        for (let efeito of this.efeitos) {
            // console.log(item.id);
            // console.log(efeito);
            if (item.acumula == false && efeito.id == item.id) {
                // console.log("Não acumula");

                // atualiza o tempo do efeito:
                efeito.tempoRecebido = millis();

                // caso efeito seja o escudo, ele reaplicará o efeito
                if (item.efeitos[0].tipo == 'defesa') {
                    this.vida.temEscudo = true;
                    this.vida.valorMaxEscudo = 2;
                }

                if (item.efeitos[0].tipo == 'equipavel') {
                    this.modulos = this.criaModulos();
                    this.moduloApoio = true;
                }
                return;
            }
        }
        
        // aplica o efeito:
        for (let efeito of item.efeitos) {
            let tipo = efeito.tipo

            if (tipo == 'vida') {
                this.vida.aumenta(efeito.valor);
            }
            if (tipo == 'defesa') {
                this.vida.temEscudo = true;
                this.vida.valorMaxEscudo = 2;
            }
            if (tipo == 'ataque') {
                this.intervaloDisparo += efeito.valor;
            }
            if (tipo == 'arma') {
                this.projetil = 1;
                this.setupAtaque();

                for (let horda of mundo.inimigos.navesBatalha) {
                    for (let inim of horda.naves    ) {
                        inim.vida.dano = jogador.danoTiro;
                    }
                }
                // modificar a arma aqui
            }
            if (tipo == 'equipavel') {
                this.modulos = this.criaModulos();
                this.moduloApoio = true;
            }
        }

        // salva informações sobre efeitos temporarios:
        if (item.temporario == true) {
            // adiciona o id do item na pilha:       
            this.efeito.id = item.id;
            // adiciona o momento em que foi pego:
            this.efeito.tempoEfeito = item.tempo * 1000;
            this.efeito.tempoRecebido = millis();
            // console.log('logo apos receber '+this.tempoRecebido);       
            this.efeitos.push({...this.efeito});
        }

    }

    // remove o efeito aplicado, depois de um tempo determinado:
    removeEfeitos() {
        let drops = fita.drops;

        for (let i = this.efeitos.length - 1; i >= 0; i--) {
            let efeito = this.efeitos[i];

            // verifica se o tempo do efeito acabou:
            if (millis() - efeito.tempoRecebido >= efeito.tempoEfeito) {
                let drop = drops[efeito.id];
                // reverte o efeito aplicado:
                for (let efeito of drop.efeitos) {
                    let tipo = efeito.tipo

                    // if (tipo == 'vida') {
                    //     this.vida.aumenta(efeito.valor);
                    // }
                    if (tipo == 'defesa') {
                        this.vida.temEscudo = false;
                    }
                    if (tipo == 'ataque') {
                        this.intervaloDisparo = this.projetilInfo.intervaloDisparo;
                    }
                    if (tipo == 'arma') {
                        this.projetil = 0;
                        this.setupAtaque();

                        for (let horda of mundo.inimigos.navesBatalha) {
                            for (let inim of horda.naves) {
                                inim.vida.dano = jogador.danoTiro;
                            }
                        }
                    }
                    if (tipo == 'equipavel') {
                        this.moduloApoio = false;
                        for (let modulo of this.modulos) {
                            modulo.colisao.desativa();
                            modulo.deleta();
                        }
                    }
                }

                this.efeitos.splice(i, 1);
            }

        }

        // desativa escudo, caso perca todo os pontos:
        for (let i = this.efeitos.length - 1; i >= 0; i--) {
            let efeito = this.efeitos[i];

            // remove o efeito de escudo
            if (drops[efeito.id].nome === "Escudo de Energia" && this.vida.temEscudo == false) {
                // console.log("removido");
                // this.vida.temEscudo = false;
                this.efeitos.splice(i, 1);
            }
        }
    }


    // mantém a contagem de tempo estável, mesmo se o jogo for pausado:
    updateTemposEfeitos(intervalo = 0) {
        for (let efeito of this.efeitos) {
            efeito.tempoRecebido += intervalo;
        }
    }
    
    // ==================================================
    // Métodos de controle de ataque:

    // recebe todas as informações sobre o projetil e tipo de disparo:
    setupAtaque() {
        this.projetilInfo = fita.projeteis.jogador[this.projetil]

        super.setupAtaque();
    }

    // inicia o disparo, gerando os projeteis:
    atira() {
        if (keyIsDown(32)) {

            super.atira();
        }

        this.geraProjetil();
    }

    // gera os projeteis:
    geraProjetil() {
        this.agora = millis();
        this.intervalo = this.intervaloDisparo;
        this.tiroInim = false;

        if (this.tirosRestantes > 0 && this.agora - this.ultimoDisparo >= this.intervalo) {
            // console.log("oi");
            somProjetil.setVolume(0.05);
            somProjetil.play();
        }

        super.geraProjetil();
    }

    criaModulos() {
        return [
                new Modulo({
                    centerX: this.centerX - this.largura/1.5,
                    centerY: this.centerY,
                    largura: 4,
                    altura: 4,
                    velocidade: 0.5,
                    vidaInicial: 1,
                    vidaMaxima: 1,
                    projetilID: 0,
                    posicao: -1
                }),

                new Modulo({            
                    centerX: this.centerX + this.largura/1.5,
                    centerY: this.centerY,
                    largura: 4,
                    altura: 4,
                    velocidade: 0.5,
                    vidaInicial: 1,
                    vidaMaxima: 1,
                    projetilID: 0,
                    posicao: 1
                })
        ];
    }
}
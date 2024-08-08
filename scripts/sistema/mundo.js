class Mundo {
    constructor() {
        this.altura = height;
        this.largura = this.altura * 0.6;
        this.x = 0;
        this.y = 0;
        this.inimigos = [];
        this.itens = [];
        this.escala = height / 100;

        this.fimDeJogo = false;
        this.pausaJogo = false;

        this.tempoPause = 0;
        this.tempoDespause = 0;
    }
    
    // inicializa os objetos:
    setup() {
        hud = new Hud();
        // cria objeto jogador
        jogador = new Jogador({
            centerX: (this.largura / 2),
            centerY: (this.altura - 100),
            largura: 7,
            altura: 10,
            velocidade: 0.5,
            vidaInicial: fita.configuracoes.vidaInicial,
            vidaMaxima: fita.configuracoes.vidaMaxima,
            projetilID: fita.configuracoes.projetilAtual
        });

        music.setVolume(0.04) // Define o volume do jogo em execução(0.0 a 1.0)
        music.loop(); // Configura a música de fundo para tocar em loop
    }

    // exibe a tela do jogo:
    draw() {

        // ==================================================
        // imagem da tela de mundo:
        imagemFundo.resize(0, height); // ajusta a imagem para y maximo e x auto
        image(imagemFundo, this.x, this.y, this.largura, this.altura, 0, this.y, this.largura, this.altura, CONTAIN);

        // inseri um filtro branco, para deixar a imagem menos escura:
        push();
        noStroke();
        fill(255, 255, 255, 25);
        rect(this.x, this.y, this.largura, this.altura);
        pop();
    }

    // atualiza os objetos em campo:
    update() {

        if (!this.fimDeJogo && !this.pausaJogo) {
            hud.draw();

            this.draw();


            // ==================================================
            // configurações do jogador:
            jogador.update();
            jogador.removeEfeitos(this.itens);

            // exibe as hitbox (temporário)
            //this.mostrarHitBox();

            // ==================================================
            // configurações dos inimigos:
            this.updateInimigo();

            // ==================================================
            // configurações dos itens:
            for (let item of this.itens) {
                item.update();
            }

            // ==================================================
            // Verifica colisão entre entidades:
            this.verificaColisoes();
        
        }
        
        if (jogador.perdeu == true) {
            push();
            fill('#ff000022');
            rect(0, 0, width, height);
            imagemGameOver.resize(mundo.largura, 0);
            image(imagemGameOver, mundo.x, (height - imagemGameOver.height) / 2, imagemGameOver.width, imagemGameOver.height, 0, 0, width, height);
            pop();

            // ativa flag de fim de jogo:
            jogador.perdeu = false;
            this.fimDeJogo = true;
        }
        
        if (this.fimDeJogo){
            music.stop();
        }
    }


    // ==================================================
    // atualiza os parâmetros dos inimigos:
    updateInimigo() {

        for (let inim of this.inimigos) {
            inim.update();
            // exibe as hitbox (temporário):
        }

        // preenche a lista de inimigos:
        this.geraInimigo();
        // elimina os inimigos marcados:
        this.eliminaInimigo();
        // elimina os itens coletados:
        this.eliminaItem();
    }

    // ==================================================
    // métodos de inimigos
    // cria a horda de inimígos:
    geraInimigo() {
        let len = this.inimigos.length;
        // Até o início da horda, terá uma espera de 1 segundo:
        if (countInimigo == 0 /*&& len == 0*/) {
            setTimeout(() => {
                if (countInimigo == 0) {
                    posicao = random((this.x + 60 / 2), (this.largura - 60 / 2));
                    horda = parseInt(random(2, 3));   // número de naves na horda (3 a 5)

                    inimigo = new Inimigo({
                        centerX: posicao,
                        centerY: -(6 * this.escala) / 2,
                        largura: 6,
                        altura: 6,
                        dano: jogador.danoTiro
                    });

                    this.inimigos.push(inimigo);
                    countInimigo++;
                }
            }, 1000);
        }
        // o restante da horda é exibida:
        else if (countInimigo < horda && (this.inimigos.length == 0 || !this.isMinY(this.inimigos[len - 1], 10))) {
            inimigo = new Inimigo({
                centerX: posicao,
                centerY: -(6 * this.escala) / 2,
                largura: 6,
                altura: 6,
                dano: jogador.danoTiro
            });

            this.inimigos.push(inimigo);
            countInimigo++;
        }
    }

    // elimina os inimigos marcados:
    eliminaInimigo() {
        for (let i = this.inimigos.length - 1; i >= 0; i--) {
            if (this.inimigos[i].deletado) {
                // console.log("deletou "+i);
                // this.inimigos.pop(i);
                this.inimigos.splice(i, 1);
            }
        }

        // Caso a horda seja toda destruída, zera o contador e uma nova horda iniciará
        if (countInimigo == horda /*&& this.inimigos.length == 0*/) {
            countInimigo = 0;
        }

    }

    // elimina os itens capturados:
    eliminaItem() {

        for (let i = this.itens.length - 1; i >= 0; i--) {
            if (this.itens[i].deletado) {
                this.itens.splice(i, 1);
            }
        }
    }

    // ==================================================
    // método de colisão:

    // verifica colisões entre os objetos:
    verificaColisoes() {
        let hitBoxJogador = jogador.colisao;
        let hitBoxInimigo;
        let hitBoxProjetil;
        let hitBoxItem;

        if (jogador.vida.barraVida <= 0) {
            jogador.perdeu = true;
        }
        // ==================================================
        // colisões entre jogador e inimigo:
        for (let inim of this.inimigos) {
            hitBoxInimigo = inim.colisao;

            if (hitBoxJogador.colide(hitBoxInimigo)) {
                // console.log("inimigo colidiu jogador");
                jogador.recebeDano();


                inim.deleta();
            }
        }

        // ==================================================
        // colisões entre projetil e inimigo:
        for (let projetil of jogador.projeteis) {
            hitBoxProjetil = projetil.colisao;

            for (let inim of this.inimigos) {
                hitBoxInimigo = inim.colisao;

                if (hitBoxInimigo.colide(hitBoxProjetil)) {
                    // console.log("inimigo colidiu projetil");

                    inim.recebeDano();
                    // inim.deleta();

                    projetil.deleta();
                    inim.vida.diminui();
                    if (inim.vida.barraVida <= 0) {
                        inim.deleta();

                        placar.aumentoPontos(); // incrementa a contagem de pontos
                        placar.aumentaAbates(); // incrementa a contagem de abates

                        if (inim.temDrop == true) {
                            let item = new Drop({
                                centerX: inim.centerX,
                                centerY: inim.centerY,
                            });
                            this.itens.push(item);
                            countDrop++;
                        }
                    }
                }
            }
        }

        // colisões entre projetil e jogador:
        for (let inim of this.inimigos) {
            for (let projetil of inim.projeteis) {
                hitBoxProjetil = projetil.colisao;

                if (hitBoxJogador.colide(hitBoxProjetil)) {
                    // console.log("inimigo colidiu projetil");

                    jogador.recebeDano();
                    // inim.deleta();

                    projetil.deleta();

                }
            }
        }

        // ==================================================
        // colisões entre jogador e item:
        for (let item of this.itens) {
            hitBoxItem = item.colisao;

            if (hitBoxItem.colide(hitBoxJogador)) {
                // console.log("item colidiu jogador");

                jogador.aplicaEfeito(item);
                item.deleta();
            }
        }

        // ==================================================
        // verifica se o inimigo chegou ao fim da tela:
        for (let inim of this.inimigos) {
            hitBoxInimigo = inim.colisao;

            if (hitBoxInimigo.saiuTelaY() == 1) {
                // console.log("inimigo saiu tela");

                inim.deleta();
            }
        }

        // ==================================================
        // verifica se o projetil chegou ao fim da tela:
        for (let projetil of jogador.projeteis) {
            hitBoxProjetil = projetil.colisao;

            if (hitBoxProjetil.saiuTelaY() == -1) { // projetil saiu
                // console.log("projetil saiu tela");
                projetil.deleta();
            }
        }

        // ==================================================
        // verifica se o item chegou ao fim da tela:
        for (let item of this.itens) {
            hitBoxItem = item.colisao;

            if (hitBoxItem.saiuTelaY() == 1) { // item saiu
                // console.log("item saiu tela");
                item.deleta();
            }
        }
    }

    mostrarHitBox() {
        jogador.colisao.drawHitBox();
        for (let inim of this.inimigos) {
            inim.colisao.drawHitBox();
        }
        for (let projetil of jogador.projeteis) {
            projetil.colisao.drawHitBox();
        }
        for (let item of this.itens) {
            item.colisao.drawHitBox();
        }
    }
    // ==================================================
    // Verificadores de posição:
    isMinX(objeto, offset = 0) {
        return objeto.getMinX() < this.getMinX() + offset;
    }

    isMaxX(objeto, offset = 0) {
        return objeto.getMaxX() > this.getMaxX() - offset;
    }

    isMinY(objeto, offset = 0) {
        return objeto.getMinY() < this.getMinY() + offset;
    }

    isMaxY(objeto, offset = 0) {
        return objeto.getMaxY() > this.getMaxY() - offset;
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
        return this.x + this.largura / 2;
    }

    getCenterY() {
        return this.y + this.altura / 2;
    }
}
class Mundo {
    constructor() {
        this.altura = height;
        this.largura = this.altura * 0.6;
        this.x = 0;
        this.y = 0;
        this.itens = [];
        this.tempoExecucao = 0;
        
        // inicializa atributos referente aos inimigos:
        this.countInimigo = 0;
        this.countInimigoGerados = 0;
        this.countMaxInimigo = 15;
        this.tempoCriado = 0;
        this.inimigos = {
            "navesBatalha": [],
            "naveChefao": undefined,
        };
        
        // inicializa atributos referentes as hordas de naves de batalha:
        this.geraHorda = true;
        this.horda = {
            "naves": undefined,
            "numNaves": 0,
            "posicaoHorda": 0,
            "invadiu": false    // verifica se alguma nave da horda conseguiu atravessar sem ser destruída
        };

        // quantidade de naves em tela no momento
        this.naveNaTela = 0;
    }
    
    // inicializa os objetos:
    setup() {
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

        // this.criaModulos();
        // music.setVolume(0.04) // Define o volume do jogo em execução(0.0 a 1.0)
        // music.loop(); // Configura a música de fundo para tocar em loop
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
        // this.tempoExecucao = millis();
        this.draw();

        // ==================================================
        // Verifica colisão entre entidades:
        this.verificaColisoes();

        // ==================================================
        // configurações do jogador:
        jogador.update();
        jogador.removeEfeitos(this.itens);

        if (jogador.moduloApoio) {
            for (let modulo of jogador.modulos) {
                modulo.update();
            }
        }

        // verifica se precisa eliminar um modulo
        this.eliminaModulos();

        // exibe as hitbox (temporário)
        // this.mostrarHitBox();
        
        // ==================================================
        // configurações dos inimigos:
        this.updateInimigo();
        
        // ==================================================
        // configurações dos itens:
        for (let item of this.itens) {
            item.update();
        }

    }

    // ==================================================
    // métodos de controle dos inimigos:

    // atualiza os parâmetros dos inimigos:
    updateInimigo() {

        // atualiza os elementos de todos os inimigos, de todas as hordas:
        for (let horda of this.inimigos.navesBatalha) {
            for (let inim of horda.naves) {
                inim.update();
            }
        }

        if (this.inimigos.naveChefao != undefined) {
            this.inimigos.naveChefao.update();
        }
     
        // preenche a lista de inimigos:
        let leng = this.inimigos.navesBatalha.length;
        if (this.countInimigoGerados < this.countMaxInimigo) {
            // timer para criar novas hordas
            jogo.timerHorda();
            this.geraInimigo();
        }
        else {
            this.geraChefao();
        }

        // elimina os inimigos marcados:
        this.eliminaInimigo();
        // elimina os itens coletados:
        this.eliminaItem();
    }

    // cria a horda de inimígos:
    geraInimigo() {
        // configura uma nova horda:
        if (this.geraHorda == true) {
            // quantas naves restam ser geradas:
            let navesRestantes = this.countMaxInimigo - this.countInimigo;
            // quantidade de naves na horda
            let numeroNaves = min(navesRestantes, parseInt(random(2, 5)));   // hordas entre 2 e 4 naves
            
            // incrementa o contador geral de inimigos:
            this.countInimigo += numeroNaves;     

            this.horda.numNaves = numeroNaves;
            
            // posição em que as naves da horda irão surgir:
            let hordaPos, limite = 10, tentativas = 0;
            do {

                hordaPos = random((this.x + (6 * escala) / 2), (this.largura - (6 * escala) / 2));
                
                if (tentativas >= limite) {
                    break;
                }
                
                if (this.inimigos.navesBatalha.length != 0) {
                    for (let horda of this.inimigos.navesBatalha) {
                        let posicao = horda.posicaoHorda;
                        // console.log(posicao, hordaPos);
                        if (hordaPos < posicao + 6*escala && hordaPos > posicao - 6*escala) {
                            hordaPos = -1;
                        }
                    }
                }

                tentativas++;
                // console.log(tentativas);
            } while(hordaPos == -1);

            // let posicaoHorda;
            this.horda.posicaoHorda = hordaPos;
            this.horda.naves = [];
            
            // posicao = random((this.x + (6 * escala) / 2), (this.largura - (6 * escala) / 2));
            // this.posicaoHorda.push(posicaoHorda);
            
            // adiciona uma nova horda dentro do vetor inimigos, ainda com vetor de naves vazio:
            // é necessário fazer um clone usando a notação "{...object}"
            this.inimigos.navesBatalha.push({...this.horda});
            
            // Finaliza a configuração, desativando a flag:
            this.geraHorda = false;

            this.tempoCriado = millis();
        }
    
        // invoca as hordas:
        for (let horda of this.inimigos.navesBatalha) {

            let navesNaHorda = horda.numNaves;   // quantidade de naves da horda que está sendo expandida
            if (navesNaHorda == 0) {
                continue;
            }

            /* 
               Uma nave será adicionada a horda caso:
               - o vetor de hordas esteja vazio; 
                            ou
               - a última nave da horda gerada já apareceu no mapa 
            */
            
            let len = horda.naves.length;  // tamanho do vetor da horda, no vetor de inimigos
            let posicaoInimigoAnterior = (len == 0) ? 0 : horda.naves[len-1].y - 2*escala;
            let posicaoInimigoAtual = -(6 * escala/2) + posicaoInimigoAnterior;
            // nova instância de inimigo:
            if ((len == 0 || !this.isMinY(horda.naves[len-1]))) {
                if (this.naveNaTela < 15) {
                    // console.log("gerou");
                    inimigo = new Inimigo({
                        centerX: horda.posicaoHorda,
                        centerY: posicaoInimigoAtual,
                        largura: 6,
                        altura: 6,
                        dano: jogador.danoTiro
                    });     
                    
                    this.naveNaTela++;

                    // novo inimigo é adicionado no vetor de sua horda, dentro de inimigos:
                    horda.naves.push(inimigo);
                    
                    // incrementa o contador de inimigos gerados:
                    this.countInimigoGerados++;

                    // decrementa quantidade de naves que falta ser gerada na horda:
                    horda.numNaves--;

                    // console.log(this.naveNaTela);
                }
            }
        }
    }

    // cria chefao:
    geraChefao() {
        if ((this.inimigos.navesBatalha.length == 0 && this.itens.length == 0) && this.inimigos.naveChefao == undefined) {
            
            jogador.moduloApoio = false;
            for (let modulo of jogador.modulos) {
                modulo.colisao.desativa();
                modulo.deleta();
            }

            console.log("aí vem o homem macaco");
            let chefao = new Chefe({ 
                centerX: (this.x + this.largura)/2,
                centerY: -6*escala,
                largura: 60,
                altura: 30,
                velocidade: 0.1,
                vidaInicial: 50,
                vidaMaxima: 50,
                dano: jogador.danoTiro,
                projetilID: 0
            });

            this.inimigos.naveChefao = chefao;
        }
    }

    // elimina os inimigos marcados:
    eliminaInimigo() {
        let chefe = this.inimigos.naveChefao;
        if (chefe != undefined && chefe.deletado) {
            chefe = undefined;
        }

        for (let i = this.inimigos.navesBatalha.length - 1; i >= 0; i--) {
            let horda = this.inimigos.navesBatalha[i];
            let naves = horda.naves;
            // verifica as naves inimigas de cada horda:
            for (let j = naves.length-1; j >= 0; j--) {
                
                
                if (naves[j].deletado) {
                    
                    if (naves[j].temDrop == true && naves[j].colidiuJogador == false) {
                        let item = new Drop({
                            centerX: naves[j].centerX,
                            centerY: naves[j].centerY,
                        });
                        this.itens.push(item);
                        // countDrop++;
                    }
                    this.naveNaTela--;

                    // console.log("deletou "+i);
                    naves.splice(j, 1);
                }
            }

            // verifica se a horda foi totalmente destruída:
            if (naves.length == 0 && horda.numNaves <= 0) {
                // console.log("deletou horda "+i);
                this.inimigos.navesBatalha.splice(i, 1);

                // se conseguiu destruir toda a horda, ganha pontos extras:
                if (horda.invadiu == false) {
                    placar.aumentoPontos(50);
                }
            }
        }
    }

    // ==================================================
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

    eliminaModulos() {
        if (jogador.modulos.length != 0) {
            for (let i = jogador.modulos.length - 1; i >= 0; i--) {
                if (jogador.modulos[i].deletado) {
                    jogador.modulos.splice(i, 1);
                }
            }
        }
    }

    // verifica colisões entre os objetos:
    verificaColisoes() {
        let hitBoxJogador = jogador.colisao;
        let hitBoxInimigo;
        let hitBoxProjetil;
        let hitBoxItem;
        let hitBoxModulos = [];
        for (let i = 0; i < jogador.modulos.length; i++) {
            hitBoxModulos.push(jogador.modulos[i].colisao);
        }
        let hitBoxChefe;
        let chefe = this.inimigos.naveChefao;
        if (chefe != undefined) {
            hitBoxChefe = chefe.colisao;
        }

        if (jogador.vida.barraVida <= 0) {
            jogador.perdeu = true;
        }
        // ==================================================
        // colisões entre jogador e inimigo:
        for (let horda of this.inimigos.navesBatalha) {
            for (let inim of horda.naves) {
                hitBoxInimigo = inim.colisao;
                if (hitBoxJogador.colide(hitBoxInimigo)) {
                    // console.log("colidiu");
                    jogador.recebeDano();

                    inim.colidiuJogador = true;
                    inim.deleta(); 
                }
            }
        }

        // ==================================================
        if (chefe != undefined){
            // colisões entre jogador e chefe:
            if (hitBoxJogador.colide(hitBoxChefe) && hitBoxChefe.colide(hitBoxJogador)) {
                // console.log("colidiu");
                let chefe = this.inimigos.naveChefao;

                jogador.recebeDano();
                chefe.recebeDano();
            }

            // colisões entre jogador e projetil:
            for (let projetil of chefe.projeteis) {
                hitBoxProjetil = projetil.colisao;
    
                if (hitBoxJogador.colide(hitBoxProjetil)) {
                    // console.log("inimigo colidiu projetil");
    
                    jogador.recebeDano(chefe.danoTiro);
                    // inim.deleta();
    
                    projetil.deleta();
    
                }
            }
        }

        // colosão entre os prejeteis dos inimigos com a nave e os modulos 
        for (let horda of this.inimigos.navesBatalha) {
            for (let inim of horda.naves) {
                for (let projetil of inim.projeteis) {
                    hitBoxProjetil = projetil.colisao;

                    if (hitBoxJogador.colide(hitBoxProjetil)) {
                        // console.log("inimigo colidiu projetil");

                        jogador.recebeDano(inim.danoTiro);
                        // inim.deleta();

                        projetil.deleta();

                    }

                    if(hitBoxModulos.length != 0) {
                        for (let hitBoxModulo of hitBoxModulos) {
                            if (hitBoxModulo.colide(hitBoxProjetil)) {
                                let index = hitBoxModulos.indexOf(hitBoxModulo);
                                jogador.modulos[index].colisao.desativa();
                                jogador.modulos[index].deleta();
                                projetil.deleta();
                            }
                        }
                    }
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

        // verifica se teve colisão entre os projeteis do modulo direito com os inimigos
        if (hitBoxModulos.length != 0) {
            for (let modulo of jogador.modulos) {
                for (let projetil of modulo.projeteis) {
                    hitBoxProjetil = projetil.colisao;
        
                    for (let horda of this.inimigos.navesBatalha) {
                        for (let inim of horda.naves) {
                            hitBoxInimigo = inim.colisao;
        
                            if (hitBoxInimigo.colide(hitBoxProjetil)) {
                                // console.log("inimigo colidiu projetil");
        
                                inim.recebeDano(projetil.dano);
                                // inim.deleta();
        
                                projetil.deleta();
                                if (inim.vida.barraVida <= 0) {
                                    inim.deleta();
        
                                    placar.aumentoPontos(10); // incrementa a contagem de pontos
                                    placar.aumentaAbates(); // incrementa a contagem de abates
                                }
                            }
                        }
                    }
                }
            }
        }

        // ==================================================
        // colisões entre projetil e inimigo:
        for (let projetil of jogador.projeteis) {
            hitBoxProjetil = projetil.colisao;

            for (let horda of this.inimigos.navesBatalha) {
                for (let inim of horda.naves) {
                    hitBoxInimigo = inim.colisao;

                    if (hitBoxInimigo.colide(hitBoxProjetil)) {
                        // console.log("inimigo colidiu projetil");

                        inim.recebeDano(projetil.dano);
                        // inim.deleta();

                        projetil.deleta();
                        if (inim.vida.barraVida <= 0) {
                            inim.deleta();

                            placar.aumentoPontos(10); // incrementa a contagem de pontos
                            placar.aumentaAbates(); // incrementa a contagem de abates

                        }
                    }
                }
            }
        }
        
        // ==================================================
        // colisões entre projetil e chefe:
        for (let projetil of jogador.projeteis) {
            hitBoxProjetil = projetil.colisao;

            if (chefe != undefined && hitBoxChefe.colide(hitBoxProjetil)) {
                // console.log("inimigo colidiu projetil");
                let chefe = this.inimigos.naveChefao;
                chefe.recebeDano(projetil.dano);
                // inim.deleta();

                projetil.deleta();
                if (chefe.vida.barraVida <= 0) {
                    chefe.deleta();

                    // player.venceu = true;
                    // jogo.fimDeJogo = true;
                    jogo.venceu = true;
                    placar.aumentoPontos(1000); // incrementa a contagem de pontos
                    placar.aumentaAbates(); // incrementa a contagem de abates
                }
            }
        }

        // ==================================================
        // verifica se o inimigo chegou ao fim da tela:
        for (let horda of this.inimigos.navesBatalha) {
            for (let inim of horda.naves) {
                hitBoxInimigo = inim.colisao;
                
                if (hitBoxInimigo.saiuTelaY() == 1) {
                    // console.log("inimigo saiu tela");
                    
                    // marca que alguma nave da horda invadiu o planeta:
                    if (horda.invadiu == false) {
                        horda.invadiu = true;
                    }

                    inim.deleta();
                }
            }
        }

        // ==================================================
        // verifica se os projeteis de jogador, módulos e dos inimigos estão dentro da tela:
        for (let projetil of jogador.projeteis) {
            hitBoxProjetil = projetil.colisao;

            if (hitBoxProjetil.saiuTelaY() != 0) { // projetil saiu
                // console.log("projetil saiu tela");
                projetil.deleta();
            }
        }

        for (let horda of this.inimigos.navesBatalha) {
            for (let inim of horda.naves) {
                for (let projetil of inim.projeteis) {
                    hitBoxProjetil = projetil.colisao;
                    
                    if (hitBoxProjetil.saiuTelaY() != 0) { // projetil saiu
                        // console.log("projetil saiu tela");
                        projetil.deleta();
                    }
                }
            }
        }

        if (chefe != undefined) {
            for (let projetil of chefe.projeteis) {
                hitBoxProjetil = projetil.colisao;
                
                if (hitBoxProjetil.saiuTelaY() != 0) { // projetil saiu
                    // console.log("projetil saiu tela");
                    projetil.deleta();
                }
            }
        }

        if (jogador.modulos.length != 0) {
            for (let modulo of jogador.modulos) {
                for (let projetil of modulo.projeteis) {
                    hitBoxProjetil = projetil.colisao;
        
                    if (hitBoxProjetil.saiuTelaY() != 0) { // projetil saiu
                        // console.log("projetil saiu tela");
                        projetil.deleta();
                    }
                }
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
        
        let chefe = this.inimigos.naveChefao;
        if (chefe != undefined) {
            chefe.colisao.drawHitBox();
            for (let projetil of chefe.projeteis) {
                projetil.colisao.drawHitBox();
            }
        }

        for (let horda of this.inimigos.navesBatalha) {
            for (let inim of horda.naves) {
                inim.colisao.drawHitBox();

                for (let projetil of inim.projeteis) {
                    projetil.colisao.drawHitBox();
                }
            }
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
        return objeto.getMinX() < this.getMinX() + (offset * escala);
    }

    isMaxX(objeto, offset = 0) {
        return objeto.getMaxX() > this.getMaxX() - (offset * escala);
    }

    isMinY(objeto, offset = 0) {
        return objeto.getMinY() < this.getMinY() + (offset * escala);
    }

    isMaxY(objeto, offset = 0) {
        return objeto.getMaxY() > this.getMaxY() - (offset * escala);
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
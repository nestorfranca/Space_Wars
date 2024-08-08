class Jogador {
    constructor({ centerX, centerY, largura = 54, altura = 75, velocidade = 3, vidaInicial = 5, vidaMaxima = 5, projetilID = 0 }) {
        // atributos de posição:
        this.centerX = centerX;     // posição do centro do objeto
        this.centerY = centerY;
        this.largura = largura * escala;
        this.altura = altura * escala;
        this.velocidade = velocidade * escala;
        
        this.direcaoX = -1;
        this.direcaoY = -1;
        
        // ==================================================
        // atributos de colisão:
        // precisão das dimensões da hitBox, em relação ao objeto:
        this.precisao = 0.7;

        this.colisao = new Colisao({
            centerX: this.centerX,
            centerY: this.centerY,
            largura: this.largura,
            altura: this.altura,
            precisao: this.precisao
        });

        // ==================================================
        // atributos de vida:
        this.vida = new Vida({
            largura: this.largura,
            altura: .5 + escala,
            vidaInicial: vidaInicial,
            vidaMaxima: vidaMaxima,
            color: 'green',
            temEscudo: false,
            escudoPosicao: 1
        });

        this.duracaoDano = 0;
        this.levouDano = false;
        this.perdeu = false;

        // ==================================================
        // armazena o id dos efeitos aplicados:
        this.efeitosAplicados = [];
        this.tempoEfeito = [];
        this.tempoRecebido = [];

        // ==================================================
        // atributos de ataque:
        this.projetil = projetilID;
        this.disparando = false;    // Flag para saber se está disparando       
        this.setupAtaque();
        
        // ==================================================
        // atributos dinâmicos:
        this.setup();
    }

    //  controle de elementos dinâmicos:
    setup() {
        this.x = this.centerX - this.largura / 2;
        this.y = this.centerY - this.altura / 2;

        this.colisao.setPos(this.centerX, this.centerY); 
        this.colisao.update();
        this.vida.setPos(this.centerX, (this.centerY + this.altura / 1.8));
        this.vida.update();
    }

    // exibe a imagem do jogador:
    draw() {
        let imagem = imagemJogador;

        push();
            if (this.levouDano && frameCount % 10 < 5) {
                imagem = imagemJogadorDano;
            } else {
                imagem = imagemJogador;
            }

            imageMode(CENTER);
            image(imagem, this.centerX, this.centerY, this.largura, this.altura);
            
            if (this.vida.temEscudo) {

                let escudoLargura = this.largura * 1.3;
                let escudoAltura = this.altura * 1.3;

                push();
                    fill(100, 100, 255, 50);
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

        // Atualiza o estado de piscar do jogador
        if (this.levouDano) {
            this.duracaoDano--;
            if (this.duracaoDano <= 0) {
                this.levouDano = false;
                this.colisao.ativa();
            }
        }

    }

    // atualiza os elementos e atributos do jogador:
    update() {
        this.moveEixoX();
        this.moveEixoY();

        this.setup();
        
        this.draw();

        this.updateProjeteis();
    }

    // ==================================================
    // métodos de controle de movimento:
    moveEixoX() {
        if ((keyIsDown(65) === true || keyIsDown(37) === true)) {  // A ou "Seta p/ Esquerda"
            this.direcaoX = 0;
            this.centerX -= this.velocidade;
        }
        if (keyIsDown(68) === true || keyIsDown(39) === true) {  // D ou "Seta p/ Direita"
            this.direcaoX = 1;
            this.centerX += this.velocidade;
        }

        if (this.direcaoX == 0 && this.isMinX(mundo)) {
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
            this.direcaoY = 0;
            this.centerY -= this.velocidade;
        }
        if (keyIsDown(83) === true || keyIsDown(40) === true) {  // S ou "Seta p/ Baixo"
            this.direcaoY = 1;
            this.centerY += this.velocidade;
        }

        if (this.direcaoY == 0 && this.isMinY(mundo)) {
            // console.log("cima");
            this.centerY = mundo.getMinY() + this.altura / 2;
        }
        else if (this.direcaoY == 1 && this.isMaxY(mundo)) {
            // console.log("baixo");
            this.centerY = mundo.getMaxY() - this.altura / 2;
        }
    }

    // ==================================================
    // Métodos de controle de status do jogador:

    // aplica efeito de dano:
    recebeDano() {
        if (!this.levouDano) {
            this.vida.diminui();
            this.vida.update();
        }

        this.colisao.desativa();
        this.levouDano = true;
        this.duracaoDano = 20;
    }

    // aplica efeitos recebidos pelos itens:
    aplicaEfeito(item) {

        // verifica se alguma efeito que não pode acumular já foi aplicado:
        // caso verdadeiro, vai apenas reiniciar o tempo:
        for (let efeito of this.efeitosAplicados) {
            // console.log(item.id);
            // console.log(efeito);
            if (item.acumula == false && efeito == item.id) {
                // console.log("Não acumula");
                
                // atualiza o tempo, na posição referente ao efeito:
                let index = this.efeitosAplicados.indexOf(efeito);
                this.tempoRecebido[index] = millis();
                
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

                for (let inim of mundo.inimigos) {
                    inim.vida.dano = jogador.danoTiro;
                }
                // modificar a arma aqui
            }
        }

        // salva informações sobre efeitos temporarios:
        if (item.temporario == true) {
            // adiciona o id do item na pilha:       
            this.efeitosAplicados.push(item.id);
            // adiciona o momento em que foi pego:
            this.tempoEfeito.push(item.tempo * 1000);
            this.tempoRecebido.push(millis());
            console.log('logo apos receber '+this.tempoRecebido);       
        }
    }

    // remove o efeito aplicado, depois de um tempo determinado:
    removeEfeitos() {
        let drops = fita.drops;

        for (let i = this.efeitosAplicados.length - 1; i >= 0; i--) {
            let id = this.efeitosAplicados[i];
            // console.log('logo apos receber com i '+this.tempoRecebido[i]);

            // verifica se o tempo do efeito acabou:
            if (millis() - this.tempoRecebido[i] >= this.tempoEfeito[i]) {
                let drop = drops[id]
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

                        for (let inim of mundo.inimigos) {
                            inim.vida.dano = jogador.danoTiro;
                        }
                    }
                }
                
                this.efeitosAplicados.splice(i, 1);
                this.tempoEfeito.splice(i, 1);
                this.tempoRecebido.splice(i, 1);
            }
            
        }

        // desativa escudo, caso perca todo os pontos:
        for (let i = this.efeitosAplicados.length - 1; i >= 0; i--) {
            let id = this.efeitosAplicados[i];
            
            // remove o efeito de escudo
            if (drops[id].nome === "Escudo de Energia" && this.vida.temEscudo == false) {
                console.log("removido");
                // this.vida.temEscudo = false;
                this.efeitosAplicados.splice(i, 1);
                this.tempoEfeito.splice(i, 1);
                this.tempoRecebido.splice(i, 1);
            }                
        }
    }

    // mantém a contagem de tempo estável, mesmo se o jogo for pausado:
    updateTemposEfeitos(intervalo = 0) {
        for (let i = 0; i < this.tempoRecebido.length; i++) {
            this.tempoRecebido[i] += intervalo;
        }
    }
    // ==================================================
    // Métodos de controle de ataque:
    
    // recebe todas as informações sobre o projetil e tipo de disparo:
    setupAtaque() {
        this.projetilInfo = fita.projeteis.jogador[this.projetil]

        this.projeteis = []; // Array para armazenar os projeteis
        this.danoTiro = this.projetilInfo.dano;
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
        if (keyIsDown(32) && !this.estaAtirando()) {
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
                largura: this.projetilLargura
            });

            this.projeteis.push(projetil);
            this.tirosRestantes--;
            this.ultimoDisparo = agora;
            
            // som do disparo:
            somProjetil.setVolume(0.05);
            somProjetil.play();
        
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
    // Métodos verificadores de posição:
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
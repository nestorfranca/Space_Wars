class Drop {
    constructor({ centerX, centerY, largura = 2, altura = 2}) {
        // atributos de posição:
        this.centerX = centerX;
        this.centerY = centerY;
        this.largura = largura * escala;
        this.altura = altura * escala;
        this.velocidade = .5 * escala;
        
        // ==================================================
        // atributos de colisão:
        this.colisao = new Colisao({
            centerX: this.centerX,
            centerY: this.centerY,
            largura: this.largura,
            altura: this.altura,
            // precisao: 2.0
        });
        
        // ==================================================
        // atributos de drops:
        this.drops = fita.drops;
        this.deletado = false;
        
        this.id = this.sorteiaDrop(this.drops);
        
        // informações do drop escolhido:
        this.imagem = this.drops[this.id].imagem
        this.nome = this.drops[this.id].nome;
        this.tipo = this.drops[this.id].tipo;
        this.temporario = this.drops[this.id].temporario;
        this.tempo = this.drops[this.id].tempo;
        this.acumula = this.drops[this.id].acumula;
        this.raridade = this.drops[this.id].raridade;
        this.efeitos = this.drops[this.id].efeitos;

        // ==================================================
        // inicialização do atributos dinâmicos:
        this.setup();
    }

    // mecanismo de seleção aleatória dos drops:
    sorteiaDrop(drops) {
        let somaDasRaridades = drops.reduce((soma, drop) => soma + drop.raridade, 0);

        // definindo um valor aleatório, de 0 a [soma total das raridades]:
        let gatilho = random(somaDasRaridades);

        for (let drop of drops) {
            // gatilho é decrementa pelo valor de raridade de cada item:
            gatilho -= drop.raridade;

            // no momento que o gatilho zerar, retorna o id do ultimo drop testado:
            if (gatilho <= 0) {
                return drop.id;
            }
        }

    }

    // atualiza os elementos do drop no canvas:
    update() {
        this.move();
        this.setup();
        this.draw();
    }

    // configuração dos elementos dinâmicos
    setup() {
        this.colisao.setPos(this.centerX, this.centerY);
        this.colisao.update();
    }

    // desenha o drop no canvas:
    draw() {
        push();
        imageMode(CENTER);
        for (let drop of this.drops) {
            if (drop.id == this.id) {
                image(imagemDrops[this.id], this.centerX, this.centerY, this.largura, this.altura);
            }
        }
        pop();
    }

    // movimenta o drop no eixo y:
    move() {
        this.centerY += this.velocidade;
    }

    // marca o drop para ser deletado:
    deleta() {
        this.deletado = true;
    }

}
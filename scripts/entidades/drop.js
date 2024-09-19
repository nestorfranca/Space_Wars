class Drop extends Entidade {
    constructor({ centerX, centerY, largura = 2, altura = 2, velocidade = 0.4 }) {
        super(centerX, centerY, largura, altura, velocidade);
        
        // atributos gerais:
        this.velocidade = velocidade * escala;

        // ==================================================
        // atributos de drops:
        this.drops = fita.drops;
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
        super.update();

        this.move();
    }


    // desenha o drop no canvas:
    draw() {
        for (let drop of this.drops) {
            if (drop.id == this.id) {
                this.imagem = imagemDrops[this.id];
            }
        }

        super.draw();
    }

    // movimenta o drop no eixo y:
    move() {
        this.centerY += this.velocidade;
    }
}
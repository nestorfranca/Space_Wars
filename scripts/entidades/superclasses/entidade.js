class Entidade {
    constructor(centerX, centerY, largura, altura, velocidade) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.largura = largura * escala;
        this.altura = altura * escala;
        this.velocidadeX = velocidade * escala;
        this.velocidadeY = velocidade * escala;
        
        // ==================================================
        // atributos de colisão:
        this.precisao = 1.0;
        this.deletado = false;
    }

    setup() {
        this.colisao = new Colisao({
            centerX: this.centerX,
            centerY: this.centerY,
            largura: this.largura,
            altura: this.altura,
            precisao: this.precisao
        });
    }

    //  controle de elementos dinâmicos:
    setPos() {
        this.x = this.centerX - this.largura / 2;   
        this.y = this.centerY - this.altura / 2;

        this.colisao.setPos(this.centerX, this.centerY);
        this.colisao.update();
    }

    draw() {
        push();
            imageMode(CENTER);
            this.imagem.resize(0, this.altura);
            image(this.imagem, this.centerX, this.centerY, this.imagem.width, this.imagem.height);
        pop();
    }

    update() {
        this.setPos();
        this.draw();
    }


    // marca a entidade para ser deletada:
    deleta() {
        this.deletado = true;
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
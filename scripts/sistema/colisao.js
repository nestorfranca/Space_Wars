class Colisao {
    constructor({ centerX, centerY, largura, altura, precisao = 1.0 }) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.precisao = precisao

        this.largura = largura;
        this.altura = altura;
        
        this.ativado = true;
        
        this.setup();
    }
    //Ajusta as dimensões do hitbox
    setup() {
        this.larguraAjustada = this.largura * this.precisao;
        this.alturaAjustada = this.altura * this.precisao;
        
        // Calcula o centro da hitBox
        this.x = this.centerX - (this.larguraAjustada) / 2;
        this.y = this.centerY - (this.alturaAjustada) / 2;
    }
    
    // atualiza as informações de colisão:
    update() {
        this.setup();
    }

    // atualiza a posição da hitbox:
    setPos(x, y) {
        this.centerX = x;
        this.centerY = y;
    }

    updatePrecisao(precisao) {
        this.precisao = precisao;
    }

    // exibe a hitbox do objeto, para fins de teste:
    drawHitBox() {
        push();
        fill(100, 100, 100, 50);
        rectMode(CENTER);
        rect(this.centerX, this.centerY, this.larguraAjustada, this.alturaAjustada);
        pop();
    }

    // ativa a colisão:
    ativa() {
        this.ativado = true;
    }
    
    // desativa a colisão:
    desativa() {
        this.ativado = false;
    }

    // verifica a colisão dos objetos de acordo com os seus hitbox:
    colide(hitBoxColisor) {
        this.setup();

        if (this.ativado) {
            let objetoX = this.x;
            let objetoY = this.y;
            let objetoLargura = this.larguraAjustada;
            let objetoAltura = this.alturaAjustada;
    
            let colisorX = hitBoxColisor.x;
            let colisorY = hitBoxColisor.y;
            let colisorLargura = hitBoxColisor.larguraAjustada;
            let colisorAltura = hitBoxColisor.alturaAjustada;
    
            const colisao = collideRectRect(
                objetoX, objetoY, objetoLargura, objetoAltura,
                colisorX, colisorY, colisorLargura, colisorAltura,
            );
            
            return colisao;
        }
    }

    // verifica se o objeto saiu da tela horizontalmente:
    saiuTelaX() {
        // checa sem o fator de precisão alterado da hitbox:
        let maxX = this.centerX + this.largura/2;
        let minX = this.centerX - this.largura/2;

        if (maxX < mundo.getMinX()) {   // saiu pela parede esquerda
            // console.log("esquerda");
            return -1;
        }

        if (minX > mundo.getMaxX()) {   // saiu pela parede direita
            // console.log("direita");
            return 1;
        }

        return 0;   // está em quadro
    }

    // verifica se o objeto saiu da tela verticalmente:
    saiuTelaY() {
        // remove o fator de precisão alterado da hitbox:
        let maxY = this.centerY + this.altura/2;
        let minY = this.centerY - this.altura/2;

        if (maxY < mundo.getMinY()) {   // saiu pela parede superior
            // console.log("cima");
            return -1;
        }

        if (minY > mundo.getMaxY()) {   // saiu pela parede inferior
            // console.log("baixo");
            return 1;
        }

        return 0;   // está em quadro
    }

    // ==================================================
    // Métodos Acessores:
    getMinX() {
        return this.x;
    }

    getMaxX() {
        return this.x + this.larguraAjustada;
    }

    getMinY() {
        return this.y;
    }

    getMaxY() {
        return this.y + this.alturaAjustada;
    }

    getCenterX() {
        return this.centerX;
    }

    getCenterY() {
        return this.centerY;
    }
}
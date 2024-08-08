 
class Projetil {
    constructor({ centerX, centerY, largura = 0.5, altura = 2, id = 0, velocidade, tiroInimigo=false }) {
        // atributos de posição:
        this.centerX = centerX;
        this.centerY = centerY;
        this.largura = largura * escala;
        this.altura = altura * escala;
        this.projeteis = fita.projeteis;
        this.tiroInimigo = tiroInimigo;
        this.velocidade = velocidade * escala;
        
        // ==================================================
        // atributos de colisão:
        this.colisao = new Colisao({
            centerX: this.centerX,
            centerY: this.centerY,
            largura: this.largura,
            altura: this.altura
        });
        
        this.deletado = false;
        
        // ==================================================
        // atributos de projetil:
        this.projeteis = fita.projeteis;
        this.id = id;

        // ==================================================
        // atributos dinâmicos
        this.setup();
    }

    // controle de elementos dinâmicos:
    setup() {
        
        this.x = this.centerX - this.largura / 2;
        this.y = this.centerY - this.altura / 2;
        this.colisao.setPos(this.centerX, this.centerY);
        this.colisao.update();

    }

    // atualiza as informações de projétil:
    update() {
        this.move();
        this.setup();
        this.draw();
    }

    // exibe a imagem do projétil:
    draw() {
        push();
        imageMode(CENTER);
        if (this.tiroInimigo) {
            image(imagemProjetilInimigo, this.centerX, this.centerY, this.largura*1.5, this.altura);
        } else {
            //Diz qual projetil será usado 
            if(jogador.projetil == 0){
                image(imagemProjetil[jogador.projetil], this.centerX, this.centerY, this.largura, this.altura);  
            }else{
                let imagem = imagemProjetil[jogador.projetil]; 
                image(imagemProjetil[jogador.projetil], this.centerX, this.centerY, (imagem.width/1500) * escala, (imagem.height/1500) * escala);     
            }
        }
        pop();
    }    

    // atualiza o movimento do projétil:
    move() {
        if (this.tiroInimigo == true){
            this.centerY += this.velocidade;
        } else {
            this.centerY -= this.velocidade;
        }
    }    

    // marca o projétil para ser deletado:
    deleta() {
        this.deletado = true;
    }
}

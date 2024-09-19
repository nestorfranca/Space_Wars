 
class Projetil extends Entidade {
    constructor({ centerX, centerY, largura = 0.5, altura = 2, velocidade, id = 0, dano = 1, tiroInimigo = false }) {
        super(centerX, centerY, largura, altura, velocidade);

        // atributos gerais:
        this.velocidade = velocidade * escala;

        // ==================================================
        // atributos de projetil:
        this.projeteis = fita.projeteis;
        this.id = id;
        this.dano = dano;
        this.tiroInimigo = tiroInimigo;
        
        this.imagem;
        if (this.tiroInimigo == true) {
            this.imagem = imagemProjetil.inimigo[this.id].get();
            this.largura = this.largura*1.5;
        } else {
            this.imagem = imagemProjetil.jogador[this.id].get();

            //Diz qual projetil será usado 
            if (this.id == 0) {
                this.largura = largura * escala;
                this.altura = altura * escala;
            } else {
                let imagem = this.imagem; 

                this.largura = (imagem.width/1500) * escala;
                this.altura = (imagem.height/1500) * escala;
            }
        }
        
        // ==================================================
        // atributos dinâmicos
        this.setup();
    }

    // atualiza as informações de projétil:
    update() {
        super.update();

        this.move();
    }

    // exibe a imagem do projétil:
    draw() {

        super.draw();
    }    

    // atualiza o movimento do projétil:
    move() {
        if (this.tiroInimigo == true){
            this.centerY += this.velocidade;
        } else {
            this.centerY -= this.velocidade;
        }
    }    
}

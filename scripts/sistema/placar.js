class Placar {
    constructor() {
        this.posX = mundo.largura + 4 * escala;
        this.posY = 0; //mundo.largura + 4 *escala;
        
        this.recorde = fita.pontuacao.pontuacaoRecorde;
        this.pontos = fita.pontuacao.pontuacaoAtual;
        this.abates = 0;
    }

    // exibe os elementos do Placa:
    draw() {
        push();
        // console.log(height);
        textFont(fontEmpanada);
        fill('white');

        // Informações de recordes (futuramente)
        // textSize(2 * escala);
        // text('Recorde: ', (this.posX + 0.1 * escala), 6 * escala);
        // text(this.recorde, (this.posX + 0.1 * escala) + 12 * escala, 6 * escala);

        textSize(5 * escala);
        textStyle(BOLD);
        text('_________________', this.posX, 7 * escala)
        text('Score: ', this.posX, 12.5 * escala);
        text(this.pontos, this.posX + 12 * escala, 12.5 * escala);

        fill('#9944ff');
        textSize(3 * escala);
        text('Abates: ', this.posX, 16 * escala);
        text(this.abates, this.posX + 12 * escala, 16 * escala);
        pop();
    }

    atualizaRecorde() {
        if (this.recorde > fita.pontuacao.pontuacaoRecorde) {
            httpPost(
                'fita/fita.json',
                'json',
                this.recorde,
                function (result) {
                    // ... won't be called
                },
                function (error) {
                    // ... won't be called
                }
            );
        }
    }
    
    aumentoPontos(pontos) {
        this.pontos += pontos;

        if (this.pontos > this.recorde) {
            this.recorde = this.pontos;
        }
    }

    aumentaAbates() {
        this.abates++;
    }

}
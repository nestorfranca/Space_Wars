class Hud {
    constructor() {
        // instancia a classe Placar:
        placar = new Placar();
    }

    // exibe elementos do HUD:
    draw() {
        // desenha o HUD:
        push();
        image(imagemHUD, mundo.largura, 0, (width - mundo.largura), height);
        pop();

        // exibe placar:
        placar.draw();

        // tabela de informações dos itens coletáveis:
        let posicaoX = mundo.largura + (2.5 * escala);
        let posicaoY = mundo.altura / 3;
        this.drops = fita.drops;
        for (let i = 0; i < 4; i++) {
            image(imagemDrops[i], posicaoX, posicaoY, 2.5 * escala, 2.5 * escala);
            push();
            fill('white');
            textSize(2 * escala);
            text(' ' + this.drops[i].nome, posicaoX + (3 * escala), posicaoY + (1.9 * escala));
            pop();
            posicaoY += 3 * escala;
        }

        // mostra a lista de efeitos aplicados com suas durações.
        push();
        fill('white');
        textSize(3 * escala);
        text('Efeitos aplicados: ', posicaoX, mundo.altura / 2);
        pop();

        let newposicaoY = mundo.altura / 2;
        for (let efeito of jogador.efeitosAplicados) {
            push();
            fill('white');
            textSize(2 * escala);
            image(imagemDrops[efeito], posicaoX, newposicaoY + (1.5 * escala), 2.5 * escala, 2.5 * escala);
            let index = jogador.efeitosAplicados.indexOf(efeito);

            let tempoRestante = round((jogador.tempoEfeito[index] - (millis() - jogador.tempoRecebido[index])) / 1000).toString().padStart(2, '0');
            text(`00:${tempoRestante}`, posicaoX + (5 * escala), newposicaoY + (3.5 * escala));
            pop();
            newposicaoY += 3 * escala;
        }
    }
}
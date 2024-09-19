class MenuInicial {
    constructor() {

        // instancia botão "Iniciar":
        this.botaoIniciar = new BotaoGerenciador({
            texto: 'Iniciar',
            x: canvasWidth / 2,
            y: canvasHeight / 1.6,
            proximaTela: 'jogo',
            continue_: false
        });
    }

    // atualiza os elementos de Menu Inicial:
    update() {
        this.draw();
        this.botaoIniciar.setPos();
        this.botaoIniciar.update();
    }

    // exibe os elementos de Menu Inicial: 
    draw() {
        this.imagemDeFundo();
        this.texto();
    }

    // imagem do Menu Inicial
    imagemDeFundo() {
        image(imagemTelaInicial, 0, 0, width, height);
    }

    // Montagem do Título do Jogo
    texto() {
        push();
        textFont(fontEmpanada);
        fill('red');
        textAlign(CENTER);
        textSize(20.3*escala);
        text('Space Wars', width / 2, height / 2.5);
        fill('white');
        textAlign(CENTER);
        textSize(20.0*escala);
        text('Space Wars', width / 2, height / 2.5);
        pop();
    }
}
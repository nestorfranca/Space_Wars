class Pause {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // ==================================================
        // inicializa os atributos botões com 'null':
        this.botaoContinuar = null;
        this.botaoReiniciar = null;
        this.botaoMenuInicial = null;
    }


    
    // exibe os botões do menu Pause:
    draw() {
        jogador.updateTemposEfeitos();

        // botões são criados apenas uma única vez
        if (this.botaoMenuInicial == null && this.botaoReiniciar == null && this.botaoContinuar == null) {
            this.criaBotoes();
        }    
        
        // uma vez instanciados, atualiza seus parâmetros:
        if (this.botaoMenuInicial !== null && this.botaoReiniciar !== null && this.botaoContinuar !== null) {
            this.botaoContinuar.update();
            this.botaoReiniciar.update();
            this.botaoMenuInicial.update();
        }
    }

    // cria os botões do menu Pause:
    criaBotoes() {
        // criação do menu só é feita dentro da tela de 'Jogo', quando a flag de pause está ativa:
        if (jogo !== null && jogo.pausaJogo) {
            // console.log('aqui estou');
            
            // janela de menu Pause:
            push();
                rectMode(CENTER);
                fill('#0a1f48');
                rect(this.x, this.y, 35*escala, 55*escala, 2*escala);
            pop();
            
            // instância dos botões do menu Pause:
            this.botaoContinuar = new BotaoGerenciador({
                texto: 'Continue',
                x: mundo.largura / 2,
                y: mundo.altura / 3,
                proximaTela: 'jogo',
                continue_: true
            });
            
            this.botaoReiniciar = new BotaoGerenciador({
                texto: 'Reiniciar',
                x: mundo.largura / 2,
                y: mundo.altura / 2,
                proximaTela: 'jogo',
                continue_: false
            });
            
            this.botaoMenuInicial = new BotaoGerenciador({
                texto: 'Menu Inicial',
                x: mundo.largura / 2,
                y: mundo.altura / 1.5,
                proximaTela: 'menuInicial',
                continue_: false
            });
            
        }
    }
    
    // remove botões da tela e suas instâncias
    apagarBotao(){
        let botoes = selectAll('.botao');
        for (let botao of botoes) {
          botao.remove();
        }
        
        this.botaoContinuar = null;
        this.botaoReiniciar = null;
        this.botaoMenuInicial = null;
    }
}
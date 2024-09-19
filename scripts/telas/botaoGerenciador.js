
class BotaoGerenciador {
    constructor({ texto, x, y, proximaTela, continue_ = false }) {
        // atributos de posição
        this.texto = texto;
        this.x = x;
        this.y = y;

        // ==================================================
        // atributos de comportamento:
        this.proximaTela = proximaTela;     // qual instancia de tela será chamado após apertar o botão
        
        this.continue_ = continue_;         // necessário para que botão não "destrua" a instancia da tela anterior

        // ==================================================
        // atributos dinâmicos:
        this.setup();
    }

    // inicializa e cria botão, além de adicionar seu comportamento:
    setup() {
        this.botao = createButton(this.texto);
        this.botao.mousePressed(() => this.alteraCena());
        this.botao.addClass('botao');
        
        // chama a estilização do botão:
        styleButton(this.botao)

        // desenha botão
        this.draw();
    }

    // atualiza os elemtntos de botão:
    update() {
        this.setPos();
        this.draw();
    }

    // ajusta posição do botão:
    setPos() {

        // botão é um elemento externo ao canvas, portanto é necessário 
        // definir uma nova referência de origem:
        let canvasX = canvas.position().x;
        let canvasY = canvas.position().y;

        // verifica as dimensões reais do botão, após a estilização:
        let buttonLargura = this.botao.elt.offsetWidth;
        let buttonAltura = this.botao.elt.offsetHeight;

        // define a posição do centro do botão, de acordo com a nova origem:
        this.centerX = canvasX + (this.x - buttonLargura / 2);
        this.centerY = canvasY + (this.y - buttonAltura / 2);
    }

    draw() {
        // posiciona botão na tela:
        this.botao.position(this.centerX, this.centerY);
    }

    // define o comportamento de alternar entre as telas do botão:
    alteraCena() {

        // remove todos os elementos de classe 'botao' criados:
        let botoes = selectAll('.botao');
        for (let botao of botoes) {
            botao.remove();
        }

        // se jogo estiver instanciado, reinicia ações relacionadas ao "Pause":
        if (jogo !== null) {
            despausar();
            // pause.apagarBotao();
            // jogo.pausaJogo = false; 
        }
        
        // retorna a instancia atual, sem "destruí-la":
        if (this.continue_) {
            return;
        }

        // "destroi" instancia da tela anterior e define a proxima tela:
        destroiClasse(telaAtual);
        // console.log(telaAtual);
        telaAtual = this.proximaTela;

        // para a música caso mude para a tela inicial ou o jogo seja reiniciado 
        if(this.proximaTela == 'jogo'){
            // music.stop();
        }else if(this.proximaTela == 'menuInicial'){
            // music.stop();
        }

        // console.log(telaAtual);
    }
}

// estilização de botão:
function styleButton(btn) {
  btn.style('font-family', 'Empanada, cursive');
  btn.style('padding', `${escala * .1}rem ${escala * .10}rem`);
  btn.style('font-size', `${escala * .25}rem`);
  btn.style('letter-spacing', `${escala * .03}rem`);
  btn.style('box-shadow', '2px 2px 0px 1px #000000');
  // btn.style('text-transform', 'uppercase');
  btn.style('background-color', '#873cb9');
  btn.style('border', 'none');
  btn.style('border-radius', `${escala * .075}rem`);
  btn.style('color', '#fff');
}
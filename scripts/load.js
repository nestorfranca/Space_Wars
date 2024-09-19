function preload() {
    // load the images here
    imagemJogador = loadImage("img/jogador/player.png");
    imagemJogadorDano = loadImage("img/jogador/player-dano2.png");
    imagemInimigo = loadImage("img/inimigo/enemy.png");
    imagemInimigoDano = loadImage("img/inimigo/enemy-dano2.png");
    imagemChefe = loadImage("img/inimigo/chefe1.png");
    imagemChefeDano = loadImage("img/inimigo/chefe1-dano2.png");
    imagemModulos = loadImage("img/jogador/modulo.png")

    imagemFundo = loadImage("img/background.jpg");
    imagemGameOver = loadImage("img/game-over.png");
    imagemYouWin = loadImage("img/youwin.png");
    imagemTelaInicial = loadImage("img/tela_inicial.jpg");
    imagemEscudo = loadImage("img/spr_escudo.png");

    imagemHUD = loadImage("img/interface/frame2(2).png");

    imagemDrops = [
        loadImage("img/drops/image24.png"),
        loadImage("img/drops/image25.png"),
        loadImage("img/drops/image28.png"),
        loadImage("img/drops/image27.png"),
        loadImage("img/drops/image26.png")
        // loadImage("img/drops/skills.png")
    ];

    fita = loadJSON("fita/fita.json");
    fontEmpanada = loadFont('fonts/Empanada-Extended/Empanada.otf');

    imagemProjetil = {
        "jogador": [
            loadImage("img/projetil.png"),
            loadImage("img/tiro_duplo.png"),
        ],
        "inimigo": [
            loadImage("img/projetiInimigo.png")
        ]
    };
    
    // imagemProjetilInimigo = loadImage("img/projetiInimigo.png");
    somProjetil = loadSound("sounds/snd_projetil.wav");
    music = loadSound('sounds/kill_screen.mp3');     // Carrega a música
}
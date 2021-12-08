// Jogo da Cobra (Snake Game)
// Autor: Jan Bodnar
// Adaptado por: Gilson Pereira
// Código fonte original: http://zetcode.com/javascript/snake/

// declaração de variáveis e constantes

//sons
const somMordida = new Audio("./audio/comeu.mp3"); //quando come a maçã
const somFimDeJogo = new Audio("./audio/fim.mp3"); //quando termina o jogo (fim de vidas ou fim de tempo)
const somVitoria = new Audio("./audio/win.mp3"); //quando ganha o jogo
const somObstaculo = new Audio("./audio/obs.mp3"); //quando colide com o tnt
const somJogo = new Audio("./audio/bgm.mp3"); //durante todo o jogo

//ctx
var apresentacao; //ctx2
var tela; //ctx
var dados; //ctx3

//ctx
var ctx; //tela
var ctx2; //apresentacao
var ctx3; //dados

var nome;

//imagens
var snake;
var tnt;
var cabeca;
var bola;
var pontos;
var maca;

var vida = 5;
var pontuacao = 0;
var aumentaVida = 0;

var player = " ";
var playerPontuacao;

var jogadores;

if (!localStorage.getItem("jogador")) { //retornará o seu valor
  jogadores = {
    nomes: [],
    pontos: [],
  };

  localStorage.setItem("jogador", JSON.stringify(jogadores)); //adicionar chave ao storage, ou atualizar caso a chave já exista
} else {
  jogadores = JSON.parse(localStorage.getItem("jogador"));
}

var numMacas = 15;
var numObstaculos = 10;
var segundos = 80;
var maca_x;
var maca_y;
var tnt_x;
var tnt_y;

var paraEsquerda = false;
var paraDireita = true;
var paraCima = false;
var paraBaixo = false;
var noJogo = true;

const TAMANHO_PONTO = 10;
const ALEATORIO_MAXIMO = 59; //quantidade de quadrados que a maçã pode spawnar
var ATRASO = 75;
const C_ALTURA = 600;
const C_LARGURA = 600;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;
const TECLA_ABAIXO = 40;

var x = [];
var y = [];
var i = [];
var macaX = []; // vetor maca X
var macaY = []; // vetor maca y
var tntX = []; // vetor tnt x
var tntY = []; // vetor tnt y
onkeydown = verificarTecla; // Define função chamada ao se pressionar uma tecla

iniciar(); // Chama função inicial do jogo

function iniciar() {
  apresentacao = document.getElementById("apresentacao");
  tela = document.getElementById("tela");
  dados = document.getElementById("dados");

  ctx = tela.getContext("2d");
  ctx2 = apresentacao.getContext("2d");
  ctx3 = dados.getContext("2d");

  ctx2.fillStyle = "black";
  ctx.fillStyle = "black";
  ctx3.fillStyle = "black";

  ctx2.fillRect(0, 0, C_LARGURA, C_ALTURA);
  ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);
  ctx3.fillRect(0, 0, C_LARGURA, C_ALTURA);

  carregarImagens();
  directionSnake();
  criaPlacar();
  infos();
  criarCobra();
  localizarMaca();
  localizarTNT();
  somJogo.play();
  setTimeout("cicloDeJogo()", ATRASO);
}

function carregarImagens() {
  cabeca = new Image();
  cabeca.src = "cabeca.png";

  ponto = new Image();
  ponto.src = "ponto.png";

  maca = new Image();
  maca.src = "maca.png";

  tnt = new Image();
  tnt.src = "tnt.png";

  snake = new Image();
  snake.src = "snake.png";

  coracao = new Image();
  coracao.src = "fullHeart.png";

  primeiroLugar = new Image();
  primeiroLugar.src = "primeiroLugar.png";

  segundoLugar = new Image();
  segundoLugar.src = "segundoLugar.png";

  terceiroLugar = new Image();
  terceiroLugar.src = "terceiroLugar.png";
}

function criarCobra() {
  pontos = 5;

  for (var z = 0; z < pontos; z++) {
    var a = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    x[z] = a * TAMANHO_PONTO;

    a = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    y[z] = a * TAMANHO_PONTO;
  }
}

function localizarMaca() {
  for (var i = 0; i < numMacas; i++) {
    var r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    macaX[i] = r * TAMANHO_PONTO;

    r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    macaY[i] = r * TAMANHO_PONTO;
  }
}

function localizarTNT() {
  for (var j = 0; j < numObstaculos; j++) {
    var r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    tntX[j] = r * TAMANHO_PONTO;

    r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    tntY[j] = r * TAMANHO_PONTO;
  }
}

function cicloDeJogo() {
  if (noJogo) {
    vidas();
    verificarMaca();
    verificarTNT();
    verificarColisao();
    mover();
    fazerDesenho();
    setTimeout("cicloDeJogo()", ATRASO);
  } else {
      if(aumentaVida === numMacas) win();
      else fimDeJogo()
    }
}

function verificarTNT() {
  for (j = 0; j < numObstaculos; j++) {
    if (x[0] == tntX[j] && y[0] == tntY[j]) {
      vida--;
      pontos--;
      pontuacao--;
      tntX[j] = 630;
      somObstaculo.play();
      if (vida == 0) {
        noJogo = false
      }
      ATRASO = ATRASO - 5;
    }
  }
}

function verificarMaca() {
  for (i = 0; i < numMacas; i++) {
    if (x[0] == macaX[i] && y[0] == macaY[i]) {
      pontos++;
      macaX[i] = 630;
      somMordida.play();
      pontuacao++;
      aumentaVida++;

      if (aumentaVida % 3 == 0) { //para quando comer 3 maçãs consecutivas, ganhar 1 vida
        vida++;
      }

      if (aumentaVida == numMacas) { //para quando comer todas as maçãs, ganhar o jogo
          noJogo = false
      }
      ATRASO = ATRASO - 3;
    }
  }
}

function verificarColisao() {
  for (var z = pontos; z > 0; z--) {
    if (z > 4 && x[0] == x[z] && y[0] == y[z]) {
              noJogo = false
    }
  }

  if (y[0] >= C_ALTURA) {
    y[0] = 0;
    noJogo = true;
  }

  if (y[0] < 0) {
    y[0] = 600; //altura
    noJogo = true;
  }

  if (x[0] >= C_LARGURA) {
    x[0] = 0;
    noJogo = true;
  }

  if (x[0] < 0) {
    x[0] = 600; //largura
    noJogo = true;
  }
}

function mover() {
  for (var z = pontos; z > 0; z--) {
    x[z] = x[z - 1];
    y[z] = y[z - 1];
  }

  if (paraEsquerda) {
    x[0] -= TAMANHO_PONTO;
  }

  if (paraDireita) {
    x[0] += TAMANHO_PONTO;
  }

  if (paraCima) {
    y[0] -= TAMANHO_PONTO;
  }

  if (paraBaixo) {
    y[0] += TAMANHO_PONTO;
  }
}

function fazerDesenho() {
  ctx3.clearRect(0, 0, C_LARGURA / 4, C_ALTURA / 4);
  ctx3.fillRect(0, 0, C_LARGURA / 4, C_ALTURA / 4);
  ctx3.drawImage(coracao, C_LARGURA / 9, C_ALTURA / 1.5);


  ctx2.clearRect(0, 0, C_LARGURA / 4, C_ALTURA / 4);
  ctx2.fillRect(0, 0, C_LARGURA / 4, C_ALTURA / 4);
  ctx2.drawImage(snake, C_LARGURA / 5.5, C_ALTURA / 5);

  criaPlacar();
  cronometro();

  if (noJogo) {
    ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

    for (i = 0; i < numMacas; i++) {
      ctx.drawImage(maca, macaX[i], macaY[i]);
    }
    for (j = 0; j < numObstaculos; j++) {
      ctx.drawImage(tnt, tntX[j], tntY[j]);
    }

    for (var z = 0; z < pontos; z++) {
      if (z == 0) {
        ctx.drawImage(cabeca, x[z], y[z]);
      } else {
        ctx.drawImage(ponto, x[z], y[z]);
      }
    }
  }
}

function fimDeJogo() {
  noJogo = false;

  ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
  ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

  ctx.fillStyle = "red";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = "normal bold 60px serif";
  somJogo.pause();
  somFimDeJogo.play();
  ctx.fillText("GAME OVER!", C_LARGURA / 2, C_ALTURA / 2);

  adicionarJogador();
  setTimeout(ranking, 1000);
}

function verificarTecla(e) {
  var tecla = e.keyCode;

  if (tecla == TECLA_ESQUERDA && !paraDireita) {
    paraEsquerda = true;
    paraCima = false;
    paraBaixo = false;
  }

  if (tecla == TECLA_DIREITA && !paraEsquerda) {
    paraDireita = true;
    paraCima = false;
    paraBaixo = false;
  }

  if (tecla == TECLA_ACIMA && !paraBaixo) {
    paraCima = true;
    paraDireita = false;
    paraEsquerda = false;
  }

  if (tecla == TECLA_ABAIXO && !paraCima) {
    paraBaixo = true;
    paraDireita = false;
    paraEsquerda = false;
  }
}

function criaPlacar() {
  ctx3.font = "normal bold 30px serif"; // quantidade de pixels e tamanho da fonte
  ctx3.textAlign = "center"; // localização da fonte
  ctx3.fillStyle = "white"; // cor da fonte
  ctx3.fillText("Pontos: " + pontuacao, C_LARGURA / 4, C_ALTURA / 2.4); // o que vai ser exibido e posição
  ctx3.fillStyle = "black";
}

function vidas() {
  ctx3.fillStyle = "black";
  ctx3.fillRect(0, 0, 300, 600);
  ctx3.font = "normal bold 30px serif"; // quantidade de pixels e tamanho da fonte
  ctx3.textAlign = "center"; // localização da fonte
  ctx3.fillStyle = "white"; // cor da fonte
  ctx3.fillText("Vidas: " + vida, C_LARGURA / 4, C_ALTURA / 1.5); // o que vai ser exibido e posição
  ctx3.fillStyle = "black";
}

function infos() {
  ctx2.textAlign = "center"; // localização da fonte
  ctx2.fillStyle = "green"; // cor da fonte
  ctx2.font = "normal bold 30px serif";
  ctx2.fillText("SNAKE GAME", C_LARGURA / 4, C_ALTURA / 2);
  ctx2.fillStyle = "white"; // cor da fonte
  ctx2.font = "normal bold 20px serif";
  ctx2.fillText("Iury e Yana", C_LARGURA / 4, C_ALTURA / 1.6);
  ctx2.fillStyle = "black";
}

function win() {
    ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "yellow";
  somJogo.pause();
  somVitoria.play();
  ctx.font = "normal bold 50px serif";
  ctx.fillText("CONGRATULATIONS", C_LARGURA / 2, C_ALTURA / 2);
  ctx.font = "normal bold 30px serif";
  ctx.fillText("YOU WON!", C_LARGURA / 2, C_ALTURA / 1.8);
  ctx.fillStyle = "black";
  adicionarJogador();
  setTimeout(ranking, 1000);
}

setInterval(cronometroLogic, 1000);

function cronometroLogic() {
  if (segundos > 0) {
    segundos--;
  } else if (segundos == 0) {
            // fimDeJogo();
            noJogo = false
  }
}

function cronometro() {
  ctx3.fillStyle = "white";
  ctx3.textBaseline = "top";
  ctx3.textAlign = "center";
  ctx3.font = "normal bold 30px serif";
  ctx3.fillText(`Tempo: ${segundos}s`, C_LARGURA / 4, C_ALTURA / 7);
  ctx3.fillStyle = "black";
}

function directionSnake() {
  //para a cobra nascer de cima p baixo e vice versa e de um lado p outro
  var direction = Math.round(Math.random() * 3);

  if (direction == 0) {
    paraEsquerda = false;
    paraDireita = false;
    paraCima = true;
    paraBaixo = false;
  } else if (direction == 1) {
    paraEsquerda = false;
    paraDireita = false;
    paraCima = false;
    paraBaixo = true;
  } else if (direction == 2) {
    paraEsquerda = false;
    paraDireita = true;
    paraCima = false;
    paraBaixo = false;
  } else if (direction == 3) {
    paraEsquerda = true;
    paraDireita = false;
    paraCima = false;
    paraBaixo = false;
  }
}

function adicionarJogador() {
  while (player.length != 3) {
    player = prompt("Nick com apenas 3 letras");
    playerPontuacao = pontuacao;
  }

  jogadores.nomes.push(player);
  jogadores.pontos.push(playerPontuacao);

  jogadores = ordem(jogadores);

  localStorage.setItem("jogador", JSON.stringify(jogadores));
}

function ranking() {
  ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
  ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

  var count = 64;

  for (var i = 0; i < 5; i++) {
    var nome = jogadores.nomes[i];
    var pontos = jogadores.pontos[i];
    var posicao = i + 1;

    ctx.fillStyle = "black";
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "normal bold 28px serif";
    if(aumentaVida === numMacas)  
    ctx.fillStyle = "red";
    else 
    ctx.fillStyle = "black";
    ctx.fillText(
      `${posicao}º  ${nome}  ${pontos}`,
      C_LARGURA / 2,
      C_ALTURA / 4 + count
    );

    count += 52;
  }
}

function ordem(jogadores) {
  var n = jogadores.pontos.length;

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      if (jogadores.pontos[j] < jogadores.pontos[j + 1]) {
        jogadores.pontos = alterna(jogadores.pontos, j);
        jogadores.nomes = alterna(jogadores.nomes, j);
      }
    }
  }
  return {
    pontos: jogadores.pontos.slice(0, 5),
    nomes: jogadores.nomes.slice(0, 5),
  };
}

function alterna(array, j) {
  var t = array[j];
  array[j] = array[j + 1];
  array[j + 1] = t;

  return array;
}

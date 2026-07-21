// scenes.js
// Banco de cenas do jogo. Cada cena tem um fundo (imagem ilustrada) e uma
// lista de "targets" — por enquanto só o Casimiro (estilo "Onde está Wally":
// um único personagem bem camuflado numa cena grande e detalhada). O array
// `targets` suporta mais de um item se o jogo voltar a ter vários alvos por
// cena no futuro.
//
// x/y são coordenadas no espaço de design da cena (mesmo valor de
// width/height). O jogo converte isso pra porcentagem na hora de
// renderizar, então funciona em qualquer tamanho de tela.
//
// `color` é usado só como fallback (círculo colorido com a inicial) caso a
// imagem em `thumb`/`background` ainda não exista ou falhe ao carregar —
// assim o jogo nunca quebra enquanto o estoque de artes está incompleto.
//
// Pra gerar as coordenadas de uma cena nova (ou reposicionar esta), use a
// ferramenta em editor/index.html: escolha o cenário, arraste cada
// personagem, redimensione e copie o código gerado pra cá.

const SCENES = [
  {
    id: "estudio-01",
    name: "Estúdio bagunçado",
    background: "assets/scenes/cenario-estudio.png",
    width: 2000,
    height: 1116,
    targets: [
      { characterId: "casimiro", name: "Casimiro", thumb: "assets/chars/casimiro.png", color: "#ff6b35", x: 280, y: 379, radius: 53 }
    ]
  },
  {
    id: "arquibancada-01",
    name: "Arquibancada bagunçada",
    background: "assets/scenes/cenario-arquibancada.png",
    width: 1500,
    height: 837,
    targets: [
      { characterId: "casimiro", name: "Casimiro", thumb: "assets/chars/casimiro.png", color: "#ff6b35", x: 160, y: 100, radius: 50 }
    ]
  },
  {
    id: "churrasco-01",
    name: "churrasco bagunçado",
    background: "assets/scenes/cenario-churrasco.png",
    width: 2000,
    height: 1116,
    targets: [
      { characterId: "casimiro", name: "Casimiro", thumb: "assets/chars/casimiro.png", color: "#ff6b35", x: 200, y: 613, radius: 53 }
    ]
  }
];

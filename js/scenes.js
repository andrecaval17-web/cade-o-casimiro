// scenes.js
// Banco de cenas do jogo. Cada cena tem um fundo (imagem ilustrada) e uma
// lista de "targets": todo personagem listado aqui precisa ser encontrado,
// não existem "figurantes".
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
      { characterId: "casimiro", name: "Casimiro", thumb: "assets/chars/casimiro.png", color: "#ff6b35", x: 19, y: 825, radius: 45 },
      { characterId: "luisinho", name: "Luisinho", thumb: "assets/chars/luisinho.png", color: "#ffe66d", x: 1513, y: 608, radius: 40 },
      { characterId: "beltrao", name: "Beltrão", thumb: "assets/chars/beltrao.png", color: "#ff6f91", x: 1798, y: 66, radius: 40 },
      { characterId: "donan", name: "Donan", thumb: "assets/chars/donan.png", color: "#a78bfa", x: 198, y: 1116, radius: 40 },
      { characterId: "chicomoedas", name: "Chico Moedas", thumb: "assets/chars/chicomoedas.png", color: "#f6c744", x: 140, y: 413, radius: 40 },
      { characterId: "igor", name: "Igor", thumb: "assets/chars/igor.png", color: "#4ecdc4", x: 1160, y: 949, radius: 40 }
    ]
  },
  {
    id: "arquibancada-01",
    name: "Arquibancada bagunçada",
    background: "assets/scenes/cenario-arquibancada.png",
    width: 1500,
    height: 837,
    targets: [
      { characterId: "casimiro", name: "Casimiro", thumb: "assets/chars/casimiro.png", color: "#ff6b35", x: 803, y: 627, radius: 42 },
      { characterId: "luisinho", name: "Luisinho", thumb: "assets/chars/luisinho.png", color: "#ffe66d", x: 45, y: 149, radius: 30 },
      { characterId: "beltrao", name: "Beltrão", thumb: "assets/chars/beltrao.png", color: "#ff6f91", x: 1473, y: 548, radius: 30 },
      { characterId: "donan", name: "Donan", thumb: "assets/chars/donan.png", color: "#a78bfa", x: 921, y: 404, radius: 30 },
      { characterId: "chicomoedas", name: "Chico Moedas", thumb: "assets/chars/chicomoedas.png", color: "#f6c744", x: 562, y: 187, radius: 40 },
      { characterId: "igor", name: "Igor", thumb: "assets/chars/igor.png", color: "#4ecdc4", x: 1133, y: 485, radius: 30 }
    ]
  },
  {
    id: "churrasco-01",
    name: "churrasco bagunçado",
    background: "assets/scenes/cenario-churrasco.png",
    width: 2000,
    height: 1116,
    targets: [
      { characterId: "casimiro", name: "Casimiro", thumb: "assets/chars/casimiro.png", color: "#ff6b35", x: 1753, y: 611, radius: 75 },
      { characterId: "luisinho", name: "Luisinho", thumb: "assets/chars/luisinho.png", color: "#ffe66d", x: 823, y: 520, radius: 40 },
      { characterId: "beltrao", name: "Beltrão", thumb: "assets/chars/beltrao.png", color: "#ff6f91", x: 216, y: 328, radius: 40 },
      { characterId: "donan", name: "Donan", thumb: "assets/chars/donan.png", color: "#a78bfa", x: 1818, y: 272, radius: 40 },
      { characterId: "chicomoedas", name: "Chico Moedas", thumb: "assets/chars/chicomoedas.png", color: "#f6c744", x: 1226, y: 405, radius: 57 },
      { characterId: "igor", name: "Igor", thumb: "assets/chars/igor.png", color: "#4ecdc4", x: 1389, y: 168, radius: 40 }
    ]
  }
];

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
    width: 1600,
    height: 900,
    targets: [
      { characterId: "casimiro", name: "Casimiro", thumb: "assets/chars/casimiro.png", color: "#ff6b35", x: 420, y: 380, radius: 46 },
      { characterId: "chicomoedas", name: "Chico Moedas", thumb: "assets/chars/chicomoedas.png", color: "#f6c744", x: 1100, y: 210, radius: 42 },
      { characterId: "luisinho", name: "Luisinho", thumb: "assets/chars/luisinho.png", color: "#ffe66d", x: 780, y: 640, radius: 44 },
      { characterId: "donan", name: "Donan", thumb: "assets/chars/donan.png", color: "#a78bfa", x: 1300, y: 500, radius: 42 },
      { characterId: "beltrao", name: "Beltrão", thumb: "assets/chars/beltrao.png", color: "#ff6f91", x: 200, y: 150, radius: 42 },
      { characterId: "igor", name: "Igor", thumb: "assets/chars/igor.png", color: "#4ecdc4", x: 950, y: 720, radius: 48 }
    ]
  }
  // ... demais cenas, cada uma com seu próprio elenco de 6-8 personagens
];

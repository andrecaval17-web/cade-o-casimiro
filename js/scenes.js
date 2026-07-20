// scenes.js
// Banco de cenas do jogo. Cada cena tem um fundo (por enquanto um id que
// mapeia pra um estilo CSS placeholder) e uma lista de "targets": todo
// personagem listado aqui precisa ser encontrado, não existem figurantes.
//
// x/y são coordenadas no espaço de design de 1600x900 (o mesmo valor de
// width/height da cena). O jogo converte isso pra porcentagem na hora de
// renderizar, então funciona em qualquer tamanho de tela.
//
// Pra adicionar uma cena nova: copie o objeto abaixo, troque o id, o
// background (ou crie um novo estilo em scene-backgrounds no CSS) e a lista
// de targets com as posições dos personagens.

const SCENES = [
  {
    id: "estudio-01",
    name: "Estúdio bagunçado",
    background: "studio-placeholder", // usado como classe CSS enquanto não há arte final
    width: 1600,
    height: 900,
    targets: [
      { characterId: "casimiro", name: "Casimiro", color: "#ff6b35", x: 420, y: 380, radius: 46 },
      { characterId: "tulio", name: "Túlio", color: "#4ecdc4", x: 1100, y: 210, radius: 42 },
      { characterId: "luisinho", name: "Luisinho", color: "#ffe66d", x: 780, y: 640, radius: 44 },
      { characterId: "donan", name: "Donan", color: "#a78bfa", x: 1300, y: 500, radius: 42 },
      { characterId: "beltrao", name: "Beltrão", color: "#ff6f91", x: 200, y: 150, radius: 42 },
      { characterId: "caze", name: "Cazé", color: "#6bcb77", x: 950, y: 720, radius: 48 }
    ]
  }
];

// dailyChallenge.js
// Sorteio determinístico da cena do dia: todo mundo que jogar na mesma data
// (fuso local do navegador) enfrenta a mesma cena. Com poucas cenas isso não
// faz muita diferença, mas já deixa a estrutura pronta pro roadmap V1.1
// (rotação diária automática) sem precisar de backend.

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // força int32
  }
  return Math.abs(hash);
}

function getTodaysDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10); // "2026-07-20"
}

function getTodaysChallenge(scenes, date = new Date()) {
  if (!scenes || scenes.length === 0) {
    throw new Error("Nenhuma cena disponível");
  }
  const seed = hashString(getTodaysDateKey(date));
  return scenes[seed % scenes.length];
}

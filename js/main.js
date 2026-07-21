// main.js — loop principal do jogo
(function () {
  "use strict";

  const STORAGE_PREFIX = "cadeCasimiro:bestTime:";

  const els = {
    screens: {
      home: document.getElementById("screen-home"),
      game: document.getElementById("screen-game"),
      result: document.getElementById("screen-result")
    },
    homeBestTime: document.getElementById("home-best-time"),
    btnPlay: document.getElementById("btn-play"),
    btnQuit: document.getElementById("btn-quit"),
    btnShare: document.getElementById("btn-share"),
    btnPlayAgain: document.getElementById("btn-play-again"),
    timerDisplay: document.getElementById("timer-display"),
    progressDisplay: document.getElementById("progress-display"),
    targetList: document.getElementById("target-list"),
    scene: document.getElementById("scene"),
    sceneBgImg: document.getElementById("scene-bg-img"),
    sceneBgFallback: document.getElementById("scene-bg-fallback"),
    resultTimeValue: document.getElementById("result-time-value"),
    resultRecord: document.getElementById("result-record"),
    resultBest: document.getElementById("result-best"),
    toast: document.getElementById("toast")
  };

  const state = {
    scene: null,
    found: new Set(),
    startedAt: 0,
    elapsedMs: 0,
    timerHandle: null
  };

  function showScreen(name) {
    Object.values(els.screens).forEach((s) => s.classList.add("hidden"));
    els.screens[name].classList.remove("hidden");
  }

  function formatTime(ms) {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(1);
    return `${String(minutes).padStart(2, "0")}:${seconds.padStart(4, "0")}`;
  }

  function bestTimeKey(sceneId) {
    return `${STORAGE_PREFIX}${sceneId}`;
  }

  function getBestTime(sceneId) {
    const raw = localStorage.getItem(bestTimeKey(sceneId));
    return raw ? Number(raw) : null;
  }

  function setBestTime(sceneId, ms) {
    localStorage.setItem(bestTimeKey(sceneId), String(ms));
  }

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.remove("hidden");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => els.toast.classList.add("hidden"), 2200);
  }

  // ---------- HOME ----------

  function renderHome() {
    const scene = getTodaysChallenge(SCENES);
    const best = getBestTime(scene.id);
    if (best != null) {
      els.homeBestTime.textContent = `Seu melhor tempo nesta cena: ${formatTime(best)}`;
      els.homeBestTime.classList.remove("hidden");
    } else {
      els.homeBestTime.classList.add("hidden");
    }
  }

  // ---------- JOGO ----------

  function startGame() {
    state.scene = getTodaysChallenge(SCENES);
    state.found = new Set();
    state.elapsedMs = 0;

    buildScene(state.scene);
    buildTargetList(state.scene);
    updateProgress();

    showScreen("game");

    state.startedAt = performance.now();
    clearInterval(state.timerHandle);
    state.timerHandle = setInterval(updateTimer, 100);
    updateTimer();
  }

  function buildScene(scene) {
    els.scene.querySelectorAll(".target").forEach((el) => el.remove());

    els.sceneBgFallback.textContent = `Cenário "${scene.name}" ainda não disponível`;
    els.sceneBgImg.classList.add("hidden");
    els.sceneBgFallback.classList.remove("hidden");
    els.sceneBgImg.onload = () => {
      els.sceneBgImg.classList.remove("hidden");
      els.sceneBgFallback.classList.add("hidden");
    };
    els.sceneBgImg.onerror = () => {
      els.sceneBgImg.classList.add("hidden");
      els.sceneBgFallback.classList.remove("hidden");
    };
    els.sceneBgImg.src = scene.background;

    scene.targets.forEach((target) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "target";
      el.dataset.characterId = target.characterId;
      el.style.left = `${(target.x / scene.width) * 100}%`;
      el.style.top = `${(target.y / scene.height) * 100}%`;
      el.style.width = `${((target.radius * 2) / scene.width) * 100}%`;
      el.style.setProperty("--target-color", target.color);
      el.setAttribute("aria-label", target.name);

      const img = document.createElement("img");
      img.className = "target-img";
      img.src = target.thumb;
      img.alt = "";
      img.onerror = () => img.classList.add("hidden");

      const fallback = document.createElement("div");
      fallback.className = "target-fallback";
      fallback.textContent = target.name.charAt(0);

      el.appendChild(fallback);
      el.appendChild(img);
      el.addEventListener("click", () => handleTargetClick(target));
      els.scene.appendChild(el);
    });
  }

  function buildTargetList(scene) {
    els.targetList.innerHTML = "";
    scene.targets.forEach((target) => {
      const li = document.createElement("li");
      li.className = "target-item";
      li.dataset.characterId = target.characterId;

      const thumb = document.createElement("span");
      thumb.className = "target-thumb";

      const img = document.createElement("img");
      img.className = "target-thumb-img";
      img.src = target.thumb;
      img.alt = "";
      img.onerror = () => img.classList.add("hidden");

      const fallback = document.createElement("span");
      fallback.className = "target-thumb-fallback";
      fallback.style.setProperty("--target-color", target.color);
      fallback.textContent = target.name.charAt(0);

      thumb.appendChild(fallback);
      thumb.appendChild(img);

      const name = document.createElement("span");
      name.className = "target-name";
      name.textContent = target.name;

      li.appendChild(thumb);
      li.appendChild(name);
      els.targetList.appendChild(li);
    });
  }

  function handleTargetClick(target) {
    if (state.found.has(target.characterId)) return;

    state.found.add(target.characterId);

    const sceneEl = els.scene.querySelector(`.target[data-character-id="${target.characterId}"]`);
    if (sceneEl) sceneEl.classList.add("found");

    const listEl = els.targetList.querySelector(`.target-item[data-character-id="${target.characterId}"]`);
    if (listEl) listEl.classList.add("found");

    updateProgress();

    if (state.found.size === state.scene.targets.length) {
      endGame();
    }
  }

  function updateProgress() {
    els.progressDisplay.textContent = `${state.found.size} / ${state.scene.targets.length}`;
  }

  function updateTimer() {
    state.elapsedMs = performance.now() - state.startedAt;
    els.timerDisplay.textContent = formatTime(state.elapsedMs);
  }

  function endGame() {
    clearInterval(state.timerHandle);
    state.elapsedMs = performance.now() - state.startedAt;

    const sceneId = state.scene.id;
    const previousBest = getBestTime(sceneId);
    const isRecord = previousBest == null || state.elapsedMs < previousBest;
    if (isRecord) setBestTime(sceneId, state.elapsedMs);

    els.resultTimeValue.textContent = formatTime(state.elapsedMs);
    els.resultRecord.classList.toggle("hidden", !isRecord);
    const bestToShow = isRecord ? state.elapsedMs : previousBest;
    els.resultBest.textContent = `Melhor tempo: ${formatTime(bestToShow)}`;

    showScreen("result");
  }

  // ---------- COMPARTILHAR ----------

  function buildShareText() {
    const seconds = (state.elapsedMs / 1000).toFixed(1);
    const url = window.location.href;
    return `Achei o Casimiro em ${seconds}s no desafio de hoje do Cadê o Casimiro! Bate meu recorde: ${url}`;
  }

  async function handleShare() {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Texto copiado! Cole onde quiser compartilhar.");
    } catch {
      toast("Não foi possível copiar automaticamente. Copie o texto manualmente.");
    }
  }

  // ---------- EVENTOS ----------

  els.btnPlay.addEventListener("click", startGame);
  els.btnPlayAgain.addEventListener("click", startGame);
  els.btnQuit.addEventListener("click", () => {
    clearInterval(state.timerHandle);
    renderHome();
    showScreen("home");
  });
  els.btnShare.addEventListener("click", handleShare);

  // ---------- INÍCIO ----------

  renderHome();
  showScreen("home");
})();

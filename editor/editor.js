// editor.js — ferramenta interna de posicionamento de personagens.
// Gera o snippet de código pronto pra colar em scenes.js. Não é usado
// pelo jogo em si.
(function () {
  "use strict";

  const CHARS_PATH = "../assets/chars/";
  const SCENES_PATH = "../assets/scenes/";

  const CHARACTERS = [
    { id: "casimiro", name: "Casimiro", file: "casimiro.png", color: "#ff6b35" },
    { id: "luisinho", name: "Luisinho", file: "luisinho.png", color: "#ffe66d" },
    { id: "beltrao", name: "Beltrão", file: "beltrao.png", color: "#ff6f91" },
    { id: "donan", name: "Donan", file: "donan.png", color: "#a78bfa" },
    { id: "chicomoedas", name: "Chico Moedas", file: "chicomoedas.png", color: "#f6c744" },
    { id: "igor", name: "Igor", file: "igor.png", color: "#4ecdc4" }
  ];

  const SCENARIOS = [
    { id: "estudio", name: "Estúdio", file: "cenario-estudio.png" },
    { id: "arquibancada", name: "Arquibancada", file: "cenario-arquibancada.png" },
    { id: "churrasco", name: "Churrasco", file: "cenario-churrasco.png" }
  ];

  const MIN_SIZE_PCT = 4;
  const MAX_SIZE_PCT = 40;
  const DEFAULT_SIZE_PCT = 10;
  const DEFAULT_SCENE_W = 1600;
  const DEFAULT_SCENE_H = 900;

  const els = {
    sceneSelect: document.getElementById("scene-select"),
    sceneId: document.getElementById("scene-id"),
    sceneName: document.getElementById("scene-name"),
    btnGenerate: document.getElementById("btn-generate"),
    paletteList: document.getElementById("palette-list"),
    stage: document.getElementById("stage"),
    stageBg: document.getElementById("stage-bg"),
    stageEmpty: document.getElementById("stage-empty"),
    output: document.getElementById("output"),
    btnCopy: document.getElementById("btn-copy"),
    toast: document.getElementById("toast")
  };

  const state = {
    scenario: null, // { id, name, file }
    sceneWidth: DEFAULT_SCENE_W,
    sceneHeight: DEFAULT_SCENE_H,
    placed: new Map() // characterId -> { xPct, yPct, sizePct }
  };

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.remove("hidden");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => els.toast.classList.add("hidden"), 2200);
  }

  // ---------- SELEÇÃO DE CENÁRIO ----------

  function populateSceneSelect() {
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "— selecione —";
    els.sceneSelect.appendChild(placeholder);

    SCENARIOS.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.name;
      els.sceneSelect.appendChild(opt);
    });
  }

  function loadScenario(scenarioId) {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      state.scenario = null;
      els.stageBg.classList.add("hidden");
      els.stageEmpty.classList.remove("hidden");
      state.sceneWidth = DEFAULT_SCENE_W;
      state.sceneHeight = DEFAULT_SCENE_H;
      clearAllTokens();
      return;
    }

    state.scenario = scenario;
    clearAllTokens();
    els.stageEmpty.classList.add("hidden");
    els.stageEmpty.textContent = "Selecione um cenário";

    els.stageBg.onerror = () => {
      els.stageBg.classList.add("hidden");
      els.stageEmpty.classList.remove("hidden");
      els.stageEmpty.textContent =
        `Imagem "${scenario.file}" ainda não encontrada em assets/scenes/. ` +
        `Posicione com a proporção padrão (${DEFAULT_SCENE_W}x${DEFAULT_SCENE_H}) — os pontos são relativos, então ao carregar a imagem real depois o resultado continua válido.`;
      state.sceneWidth = DEFAULT_SCENE_W;
      state.sceneHeight = DEFAULT_SCENE_H;
    };
    els.stageBg.onload = () => {
      els.stageBg.classList.remove("hidden");
      els.stageEmpty.classList.add("hidden");
      state.sceneWidth = els.stageBg.naturalWidth || DEFAULT_SCENE_W;
      state.sceneHeight = els.stageBg.naturalHeight || DEFAULT_SCENE_H;
    };
    els.stageBg.src = SCENES_PATH + scenario.file;

    if (!els.sceneId.value) els.sceneId.value = scenario.id + "-01";
    if (!els.sceneName.value) els.sceneName.value = scenario.name;
  }

  els.sceneSelect.addEventListener("change", () => loadScenario(els.sceneSelect.value));

  // ---------- PALETA DE PERSONAGENS ----------

  function renderPalette() {
    els.paletteList.innerHTML = "";
    CHARACTERS.forEach((char) => {
      const item = document.createElement("div");
      item.className = "palette-item";
      item.dataset.characterId = char.id;
      item.draggable = true;

      const thumb = document.createElement("img");
      thumb.className = "palette-thumb";
      thumb.style.setProperty("--token-color", char.color);
      thumb.src = CHARS_PATH + char.file;
      thumb.onerror = () => {
        thumb.remove();
        const fallback = document.createElement("div");
        fallback.className = "palette-thumb";
        fallback.style.background = char.color;
        fallback.textContent = char.name.charAt(0);
        item.insertBefore(fallback, item.firstChild);
      };

      const name = document.createElement("span");
      name.className = "palette-name";
      name.textContent = char.name;

      item.appendChild(thumb);
      item.appendChild(name);
      els.paletteList.appendChild(item);

      item.addEventListener("dragstart", (e) => {
        if (item.classList.contains("used")) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", char.id);
        e.dataTransfer.effectAllowed = "copy";
      });
    });
  }

  function setPaletteUsed(characterId, used) {
    const item = els.paletteList.querySelector(`[data-character-id="${characterId}"]`);
    if (item) item.classList.toggle("used", used);
  }

  // ---------- DROP NA CENA ----------

  els.stage.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  });

  els.stage.addEventListener("drop", (e) => {
    e.preventDefault();
    const characterId = e.dataTransfer.getData("text/plain");
    if (!characterId || state.placed.has(characterId)) return;

    const rect = els.stage.getBoundingClientRect();
    const xPct = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
    const yPct = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100);

    addToken(characterId, xPct, yPct, DEFAULT_SIZE_PCT);
  });

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // ---------- TOKENS (personagens posicionados) ----------

  function addToken(characterId, xPct, yPct, sizePct) {
    const char = CHARACTERS.find((c) => c.id === characterId);
    if (!char) return;

    state.placed.set(characterId, { xPct, yPct, sizePct });
    setPaletteUsed(characterId, true);

    const token = document.createElement("div");
    token.className = "token";
    token.dataset.characterId = characterId;
    token.style.setProperty("--token-color", char.color);

    const img = document.createElement("img");
    img.className = "token-img";
    img.src = CHARS_PATH + char.file;
    img.onerror = () => img.classList.add("hidden");

    const fallback = document.createElement("div");
    fallback.className = "token-fallback";
    fallback.textContent = char.name.charAt(0);

    const label = document.createElement("div");
    label.className = "token-label";
    label.textContent = char.name;

    const removeBtn = document.createElement("button");
    removeBtn.className = "token-remove";
    removeBtn.type = "button";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeToken(characterId);
    });

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "token-resize";

    token.appendChild(img);
    token.appendChild(fallback);
    token.appendChild(label);
    token.appendChild(removeBtn);
    token.appendChild(resizeHandle);
    els.stage.appendChild(token);

    applyTokenStyle(token, xPct, yPct, sizePct);
    bindTokenDrag(token);
    bindResizeHandle(token, resizeHandle);
  }

  function applyTokenStyle(token, xPct, yPct, sizePct) {
    token.style.left = `${xPct}%`;
    token.style.top = `${yPct}%`;
    token.style.width = `${sizePct}%`;
  }

  function removeToken(characterId) {
    state.placed.delete(characterId);
    setPaletteUsed(characterId, false);
    const token = els.stage.querySelector(`.token[data-character-id="${characterId}"]`);
    if (token) token.remove();
  }

  function clearAllTokens() {
    els.stage.querySelectorAll(".token").forEach((t) => t.remove());
    state.placed.forEach((_, characterId) => setPaletteUsed(characterId, false));
    state.placed.clear();
  }

  function bindTokenDrag(token) {
    token.addEventListener("pointerdown", (e) => {
      if (e.target.classList.contains("token-resize") || e.target.classList.contains("token-remove")) return;
      e.preventDefault();
      token.setPointerCapture(e.pointerId);

      const rect = els.stage.getBoundingClientRect();
      const characterId = token.dataset.characterId;

      function onMove(ev) {
        const xPct = clamp(((ev.clientX - rect.left) / rect.width) * 100, 0, 100);
        const yPct = clamp(((ev.clientY - rect.top) / rect.height) * 100, 0, 100);
        const entry = state.placed.get(characterId);
        entry.xPct = xPct;
        entry.yPct = yPct;
        token.style.left = `${xPct}%`;
        token.style.top = `${yPct}%`;
      }

      function onUp(ev) {
        token.releasePointerCapture(ev.pointerId);
        token.removeEventListener("pointermove", onMove);
        token.removeEventListener("pointerup", onUp);
      }

      token.addEventListener("pointermove", onMove);
      token.addEventListener("pointerup", onUp);
    });
  }

  function bindResizeHandle(token, handle) {
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handle.setPointerCapture(e.pointerId);

      const rect = els.stage.getBoundingClientRect();
      const characterId = token.dataset.characterId;
      const entry = state.placed.get(characterId);
      const centerX = rect.left + (entry.xPct / 100) * rect.width;
      const centerY = rect.top + (entry.yPct / 100) * rect.height;

      function onMove(ev) {
        const dx = ev.clientX - centerX;
        const dy = ev.clientY - centerY;
        const radiusPx = Math.sqrt(dx * dx + dy * dy);
        const sizePct = clamp(((radiusPx * 2) / rect.width) * 100, MIN_SIZE_PCT, MAX_SIZE_PCT);
        entry.sizePct = sizePct;
        token.style.width = `${sizePct}%`;
      }

      function onUp(ev) {
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
      }

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
    });
  }

  // ---------- GERAÇÃO DE CÓDIGO ----------

  function generateCode() {
    if (!state.scenario) {
      toast("Selecione um cenário primeiro.");
      return;
    }
    if (state.placed.size === 0) {
      toast("Arraste pelo menos um personagem pra cena.");
      return;
    }

    const sceneId = els.sceneId.value.trim() || state.scenario.id + "-01";
    const sceneName = els.sceneName.value.trim() || state.scenario.name;

    const targetsCode = Array.from(state.placed.entries())
      .map(([characterId, entry]) => {
        const char = CHARACTERS.find((c) => c.id === characterId);
        const x = Math.round((entry.xPct / 100) * state.sceneWidth);
        const y = Math.round((entry.yPct / 100) * state.sceneHeight);
        const radius = Math.round((entry.sizePct / 100) * state.sceneWidth / 2);
        return (
          `      { characterId: "${char.id}", name: "${char.name}", ` +
          `thumb: "/assets/chars/${char.file}", x: ${x}, y: ${y}, radius: ${radius} }`
        );
      })
      .join(",\n");

    const code =
      `{\n` +
      `    id: "${sceneId}",\n` +
      `    name: "${sceneName}",\n` +
      `    background: "/assets/scenes/${state.scenario.file}",\n` +
      `    width: ${state.sceneWidth},\n` +
      `    height: ${state.sceneHeight},\n` +
      `    targets: [\n${targetsCode}\n    ]\n` +
      `  }`;

    els.output.value = code;
    toast("Código gerado! Copie e cole em scenes.js.");
  }

  els.btnGenerate.addEventListener("click", generateCode);

  els.btnCopy.addEventListener("click", async () => {
    if (!els.output.value) {
      toast("Nada pra copiar ainda.");
      return;
    }
    try {
      await navigator.clipboard.writeText(els.output.value);
      toast("Copiado pra área de transferência!");
    } catch {
      els.output.select();
      toast("Selecionado — use Ctrl+C / Cmd+C pra copiar.");
    }
  });

  // ---------- INÍCIO ----------

  populateSceneSelect();
  renderPalette();
})();

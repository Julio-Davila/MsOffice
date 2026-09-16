'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// SHA-256 de la clave configurada. La clave en texto plano NO se almacena en el código.
const ACCESS_HASH = '7ac147d99dabb1e993dd7afb7f11775f35d3dc1711569316b56e1a5e99946dc5';
const SISE_LOGO_DATA = 'data:image/png;base64,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';

const tips = [
  'Ctrl + S: guarda tu trabajo con frecuencia.',
  'F2: edita rápidamente el contenido de la celda activa.',
  'Ctrl + Z: deshace la última acción.',
  'Usa formato Moneda para que los costos sean fáciles de identificar.',
  'Antes de confiar en un resultado, revisa el rango usado por la fórmula.',
  'CONTAR cuenta números; CONTARA cuenta celdas no vacías.',
  'En SUMAR.SI.CONJUNTO, primero va el rango que se desea sumar.'
];

const pageTitles = {
  inicio: 'Panel de aprendizaje', teoria: 'Teoría de la sesión', videos: 'Videos e infografías',
  juegos: 'Juegos educativos', quiz: 'Cuestionario', diploma: 'Diploma final'
};

const defaultProgress = () => ({
  user: null,
  theoryVisited: [],
  theoryDone: false,
  tipsDone: false,
  games: { crossword: false, logic: false, wordsearch: false },
  quizDone: false,
  quizScore: 0,
  quizAnswers: {}
});

let state = defaultProgress();
let currentTip = 0;
let currentLogic = 0;
let logicScore = 0;
let logicLocked = false;
let wordFirst = null;
let wordFound = new Set();
let wordMatrix = [];
let wordPlacements = {};

function storageKey(email) {
  return `sise_excel365_s3_${String(email || '').trim().toLowerCase()}`;
}

function persist() {
  if (!state.user?.email) return;
  localStorage.setItem(storageKey(state.user.email), JSON.stringify({ ...state, theoryVisited: [...state.theoryVisited] }));
}

function hydrate(email) {
  const raw = localStorage.getItem(storageKey(email));
  if (!raw) return defaultProgress();
  try {
    const parsed = JSON.parse(raw);
    return { ...defaultProgress(), ...parsed, games: { ...defaultProgress().games, ...(parsed.games || {}) }, theoryVisited: parsed.theoryVisited || [] };
  } catch {
    return defaultProgress();
  }
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
}

function initials(name) {
  const parts = String(name || 'Estudiante').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(p => p[0]).join('') || 'ES').toUpperCase();
}

function completionCount() {
  const values = [state.theoryDone, state.tipsDone, state.games.crossword, state.games.logic, state.games.wordsearch, state.quizDone];
  return values.filter(Boolean).length;
}

function progressPercent() {
  return Math.round((completionCount() / 6) * 100);
}

function allComplete() { return completionCount() === 6; }

function updateUI() {
  if (!state.user) return;
  $('#sidebarName').textContent = state.user.name;
  $('#sidebarEmail').textContent = state.user.email;
  $('#userInitials').textContent = initials(state.user.name);

  const pct = progressPercent();
  $('#progressLabel').textContent = `${pct}%`;
  $('#progressBar').style.width = `${pct}%`;

  $('#stTheory').textContent = state.theoryDone ? '✓' : '○';
  $('#stGames').textContent = Object.values(state.games).every(Boolean) ? '✓' : '○';
  $('#stQuiz').textContent = state.quizDone ? '✓' : '○';
  $('#stDiploma').textContent = allComplete() ? '✓' : '🔒';
  $('#tabCross').textContent = state.games.crossword ? '✓' : '○';
  $('#tabLogic').textContent = state.games.logic ? '✓' : '○';
  $('#tabWord').textContent = state.games.wordsearch ? '✓' : '○';

  const visited = new Set(state.theoryVisited || []);
  $('#topicVisited').textContent = `${visited.size}/5`;
  const theoryBtn = $('#completeTheory');
  theoryBtn.disabled = visited.size < 5 || state.theoryDone;
  theoryBtn.textContent = state.theoryDone ? '✓ Teoría completada' : 'Completar teoría';
  $('#theoryHint').textContent = state.theoryDone ? 'Actividad registrada.' : visited.size < 5 ? 'Abre los 5 temas primero.' : 'Ya puedes registrar la teoría.';

  const tipBtn = $('#markTips');
  tipBtn.textContent = state.tipsDone ? '✓ Tips revisados' : 'Marcar tips como revisados';
  tipBtn.classList.toggle('done', state.tipsDone);
  tipBtn.disabled = state.tipsDone;

  updateDiplomaStatus();
  persist();
}

function updateDiplomaStatus() {
  const reqs = [
    ['Teoría', state.theoryDone], ['Tips', state.tipsDone], ['Crucigrama', state.games.crossword],
    ['Reto mental', state.games.logic], ['Sopa de letras', state.games.wordsearch], ['Cuestionario', state.quizDone]
  ];
  $('#requirements').innerHTML = reqs.map(([label, done]) => `<div class="req ${done ? 'done' : ''}"><span>${label}</span><b>${done ? '✓ Completado' : 'Pendiente'}</b></div>`).join('');
  $('#diplomaLocked').classList.toggle('hidden', allComplete());
  $('#diplomaReady').classList.toggle('hidden', !allComplete());
  if (allComplete()) drawDiploma();
}

async function sha256(text) {
  try {
    if (window.crypto?.subtle) {
      const data = new TextEncoder().encode(text);
      const hash = await crypto.subtle.digest('SHA-256', data);
      return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (_) {}
  return sha256Fallback(text);
}

// Fallback SHA-256 para navegadores que abren el proyecto mediante file:// sin Web Crypto.
function sha256Fallback(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  let mathPow = Math.pow, maxWord = mathPow(2, 32), lengthProperty = 'length';
  let i, j, result = '', words = [], asciiBitLength = ascii[lengthProperty] * 8;
  let hash = sha256Fallback.h = sha256Fallback.h || [], k = sha256Fallback.k = sha256Fallback.k || [], primeCounter = k[lengthProperty], isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);
  for (j = 0; j < words[lengthProperty];) {
    let w = words.slice(j, j += 16), oldHash = hash.slice(0); hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      let i2 = i + j, w15 = w[i - 15], w2 = w[i - 2];
      let a = hash[0], e = hash[4];
      let temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
      let temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash); hash[4] = (hash[4] + temp1) | 0; hash.pop();
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { let b = (hash[i] >> (j * 8)) & 255; result += ((b < 16) ? 0 : '') + b.toString(16); }
  return result;
}

function showSection(id) {
  $$('.section-panel').forEach(s => s.classList.toggle('active', s.id === id));
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.section === id));
  $('#pageTitle').textContent = pageTitles[id] || 'Excel 365 Online';
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'diploma' && allComplete()) drawDiploma();
}

function openSidebar() { $('#sidebar').classList.add('open'); $('#mobileScrim').classList.add('show'); }
function closeSidebar() { $('#sidebar').classList.remove('open'); $('#mobileScrim').classList.remove('show'); }

function initNavigation() {
  $$('.nav-item').forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.section)));
  $$('[data-go]').forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.go)));
  $('#menuBtn').addEventListener('click', openSidebar);
  $('#sidebarClose').addEventListener('click', closeSidebar);
  $('#mobileScrim').addEventListener('click', closeSidebar);
}

function initTips() {
  $('#tipDots').innerHTML = tips.map((_, i) => `<i class="${i === 0 ? 'active' : ''}"></i>`).join('');
  const render = () => {
    $('#tipText').textContent = tips[currentTip];
    $$('#tipDots i').forEach((d, i) => d.classList.toggle('active', i === currentTip));
  };
  $('#nextTip').addEventListener('click', () => { currentTip = (currentTip + 1) % tips.length; render(); });
  $('#markTips').addEventListener('click', () => {
    state.tipsDone = true; updateUI(); toast('Tips registrados como revisados ✓');
  });
}

function initTheory() {
  $$('.topic-card').forEach(card => card.addEventListener('toggle', () => {
    if (!card.open) return;
    const visited = new Set(state.theoryVisited || []);
    visited.add(card.dataset.topic);
    state.theoryVisited = [...visited];
    updateUI();
  }));
  $('#completeTheory').addEventListener('click', () => {
    state.theoryDone = true;
    updateUI();
    toast('¡Teoría completada! Continúa con los juegos.');
  });
}

/* ---------------- Crucigrama ---------------- */
const crosswordWords = [
  { word: 'PROMEDIO', r: 8, c: 4, dr: 0, dc: 1, clue: 'Función que calcula el valor medio de un rango.' },
  { word: 'CONTAR', r: 7, c: 6, dr: 1, dc: 0, clue: 'Función que cuenta celdas que contienen números.' },
  { word: 'SUMARSI', r: 2, c: 10, dr: 1, dc: 0, clue: 'Función que suma valores cuando se cumple un criterio.' },
  { word: 'MONEDA', r: 5, c: 8, dr: 1, dc: 0, clue: 'Formato recomendado para representar costos.' },
  { word: 'CELDA', r: 11, c: 2, dr: 0, dc: 1, clue: 'Intersección entre una fila y una columna.' },
  { word: 'MAX', r: 4, c: 10, dr: 0, dc: 1, clue: 'Función que devuelve el valor más alto de un rango.' }
];

function buildCrossword() {
  const minR = 2, maxR = 12, minC = 2, maxC = 12;
  const cells = new Map();
  crosswordWords.forEach((item, idx) => {
    item.number = idx + 1;
    for (let i = 0; i < item.word.length; i++) {
      const r = item.r + item.dr * i, c = item.c + item.dc * i;
      const key = `${r},${c}`;
      if (!cells.has(key)) cells.set(key, { letter: item.word[i], starts: [] });
      cells.get(key).letter = item.word[i];
      if (i === 0) cells.get(key).starts.push(item.number);
    }
  });
  const grid = $('#crosswordGrid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${maxC - minC + 1}, 38px)`;
  grid.style.gridTemplateRows = `repeat(${maxR - minR + 1}, 38px)`;
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      const key = `${r},${c}`, cell = cells.get(key);
      const wrap = document.createElement('div');
      wrap.className = `cw-cell ${cell ? '' : 'empty'}`;
      if (cell) {
        if (cell.starts.length) {
          const n = document.createElement('span'); n.className = 'cw-num'; n.textContent = cell.starts.join('/'); wrap.appendChild(n);
        }
        const input = document.createElement('input');
        input.maxLength = 1; input.dataset.expected = cell.letter; input.setAttribute('aria-label', `Casilla fila ${r}, columna ${c}`);
        input.addEventListener('input', () => {
          input.value = input.value.toUpperCase().replace(/[^A-ZÑ]/g, '').slice(-1);
          input.classList.remove('correct', 'wrong');
          if (input.value) input.classList.add(input.value === input.dataset.expected ? 'correct' : 'wrong');
          checkCrossword();
        });
        wrap.appendChild(input);
      }
      grid.appendChild(wrap);
    }
  }
  $('#crosswordClues').innerHTML = crosswordWords.map(x => `<div><b>${x.number}.</b> ${x.clue} <small>(${x.word.length})</small></div>`).join('');
  $('#crosswordMsg').className = 'game-message';
  $('#crosswordMsg').textContent = state.games.crossword ? 'Crucigrama completado ✓' : 'Completa todas las casillas.';
}

function checkCrossword() {
  const inputs = $$('#crosswordGrid input');
  const filled = inputs.every(i => i.value);
  const correct = filled && inputs.every(i => i.value === i.dataset.expected);
  const msg = $('#crosswordMsg');
  if (correct) {
    state.games.crossword = true; msg.className = 'game-message good'; msg.textContent = '¡Excelente! Crucigrama completado ✓'; updateUI(); toast('Crucigrama completado.');
  } else if (filled) {
    msg.className = 'game-message bad'; msg.textContent = 'Hay letras por corregir. Revisa las casillas rojas.';
  } else {
    msg.className = 'game-message'; msg.textContent = 'Completa todas las casillas.';
  }
}

/* ---------------- Reto mental ---------------- */
const logicQuestions = [
  {
    q: '¿Cuál es el costo total del evento?', data: 'Alquiler S/ 8,500 · Catering S/ 6,200 · Decoración S/ 3,800 · Transporte S/ 1,200',
    options: ['S/ 18,500', 'S/ 19,700', 'S/ 20,900', 'S/ 22,200'], correct: 1,
    exp: 'SUMA total = 8,500 + 6,200 + 3,800 + 1,200 = S/ 19,700.'
  },
  {
    q: '¿Qué función usarías para conocer el gasto medio?', data: 'Necesitas resumir varios costos del presupuesto en un solo valor representativo.',
    options: ['MAX', 'PROMEDIO', 'CONTAR', 'SUMAR.SI'], correct: 1,
    exp: 'PROMEDIO calcula la media aritmética de los valores del rango.'
  },
  {
    q: 'Si los costos son 8500, 6200, 3800, 2500 y 1200, ¿qué devuelve MAX?', data: 'Rango de costos: 8500 · 6200 · 3800 · 2500 · 1200',
    options: ['1200', '2500', '6200', '8500'], correct: 3,
    exp: 'MAX devuelve el valor más alto del rango: 8500.'
  },
  {
    q: '¿Cuántos registros corresponden a Marketing?', data: 'Categorías: Marketing · Catering · Marketing · Transporte · Marketing · Decoración',
    options: ['2', '3', '4', '6'], correct: 1,
    exp: 'CONTAR.SI puede contar las 3 apariciones del criterio “Marketing”.'
  },
  {
    q: '¿Qué resultado daría SUMAR.SI.CONJUNTO para Marketing + Pagado?', data: 'Marketing/Pagado S/ 1,500 · Marketing/Pendiente S/ 700 · Catering/Pagado S/ 1,200 · Marketing/Pagado S/ 900',
    options: ['S/ 1,500', 'S/ 2,200', 'S/ 2,400', 'S/ 4,300'], correct: 2,
    exp: 'Solo se suman los registros que cumplen ambos criterios: 1,500 + 900 = S/ 2,400.'
  }
];

function renderLogic() {
  if (currentLogic >= logicQuestions.length) {
    $('#logicQuestion').textContent = '¡Reto mental finalizado!';
    $('#logicData').innerHTML = `Obtuviste <b>${logicScore} de 5</b> aciertos. Puedes reiniciar la página para practicar nuevamente.`;
    $('#logicOptions').innerHTML = '';
    $('#logicFeedback').className = 'game-message good';
    $('#logicFeedback').textContent = 'Actividad completada ✓';
    $('#nextLogic').disabled = true;
    state.games.logic = true; updateUI(); toast('Reto mental completado.');
    return;
  }
  logicLocked = false;
  const item = logicQuestions[currentLogic];
  $('#logicStep').textContent = `${currentLogic + 1} / ${logicQuestions.length}`;
  $('#logicBar').style.width = `${((currentLogic + 1) / logicQuestions.length) * 100}%`;
  $('#logicQuestion').textContent = item.q;
  $('#logicData').textContent = item.data;
  $('#logicOptions').innerHTML = item.options.map((opt, i) => `<button class="logic-option" data-i="${i}">${opt}</button>`).join('');
  $('#logicFeedback').className = 'game-message';
  $('#logicFeedback').textContent = 'Selecciona una respuesta.';
  $('#nextLogic').disabled = true;
  $('#nextLogic').textContent = currentLogic === logicQuestions.length - 1 ? 'Finalizar reto ✓' : 'Siguiente reto →';
  $$('.logic-option').forEach(btn => btn.addEventListener('click', () => answerLogic(Number(btn.dataset.i))));
}

function answerLogic(index) {
  if (logicLocked) return;
  logicLocked = true;
  const item = logicQuestions[currentLogic];
  const buttons = $$('.logic-option');
  buttons[item.correct].classList.add('correct');
  if (index === item.correct) { logicScore++; $('#logicFeedback').className = 'game-message good'; $('#logicFeedback').textContent = `Correcto. ${item.exp}`; }
  else { buttons[index].classList.add('wrong'); $('#logicFeedback').className = 'game-message bad'; $('#logicFeedback').textContent = `Revisa el razonamiento. ${item.exp}`; }
  $('#logicScore').textContent = logicScore;
  $('#nextLogic').disabled = false;
}

/* ---------------- Sopa de letras ---------------- */
const wordWords = [
  { key: 'EXCEL', label: 'EXCEL' }, { key: 'SUMA', label: 'SUMA' }, { key: 'PROMEDIO', label: 'PROMEDIO' },
  { key: 'MAX', label: 'MAX' }, { key: 'MIN', label: 'MIN' }, { key: 'CONTAR', label: 'CONTAR' },
  { key: 'CONTARA', label: 'CONTARA' }, { key: 'CONTARSI', label: 'CONTAR.SI' }, { key: 'SUMARSI', label: 'SUMAR.SI' },
  { key: 'PRESUPUESTO', label: 'PRESUPUESTO' }
];
const fixedWordPlacements = {
  EXCEL: [0, 0, 0, 1], SUMA: [2, 1, 0, 1], PROMEDIO: [4, 0, 0, 1], MAX: [6, 0, 0, 1], MIN: [8, 0, 0, 1],
  CONTAR: [10, 0, 0, 1], CONTARA: [12, 0, 0, 1], CONTARSI: [0, 14, 1, 0], SUMARSI: [7, 7, 1, 1], PRESUPUESTO: [14, 0, 0, 1]
};

function buildWordSearch() {
  const N = 15, letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  wordMatrix = Array.from({ length: N }, () => Array(N).fill(''));
  wordPlacements = {};
  wordWords.forEach(({ key }) => {
    const [r, c, dr, dc] = fixedWordPlacements[key];
    const pos = [];
    [...key].forEach((ch, i) => { const rr = r + dr * i, cc = c + dc * i; wordMatrix[rr][cc] = ch; pos.push([rr, cc]); });
    wordPlacements[key] = pos;
  });
  let seed = 20260915;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!wordMatrix[r][c]) wordMatrix[r][c] = letters[Math.floor(rand() * letters.length)];

  wordFound = new Set(state.games.wordsearch ? wordWords.map(w => w.key) : []);
  wordFirst = null;
  const grid = $('#wordGrid'); grid.innerHTML = '';
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const btn = document.createElement('button'); btn.className = 'word-cell'; btn.textContent = wordMatrix[r][c]; btn.dataset.r = r; btn.dataset.c = c;
    btn.addEventListener('click', () => selectWordCell(btn)); grid.appendChild(btn);
  }
  renderWordList();
  if (state.games.wordsearch) markAllWordCells();
}

function renderWordList() {
  $('#wordList').innerHTML = wordWords.map(w => `<div class="word-chip ${wordFound.has(w.key) ? 'found' : ''}" data-word="${w.key}">${w.label}</div>`).join('');
  const msg = $('#wordSearchMsg');
  if (wordFound.size === 10) { msg.className = 'game-message good'; msg.textContent = '¡Encontraste las 10 palabras! ✓'; }
  else { msg.className = 'game-message'; msg.textContent = `Encontradas: ${wordFound.size} de 10.`; }
}

function selectWordCell(btn) {
  const r = Number(btn.dataset.r), c = Number(btn.dataset.c);
  if (!wordFirst) {
    wordFirst = [r, c, btn]; btn.classList.add('first'); return;
  }
  wordFirst[2].classList.remove('first');
  const [r1, c1] = wordFirst; wordFirst = null;
  const drRaw = r - r1, dcRaw = c - c1;
  if (!(drRaw === 0 || dcRaw === 0 || Math.abs(drRaw) === Math.abs(dcRaw))) {
    $('#wordSearchMsg').className = 'game-message bad'; $('#wordSearchMsg').textContent = 'La selección debe formar una línea horizontal, vertical o diagonal.'; return;
  }
  const dr = Math.sign(drRaw), dc = Math.sign(dcRaw), len = Math.max(Math.abs(drRaw), Math.abs(dcRaw)) + 1;
  const positions = [], chars = [];
  for (let i = 0; i < len; i++) { const rr = r1 + dr * i, cc = c1 + dc * i; positions.push([rr, cc]); chars.push(wordMatrix[rr][cc]); }
  const text = chars.join(''), rev = [...chars].reverse().join('');
  const match = wordWords.find(w => !wordFound.has(w.key) && (w.key === text || w.key === rev));
  if (match) {
    wordFound.add(match.key); markPositions(positions); renderWordList();
    toast(`Palabra encontrada: ${match.label}`);
    if (wordFound.size === 10) { state.games.wordsearch = true; updateUI(); }
  } else {
    $('#wordSearchMsg').className = 'game-message bad'; $('#wordSearchMsg').textContent = 'Esa línea no corresponde a una palabra pendiente.';
  }
}

function markPositions(positions) {
  positions.forEach(([r, c]) => { const idx = r * 15 + c; $$('#wordGrid .word-cell')[idx]?.classList.add('found'); });
}
function markAllWordCells() { Object.values(wordPlacements).forEach(markPositions); renderWordList(); }

function initGames() {
  $$('.game-tab').forEach(tab => tab.addEventListener('click', () => {
    const game = tab.dataset.game;
    $$('.game-tab').forEach(t => t.classList.toggle('active', t === tab));
    $$('.game-panel').forEach(p => p.classList.toggle('active', p.id === `game-${game}`));
  }));
  buildCrossword();
  renderLogic();
  buildWordSearch();
  $('#resetCrossword').addEventListener('click', () => { state.games.crossword = false; buildCrossword(); updateUI(); });
  $('#nextLogic').addEventListener('click', () => { currentLogic++; renderLogic(); });
  $('#resetWordSearch').addEventListener('click', () => { state.games.wordsearch = false; buildWordSearch(); updateUI(); });
}

/* ---------------- Cuestionario ---------------- */
const quizQuestions = [
  { q: '¿Qué conjunto de campos corresponde a una hoja de planificación de evento?', o: ['Actividad, responsable, fecha, recurso y costo', 'Solo actividad y costo', 'Nombre, contraseña y correo', 'Gráfico, macro y presentación'], a: 0, f: 'La sesión propone registrar actividad, responsable, fecha, recurso y costo.' },
  { q: '¿Con qué signo inicia una fórmula en Excel?', o: ['#', '=', '@', '&'], a: 1, f: 'Las fórmulas de Excel inician con el signo =.' },
  { q: '¿Qué formato es más adecuado para visualizar los costos de un presupuesto?', o: ['Texto', 'Porcentaje', 'Moneda', 'Hora'], a: 2, f: 'El formato Moneda permite reconocer los importes de forma inmediata.' },
  { q: '¿Qué función se usa para obtener el total de un rango de costos?', o: ['SUMA', 'MIN', 'CONTAR', 'PROMEDIO'], a: 0, f: 'SUMA agrega los valores de un rango.' },
  { q: '¿Qué función calcula el valor medio de los costos?', o: ['MAX', 'PROMEDIO', 'SUMAR.SI', 'CONTARA'], a: 1, f: 'PROMEDIO calcula la media aritmética.' },
  { q: '¿Qué función permite identificar el mayor gasto?', o: ['MIN', 'CONTAR', 'MAX', 'SUMA'], a: 2, f: 'MAX devuelve el valor más alto del rango.' },
  { q: '¿Cuál es la diferencia principal entre CONTAR y CONTARA?', o: ['CONTAR suma; CONTARA promedia', 'CONTAR cuenta números; CONTARA cuenta celdas no vacías', 'Son exactamente iguales', 'CONTARA solo cuenta fechas'], a: 1, f: 'CONTAR considera valores numéricos; CONTARA considera celdas con contenido.' },
  { q: 'Si necesitas saber cuántos registros pertenecen a “Marketing”, ¿qué función es adecuada?', o: ['CONTAR.SI', 'MAX', 'PROMEDIO', 'MIN'], a: 0, f: 'CONTAR.SI cuenta celdas que cumplen un criterio.' },
  { q: '¿Qué función suma importes asociados a un solo criterio?', o: ['CONTARA', 'SUMAR.SI', 'CONTAR', 'MAX'], a: 1, f: 'SUMAR.SI suma el rango cuando se cumple el criterio indicado.' },
  { q: '¿Qué función usarías si la suma debe cumplir varios criterios al mismo tiempo?', o: ['SUMA', 'SUMAR.SI.CONJUNTO', 'PROMEDIO', 'CONTAR'], a: 1, f: 'SUMAR.SI.CONJUNTO permite sumar con múltiples condiciones.' }
];

function buildQuiz() {
  const saved = state.quizAnswers || {};
  $('#quizContainer').innerHTML = quizQuestions.map((item, qi) => `
    <article class="quiz-card" data-q="${qi}">
      <div class="quiz-qtop"><span class="qnum">${String(qi + 1).padStart(2, '0')}</span><div style="flex:1"><h3>${item.q}</h3>
        <div class="quiz-options">${item.o.map((opt, oi) => `<div class="quiz-option ${oi === item.a ? 'correct' : 'wrong'}"><input type="radio" id="q${qi}o${oi}" name="q${qi}" value="${oi}" ${String(saved[qi]) === String(oi) ? 'checked' : ''}><label for="q${qi}o${oi}">${opt}</label></div>`).join('')}</div>
        <div class="quiz-feedback"></div>
      </div></div>
    </article>`).join('');
  $$('#quizContainer input[type=radio]').forEach(inp => inp.addEventListener('change', () => {
    const qi = Number(inp.name.slice(1)); state.quizAnswers = { ...(state.quizAnswers || {}), [qi]: Number(inp.value) }; persist(); updateQuizAnswered();
  }));
  updateQuizAnswered();
  if (state.quizDone) validateQuiz(false);
}

function updateQuizAnswered() {
  const count = Object.keys(state.quizAnswers || {}).length;
  $('#quizAnswered').textContent = `${count} de ${quizQuestions.length} preguntas respondidas`;
  $('#submitQuiz').disabled = count < quizQuestions.length;
}

function validateQuiz(showToast = true) {
  let score = 0;
  quizQuestions.forEach((item, qi) => {
    const card = $(`.quiz-card[data-q="${qi}"]`);
    const chosen = Number(state.quizAnswers?.[qi]);
    const correct = chosen === item.a;
    if (correct) score++;
    card.classList.add('validated');
    const feedback = $('.quiz-feedback', card);
    feedback.className = `quiz-feedback ${correct ? 'good' : 'bad'}`;
    feedback.textContent = `${correct ? '✓ Correcto.' : '✕ Revisa.'} ${item.f}`;
  });
  state.quizDone = true; state.quizScore = score; persist();
  $('#quizScoreBadge b').textContent = `${score}/10`;
  $('#submitQuiz').textContent = 'Cuestionario validado ✓';
  updateUI();
  if (showToast) toast(`Cuestionario completado: ${score}/10.`);
}

function initQuiz() { buildQuiz(); $('#submitQuiz').addEventListener('click', () => validateQuiz(true)); }

/* ---------------- Diploma + PDF ---------------- */
function formatDate() {
  return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
}

async function drawDiploma() {
  if (!state.user || !allComplete()) return;
  const canvas = $('#diplomaCanvas'), ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fbfdfc'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#0b5f31'; ctx.fillRect(0, 0, W, 24); ctx.fillRect(0, H - 24, W, 24);
  ctx.strokeStyle = '#0f7c41'; ctx.lineWidth = 5; ctx.strokeRect(60, 60, W - 120, H - 120);
  ctx.strokeStyle = '#b9d9c6'; ctx.lineWidth = 2; ctx.strokeRect(78, 78, W - 156, H - 156);

  // Decoración geométrica inspirada en la identidad de Excel.
  ctx.fillStyle = '#e8f6ee'; ctx.beginPath(); ctx.arc(180, 160, 120, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d7efe1'; ctx.beginPath(); ctx.arc(W - 170, H - 145, 150, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#107c41'; ctx.fillRect(115, 125, 104, 104); ctx.fillStyle = '#fff'; ctx.font = '900 62px Segoe UI, Arial'; ctx.textAlign = 'center'; ctx.fillText('X', 167, 199);

  try {
    const img = new Image(); img.src = SISE_LOGO_DATA; await img.decode(); ctx.drawImage(img, W - 300, 105, 145, 145);
  } catch (_) {
    ctx.fillStyle = '#ed1239'; ctx.fillRect(W - 300, 105, 145, 145); ctx.fillStyle = '#fff'; ctx.font = '900 40px Arial'; ctx.fillText('SISE»', W - 228, 190);
  }

  ctx.fillStyle = '#0b5f31'; ctx.font = '800 25px Segoe UI, Arial'; ctx.letterSpacing = '2px'; ctx.fillText('INSTITUTO SISE · CPEX', W / 2, 170);
  ctx.fillStyle = '#183228'; ctx.font = '900 58px Segoe UI, Arial'; ctx.fillText('DIPLOMA DE FINALIZACIÓN', W / 2, 275);
  ctx.fillStyle = '#66776e'; ctx.font = '400 25px Segoe UI, Arial'; ctx.fillText('Se otorga el presente reconocimiento a', W / 2, 340);

  ctx.fillStyle = '#0c6d39'; ctx.font = '800 54px Segoe UI, Arial'; fitText(ctx, state.user.name, W / 2, 430, 1160, 54);
  ctx.strokeStyle = '#9fc8b1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(320, 458); ctx.lineTo(W - 320, 458); ctx.stroke();
  ctx.fillStyle = '#6b7b73'; ctx.font = '400 20px Segoe UI, Arial'; ctx.fillText(state.user.email, W / 2, 497);

  ctx.fillStyle = '#233a30'; ctx.font = '600 25px Segoe UI, Arial';
  wrapCentered(ctx, 'por completar satisfactoriamente la sesión de Microsoft Excel 365 Online: organización y registro de información, tablas y formato de datos, operadores matemáticos, funciones esenciales y planificación de presupuestos.', W / 2, 570, 1180, 36);

  const boxY = 705, boxW = 310, boxH = 112, gap = 24, startX = (W - (boxW * 3 + gap * 2)) / 2;
  const items = [
    ['SESIÓN', 'Semana 3 · Sesión 1'],
    ['EVALUACIÓN', `${state.quizScore}/10 preguntas`],
    ['FINALIZACIÓN', formatDate()]
  ];
  items.forEach(([k, v], i) => {
    const x = startX + i * (boxW + gap); ctx.fillStyle = '#f0f8f4'; roundRect(ctx, x, boxY, boxW, boxH, 16, true, false); ctx.strokeStyle = '#c7e0d1'; ctx.lineWidth = 2; roundRect(ctx, x, boxY, boxW, boxH, 16, false, true);
    ctx.fillStyle = '#0b7040'; ctx.font = '800 17px Segoe UI, Arial'; ctx.fillText(k, x + boxW / 2, boxY + 38);
    ctx.fillStyle = '#31493d'; ctx.font = '600 19px Segoe UI, Arial'; ctx.fillText(v, x + boxW / 2, boxY + 75);
  });

  ctx.fillStyle = '#294236'; ctx.font = '600 20px Segoe UI, Arial'; ctx.fillText('Taller de Informática para la Empleabilidad · Ciclo II', W / 2, 885);
  ctx.fillStyle = '#75867d'; ctx.font = '400 17px Segoe UI, Arial'; ctx.fillText('Docente: Dávila Salvador, Julio · Turno Noche', W / 2, 920);

  ctx.strokeStyle = '#93ad9f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(540, 1000); ctx.lineTo(1060, 1000); ctx.stroke();
  ctx.fillStyle = '#2b4036'; ctx.font = '600 17px Segoe UI, Arial'; ctx.fillText('Constancia digital de actividad completada', W / 2, 1032);
}

function fitText(ctx, text, x, y, maxWidth, startSize) {
  let size = startSize;
  while (size > 28) { ctx.font = `800 ${size}px Segoe UI, Arial`; if (ctx.measureText(text).width <= maxWidth) break; size -= 2; }
  ctx.fillText(text, x, y);
}
function wrapCentered(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' '), lines = []; let line = '';
  words.forEach(word => { const test = line ? `${line} ${word}` : word; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test; });
  if (line) lines.push(line); lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight));
}
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); if (fill) ctx.fill(); if (stroke) ctx.stroke();
}

function dataUrlToBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1], bin = atob(base64), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return bytes;
}
function asciiBytes(str) { return new TextEncoder().encode(str); }
function concatBytes(parts) {
  const total = parts.reduce((s, p) => s + p.length, 0), out = new Uint8Array(total); let offset = 0;
  parts.forEach(p => { out.set(p, offset); offset += p.length; }); return out;
}
function canvasPdfBlob(canvas) {
  const jpg = dataUrlToBytes(canvas.toDataURL('image/jpeg', 0.94));
  const parts = [], offsets = [0]; let length = 0;
  const push = bytes => { parts.push(bytes); length += bytes.length; };
  push(asciiBytes('%PDF-1.4\n%1234\n'));
  const addObj = (n, contentParts) => {
    offsets[n] = length; push(asciiBytes(`${n} 0 obj\n`)); contentParts.forEach(push); push(asciiBytes('\nendobj\n'));
  };
  addObj(1, [asciiBytes('<< /Type /Catalog /Pages 2 0 R >>')]);
  addObj(2, [asciiBytes('<< /Type /Pages /Kids [3 0 R] /Count 1 >>')]);
  addObj(3, [asciiBytes('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>')]);
  addObj(4, [asciiBytes(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`), jpg, asciiBytes('\nendstream')]);
  const content = asciiBytes('q\n842 0 0 595 0 0 cm\n/Im0 Do\nQ\n');
  addObj(5, [asciiBytes(`<< /Length ${content.length} >>\nstream\n`), content, asciiBytes('endstream')]);
  const xrefOffset = length;
  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  push(asciiBytes(xref));
  return new Blob([concatBytes(parts)], { type: 'application/pdf' });
}

async function downloadDiploma() {
  await drawDiploma();
  const blob = canvasPdfBlob($('#diplomaCanvas'));
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = `Diploma_Excel365_${state.user.name.replace(/\s+/g, '_')}.pdf`; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000); toast('Diploma PDF generado ✓');
}

async function printDiploma() {
  await drawDiploma();
  const data = $('#diplomaCanvas').toDataURL('image/png');
  const w = window.open('', '_blank');
  if (!w) { toast('Permite ventanas emergentes para imprimir el diploma.'); return; }
  w.document.write(`<html><head><title>Diploma Excel 365</title><style>@page{size:A4 landscape;margin:0}body{margin:0;display:grid;place-items:center;height:100vh}img{width:100%;height:auto}</style></head><body><img src="${data}"></body></html>`);
  w.document.close(); w.onload = () => { w.focus(); w.print(); };
}

function initDiploma() {
  $('#downloadDiploma').addEventListener('click', downloadDiploma);
  $('#printDiploma').addEventListener('click', printDiploma);
}

/* ---------------- Auth ---------------- */
function initAuth() {
  $('#togglePassword').addEventListener('click', () => { const p = $('#password'); p.type = p.type === 'password' ? 'text' : 'password'; });
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#fullName').value.trim(), email = $('#email').value.trim(), password = $('#password').value;
    const error = $('#loginError'); error.textContent = '';
    if (name.length < 3) { error.textContent = 'Ingresa tu nombre completo.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { error.textContent = 'Ingresa un correo electrónico válido.'; return; }
    const hash = await sha256(password);
    if (hash !== ACCESS_HASH) { error.textContent = 'Clave de acceso incorrecta.'; return; }

    const saved = hydrate(email);
    state = saved;
    state.user = { name, email };
    state.theoryVisited = state.theoryVisited || [];
    $('#welcome').style.display = 'none';
    $('#app').classList.remove('is-locked'); $('#app').setAttribute('aria-hidden', 'false');
    currentLogic = state.games.logic ? logicQuestions.length : 0; logicScore = state.games.logic ? 5 : 0;
    initStatefulViews(); updateUI(); showSection('inicio');
    toast(`Bienvenido(a), ${name.split(' ')[0]}. ¡Comencemos!`);
  });
  $('#logoutBtn').addEventListener('click', () => {
    persist();
    $('#app').classList.add('is-locked'); $('#app').setAttribute('aria-hidden', 'true');
    $('#welcome').style.display = 'grid'; $('#password').value = ''; $('#loginError').textContent = '';
  });
}

let statefulInitDone = false;
function initStatefulViews() {
  // Se reconstruyen los módulos con el progreso del usuario que acaba de ingresar.
  buildCrossword();
  if (!state.games.logic) { currentLogic = 0; logicScore = 0; $('#logicScore').textContent = '0'; renderLogic(); }
  else { currentLogic = logicQuestions.length; logicScore = 5; $('#logicScore').textContent = '5'; renderLogic(); }
  buildWordSearch();
  buildQuiz();
  statefulInitDone = true;
}



/* ---------------- Visual experience V2 ---------------- */
const ALL_LEARNING_PHOTOS = [
  ['assets/hero.webp','Excel y presupuesto'],
  ['assets/equipo.webp','Trabajo colaborativo'],
  ['assets/formatos.webp','Formatos en Excel'],
  ['assets/funciones.webp','Funciones esenciales'],
  ['assets/aula.webp','Excel en el aula'],
  ['assets/docente.webp','Explicación guiada'],
  ['assets/celebracion.webp','Logro de aprendizaje'],
  ['assets/planificacion.webp','Planificación del evento'],
  ['assets/cpex.jpg','CPEX · SISE']
];

function initWelcomeCarousel(){
  const slides=$$('#welcomeSlides .welcome-slide');
  const dots=$('#welcomeDots');
  if(!slides.length||!dots) return;
  let idx=0, timer;
  dots.innerHTML=slides.map((_,i)=>`<button type="button" aria-label="Ver imagen ${i+1}" class="${i===0?'active':''}"></button>`).join('');
  const dotBtns=$$('#welcomeDots button');
  const show=i=>{ idx=(i+slides.length)%slides.length; slides.forEach((s,n)=>s.classList.toggle('active',n===idx)); dotBtns.forEach((d,n)=>d.classList.toggle('active',n===idx)); };
  const restart=()=>{ clearInterval(timer); timer=setInterval(()=>show(idx+1),5200); };
  dotBtns.forEach((d,i)=>d.addEventListener('click',()=>{show(i);restart();}));
  restart();
}

function initPhotoStories(){
  const lightbox=document.createElement('div');
  lightbox.className='photo-lightbox'; lightbox.id='photoLightbox';
  lightbox.innerHTML='<button type="button" aria-label="Cerrar imagen">×</button><img alt="Vista ampliada">';
  document.body.appendChild(lightbox);
  const big=lightbox.querySelector('img');
  const close=()=>lightbox.classList.remove('show');
  lightbox.querySelector('button').addEventListener('click',close);
  lightbox.addEventListener('click',e=>{if(e.target===lightbox) close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape') close();});

  $$('.section-panel').forEach(section=>{
    const anchor=section.querySelector('.section-heading') || section.querySelector('.hero-banner');
    if(!anchor) return;
    const story=document.createElement('div'); story.className='photo-story';
    story.innerHTML=`<div class="photo-story-head"><b>Galería visual de la sesión</b><span>Usa las imágenes como referencia durante cada actividad · clic para ampliar</span></div><div class="photo-story-track">${ALL_LEARNING_PHOTOS.map(([src,cap])=>`<figure><img loading="lazy" src="${src}" alt="${cap}"><figcaption>${cap}</figcaption></figure>`).join('')}</div>`;
    anchor.insertAdjacentElement('afterend',story);
    story.querySelectorAll('img').forEach(img=>img.addEventListener('click',()=>{big.src=img.src; big.alt=img.alt; lightbox.classList.add('show');}));
  });
}

function init() {
  initWelcomeCarousel(); initPhotoStories(); initNavigation(); initTips(); initTheory(); initGames(); initQuiz(); initDiploma(); initAuth();
}

document.addEventListener('DOMContentLoaded', init);

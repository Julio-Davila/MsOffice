(() => {
  'use strict';

  const ACCESS_HASH = '7ac147d99dabb1e993dd7afb7f11775f35d3dc1711569316b56e1a5e99946dc5';
  const activityKeys = ['theoryFilters','theoryAdvanced','theoryConditional','theoryPivot','theoryDecisions','tips','crossword','logic','wordsearch','quiz'];
  const activityLabels = {
    theoryFilters:'Teoría: Filtros', theoryAdvanced:'Teoría: Filtros avanzados', theoryConditional:'Teoría: Formato condicional',
    theoryPivot:'Teoría: Tablas dinámicas', theoryDecisions:'Teoría: Decisiones e IA', tips:'Tips y atajos',
    crossword:'Juego: Crucigrama', logic:'Juego: Reto mental', wordsearch:'Juego: Sopa de letras', quiz:'Cuestionario final'
  };

  let currentUser = null;
  let progress = defaultProgress();
  let toastTimer = null;

  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

  function defaultProgress(){
    return {theoryFilters:false,theoryAdvanced:false,theoryConditional:false,theoryPivot:false,theoryDecisions:false,tips:false,crossword:false,logic:false,wordsearch:false,quiz:false,quizScore:null,completionDate:null};
  }
  function storageKey(){ return currentUser ? `siseExcelProgress:${currentUser.email.toLowerCase()}` : 'siseExcelProgress'; }
  function saveProgress(){ if(currentUser) localStorage.setItem(storageKey(), JSON.stringify(progress)); }
  function loadProgress(){
    const raw = currentUser ? localStorage.getItem(storageKey()) : null;
    progress = defaultProgress();
    if(raw){ try{ progress = {...progress, ...JSON.parse(raw)}; }catch(e){} }
    syncProgressUI();
  }

  function showToast(message, type='success'){
    const t=$('#toast'); t.textContent=message; t.className=`toast ${type} show`;
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2600);
  }
  function celebrate(count=36){
    const wrap=$('#confetti'); wrap.innerHTML='';
    const colors=['#107c41','#21a366','#ef173f','#f4a51c','#2b78c9','#7b52cf'];
    for(let i=0;i<count;i++){
      const p=document.createElement('span'); p.className='confetti-piece';
      p.style.left=`${Math.random()*100}%`; p.style.background=colors[i%colors.length]; p.style.animationDelay=`${Math.random()*.5}s`; p.style.transform=`rotate(${Math.random()*180}deg)`;
      wrap.appendChild(p);
    }
    setTimeout(()=>wrap.innerHTML='',3200);
  }

  function markComplete(key, message){
    const wasDone=!!progress[key]; progress[key]=true;
    if(allComplete() && !progress.completionDate) progress.completionDate=new Date().toISOString();
    saveProgress(); syncProgressUI();
    if(!wasDone){ showToast(message || 'Actividad completada. ¡Buen trabajo!'); celebrate(18); }
  }
  function allComplete(){ return activityKeys.every(k=>progress[k]); }
  function completionPercent(){ return Math.round(activityKeys.filter(k=>progress[k]).length / activityKeys.length * 100); }

  function syncProgressUI(){
    const pct=completionPercent();
    $('#progressText').textContent=`${pct}%`; $('#progressBar').style.width=`${pct}%`;
    $$('.complete-module').forEach(btn=>{
      const done=!!progress[btn.dataset.complete]; btn.classList.toggle('done',done); btn.textContent=done?'✓ Módulo completado':'✓ Marcar módulo como estudiado';
    });
    const tips=$('#completeTips'); tips.classList.toggle('done',progress.tips); tips.textContent=progress.tips?'✓ Tips revisados':'✓ Marcar tips revisados';
    $('#crossBadge').textContent=progress.crossword?'✓':'○'; $('#logicBadge').textContent=progress.logic?'✓':'○'; $('#wordBadge').textContent=progress.wordsearch?'✓':'○';
    updateDiplomaArea();
  }

  // SHA-256. Uses Web Crypto when available; includes a local fallback for direct file execution.
  async function sha256(message){
    if(window.crypto && crypto.subtle){
      const data=new TextEncoder().encode(message); const hash=await crypto.subtle.digest('SHA-256',data);
      return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
    }
    return sha256Fallback(message);
  }
  function sha256Fallback(ascii){
    const rightRotate=(value,amount)=>(value>>>amount)|(value<<(32-amount));
    let mathPow=Math.pow,maxWord=mathPow(2,32),lengthProperty='length',i,j,result='',words=[],asciiBitLength=ascii[lengthProperty]*8;
    let hash=sha256Fallback.h=sha256Fallback.h||[],k=sha256Fallback.k=sha256Fallback.k||[],primeCounter=k[lengthProperty],isComposite={};
    for(let candidate=2;primeCounter<64;candidate++){if(!isComposite[candidate]){for(i=0;i<313;i+=candidate)isComposite[i]=candidate;hash[primeCounter]=(mathPow(candidate,.5)*maxWord)|0;k[primeCounter++]=(mathPow(candidate,1/3)*maxWord)|0;}}
    ascii+='\x80'; while(ascii[lengthProperty]%64-56)ascii+='\x00';
    for(i=0;i<ascii[lengthProperty];i++){j=ascii.charCodeAt(i); if(j>>8)return ''; words[i>>2]|=j<<((3-i)%4)*8;}
    words[words[lengthProperty]]=((asciiBitLength/maxWord)|0); words[words[lengthProperty]]=asciiBitLength;
    for(j=0;j<words[lengthProperty];){let w=words.slice(j,j+=16),oldHash=hash.slice(0); hash=hash.slice(0,8);
      for(i=0;i<64;i++){let i2=i+j,w15=w[i-15],w2=w[i-2]; let a=hash[0],e=hash[4];
        let temp1=hash[7]+(rightRotate(e,6)^rightRotate(e,11)^rightRotate(e,25))+((e&hash[5])^((~e)&hash[6]))+k[i]+(w[i]=(i<16)?w[i]:(w[i-16]+(rightRotate(w15,7)^rightRotate(w15,18)^(w15>>>3))+w[i-7]+(rightRotate(w2,17)^rightRotate(w2,19)^(w2>>>10)))|0);
        let temp2=(rightRotate(a,2)^rightRotate(a,13)^rightRotate(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
        hash=[(temp1+temp2)|0].concat(hash); hash[4]=(hash[4]+temp1)|0; hash.pop();
      }
      for(i=0;i<8;i++)hash[i]=(hash[i]+oldHash[i])|0;
    }
    for(i=0;i<8;i++)for(j=3;j+1;j--){let b=(hash[i]>>(j*8))&255;result+=(b<16?'0':'')+b.toString(16);} return result;
  }

  // Authentication
  $('#togglePassword').addEventListener('click',()=>{const i=$('#accessKey'); i.type=i.type==='password'?'text':'password';});
  $('#loginForm').addEventListener('submit', async e=>{
    e.preventDefault(); const name=$('#studentName').value.trim(), email=$('#studentEmail').value.trim().toLowerCase(), key=$('#accessKey').value;
    $('#loginError').textContent='';
    if(name.length<4){$('#loginError').textContent='Ingresa tu nombre completo.';return;}
    const hash=await sha256(key);
    if(hash!==ACCESS_HASH){$('#loginError').textContent='Clave de acceso incorrecta. Verifica e intenta nuevamente.';showToast('Clave incorrecta','error');return;}
    currentUser={name,email}; $('#loginOverlay').classList.add('hidden'); $('#app').classList.remove('hidden');
    $('#studentMini').textContent=`${name} · ${email}`; loadProgress(); initGamesFromProgress(); navigateTo('inicio'); showToast(`¡Bienvenido(a), ${name.split(' ')[0]}!`);
  });
  $('#logoutBtn').addEventListener('click',()=>{ currentUser=null; $('#app').classList.add('hidden'); $('#loginOverlay').classList.remove('hidden'); $('#accessKey').value=''; $('#loginError').textContent=''; closeSidebar(); });

  // Navigation
  function navigateTo(target){
    $$('.page-section').forEach(s=>s.classList.toggle('active-section',s.id===target));
    $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.target===target));
    window.scrollTo({top:0,behavior:'smooth'}); closeSidebar();
    if(target==='diploma') updateDiplomaArea();
  }
  $$('.nav-item,.nav-jump').forEach(btn=>btn.addEventListener('click',()=>navigateTo(btn.dataset.target)));
  $('#menuBtn').addEventListener('click',()=>{$('#sidebar').classList.add('open');$('#sidebarBackdrop').classList.add('show');});
  $('#closeSidebar').addEventListener('click',closeSidebar); $('#sidebarBackdrop').addEventListener('click',closeSidebar);
  function closeSidebar(){$('#sidebar').classList.remove('open');$('#sidebarBackdrop').classList.remove('show');}

  $('#completeTips').addEventListener('click',()=>markComplete('tips','Tips y atajos revisados. ¡Sigue avanzando!'));
  $$('.complete-module').forEach(btn=>btn.addEventListener('click',()=>markComplete(btn.dataset.complete,'Módulo teórico completado.')));

  // Game tabs
  $$('.game-tab').forEach(tab=>tab.addEventListener('click',()=>{
    $$('.game-tab').forEach(t=>t.classList.remove('active')); tab.classList.add('active');
    $$('.game-panel').forEach(p=>p.classList.toggle('active-game',p.id===tab.dataset.game));
  }));

  // Crossword
  const crosswordWords=[
    {word:'CRITERIO',row:7,col:3,dir:'H',clue:'Condición utilizada para decidir qué registros deben mostrarse.'},
    {word:'FORMATO',row:5,col:8,dir:'V',clue:'Parte del nombre de la herramienta que resalta visualmente valores según reglas.'},
    {word:'FILTRO',row:5,col:8,dir:'H',clue:'Herramienta que muestra solo registros que cumplen una condición.'},
    {word:'EXCEL',row:5,col:3,dir:'V',clue:'Programa de Microsoft usado para analizar la hoja de cálculo.'},
    {word:'DATOS',row:9,col:7,dir:'H',clue:'Información que debe organizarse y depurarse antes del análisis.'},
    {word:'TABLA',row:9,col:0,dir:'H',clue:'Estructura que puede convertirse en dinámica para resumir información.'},
    {word:'RANGO',row:8,col:1,dir:'V',clue:'Conjunto de celdas utilizado como lista o como criterios.'},
    {word:'CAMPO',row:11,col:4,dir:'H',clue:'Elemento que arrastras a filas, columnas, valores o filtros en una tabla dinámica.'}
  ];
  let crosswordSolution={}, crosswordStarts={}, crosswordSolved=new Set();
  function buildCrossword(){
    crosswordSolution={};crosswordStarts={};crosswordSolved=new Set();
    const starts=[...new Set(crosswordWords.map(w=>`${w.row},${w.col}`))].sort((a,b)=>{const [ar,ac]=a.split(',').map(Number),[br,bc]=b.split(',').map(Number);return ar-br||ac-bc;});
    starts.forEach((k,i)=>crosswordStarts[k]=i+1);
    crosswordWords.forEach(w=>{for(let i=0;i<w.word.length;i++){const r=w.row+(w.dir==='V'?i:0),c=w.col+(w.dir==='H'?i:0);crosswordSolution[`${r},${c}`]=w.word[i];}});
    const g=$('#crosswordGrid');g.innerHTML='';
    for(let r=0;r<15;r++)for(let c=0;c<15;c++){
      const cell=document.createElement('div');const key=`${r},${c}`;cell.className='cross-cell'+(crosswordSolution[key]?'':' block');
      if(crosswordSolution[key]){
        if(crosswordStarts[key]){const n=document.createElement('span');n.className='cell-num';n.textContent=crosswordStarts[key];cell.appendChild(n);}
        const inp=document.createElement('input'); inp.maxLength=1; inp.dataset.key=key; inp.autocomplete='off'; inp.setAttribute('aria-label',`Fila ${r+1}, columna ${c+1}`);
        inp.addEventListener('input',e=>{let v=e.target.value.toUpperCase().replace(/[^A-ZÑ]/g,'').slice(-1);e.target.value=v;validateCrossCell(e.target);updateCrosswordSolved();});
        inp.addEventListener('keydown',e=>arrowCrossword(e,r,c)); cell.appendChild(inp);
      }g.appendChild(cell);
    }
    const clues=$('#crosswordClues');clues.innerHTML='';
    crosswordWords.forEach((w,idx)=>{const li=document.createElement('li');li.dataset.word=w.word;li.innerHTML=`<strong>${crosswordStarts[`${w.row},${w.col}`]} ${w.dir==='H'?'→':'↓'}</strong> ${w.clue}`;clues.appendChild(li);});
  }
  function validateCrossCell(inp){const expected=crosswordSolution[inp.dataset.key];inp.classList.remove('correct','wrong');if(inp.value)inp.classList.add(inp.value===expected?'correct':'wrong');}
  function arrowCrossword(e,r,c){
    const dirs={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowDown:[1,0],ArrowUp:[-1,0]};if(!dirs[e.key])return;e.preventDefault();let [dr,dc]=dirs[e.key],nr=r+dr,nc=c+dc;
    while(nr>=0&&nr<15&&nc>=0&&nc<15){const next=$(`input[data-key="${nr},${nc}"]`);if(next){next.focus();return;}nr+=dr;nc+=dc;}
  }
  function updateCrosswordSolved(){
    crosswordSolved.clear();
    crosswordWords.forEach(w=>{let ok=true;for(let i=0;i<w.word.length;i++){const r=w.row+(w.dir==='V'?i:0),c=w.col+(w.dir==='H'?i:0);const inp=$(`input[data-key="${r},${c}"]`);if(!inp||inp.value!==w.word[i]){ok=false;break;}}if(ok)crosswordSolved.add(w.word);});
    $$('#crosswordClues li').forEach(li=>li.classList.toggle('solved',crosswordSolved.has(li.dataset.word)));
    if(crosswordSolved.size===crosswordWords.length)markComplete('crossword','¡Crucigrama completado! Dominaste los conceptos clave.');
  }
  $('#resetCrossword').addEventListener('click',()=>{$$('#crosswordGrid input').forEach(i=>{i.value='';i.classList.remove('correct','wrong')});crosswordSolved.clear();$$('#crosswordClues li').forEach(li=>li.classList.remove('solved'));});

  // Logic game
  const logicCases=[
    {q:'Necesitas ver solo gastos mayores a S/ 5,000 sin borrar el resto de registros.',opts:['Filtro','Combinar celdas','Insertar imagen'],a:0,why:'Un filtro oculta temporalmente los registros que no cumplen la condición.'},
    {q:'Quieres que las variaciones mayores a 15% aparezcan automáticamente en rojo.',opts:['Formato condicional','Orden alfabético','Filtro por texto'],a:0,why:'El formato condicional aplica estilos en función de reglas.'},
    {q:'Debes extraer a otra zona los registros donde Área = Ventas y Gasto real > 5000.',opts:['Filtro avanzado','Formato de página','Autorrelleno'],a:0,why:'El filtro avanzado permite rangos de criterios complejos y copiar resultados.'},
    {q:'Necesitas resumir rápidamente el gasto por área y por mes.',opts:['Tabla dinámica','Buscar y reemplazar','Validación de datos'],a:0,why:'La tabla dinámica agrupa y resume campos en filas, columnas y valores.'},
    {q:'Una IA afirma que un área tiene sobrecosto, pero tu tabla dinámica no lo confirma.',opts:['Aceptar la IA sin revisar','Contrastar con los datos y ajustar o descartar','Eliminar la tabla dinámica'],a:1,why:'La sesión exige verificar las sugerencias de IA con evidencia de la hoja.'},
    {q:'Quieres obtener el valor más alto de gasto de una columna para sustentar un hallazgo.',opts:['Función MAX','Filtro por color','Formato de moneda'],a:0,why:'MAX devuelve el mayor valor numérico del rango y sirve como indicador verificable.'}
  ];
  let logicAnswered=new Set(), logicCorrect=0;
  function buildLogic(){
    logicAnswered=new Set();logicCorrect=0;$('#logicScore').textContent='0';const wrap=$('#logicCases');wrap.innerHTML='';
    logicCases.forEach((c,i)=>{const card=document.createElement('article');card.className='logic-case';card.innerHTML=`<span class="case-no">CASO ${i+1}</span><h4>${c.q}</h4><div class="logic-options"></div><div class="case-feedback"></div>`;const opts=$('.logic-options',card);
      c.opts.forEach((o,oi)=>{const b=document.createElement('button');b.type='button';b.className='logic-option';b.textContent=o;b.addEventListener('click',()=>answerLogic(i,oi,card));opts.appendChild(b);});wrap.appendChild(card);});
  }
  function answerLogic(i,choice,card){if(logicAnswered.has(i))return;logicAnswered.add(i);const c=logicCases[i];const buttons=$$('.logic-option',card);buttons.forEach((b,idx)=>{b.disabled=true;if(idx===c.a)b.classList.add('correct');if(idx===choice&&idx!==c.a)b.classList.add('wrong');});if(choice===c.a)logicCorrect++;$('#logicScore').textContent=logicCorrect;$('.case-feedback',card).textContent=(choice===c.a?'✓ Correcto. ':'✗ Revisa. ')+c.why;if(logicAnswered.size===logicCases.length)markComplete('logic',`Reto mental completado: ${logicCorrect}/6 respuestas correctas.`);}
  $('#resetLogic').addEventListener('click',buildLogic);

  // Word search: exactly 10 target words.
  const wordTargets=['FILTRO','AVANZADO','FORMATO','TABLA','DINAMICA','DATOS','RANGO','CRITERIO','CAMPO','EXCEL'];
  const wordGridRows=[
    'RDINAMICAYRAIYU','KDJNFOAXXIAVQYF','QDUJUQTCGENALYF','RYQATKAPCAGNDLZ','JHBHSMCRCXOZPCY',
    'RYEEPVIPRFIAQFT','NGROYTXWGWJDMIV','ULOQEODHHCKOALS','RHSRDHACWUBHCTB','KCIQAHIVPGREXRS',
    'SOPHTZPZNGDDVOE','NLNNOOXTABLABVX','UUDBSMXOTAMROFC','KZDHGGROENFIOHE','COZRDBURACYHFNL'
  ];
  let wordStart=null,foundWords=new Set();
  function buildWordsearch(){
    wordStart=null;foundWords=new Set();$('#foundCount').textContent='0';const g=$('#wordsearchGrid');g.innerHTML='';
    wordGridRows.forEach((row,r)=>row.split('').forEach((ch,c)=>{const b=document.createElement('button');b.type='button';b.className='word-cell';b.textContent=ch;b.dataset.r=r;b.dataset.c=c;b.addEventListener('click',()=>clickWordCell(b));g.appendChild(b);}));
    const list=$('#wordList');list.innerHTML='';wordTargets.forEach(w=>{const d=document.createElement('div');d.className='word-token';d.dataset.word=w;d.textContent=w;list.appendChild(d);});
  }
  function clickWordCell(cell){const r=+cell.dataset.r,c=+cell.dataset.c;if(!wordStart){wordStart={r,c,cell};cell.classList.add('start');showToast('Ahora selecciona la última letra de la palabra.');return;}
    wordStart.cell.classList.remove('start');const path=linePath(wordStart.r,wordStart.c,r,c);wordStart=null;if(!path){showToast('Selecciona una línea horizontal, vertical o diagonal.','error');return;}
    const str=path.map(([rr,cc])=>wordGridRows[rr][cc]).join('');const rev=str.split('').reverse().join('');const found=wordTargets.find(w=>(w===str||w===rev)&&!foundWords.has(w));
    if(!found){showToast('Esa selección no corresponde a una palabra pendiente.','error');return;}
    foundWords.add(found);path.forEach(([rr,cc])=>$(`.word-cell[data-r="${rr}"][data-c="${cc}"]`).classList.add('found'));$(`.word-token[data-word="${found}"]`).classList.add('found');$('#foundCount').textContent=foundWords.size;showToast(`✓ ${found} encontrada`);if(foundWords.size===wordTargets.length)markComplete('wordsearch','¡Encontraste las 10 palabras de Excel!');
  }
  function linePath(r1,c1,r2,c2){let dr=r2-r1,dc=c2-c1;if(dr===0&&dc===0)return [[r1,c1]];let steps=Math.max(Math.abs(dr),Math.abs(dc));if(!(dr===0||dc===0||Math.abs(dr)===Math.abs(dc)))return null;dr=dr===0?0:dr/Math.abs(dr);dc=dc===0?0:dc/Math.abs(dc);const arr=[];for(let i=0;i<=steps;i++)arr.push([r1+dr*i,c1+dc*i]);return arr;}
  $('#resetWordsearch').addEventListener('click',buildWordsearch);

  // Quiz
  const quiz=[
    {q:'¿Qué atajo activa o desactiva los filtros en Excel?',o:['Ctrl + Shift + L','Ctrl + P','Alt + F4','Ctrl + B'],a:0,e:'Ctrl + Shift + L activa o desactiva el autofiltro.'},
    {q:'En un rango de criterios de Filtro avanzado, dos condiciones colocadas en la misma fila representan:',o:['OR','AND','NOT','Ninguna relación'],a:1,e:'En la misma fila, las condiciones deben cumplirse simultáneamente (AND).'},
    {q:'¿Qué afirmación describe mejor el formato condicional?',o:['Cambia los valores de las celdas','Aplica estilos según reglas sin modificar el valor','Elimina duplicados automáticamente','Convierte todo a texto'],a:1,e:'El formato condicional modifica la apariencia, no el contenido de la celda.'},
    {q:'Para resumir Gasto real por Área en una tabla dinámica, una configuración adecuada es:',o:['Área en Filas y Gasto real en Valores','Área en Valores y Gasto real en Filtros únicamente','Todo en Columnas','No usar campos'],a:0,e:'Área categoriza las filas y Gasto real se agrega como medida.'},
    {q:'Antes de analizar una base de presupuesto, ¿qué acción es prioritaria?',o:['Insertar formas','Revisar encabezados, tipos de datos, duplicados e inconsistencias','Cambiar el fondo de la hoja','Ocultar todas las columnas'],a:1,e:'La sesión prioriza organizar y depurar la base antes del análisis.'},
    {q:'¿Cuál de estas funciones sirve para obtener indicadores estadísticos básicos?',o:['SUMA, PROMEDIO, MAX, MIN y CONTAR','HIPERVINCULO únicamente','ALEATORIO únicamente','IMAGEN únicamente'],a:0,e:'Esas funciones ayudan a calcular indicadores verificables del presupuesto.'},
    {q:'Una buena interpretación de datos debe:',o:['Basarse en evidencia obtenida del análisis','Repetir solo los encabezados','Ignorar valores atípicos','Usar opiniones sin datos'],a:0,e:'La interpretación debe vincular resultados con evidencia de la hoja.'},
    {q:'¿Cuál es el uso responsable de la IA según la sesión?',o:['Aceptar todas sus respuestas','Usarla para reemplazar los cálculos','Contrastar sus sugerencias y aceptar, ajustar o descartar con criterio','Evitar revisar los datos'],a:2,e:'La IA funciona como apoyo y sus sugerencias deben verificarse.'},
    {q:'Una ventaja del Filtro avanzado frente al filtro común es que puede:',o:['Copiar el resultado filtrado a otra ubicación y usar rangos de criterios','Crear diapositivas','Modificar el sistema operativo','Enviar correos automáticamente'],a:0,e:'El filtro avanzado permite criterios estructurados y extracción a otra ubicación.'},
    {q:'Después del análisis, la sesión solicita formular:',o:['Al menos tres decisiones de mejora sustentadas en los datos','Una contraseña nueva','Solo un cambio de color','Una conclusión sin cifras'],a:0,e:'Las decisiones deben estar sustentadas en los resultados obtenidos.'}
  ];
  function buildQuiz(){const f=$('#quizForm');f.innerHTML='';quiz.forEach((q,i)=>{const card=document.createElement('article');card.className='question-card';card.innerHTML=`<div class="question-head"><span class="question-num">${i+1}</span><div style="flex:1"><h3>${q.q}</h3><div class="answers"></div><div class="question-feedback"></div></div></div>`;const a=$('.answers',card);q.o.forEach((opt,oi)=>{const id=`q${i}_${oi}`;const d=document.createElement('div');d.className='answer-option';d.innerHTML=`<input type="radio" name="q${i}" id="${id}" value="${oi}"><label for="${id}">${opt}</label>`;a.appendChild(d);});f.appendChild(card);});}
  $('#submitQuiz').addEventListener('click',()=>{
    let score=0,answered=0;quiz.forEach((q,i)=>{const selected=$(`input[name="q${i}"]:checked`);const card=$$('.question-card')[i];$$('label',card).forEach(l=>l.classList.remove('correct','wrong'));if(selected){answered++;const v=+selected.value;const labels=$$('label',card);labels[q.a].classList.add('correct');if(v!==q.a)labels[v].classList.add('wrong');if(v===q.a)score++;$('.question-feedback',card).textContent=(v===q.a?'✓ Correcto. ':'✗ Respuesta a revisar. ')+q.e;}else{$('.question-feedback',card).textContent='Selecciona una alternativa.';}});
    if(answered<quiz.length){showToast(`Faltan ${quiz.length-answered} pregunta(s) por responder.`, 'error');return;}
    progress.quizScore=score;markComplete('quiz',`Cuestionario completado: ${score}/10.`);const r=$('#quizResult');r.classList.remove('hidden');r.innerHTML=`<strong>${score}/10</strong><span>${score>=8?'Excelente dominio de los contenidos.':score>=6?'Buen avance; revisa la retroalimentación para reforzar conceptos.':'Revisa los módulos teóricos y vuelve a intentarlo para consolidar tu aprendizaje.'}</span>`;
  });
  $('#resetQuiz').addEventListener('click',()=>{buildQuiz();$('#quizResult').classList.add('hidden');});

  function initGamesFromProgress(){buildCrossword();buildLogic();buildWordsearch();buildQuiz();syncProgressUI();}

  // Diploma
  function updateDiplomaArea(){
    const list=$('#diplomaChecklist');if(!list)return;list.innerHTML='';activityKeys.forEach(k=>{const d=document.createElement('div');d.className='check-item'+(progress[k]?' done':'');d.innerHTML=`<span class="mark">${progress[k]?'✓':'•'}</span><span>${activityLabels[k]}</span>`;list.appendChild(d);});
    if(allComplete()){$('#diplomaLocked').classList.add('hidden');$('#diplomaUnlocked').classList.remove('hidden');if(!progress.completionDate){progress.completionDate=new Date().toISOString();saveProgress();}if(currentUser)renderDiploma();}
    else{$('#diplomaLocked').classList.remove('hidden');$('#diplomaUnlocked').classList.add('hidden');const remaining=activityKeys.filter(k=>!progress[k]).length;$('#lockMessage').textContent=`Te ${remaining===1?'falta':'faltan'} ${remaining} ${remaining===1?'actividad':'actividades'} para llegar al 100%.`;}
  }
  async function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});}
  function fitFont(ctx,text,maxWidth,start,min=38){let size=start;ctx.font=`700 ${size}px Arial`;while(ctx.measureText(text).width>maxWidth&&size>min){size-=2;ctx.font=`700 ${size}px Arial`;}return size;}
  async function renderDiploma(){
    if(!currentUser||!allComplete())return;const canvas=$('#diplomaCanvas'),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);ctx.fillStyle='#fbfdfc';ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#107c41';ctx.fillRect(0,0,w,26);ctx.fillStyle='#ef173f';ctx.fillRect(0,h-18,w,18);
    ctx.strokeStyle='#107c41';ctx.lineWidth=5;ctx.strokeRect(38,38,w-76,h-76);ctx.strokeStyle='#b6d8c4';ctx.lineWidth=2;ctx.strokeRect(55,55,w-110,h-110);
    ctx.fillStyle='#e8f6ee';ctx.beginPath();ctx.arc(1450,130,210,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fbe9ed';ctx.beginPath();ctx.arc(120,1040,170,0,Math.PI*2);ctx.fill();
    try{const logo=await loadImage('assets/sise-logo.png');ctx.drawImage(logo,95,82,120,120);}catch(e){}
    ctx.textAlign='right';ctx.fillStyle='#0f5130';ctx.font='800 30px Arial';ctx.fillText('MICROSOFT EXCEL 365',1490,115);ctx.fillStyle='#75827b';ctx.font='500 20px Arial';ctx.fillText('Taller de Informática para la Empleabilidad',1490,150);
    ctx.textAlign='center';ctx.fillStyle='#107c41';ctx.font='900 28px Arial';ctx.fillText('DIPLOMA DE FINALIZACIÓN',w/2,270);
    ctx.fillStyle='#26342c';ctx.font='500 27px Arial';ctx.fillText('Se otorga a',w/2,340);
    const fs=fitFont(ctx,currentUser.name,w-300,72,40);ctx.fillStyle='#12251a';ctx.font=`700 ${fs}px Arial`;ctx.fillText(currentUser.name,w/2,438);
    ctx.strokeStyle='#b7cfc0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(300,475);ctx.lineTo(1300,475);ctx.stroke();
    ctx.fillStyle='#506057';ctx.font='500 24px Arial';ctx.fillText('por completar satisfactoriamente la experiencia educativa',w/2,545);
    ctx.fillStyle='#0c5f35';ctx.font='800 36px Arial';ctx.fillText('ANÁLISIS DE DATOS EN EXCEL 365',w/2,605);
    ctx.fillStyle='#506057';ctx.font='500 23px Arial';ctx.fillText('Filtros · Filtros avanzados · Formato condicional · Tablas dinámicas · Toma de decisiones e IA',w/2,652);
    const date=new Date(progress.completionDate||Date.now()).toLocaleDateString('es-PE',{day:'2-digit',month:'long',year:'numeric'});ctx.font='600 21px Arial';ctx.fillStyle='#3e4d45';ctx.fillText(`Finalizado el ${date}`,w/2,730);ctx.fillText(currentUser.email,w/2,768);
    if(progress.quizScore!==null){ctx.fillStyle='#e8f6ee';roundRect(ctx,w/2-120,805,240,72,18,true,false);ctx.fillStyle='#0e6d3c';ctx.font='800 24px Arial';ctx.fillText(`Cuestionario: ${progress.quizScore}/10`,w/2,850);}
    ctx.textAlign='left';ctx.fillStyle='#5e6c64';ctx.font='500 18px Arial';ctx.fillText('Prof. Julio Dávila Salvador',110,965);ctx.fillStyle='#16251c';ctx.font='700 19px Arial';ctx.fillText('Docente',110,995);
    ctx.textAlign='right';ctx.fillStyle='#5e6c64';ctx.font='500 18px Arial';ctx.fillText(`Código: ${certificateId(currentUser.email)}`,1490,965);ctx.fillStyle='#16251c';ctx.font='700 19px Arial';ctx.fillText('SISE · CPEX',1490,995);
    ctx.textAlign='center';ctx.fillStyle='#7b8981';ctx.font='500 16px Arial';ctx.fillText('“Los datos cobran valor cuando se convierten en decisiones responsables.”',w/2,1050);
  }
  function roundRect(ctx,x,y,w,h,r,fill,stroke){if(w<2*r)r=w/2;if(h<2*r)r=h/2;ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();if(fill)ctx.fill();if(stroke)ctx.stroke();}
  function certificateId(email){let h=0;for(let i=0;i<email.length;i++)h=((h<<5)-h)+email.charCodeAt(i),h|=0;return `SIS-${Math.abs(h).toString(36).toUpperCase().padStart(6,'0').slice(0,6)}`;}

  // Minimal one-image PDF writer: embeds the diploma canvas as JPEG into an A4 landscape PDF.
  function canvasToPdfBlob(canvas){
    const dataUrl=canvas.toDataURL('image/jpeg',0.94),b64=dataUrl.split(',')[1],bin=atob(b64),jpg=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)jpg[i]=bin.charCodeAt(i);
    const enc=s=>new TextEncoder().encode(s),chunks=[],offsets=[0];let len=0;const push=u=>{chunks.push(u);len+=u.length;};
    push(new Uint8Array([37,80,68,70,45,49,46,52,10,37,255,255,255,255,10]));
    const addObj=(num,parts)=>{offsets[num]=len;push(enc(`${num} 0 obj\n`));parts.forEach(p=>push(p));push(enc(`\nendobj\n`));};
    addObj(1,[enc('<< /Type /Catalog /Pages 2 0 R >>')]);
    addObj(2,[enc('<< /Type /Pages /Kids [3 0 R] /Count 1 >>')]);
    addObj(3,[enc('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>')]);
    const content=enc('q\n842 0 0 595 0 0 cm\n/Im0 Do\nQ\n');
    addObj(4,[enc(`<< /Length ${content.length} >>\nstream\n`),content,enc('endstream')]);
    addObj(5,[enc(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`),jpg,enc('\nendstream')]);
    const xrefStart=len;push(enc('xref\n0 6\n0000000000 65535 f \n'));for(let i=1;i<=5;i++)push(enc(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`));push(enc(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`));
    return new Blob(chunks,{type:'application/pdf'});
  }
  $('#downloadDiploma').addEventListener('click',async()=>{await renderDiploma();const blob=canvasToPdfBlob($('#diplomaCanvas'));const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`Diploma_Excel365_${currentUser.name.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9]+/g,'_')}.pdf`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500);showToast('Diploma PDF generado correctamente.');});
  $('#printDiploma').addEventListener('click',async()=>{await renderDiploma();const data=$('#diplomaCanvas').toDataURL('image/png');const w=window.open('','_blank');if(!w){showToast('Permite ventanas emergentes para imprimir.','error');return;}w.document.write(`<html><head><title>Diploma</title><style>html,body{margin:0}img{width:100%;display:block}@media print{@page{size:A4 landscape;margin:0}}</style></head><body><img src="${data}" onload="window.print()"></body></html>`);w.document.close();});

  $('#resetProgress').addEventListener('click',()=>{if(!currentUser)return;if(confirm('¿Deseas reiniciar todas tus actividades y el diploma? Esta acción no se puede deshacer.')){progress=defaultProgress();saveProgress();initGamesFromProgress();$('#quizResult').classList.add('hidden');showToast('Progreso reiniciado.');navigateTo('inicio');}});

  // Initial setup before login
  buildCrossword(); buildLogic(); buildWordsearch(); buildQuiz();
})();

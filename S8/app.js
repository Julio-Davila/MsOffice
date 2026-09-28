(() => {
"use strict";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const state = {
  user:null,
  completed:{theory:false,tips:false,crossword:false,memory:false,wordsearch:false,quiz:false},
  quizScore:0
};
const STORAGE_PREFIX="sise_ppt_ia_";
const ACCESS_HASH="7ac147d99dabb1e993dd7afb7f11775f35d3dc1711569316b56e1a5e99946dc5";

function sha256(ascii){
  function rightRotate(value, amount){ return (value>>>amount) | (value<<(32-amount)); }
  const mathPow=Math.pow,maxWord=mathPow(2,32),lengthProperty="length";
  let i,j,result="",words=[],asciiBitLength=ascii[lengthProperty]*8,hash=sha256.h=sha256.h||[],k=sha256.k=sha256.k||[],primeCounter=k[lengthProperty],isComposite={};
  for(let candidate=2;primeCounter<64;candidate++){if(!isComposite[candidate]){for(i=0;i<313;i+=candidate)isComposite[i]=candidate;hash[primeCounter]=(mathPow(candidate,.5)*maxWord)|0;k[primeCounter++]=(mathPow(candidate,1/3)*maxWord)|0;}}
  ascii+="\x80"; while(ascii[lengthProperty]%64-56)ascii+="\x00";
  for(i=0;i<ascii[lengthProperty];i++){j=ascii.charCodeAt(i); if(j>>8)return ""; words[i>>2]|=j<<((3-i)%4)*8;}
  words[words[lengthProperty]]=((asciiBitLength/maxWord)|0);words[words[lengthProperty]]=asciiBitLength;
  for(j=0;j<words[lengthProperty];){
    const w=words.slice(j,j+=16),oldHash=hash; hash=hash.slice(0,8);
    for(i=0;i<64;i++){
      const i2=i+j,w15=w[i-15],w2=w[i-2],a=hash[0],e=hash[4];
      const temp1=hash[7]+(rightRotate(e,6)^rightRotate(e,11)^rightRotate(e,25))+((e&hash[5])^((~e)&hash[6]))+k[i]+(w[i]=(i<16)?w[i]:(w[i-16]+(rightRotate(w15,7)^rightRotate(w15,18)^(w15>>>3))+w[i-7]+(rightRotate(w2,17)^rightRotate(w2,19)^(w2>>>10)))|0);
      const temp2=(rightRotate(a,2)^rightRotate(a,13)^rightRotate(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
      hash=[(temp1+temp2)|0].concat(hash);hash[4]=(hash[4]+temp1)|0;hash.pop();
    }
    for(i=0;i<8;i++)hash[i]=(hash[i]+oldHash[i])|0;
  }
  for(i=0;i<8;i++)for(j=3;j+1;j--){const b=(hash[i]>>(j*8))&255;result+=(b<16?0:"")+b.toString(16);}
  return result;
}

function toast(msg,type="good"){
  const t=$("#toast"); t.textContent=msg;t.className=`toast ${type} show`;
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2800);
}
function cleanText(s){return (s||"").trim().replace(/\s+/g," ")}
function progressKey(){return state.user?`${STORAGE_PREFIX}${state.user.email.toLowerCase()}`:null}
function save(){
  if(!state.user)return;
  localStorage.setItem(progressKey(),JSON.stringify({user:state.user,completed:state.completed,quizScore:state.quizScore}));
}
function loadForUser(user){
  const raw=localStorage.getItem(`${STORAGE_PREFIX}${user.email.toLowerCase()}`);
  if(raw){try{const old=JSON.parse(raw);state.completed={...state.completed,...old.completed};state.quizScore=old.quizScore||0;}catch(e){}}
  state.user=user; save(); updateUI();
}
function completionCount(){return Object.values(state.completed).filter(Boolean).length}
function isAllDone(){return completionCount()===Object.keys(state.completed).length}
function updateUI(){
  const total=Object.keys(state.completed).length,done=completionCount(),pct=Math.round(done/total*100);
  $("#progressPercent").textContent=pct+"%";$("#progressTop").textContent=pct+"% completado";$("#progressBar").style.width=pct+"%";
  $("#progressRing").style.background=`conic-gradient(var(--ppt) ${pct}%, #eceef1 ${pct}%)`;
  $("#progressMessage").textContent=isAllDone()?"¡Ruta completa! Tu diploma ya está desbloqueado.":`Has completado ${done} de ${total} actividades obligatorias.`;
  $("#dotTheory").classList.toggle("done",state.completed.theory);$("#dotTips").classList.toggle("done",state.completed.tips);
  $("#dotGames").classList.toggle("done",state.completed.crossword&&state.completed.memory&&state.completed.wordsearch);
  $("#dotQuiz").classList.toggle("done",state.completed.quiz);
  $("#theoryStatus").textContent=state.completed.theory?"Actividad completada ✓":"";
  $("#tipsStatus").textContent=state.completed.tips?"Actividad completada ✓":"";
  if(state.user){
    $("#userNameTop").textContent=state.user.name.split(" ")[0];
    $("#avatar").textContent=state.user.name.charAt(0).toUpperCase();
    $("#diplomaName").textContent=state.user.name;$("#diplomaEmail").textContent=state.user.email;
  }
  const missing=[];
  if(!state.completed.theory)missing.push("teoría");
  if(!state.completed.tips)missing.push("tips");
  if(!state.completed.crossword)missing.push("crucigrama");
  if(!state.completed.memory)missing.push("memoria");
  if(!state.completed.wordsearch)missing.push("sopa de letras");
  if(!state.completed.quiz)missing.push("cuestionario");
  $("#diplomaMissing").textContent=missing.length?`Pendiente: ${missing.join(", ")}.`:"Todo completado.";
  $("#diplomaLock").classList.toggle("hidden",isAllDone());$("#diplomaArea").classList.toggle("hidden",!isAllDone());
  if(isAllDone()){
    const d=new Date();$("#diplomaDate").textContent=d.toLocaleDateString("es-PE",{year:"numeric",month:"long",day:"numeric"});
  }
}
function go(section){
  $$(".section").forEach(s=>s.classList.toggle("active",s.id===section));
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.section===section));
  window.scrollTo({top:0,behavior:"smooth"});
  closeMenu();
}
function closeMenu(){$("#sidebar").classList.remove("open");$("#overlay").classList.remove("show");$("#menuBtn").setAttribute("aria-expanded","false")}


// V2 visual gallery: 10 ultra-realistic SISE + PowerPoint + AI images
const visualPhotos = [
  {src:"assets/photos/01_Colaboracion_PowerPoint_IA_SISE.png",cap:"Colaboración: estudiantes crean una presentación profesional con apoyo de IA."},
  {src:"assets/photos/02_Presentacion_Aula_SISE.png",cap:"Presentación en aula: comunicación visual, storytelling y diseño de alto impacto."},
  {src:"assets/photos/03_Estudiante_PowerPoint_Copilot.png",cap:"Trabajo individual: estudiante mejora una presentación con Copilot."},
  {src:"assets/photos/04_Celebracion_Certificados_SISE.png",cap:"Meta alcanzada: cierre de la experiencia y reconocimiento del aprendizaje."},
  {src:"assets/photos/05_Laboratorio_Presentaciones_IA.png",cap:"Laboratorio creativo: diseño de presentaciones con IA en un entorno colaborativo."},
  {src:"assets/photos/06_Estudiante_Creando_con_IA.png",cap:"Creación con propósito: ideas, audiencia, mensaje, diseño y resultado."},
  {src:"assets/photos/07_Trabajo_Equipo_Storytelling_IA.png",cap:"Trabajo en equipo: estructura, narrativa y planificación de una presentación."},
  {src:"assets/photos/08_Clase_Hibrida_PowerPoint_IA.png",cap:"Clase híbrida: revisión de contenido y mejora de diapositivas con IA."},
  {src:"assets/photos/09_Taller_Presentaciones_Impacto.png",cap:"Taller práctico: diseño con IA, storytelling y comunicación profesional."},
  {src:"assets/photos/10_Portada_Grupo_SISE_PowerPoint_IA.png",cap:"Portada inspiradora: estudiantes SISE, PowerPoint e Inteligencia Artificial."}
];
let heroPhotoIndex=9, heroTimer=null, lightboxIndex=0;
function renderHeroPhoto(){
  const p=visualPhotos[heroPhotoIndex],img=$("#heroPhoto");
  if(!img)return;
  img.style.opacity="0";
  setTimeout(()=>{img.src=p.src;img.alt=p.cap;$("#heroPhotoCount").textContent=`${String(heroPhotoIndex+1).padStart(2,"0")} / 10`;$("#heroPhotoTitle").textContent=heroPhotoIndex===9?"PowerPoint + IA en acción":"Aprendizaje visual SISE";$("#heroPhotoText").textContent=p.cap;img.style.opacity="1";},160);
  $$("#heroDots button").forEach((b,i)=>b.classList.toggle("active",i===heroPhotoIndex));
}
function moveHero(dir){heroPhotoIndex=(heroPhotoIndex+dir+visualPhotos.length)%visualPhotos.length;renderHeroPhoto();restartHeroTimer()}
function restartHeroTimer(){clearInterval(heroTimer);heroTimer=setInterval(()=>moveHero(1),5500)}
function initHeroGallery(){
  const dots=$("#heroDots"); if(!dots)return;
  dots.innerHTML="";
  visualPhotos.forEach((_,i)=>{const b=document.createElement("button");b.type="button";b.setAttribute("aria-label",`Mostrar imagen ${i+1}`);b.addEventListener("click",()=>{heroPhotoIndex=i;renderHeroPhoto();restartHeroTimer()});dots.appendChild(b)});
  $("#heroPrev")?.addEventListener("click",()=>moveHero(-1));$("#heroNext")?.addEventListener("click",()=>moveHero(1));
  renderHeroPhoto();restartHeroTimer();
}
function openLightbox(i){
  lightboxIndex=i;const p=visualPhotos[i],box=$("#photoLightbox");$("#lightboxImg").src=p.src;$("#lightboxImg").alt=p.cap;$("#lightboxCaption").textContent=p.cap;$("#lightboxCount").textContent=`${String(i+1).padStart(2,"0")} / 10`;box.classList.add("show");box.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeLightbox(){const box=$("#photoLightbox");box.classList.remove("show");box.setAttribute("aria-hidden","true");document.body.style.overflow=""}
function moveLightbox(dir){lightboxIndex=(lightboxIndex+dir+visualPhotos.length)%visualPhotos.length;openLightbox(lightboxIndex)}
function initLightbox(){
  $$(".photo-card").forEach((card,i)=>$(".photo-open",card)?.addEventListener("click",()=>openLightbox(i)));
  $("#lightboxClose")?.addEventListener("click",closeLightbox);$("#lightboxPrev")?.addEventListener("click",()=>moveLightbox(-1));$("#lightboxNext")?.addEventListener("click",()=>moveLightbox(1));
  $("#photoLightbox")?.addEventListener("click",e=>{if(e.target.id==="photoLightbox")closeLightbox()});
  document.addEventListener("keydown",e=>{if(!$("#photoLightbox")?.classList.contains("show"))return;if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft")moveLightbox(-1);if(e.key==="ArrowRight")moveLightbox(1)});
}


// V3 welcome collage rotator
let welcomeCollageTimer=null, welcomeStartIndex=0;
function renderWelcomeCollage(){
  const ids=["welcomeShot1","welcomeShot2","welcomeShot3","welcomeShot4","welcomeShot5","welcomeShot6"];
  ids.forEach((id,offset)=>{
    const el=$("#"+id); if(!el) return;
    const item=visualPhotos[(welcomeStartIndex+offset)%visualPhotos.length];
    el.style.opacity="0";
    setTimeout(()=>{el.src=item.src; el.alt=item.cap; el.style.opacity="1";}, 120 + offset*35);
  });
}
function initWelcomeCollage(){
  if(!$("#welcomeCollage")) return;
  renderWelcomeCollage();
  clearInterval(welcomeCollageTimer);
  welcomeCollageTimer=setInterval(()=>{
    welcomeStartIndex=(welcomeStartIndex+1)%visualPhotos.length;
    renderWelcomeCollage();
  }, 4200);
}


// V4 welcome background slider
let welcomeBgIndex=0, welcomeBgTimer=null;
function renderWelcomeBgDots(){
  const slides=$$(".welcome-bg-slide"), dots=$("#welcomeSliderDots");
  if(!dots || !slides.length) return;
  dots.innerHTML="";
  slides.forEach((_,i)=>{
    const b=document.createElement("button");
    b.type="button";
    b.setAttribute("aria-label",`Mostrar fondo ${i+1}`);
    b.classList.toggle("active",i===welcomeBgIndex);
    b.addEventListener("click",()=>{welcomeBgIndex=i;updateWelcomeBgSlider();restartWelcomeBgTimer()});
    dots.appendChild(b);
  });
}
function updateWelcomeBgSlider(){
  const slides=$$(".welcome-bg-slide"), dots=$$("#welcomeSliderDots button");
  slides.forEach((s,i)=>s.classList.toggle("active",i===welcomeBgIndex));
  dots.forEach((d,i)=>d.classList.toggle("active",i===welcomeBgIndex));
}
function restartWelcomeBgTimer(){
  clearInterval(welcomeBgTimer);
  welcomeBgTimer=setInterval(()=>{
    const slides=$$(".welcome-bg-slide");
    if(!slides.length) return;
    welcomeBgIndex=(welcomeBgIndex+1)%slides.length;
    updateWelcomeBgSlider();
  }, 3800);
}
function initWelcomeBgSlider(){
  const slides=$$(".welcome-bg-slide");
  if(!slides.length) return;
  renderWelcomeBgDots();
  updateWelcomeBgSlider();
  restartWelcomeBgTimer();
}

// Login
$("#loginForm").addEventListener("submit",e=>{
  e.preventDefault();const name=cleanText($("#studentName").value),email=cleanText($("#studentEmail").value),key=$("#accessKey").value;
  $("#loginError").textContent="";
  if(name.length<4){$("#loginError").textContent="Ingresa tu nombre completo.";return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){$("#loginError").textContent="Ingresa un correo válido.";return}
  if(sha256(key)!==ACCESS_HASH){$("#loginError").textContent="Clave de acceso incorrecta.";return}
  loadForUser({name,email});$("#welcomeModal").classList.remove("show");toast(`¡Bienvenido/a, ${name.split(" ")[0]}! Tu progreso se guardará en este equipo.`);
});
$("#togglePassword").addEventListener("click",()=>{$("#accessKey").type=$("#accessKey").type==="password"?"text":"password"});
$("#logoutBtn").addEventListener("click",()=>{state.user=null;$("#accessKey").value="";$("#welcomeModal").classList.add("show");closeMenu()});
$("#menuBtn").addEventListener("click",()=>{$("#sidebar").classList.add("open");$("#overlay").classList.add("show");$("#menuBtn").setAttribute("aria-expanded","true")});
$("#closeMenuBtn").addEventListener("click",closeMenu);$("#overlay").addEventListener("click",closeMenu);
$$("[data-section]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.section)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));

const quickTips=[
  "En presentación, presiona F5 para iniciar desde la primera diapositiva.",
  "Usa Shift + F5 para presentar desde la diapositiva actual.",
  "Ctrl + M crea una nueva diapositiva.",
  "Ctrl + D duplica rápidamente un objeto o diapositiva.",
  "Con Copilot, da contexto: audiencia, objetivo, tono y número de diapositivas.",
  "Antes de aceptar contenido de IA, verifica datos, nombres y cifras."
];
let tipIndex=0;$("#nextTipBtn").addEventListener("click",()=>{tipIndex=(tipIndex+1)%quickTips.length;$("#quickTip").textContent=quickTips[tipIndex]});
$("#completeTheory").addEventListener("click",()=>{state.completed.theory=true;save();updateUI();toast("Teoría completada. ¡Buen avance!")});
$("#completeTips").addEventListener("click",()=>{state.completed.tips=true;save();updateUI();toast("Tips completados. Ya tienes más recursos para diseñar mejor.")});

// Tabs
$$(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  $$(".tab").forEach(t=>t.classList.toggle("active",t===tab));
  $$(".tab-panel").forEach(p=>p.classList.toggle("active",p.id===tab.dataset.tab));
}));

// Crossword
const cwWords=[
  {n:1,word:"STORY",r:3,c:4,dir:"h",clue:"Narrativa que conecta ideas para comunicar un mensaje."},
  {n:2,word:"PROMPT",r:4,c:6,dir:"h",clue:"Indicación que se escribe a una IA para orientar su respuesta."},
  {n:3,word:"DISENO",r:5,c:5,dir:"h",clue:"Organización visual profesional de una presentación."},
  {n:4,word:"SLIDE",r:6,c:5,dir:"h",clue:"Palabra en inglés para diapositiva."},
  {n:5,word:"TITULO",r:7,c:1,dir:"h",clue:"Texto que debe expresar con claridad la idea principal de una diapositiva."},
  {n:6,word:"COPILOT",r:2,c:6,dir:"v",clue:"Asistente de IA integrado al ecosistema Microsoft 365."}
];
function buildCrossword(){
  const grid=$("#crosswordGrid");grid.innerHTML="";const cells={};
  for(let r=1;r<=11;r++)for(let c=1;c<=11;c++){const d=document.createElement("div");d.className="cw-cell";d.dataset.r=r;d.dataset.c=c;grid.appendChild(d);cells[`${r}-${c}`]=d}
  cwWords.forEach(w=>{
    [...w.word].forEach((ch,i)=>{const r=w.r+(w.dir==="v"?i:0),c=w.c+(w.dir==="h"?i:0),cell=cells[`${r}-${c}`];cell.classList.add("active");cell.dataset.letter=ch;
      if(i===0&&!cell.querySelector(".num")){const n=document.createElement("span");n.className="num";n.textContent=w.n;cell.appendChild(n)}
    });
  });
  const clues=$("#crosswordClues");clues.innerHTML="";
  cwWords.forEach(w=>{
    const wrap=document.createElement("div");wrap.className="cw-clue";wrap.dataset.word=w.word;
    wrap.innerHTML=`<p><b>${w.n}.</b> ${w.clue}</p><input aria-label="Respuesta pista ${w.n}" maxlength="${w.word.length}" placeholder="${w.word.length} letras"><button type="button">Validar</button>`;
    $("button",wrap).addEventListener("click",()=>checkCw(w,wrap,cells));$("input",wrap).addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();checkCw(w,wrap,cells)}});
    clues.appendChild(wrap);
  });
  cwSolved.clear(); if(state.completed.crossword){revealAllCrossword(cells);$("#crosswordFeedback").textContent="Crucigrama completado anteriormente ✓";}
}
const cwSolved=new Set();
function checkCw(w,wrap,cells){
  const input=$("input",wrap),answer=input.value.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  if(answer===w.word){
    wrap.classList.add("solved");input.disabled=true;$("button",wrap).disabled=true;cwSolved.add(w.word);
    [...w.word].forEach((ch,i)=>{const r=w.r+(w.dir==="v"?i:0),c=w.c+(w.dir==="h"?i:0),cell=cells[`${r}-${c}`];cell.append(document.createTextNode(ch))});
    toast("¡Correcto! Palabra revelada.");
    if(cwSolved.size===cwWords.length){state.completed.crossword=true;save();updateUI();$("#crosswordFeedback").textContent="¡Crucigrama completado! ✓";toast("🎉 Crucigrama completado.")}
  }else{wrap.classList.remove("solved");toast("Aún no. Revisa la pista e intenta otra vez.","warn")}
}
function revealAllCrossword(cells){cwWords.forEach(w=>[...w.word].forEach((ch,i)=>{const r=w.r+(w.dir==="v"?i:0),c=w.c+(w.dir==="h"?i:0),cell=cells[`${r}-${c}`];if(!cell.dataset.revealed){cell.append(document.createTextNode(ch));cell.dataset.revealed="1"}}))}
buildCrossword();

// Memory
const memoryPairs=[
  ["Copilot","Asistente de IA para apoyar la creación y mejora de contenido."],
  ["Storytelling","Secuencia narrativa que conecta ideas y guía a la audiencia."],
  ["Jerarquía visual","Orden visual que ayuda a reconocer qué información es más importante."],
  ["Prompt","Instrucción con contexto que orienta la respuesta de la IA."],
  ["Verificación","Revisión humana para comprobar que el contenido sea pertinente y verdadero."],
  ["Consistencia","Uso coherente de tipografía, alineación, colores y estilo."]
];
let flipped=[],lockMemory=false,matches=0;
function buildMemory(){
  const deck=memoryPairs.flatMap((p,i)=>[{pair:i,text:p[0]},{pair:i,text:p[1]}]).sort(()=>Math.random()-.5);
  const grid=$("#memoryGrid");grid.innerHTML="";flipped=[];matches=0;lockMemory=false;
  deck.forEach((card,i)=>{
    const b=document.createElement("button");b.className="memory-card";b.type="button";b.dataset.pair=card.pair;b.dataset.i=i;
    b.innerHTML=`<span class="memory-face memory-front">P</span><span class="memory-face memory-back">${card.text}</span>`;
    b.addEventListener("click",()=>flipCard(b));grid.appendChild(b);
  });
  $("#memoryFeedback").textContent=state.completed.memory?"Juego completado anteriormente ✓":"";
}
function flipCard(card){
  if(lockMemory||card.classList.contains("flipped")||card.classList.contains("matched"))return;
  card.classList.add("flipped");flipped.push(card);
  if(flipped.length===2){
    lockMemory=true;const [a,b]=flipped;
    if(a.dataset.pair===b.dataset.pair){setTimeout(()=>{a.classList.add("matched");b.classList.add("matched");flipped=[];lockMemory=false;matches++;toast("¡Pareja correcta!");
      if(matches===memoryPairs.length){state.completed.memory=true;save();updateUI();$("#memoryFeedback").textContent="¡Memoria completada! ✓";toast("🎉 Juego de memoria completado.")}},450)
    }else setTimeout(()=>{a.classList.remove("flipped");b.classList.remove("flipped");flipped=[];lockMemory=false},850);
  }
}
$("#resetMemory").addEventListener("click",buildMemory);buildMemory();

// Word Search
const wordTerms=["COPILOT","POWERPOINT","PROMPT","STORY","DISENO","ETICA","TITULO","AUDIENCIA","MENSAJE","VERIFICAR"];
let wordBoard=[],wordPlacements=[],wordFound=new Set(),wordStart=null;
const dirs=[[0,1],[1,0],[1,1],[-1,1]];
function makeWordSearch(){
  const N=15,letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";wordBoard=Array.from({length:N},()=>Array(N).fill(""));wordPlacements=[];wordFound=new Set();wordStart=null;
  const words=[...wordTerms].sort((a,b)=>b.length-a.length);
  for(const word of words){
    let placed=false;
    for(let attempt=0;attempt<500&&!placed;attempt++){
      const [dr,dc]=dirs[Math.floor(Math.random()*dirs.length)],r=Math.floor(Math.random()*N),c=Math.floor(Math.random()*N);
      const er=r+dr*(word.length-1),ec=c+dc*(word.length-1);if(er<0||er>=N||ec<0||ec>=N)continue;
      let ok=true;for(let i=0;i<word.length;i++){const rr=r+dr*i,cc=c+dc*i;if(wordBoard[rr][cc]&&wordBoard[rr][cc]!==word[i]){ok=false;break}}
      if(!ok)continue;for(let i=0;i<word.length;i++){wordBoard[r+dr*i][c+dc*i]=word[i]}wordPlacements.push({word,r,c,dr,dc});placed=true;
    }
  }
  for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!wordBoard[r][c])wordBoard[r][c]=letters[Math.floor(Math.random()*letters.length)];
  renderWordSearch();
}
function renderWordSearch(){
  const grid=$("#wordGrid");grid.innerHTML="";
  wordBoard.forEach((row,r)=>row.forEach((ch,c)=>{const b=document.createElement("button");b.type="button";b.className="word-cell";b.textContent=ch;b.dataset.r=r;b.dataset.c=c;b.addEventListener("click",()=>wordCellClick(b));grid.appendChild(b)}));
  const list=$("#wordList");list.innerHTML="";wordTerms.forEach(w=>{const s=document.createElement("span");s.textContent=w;s.dataset.word=w;list.appendChild(s)});
  $("#wordFeedback").textContent=state.completed.wordsearch?"Sopa de letras completada anteriormente ✓":"";
}
function lineCells(r1,c1,r2,c2){
  const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1),len=Math.max(Math.abs(r2-r1),Math.abs(c2-c1));
  if(!((r1===r2)||(c1===c2)||(Math.abs(r2-r1)===Math.abs(c2-c1))))return null;
  const cells=[];for(let i=0;i<=len;i++)cells.push([r1+dr*i,c1+dc*i]);return cells;
}
function wordCellClick(cell){
  const r=+cell.dataset.r,c=+cell.dataset.c;
  if(!wordStart){wordStart={r,c,cell};cell.classList.add("start");$("#wordFeedback").textContent="Ahora selecciona la última letra.";return}
  wordStart.cell.classList.remove("start");const cells=lineCells(wordStart.r,wordStart.c,r,c);wordStart=null;
  if(!cells){$("#wordFeedback").textContent="Selecciona una línea horizontal, vertical o diagonal.";return}
  const str=cells.map(([rr,cc])=>wordBoard[rr][cc]).join(""),rev=[...str].reverse().join("");const found=wordTerms.find(w=>!wordFound.has(w)&&(w===str||w===rev));
  if(found){
    wordFound.add(found);cells.forEach(([rr,cc])=>{const el=$(`.word-cell[data-r="${rr}"][data-c="${cc}"]`);el.classList.add("found")});$(`#wordList span[data-word="${found}"]`).classList.add("found");$("#wordFeedback").textContent=`¡Encontraste ${found}!`;toast(`✓ ${found}`);
    if(wordFound.size===wordTerms.length){state.completed.wordsearch=true;save();updateUI();$("#wordFeedback").textContent="¡Encontraste las 10 palabras! ✓";toast("🎉 Sopa de letras completada.")}
  }else $("#wordFeedback").textContent="Esa selección no corresponde a una palabra pendiente.";
}
$("#resetWordSearch").addEventListener("click",makeWordSearch);makeWordSearch();

// Quiz
const questions=[
  {q:"¿Qué debe definirse antes de desarrollar una presentación profesional?",o:["Solo la animación","Propósito, audiencia y mensaje central","El número máximo de imágenes","El color del fondo"],a:1,e:"La sesión propone revisar propósito, audiencia, mensaje central y secuencia de ideas."},
  {q:"¿Para qué puede usarse Copilot durante la creación de una presentación?",o:["Para eliminar la revisión humana","Para proponer estructura, mejorar títulos y sintetizar ideas","Para garantizar que toda información sea verdadera","Para reemplazar al expositor"],a:1,e:"Copilot funciona como apoyo; sus sugerencias deben ser revisadas críticamente."},
  {q:"¿Qué secuencia representa mejor el storytelling trabajado?",o:["Cierre → inicio → diseño","Inicio → desarrollo → cierre","Título → fuente → transición","Datos → color → animación"],a:1,e:"El storytelling ordena la presentación con inicio, desarrollo y cierre coherentes."},
  {q:"¿Cuál es un criterio de diseño profesional?",o:["Usar mucho texto en todas las diapositivas","Cambiar de tipografía en cada slide","Mantener jerarquía visual, legibilidad y consistencia","Usar animaciones en todos los elementos"],a:2,e:"La sesión destaca jerarquía visual, legibilidad, consistencia y equilibrio texto-imagen."},
  {q:"¿Qué acción demuestra uso ético de IA?",o:["Copiar la salida sin leerla","Ingresar datos sensibles sin restricción","Verificar información y proteger datos","Ocultar que se usó IA cuando se pide explicarlo"],a:2,e:"El uso responsable incluye revisión humana, veracidad y protección de información."},
  {q:"¿Qué mejora un prompt dirigido a Copilot?",o:["Ser ambiguo y muy corto siempre","Dar contexto: objetivo, audiencia, tono y formato","Pedir muchas tareas contradictorias","No indicar ninguna restricción"],a:1,e:"Un prompt con contexto y criterios claros produce propuestas más útiles."},
  {q:"¿Qué debe hacer el estudiante con las sugerencias de IA?",o:["Aceptar todo automáticamente","Revisarlas, editarlas y conservar solo lo pertinente y verificable","Eliminar cualquier aporte de IA","Usarlas sin contrastar"],a:1,e:"La sesión enfatiza la revisión y edición crítica de las sugerencias generadas."},
  {q:"En una presentación profesional, una diapositiva debería…",o:["Concentrar todas las ideas posibles","Comunicar una idea principal con claridad","Usar cinco estilos visuales diferentes","Evitar cualquier imagen"],a:1,e:"Una idea principal por diapositiva favorece claridad y jerarquía."},
  {q:"¿Qué se debe distinguir al explicar el proceso con Copilot?",o:["Aportes propios y aportes generados por IA","Solo colores cálidos y fríos","Archivos locales y remotos","Teclas y mouse"],a:0,e:"La rúbrica pide justificar mejoras y distinguir aportes propios de los generados por IA."},
  {q:"¿Qué acción corresponde al cierre de la actividad?",o:["Ignorar la retroalimentación","Revisar la versión final, reflexionar sobre el uso responsable y entregar","Borrar el archivo final","Crear otro tema distinto"],a:1,e:"El cierre contempla retroalimentación, ajustes, revisión final y entrega."}
];
function buildQuiz(){
  const form=$("#quizForm");form.innerHTML="";
  questions.forEach((q,i)=>{
    const art=document.createElement("article");art.className="question-card";art.dataset.i=i;
    art.innerHTML=`<h4><span>${String(i+1).padStart(2,"0")}.</span> ${q.q}</h4><div class="options">${q.o.map((opt,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}"><span>${opt}</span></label>`).join("")}</div><p class="explain">${q.e}</p>`;form.appendChild(art);
  });
}
function gradeQuiz(){
  let answered=0,score=0;
  $$(".question-card").forEach((card,i)=>{
    card.classList.add("graded");const chosen=$(`input[name="q${i}"]:checked`);if(chosen)answered++;
    $$(".option",card).forEach((lab,j)=>{lab.classList.remove("correct","incorrect");if(j===questions[i].a)lab.classList.add("correct");if(chosen&&j===+chosen.value&&j!==questions[i].a)lab.classList.add("incorrect")});
    if(chosen&&+chosen.value===questions[i].a)score++;
  });
  if(answered<questions.length){$("#quizResult").className="quiz-result warn";$("#quizResult").textContent=`Respondiste ${answered}/10. Completa todas las preguntas antes de cerrar el cuestionario.`;return}
  state.quizScore=score;
  if(score>=8){state.completed.quiz=true;save();updateUI();$("#quizResult").className="quiz-result success";$("#quizResult").textContent=`Resultado: ${score}/10. ¡Cuestionario superado! ✓`;toast("🎉 Cuestionario superado.")}
  else{$("#quizResult").className="quiz-result warn";$("#quizResult").textContent=`Resultado: ${score}/10. Revisa las explicaciones y vuelve a intentar. Meta: 8/10.`;toast("Revisa las respuestas y vuelve a intentarlo.","warn")}
}
$("#submitQuiz").addEventListener("click",gradeQuiz);$("#resetQuiz").addEventListener("click",()=>{buildQuiz();$("#quizResult").textContent="";$("#quizResult").className="quiz-result"});buildQuiz();

// Diploma PDF generated locally from canvas (no external library)
function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight){
  const words=text.split(" ");let line="",lines=[];
  words.forEach(w=>{const test=line?line+" "+w:w;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=w}else line=test});if(line)lines.push(line);
  lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));return y+lines.length*lineHeight;
}
function dataUrlToBytes(url){const bin=atob(url.split(",")[1]),arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return arr}
function asciiBytes(s){return new TextEncoder().encode(s)}
function concatBytes(parts){let len=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(len),off=0;for(const p of parts){out.set(p,off);off+=p.length}return out}
function jpegPdf(jpegBytes,w,h){
  const objs=[],offsets=[0];let current=0;
  const add=(...parts)=>{const b=concatBytes(parts.map(p=>typeof p==="string"?asciiBytes(p):p));objs.push(b)};
  add("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  add("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
  add("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n");
  add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,jpegBytes,"\nendstream\nendobj\n");
  const content="q 842 0 0 595 0 0 cm /Im0 Do Q";
  add(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
  const header=asciiBytes("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");current=header.length;
  objs.forEach(o=>{offsets.push(current);current+=o.length});
  const xrefStart=current;let xref=`xref\n0 6\n0000000000 65535 f \n`;for(let i=1;i<=5;i++)xref+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
  const trailer=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new Blob([concatBytes([header,...objs,asciiBytes(xref+trailer)])],{type:"application/pdf"});
}
async function generateDiplomaPDF(){
  if(!isAllDone())return;
  const canvas=document.createElement("canvas");canvas.width=1400;canvas.height=990;const ctx=canvas.getContext("2d");
  ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="#d24726";ctx.lineWidth=18;ctx.strokeRect(28,28,1344,934);ctx.strokeStyle="#ff1151";ctx.lineWidth=3;ctx.strokeRect(48,48,1304,894);
  const img=new Image();img.src="assets/sise-logo.png";await new Promise(res=>{img.onload=res;img.onerror=res});if(img.complete&&img.naturalWidth)ctx.drawImage(img,90,75,190,120);
  ctx.fillStyle="#d24726";ctx.textAlign="right";ctx.font="700 22px Arial";ctx.fillText("POWERPOINT IA LAB",1310,120);
  ctx.textAlign="center";ctx.fillStyle="#d24726";ctx.font="700 18px Arial";ctx.fillText("DIPLOMA DE FINALIZACION",700,250);
  ctx.fillStyle="#171820";ctx.font="700 54px Arial";ctx.fillText("Reconocimiento de aprendizaje",700,330);
  ctx.fillStyle="#686b74";ctx.font="28px Arial";ctx.fillText("Se otorga el presente diploma a",700,405);
  ctx.fillStyle="#d24726";ctx.font="700 56px Arial";wrapCanvasText(ctx,state.user.name,700,485,1100,62);
  ctx.fillStyle="#686b74";ctx.font="24px Arial";ctx.fillText(state.user.email,700,555);
  ctx.fillText("por completar satisfactoriamente la experiencia educativa",700,625);
  ctx.fillStyle="#171820";ctx.font="700 34px Arial";ctx.fillText("Microsoft PowerPoint con IA (Copilot)",700,700);
  ctx.fillStyle="#686b74";ctx.font="23px Arial";ctx.fillText("Storytelling · Diseño profesional · Uso ético y responsable de IA",700,752);
  ctx.strokeStyle="#e0e0e5";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(130,820);ctx.lineTo(1270,820);ctx.stroke();
  const d=new Date().toLocaleDateString("es-PE",{year:"numeric",month:"long",day:"numeric"});
  ctx.textAlign="left";ctx.font="20px Arial";ctx.fillStyle="#555861";ctx.fillText(d,130,875);
  ctx.textAlign="right";ctx.fillText("SISE · Taller de Informatica para la Empleabilidad",1270,875);
  const jpeg=dataUrlToBytes(canvas.toDataURL("image/jpeg",.94)),blob=jpegPdf(jpeg,canvas.width,canvas.height),a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download=`Diploma_SISE_${state.user.name.replace(/\s+/g,"_")}.pdf`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast("Diploma PDF generado correctamente.");
}
$("#downloadDiploma").addEventListener("click",generateDiplomaPDF);$("#printDiploma").addEventListener("click",()=>window.print());

// Auto resume last user on this device
const lastKeys=Object.keys(localStorage).filter(k=>k.startsWith(STORAGE_PREFIX));
if(lastKeys.length){
  try{const last=JSON.parse(localStorage.getItem(lastKeys[lastKeys.length-1]));if(last?.user){$("#studentName").value=last.user.name;$("#studentEmail").value=last.user.email}}catch(e){}
}
initHeroGallery();
initLightbox();
initWelcomeCollage();
initWelcomeBgSlider();
updateUI();
})();
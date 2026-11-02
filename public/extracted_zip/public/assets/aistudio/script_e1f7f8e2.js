const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav-links');
if(menuBtn){menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();

// Kellem AI — a functional browser-based school learning assistant.
const chat=document.getElementById('chat-messages');
const form=document.getElementById('chucha-form');
const input=document.getElementById('chucha-input');
const title=document.getElementById('chat-title');
let mode='study';
const modeTitles={study:'Study Help',english:'English Practice',entrance:'Win Entrance',skills:'Learn Skills',teacher:'Teacher Insights'};
const englishPhrases=[
  ['How’s your day going?','It’s going well, thank you!','Use it to ask politely about someone’s day.'],
  ['How’s your week been?','Pretty good, thanks. I’ve been studying a lot.','Use it when you meet someone during the week.'],
  ['What are you working on?','I’m preparing for my entrance exam.','Use it to ask about someone’s current work or study.'],
  ['Could you explain that again?','Sure. Let me explain it in a simpler way.','Use it when you need someone to repeat an explanation.'],
  ['What do you think?','I think it is a good idea because it can help students learn.','Use it to ask for an opinion.'],
  ['Could you help me, please?','Of course. What do you need help with?','A polite way to ask for help.'],
  ['I don’t understand yet.','No problem. Let’s go step by step.','Use it when a lesson is still difficult.'],
  ['That makes sense.','Great! I’m glad it is clear now.','Use it when you understand an explanation.'],
  ['What did you learn today?','I learned a new English phrase.','Use it to talk about daily learning.'],
  ['Can we practice together?','Yes! Let’s practice for five minutes.','Use it to start a speaking practice.'],
  ['Please speak slowly.','Sure, I’ll speak more slowly.','Use it when English is difficult to follow.'],
  ['How do you pronounce this word?','It is pronounced like this: ...','Use it when learning pronunciation.'],
  ['What does this word mean?','It means ...','Use it when learning new vocabulary.'],
  ['I agree with you.','Thanks! I’m happy we agree.','Use it to show agreement.'],
  ['I’m not sure.','That’s okay. Let’s find the answer together.','Use it when you do not know the answer.'],
  ['Let’s start.','Yes, I’m ready!','Use it to begin a lesson or activity.'],
  ['See you tomorrow.','See you! Have a great day.','Use it when saying goodbye until tomorrow.'],
  ['Good morning!','Good morning! How are you?','A friendly morning greeting.'],
  ['Have a nice day.','Thank you. You too!','A polite way to wish someone well.'],
  ['What is your goal?','My goal is to improve my English.','Use it to talk about goals.'],
  ['I’m ready to learn.','Excellent! Let’s begin.','Use it to show readiness.'],
  ['Can you give me an example?','Sure. Here is a simple example.','Use it when you need a practical example.'],
  ['Let me try.','Go ahead. Take your time.','Use it before attempting a task.'],
  ['I made a mistake.','That’s okay. Mistakes help us learn.','Use it when correcting yourself.'],
  ['I understand now.','Excellent! Keep practicing.','Use it after understanding a lesson.'],
  ['What should I study today?','Choose one topic and practice it deeply.','Use it when planning your daily study.'],
  ['Can you check my answer?','Yes. Send me your answer and I’ll explain it.','Use it when asking for feedback.'],
  ['I need more practice.','Good idea. Practice makes you more confident.','Use it when you want extra practice.'],
  ['Let’s learn something new.','Great! What topic should we choose?','Use it to start a new learning activity.'],
  ['Well done!','Thank you! I’ll keep improving.','Use it to praise someone or respond to praise.']
];
function getDailyPhrase(){ return englishPhrases[new Date().getDate()%englishPhrases.length]; }
const daily=getDailyPhrase();
const phraseText=document.getElementById('phrase-text');
const phraseMeaning=document.getElementById('phrase-meaning');
const phraseExample=document.getElementById('phrase-example');
if(phraseText){ phraseText.textContent=daily[0]; phraseMeaning.textContent='Meaning: '+daily[2]; phraseExample.textContent='Example: “'+daily[0]+'” — “'+daily[1]+'”'; }
function addMessage(text,who='ai'){
  const el=document.createElement('div'); el.className=`message ${who}`;
  el.innerHTML=`<div class="msg-avatar">${who==='ai'?'🤖':'👤'}</div><div><b>${who==='ai'?'Kellem AI':'You'}</b><p></p></div>`;
  el.querySelector('p').textContent=text; chat.appendChild(el); chat.scrollTop=chat.scrollHeight;
}
function answer(q){
  const t=q.toLowerCase();
  if(mode==='english' || /english|speak|phrase|grammar|vocabulary|conversation/.test(t)){
    if(/practice|speak|conversation/.test(t)) return 'Let’s practice. Say: “I am preparing for my exam because I want to build a better future.” Now write your own sentence and I will help correct it.';
    if(/grammar/.test(t)) return 'Quick lesson: “Advice” is a noun (My teacher gave me advice). “Advise” is a verb (My teacher advised me to study).';
    const p=getDailyPhrase(); return `Today’s phrase: ${p[0]}\nNatural reply: ${p[1]}\nTip: ${p[2]}\n\nTry making your own reply.`;
  }
  if(mode==='entrance' || /entrance|exam|revision|question|quiz|test/.test(t)) return 'Entrance mode: focus on understanding first, then practice. Try this: 1) Choose one topic. 2) Study for 25 minutes. 3) Answer 5 questions without notes. 4) Review every mistake. 5) Repeat tomorrow.';
  if(mode==='skills' || /skill|coding|program|arduino|computer|technology/.test(t)) return 'Skill path: choose one useful skill, learn one small concept, build a tiny project, test it, and explain what you built. Consistent practice is more important than trying to learn everything at once.';
  if(mode==='teacher' || /student|teacher|progress|best student|performance/.test(t)) return 'Teacher insight: use quiz scores, assignment completion, improvement over time and classroom participation as evidence. Kellem AI can organize these signals, but teachers should make the final decisions and consider the whole student.';
  if(/math|equation|calculate|physics|chemistry|biology|history|geography/.test(t)) return 'I can help you study this. Send the exact question or lesson, and I will break it into simple steps, explain the idea, then give you a short practice question.';
  if(/hello|hi|hey|akkam/.test(t)) return 'Hello! 👋 I’m Kellem AI. What would you like to learn today?';
  return 'Good question. Let’s learn it step by step. Tell me the subject and the exact topic or question, and I’ll explain it simply, give an example, and then test your understanding.';
}
if(form){form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;addMessage(q,'user');input.value='';setTimeout(()=>addMessage(answer(q)),280);});}
document.querySelectorAll('.topic-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.topic-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');mode=btn.dataset.topic;title.textContent=modeTitles[mode];addMessage(`Switched to ${modeTitles[mode]}. What would you like to learn?`);}));
document.querySelectorAll('.quick-prompts button').forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.dataset.prompt;form.requestSubmit();}));
const speakBtn=document.getElementById('speak-btn');
if(speakBtn){speakBtn.addEventListener('click',()=>{const p=getDailyPhrase();const text=`${p[0]}. Natural reply: ${p[1]}`;if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';speechSynthesis.speak(u);speakBtn.textContent='🔊 Playing...';u.onend=()=>speakBtn.textContent="🔊 Hear today's phrase";}else{alert(text);}})}

// V10 Student Portal — login/signup + all-student data + best-points ranking.
const defaultStudents = [
  {name:'Bilisummaa Yaadasaa', className:'Natural Science', points:98},
  {name:'Raajii Amanu\'e', className:'Natural Science', points:96},
  {name:'Feeneet Yooseef', className:'Natural Science', points:94},
  {name:'Israel Kassahuun', className:'Natural Science', points:91},
  {name:'Guutuu Aboomaa', className:'Natural Science', points:89},
  {name:'Taliilaa Jaallataa', className:'Natural Science', points:87},
  {name:'Atinaboon Rattaa', className:'Natural Science', points:85},
  {name:'Feeneet Gaaromaa', className:'Natural Science', points:84},
  {name:'Nabiyyuu Sulxaan', className:'Natural Science', points:82},
  {name:'Toleeraa Tatikuu', className:'Natural Science', points:80},
  {name:'Lammii Xilahuun', className:'Natural Science', points:78},
  {name:'Gammachuu Takkaa', className:'Natural Science', points:76},
  {name:'Fatiyaa Yaasiin', className:'Natural Science', points:74},
  {name:'Siifan Efreem', className:'Natural Science', points:72},
  {name:'Eebbisa Beekaa', className:'Social Science', points:90},
  {name:'Caaltuu Kennaa', className:'Social Science', points:88}
];
function getStudents(){try{const saved=JSON.parse(localStorage.getItem('kellemStudents')||'null');return Array.isArray(saved)?saved:defaultStudents.map(s=>({...s}));}catch(e){return defaultStudents.map(s=>({...s}));}}
function saveStudents(list){localStorage.setItem('kellemStudents',JSON.stringify(list));}
function sortedStudents(){return getStudents().sort((a,b)=>Number(b.points||0)-Number(a.points||0));}
function renderStudents(){
  const list=sortedStudents(), total=document.getElementById('total-students'), best=document.getElementById('best-student'), bp=document.getElementById('best-points'), tbody=document.getElementById('student-list'), names=document.getElementById('student-name-buttons');
  if(!tbody)return;
  total.textContent=list.length; best.textContent=list[0]?.name||'No students yet'; bp.textContent=list[0]?Number(list[0].points||0):0;
  const dt=document.getElementById('dash-total'),db=document.getElementById('dash-best'),dbp=document.getElementById('dash-best-points');if(dt)dt.textContent=list.length;if(db)db.textContent=list[0]?.name||'No students yet';if(dbp)dbp.textContent=list[0]?`⭐ ${Number(list[0].points||0)} points`:'';
  tbody.innerHTML=list.map((s,i)=>`<tr><td>${i+1}</td><td><b>${escapeHTML(s.name)}</b></td><td>${escapeHTML(s.className||'Student')}</td><td>${Number(s.points)||0}</td><td>${i===0?'🏆 Best Student':'#'+(i+1)}</td></tr>`).join('');
  if(names)names.innerHTML=list.map((s,i)=>`<button type="button" class="student-name-btn ${i===0?'top-student':''}" data-student-index="${i}">${i===0?'🏆 ':''}${escapeHTML(s.name)}<span>${Number(s.points)||0} pts</span></button>`).join('');
}
function escapeHTML(v){const d=document.createElement('div');d.textContent=v??'';return d.innerHTML;}
const modal=document.getElementById('student-modal');
function openStudentModal(){if(!modal)return;modal.classList.add('open');modal.setAttribute('aria-hidden','false');renderStudents();}
function closeStudentModal(){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');}
document.getElementById('open-student-data')?.addEventListener('click',openStudentModal);document.getElementById('close-student-modal')?.addEventListener('click',closeStudentModal);modal?.addEventListener('click',e=>{if(e.target.matches('[data-close-student-modal]'))closeStudentModal();if(e.target.matches('.student-name-btn')){const i=Number(e.target.dataset.studentIndex),list=sortedStudents(),s=list[i];const rank=i+1;document.getElementById('selected-student').innerHTML=`<strong>${escapeHTML(s.name)}</strong><span>Class: ${escapeHTML(s.className||'Student')}</span><span>Points: ⭐ ${Number(s.points)||0}</span><span>Rank: #${rank}${rank===1?' 🏆 Best Student':''}</span>`;}});
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeStudentModal();});
renderStudents();


// Installable mobile app (Progressive Web App)
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(err => console.warn('App offline support could not start:', err)));
}
let kellemInstallPrompt = null;
const installAppButton = document.getElementById('install-app');
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  kellemInstallPrompt = event;
  if (installAppButton) installAppButton.hidden = false;
});
installAppButton?.addEventListener('click', async () => {
  if (!kellemInstallPrompt) return;
  kellemInstallPrompt.prompt();
  await kellemInstallPrompt.userChoice;
  kellemInstallPrompt = null;
  installAppButton.hidden = true;
});
window.addEventListener('appinstalled', () => {
  if (installAppButton) installAppButton.hidden = true;
  kellemInstallPrompt = null;
});

// Bottom navigation — highlight the button for the section in view.
const bottomLinks=[...document.querySelectorAll('.bottom-nav a')];
if('IntersectionObserver' in window&&bottomLinks.length){
  const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)bottomLinks.forEach(a=>a.classList.toggle('active',a.dataset.nav===entry.target.id));});},{rootMargin:'-45% 0px -50% 0px'});
  bottomLinks.forEach(a=>{const section=document.getElementById(a.dataset.nav);if(section)navObserver.observe(section);});
}

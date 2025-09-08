// ====== 設定 ======
function initLang(){
const sel = document.getElementById('langSelect');
const current = localStorage.getItem('who_lang') || guessLang();
if(sel){
sel.innerHTML = Object.entries(LANGS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
sel.value = current;
sel.onchange = () => { localStorage.setItem('who_lang', sel.value); applyI18n(); };
}
localStorage.setItem('who_lang', current);
applyI18n();
}


function guessLang(){
const n = (navigator.language||'ja').slice(0,2);
return LANGS[n] ? n : 'ja';
}


function getLang(){ return localStorage.getItem('who_lang') || 'ja'; }


function getText(key){
const L = I18N[getLang()]||I18N.ja;
return L[key] || I18N.ja[key] || key;
}


function applyI18n(){
const L = I18N[getLang()]||I18N.ja;
document.querySelectorAll('[data-i18n]').forEach(el=>{
const k = el.getAttribute('data-i18n');
if(L[k]) el.textContent = L[k];
});
document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
const k = el.getAttribute('data-i18n-ph');
if(L[k]) el.setAttribute('placeholder', L[k]);
});
document.querySelectorAll('[data-i18n-html]').forEach(el=>{
const k = el.getAttribute('data-i18n-html');
if(L[k]) el.innerHTML = L[k];
});
}


// ====== トースト ======
let toastTimer=null;
function toast(msg){
let t = document.querySelector('.toast');
if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
t.textContent = msg; t.style.opacity='1';
clearTimeout(toastTimer);
toastTimer = setTimeout(()=>{ t.style.opacity='0'; }, 2200);
}


// ====== 会話 API ======
async function talkAPI({message}){
const userName = localStorage.getItem('who_userName') || '';
const charName = localStorage.getItem('who_charName') || '';
const charColor = localStorage.getItem('who_charColor') || '';
const lang = getLang();
const payload = { user: userName, character: { name: charName, color: charColor }, message, lang };
const r = await fetch(TALK_ENDPOINT, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
if(!r.ok) throw new Error('http');
return await r.json();
}


// ====== 最終ページ記憶 ======
(function remember(){
const page = document.body?.dataset?.page;
if(page){
const map = { index:'index.html', about:'about.html', char:'char.html', beach:'beach.html', night:'night.html' };
if(map[page]) localStorage.setItem('who_lastPage', map[page]);
}
})();


// ====== 研究文（哲学トーン） ======
I18N.ja.about_body = `<strong>WHO VQ</strong> は、ユーザーが小さな存在をお世話しながら、\n「なぜ世話をするのか」「なぜ愛おしいのか」という問いに触れるための\n哲学的な実験場です。\n\n砂浜で拾う貝は関わりの痕跡であり、夜の会話はその痕跡を言葉に変える時間です。\nあなたのお世話が、誰かの世界になる——その手応えを味わってください。`;
I18N.zh.about_body = `<strong>WHO VQ</strong> 是一个哲学性的小实验场，\n通过照料一个小小的存在，去触碰“为何照料”“为何可爱”的提问。`;
I18N.ko.about_body = `<strong>WHO VQ</strong> 는 작은 존재를 돌보며 \n“왜 돌보는가”“왜 사랑스러운가”라는 물음을 만나는 철학적 실험실입니다.`;

const TALK_ENDPOINT = window.TALK_ENDPOINT || (window.location.origin + "/api/talk");
const I18N = {
ja: {
start:"スタート", continue:"続きから", about:"研究について",
char_title:"キャラを選ぶ", no_name:"名前を付けない", next:"次へ", pick_char_first:"先にキャラを選んでください",
to_night:"夜の会話へ", to_beach:"砂浜へ", collected:"集めた貝", tap_to_collect:"クリックで貝を集めよう",
say_something:"一日のふりかえりを書いてね（Enterで送信）", send:"送信", api_error:"通信で問題が発生しました", empty_reply:"..."
},
zh: {
start:"开始", continue:"继续", about:"研究说明",
char_title:"选择角色", no_name:"不命名", next:"下一步", pick_char_first:"请先选择角色",
to_night:"前往夜晚对话", to_beach:"返回沙滩", collected:"已收集", tap_to_collect:"点击收集贝壳",
say_something:"写下今天的反思（回车发送）", send:"发送", api_error:"网络错误", empty_reply:"..."
},
ko: {
start:"시작", continue:"이어하기", about:"연구 소개",
char_title:"캐릭터 선택", no_name:"이름 없음", next:"다음", pick_char_first:"먼저 캐릭터를 고르세요",
to_night:"밤의 대화로", to_beach:"해변으로", collected:"수집", tap_to_collect:"클릭하여 조개 모으기",
say_something:"오늘의 성찰을 적어 주세요 (Enter)", send:"보내기", api_error:"네트워크 오류", empty_reply:"..."
}
};


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

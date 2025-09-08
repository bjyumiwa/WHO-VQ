// ==========================
// WHO-VQ 共通スクリプト（多言語＆会話APIラッパ）
// ==========================

// 1) 必ず最初に定義（ここが無いと I18N / LANGS 未定義になる）
const TALK_ENDPOINT = window.TALK_ENDPOINT || (window.location.origin + "/api/talk");

// サポート言語
const LANGS = { ja: "日本語", zh: "中文", ko: "한국어" };

// 多言語辞書
const I18N = {
  ja: {
    // 共通UI
    start:"スタート", continue:"続きから", about:"研究について", back:"戻る",
    about_title:"研究について", howto_title:"ゲームの流れ",
    howto_1:"キャラを選ぶ（名前は任意）",
    howto_2:"砂浜で貝を集める（存在の痕跡を残す）",
    howto_3:"夜の会話でふりかえり（お世話の意味を考える）",

    // キャラ選択
    char_title:"キャラを選ぶ", no_name:"名前を付けない", next:"次へ",
    pick_char_first:"先にキャラを選んでください",

    // 砂浜
    to_night:"夜の会話へ", to_beach:"砂浜へ", collected:"集めた貝",
    tap_to_collect:"キャンバスをクリックして貝を集めよう",
    remaining:"残り時間", start_game:"開始", running:"進行中…",
    time_up:"時間切れ", retry:"もう一度", score:"スコア",

    // 夜の会話
    say_something:"一日のふりかえりを書いてね（Enterで送信）",
    send:"送信", api_error:"通信で問題が発生しました", empty_reply:"...",

    // 貝の名前
    shell_asari:"アサリ", shell_hama:"ハマグリ", shell_pearl:"真珠", shell_rare:"青い貝",

    // サマリー＆問い
    today_summary:"今日の足あと",
    no_summary:"今日はまだ貝が記録されていません。砂浜で採ってみよう。",
    p1:"なぜ助けたいと思った？",
    p2:"どんなうれしさがあった？",
    p3:"この関わりは誰のため？",
  },
  zh: {
    start:"开始", continue:"继续", about:"研究说明", back:"返回",
    about_title:"关于研究", howto_title:"玩法",
    howto_1:"选择角色（可不命名）",
    howto_2:"在沙滩上收集贝壳（留下存在的痕迹）",
    howto_3:"在夜谈中回望（思考照料的意义）",

    char_title:"选择角色", no_name:"不命名", next:"下一步",
    pick_char_first:"请先选择角色",

    to_night:"前往夜晚对话", to_beach:"返回沙滩", collected:"已收集",
    tap_to_collect:"点击画布收集贝壳",
    remaining:"剩余时间", start_game:"开始", running:"进行中…",
    time_up:"时间到", retry:"再来一次", score:"分数",

    say_something:"写下你的回望（回车发送）", send:"发送",
    api_error:"网络错误", empty_reply:"...",

    shell_asari:"蚬子", shell_hama:"蛤蜊", shell_pearl:"珍珠", shell_rare:"蓝色贝",

    today_summary:"今日足迹",
    no_summary:"今天还没有记录，去沙滩试试吧。",
    p1:"为什么想要帮助？", p2:"有什么喜悦？", p3:"这份关系是为了谁？",
  },
  ko: {
    start:"시작", continue:"이어하기", about:"연구 소개", back:"뒤로",
    about_title:"연구 소개", howto_title:"플레이 방법",
    howto_1:"캐릭터 선택 (이름 선택)",
    howto_2:"해변에서 조개를 모으기 (존재의 흔적 남기기)",
    howto_3:"밤의 대화에서 돌아보기 (돌봄의 의미 생각하기)",

    char_title:"캐릭터 선택", no_name:"이름 없음", next:"다음",
    pick_char_first:"먼저 캐릭터를 고르세요",

    to_night:"밤의 대화로", to_beach:"해변으로", collected:"수집",
    tap_to_collect:"캔버스를 눌러 조개를 모으기",
    remaining:"남은 시간", start_game:"시작", running:"진행 중…",
    time_up:"시간 종료", retry:"다시", score:"점수",

    say_something:"오늘을 적어 주세요 (Enter)", send:"보내기",
    api_error:"네트워크 오류", empty_reply:"...",

    shell_asari:"바지락", shell_hama:"대합", shell_pearl:"진주", shell_rare:"푸른 조개",

    today_summary:"오늘의 발자국",
    no_summary:"아직 기록이 없어요. 해변에서 시도해 보세요.",
    p1:"왜 돕고 싶었을까?", p2:"어떤 기쁨이 있었나?", p3:"이 관계는 누구를 위한 걸까?",
  }
};

// 研究本文（日本語中心、他言語は短文）
I18N.ja.about_body = `<strong>WHO VQ</strong> は、ユーザーが小さな存在をお世話しながら、
「なぜ世話をするのか」「なぜ愛おしいのか」という問いに触れるための
哲学的な実験場です。

砂浜で拾う貝は関わりの痕跡であり、夜の会話はその痕跡を言葉に変える時間です。
あなたのお世話が、誰かの世界になる——その手応えを味わってください。`;
I18N.zh.about_body = `<strong>WHO VQ</strong> 是一个哲学性的小实验场，通过照料一个小小的存在，去触碰“为何照料”“为何可爱”的提问。`;
I18N.ko.about_body = `<strong>WHO VQ</strong> 는 작은 존재를 돌보며 “왜 돌보는가”“왜 사랑스러운가”라는 물음을 만나는 철학적 실험실입니다.`;


// ==========================
// 多言語：初期化＆適用
// ==========================
function initLang(){
  const sel = document.getElementById('langSelect');
  const current = localStorage.getItem('who_lang') || guessLang();
  if(sel){
    sel.innerHTML = Object.entries(LANGS)
      .map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
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

// ==========================
// トースト
// ==========================
let toastTimer=null;
function toast(msg){
  let t = document.querySelector('.toast');
  if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.style.opacity='1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.style.opacity='0'; }, 2200);
}

// ==========================
// 画像フォールバック（404回避用）
// ==========================
function ensureBackground(selector, url){
  const el = document.querySelector(selector);
  if(!el) return;
  const img = new Image();
  img.onload = ()=>{ el.style.backgroundImage = `url('${url}')`; el.classList.remove('fallback'); };
  img.onerror = ()=>{
    // ファイルが無い場合はグラデ背景にフォールバック
    el.style.removeProperty('background-image');
    el.classList.add('fallback');
    console.warn('Fallback background applied:', url);
  };
  img.src = url;
}

// ==========================
// 会話 API
// ==========================
async function talkAPI({message}){
  const userName = localStorage.getItem('who_userName') || '';
  const charName = localStorage.getItem('who_charName') || '';
  const charColor = localStorage.getItem('who_charColor') || '';
  const lang = getLang();
  const payload = { user: userName, character: { name: charName, color: charColor }, message, lang };
  const r = await fetch(TALK_ENDPOINT, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  if(!r.ok) throw new Error('http');
  return await r.json(); // {reply: "..."} を想定
}

// ==========================
// 最終ページ記憶（続きから）
// ==========================
(function remember(){
  const page = document.body?.dataset?.page;
  if(page){
    const map = { index:'index.html', about:'about.html', char:'char.html', beach:'beach.html', night:'night.html' };
    if(map[page]) localStorage.setItem('who_lastPage', map[page]);
  }
})();

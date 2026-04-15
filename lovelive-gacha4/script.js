// 1. 全角色聲優精準速查字典
const cvDictionary = {
 // μ's
 "高坂穗乃果": "新田惠海",
 "絢瀨繪里": "南條愛乃",
 "南小鳥": "內田彩",
 "園田海未": "三森鈴子",
 "星空凜": "飯田里穗",
 "西木野真姬": "Pile",
 "東條希": "楠田亞衣奈",
 "小泉花陽": "久保由利香",
 "矢澤妮可": "德井青空",
 // Aqours
 "高海千歌": "伊波杏樹",
 "櫻內梨子": "逢田梨香子",
 "松浦果南": "諏訪奈奈香",
 "黑澤黛雅": "小宮有紗",
 "渡邊曜": "齊藤朱夏",
 "津島善子": "小林愛香",
 "國木田花丸": "高槻加奈子",
 "小原鞠莉": "鈴木愛奈",
 "黑澤露比": "降幡愛",
 // 虹咲
 "上原步梦": "大西亞玖璃",
 "中须霞": "相良茉優",
 "优木雪菜": "林鼓子 / 楠木燈",
 "天王寺璃奈": "田中千惠美",
 "樱坂雫": "前田佳織里",
 "朝香果林": "久保田未夢",
 "宫下爱": "村上奈津實",
 "近江彼方": "鬼頭明里",
 "艾玛·薇德": "指出毬亞",
 "三船栞子": "小泉萌香",
 "米雅·泰勒": "內田秀",
 "钟岚珠": "法元明菜",
 // Liella!
 "涩谷香音": "伊達小百合",
 "唐可可": "Liyuu",
 "岚千砂都": "岬奈子",
 "平安名堇": "Naomi Payton",
 "叶月恋": "青山渚",
 "樱小路希奈子": "鈴原希實",
 "米田芽衣": "藪島朱音",
 "若菜四季": "大熊和奏",
 "鬼塚夏美": "繪森彩",
 "薇恩·玛格丽特": "結那",
 "鬼塚冬毬": "坂倉花"
};

// 2. 抽卡模擬邏輯
function drawCardPro() {
 const cn = document.getElementById('user-cn').value;
 if (!cn) { alert("請輸入您的稱呼！"); return; }

 const char = characters[Math.floor(Math.random() * characters.length)];
 const rarity = rarities[Math.floor(Math.random() * rarities.length)];

 setTimeout(() => { renderResultPro(cn, char, rarity); }, 500);
 switchPage('result-page');
}

// 3. UI 渲染邏輯
function renderResultPro(cn, char, rarity) {
 document.getElementById('user-display-name').innerText = cn;

 // === 稀有度色彩 ===
 const rarityMap = { "SSR": "#f39c12", "SR": "#9b59b6", "R": "#3498db" };
 const rarityColor = rarityMap[rarity] || "#f39c12";
 const rarityEl = document.getElementById('card-rarity');
 const bannerEl = document.getElementById('rarity-style');
 let rarityText = rarity === "SSR" ? "神級角色" : (rarity === "SR" ? "精英角色" : "稀有角色");
 rarityEl.innerText = `${rarity} · ${rarityText}`;
 bannerEl.style.backgroundColor = rarityColor;
 bannerEl.style.boxShadow = `0 4px 15px ${rarityColor}66`;

 // === 團體色彩（先定義，再套用）===
 const groupColorMap = {
  "μ's": "#e91e63",
  "Aqours": "#009fe8",
  "虹咲學園": "#f39c12",
  "Liella!": "#9b59b6"
 };
 let groupColor = "#ff758c";
 if (char.group.includes("μ's")) groupColor = groupColorMap["μ's"];
 else if (char.group.includes("Aqours")) groupColor = groupColorMap["Aqours"];
 else if (char.group.includes("虹咲")) groupColor = groupColorMap["虹咲學園"];
 else if (char.group.includes("Liella")) groupColor = groupColorMap["Liella!"];

 // === 套用卡片與頭框樣式 ===
 const mainCard = document.querySelector('.main-card');
 if (char.group.includes('虹咲')) {
  mainCard.classList.add('rainbow');
 } else {
  mainCard.classList.remove('rainbow');
  mainCard.style.borderColor = groupColor;
  mainCard.style.boxShadow = `inset 0 0 30px ${groupColor}15, 0 10px 40px ${groupColor}22`;
 }
 document.getElementById('group-tag').style.backgroundColor = groupColor;
 document.querySelector('.quote-line').style.borderLeftColor = groupColor;
 document.querySelectorAll('.section-label').forEach(el => {
  el.style.color = groupColor;
 });

 // === 填充核心文本 ===
 document.getElementById('card-name').innerText = char.name;
 document.getElementById('card-name-jp').innerText = char.nameJp || "Secret";
 document.getElementById('card-cv').innerText = cvDictionary[char.name] || "官方資料";
 document.getElementById('group-tag').innerText = char.group;
 document.getElementById('subunit-tag').innerText = char.subUnit || "Solo";
 document.getElementById('card-song').innerText = char.mainSong ? char.mainSong.split('/')[0] : "未知";
 document.getElementById('card-quote').innerText = char.quote || "...";
 document.getElementById('card-personality').innerText = char.personality;
 document.getElementById('card-hotstory').innerText = char.hotStory;
 document.getElementById('card-trivia').innerText = char.trivia;

 // === 處理圖片預留位 ===
 const imgEl = document.getElementById('card-image');
 const placeholderEl = document.getElementById('art-placeholder');
 if (char.image) {
  imgEl.src = char.image; imgEl.style.display = 'block'; placeholderEl.style.display = 'none';
 } else {
  imgEl.style.display = 'none'; placeholderEl.style.display = 'block';
  placeholderEl.style.color = rarityColor;
 }
}

// 4. 頁面導航
function switchPage(pageId) {
 document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
 document.getElementById(pageId).classList.add('active');
}

// 5. 返回首頁
function backToHomePro() {
 switchPage('home-page');
 initCards();
}

// 6. 初始化
function initCards() {
 document.getElementById('card-name').innerText = '';
 document.getElementById('card-name-jp').innerText = '';
 document.getElementById('card-cv').innerText = '';
 document.getElementById('card-rarity').innerText = '';
 document.getElementById('card-song').innerText = '';
 document.getElementById('card-quote').innerText = '';
 document.getElementById('card-personality').innerText = '';
 document.getElementById('card-hotstory').innerText = '';
 document.getElementById('card-trivia').innerText = '';
 document.getElementById('card-image').src = '';
 document.getElementById('card-image').style.display = 'none';
 document.getElementById('art-placeholder').style.display = 'flex';
 document.getElementById('group-tag').innerText = '';
 document.getElementById('subunit-tag').innerText = '';
}
document.addEventListener('DOMContentLoaded', initCards);

// 7. 背景音樂
let musicPlaying = false;
function toggleMusic() {
 const bgm = document.getElementById('bgm');
 if (!bgm) return;
 if (musicPlaying) { bgm.pause(); musicPlaying = false; }
 else { bgm.play().catch(() => {}); musicPlaying = true; }
}

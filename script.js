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
 "高咲侑": "矢野妃菜喜",
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

// === 角色应援色字典 ===
const charColors = {
 // μ's
 "高坂穗乃果": "#F38500", "絢瀨繪里": "#7AEEFF", "南小鳥": "#CEBFBF",
 "園田海未": "#1769FF", "星空凜": "#FFF832", "西木野真姬": "#FF503E",
 "東條希": "#C455F6", "小泉花陽": "#6AE673", "矢澤妮可": "#FF4F91",
 // Aqours
 "高海千歌": "#F08300", "櫻內梨子": "#FF7A8E", "松浦果南": "#1BA98C",
 "黑澤黛雅": "#E40011", "渡邊曜": "#26B7E1", "津島善子": "#898989",
 "國木田花丸": "#E3CB0B", "小原鞠莉": "#C64DA5", "黑澤露比": "#EE5985",
 // 虹咲
 "上原步梦": "#ED7D95", "中须霞": "#E7D600", "优木雪菜": "#D81C2F",
 "天王寺璃奈": "#9CA5B9", "宫下爱": "#FF5800", "近江彼方": "#A664A0",
 "艾玛·维尔德": "#84C36E", "朝香果林": "#485EC6", "樱坂雫": "#01B7ED",
 "三船栞子": "#37B484", "钟岚珠": "#F8C8C4", "米雅·泰勒": "#A9A898",
 "高咲侑": "#000000",
 // Liella!
 "涩谷香音": "#FF7F27", "唐可可": "#A0FFF9", "岚千砂都": "#FF6E90",
 "平安名堇": "#74F466", "叶月恋": "#0000A0", "樱小路希奈子": "#FFF442",
 "米女芽衣": "#FF3535", "若菜四季": "#B2FFDD", "鬼塚夏美": "#FF51C4",
 "薇恩·玛格丽特": "#E49DFD", "鬼塚冬毬": "#4CD2E2"
};

// === Audio 全局状态 ===
let currentAudio = null;
let currentAudioBtn = null;
let autoPlayEnabled = false; // 自动播放开关

function toggleAudio() {
  const audioEl = document.getElementById('card-audio');
  const btn = document.getElementById('audio-btn');
  const iconPath = document.getElementById('audio-icon-path');
  
  if (!audioEl.src || audioEl.src === window.location.href) {
    console.log('No audio source set');
    return;
  }
  
  if (currentAudio && currentAudio !== audioEl) {
    currentAudio.pause();
    if (currentAudioBtn) {
      currentAudioBtn.classList.remove('playing');
      // Reset to play icon
      const prevPath = document.querySelector('#' + currentAudioBtn.id + ' path');
      if (prevPath) prevPath.setAttribute('d', 'M8 5v14l11-7z');
    }
  }
  
  if (audioEl.paused) {
    audioEl.play().catch(e => console.log('Play failed:', e));
    btn.classList.add('playing');
    // Change to pause icon
    iconPath.setAttribute('d', 'M6 4h4v16H6zM14 4h4v16h-4z');
    currentAudio = audioEl;
    currentAudioBtn = btn;
  } else {
    audioEl.pause();
    btn.classList.remove('playing');
    // Change back to play icon
    iconPath.setAttribute('d', 'M8 5v14l11-7z');
    currentAudio = null;
    currentAudioBtn = null;
  }
}

function stopAudio() {
  const audioEl = document.getElementById('card-audio');
  const btn = document.getElementById('audio-btn');
  const iconPath = document.getElementById('audio-icon-path');
  if (audioEl) { audioEl.pause(); audioEl.currentTime = 0; }
  if (btn) { btn.classList.remove('playing'); }
  if (iconPath) { iconPath.setAttribute('d', 'M8 5v14l11-7z'); }
  currentAudio = null;
  currentAudioBtn = null;
}

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
 const mainCard = document.querySelector('.char-modal');
 // 高咲侑特殊樣式：使用綠色邊框而非黑色
 if (char.themeColor === "#000000") {
  mainCard.classList.remove('rainbow');
  mainCard.style.borderColor = "#00ff88";
  mainCard.style.boxShadow = "inset 0 0 20px #00ff8833, 0 0 30px #00ff8866, 0 0 50px #00ff8844";
 } else if (char.group.includes('虹咲')) {
  mainCard.classList.add('rainbow');
 } else {
  mainCard.classList.remove('rainbow');
  mainCard.style.borderColor = groupColor;
  mainCard.style.boxShadow = `inset 0 0 30px ${groupColor}15, 0 10px 40px ${groupColor}22`;
 }
 document.getElementById('group-tag').style.backgroundColor = groupColor;
 document.querySelectorAll('.section-title').forEach(el => {
  el.style.color = groupColor;
 });

 // === 填充核心文本 ===
 document.getElementById('card-name').innerText = char.name;
 document.getElementById('card-name-jp').innerText = char.nameJp || "Secret";
 document.getElementById('card-cv').innerText = cvDictionary[char.name] || "官方資料";
 document.getElementById('group-tag').innerText = char.group;
 document.getElementById('subunit-tag').innerText = char.subUnit || "Solo";
 document.getElementById('card-song').innerText = char.mainSong ? char.mainSong.split('/')[0] : "未知";
 
 // === 音频设置 ===
 stopAudio();
 const audioEl = document.getElementById('card-audio');
 const btn = document.getElementById('audio-btn');
 const iconPath = document.getElementById('audio-icon-path');
 btn.classList.remove('playing', 'dark-color');
 iconPath.setAttribute('fill', 'currentColor');
 // 设置应援色到CSS变量
 const color = charColors[char.name] || '#ff4757';
 const modal = document.getElementById('charModal');
 modal.style.setProperty('--theme-color', color);
 // 检查是否为暗色（需要白色glow）
 const isDark = (color === '#000000' || color === '#0000A0' || parseInt(color.slice(1), 16) < 0x404040);
 // 应用到播放按钮
 btn.style.color = color;
 if (isDark) { btn.classList.add('dark-color'); }
 if (char.assets && char.assets.audio) {
   audioEl.src = './audio/' + char.assets.audio + '.mp3';
   if (autoPlayEnabled) {
     audioEl.autoplay = true;
   }
 } else {
   audioEl.src = '';
 }
 document.getElementById('card-quote').innerText = char.quote || "...";
 document.getElementById('card-personality').innerText = char.personality;
 document.getElementById('card-hotstory').innerText = char.hotStory;
 document.getElementById('card-trivia').innerText = char.trivia;

 // === MV 連結 ===
 const mvBox = document.getElementById('card-mv-box');
 const mvLink = document.getElementById('card-mv-link');
 if (char.assets && char.assets.videoUrl) {
  mvBox.style.display = 'block';
  mvLink.href = char.assets.videoUrl;
  // Use mvSong from assets if available, otherwise parse mainSong
  var songName = (char.assets && char.assets.mvSong) ? char.assets.mvSong : (char.mainSong ? char.mainSong.split('/')[0].replace(/[《》]/g, '').trim() : 'MV');
  mvLink.innerText = '▶ ' + songName;
 } else {
  mvBox.style.display = 'none';
 }

 // === 處理圖片預留位 ===
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
 if (pageId === 'gallery-page') renderGallery();
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
 stopAudio();
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
let currentGroup = null;
function toggleMusic() {
 const bgm = document.getElementById('bgm');
 if (!bgm) return;
 if (musicPlaying) { bgm.pause(); musicPlaying = false; }
 else { bgm.play().catch(() => {}); musicPlaying = true; }
}

// 8. 团体音乐播放（点击播放/暂停）
function playGroupMusic(group) {
 var groupMusic = {
   mus: 'https://raw.githubusercontent.com/laohan1126-lang/nijigacha/main/audio/mus_192k.mp3',
   aqours: 'https://raw.githubusercontent.com/laohan1126-lang/nijigacha/main/audio/aqours_192k.mp3',
   nijigasaki: 'https://raw.githubusercontent.com/laohan1126-lang/nijigacha/main/audio/nijigasaki_192k.mp3',
   liella: 'https://raw.githubusercontent.com/laohan1126-lang/nijigacha/main/audio/liella_192k.mp3'
 };
 var src = groupMusic[group];
 if (!src) return;
 var bgm = document.getElementById('bgm');
 if (!bgm) return;
 
 // 如果点击的是同一个团体，切换播放/暂停
 if (currentGroup === group) {
  if (musicPlaying) {
   bgm.pause();
   musicPlaying = false;
  } else {
   bgm.play().catch(function() {});
   musicPlaying = true;
  }
  return;
 }
 
 // 切换到新团体
 currentGroup = group;
 bgm.src = src;
 bgm.play().catch(function() {});
 musicPlaying = true;
}

// 9. 图鉴页面渲染
function renderGallery() {
 var grid = document.getElementById('galleryGrid');
 if (!grid) { console.log('grid not found'); return; }
 if (!characters) { console.log('characters not found'); return; }
 grid.innerHTML = '<div style="color:#fff;padding:20px;">Loading...(' + characters.length + ' chars)</div>';
 console.log('renderGallery called, chars:', characters.length);
 
 // 团体颜色映射
 var groupColorMap = {
   "μ's": "#E4007F",
   "Aqours": "#00AEEF",
   "Liella!": "#9D5BFF"
 };
 
 var html = '';
 characters.forEach(function(char) {
   var imgSrc = char.image || '';
   var imgHtml = imgSrc ? '<img src="' + imgSrc + '" alt="' + char.name + '" style="width:100%;height:100%;object-fit:cover;">' : '<span style="color:#666;">?</span>';
   
   // 根据团体获取颜色样式
   var groupStyle = '';
   var group = char.group || '';
   if (group.indexOf('虹咲') !== -1) {
     groupStyle = 'style="display:inline-block;background:linear-gradient(to right,#FF4500,#FFA500,#FFD700,#32CD32,#1E90FF,#8A2BE2);-webkit-background-clip:text;color:transparent;font-weight:bold;background-size:200% 100%;"';
   } else if (groupColorMap[group]) {
     groupStyle = 'style="color:' + groupColorMap[group] + ';font-weight:bold;"';
   }
   
   html += '<div class="gallery-item"><div class="gallery-avatar">' + imgHtml + '</div><div class="gallery-name">' + char.name + '</div><div class="gallery-group" ' + groupStyle + '>' + char.group + '</div></div>';
 });
 grid.innerHTML = html;
 console.log('renderGallery done, items:', characters.length);
}

document.addEventListener('DOMContentLoaded', function() {
 renderGallery();
});

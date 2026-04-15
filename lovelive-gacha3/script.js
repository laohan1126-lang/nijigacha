// script.js

function showToast(message) {
 const toast = document.getElementById('toast');
 toast.innerText = message;
 toast.classList.add('show');
 setTimeout(() => toast.classList.remove('show'), 2500);
}

function drawCardPro() {
 const cn = document.getElementById('user-cn').value;
 if (!cn) { showToast("⚠️ 製作人，請輸入您的稱呼！"); return; }

 document.getElementById('home-page').classList.remove('active');
 document.getElementById('result-page').classList.add('active');

 const card = document.getElementById('card-3d');
 const backBtn = document.getElementById('btn-back');
 card.classList.remove('is-flipped');
 backBtn.classList.remove('visible');

 const char = characters[Math.floor(Math.random() * characters.length)];
 const rarity = rarities[Math.floor(Math.random() * rarities.length)];

 setTimeout(() => {
 renderResultPro(cn, char, rarity);
 card.classList.add('is-flipped');
 setTimeout(() => { backBtn.classList.add('visible'); }, 800);
 }, 1500);
}

function renderResultPro(cn, char, rarity) {
 const colorMap = { "SSR": "#ffd700", "SR": "#e056fd", "R": "#00a8ff" };
 const rarityColor = colorMap[rarity];

 // 優先使用角色專屬應援色，若無則使用預設粉色
 const charColor = char.themeColor || "#ff758c";

 // 安全讀取擴展資源
 const avatarImg = char.assets?.avatar ? `<img src="${char.assets.avatar}" class="char-avatar" alt="${char.name}">` : '';
 const videoBtn = char.assets?.videoUrl ? `<a href="${char.assets.videoUrl}" target="_blank" class="btn-video" style="background:${charColor};">觀看專屬 MV</a>` : '';

 // 如果該角色有專屬語音/音樂，則自動播放
 if (char.assets?.bgm) {
 const audio = new Audio(char.assets.bgm);
 audio.play().catch(e => console.log("音頻自動播放被瀏覽器攔截", e));
 }

 const content = `
 <div style="text-align: center; margin-bottom: 10px;">
 <span style="background: ${rarityColor}; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: 900;">${rarity}</span>
 </div>

 ${avatarImg}

 <h2 style="margin: 5px 0; font-size: 1.8rem; text-shadow: 0 0 10px ${charColor};">${char.name}</h2>
 <p style="color: #ccc; font-size: 0.85rem; margin-bottom: 15px;">[ ${cn} 的專屬契約 ]</p>

 <div class="stats-grid">
 <div class="stats-item" style="border-color: ${charColor};">
 <small style="color: #aaa;">所屬</small><br>
 <strong>${char.group}</strong>
 </div>
 <div class="stats-item" style="border-color: ${charColor};">
 <small style="color: #aaa;">核心曲</small><br>
 <strong>${char.mainSong.split('/')[0]}</strong>
 </div>
 </div>

 <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; text-align: left; font-size: 0.85rem; margin-top: 10px;">
 <span style="color: ${charColor};">▶ 檔案記錄：</span> ${char.personality}
 </div>

 <div style="margin-top: 15px;">
 ${videoBtn}
 </div>
 `;
 document.getElementById('card-content-pro').innerHTML = content;
}

function backToHomePro() {
 document.getElementById('card-3d').classList.remove('is-flipped');
 setTimeout(() => {
 document.getElementById('result-page').classList.remove('active');
 document.getElementById('home-page').classList.add('active');
 }, 600);
}

// 背景音樂切換
let musicPlaying = false;
function toggleMusic() {
 const bgm = document.getElementById('bgm');
 if (!bgm) return;
 if (musicPlaying) {
 bgm.pause();
 musicPlaying = false;
 } else {
 bgm.play().catch(() => {});
 musicPlaying = true;
 }
}
